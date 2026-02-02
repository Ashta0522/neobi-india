// NeoBI India v2.0 - Comprehensive Indian Festival API
// Includes all major festivals and national holidays

// Helper function to get all Indian festivals for current and next year
const getIndianFestivals = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const festivals = [
    // National Holidays (Fixed Dates)
    { name: 'Republic Day', month: 0, day: 26, demandLift: 30, category: 'national' },
    { name: 'Independence Day', month: 7, day: 15, demandLift: 30, category: 'national' },
    { name: 'Gandhi Jayanti', month: 9, day: 2, demandLift: 15, category: 'national' },

    // Fixed Date Festivals
    { name: "Valentine's Day", month: 1, day: 14, demandLift: 35, category: 'celebration' },
    { name: 'New Year', month: 0, day: 1, demandLift: 45, category: 'celebration' },
    { name: 'Christmas', month: 11, day: 25, demandLift: 40, category: 'religious' },
    { name: 'Christmas Eve', month: 11, day: 24, demandLift: 35, category: 'religious' },
    { name: "New Year's Eve", month: 11, day: 31, demandLift: 50, category: 'celebration' },

    // Pongal / Makar Sankranti (January)
    { name: 'Makar Sankranti', month: 0, day: 14, demandLift: 38, category: 'harvest' },
    { name: 'Pongal', month: 0, day: 14, demandLift: 38, category: 'harvest' },
    { name: 'Lohri', month: 0, day: 13, demandLift: 35, category: 'harvest' },
    { name: 'Bihu', month: 0, day: 14, demandLift: 35, category: 'harvest' },

    // Vasant Panchami (January/February)
    { name: 'Vasant Panchami', month: 1, day: 2, demandLift: 25, year: 2025 },
    { name: 'Vasant Panchami', month: 0, day: 23, demandLift: 25, year: 2026 },
    { name: 'Vasant Panchami', month: 1, day: 11, demandLift: 25, year: 2027 },

    // Maha Shivaratri (February/March)
    { name: 'Maha Shivaratri', month: 1, day: 26, demandLift: 30, year: 2025 },
    { name: 'Maha Shivaratri', month: 1, day: 15, demandLift: 30, year: 2026 },
    { name: 'Maha Shivaratri', month: 2, day: 6, demandLift: 30, year: 2027 },

    // Holi (February/March)
    { name: 'Holi', month: 2, day: 14, demandLift: 50, year: 2025, category: 'major' },
    { name: 'Holi', month: 2, day: 3, demandLift: 50, year: 2026, category: 'major' },
    { name: 'Holi', month: 2, day: 22, demandLift: 50, year: 2027, category: 'major' },
    { name: 'Holika Dahan', month: 2, day: 13, demandLift: 35, year: 2025 },
    { name: 'Holika Dahan', month: 2, day: 2, demandLift: 35, year: 2026 },
    { name: 'Holika Dahan', month: 2, day: 21, demandLift: 35, year: 2027 },

    // Ugadi / Gudi Padwa (March/April)
    { name: 'Ugadi/Gudi Padwa', month: 2, day: 30, demandLift: 35, year: 2025 },
    { name: 'Ugadi/Gudi Padwa', month: 2, day: 19, demandLift: 35, year: 2026 },
    { name: 'Ugadi/Gudi Padwa', month: 3, day: 7, demandLift: 35, year: 2027 },

    // Ram Navami (April)
    { name: 'Ram Navami', month: 3, day: 6, demandLift: 30, year: 2025 },
    { name: 'Ram Navami', month: 2, day: 26, demandLift: 30, year: 2026 },
    { name: 'Ram Navami', month: 3, day: 15, demandLift: 30, year: 2027 },

    // Good Friday / Easter (April)
    { name: 'Good Friday', month: 3, day: 18, demandLift: 25, year: 2025 },
    { name: 'Good Friday', month: 3, day: 3, demandLift: 25, year: 2026 },
    { name: 'Good Friday', month: 2, day: 26, demandLift: 25, year: 2027 },
    { name: 'Easter', month: 3, day: 20, demandLift: 30, year: 2025 },
    { name: 'Easter', month: 3, day: 5, demandLift: 30, year: 2026 },
    { name: 'Easter', month: 2, day: 28, demandLift: 30, year: 2027 },

    // Eid ul-Fitr (March/April - varies)
    { name: 'Eid ul-Fitr', month: 2, day: 31, demandLift: 55, year: 2025, category: 'major' },
    { name: 'Eid ul-Fitr', month: 2, day: 20, demandLift: 55, year: 2026, category: 'major' },
    { name: 'Eid ul-Fitr', month: 2, day: 10, demandLift: 55, year: 2027, category: 'major' },

    // Akshaya Tritiya (April/May)
    { name: 'Akshaya Tritiya', month: 4, day: 1, demandLift: 40, year: 2025 },
    { name: 'Akshaya Tritiya', month: 3, day: 21, demandLift: 40, year: 2026 },
    { name: 'Akshaya Tritiya', month: 4, day: 10, demandLift: 40, year: 2027 },

    // Buddha Purnima (May)
    { name: 'Buddha Purnima', month: 4, day: 12, demandLift: 20, year: 2025 },
    { name: 'Buddha Purnima', month: 4, day: 1, demandLift: 20, year: 2026 },
    { name: 'Buddha Purnima', month: 4, day: 20, demandLift: 20, year: 2027 },

    // Eid ul-Adha (June/July - varies)
    { name: 'Eid ul-Adha (Bakrid)', month: 5, day: 7, demandLift: 50, year: 2025, category: 'major' },
    { name: 'Eid ul-Adha (Bakrid)', month: 4, day: 27, demandLift: 50, year: 2026, category: 'major' },
    { name: 'Eid ul-Adha (Bakrid)', month: 4, day: 17, demandLift: 50, year: 2027, category: 'major' },

    // Muharram (July/August - varies)
    { name: 'Muharram', month: 6, day: 6, demandLift: 20, year: 2025 },
    { name: 'Muharram', month: 5, day: 25, demandLift: 20, year: 2026 },
    { name: 'Muharram', month: 5, day: 15, demandLift: 20, year: 2027 },

    // Raksha Bandhan (August)
    { name: 'Raksha Bandhan', month: 7, day: 9, demandLift: 45, year: 2025, category: 'major' },
    { name: 'Raksha Bandhan', month: 7, day: 28, demandLift: 45, year: 2026, category: 'major' },
    { name: 'Raksha Bandhan', month: 7, day: 17, demandLift: 45, year: 2027, category: 'major' },

    // Janmashtami (August/September)
    { name: 'Janmashtami', month: 7, day: 16, demandLift: 40, year: 2025 },
    { name: 'Janmashtami', month: 8, day: 3, demandLift: 40, year: 2026 },
    { name: 'Janmashtami', month: 7, day: 24, demandLift: 40, year: 2027 },

    // Onam (August/September)
    { name: 'Onam', month: 8, day: 5, demandLift: 40, year: 2025 },
    { name: 'Onam', month: 7, day: 26, demandLift: 40, year: 2026 },
    { name: 'Onam', month: 8, day: 14, demandLift: 40, year: 2027 },

    // Milad-un-Nabi (September - varies)
    { name: 'Milad-un-Nabi', month: 8, day: 5, demandLift: 25, year: 2025 },
    { name: 'Milad-un-Nabi', month: 7, day: 25, demandLift: 25, year: 2026 },
    { name: 'Milad-un-Nabi', month: 7, day: 14, demandLift: 25, year: 2027 },

    // Ganesh Chaturthi (August/September)
    { name: 'Ganesh Chaturthi', month: 7, day: 27, demandLift: 50, year: 2025, category: 'major' },
    { name: 'Ganesh Chaturthi', month: 8, day: 15, demandLift: 50, year: 2026, category: 'major' },
    { name: 'Ganesh Chaturthi', month: 8, day: 5, demandLift: 50, year: 2027, category: 'major' },

    // Navratri / Durga Puja / Dussehra (September/October)
    { name: 'Navratri Begins', month: 8, day: 22, demandLift: 45, year: 2025 },
    { name: 'Navratri Begins', month: 8, day: 11, demandLift: 45, year: 2026 },
    { name: 'Navratri Begins', month: 8, day: 30, demandLift: 45, year: 2027 },
    { name: 'Durga Puja', month: 9, day: 1, demandLift: 55, year: 2025, category: 'major' },
    { name: 'Durga Puja', month: 8, day: 20, demandLift: 55, year: 2026, category: 'major' },
    { name: 'Durga Puja', month: 9, day: 9, demandLift: 55, year: 2027, category: 'major' },
    { name: 'Dussehra', month: 9, day: 2, demandLift: 55, year: 2025, category: 'major' },
    { name: 'Dussehra', month: 8, day: 21, demandLift: 55, year: 2026, category: 'major' },
    { name: 'Dussehra', month: 9, day: 10, demandLift: 55, year: 2027, category: 'major' },

    // Karwa Chauth (October)
    { name: 'Karwa Chauth', month: 9, day: 10, demandLift: 35, year: 2025 },
    { name: 'Karwa Chauth', month: 9, day: 29, demandLift: 35, year: 2026 },
    { name: 'Karwa Chauth', month: 9, day: 18, demandLift: 35, year: 2027 },

    // Diwali Season (October/November)
    { name: 'Dhanteras', month: 9, day: 18, demandLift: 55, year: 2025, category: 'major' },
    { name: 'Dhanteras', month: 10, day: 6, demandLift: 55, year: 2026, category: 'major' },
    { name: 'Dhanteras', month: 9, day: 26, demandLift: 55, year: 2027, category: 'major' },
    { name: 'Diwali', month: 9, day: 20, demandLift: 65, year: 2025, category: 'major' },
    { name: 'Diwali', month: 10, day: 8, demandLift: 65, year: 2026, category: 'major' },
    { name: 'Diwali', month: 9, day: 28, demandLift: 65, year: 2027, category: 'major' },
    { name: 'Govardhan Puja', month: 9, day: 21, demandLift: 35, year: 2025 },
    { name: 'Govardhan Puja', month: 10, day: 9, demandLift: 35, year: 2026 },
    { name: 'Govardhan Puja', month: 9, day: 29, demandLift: 35, year: 2027 },
    { name: 'Bhai Dooj', month: 9, day: 22, demandLift: 40, year: 2025 },
    { name: 'Bhai Dooj', month: 10, day: 10, demandLift: 40, year: 2026 },
    { name: 'Bhai Dooj', month: 9, day: 30, demandLift: 40, year: 2027 },

    // Chhath Puja (November)
    { name: 'Chhath Puja', month: 9, day: 26, demandLift: 40, year: 2025 },
    { name: 'Chhath Puja', month: 10, day: 14, demandLift: 40, year: 2026 },
    { name: 'Chhath Puja', month: 10, day: 3, demandLift: 40, year: 2027 },

    // Guru Nanak Jayanti (November)
    { name: 'Guru Nanak Jayanti', month: 10, day: 5, demandLift: 30, year: 2025 },
    { name: 'Guru Nanak Jayanti', month: 10, day: 24, demandLift: 30, year: 2026 },
    { name: 'Guru Nanak Jayanti', month: 10, day: 13, demandLift: 30, year: 2027 },

    // Wedding Season Peaks
    { name: 'Wedding Season Peak 1', month: 10, day: 15, demandLift: 45, category: 'wedding' },
    { name: 'Wedding Season Peak 2', month: 1, day: 15, demandLift: 45, category: 'wedding' },

    // Other Regional Festivals
    { name: 'Vishu', month: 3, day: 14, demandLift: 30, category: 'regional' },
    { name: 'Baisakhi', month: 3, day: 13, demandLift: 35, category: 'regional' },
    { name: "Guru Gobind Singh's Birthday", month: 0, day: 5, demandLift: 25, category: 'religious' },
  ];

  // Create date objects for all festivals
  return festivals.map((festival) => {
    const festivalYear = festival.year || currentYear;
    // For fixed date festivals without year, create for both years
    if (!festival.year) {
      return [
        {
          name: festival.name,
          date: new Date(currentYear, festival.month, festival.day),
          demandLift: festival.demandLift,
          category: festival.category || 'religious',
        },
        {
          name: festival.name,
          date: new Date(nextYear, festival.month, festival.day),
          demandLift: festival.demandLift,
          category: festival.category || 'religious',
        },
      ];
    }
    return {
      name: festival.name,
      date: new Date(festivalYear, festival.month, festival.day),
      demandLift: festival.demandLift,
      category: festival.category || 'religious',
    };
  }).flat();
};

