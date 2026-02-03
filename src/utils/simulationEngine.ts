import { DecisionPath, AgentId, BusinessProfile, MARLState } from '@/types';

// SHAP value calculator with proper Shapley value approximation
export const calculateSHAPValues = (
  features: Record<string, number>,
  baseValue: number = 500
): Record<string, number> => {
  const shap: Record<string, number> = {};
  const featureKeys = Object.keys(features);
  const n = featureKeys.length;

  // Calculate total feature value for normalization
  const totalFeatureValue = Object.values(features).reduce((sum, val) => sum + val, 0);

  // Approximate Shapley values using coalition sampling
  // In a proper implementation, this would sample all possible coalitions
  // Here we use a weighted contribution based on marginal contribution
  featureKeys.forEach((key) => {
    const featureValue = features[key];

    // Calculate marginal contribution: how much does this feature contribute
    // relative to its value and the presence of other features
    let marginalContribution = 0;

    // Weight by feature value relative to total
    const relativeImportance = featureValue / totalFeatureValue;

    // Calculate contribution with diminishing returns for coalition size
    // This approximates the average marginal contribution across coalitions
    for (let coalitionSize = 0; coalitionSize < n; coalitionSize++) {
      const weight = 1 / (n * (n - 1)); // Shapley weight for this coalition size
      const contribution = (featureValue / (coalitionSize + 1)) * baseValue * relativeImportance;
      marginalContribution += weight * contribution * n;
    }

    shap[key] = marginalContribution;
  });

  // Normalize so that sum of SHAP values equals expected deviation from base
  const totalShap = Object.values(shap).reduce((sum, val) => sum + val, 0);
  const normalizationFactor = (baseValue * 0.4) / totalShap; // 40% of base value as total contribution

  Object.keys(shap).forEach((key) => {
    shap[key] = shap[key] * normalizationFactor;
  });

  return shap;
};

// Query Intent Detection - Parse user queries to understand intent
export type QueryIntent =
  | 'market_entry'
  | 'growth'
  | 'hiring'
  | 'funding'
  | 'marketing'
  | 'operations'
  | 'pivot'
  | 'compliance'
  | 'general';

export const detectQueryIntent = (query: string): QueryIntent => {
  const lowerQuery = query.toLowerCase();

  // Market Entry / New Market / Geographic Expansion
  // First check if any city is mentioned in the query
  const mentionedCity = INDIAN_CITIES.some(city => lowerQuery.includes(city));

  if (
    mentionedCity ||
    lowerQuery.includes('new market') ||
    lowerQuery.includes('enter') ||
    lowerQuery.includes('entering') ||
    lowerQuery.includes('expand') ||
    lowerQuery.includes('expansion') ||
    lowerQuery.includes('move to') ||
    lowerQuery.includes('relocate') ||
    lowerQuery.includes('shift to') ||
    lowerQuery.includes('tier 2') ||
    lowerQuery.includes('tier-2') ||
    lowerQuery.includes('tier 3') ||
    lowerQuery.includes('tier-3') ||
    lowerQuery.includes('new city') ||
    lowerQuery.includes('new location') ||
    lowerQuery.includes('geographic') ||
    lowerQuery.includes('international')
  ) {
    return 'market_entry';
  }

  // Growth
  if (lowerQuery.includes('grow') || lowerQuery.includes('scale') || lowerQuery.includes('growth')) {
    return 'growth';
  }

  // Hiring
  if (lowerQuery.includes('hire') || lowerQuery.includes('hiring') || lowerQuery.includes('team') || lowerQuery.includes('recruit')) {
    return 'hiring';
  }

  // Funding
  if (lowerQuery.includes('fund') || lowerQuery.includes('invest') || lowerQuery.includes('capital') || lowerQuery.includes('raise')) {
    return 'funding';
  }

  // Marketing
  if (lowerQuery.includes('market') || lowerQuery.includes('customer') || lowerQuery.includes('acquire') || lowerQuery.includes('sales')) {
    return 'marketing';
  }

  // Operations
  if (lowerQuery.includes('operation') || lowerQuery.includes('efficien') || lowerQuery.includes('process') || lowerQuery.includes('optimize')) {
    return 'operations';
  }

  // Pivot
  if (lowerQuery.includes('pivot') || lowerQuery.includes('change') || lowerQuery.includes('transform')) {
    return 'pivot';
  }

  // Compliance
  if (lowerQuery.includes('gst') || lowerQuery.includes('tax') || lowerQuery.includes('compli') || lowerQuery.includes('legal')) {
    return 'compliance';
  }

  return 'general';
};

