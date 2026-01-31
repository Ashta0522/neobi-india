/**
 * NeoBI India v2.0 - Configuration Constants
 * All configurable values centralized here for easy modification
 */

// === NIFTY & Market Configuration ===
export const NIFTY_CONFIG = {
  BASE_VALUE: 23500,
  MARKET_HOURS_VOLATILITY: 150,
  CLOSED_HOURS_VOLATILITY: 20,
  UPDATE_INTERVAL_MS: 60000, // 60 seconds
  MARKET_START_HOUR: 9,
  MARKET_START_MINUTE: 15,
  MARKET_END_HOUR: 15,
  MARKET_END_MINUTE: 30,
  MARKET_DAYS: [1, 2, 3, 4, 5], // Monday-Friday
} as const;

// === Festival Configuration ===
export const FESTIVAL_CONFIG = {
  UPDATE_INTERVAL_MS: 6 * 60 * 60 * 1000, // 6 hours
  DEFAULT_DEMAND_LIFT: 35,
} as const;

// === GST & Compliance ===
export const COMPLIANCE_CONFIG = {
  GST_THRESHOLD: 2000000, // ₹20 lakh
  GST_RATE: 0.18, // 18%
  DPDP_CUSTOMER_THRESHOLD: 100,
  UPI_ADOPTION_RATE: 0.78, // 78%
} as const;

// === Industry-Specific Multipliers ===
export const INDUSTRY_MULTIPLIERS = {
  saas: {
    hiring: 0.25,
    inventory: 0,
    turnover: 0,
  },
  ecommerce: {
    hiring: 0.35,
    inventory: 2.5,
    turnover: 6.2,
  },
  manufacturing: {
    hiring: 0.40,
    inventory: 3.0,
    turnover: 4.1,
  },
  fintech: {
    hiring: 0.30,
    inventory: 0,
    turnover: 0,
  },
  services: {
    hiring: 0.20,
    inventory: 0,
    turnover: 0,
  },
} as const;

// === Regional Tier Multipliers ===
export const REGIONAL_TIERS = {
  tier1: {
    demandMultiplier: 1.5,
    costMultiplier: 1.4,
    competitionLevel: 85,
    growthPotential: 90,
    complianceBurden: 100,
  },
  tier2: {
    demandMultiplier: 1.2,
    costMultiplier: 1.1,
    competitionLevel: 60,
    growthPotential: 75,
    complianceBurden: 85,
  },
  tier3: {
    demandMultiplier: 0.9,
    costMultiplier: 0.8,
    competitionLevel: 40,
    growthPotential: 65,
    complianceBurden: 65,
  },
} as const;

// === MARL Configuration ===
export const MARL_CONFIG = {
  EPISODES: 10,
  CONVERGENCE_TARGET: 850,
  CONVERGENCE_RATE: 0.015,
  NOISE_RANGE: 50,
  BASE_REWARD: 500,
  EPISODE_DELAY_MS: 100,
} as const;

// === Agent Reward Distribution ===
export const AGENT_REWARDS = {
  orchestrator: 0.12,
  simulation_cluster: 0.16,
  decision_intelligence: 0.20,
  operations_optimizer: 0.22,
  personal_coach: 0.10,
  innovation_advisor: 0.07,
  growth_strategist: 0.09,
  learning_adaptation: 0.04,
} as const;

// === Decision Path Configuration ===
export const DECISION_PATHS = {
  aggressive: {
    probability: 0.65,
    riskScore: 72,
    timelineDays: 90,
    evMultiplier: 1.5,
    costMultiplier: 0.4,
  },
  balanced: {
    probability: 0.85,
    riskScore: 45,
    timelineDays: 180,
    evMultiplier: 1.2,
    costMultiplier: 0.3,
  },
  conservative: {
    probability: 0.95,
    riskScore: 20,
    timelineDays: 365,
    evMultiplier: 0.6,
    costMultiplier: 0.2,
  },
} as const;

// === SHAP Configuration ===
export const SHAP_CONFIG = {
  BASE_VALUE: 500,
  DEFAULT_FEATURES: ['MRR', 'Team Size', 'Market Growth', 'Seasonality', 'Competitor', 'Cash Flow'],
} as const;

// === Performance Configuration ===
export const PERFORMANCE_CONFIG = {
  GRAPH_UPDATE_INTERVAL_MS: 5000, // 5 seconds
  MAX_STORED_RESULTS: 50, // Limit simulation results in memory
  DEBOUNCE_DELAY_MS: 300,
} as const;

// === Invoice Discount Configuration ===
export const INVOICE_DISCOUNT = {
  DAYS_30: 0.01, // 1%
  DAYS_90: 0.03, // 3%
  DAYS_90_PLUS: 0.06, // 6%
} as const;

// === UI Configuration ===
export const UI_CONFIG = {
  HIRING_COST_MULTIPLIER: 0.8,
  SUPPLIER_RELIABILITY_DECLINE_PER_SUPPLIER: 0.08,
  LEAD_TIME_BASE_DAYS: 12,
  LEAD_TIME_PER_SUPPLIER_DAYS: 7,
  INVENTORY_SAFETY_STOCK_MULTIPLIER: 0.5,
  INVENTORY_REORDER_POINT_MULTIPLIER: 0.8,
  INVENTORY_CURRENT_LEVEL_MULTIPLIER: 2.5,
} as const;

// === Form Defaults ===
export const FORM_DEFAULTS = {
  MRR: 500000,
  TEAM_SIZE: 5,
  CUSTOMER_COUNT: 50,
  GROWTH_TARGET: 20,
  CITY_TIER: 1,
  LOCATION: 'Bangalore',
} as const;

// Export all
export const CONSTANTS = {
  NIFTY: NIFTY_CONFIG,
  FESTIVAL: FESTIVAL_CONFIG,
  COMPLIANCE: COMPLIANCE_CONFIG,
  INDUSTRY: INDUSTRY_MULTIPLIERS,
  REGIONAL: REGIONAL_TIERS,
  MARL: MARL_CONFIG,
  AGENTS: AGENT_REWARDS,
  PATHS: DECISION_PATHS,
  SHAP: SHAP_CONFIG,
  PERFORMANCE: PERFORMANCE_CONFIG,
  INVOICE: INVOICE_DISCOUNT,
  UI: UI_CONFIG,
  FORM: FORM_DEFAULTS,
} as const;

export default CONSTANTS;