export async function GET(request: Request) {
  try {
    const now = new Date();
    const festivals = getIndianFestivals();

    // Find upcoming festivals (next 365 days)
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

    // Return next 10 festivals for better planning
    const next10 = upcomingFestivals.slice(0, 10).map((f) => ({
      name: f.name,
      date: f.date.toISOString(),
      daysUntil: Math.ceil((f.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      demandLift: f.demandLift,
      category: f.category,
    }));

    // Get major festivals only
    const majorFestivals = upcomingFestivals
      .filter((f) => f.demandLift >= 45 || f.category === 'major')
      .slice(0, 5)
      .map((f) => ({
        name: f.name,
        date: f.date.toISOString(),
        daysUntil: Math.ceil((f.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        demandLift: f.demandLift,
      }));

    return Response.json({
      next: nextFestival.name,
      date: nextFestival.date.toISOString(),
      daysUntil: Math.max(0, daysUntil),
      expectedDemandLift: nextFestival.demandLift,
      category: nextFestival.category,
      upcoming: next10,
      majorFestivals,
      totalFestivalsThisYear: festivals.filter(
        (f) => f.date.getFullYear() === now.getFullYear() && f.date > now
      ).length,
    });
  } catch (error) {
    console.error('Festival API error:', error);
    return Response.json(
      { error: 'Failed to fetch festival data' },
      { status: 500 }
    );
  }
}
