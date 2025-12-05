import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInvoiceData, generateInvoiceHTML } from '@/lib/invoice/generate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's company
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Verify the invoice belongs to this company
    const { data: invoice } = await supabase
      .from('invoices')
      .select('id, company_id')
      .eq('id', id)
      .single();

    if (!invoice || invoice.company_id !== company.id) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Get invoice data and generate HTML
    const invoiceData = await getInvoiceData(id);

    if (!invoiceData) {
      return NextResponse.json(
        { error: 'Failed to generate invoice' },
        { status: 500 }
      );
    }

    const html = generateInvoiceHTML(invoiceData);

    // Check if format=json is requested
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format');

    if (format === 'json') {
      return NextResponse.json(invoiceData);
    }

    // Return HTML by default (for printing/PDF)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
