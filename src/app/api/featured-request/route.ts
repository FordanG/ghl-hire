import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { CONTACT_EMAIL } from '@/lib/site';

/**
 * Featured listing request (public, no login).
 *
 * Saved as a support ticket so it shows in the admin console even if email
 * fails, then sent to the inquiries inbox with the requester as reply-to.
 * No payment is taken here: the team replies with a Wise payment link.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 254).toLowerCase();
  const company = clean(body.company, 200);
  const job = clean(body.job, 500);
  const startDate = clean(body.startDate, 20);
  const notes = clean(body.notes, 2000);

  if (!name || !email || !company || !job) {
    return NextResponse.json({ error: 'Please fill in your name, email, company and the job.' }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return NextResponse.json({ error: 'Please pick a valid start date.' }, { status: 400 });
  }

  const lines = [
    `From: ${name} <${email}>`,
    `Company: ${company}`,
    `Job: ${job}`,
    `Start date: ${startDate || 'not given'}`,
    '',
    notes || '(no notes)',
  ];

  try {
    const admin = createAdminClient();
    const { data: ticketNumber, error: numberError } = await admin.rpc('generate_ticket_number');
    if (numberError || !ticketNumber) throw numberError || new Error('No ticket number');

    const { error: ticketError } = await admin.from('support_tickets').insert([
      {
        ticket_number: ticketNumber,
        profile_id: null,
        subject: `Featured listing request: ${company}`.slice(0, 300),
        description: lines.join('\n'),
        category: 'billing',
        priority: 'high',
        metadata: {
          source: 'featured_request',
          contact_name: name,
          contact_email: email,
          company,
          job,
          start_date: startDate || null,
        },
      },
    ]);
    if (ticketError) throw ticketError;

    // The request is saved; an email failure is logged, not shown to the visitor.
    try {
      await sendEmail({
        to: process.env.SUPPORT_INBOX_EMAIL || CONTACT_EMAIL,
        replyTo: email,
        subject: `[Featured request] ${company} (${ticketNumber})`,
        html: `<p><strong>Featured listing request</strong> (${escapeHtml(String(ticketNumber))})</p>
<p>${lines.map(escapeHtml).join('<br>')}</p>
<p>Next step: reply with the rate and a Wise payment link, then switch the job to Featured in the admin console.</p>`,
      });
    } catch (emailError) {
      console.error('Featured request email failed:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Featured request failed:', error);
    return NextResponse.json(
      { error: `We could not save your request. Please email ${CONTACT_EMAIL} instead.` },
      { status: 500 }
    );
  }
}