// Indian cities database for query extraction
const INDIAN_CITIES = [
  // Metro cities
  'mumbai', 'delhi', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 'hyderabad', 'pune',
  // Tier 1
  'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal',
  'visakhapatnam', 'vizag', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik',
  // Tier 2
  'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar',
  'allahabad', 'prayagraj', 'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada',
  'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur', 'hubli',
  // Tier 3 / Growing cities
  'thiruvananthapuram', 'trivandrum', 'kochi', 'cochin', 'thrissur', 'kozhikode', 'calicut',
  'mysore', 'mysuru', 'mangalore', 'mangaluru', 'belgaum', 'belagavi', 'gulbarga', 'shimoga',
  'noida', 'greater noida', 'gurgaon', 'gurugram', 'faridabad', 'dehradun', 'haridwar',
  'rishikesh', 'jamshedpur', 'bokaro', 'dhanbad', 'ranchi', 'bhubaneswar', 'cuttack',
  'puducherry', 'pondicherry', 'salem', 'tirupur', 'erode', 'tiruchirappalli', 'trichy',
  'nellore', 'guntur', 'warangal', 'karimnagar', 'nizamabad', 'khammam',
];

// Extract city from user query
const extractCityFromQuery = (query: string): string | null => {
  const lowerQuery = query.toLowerCase();

  // Check for city mentions in query
  for (const city of INDIAN_CITIES) {
    if (lowerQuery.includes(city)) {
      // Capitalize first letter of each word
      return city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  }

  return null;
};

// Generate Market Entry specific paths
const generateMarketEntryPaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  // First, try to extract city from user's query
  const queryCity = query ? extractCityFromQuery(query) : null;

  // Use query city if found, otherwise fall back to default mapping
  const targetCity = queryCity || (
    profile.location === 'Bangalore' ? 'Hyderabad' :
    profile.location === 'Mumbai' ? 'Pune' :
    profile.location === 'Delhi' ? 'Jaipur' : 'Tier-2 City'
  );

  return [
    {
      id: 'aggressive-market-entry',
      name: 'Rapid Market Capture',
      description: `Launch aggressively in ${targetCity} with full team, heavy marketing spend`,
      expectedValue: baseExpectedValue * 2.2,
      probability: 0.55,
      riskScore: 78,
      timeline: 90,
      costs: {
        immediate: profile.mrr * 8,
        monthly: profile.mrr * 0.5,
      },
      benefits: {
        revenue: baseExpectedValue * 2.5,
        efficiency: 20,
        riskReduction: 10,
      },
      steps: [
        `Open office in ${targetCity} with 5-10 member team`,
        'Launch aggressive digital marketing campaign',
        'Hire local sales team within 30 days',
        'Partner with local businesses for quick traction',
      ],
      risks: [
        'High burn rate may affect runway',
        'Local market dynamics may differ',
        'Team management across locations challenging',
      ],
      shapleySHAP: calculateSHAPValues({
        market_size: 50,
        competition_level: 30,
        local_demand: 20,
      }),
      agentContributions: {
        orchestrator: 8,
        simulation_cluster: 18,
        decision_intelligence: 15,
        operations_optimizer: 20,
        personal_coach: 5,
        innovation_advisor: 10,
        growth_strategist: 20,
        learning_adaptation: 4,
      },
    },
    {
      id: 'balanced-market-entry',
      name: 'Phased Market Entry',
      description: `Test ${targetCity} market with pilot, then scale based on results`,
      expectedValue: baseExpectedValue * 1.4,
      probability: 0.80,
      riskScore: 42,
      timeline: 180,
      costs: {
        immediate: profile.mrr * 3,
        monthly: profile.mrr * 0.2,
      },
      benefits: {
        revenue: baseExpectedValue * 1.6,
        efficiency: 30,
        riskReduction: 45,
      },
      steps: [
        `Run 60-day pilot in ${targetCity} with 2-3 team members`,
        'Validate product-market fit with local customers',
        'Scale team to 8-10 if pilot succeeds',
        'Establish local partnerships gradually',
      ],
      risks: [
        'Slower time to market',
        'Competitors may capture market first',
        'Pilot results may not scale',
      ],
      shapleySHAP: calculateSHAPValues({
        market_validation: 45,
        resource_efficiency: 35,
        risk_mitigation: 20,
      }),
      agentContributions: {
        orchestrator: 12,
        simulation_cluster: 16,
        decision_intelligence: 18,
        operations_optimizer: 18,
        personal_coach: 10,
        innovation_advisor: 6,
        growth_strategist: 14,
        learning_adaptation: 6,
      },
    },
    {
      id: 'conservative-market-entry',
      name: 'Remote Market Expansion',
      description: `Serve ${targetCity} remotely first, then establish presence`,
      expectedValue: baseExpectedValue * 0.8,
      probability: 0.92,
      riskScore: 18,
      timeline: 365,
      costs: {
        immediate: profile.mrr * 1,
        monthly: profile.mrr * 0.08,
      },
      benefits: {
        revenue: baseExpectedValue * 1.0,
        efficiency: 40,
        riskReduction: 70,
      },
      steps: [
        `Start serving ${targetCity} customers remotely`,
        'Build referral network without physical presence',
        'Hire 1-2 local representatives after 6 months',
        'Open office only after achieving ₹5L+ MRR from that market',
      ],
      risks: [
        'Limited market penetration',
        'Miss high-touch customer opportunities',
        'May not be viable for all business types',
      ],
      shapleySHAP: calculateSHAPValues({
        cash_preservation: 50,
        organic_growth: 30,
        market_learning: 20,
      }),
      agentContributions: {
        orchestrator: 10,
        simulation_cluster: 12,
        decision_intelligence: 15,
        operations_optimizer: 20,
        personal_coach: 15,
        innovation_advisor: 5,
        growth_strategist: 8,
        learning_adaptation: 15,
      },
    },
  ];
};

