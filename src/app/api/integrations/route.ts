// Integration APIs Route - Connect to Tally, Zoho, GST Portal
import { NextRequest, NextResponse } from 'next/server';
import { integrationManager, tallyClient, zohoClient, gstPortalClient } from '@/lib/integrations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  const action = searchParams.get('action');

  try {
    switch (source) {
      case 'tally':
        return handleTallyRequest(action);
      case 'zoho':
        return handleZohoRequest(action);
      case 'gst':
        return handleGSTRequest(action);
      case 'all':
        const overview = await integrationManager.getFinancialOverview();
        return NextResponse.json({ success: true, data: overview });
      default:
        return NextResponse.json({
          success: true,
          status: integrationManager.getStatus(),
          endpoints: {
            tally: '/api/integrations?source=tally&action=sales|ledgers|vouchers',
            zoho: '/api/integrations?source=zoho&action=invoices|expenses|transactions',
            gst: '/api/integrations?source=gst&action=returns|summary|validate',
            all: '/api/integrations?source=all',
          },
        });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function handleTallyRequest(action: string | null) {
  switch (action) {
    case 'sales':
      const salesData = await tallyClient.getSalesData();
      return NextResponse.json({ success: true, data: salesData });
    case 'ledgers':
      const ledgers = await tallyClient.getLedgers();
      return NextResponse.json({ success: true, data: ledgers });
    case 'vouchers':
      const vouchers = await tallyClient.getVouchers(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        new Date().toISOString()
      );
      return NextResponse.json({ success: true, data: vouchers });
    default:
      return NextResponse.json({ success: true, data: await tallyClient.getSalesData() });
  }
}

async function handleZohoRequest(action: string | null) {
  switch (action) {
    case 'invoices':
      const invoices = await zohoClient.getInvoices();
      return NextResponse.json({ success: true, data: invoices });
    case 'expenses':
      const expenses = await zohoClient.getExpenses();
      return NextResponse.json({ success: true, data: expenses });
    case 'transactions':
      const transactions = await zohoClient.getBankTransactions();
      return NextResponse.json({ success: true, data: transactions });
    default:
      return NextResponse.json({ success: true, data: await zohoClient.getInvoices() });
  }
}

async function handleGSTRequest(action: string | null) {
  switch (action) {
    case 'returns':
      const returns = await gstPortalClient.getReturns();
      return NextResponse.json({ success: true, data: returns });
    case 'summary':
      const summary = await gstPortalClient.getGSTSummary();
      return NextResponse.json({ success: true, data: summary });
    case 'validate':
      // GSTIN validation handled via POST
      return NextResponse.json({ success: false, error: 'Use POST with gstin parameter' });
    default:
      return NextResponse.json({ success: true, data: await gstPortalClient.getGSTSummary() });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config, gstin } = body;

    switch (action) {
      case 'configure-tally':
        integrationManager.configureTally(config);
        return NextResponse.json({ success: true, message: 'Tally configured successfully' });

      case 'configure-zoho':
        integrationManager.configureZoho(config);
        return NextResponse.json({ success: true, message: 'Zoho configured successfully' });

      case 'configure-gst':
        integrationManager.configureGST(config);
        return NextResponse.json({ success: true, message: 'GST Portal configured successfully' });

      case 'validate-gstin':
        const validation = await gstPortalClient.validateGSTIN(gstin);
        return NextResponse.json({ success: true, data: validation });

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
