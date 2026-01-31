// NeoBI India v2.0 - NIFTY API with Real Data Integration
import { fetchRealNiftyData } from '@/lib/nifty-api';

export async function GET(request: Request) {
  try {
    // Fetch real NIFTY data (uses Finnhub/Alpha Vantage or falls back to simulated)
    const niftyData = await fetchRealNiftyData();

    return Response.json(niftyData);
  } catch (error) {
    console.error('NIFTY API error:', error);

    // Fallback data if fetch fails
    return Response.json({
      value: 23500,
      change: 0,
      changePercent: 0,
      timestamp: new Date().toISOString(),
      isMarketOpen: false,
      source: 'fallback',
      error: 'Failed to fetch live data, showing fallback',
    }, { status: 200 }); // Return 200 with fallback data instead of error
  }
}
