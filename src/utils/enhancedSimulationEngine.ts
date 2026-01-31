'use client';

import {
  Agent,
  BusinessProfile,
  DecisionPath,
  CascadingPath,
  RewardDecomposition,
  CurriculumLevel,
  BurnoutTrajectory,
  ConfidenceDistribution,
  AblationStudy,
  CompetitorHeatmap,
  JugaadIdea,
  UFraudRiskScore,
  RegionalAdjustment,
  FestivalMultiplier,
  AuditLogEntry,
  AgentId,
  BusinessProfileExtended,
} from '@/types';

// ============================================================================
// CASCADING PATH GENERATION - Multi-Level Decision Trees
// ============================================================================

export function generateCascadingPaths(
  parentPath: DecisionPath,
  profile: BusinessProfile,
  level: number = 1
): CascadingPath[] {
  const executionOptions: CascadingPath['executionOptions'] = {
    budgetSplit: [
      { component: 'Product Development', allocation: 40 },
      { component: 'Marketing', allocation: 35 },
      { component: 'Operations', allocation: 25 },
    ],
    timelineOptions: {
      aggressive: Math.max(15, parentPath.timeline - 10),
      balanced: parentPath.timeline,
      conservative: parentPath.timeline + 15,
    },
    channelMix: [
      { channel: 'Direct Sales', weightage: 35 },
      { channel: 'Digital Marketing', weightage: 40 },
      { channel: 'Partnerships', weightage: 25 },
    ],
    aTestVariants: [
      { variant: 'Premium positioning', expectedLift: 22 },
      { variant: 'Volume strategy', expectedLift: 18 },
      { variant: 'Hybrid approach', expectedLift: 25 },
    ],
    hiringSupplierAdjustments: [
      { role: 'Product Engineer', quantity: 2, cost: 2000000 },
      { role: 'Growth Marketer', quantity: 1, cost: 1500000 },
      { role: 'Operations Manager', quantity: 1, cost: 1200000 },
    ],
  };

  const subPaths: CascadingPath[] = [
    {
      id: `${parentPath.id}-exec-1`,
      name: 'Budget-Optimized Execution',
      description: 'Allocate 40% to product, 35% marketing, 25% ops',
      expectedValue: parentPath.expectedValue * 1.1,
      probability: parentPath.probability * 0.95,
      riskScore: parentPath.riskScore + 5,
      timeline: executionOptions.timelineOptions.balanced,
      costs: {
        immediate: (parentPath.costs.immediate * 0.9) || 500000,
        monthly: (parentPath.costs.monthly * 0.85) || 250000,
      },
      benefits: {
        revenue: parentPath.benefits.revenue * 1.05,
        efficiency: parentPath.benefits.efficiency + 8,
        riskReduction: parentPath.benefits.riskReduction - 5,
      },
      shapleySHAP: parentPath.shapleySHAP,
      agentContributions: parentPath.agentContributions,
      parentId: parentPath.id,
      level,
      executionOptions,
      breadcrumbPath: ['Level 1', parentPath.name, 'Budget-Optimized'],
    },
    {
      id: `${parentPath.id}-exec-2`,
      name: 'Accelerated Channel Mix',
      description: '40% digital, 35% direct, 25% partnerships',
      expectedValue: parentPath.expectedValue * 1.15,
      probability: parentPath.probability * 0.85,
      riskScore: parentPath.riskScore + 15,
      timeline: executionOptions.timelineOptions.aggressive,
      costs: {
        immediate: (parentPath.costs.immediate * 1.2) || 600000,
        monthly: (parentPath.costs.monthly * 1.15) || 300000,
      },
      benefits: {
        revenue: parentPath.benefits.revenue * 1.2,
        efficiency: parentPath.benefits.efficiency + 12,
        riskReduction: parentPath.benefits.riskReduction - 15,
      },
      shapleySHAP: parentPath.shapleySHAP,
      agentContributions: parentPath.agentContributions,
      parentId: parentPath.id,
      level,
      executionOptions,
      breadcrumbPath: ['Level 1', parentPath.name, 'Accelerated Channel'],
    },
    {
      id: `${parentPath.id}-exec-3`,
      name: 'Conservative Staged Rollout',
      description: 'Phase 1: MVP launch, Phase 2: scale channels, Phase 3: optimize',
      expectedValue: parentPath.expectedValue * 0.95,
      probability: parentPath.probability * 1.0,
      riskScore: Math.max(0, parentPath.riskScore - 10),
      timeline: executionOptions.timelineOptions.conservative,
      costs: {
        immediate: (parentPath.costs.immediate * 0.6) || 400000,
        monthly: (parentPath.costs.monthly * 0.7) || 200000,
      },
      benefits: {
        revenue: parentPath.benefits.revenue * 0.95,
        efficiency: parentPath.benefits.efficiency + 5,
        riskReduction: parentPath.benefits.riskReduction + 15,
      },
      shapleySHAP: parentPath.shapleySHAP,
      agentContributions: parentPath.agentContributions,
      parentId: parentPath.id,
      level,
      executionOptions,
      breadcrumbPath: ['Level 1', parentPath.name, 'Staged Rollout'],
    },
  ];

  return subPaths;
}

