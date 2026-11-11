import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * API Route to create support ticket and send to n8n webhook
 *
 * n8n Webhook Configuration:
 * 1. Create a webhook node in n8n
 * 2. Set the webhook URL in environment variable: N8N_SUPPORT_WEBHOOK_URL
 * 3. The webhook will receive ticket data and can:
 *    - Send email notifications
 *    - Create tickets in external systems (Zendesk, Freshdesk, etc.)
 *    - Post to Slack/Discord
 *    - Log to database
 *
 * Example n8n workflow:
 * Webhook -> Email (notify support team) -> HTTP Request (create in ticketing system) -> Set (return ticket ID)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, description, category, priority } = body;

    if (!subject || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Identity comes from the session, not the request body
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Please sign in to submit a support ticket' },
        { status: 401 }
      );
    }

    // profile_id is optional: employers have no jobseeker profile row and the
    // support_tickets.profile_id column is nullable
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('user_id', user.id)
      .maybeSingle();

    const user_email = profile?.email || user.email;
    const user_name = profile?.full_name || user.user_metadata?.full_name || user.email;

    // Insert with the service role: RLS's insert policy only covers jobseeker
    // profiles, but employers must be able to file tickets too
    const admin = createAdminClient();

    const { data: ticketNumber, error: numberError } = await admin.rpc('generate_ticket_number');
    if (numberError || !ticketNumber) throw numberError || new Error('Failed to generate ticket number');

    const { data: ticket, error: ticketError } = await admin
      .from('support_tickets')
      .insert([{
        ticket_number: ticketNumber,
        profile_id: profile?.id || null,
        subject,
        description,
        category,
        priority: priority || 'medium',
        // Employers have no profile row, so profile_id is null for their
        // tickets; keep the requester's identity on the ticket for admins
        metadata: {
          user_id: user.id,
          user_email: user_email || null,
          user_name: user_name || null,
        },
      }])
      .select()
      .single();

    if (ticketError) throw ticketError;

    // Send to n8n webhook (if configured)
    const n8nWebhookUrl = process.env.N8N_SUPPORT_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      try {
        const webhookPayload = {
          ticket_id: ticket.id,
          ticket_number: ticket.ticket_number,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          user_email,
          user_name,
          created_at: ticket.created_at,
          // Metadata for n8n workflow
          source: 'ghl-hire',
          environment: process.env.NODE_ENV || 'development'
        };

        const webhookResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });

        if (webhookResponse.ok) {
          const webhookData = await webhookResponse.json();

          // Write back n8n workflow data with the service role: ticket owners
          // have no UPDATE policy, and employer tickets (profile_id null)
          // never matched one anyway. Merge so the requester identity stored
          // at insert is not overwritten.
          const n8nMetadata =
            webhookData.metadata && typeof webhookData.metadata === 'object' && !Array.isArray(webhookData.metadata)
              ? webhookData.metadata
              : {};
          const existingMetadata =
            ticket.metadata && typeof ticket.metadata === 'object' && !Array.isArray(ticket.metadata)
              ? ticket.metadata
              : {};

          const { error: writeBackError } = await admin
            .from('support_tickets')
            .update({
              n8n_workflow_id: webhookData.workflow_id,
              external_ticket_id: webhookData.external_ticket_id,
              metadata: { ...n8nMetadata, ...existingMetadata },
            })
            .eq('id', ticket.id);

          if (writeBackError) {
            console.error('Failed to store n8n ticket data:', writeBackError);
          }
        }

      } catch (webhookError) {
        console.error('n8n webhook error:', webhookError);
        // Don't fail the ticket creation if webhook fails
      }
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        status: ticket.status
      },
      message: 'Support ticket created successfully'
    });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}
