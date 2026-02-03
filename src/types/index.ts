// 8 Hierarchical Agents - MANDATORY SPEC
export type AgentId = 
  | 'orchestrator'
  | 'simulation_cluster'
  | 'decision_intelligence'
  | 'operations_optimizer'
  | 'personal_coach'
  | 'innovation_advisor'
  | 'growth_strategist'
  | 'learning_adaptation';

export type AgentLevel = 'L1' | 'L2' | 'L3' | 'L4';

export interface Agent {
  id: AgentId;
  name: string;
  icon: string;
  color: string;
  level: AgentLevel;
  description: string;
  status: 'idle' | 'thinking' | 'executing' | 'complete';
  contribution: number; // percentage
  lastActive: Date;
  children?: AgentId[];
  parent?: AgentId;
}

export interface BusinessProfile {
  id: string;
  name: string;
  industry: string;
  mrr: number; // Monthly Recurring Revenue in ₹
  customers: number;
  location: string; // India region
  teamSize: number;
  foundedDate: Date;
  growthTarget: number; // % annually
  riskTolerance: 'low' | 'medium' | 'high';
  vibeMode: 'aggressive' | 'balanced' | 'conservative';
}

export interface DecisionPath {
  id: string;
  name: string;
  description: string;
  expectedValue: number;
  probability: number;
  riskScore: number; // 0-100
  timeline: number; // days
  costs: {
    immediate: number;
    monthly: number;
  };
  benefits: {
    revenue: number;
    efficiency: number;
    riskReduction: number;
  };
  shapleySHAP: Record<string, number>;
  agentContributions: Record<AgentId, number>;
  subDecisions?: DecisionPath[];
  selected?: boolean;
  steps?: string[]; // Implementation steps
  risks?: string[]; // Risk factors
}

export interface SimulationResult {
  id: string;
  timestamp: Date;
  profile: BusinessProfile;
  query: string;
  paths: DecisionPath[];
  recommendation: DecisionPath;
  marlState: MARLState;
  confidence: number; // 0-100
  executionTime: number; // ms
  costUsed: number; // ₹ always 0
  // NEW: Tier 2/3 optional fields
  cascadingPaths?: CascadingPath[];
  rewardDecomposition?: RewardDecomposition;
  curriculumLevels?: CurriculumLevel[];
  burnoutTrajectory?: BurnoutTrajectory;
  confidenceDistribution?: ConfidenceDistribution;
  ablationStudy?: AblationStudy[];
  competitorHeatmap?: CompetitorHeatmap[];
  fraudRisk?: UFraudRiskScore;
}

export interface MARLState {
  episode: number;
  totalReward: number;
  agentRewards: Record<AgentId, number>;
  convergenceMetric: number; // 0-100
  replayBufferSize: number;
  policyVersion: number;
}

export interface OperationalMetrics {
  hiring: {
    required: number;
    timeline: { [role: string]: { start: Date; end: Date; cost: number } };
    estimatedSavings: number;
  };
  inventory: {
    currentLevel: number;
    reorderPoint: number;
    safetyStock: number;
    turnoverRatio: number;
  };
  suppliers: [
    {
      name: string;
      reliability: number; // 0-100
      cost: number;
      leadTime: number; // days
      negotiationPotential: number; // 0-100
    }
  ];
  compliance: {
    gst: boolean;
    dpdp: boolean;
    upi: boolean;
  };
  burnoutRisk: number; // 0-100
  stressFactors: string[];
}

export interface IndiaContext {
  niftyLive: {
    value: number;
    change: number;
    changePercent: number;
    timestamp: Date;
  };
  festivalCountdown: {
    next: string;
    daysUntil: number;
    expectedDemandLift: number; // %
  };
  marketHours: {
    isOpen: boolean;
    nextOpen: Date;
  };
  gstRate: number; // %
  dpdpStatus: string; // compliance status
  upiAdoption: number; // % of merchants
}

export interface GraphData {
  marlConvergence: {
    episodes: number[];
    rewards: number[];
    mean: number[];
    stdDev: number[];
  };
  worldModelAccuracy: {
    horizons: number[];
    mae: number[];
    rmse: number[];
  };
  shapBeeswarm: {
    features: string[];
    shapValues: number[];
    baseValue: number;
  };
  cashFlowProjection: {
    months: string[];
    path1: number[];
    path2: number[];
    path3: number[];
    ci_lower: number[];
    ci_upper: number[];
  };
  hiringGantt: {
    role: string;
    start: Date;
    end: Date;
    cost: number;
  }[];
  supplierScorecard: {
    name: string;
    reliability: number;
    cost: number;
  }[];
  inventoryTurnover: {
    months: string[];
    turnover: number[];
    reorderPoint: number;
  };
  competitorHeatmap: {
    scenario: string;
    aggressiveScore: number;
    conservativeScore: number;
    innovativeScore: number;
  }[];
  burnoutRisk: {
    mode: string;
    riskReduction: number;
  }[];
  agentContribution: {
    agent: AgentId;
    contribution: number;
  }[];
  confidenceDistribution: {
    bins: string[];
    count: number[];
  };
}

export interface AssessmentMetrics {
  taskCompletionRate: number; // 0-100
  decisionQuality: number; // 0-100
  adaptationRate: number; // episodes to optimal
  latencyFirst: number; // ms
  latencyCached: number; // ms
  burnoutRiskReduction: number; // %
  revenueProjAccuracy: number; // MAE %
  cacheHitRate: number; // %
  costPerQuery: number; // ₹ always 0
}

// NEW TYPES FOR MISSING FEATURES