// ============================================================================
// REWARD DECOMPOSITION - Breaking Down Total Reward
// ============================================================================

export function calculateRewardDecomposition(
  path: DecisionPath,
  profile: BusinessProfile,
  regionalAdj: RegionalAdjustment,
  festivalMultiplier: number = 1.0
): RewardDecomposition {
  // Base contributions
  const revenueComponent = (path.benefits.revenue * festivalMultiplier) / 100000; // normalize to ₹L
  const riskComponent = (path.benefits.riskReduction * -0.5); // negative contribution if risk high
  const burnoutComponent = calculateBurnoutReduction(65, profile.vibeMode);
  const efficiencyComponent = path.benefits.efficiency;
  const complianceComponent = 15; // fixed for now

  const total = Math.abs(revenueComponent + riskComponent + burnoutComponent + efficiencyComponent + complianceComponent);

  return {
    totalReward: total,
    components: {
      revenue: (Math.abs(revenueComponent) / total) * 100,
      riskReduction: (Math.abs(riskComponent) / total) * 100,
      burnoutMitigation: (Math.abs(burnoutComponent) / total) * 100,
      operationalEfficiency: (Math.abs(efficiencyComponent) / total) * 100,
      complianceScore: (Math.abs(complianceComponent) / total) * 100,
    },
    timestamp: new Date(),
  };
}

// ============================================================================
// CURRICULUM LEARNING - 3-Level Learning Breakdown
// ============================================================================

