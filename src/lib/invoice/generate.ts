import { createClient } from '@/lib/supabase/server';

interface InvoiceData {
  invoiceNumber: string;
  companyName: string;
  companyEmail: string;
  planName: string;
  amount: number;
  currency: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  paidAt: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

/**
 * Generate HTML invoice that can be rendered or converted to PDF
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'PHP') {
      return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.invoiceNumber} - GHL Hire</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #1f2937;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    .logo {
      font-size: 28px;
      font-weight: 600;
    }
    .logo span {
      font-weight: 300;
      color: #60a5fa;
    }
    .invoice-details {
      text-align: right;
    }
    .invoice-number {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .invoice-date {
      font-size: 14px;
      color: #6b7280;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #dcfce7;
      color: #166534;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
    }
    .addresses {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .address-block h3 {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .address-block p {
      font-size: 14px;
      line-height: 1.6;
    }
    .address-block .company-name {
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    th {
      text-align: left;
      padding: 12px;
      background: #f9fafb;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
    }
    th:last-child {
      text-align: right;
    }
    td {
      padding: 16px 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    td:last-child {
      text-align: right;
    }
    .totals {
      margin-left: auto;
      width: 280px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .totals-row.total {
      font-weight: 600;
      font-size: 18px;
      border-top: 2px solid #1f2937;
      padding-top: 12px;
      margin-top: 8px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    .footer p {
      margin-bottom: 4px;
    }
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">GHL<span>Hire</span></div>
      <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">GoHighLevel Job Board</p>
    </div>
    <div class="invoice-details">
      <div class="invoice-number">Invoice #${data.invoiceNumber}</div>
      <div class="invoice-date">Date: ${formatDate(data.paidAt)}</div>
      <div class="badge">PAID</div>
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <h3>From</h3>
      <p class="company-name">GHL Hire</p>
      <p>support@ghlhire.com</p>
      <p>https://ghlhire.com</p>
    </div>
    <div class="address-block">
      <h3>Bill To</h3>
      <p class="company-name">${data.companyName}</p>
      <p>${data.companyEmail}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${data.lineItems.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.unitPrice, data.currency)}</td>
          <td>${formatCurrency(item.total, data.currency)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal</span>
      <span>${formatCurrency(data.amount, data.currency)}</span>
    </div>
    <div class="totals-row">
      <span>Tax (0%)</span>
      <span>${formatCurrency(0, data.currency)}</span>
    </div>
    <div class="totals-row total">
      <span>Total</span>
      <span>${formatCurrency(data.amount, data.currency)}</span>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Billing period: ${formatDate(data.billingPeriodStart)} - ${formatDate(data.billingPeriodEnd)}</p>
    <p>Payment received on ${formatDate(data.paidAt)}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Get invoice data from database
 */
export async function getInvoiceData(invoiceId: string): Promise<InvoiceData | null> {
  const supabase = await createClient();

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      company:companies (
        company_name,
        email
      ),
      subscription:subscriptions (
        plan_type
      )
    `)
    .eq('id', invoiceId)
    .single();

  if (error || !invoice) {
    return null;
  }

  const planNames: Record<string, string> = {
    free: 'Free Plan',
    basic: 'Basic Plan',
    premium: 'Premium Plan',
    enterprise: 'Enterprise Plan',
  };

  // Parse line_items from JSON
  const lineItems = Array.isArray(invoice.line_items)
    ? invoice.line_items as Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
      }>
    : [{
        description: planNames[invoice.subscription?.plan_type || 'basic'] || 'Subscription',
        quantity: 1,
        unitPrice: invoice.amount_cents / 100,
        total: invoice.amount_cents / 100,
      }];

  const now = new Date().toISOString();

  return {
    invoiceNumber: invoice.invoice_number,
    companyName: invoice.company?.company_name || 'Unknown',
    companyEmail: invoice.company?.email || '',
    planName: planNames[invoice.subscription?.plan_type || 'basic'] || 'Subscription',
    amount: invoice.amount_cents / 100,
    currency: invoice.currency || 'PHP',
    billingPeriodStart: invoice.billing_period_start || invoice.created_at || now,
    billingPeriodEnd: invoice.billing_period_end || invoice.created_at || now,
    paidAt: invoice.paid_at || invoice.created_at || now,
    lineItems,
  };
}