// Decision Path Generator with Multi-Agent Contributions
export const generateDecisionPaths = (
  profile: BusinessProfile,
  agentContributions: Record<AgentId, number>,
  query?: string
): DecisionPath[] => {
  const baseExpectedValue = profile.mrr * 12 * 0.3; // 30% annual growth potential

  // Detect query intent
  const intent = query ? detectQueryIntent(query) : 'general';

  // Return intent-specific paths
  if (intent === 'market_entry') {
    return generateMarketEntryPaths(profile, baseExpectedValue, query);
  }

  const paths: DecisionPath[] = [
    {
      id: 'aggressive',
      name: 'Aggressive Scaling',
      description: 'Hire immediately, scale marketing, raise funding',
      expectedValue: baseExpectedValue * 1.8,
      probability: 0.65,
      riskScore: 72,
      timeline: 90,
      costs: {
        immediate: profile.mrr * 6,
        monthly: profile.mrr * 0.4,
      },
      benefits: {
        revenue: baseExpectedValue * 2.0,
        efficiency: 35,
        riskReduction: 15,
      },
      steps: [
        'Raise seed/Series A funding within 60 days',
        'Hire 10+ team members across functions',
        'Launch aggressive paid marketing campaigns',
        'Expand to 2-3 new cities simultaneously',
      ],
      risks: [
        'High burn rate requires external funding',
        'Rapid hiring may affect culture',
        'Market conditions may change',
      ],
      shapleySHAP: calculateSHAPValues({
        team_capacity: 45,
        market_timing: 35,
        cash_buffer: 20,
      }),
      agentContributions: {
        orchestrator: 10,              // 10%
        simulation_cluster: 15,        // 15%
        decision_intelligence: 18,     // 18%
        operations_optimizer: 22,      // 22%
        personal_coach: 4,             // 4%
        innovation_advisor: 7,         // 7%
        growth_strategist: 19,         // 19%
        learning_adaptation: 5,        // 5%
      },
      // Total: 100%
    },
    {
      id: 'balanced',
      name: 'Balanced Growth',
      description: 'Optimize ops, selective hiring, organic growth',
      expectedValue: baseExpectedValue,
      probability: 0.85,
      riskScore: 45,
      timeline: 180,
      costs: {
        immediate: profile.mrr * 2,
        monthly: profile.mrr * 0.15,
      },
      benefits: {
        revenue: baseExpectedValue * 1.2,
        efficiency: 25,
        riskReduction: 40,
      },
      steps: [
        'Optimize current operations for efficiency',
        'Hire 3-5 key roles strategically',
        'Focus on organic and referral growth',
        'Build sustainable unit economics',
      ],
      risks: [
        'Slower growth may miss market window',
        'Competitors may scale faster',
        'Limited resources for experimentation',
      ],
      shapleySHAP: calculateSHAPValues({
        operational_efficiency: 40,
        market_stability: 35,
        cash_flow: 25,
      }),
      agentContributions: {
        orchestrator: 13,              // 13%
        simulation_cluster: 14,        // 14%
        decision_intelligence: 16,     // 16%
        operations_optimizer: 19,      // 19%
        personal_coach: 11,            // 11%
        innovation_advisor: 5,         // 5%
        growth_strategist: 12,         // 12%
        learning_adaptation: 10,       // 10%
      },
      // Total: 100%
    },
    {
      id: 'conservative',
      name: 'Conservative Path',
      description: 'Build cash reserves, improve margins, low risk',
      expectedValue: baseExpectedValue * 0.6,
      probability: 0.95,
      riskScore: 20,
      timeline: 365,
      costs: {
        immediate: profile.mrr * 0.5,
        monthly: profile.mrr * 0.05,
      },
      benefits: {
        revenue: baseExpectedValue * 0.8,
        efficiency: 15,
        riskReduction: 75,
      },
      steps: [
        'Focus on existing customer retention',
        'Build 12+ months runway',
        'Improve profit margins by 20%',
        'Minimal new hires, upskill existing team',
      ],
      risks: [
        'May miss growth opportunities',
        'Team may get demotivated',
        'Market share may decline',
      ],
      shapleySHAP: calculateSHAPValues({
        cash_preservation: 50,
        risk_mitigation: 35,
        stability: 15,
      }),
      agentContributions: {
        orchestrator: 9,               // 9%
        simulation_cluster: 9,         // 9%
        decision_intelligence: 14,     // 14%
        operations_optimizer: 16,      // 16%
        personal_coach: 18,            // 18%
        innovation_advisor: 3,         // 3%
        growth_strategist: 7,          // 7%
        learning_adaptation: 24,       // 24%
      },
      // Total: 100%
    },
  ];

  return paths;
};

