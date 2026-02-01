import foodBeverageData from './food-beverage.json';
import d2cClothingData from './d2c-clothing.json';
import saasBBData from './saas-b2b.json';
import kiranaStoreData from './kirana-store.json';
import mixedData from './mixed.json';

export interface TestCaseProfile {
  industry: string;
  mrr: number;
  customers: number;
  teamSize: number;
  location: string;
  cityTier: 1 | 2 | 3;
  foundedDate: string;
  growthTarget: number;
  riskTolerance: string;
}

export interface ExpertRating {
  bestPath: string;
  score: number;
  reasoning: string;
}

export interface TestCaseMetadata {
  complexity: 'low' | 'medium' | 'high';
  seasonality: boolean;
  festivalSensitivity: 'low' | 'medium' | 'high' | 'very high' | 'extreme';
}

export interface TestCase {
  id: string;
  name: string;
  category: string;
  profile: TestCaseProfile;
  expertRating: ExpertRating;
  metadata: TestCaseMetadata;
}

/**
 * Load all test cases from all categories
 */
export function loadAllTestCases(): TestCase[] {
  return [
    ...foodBeverageData,
    ...d2cClothingData,
    ...saasBBData,
    ...kiranaStoreData,
    ...mixedData,
  ] as TestCase[];
}

/**
 * Load test cases by category
 */
export function loadTestCasesByCategory(category: string): TestCase[] {
  const allCases = loadAllTestCases();
  return allCases.filter((tc) => tc.category === category);
}

/**
 * Get a single test case by ID
 */
export function getTestCaseById(id: string): TestCase | null {
  const allCases = loadAllTestCases();
  return allCases.find((tc) => tc.id === id) || null;
}

/**
 * Filter test cases by criteria
 */
export function filterTestCases(filters: {
  category?: string;
  cityTier?: 1 | 2 | 3;
  industry?: string;
  minMRR?: number;
  maxMRR?: number;
  complexity?: 'low' | 'medium' | 'high';
  festivalSensitivity?: 'low' | 'medium' | 'high' | 'very high' | 'extreme';
}): TestCase[] {
  let cases = loadAllTestCases();

  if (filters.category) {
    cases = cases.filter((tc) => tc.category === filters.category);
  }

  if (filters.cityTier) {
    cases = cases.filter((tc) => tc.profile.cityTier === filters.cityTier);
  }

  if (filters.industry) {
    cases = cases.filter((tc) =>
      tc.profile.industry.toLowerCase().includes(filters.industry!.toLowerCase())
    );
  }

  if (filters.minMRR !== undefined) {
    cases = cases.filter((tc) => tc.profile.mrr >= filters.minMRR!);
  }

  if (filters.maxMRR !== undefined) {
    cases = cases.filter((tc) => tc.profile.mrr <= filters.maxMRR!);
  }

  if (filters.complexity) {
    cases = cases.filter((tc) => tc.metadata.complexity === filters.complexity);
  }

  if (filters.festivalSensitivity) {
    cases = cases.filter((tc) => tc.metadata.festivalSensitivity === filters.festivalSensitivity);
  }

  return cases;
}

/**
 * Get test case statistics
 */
export function getTestCaseStats() {
  const allCases = loadAllTestCases();

  const categories = new Set(allCases.map((tc) => tc.category));
  const industries = new Set(allCases.map((tc) => tc.profile.industry));
  const locations = new Set(allCases.map((tc) => tc.profile.location));

  const avgMRR = allCases.reduce((sum, tc) => sum + tc.profile.mrr, 0) / allCases.length;
  const avgCustomers = allCases.reduce((sum, tc) => sum + tc.profile.customers, 0) / allCases.length;
  const avgTeamSize = allCases.reduce((sum, tc) => sum + tc.profile.teamSize, 0) / allCases.length;
  const avgExpertScore = allCases.reduce((sum, tc) => sum + tc.expertRating.score, 0) / allCases.length;

  const cityTierDistribution = {
    tier1: allCases.filter((tc) => tc.profile.cityTier === 1).length,
    tier2: allCases.filter((tc) => tc.profile.cityTier === 2).length,
    tier3: allCases.filter((tc) => tc.profile.cityTier === 3).length,
  };

  const complexityDistribution = {
    low: allCases.filter((tc) => tc.metadata.complexity === 'low').length,
    medium: allCases.filter((tc) => tc.metadata.complexity === 'medium').length,
    high: allCases.filter((tc) => tc.metadata.complexity === 'high').length,
  };

  const festivalSensitivityDistribution = {
    low: allCases.filter((tc) => tc.metadata.festivalSensitivity === 'low').length,
    medium: allCases.filter((tc) => tc.metadata.festivalSensitivity === 'medium').length,
    high: allCases.filter((tc) => tc.metadata.festivalSensitivity === 'high').length,
    veryHigh: allCases.filter((tc) => tc.metadata.festivalSensitivity === 'very high').length,
    extreme: allCases.filter((tc) => tc.metadata.festivalSensitivity === 'extreme').length,
  };

  return {
    totalCases: allCases.length,
    categories: Array.from(categories),
    categoriesCount: categories.size,
    industries: Array.from(industries),
    industriesCount: industries.size,
    locations: Array.from(locations),
    locationsCount: locations.size,
    avgMRR,
    avgCustomers,
    avgTeamSize,
    avgExpertScore,
    cityTierDistribution,
    complexityDistribution,
    festivalSensitivityDistribution,
  };
}

