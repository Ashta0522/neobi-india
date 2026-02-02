/**
 * NeoBI India v2.0 - Real NIFTY 50 API Integration
 * Correctly detects IST market hours
 */

interface NiftyData {
  value: number;
  change: number;
  changePercent: number;
  timestamp: string;
  isMarketOpen: boolean;
  source: string;
  marketStatus: string;
  nextMarketTime: string;
}

// Helper to check if market is open
function isIndianMarketOpen(): { isOpen: boolean; status: string; nextTime: string } {
  // Get current time in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const istTime = new Date(utcTime + istOffset);

  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const dayOfWeek = istTime.getDay(); // 0 = Sunday, 6 = Saturday
  const timeInMinutes = hours * 60 + minutes;

  // Market hours: 9:15 AM to 3:30 PM IST, Monday to Friday
  const marketOpen = 9 * 60 + 15; // 9:15 AM = 555 minutes
  const marketClose = 15 * 60 + 30; // 3:30 PM = 930 minutes

  // Check if it's a weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      isOpen: false,
      status: 'Weekend - Market Closed',
      nextTime: dayOfWeek === 0 ? 'Opens Monday 9:15 AM IST' : 'Opens Monday 9:15 AM IST',
    };
  }

  // Check if before market open
  if (timeInMinutes < marketOpen) {
    return {
      isOpen: false,
      status: 'Pre-Market',
      nextTime: 'Opens at 9:15 AM IST',
    };
  }

  // Check if after market close
  if (timeInMinutes > marketClose) {
    return {
      isOpen: false,
      status: 'After Hours',
      nextTime: 'Opens tomorrow 9:15 AM IST',
    };
  }

  // Market is open
  return {
    isOpen: true,
    status: 'Market Open',
    nextTime: 'Closes at 3:30 PM IST',
  };
}

export async function fetchRealNiftyData(): Promise<NiftyData> {
  const apiKey = process.env.FINNHUB_API_KEY;
  const marketInfo = isIndianMarketOpen();

  if (!apiKey) {
    return getSimulatedNiftyData(marketInfo);
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=^NSEI&token=${apiKey}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return getSimulatedNiftyData(marketInfo);
    }

    const quote = await response.json();

    // Check if we got valid data
    if (!quote || quote.c === 0 || quote.c === undefined) {
      return getSimulatedNiftyData(marketInfo);
    }

    const currentPrice = quote.c || 23500;
    const previousClose = quote.pc || 23500;
    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    return {
      value: currentPrice,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      timestamp: new Date().toISOString(),
      isMarketOpen: marketInfo.isOpen,
      source: 'finnhub',
      marketStatus: marketInfo.status,
      nextMarketTime: marketInfo.nextTime,
    };
  } catch (error) {
    console.error('Finnhub API error:', error);
    return getSimulatedNiftyData(marketInfo);
  }
}

function getSimulatedNiftyData(marketInfo: { isOpen: boolean; status: string; nextTime: string }): NiftyData {
  const baseValue = 23500;
  const volatility = marketInfo.isOpen ? 200 : 20;

  // Simulate realistic price movement
  const randomChange = (Math.random() - 0.5) * volatility;
  const value = baseValue + randomChange;
  const change = marketInfo.isOpen ? randomChange : (Math.random() - 0.5) * 50;
  const changePercent = (change / value) * 100;

  return {
    value: Math.round(value * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    timestamp: new Date().toISOString(),
    isMarketOpen: marketInfo.isOpen,
    source: 'simulated',
    marketStatus: marketInfo.status,
    nextMarketTime: marketInfo.nextTime,
  };
}