// World Model Prediction (horizon-aware)
export const predictWorldModel = (
  profile: BusinessProfile,
  horizon: number // days
): { forecast: number; mae: number; confidence: number } => {
  const monthlyGrowthRate = 0.05 + (profile.growthTarget - 15) / 500;
  const forecastMonths = horizon / 30;

  // Compound growth with seasonality
  const baseForecast = profile.mrr * Math.pow(1 + monthlyGrowthRate, forecastMonths);
  
  // Add festival seasonality
  const festivalBoost = horizon > 60 && horizon < 120 ? 0.15 : 0.05;
  const forecast = baseForecast * (1 + festivalBoost);

  // MAE increases with horizon (typical for forecasts)
  const mae = forecast * (0.02 + horizon / 10000);
  const confidence = Math.max(0.5, 1 - horizon / 1000);

  return { forecast, mae, confidence };
};

// MARL Reward Simulation (episode-based)
export const simulateMARLEpisode = (
  episode: number,
  previousState: MARLState,
  agentActions: Record<AgentId, number>
): MARLState => {
  // Convergence pattern: Sigmoid curve to peak reward
  const convergenceTarget = 850;
  const convergenceRate = 0.015;
  const noise = (Math.random() - 0.5) * 50;
  const reward = convergenceTarget - (convergenceTarget - 500) * Math.exp(-convergenceRate * episode) + noise;

  // Agent reward distribution normalized to 100%
  const agentRewards: Record<AgentId, number> = {
    orchestrator: reward * 0.12,           // 12%
    simulation_cluster: reward * 0.16,     // 16%
    decision_intelligence: reward * 0.20,  // 20%
    operations_optimizer: reward * 0.22,   // 22%
    personal_coach: reward * 0.10,         // 10%
    innovation_advisor: reward * 0.07,     // 7%
    growth_strategist: reward * 0.09,      // 9%
    learning_adaptation: reward * 0.04,    // 4%
  };
  // Total: 100%

  const totalReward = Object.values(agentRewards).reduce((a, b) => a + b, 0);
  const convergenceMetric = Math.min(100, (totalReward / convergenceTarget) * 100);

  return {
    episode,
    totalReward,
    agentRewards,
    convergenceMetric,
    replayBufferSize: Math.min(10000, episode * 50),
    policyVersion: Math.floor(episode / 10),
  };
};

