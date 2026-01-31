// India-specific market data and compliance helpers

export const GST_RATES = {
  standard: 18,
  reduced: 12,
  preferential: 5,
};

export const UPI_SETTLEMENT_TIME = 30; // minutes

// Generate holidays dynamically for current and next year
const generateIndianHolidays = (): string[] => {
  const currentYear = new Date().getFullYear();
  const holidays: string[] = [];

  // Fixed date holidays for current and next year
  for (let year = currentYear; year <= currentYear + 1; year++) {
    holidays.push(
      `${year}-01-26`, // Republic Day
      `${year}-08-15`, // Independence Day
      `${year}-10-02`, // Gandhi Jayanti
      `${year}-12-25`  // Christmas
    );
  }

  // Lunar-based holidays with approximate dates (should ideally use a lunar calendar library)
  // Holi 2025-2027
  const holiDates = [
    '2025-03-14',
    '2026-03-03',
    '2027-03-22'
  ];

  // Diwali 2025-2027
  const diwaliDates = [
    '2025-10-20',
    '2026-11-08',
    '2027-10-28'
  ];

  holidays.push(...holiDates, ...diwaliDates);

  return holidays.sort();
};

export const INDIAN_HOLIDAYS = generateIndianHolidays();

export const MARKET_HOURS = {
  open: { hour: 9, minute: 15 },
  close: { hour: 15, minute: 30 },
  timezone: 'Asia/Kolkata',
};

// Check if market is open
export const isMarketOpen = (): boolean => {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const dayOfWeek = now.getDay();

  // Closed on weekends (Saturday = 6, Sunday = 0)
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;

  // Check holidays
  const dateStr = now.toISOString().split('T')[0];
  if (INDIAN_HOLIDAYS.includes(dateStr)) return false;

  // Check time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const openTime = MARKET_HOURS.open.hour * 60 + MARKET_HOURS.open.minute; // 555 minutes (9:15 AM)
  const closeTime = MARKET_HOURS.close.hour * 60 + MARKET_HOURS.close.minute; // 930 minutes (3:30 PM)

  // Market is open from 9:15 AM to 3:30 PM (inclusive of 3:30)
  return timeInMinutes >= openTime && timeInMinutes <= closeTime;
};

// Calculate GST amount
export const calculateGST = (amount: number, rate: number = GST_RATES.standard): number => {
  return (amount * rate) / 100;
};

// Check DPDP compliance
export const isDPDPCompliant = (hasDataPolicy: boolean, hasConsentManagement: boolean): boolean => {
  return hasDataPolicy && hasConsentManagement;
};

// Format Indian currency
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get next Indian holiday
export const getNextHoliday = (): string => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const nextHoliday = INDIAN_HOLIDAYS.find((h) => h > todayStr);
  return nextHoliday || INDIAN_HOLIDAYS[0];
};
