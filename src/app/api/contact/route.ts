import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';

/**
 * Public contact form endpoint (no authentication required).
 *
 * Persists the message as a support ticket and notifies the support inbox.
 * Unlike /api/support/create-ticket, this accepts anonymous submissions from
 * the public Contact Us page, so the submitter's name/email come from the
 * request body and the ticket is filed with a null profile_id.
 */

// Map the contact form's inquiry types to support_tickets category values
// (see supabase/migrations/009_support_tickets.sql for allowed categories)
const CATEGORY_BY_TYPE: Record<string, string> = {
  general: 'other',
  support: 'technical',
  billing: 'billing',
  partnership: 'other',
  feedback: 'other',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Field length caps: this endpoint is anonymous, and its input is persisted via
// the service role and forwarded to the support inbox, so bound it server-side
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;
const MAX_SUBJECT_LENGTH = 300;
const MAX_MESSAGE_LENGTH = 5000;

// Escape user-provided values before interpolating into the notification email
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const subject = (body.subject || '').trim();
    const message = (body.message || '').trim();
    const type = (body.type || 'general').trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      subject.length > MAX_SUBJECT_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: 'Input exceeds maximum length' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const category = CATEGORY_BY_TYPE[type] || 'other';

    // Insert with the service role: the public contact form has no session and
    // support_tickets.profile_id is nullable for anonymous submissions
    const admin = createAdminClient();

    const { data: ticketNumber, error: numberError } = await admin.rpc('generate_ticket_number');
    if (numberError || !ticketNumber) throw numberError || new Error('Failed to generate ticket number');

    // Keep the sender's identity in the description so it is visible without
    // querying metadata, and mirror it in metadata for structured access
    const description = `From: ${name} <${email}>\nInquiry type: ${type}\n\n${message}`;

    const { data: ticket, error: ticketError } = await admin
      .from('support_tickets')
      .insert([{
        ticket_number: ticketNumber,
        profile_id: null,
        subject,
        description,
        category,
        priority: 'medium',
        metadata: {
          source: 'contact_form',
          contact_name: name,
          contact_email: email,
          inquiry_type: type,
        },
      }])
      .select()
      .single();

    if (ticketError) throw ticketError;

    // Notify the support inbox. The ticket is already persisted, so email
    // delivery failures are logged but do not fail the request.
    try {
      const supportInbox = process.env.SUPPORT_INBOX_EMAIL || 'support@ghlhire.com';
      await sendEmail({
        to: supportInbox,
        replyTo: email,
        subject: `[Contact] ${subject} (${ticket.ticket_number})`,
        html: `<p><strong>Ticket:</strong> ${escapeHtml(ticket.ticket_number)}</p>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Inquiry type:</strong> ${escapeHtml(type)}</p>
<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
<hr />
<p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>`,
      });
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError);
    }

    return NextResponse.json({
      success: true,
      ticket_number: ticket.ticket_number,
    });

  } catch (error) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
}