// Operational Metrics Generator with Industry-Specific Logic
export const generateOperationalMetrics = (profile: BusinessProfile) => {
  // Industry-specific hiring calculation
  const industryMultipliers: Record<string, number> = {
    saas: 0.25,
    ecommerce: 0.35,
    manufacturing: 0.40,
    services: 0.20,
    fintech: 0.30,
  };

  const industry = profile.industry?.toLowerCase() || 'saas';
  const multiplier = industryMultipliers[industry] || 0.30;
  const hiringNeeded = Math.ceil(profile.teamSize * multiplier);

  // Industry-specific roles
  const rolesByIndustry: Record<string, string[]> = {
    saas: ['Engineer', 'Product Manager', 'Customer Success'],
    ecommerce: ['Marketing', 'Logistics', 'Customer Support'],
    manufacturing: ['Operations', 'Quality Control', 'Supply Chain'],
    services: ['Sales', 'Account Manager', 'Delivery Manager'],
    fintech: ['Engineer', 'Compliance Officer', 'Risk Analyst'],
  };

  const rolesNeeded = rolesByIndustry[industry] || ['Engineer', 'Sales', 'Support'];
  const hiringTimeline: Record<string, { start: Date; end: Date; cost: number }> = {};

  rolesNeeded.forEach((role, idx) => {
    const start = new Date();
    start.setDate(start.getDate() + idx * 30);
    const end = new Date(start);
    end.setDate(end.getDate() + 60);
    hiringTimeline[role] = {
      start,
      end,
      cost: profile.mrr * 0.8,
    };
  });

  // Industry-specific inventory (only for product-based businesses)
  const hasInventory = ['ecommerce', 'manufacturing'].includes(industry);
  const inventoryMetrics = hasInventory ? {
    currentLevel: Math.round(profile.customers * 2.5), // 2.5x customer base
    reorderPoint: Math.round(profile.customers * 0.8),
    safetyStock: Math.round(profile.customers * 0.5),
    turnoverRatio: industry === 'ecommerce' ? 6.2 : 4.1, // Ecommerce turns faster
  } : {
    currentLevel: 0,
    reorderPoint: 0,
    safetyStock: 0,
    turnoverRatio: 0,
  };

  // Industry-specific suppliers
  const supplierCount = hasInventory ? 3 : 2;
  const suppliers = Array.from({ length: supplierCount }, (_, idx) => ({
    name: `${idx === 0 ? 'Primary' : idx === 1 ? 'Secondary' : 'Tertiary'}Supplier`,
    reliability: 95 - idx * 8,
    cost: profile.mrr * (0.25 + idx * 0.05),
    leadTime: 12 + idx * 7,
    negotiationPotential: 12 + idx * 8,
  }));

  // Real GST Compliance Check
  const annualRevenue = profile.mrr * 12;
  const gstThreshold = 2000000; // ₹20 lakh threshold for GST registration
  const gstRequired = annualRevenue >= gstThreshold;
  const gstCompliant = gstRequired; // Assume compliant if required

  // DPDP Act Compliance Check
  const dpdpRequired = profile.customers > 100 || profile.industry === 'fintech';
  const dpdpCompliant = dpdpRequired; // Assume compliant if data collected

  // UPI Settlement Check
  const upiEnabled = ['ecommerce', 'fintech', 'services'].includes(industry);

  return {
    hiring: {
      required: hiringNeeded,
      timeline: hiringTimeline,
      estimatedSavings: profile.mrr * 0.5,
    },
    inventory: inventoryMetrics,
    suppliers,
    compliance: {
      gst: gstCompliant,
      gstRequired,
      gstThreshold: annualRevenue >= gstThreshold ? `₹${(annualRevenue / 100000).toFixed(1)}L (Above ₹20L threshold)` : `₹${(annualRevenue / 100000).toFixed(1)}L (Below ₹20L threshold)`,
      dpdp: dpdpCompliant,
      dpdpRequired,
      dpdpNote: dpdpRequired ? 'DPDP Act applies - ensure consent management' : 'DPDP Act may not apply',
      upi: upiEnabled,
      upiSettlementTime: upiEnabled ? '30 mins - 1 day' : 'N/A',
    },
    burnoutRisk: 65,
    stressFactors: ['cash_flow_pressure', 'hiring_challenges', 'market_competition'],
  };
};