export function generateCurriculumLearning(
  episodes: number = 100
): CurriculumLevel[] {
  const levels: CurriculumLevel[] = [];

  // Level 1: Single-decision learning (simplest)
  const level1Episodes: number[] = [];
  const level1Rewards: number[] = [];
  const level1Convergence: number[] = [];
  for (let i = 0; i < Math.floor(episodes / 3); i++) {
    level1Episodes.push(i);
    const reward = 400 + Math.random() * 300 + (i * 0.8); // slow, simple convergence
    level1Rewards.push(reward);
    level1Convergence.push(Math.min(100, (i / (episodes / 6)) * 100));
  }

  levels.push({
    level: 1,
    description: 'Single-Decision Learning (Base Path Selection)',
    episodes: level1Episodes,
    rewards: level1Rewards,
    convergenceMetric: level1Convergence,
    agentContributions: {
      orchestrator: 15,
      simulation_cluster: 20,
      decision_intelligence: 30,
      operations_optimizer: 15,
      personal_coach: 5,
      innovation_advisor: 5,
      growth_strategist: 5,
      learning_adaptation: 5,
    },
  });

  // Level 2: Sequential learning (medium complexity)
  const level2Episodes: number[] = [];
  const level2Rewards: number[] = [];
  const level2Convergence: number[] = [];
  for (let i = Math.floor(episodes / 3); i < Math.floor((2 * episodes) / 3); i++) {
    level2Episodes.push(i);
    const reward = 600 + Math.random() * 200 + ((i - episodes / 3) * 0.6);
    level2Rewards.push(reward);
    level2Convergence.push(Math.min(100, ((i - episodes / 3) / (episodes / 3)) * 100));
  }

  levels.push({
    level: 2,
    description: 'Sequential Learning (Cascading Paths)',
    episodes: level2Episodes,
    rewards: level2Rewards,
    convergenceMetric: level2Convergence,
    agentContributions: {
      orchestrator: 12,
      simulation_cluster: 18,
      decision_intelligence: 22,
      operations_optimizer: 20,
      personal_coach: 8,
      innovation_advisor: 8,
      growth_strategist: 8,
      learning_adaptation: 4,
    },
  });

  // Level 3: Multi-agent cooperative learning (most complex)
  const level3Episodes: number[] = [];
  const level3Rewards: number[] = [];
  const level3Convergence: number[] = [];
  for (let i = Math.floor((2 * episodes) / 3); i < episodes; i++) {
    level3Episodes.push(i);
    const reward = 750 + Math.random() * 150 + ((i - (2 * episodes) / 3) * 0.4);
    level3Rewards.push(Math.min(900, reward));
    level3Convergence.push(Math.min(100, ((i - (2 * episodes) / 3) / (episodes / 3)) * 100));
  }

  levels.push({
    level: 3,
    description: 'Multi-Agent Learning (Full Ensemble)',
    episodes: level3Episodes,
    rewards: level3Rewards,
    convergenceMetric: level3Convergence,
    agentContributions: {
      orchestrator: 10,
      simulation_cluster: 15,
      decision_intelligence: 18,
      operations_optimizer: 18,
      personal_coach: 10,
      innovation_advisor: 10,
      growth_strategist: 12,
      learning_adaptation: 7,
    },
  });

  return levels;
}

// ============================================================================
// BURNOUT TRAJECTORY - Time Series of Burnout Risk
// ============================================================================

export function generateBurnoutTrajectory(
  selectedVibeMode: 'aggressive' | 'balanced' | 'conservative',
  timelineInDays: number = 30
): BurnoutTrajectory {
  const timestamps: Date[] = [];
  const baselineRisk: number[] = [];
  const afterPathRisk: number[] = [];

  const daysArray = Math.floor(timelineInDays / 5); // 5-day intervals

  for (let i = 0; i <= daysArray; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i * 5);
    timestamps.push(date);

    // Baseline increases over time (founder stress)
    const baseRisk = 65 + i * (2 + Math.random() * 2); // increases by ~2-4% per 5 days
    baselineRisk.push(Math.min(90, baseRisk));

    // After path risk depends on vibe mode
    let afterRisk = baseRisk;
    if (selectedVibeMode === 'conservative') {
      afterRisk = baseRisk * 0.4; // 60% reduction
    } else if (selectedVibeMode === 'balanced') {
      afterRisk = baseRisk * 0.65; // 35% reduction
    } else {
      afterRisk = baseRisk * 0.9; // 10% reduction (aggressive increases stress)
    }

    afterPathRisk.push(Math.max(15, afterRisk));
  }

  return {
    timestamp: timestamps,
    baselineRisk,
    afterPathRisk,
    vibeMode: selectedVibeMode,
    trajectory: afterPathRisk[afterPathRisk.length - 1] < afterPathRisk[0] ? 'improving' : 'worsening',
  };
}

// ============================================================================
// CONFIDENCE DISTRIBUTION - Ensemble Confidence Spread
// ============================================================================

