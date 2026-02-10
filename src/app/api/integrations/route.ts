// Integration APIs Route - Connect to Tally, Zoho, GST Portal
import { integrationManager, tallyClient, zohoClient, gstPortalClient } from '@/lib/integrations';

// Helper function to return JSON response
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(request: Request) {
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
        return jsonResponse({ success: true, data: overview });
      default:
        return jsonResponse({
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
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
  }
}

async function handleTallyRequest(action: string | null) {
  switch (action) {
    case 'sales':
      const salesData = await tallyClient.getSalesData();
      return jsonResponse({ success: true, data: salesData });
    case 'ledgers':
      const ledgers = await tallyClient.getLedgers();
      return jsonResponse({ success: true, data: ledgers });
    case 'vouchers':
      const vouchers = await tallyClient.getVouchers(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        new Date().toISOString()
      );
      return jsonResponse({ success: true, data: vouchers });
    default:
      return jsonResponse({ success: true, data: await tallyClient.getSalesData() });
  }
}

async function handleZohoRequest(action: string | null) {
  switch (action) {
    case 'invoices':
      const invoices = await zohoClient.getInvoices();
      return jsonResponse({ success: true, data: invoices });
    case 'expenses':
      const expenses = await zohoClient.getExpenses();
      return jsonResponse({ success: true, data: expenses });
    case 'transactions':
      const transactions = await zohoClient.getBankTransactions();
      return jsonResponse({ success: true, data: transactions });
    default:
      return jsonResponse({ success: true, data: await zohoClient.getInvoices() });
  }
}

async function handleGSTRequest(action: string | null) {
  switch (action) {
    case 'returns':
      const returns = await gstPortalClient.getReturns();
      return jsonResponse({ success: true, data: returns });
    case 'summary':
      const summary = await gstPortalClient.getGSTSummary();
      return jsonResponse({ success: true, data: summary });
    case 'validate':
      // GSTIN validation handled via POST
      return jsonResponse({ success: false, error: 'Use POST with gstin parameter' });
    default:
      return jsonResponse({ success: true, data: await gstPortalClient.getGSTSummary() });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, config, gstin } = body;

    switch (action) {
      case 'configure-tally':
        integrationManager.configureTally(config);
        return jsonResponse({ success: true, message: 'Tally configured successfully' });

      case 'configure-zoho':
        integrationManager.configureZoho(config);
        return jsonResponse({ success: true, message: 'Zoho configured successfully' });

      case 'configure-gst':
        integrationManager.configureGST(config);
        return jsonResponse({ success: true, message: 'GST Portal configured successfully' });

      case 'validate-gstin':
        const validation = await gstPortalClient.validateGSTIN(gstin);
        return jsonResponse({ success: true, data: validation });

      default:
        return jsonResponse({ success: false, error: 'Unknown action' }, 400);
    }
  } catch (error) {
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
  }
}