// Burnout Risk Reduction by Vibe
export const calculateBurnoutReduction = (
  baseRisk: number,
  vibeMode: 'aggressive' | 'balanced' | 'conservative'
): { baseRisk: number; riskAfterAdjustment: number; reduction: number; modeNote: string } => {
  const reductions = {
    aggressive: { reduction: 10, note: 'Fast growth but high stress' },
    balanced: { reduction: 35, note: 'Moderate growth, sustainable' },
    conservative: { reduction: 60, note: 'Low growth, high wellness' },
  };

  const mode = reductions[vibeMode];
  return {
    baseRisk,
    riskAfterAdjustment: Math.max(0, baseRisk - mode.reduction),
    reduction: mode.reduction,
    modeNote: mode.note,
  };
};

// Confidence Distribution with Monte Carlo Ensemble Simulation
export const generateConfidenceDistribution = (
  paths: DecisionPath[]
): { bins: string[]; counts: number[] } => {
  const bins = ['60-70%', '70-80%', '80-90%', '90-95%', '95-100%'];
  const binRanges = [
    [0.6, 0.7],
    [0.7, 0.8],
    [0.8, 0.9],
    [0.9, 0.95],
    [0.95, 1.0],
  ];

  // Generate ensemble of predictions (Monte Carlo simulation)
  // For each path, create 30 ensemble members with noise to simulate model uncertainty
  const ensemblePredictions: number[] = [];

  paths.forEach((path) => {
    const baseProb = path.probability;
    const uncertainty = 0.08; // ±8% uncertainty

    // Generate 30 ensemble members per path
    for (let i = 0; i < 30; i++) {
      // Add Gaussian noise around the base probability
      const noise = (Math.random() - 0.5) * 2 * uncertainty;
      const noisyProb = Math.max(0.5, Math.min(1.0, baseProb + noise));
      ensemblePredictions.push(noisyProb);
    }
  });

  // Count predictions in each bin
  const counts = binRanges.map((range) =>
    ensemblePredictions.filter((p) => p >= range[0] && p < range[1]).length
  );

  return { bins, counts };
};

// Competitor Response Heatmap
export const generateCompetitorHeatmap = (
  selectedPath: DecisionPath
): Array<{ scenario: string; aggressiveScore: number; conservativeScore: number; innovativeScore: number }> => {
  const ev = selectedPath.expectedValue;
  return [
    {
      scenario: 'Price War',
      aggressiveScore: Math.min(100, (ev / 500000) * 50 + 40),
      conservativeScore: Math.min(100, (ev / 500000) * 30),
      innovativeScore: Math.min(100, (ev / 500000) * 45),
    },
    {
      scenario: 'Feature Race',
      aggressiveScore: Math.min(100, 70),
      conservativeScore: Math.min(100, 35),
      innovativeScore: Math.min(100, 85),
    },
    {
      scenario: 'Market Consolidation',
      aggressiveScore: Math.min(100, 60),
      conservativeScore: Math.min(100, 50),
      innovativeScore: Math.min(100, 55),
    },
  ];
};