export function generateConfidenceDistribution(
  ensembleSize: number = 10
): ConfidenceDistribution {
  const confidences: number[] = [];
  for (let i = 0; i < ensembleSize; i++) {
    // 5 members at 88-92%, 3 at 80-87%, 2 at 70-79%
    let conf: number;
    if (i < 5) {
      conf = 88 + Math.random() * 4;
    } else if (i < 8) {
      conf = 80 + Math.random() * 7;
    } else {
      conf = 70 + Math.random() * 9;
    }
    confidences.push(conf);
  }

  const bins = [60, 70, 80, 90, 95];
  const counts = [0, 0, 0, 0, 0];

  confidences.forEach((conf) => {
    if (conf < 70) counts[0]++;
    else if (conf < 80) counts[1]++;
    else if (conf < 90) counts[2]++;
    else if (conf < 95) counts[3]++;
    else counts[4]++;
  });

  const mean = confidences.reduce((a, b) => a + b, 0) / confidences.length;
  const stdDev = Math.sqrt(
    confidences.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / confidences.length
  );

  return {
    bins,
    counts,
    mean: Math.round(mean * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    minConfidence: Math.min(...confidences),
    maxConfidence: Math.max(...confidences),
  };
}

// ============================================================================
// ABLATION STUDY - Component Importance
// ============================================================================

export function generateAblationStudy(): AblationStudy[] {
  const baselinePerformance = 92; // baseline with all components

  return [
    {
      component: 'MARL',
      performanceWithout: 64,
      performanceWith: baselinePerformance,
      dropPercentage: ((baselinePerformance - 64) / baselinePerformance) * 100,
    },
    {
      component: 'SHAP',
      performanceWithout: 73,
      performanceWith: baselinePerformance,
      dropPercentage: ((baselinePerformance - 73) / baselinePerformance) * 100,
    },
    {
      component: 'Personal Coach',
      performanceWithout: 80,
      performanceWith: baselinePerformance,
      dropPercentage: ((baselinePerformance - 80) / baselinePerformance) * 100,
    },
    {
      component: 'Simulation Cluster',
      performanceWithout: 68,
      performanceWith: baselinePerformance,
      dropPercentage: ((baselinePerformance - 68) / baselinePerformance) * 100,
    },
    {
      component: 'Operations Optimizer',
      performanceWithout: 75,
      performanceWith: baselinePerformance,
      dropPercentage: ((baselinePerformance - 75) / baselinePerformance) * 100,
    },
  ];
}

// ============================================================================
// COMPETITOR RESPONSE HEATMAP - Competitive Intelligence
// ============================================================================

export function generateCompetitorHeatmapMatrix(
  selectedPath: DecisionPath
): CompetitorHeatmap[] {
  const yourActions = [
    'Price Cut 20%',
    'Feature Launch',
    'Market Expansion',
  ];

  const competitorPersonalities: ('aggressive' | 'conservative' | 'innovative')[] = [
    'aggressive',
    'conservative',
    'innovative',
  ];

  const heatmap: CompetitorHeatmap[] = [];

  yourActions.forEach((action) => {
    competitorPersonalities.forEach((personality) => {
      const baseImpact = selectedPath.benefits.revenue * (Math.random() * 0.6 - 0.3); // -30% to +30%

      let likelyResponse: number;
      let responseTime: number;

      if (personality === 'aggressive') {
        likelyResponse = 85 + Math.random() * 15; // 85-100%
        responseTime = 7 + Math.floor(Math.random() * 5); // 7-12 days
      } else if (personality === 'conservative') {
        likelyResponse = 40 + Math.random() * 30; // 40-70%
        responseTime = 14 + Math.floor(Math.random() * 10); // 14-24 days
      } else {
        likelyResponse = 60 + Math.random() * 30; // 60-90%
        responseTime = 10 + Math.floor(Math.random() * 8); // 10-18 days
      }

      heatmap.push({
        yourAction: action,
        competitorPersonality: personality,
        revenueImpact: baseImpact,
        revenueImpactPercent: (baseImpact / selectedPath.expectedValue) * 100,
        likelihood: likelyResponse,
        timeline: responseTime,
      });
    });
  });

  return heatmap;
}

// ============================================================================
// REGIONAL ADJUSTMENT ENGINE - Tier-Based Multipliers
// ============================================================================

export function calculateRegionalAdjustment(
  cityTier: 1 | 2 | 3,
  location: string
): RegionalAdjustment {
  let demandMultiplier: number;
  let hiringCostMultiplier: number;
  let supplierCostMultiplier: number;
  let complianceBurden: number;
  let msmeEligibility: boolean;
  let regionalNote: string;

  if (cityTier === 1) {
    // Metro (Bangalore, Mumbai, Delhi, Hyderabad)
    demandMultiplier = 1.0;
    hiringCostMultiplier = 1.0;
    supplierCostMultiplier = 1.0;
    complianceBurden = 35;
    msmeEligibility = true;
    regionalNote = `Tier-1 ${location} uplift: +18% vs national average`;
  } else if (cityTier === 2) {
    // Tier-2 (Pune, Chandigarh, Jaipur, Coimbatore)
    demandMultiplier = 0.75;
    hiringCostMultiplier = 0.75;
    supplierCostMultiplier = 0.8;
    complianceBurden = 45;
    msmeEligibility = true;
    regionalNote = `Tier-2 ${location} standard: -25% demand vs metros, +18% hiring cost savings`;
  } else {
    // Tier-3 (smaller towns, HITEC excluded)
    demandMultiplier = 0.6;
    hiringCostMultiplier = 0.6;
    supplierCostMultiplier = 0.65;
    complianceBurden = 55;
    msmeEligibility = true;
    regionalNote = `Tier-3 ${location} opportunity: -40% demand, -40% costs, +25% compliance burden`;
  }

  return {
    cityTier,
    demandMultiplier,
    hiringCostMultiplier,
    supplierCostMultiplier,
    complianceBurden,
    msmeEligibility,
    regionalNote,
  };
}

// ============================================================================
// BURNOUT-AWARE PATH PRUNING - Personal Coach Gate
// ============================================================================

export function pruneBurnoutPaths(
  paths: DecisionPath[],
  burnoutThreshold: number = 30 // prune if burnout delta > 30%
): { paths: DecisionPath[]; pruned: string[] } {
  const pruned: string[] = [];

  const filtered = paths.filter((path) => {
    const baseBurnout = 65; // founder baseline
    const pathBurnout = calculateBurnoutReduction(baseBurnout, 'aggressive');
    const burnoutDelta = Math.abs(baseBurnout - pathBurnout);

    if (burnoutDelta > burnoutThreshold) {
      pruned.push(`${path.name} (burnout delta: ${Math.round(burnoutDelta)}%)`);
      return false;
    }
    return true;
  });

  return { paths: filtered, pruned };
}

// ============================================================================
// SELF-EVOLVING JUGAAD GENERATOR - Mutation Algorithm
// ============================================================================

export function evolveSuggestion(
  originalIdea: JugaadIdea,
  userFeedback: 'thumbs_up' | 'thumbs_down'
): JugaadIdea {
  const mutations = {
    partnership: [
      'Partner with kirana chains',
      'Partner with local artisans',
      'Partner with NGOs for CSR',
      'Partner with WhatsApp Business',
      'Partner with micro-influencers',
    ],
    frugal: [
      'Use student interns for 50% cost',
      'Barter with suppliers for equity',
      'Leverage free tier SaaS tools',
      'Use WhatsApp + Google Sheets instead of CRM',
      'DIY manufacturing for MVP',
    ],
    pivot: [
      'Pivot to adjacent customer segment',
      'Pivot to B2B instead of B2C',
      'Pivot to subscription model',
      'Pivot to marketplace from direct',
      'Pivot geographic focus to underserved tier-2',
    ],
    'growth-hack': [
      'Referral program with ₹500 incentive',
      'Flash sales on festival days',
      'Viral content challenge on Instagram',
      'WhatsApp group community building',
      'Reddit AMA + Product Hunt launch',
    ],
  };

  const category = originalIdea.category as keyof typeof mutations;
  const categoryMutations = mutations[category] || [];
  const randomMutation = categoryMutations[Math.floor(Math.random() * categoryMutations.length)];

  const scoreAdjustment = userFeedback === 'thumbs_up' ? 8 : -5;

  return {
    id: `jugaad-${Date.now()}`,
    createdAt: new Date(),
    description: randomMutation || originalIdea.description,
    feasibilityScore: Math.max(20, Math.min(100, originalIdea.feasibilityScore + scoreAdjustment)),
    potentialImpact: originalIdea.potentialImpact * (userFeedback === 'thumbs_up' ? 1.15 : 0.85),
    category: originalIdea.category,
    userFeedback: null,
    generation: originalIdea.generation + 1,
    parentId: originalIdea.id,
  };
}

// ============================================================================
// UPI FRAUD RISK SIMULATOR - Mini-MARL Game
// ============================================================================

export function simulateUPIFraudRisk(
  profile: BusinessProfile,
  pathRevenueIncrease: number
): UFraudRiskScore {
  const baseTransactionVolume = (profile.mrr / 1000) * 10; // estimate transactions
  const newTransactionVolume = baseTransactionVolume * (1 + pathRevenueIncrease / 100);

  // Fraudster tries to exploit growth
  const fraudsterAggressiveness = Math.min(85, newTransactionVolume / 1000); // scales with volume
  
  // Defense learns
  const defenseInvestment = profile.teamSize * 5; // ₹5L per team member
  const defenseLevel = Math.min(85, defenseInvestment / 100000);

  // Simulated fraud attempts
  const fraudAttempts = Math.max(0, Math.floor((fraudsterAggressiveness - defenseLevel) * 0.1));
  
  // Score (0-100)
  const score = Math.max(5, 100 - defenseLevel * 1.2);

  // Mitigation strategies
  const mitigation: string[] = [];
  if (score > 50) {
    mitigation.push('Implement 2FA for UPI payments');
  }
  if (score > 40) {
    mitigation.push('Add transaction velocity checks');
  }
  if (score > 30) {
    mitigation.push('Monitor for suspicious patterns');
  }
  mitigation.push('Daily fraud alert notifications');

  // Estimated loss per 10k transactions
  const estimatedLoss = (fraudAttempts * 500) || 0; // ₹500 per fraudulent attempt

  return {
    score: Math.round(score),
    fraudAttempts,
    defenseLevel: Math.round(defenseLevel),
    mitigationStrategies: mitigation,
    estimatedLoss,
  };
}

// ============================================================================
// FESTIVAL MULTIPLIER CALCULATOR - Dynamic Demand Boost
// ============================================================================

export function calculateFestivalMultiplier(
  daysUntilFestival: number,
  festivalName: string
): FestivalMultiplier {
  const baseMultipliers: Record<string, number> = {
    'Holi': 1.35,
    'Diwali': 2.5,
    'Ganesh Chaturthi': 1.8,
    'Navratri': 1.95,
    'Eid': 1.4,
    'Christmas': 1.6,
    'New Year': 1.5,
  };

  const demandMultiplier = baseMultipliers[festivalName] || 1.2;

  // Decay as festival approaches
  const decayFactor = Math.max(0.5, 1 - daysUntilFestival / 90);
  const effectiveMultiplier = 1 + (demandMultiplier - 1) * decayFactor;

  const affectedCategories: Record<string, string[]> = {
    'Holi': ['food', 'fashion', 'gifting', 'travel'],
    'Diwali': ['gifting', 'home', 'fashion', 'jewelry', 'retail'],
    'Ganesh Chaturthi': ['food', 'gifting', 'events'],
    'Navratri': ['fashion', 'events', 'food'],
    'Eid': ['gifting', 'fashion', 'food', 'travel'],
    'Christmas': ['gifting', 'travel', 'events', 'retail'],
    'New Year': ['travel', 'events', 'retail'],
  };

  const cascadeImpacts = {
    hiringNeeded: Math.ceil(effectiveMultiplier * 5), // temp staff
    inventoryBoost: Math.round((effectiveMultiplier - 1) * 100), // % boost
    supplierNegotiation: `bulk buy at ${Math.round((effectiveMultiplier - 1) * 15)}% discount potential`,
  };

  return {
    festivalName,
    daysUntil: daysUntilFestival,
    demandMultiplier: Math.round(effectiveMultiplier * 100) / 100,
    userOverride: undefined,
    affectedCategories: affectedCategories[festivalName] || [],
    cascadeImpacts,
  };
}

// ============================================================================
// HELPER FUNCTIONS (Used by Multiple Features)
// ============================================================================

export function calculateBurnoutReduction(
  baseRisk: number,
  vibeMode: 'aggressive' | 'balanced' | 'conservative'
): number {
  if (vibeMode === 'conservative') {
    return baseRisk * 0.4; // 60% reduction
  } else if (vibeMode === 'balanced') {
    return baseRisk * 0.65; // 35% reduction
  } else {
    return baseRisk * 0.9; // 10% reduction
  }
}

// EXISTING FUNCTIONS (from original simulationEngine.ts)

export function calculateSHAPValues(features: string[], baseValue: number): Record<string, number> {
  return features.reduce(
    (acc, feature) => ({
      ...acc,
      [feature]: (baseValue * (10 + Math.random() * 20)) / 100,
    }),
    {}
  );
}

export function generateDecisionPaths(
  profile: BusinessProfile,
  agentContributions: Record<string, number>
): DecisionPath[] {
  const baseEV = profile.mrr * 1.5;

  return [
    {
      id: '1',
      name: 'Aggressive Growth',
      description: 'High-risk, high-reward growth push',
      expectedValue: baseEV * 1.4,
      probability: 0.6,
      riskScore: 65,
      timeline: 45,
      costs: { immediate: 600000, monthly: 250000 },
      benefits: { revenue: baseEV * 0.4, efficiency: 45, riskReduction: -20 },
      shapleySHAP: calculateSHAPValues(['market_size', 'team_capacity', 'competitors', 'timing'], baseEV),
      agentContributions,
    },
    {
      id: '2',
      name: 'Balanced Growth',
      description: 'Sustainable, measured expansion',
      expectedValue: baseEV,
      probability: 0.75,
      riskScore: 40,
      timeline: 30,
      costs: { immediate: 400000, monthly: 150000 },
      benefits: { revenue: baseEV * 0.25, efficiency: 35, riskReduction: 15 },
      shapleySHAP: calculateSHAPValues(['market_size', 'team_capacity', 'competitors', 'timing'], baseEV),
      agentContributions,
    },
    {
      id: '3',
      name: 'Conservative Path',
      description: 'Proven, low-risk expansion',
      expectedValue: baseEV * 0.7,
      probability: 0.85,
      riskScore: 25,
      timeline: 60,
      costs: { immediate: 250000, monthly: 100000 },
      benefits: { revenue: baseEV * 0.15, efficiency: 20, riskReduction: 35 },
      shapleySHAP: calculateSHAPValues(['market_size', 'team_capacity', 'competitors', 'timing'], baseEV),
      agentContributions,
    },
  ];
}

export function simulateMARLEpisode(
  episode: number,
  previousState: any,
  agentActions: Record<string, number>
): any {
  const convergenceTarget = 850;
  const decay = Math.pow(0.95, episode);
  const baseReward = 500 + (convergenceTarget - 500) * (1 - decay);
  const reward = baseReward + Math.random() * 50;

  return {
    episode: episode + 1,
    totalReward: Math.min(convergenceTarget, reward),
    agentRewards: {
      orchestrator: reward * 0.12,
      simulation_cluster: reward * 0.16,
      decision_intelligence: reward * 0.2,
      operations_optimizer: reward * 0.25,
      personal_coach: reward * 0.11,
      innovation_advisor: reward * 0.08,
      growth_strategist: reward * 0.1,
      learning_adaptation: reward * 0.15,
    },
    convergenceMetric: (reward / convergenceTarget) * 100,
    replayBufferSize: (episode + 1) * 10,
    policyVersion: Math.floor(episode / 10),
  };
}

export function generateOperationalMetrics(profile: BusinessProfile) {
  return {
    hiring: {
      required: 3,
      timeline: {
        'Product Engineer': { start: new Date(), end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), cost: 1500000 },
        'Growth Marketer': { start: new Date(), end: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000), cost: 1200000 },
        'Operations Manager': { start: new Date(), end: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000), cost: 1000000 },
      },
      estimatedSavings: 2500000,
    },
    inventory: {
      currentLevel: 1000,
      reorderPoint: 500,
      safetyStock: 300,
      turnoverRatio: 4.5,
    },
    suppliers: [
      { name: 'Vendor A', reliability: 95, cost: 100000, leadTime: 7, negotiationPotential: 12 },
      { name: 'Vendor B', reliability: 88, cost: 120000, leadTime: 10, negotiationPotential: 8 },
    ] as any,
    compliance: { gst: true, dpdp: true, upi: true },
    burnoutRisk: 65,
    stressFactors: ['hiring pressure', 'market timing', 'cash flow'],
  };
}