// Cascading paths - multi-level decision trees
export interface CascadingPath extends DecisionPath {
  parentId?: string;
  level: number; // 0 = top-level, 1 = execution options, 2 = detailed tactics
  executionOptions?: {
    budgetSplit: { component: string; allocation: number }[]; // % breakdown
    timelineOptions: { aggressive: number; balanced: number; conservative: number }; // days
    channelMix: { channel: string; weightage: number }[]; // % by channel
    aTestVariants: { variant: string; expectedLift: number }[]; // A/B test options
    hiringSupplierAdjustments: { role: string; quantity: number; cost: number }[]; // hiring/supplier tweaks
  };
  breadcrumbPath: string[]; // e.g. ["Level 1", "Balanced Growth", "Execution Options"]
}

// Reward decomposition breakdown
export interface RewardDecomposition {
  totalReward: number;
  components: {
    revenue: number; // % contribution to total reward
    riskReduction: number; // % (negative if risk increases)
    burnoutMitigation: number; // % (negative if burnout increases)
    operationalEfficiency: number; // %
    complianceScore: number; // %
  };
  timestamp: Date;
}

// Curriculum learning across levels
export interface CurriculumLevel {
  level: number; // 1 (single-decision), 2 (sequential), 3 (multi-agent)
  description: string;
  episodes: number[];
  rewards: number[];
  convergenceMetric: number[];
  agentContributions: Record<AgentId, number>;
}

// Burnout trajectory over time
export interface BurnoutTrajectory {
  timestamp: Date[];
  baselineRisk: number[];
  afterPathRisk: number[]; // after selected path's adjustments
  vibeMode: 'aggressive' | 'balanced' | 'conservative';
  trajectory: 'improving' | 'stable' | 'worsening';
}

// Confidence distribution from ensemble
export interface ConfidenceDistribution {
  bins: number[]; // e.g. [60, 70, 80, 90, 95]
  counts: number[]; // count in each bin
  mean: number; // average confidence
  stdDev: number;
  minConfidence: number;
  maxConfidence: number;
}

// Ablation study - performance without each component
export interface AblationStudy {
  component: string; // 'MARL', 'SHAP', 'Coach', 'Simulation', etc.
  performanceWithout: number; // metric value without component
  performanceWith: number; // metric value with component
  dropPercentage: number; // (with - without) / with * 100
}

// Competitor response heatmap
export interface CompetitorHeatmap {
  yourAction: string; // e.g. 'price cut', 'feature launch'
  competitorPersonality: 'aggressive' | 'conservative' | 'innovative';
  revenueImpact: number; // ₹ impact
  revenueImpactPercent: number; // % vs baseline
  likelihood: number; // 0-100
  timeline: number; // days to response
}

// Jugaad history with evolution
export interface JugaadIdea {
  id: string;
  createdAt: Date;
  title?: string; // Optional short title for display
  description: string;
  feasibilityScore: number; // 0-100
  potentialImpact: number; // ₹ or %
  category: string; // 'partnership', 'frugal', 'pivot', 'growth-hack'
  userFeedback: 'thumbs_up' | 'thumbs_down' | 'neutral' | null;
  generation: number; // 0 = original, 1+ = evolved
  parentId?: string; // if evolved from another idea
  // Backwards-compatible aliases used by some components
  feasibility?: number; // alias for feasibilityScore
  impact?: number; // alias for potentialImpact
  mutations?: number; // number of mutation steps applied
  successRate?: number; // 0-100
}

export interface JugaadHistory {
  ideas: JugaadIdea[];
  evolutionLog: {
    parentId: string;
    mutation: string; // description of what changed
    newIdeaId: string;
    timestamp: Date;
  }[];
}

// UPI fraud risk simulation result
export interface UFraudRiskScore {
  score: number; // 0-100
  fraudAttempts: number; // simulated per 10k transactions
  defenseLevel: number; // 0-100
  mitigationStrategies: string[];
  estimatedLoss: number; // ₹ expected loss per 10k txns
}

// Regional adjustment factor
export interface RegionalAdjustment {
  cityTier: 1 | 2 | 3; // 1 = metro, 2 = tier-2, 3 = tier-3
  demandMultiplier: number; // e.g. 1.0, 0.75, 0.60
  hiringCostMultiplier: number;
  supplierCostMultiplier: number;
  complianceBurden: number; // 0-100 (higher = more burden)
  msmeEligibility: boolean;
  regionalNote: string; // e.g. "Tier-1 HITEC City uplift: +18% vs national average"
}

// Festival demand multiplier
export interface FestivalMultiplier {
  festivalName: string;
  daysUntil: number;
  demandMultiplier: number; // e.g. 2.5 for Diwali
  userOverride?: number; // user can adjust
  affectedCategories: string[]; // e.g. ['retail', 'food', 'gifting']
  cascadeImpacts: {
    hiringNeeded: number; // temp staff
    inventoryBoost: number; // %
    supplierNegotiation: string; // e.g. "bulk buy at +15% discount"
  };
}

// Audit log for full observability
export interface AuditLogEntry {
  timestamp: Date;
  action: string;
  details: Record<string, any>;
  agent?: AgentId;
  inputData?: Record<string, unknown>;
  outputData?: Record<string, unknown>;
  stateChange?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  executionTime?: number; // ms
}

// Extended business profile with new fields
export interface BusinessProfileExtended extends BusinessProfile {
  cityTier: 1 | 2 | 3; // NEW: regional tier
  partnershipsCount: number; // NEW: for jugaad
  jugaadHistoryId?: string; // NEW: link to jugaad history
  upiEnabled: boolean; // NEW: for fraud sim
  gstRegistered: boolean; // NEW: for compliance
  dpdpCompliant: boolean; // NEW: for compliance
}
