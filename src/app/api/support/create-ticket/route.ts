import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    const { profile_id, subject, description, category, priority, user_email, user_name } = body;

    if (!profile_id || !subject || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create ticket in database
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .insert([{
        profile_id,
        subject,
        description,
        category,
        priority: priority || 'medium'
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

          // Update ticket with n8n workflow data
          await supabase
            .from('support_tickets')
            .update({
              n8n_workflow_id: webhookData.workflow_id,
              external_ticket_id: webhookData.external_ticket_id,
              metadata: webhookData.metadata || {}
            })
            .eq('id', ticket.id);
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

  } catch (error: any) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}