/**
 * Validate NeoBI recommendation against expert rating
 * Returns accuracy score (0-100)
 */
export function validateRecommendation(
  testCase: TestCase,
  neoBIRecommendation: string
): {
  match: boolean;
  accuracyScore: number;
  expertPath: string;
  neoBIPath: string;
  expertReasoning: string;
} {
  const expertPath = testCase.expertRating.bestPath.toLowerCase();
  const neoBIPath = neoBIRecommendation.toLowerCase();

  // Exact match
  if (expertPath === neoBIPath) {
    return {
      match: true,
      accuracyScore: 100,
      expertPath: testCase.expertRating.bestPath,
      neoBIPath: neoBIRecommendation,
      expertReasoning: testCase.expertRating.reasoning,
    };
  }

  // Partial match (contains key words)
  const expertKeywords = expertPath.split(' ');
  const neoBIKeywords = neoBIPath.split(' ');
  const matchingKeywords = expertKeywords.filter((kw) =>
    neoBIKeywords.some((nbkw) => nbkw.includes(kw) || kw.includes(nbkw))
  );

  const partialMatchScore = (matchingKeywords.length / expertKeywords.length) * 70;

  return {
    match: partialMatchScore > 50,
    accuracyScore: Math.round(partialMatchScore),
    expertPath: testCase.expertRating.bestPath,
    neoBIPath: neoBIRecommendation,
    expertReasoning: testCase.expertRating.reasoning,
  };
}

/**
 * Run backtest on all test cases with NeoBI
 * Returns overall accuracy metrics
 */
export async function runBacktest(
  neoBIPredictor: (profile: TestCaseProfile) => Promise<string>
): Promise<{
  totalCases: number;
  exactMatches: number;
  partialMatches: number;
  failures: number;
  overallAccuracy: number;
  categoryAccuracy: Record<string, number>;
  results: Array<{
    testCaseId: string;
    testCaseName: string;
    category: string;
    expertPath: string;
    neoBIPath: string;
    match: boolean;
    accuracyScore: number;
  }>;
}> {
  const allCases = loadAllTestCases();
  const results: Array<{
    testCaseId: string;
    testCaseName: string;
    category: string;
    expertPath: string;
    neoBIPath: string;
    match: boolean;
    accuracyScore: number;
  }> = [];

  let exactMatches = 0;
  let partialMatches = 0;
  let failures = 0;

  for (const testCase of allCases) {
    try {
      const neoBIRecommendation = await neoBIPredictor(testCase.profile);
      const validation = validateRecommendation(testCase, neoBIRecommendation);

      results.push({
        testCaseId: testCase.id,
        testCaseName: testCase.name,
        category: testCase.category,
        expertPath: validation.expertPath,
        neoBIPath: validation.neoBIPath,
        match: validation.match,
        accuracyScore: validation.accuracyScore,
      });

      if (validation.accuracyScore === 100) {
        exactMatches++;
      } else if (validation.match) {
        partialMatches++;
      } else {
        failures++;
      }
    } catch (error) {
      console.error(`Backtest failed for ${testCase.id}:`, error);
      failures++;
      results.push({
        testCaseId: testCase.id,
        testCaseName: testCase.name,
        category: testCase.category,
        expertPath: testCase.expertRating.bestPath,
        neoBIPath: 'ERROR',
        match: false,
        accuracyScore: 0,
      });
    }
  }

  const overallAccuracy = (exactMatches + partialMatches * 0.7) / allCases.length * 100;

  // Calculate category-wise accuracy
  const categories = Array.from(new Set(allCases.map((tc) => tc.category)));
  const categoryAccuracy: Record<string, number> = {};

  for (const category of categories) {
    const categoryResults = results.filter((r) => r.category === category);
    const categoryExact = categoryResults.filter((r) => r.accuracyScore === 100).length;
    const categoryPartial = categoryResults.filter((r) => r.match && r.accuracyScore < 100).length;
    categoryAccuracy[category] = (categoryExact + categoryPartial * 0.7) / categoryResults.length * 100;
  }

  return {
    totalCases: allCases.length,
    exactMatches,
    partialMatches,
    failures,
    overallAccuracy: Math.round(overallAccuracy * 10) / 10,
    categoryAccuracy,
    results,
  };
}
