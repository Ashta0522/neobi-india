

// Helper function to get festivals for current and next year
const getIndianFestivals = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const festivals = [
    // Fixed date festivals
    { name: 'Republic Day', month: 0, day: 26, demandLift: 30 },
    { name: 'Valentine\'s Day', month: 1, day: 14, demandLift: 35 },
    { name: 'Independence Day', month: 7, day: 15, demandLift: 25 },
    { name: 'Gandhi Jayanti', month: 9, day: 2, demandLift: 15 },
    { name: 'Christmas', month: 11, day: 25, demandLift: 40 },
    { name: 'New Year', month: 11, day: 31, demandLift: 45 },

    // Approximate dates for lunar-based festivals (2025-2027)
    // Holi - typically February/March
    { name: 'Holi', month: 2, day: 14, demandLift: 45, year: 2025 },
    { name: 'Holi', month: 2, day: 3, demandLift: 45, year: 2026 },
    { name: 'Holi', month: 2, day: 22, demandLift: 45, year: 2027 },

    // Eid ul-Fitr - approximate
    { name: 'Eid ul-Fitr', month: 3, day: 1, demandLift: 50, year: 2025 },
    { name: 'Eid ul-Fitr', month: 2, day: 21, demandLift: 50, year: 2026 },
    { name: 'Eid ul-Fitr', month: 2, day: 11, demandLift: 50, year: 2027 },

    // Raksha Bandhan - typically August
    { name: 'Raksha Bandhan', month: 7, day: 19, demandLift: 40, year: 2025 },
    { name: 'Raksha Bandhan', month: 7, day: 9, demandLift: 40, year: 2026 },
    { name: 'Raksha Bandhan', month: 7, day: 29, demandLift: 40, year: 2027 },

    // Ganesh Chaturthi - typically August/September
    { name: 'Ganesh Chaturthi', month: 8, day: 27, demandLift: 42, year: 2025 },
    { name: 'Ganesh Chaturthi', month: 8, day: 16, demandLift: 42, year: 2026 },
    { name: 'Ganesh Chaturthi', month: 8, day: 6, demandLift: 42, year: 2027 },

    // Navratri/Dussehra - typically September/October
    { name: 'Navratri/Dussehra', month: 9, day: 3, demandLift: 48, year: 2025 },
    { name: 'Navratri/Dussehra', month: 8, day: 23, demandLift: 48, year: 2026 },
    { name: 'Navratri/Dussehra', month: 8, day: 12, demandLift: 48, year: 2027 },

    // Diwali - typically October/November
    { name: 'Diwali', month: 9, day: 21, demandLift: 60, year: 2025 },
    { name: 'Diwali', month: 10, day: 9, demandLift: 60, year: 2026 },
    { name: 'Diwali', month: 9, day: 29, demandLift: 60, year: 2027 },

    // Onam - typically August/September
    { name: 'Onam', month: 8, day: 7, demandLift: 35, year: 2025 },
    { name: 'Onam', month: 7, day: 27, demandLift: 35, year: 2026 },
    { name: 'Onam', month: 8, day: 16, demandLift: 35, year: 2027 },

    // Pongal - typically January 14-17
    { name: 'Pongal', month: 0, day: 14, demandLift: 38 },
  ];

  // Create date objects for all festivals
  return festivals.map(festival => {
    const festivalYear = festival.year || currentYear;
    // Create for both current and next year if year not specified
    if (!festival.year) {
      return [
        {
          name: festival.name,
          date: new Date(currentYear, festival.month, festival.day),
          demandLift: festival.demandLift,
        },
        {
          name: festival.name,
          date: new Date(nextYear, festival.month, festival.day),
          demandLift: festival.demandLift,
        },
      ];
    }
    return {
      name: festival.name,
      date: new Date(festivalYear, festival.month, festival.day),
      demandLift: festival.demandLift,
    };
  }).flat();
};

export async function GET(request: Request) {
  try {
    const now = new Date();
    const festivals = getIndianFestivals();

    // Find next festival (upcoming)
    const upcomingFestivals = festivals
      .filter((f) => f.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const nextFestival = upcomingFestivals[0];

    if (!nextFestival) {
      return Response.json({
        error: 'No upcoming festivals found',
      }, { status: 404 });
    }

    const daysUntil = Math.ceil(
      (nextFestival.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Also return next 3 festivals
    const next3 = upcomingFestivals.slice(0, 3).map(f => ({
      name: f.name,
      date: f.date,
      daysUntil: Math.ceil((f.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      demandLift: f.demandLift,
    }));

    return Response.json({
      next: nextFestival.name,
      date: nextFestival.date,
      daysUntil: Math.max(0, daysUntil),
      expectedDemandLift: nextFestival.demandLift,
      upcoming: next3,
    });
  } catch (error) {
    console.error('Festival API error:', error);
    return Response.json(
      { error: 'Failed to fetch festival data' },
      { status: 500 }
    );
  }
}
