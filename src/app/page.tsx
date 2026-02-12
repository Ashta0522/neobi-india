'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNeoBIStore } from '@/lib/store';
import { BusinessProfile, SimulationResult, MARLState, JugaadIdea, RewardDecomposition, CurriculumLevel, AblationStudy, BurnoutTrajectory, ConfidenceDistribution, DecisionPath } from '@/types';
import { generateDecisionPaths, simulateMARLEpisode } from '@/utils/simulationEngine';
import { LiveTickerBar } from '@/components/LiveTickerBar';
import { AgentActivityTree } from '@/components/AgentActivityTree';
import { ControlBar } from '@/components/ControlBar';
import { MARLConvergenceCurve, CashFlowProjectionChart } from '@/components/Graphs';
import { SHAPBeeswarm, AgentContributionPie, ConfidenceDistributionHistogram, BurnoutRiskChart } from '@/components/AdvancedGraphs';
import { OperationsPanel } from '@/components/OperationsPanel';
import { RiskAndCoachPanel } from '@/components/RiskAndCoachPanel';
import { MetricsAndExportBar } from '@/components/MetricsAndExportBar';
import { MRRHealthPulse } from '@/components/MRRHealthPulse';
import {
  FullPageRoadmap, CompliancePanel, UFraudRiskSimulator,
  RewardDecompositionChart, CurriculumBreakdown, AblationStudyChart,
  BurnoutTrajectoryChart, InvoiceDiscountCalculator,
  BurnoutMitigationPathways, AdvancedAuditTrail, SelfEvolvingJugaadGenerator,
  RegionalInequalityAdjustment, FestivalAwareDemandMultiplier,
} from '@/components';
import GSTComplianceChecker from '@/components/GSTComplianceChecker';
import FundingReadinessScore from '@/components/FundingReadinessScore';
import SupplierRiskMap from '@/components/SupplierRiskMap';
import MarketEntrySimulator from '@/components/MarketEntrySimulator';
import CashFlowPredictor from '@/components/CashFlowPredictor';
import SeasonalWorkforcePlanner from '@/components/SeasonalWorkforcePlanner';
import { InventoryControlPanel, StaffHiringPanel, SupplierFinderPanel } from '@/components/OperationalTools';
// NEW v2.2 Features
import IntegrationDashboard from '@/components/IntegrationDashboard';
import CompetitorBenchmark from '@/components/CompetitorBenchmark';
import ExcelExport from '@/components/ExcelExport';
import VoiceInput from '@/components/VoiceInput';
import WhatsAppShare from '@/components/WhatsAppShare';
import LanguageSelector, { useLanguage } from '@/components/LanguageSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronLeft, ChevronRight, Map, Search, ArrowRight, Check, AlertTriangle, TrendingUp, Shield, Calculator, BarChart3, Users, Target, Lightbulb, Brain, Info, Maximize2, X } from 'lucide-react';

// Fallback data
const FALLBACK_REWARD_DECOMPOSITION: RewardDecomposition = {
  totalReward: 850,
  components: { revenue: 35, riskReduction: 20, burnoutMitigation: 15, operationalEfficiency: 22, complianceScore: 8 },
  timestamp: new Date(),
};
const FALLBACK_CONFIDENCE_DISTRIBUTION: ConfidenceDistribution = {
  bins: [60, 70, 80, 90, 95], counts: [2, 3, 5, 3, 2], mean: 84, stdDev: 8, minConfidence: 72, maxConfidence: 94,
};
const FALLBACK_ABLATION_STUDY: AblationStudy[] = [
  { component: 'MARL', performanceWithout: 64, performanceWith: 92, dropPercentage: 30.4 },
  { component: 'SHAP', performanceWithout: 73, performanceWith: 92, dropPercentage: 20.7 },
  { component: 'Personal Coach', performanceWithout: 80, performanceWith: 92, dropPercentage: 13 },
  { component: 'Simulation', performanceWithout: 75, performanceWith: 92, dropPercentage: 18.5 },
];
const FALLBACK_BURNOUT_TRAJECTORY: BurnoutTrajectory = {
  timestamp: Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i * 5); return d; }),
  baselineRisk: [65, 69, 73, 77, 81, 85, 88],
  afterPathRisk: [42, 45, 48, 50, 52, 54, 55],
  vibeMode: 'balanced',
  trajectory: 'improving',
};
const FALLBACK_CURRICULUM_LEVELS: CurriculumLevel[] = [
  { level: 1, description: 'Single-Decision', episodes: [0, 10, 20, 30], rewards: [400, 520, 620, 700], convergenceMetric: [0, 30, 60, 85], agentContributions: { orchestrator: 15, simulation_cluster: 20, decision_intelligence: 30, operations_optimizer: 15, personal_coach: 5, innovation_advisor: 5, growth_strategist: 5, learning_adaptation: 5 } },
  { level: 2, description: 'Sequential', episodes: [0, 15, 30], rewards: [500, 650, 780], convergenceMetric: [0, 50, 90], agentContributions: { orchestrator: 12, simulation_cluster: 22, decision_intelligence: 28, operations_optimizer: 18, personal_coach: 6, innovation_advisor: 6, growth_strategist: 4, learning_adaptation: 4 } },
  { level: 3, description: 'Multi-Agent', episodes: [0, 20], rewards: [600, 820], convergenceMetric: [0, 75], agentContributions: { orchestrator: 10, simulation_cluster: 25, decision_intelligence: 25, operations_optimizer: 20, personal_coach: 5, innovation_advisor: 5, growth_strategist: 5, learning_adaptation: 5 } },
];

// Tier 2/3 Fallback Data
const FALLBACK_BURNOUT_MITIGATION = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  baseline: 45 + i * 1.5 + Math.random() * 5,
  withPathA: Math.max(20, 45 - i * 0.5 + Math.random() * 3),
  withPathB: Math.max(25, 45 - i * 0.3 + Math.random() * 4),
  withPathC: Math.max(30, 45 - i * 0.1 + Math.random() * 5),
  threshold: 70,
}));

const FALLBACK_REGIONAL_DATA = [
  { tier: 1 as const, cities: ['Mumbai', 'Delhi', 'Bangalore'], demandMultiplier: 1.4, costMultiplier: 1.6, competitionLevel: 85, growthPotential: 65, marketSize: 1000000, averageRevenue: 850000 },
  { tier: 2 as const, cities: ['Pune', 'Ahmedabad', 'Jaipur'], demandMultiplier: 1.2, costMultiplier: 1.2, competitionLevel: 60, growthPotential: 80, marketSize: 500000, averageRevenue: 420000 },
  { tier: 3 as const, cities: ['Indore', 'Nagpur', 'Vadodara'], demandMultiplier: 1.0, costMultiplier: 0.8, competitionLevel: 35, growthPotential: 90, marketSize: 200000, averageRevenue: 180000 },
];

const FALLBACK_FESTIVALS = [
  { name: "Valentine's Day", date: '2026-02-14', daysUntil: 12, baseMultiplier: 1.3, peakMultiplier: 2.5, demandCurve: [{ day: 14, multiplier: 1.2 }, { day: 7, multiplier: 1.8 }, { day: 3, multiplier: 2.2 }, { day: 1, multiplier: 2.5 }, { day: 0, multiplier: 2.0 }], affectedCategories: ['Gifts', 'Flowers', 'Chocolates', 'Restaurants'], historicalSales: 180000 },
  { name: 'Holi', date: '2026-03-03', daysUntil: 29, baseMultiplier: 1.5, peakMultiplier: 3.0, demandCurve: [{ day: 10, multiplier: 1.3 }, { day: 5, multiplier: 2.0 }, { day: 2, multiplier: 2.7 }, { day: 0, multiplier: 3.0 }], affectedCategories: ['Colors', 'Water Guns', 'Sweets', 'Beverages'], historicalSales: 220000 },
  { name: 'Diwali', date: '2026-11-08', daysUntil: 279, baseMultiplier: 1.5, peakMultiplier: 3.5, demandCurve: [{ day: 14, multiplier: 1.2 }, { day: 7, multiplier: 2.0 }, { day: 3, multiplier: 3.0 }, { day: 1, multiplier: 3.5 }, { day: 0, multiplier: 2.5 }], affectedCategories: ['Electronics', 'Clothing', 'Sweets', 'Home Decor'], historicalSales: 500000 },
];

const FALLBACK_JUGAAD_IDEAS = [
  { id: '1', title: 'WhatsApp-based CRM', description: 'Use WhatsApp Business API for customer relationship management', generation: 1, category: 'technology', feasibility: 85, impact: 70 },
  { id: '2', title: 'Shared Delivery Network', description: 'Partner with local kirana stores for last-mile delivery', generation: 2, category: 'operations', feasibility: 90, impact: 65 },
  { id: '3', title: 'Festival Pop-up Strategy', description: 'Temporary stalls during peak festival seasons', generation: 3, category: 'marketing', feasibility: 80, impact: 75 },
];

const FALLBACK_AUDIT_ENTRIES = [
  { timestamp: new Date(Date.now() - 300000), action: 'simulation-complete', details: { paths: 3, confidence: 92 }, status: 'success' as const },
  { timestamp: new Date(Date.now() - 600000), action: 'profile-created', details: { industry: 'SaaS' }, status: 'success' as const },
  { timestamp: new Date(Date.now() - 900000), action: 'agent-override-warning', details: { agent: 'risk_analyzer', reason: 'High volatility detected' }, status: 'warning' as const },
];

// NEW FEATURE FALLBACK DATA
const FALLBACK_GST_DATA = {
  gstNumber: '27AABCU9603R1ZM',
  filingStatus: 'pending' as const,
  lastFiledDate: '2026-01-20',
  nextDueDate: '2026-02-20',
  pendingReturns: [
    { type: 'GSTR-1', period: 'Jan 2026', dueDate: '2026-02-11', status: 'filed' as const },
    { type: 'GSTR-3B', period: 'Jan 2026', dueDate: '2026-02-20', status: 'pending' as const },
    { type: 'GSTR-9', period: 'FY 2024-25', dueDate: '2026-03-31', status: 'pending' as const, penalty: 5000 },
  ],
  complianceScore: 78,
  totalTaxLiability: 245000,
  inputTaxCredit: 180000,
  alerts: [
    { type: 'warning' as const, message: 'GSTR-3B due in 18 days - file before 20th Feb to avoid late fees' },
    { type: 'info' as const, message: 'ITC reconciliation pending for 3 invoices worth ₹45,000' },
    { type: 'error' as const, message: 'GSTR-9 filing overdue - penalty accruing daily' },
  ],
};

const FALLBACK_FUNDING_DATA = {
  overallScore: 72,
  fundingStage: 'Seed' as const,
  metrics: {
    revenueGrowth: 75, marketSize: 80, teamStrength: 65, productMarketFit: 78,
    unitEconomics: 60, competitiveAdvantage: 70, scalability: 85, financialHealth: 68,
  },
  strengths: ['Strong month-over-month growth (15%)', 'Large addressable market in India', 'Scalable tech stack'],
  improvements: ['Unit economics need optimization', 'Team gaps in sales leadership', 'Longer runway recommended'],
  estimatedValuation: { min: 50000000, max: 80000000 },
  investorMatch: [
    { name: 'Sequoia Surge', fit: 85, focus: 'Early-stage SaaS' },
    { name: 'Blume Ventures', fit: 78, focus: 'B2B India' },
    { name: 'Accel India', fit: 72, focus: 'Series A ready' },
  ],
  recommendations: ['Hire VP Sales in next quarter', 'Improve gross margins to 70%+', 'Document customer success stories'],
};

// Industry-specific supplier generator
function getIndustrySuppliers(industry: string) {
  const industryKey = (industry || '').toLowerCase().replace(/[^a-z]/g, '');
  const configs: Record<string, { suppliers: any[]; topRisks: any[]; alts: any[] }> = {
    realestate: {
      suppliers: [
        { id: '1', name: 'UltraTech Cement', location: 'Mumbai', state: 'Maharashtra', riskScore: 12, reliabilityScore: 94, leadTime: 5, costIndex: 80, category: 'Cement & Concrete', dependencies: 4, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '2', name: 'ACC Readymix', location: 'Hyderabad', state: 'Telangana', riskScore: 18, reliabilityScore: 90, leadTime: 3, costIndex: 85, category: 'Concrete Supply', dependencies: 3, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '3', name: 'Jindal Steel', location: 'Raigarh', state: 'Chhattisgarh', riskScore: 22, reliabilityScore: 88, leadTime: 10, costIndex: 78, category: 'Steel & TMT Bars', dependencies: 5, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '4', name: 'Local Sand Supplier', location: 'Pune', state: 'Maharashtra', riskScore: 60, reliabilityScore: 58, leadTime: 2, costIndex: 45, category: 'Sand & Aggregates', dependencies: 2, lastDeliveryStatus: 'delayed' as const, alerts: ['Mining ban risk in monsoon', 'Quality inconsistency reported'] },
      ],
      topRisks: [
        { risk: 'Sand & aggregate supply disruption during monsoon', impact: 'Construction halt for 2-4 weeks', mitigation: 'Pre-stock materials before monsoon season' },
        { risk: 'Steel price volatility', impact: '10-15% cost overrun on structural work', mitigation: 'Lock in quarterly price contracts with suppliers' },
      ],
      alts: [{ name: 'Ambuja Cement', state: 'Gujarat', riskScore: 15 }, { name: 'SAIL Steel', state: 'Jharkhand', riskScore: 20 }],
    },
    saas: {
      suppliers: [
        { id: '1', name: 'AWS India', location: 'Mumbai', state: 'Maharashtra', riskScore: 8, reliabilityScore: 99, leadTime: 0, costIndex: 75, category: 'Cloud Infrastructure', dependencies: 6, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '2', name: 'Razorpay', location: 'Bangalore', state: 'Karnataka', riskScore: 12, reliabilityScore: 96, leadTime: 1, costIndex: 65, category: 'Payment Gateway', dependencies: 3, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '3', name: 'SendGrid/Postmark', location: 'Remote', state: 'International', riskScore: 15, reliabilityScore: 95, leadTime: 0, costIndex: 50, category: 'Email & Comms', dependencies: 2, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '4', name: 'Freelance Dev Pool', location: 'Pune', state: 'Maharashtra', riskScore: 55, reliabilityScore: 65, leadTime: 7, costIndex: 40, category: 'Contract Development', dependencies: 2, lastDeliveryStatus: 'delayed' as const, alerts: ['Talent retention risk', 'Quality variance across contractors'] },
      ],
      topRisks: [
        { risk: 'Cloud vendor lock-in with single provider', impact: 'Migration costs if pricing changes', mitigation: 'Adopt multi-cloud strategy or containerize workloads' },
        { risk: 'Third-party API deprecation', impact: 'Feature breakage for end users', mitigation: 'Build abstraction layers over external APIs' },
      ],
      alts: [{ name: 'Google Cloud India', state: 'Maharashtra', riskScore: 10 }, { name: 'Cashfree Payments', state: 'Karnataka', riskScore: 14 }],
    },
    ecommerce: {
      suppliers: [
        { id: '1', name: 'Delhivery', location: 'Gurgaon', state: 'Haryana', riskScore: 18, reliabilityScore: 88, leadTime: 3, costIndex: 70, category: 'Logistics & Shipping', dependencies: 5, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '2', name: 'Packaging Solutions India', location: 'Noida', state: 'UP', riskScore: 25, reliabilityScore: 82, leadTime: 5, costIndex: 55, category: 'Packaging Materials', dependencies: 3, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '3', name: 'Shiprocket', location: 'Delhi', state: 'Delhi', riskScore: 20, reliabilityScore: 85, leadTime: 2, costIndex: 60, category: 'Multi-Courier Aggregator', dependencies: 4, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '4', name: 'Local Warehouse Operator', location: 'Mumbai', state: 'Maharashtra', riskScore: 50, reliabilityScore: 68, leadTime: 1, costIndex: 45, category: 'Warehousing', dependencies: 2, lastDeliveryStatus: 'delayed' as const, alerts: ['Space constraints during festival season', 'Inventory mismatch reported'] },
      ],
      topRisks: [
        { risk: 'Last-mile delivery failures during peak demand', impact: '15-20% order returns', mitigation: 'Partner with multiple courier services for redundancy' },
        { risk: 'Inventory stockout during festival season', impact: 'Lost sales of 25-30%', mitigation: 'Implement demand forecasting and pre-stock 6 weeks ahead' },
      ],
      alts: [{ name: 'Blue Dart', state: 'Maharashtra', riskScore: 15 }, { name: 'Ekart Logistics', state: 'Karnataka', riskScore: 18 }],
    },
    healthcare: {
      suppliers: [
        { id: '1', name: 'Medline India', location: 'Chennai', state: 'Tamil Nadu', riskScore: 15, reliabilityScore: 91, leadTime: 5, costIndex: 80, category: 'Medical Supplies', dependencies: 4, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '2', name: 'Cipla Pharma', location: 'Mumbai', state: 'Maharashtra', riskScore: 10, reliabilityScore: 95, leadTime: 7, costIndex: 85, category: 'Pharmaceuticals', dependencies: 3, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '3', name: 'BPL Medical', location: 'Bangalore', state: 'Karnataka', riskScore: 20, reliabilityScore: 88, leadTime: 14, costIndex: 90, category: 'Medical Equipment', dependencies: 2, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '4', name: 'Local Lab Reagent Supplier', location: 'Hyderabad', state: 'Telangana', riskScore: 55, reliabilityScore: 60, leadTime: 10, costIndex: 50, category: 'Lab Consumables', dependencies: 2, lastDeliveryStatus: 'delayed' as const, alerts: ['Expiry date management issues', 'Cold chain compliance gaps'] },
      ],
      topRisks: [
        { risk: 'Cold chain disruption for temperature-sensitive supplies', impact: 'Spoilage and regulatory non-compliance', mitigation: 'Install IoT monitoring on cold storage units' },
        { risk: 'Drug regulatory changes (CDSCO)', impact: 'Supply delays for 4-8 weeks', mitigation: 'Maintain buffer stock of critical medications' },
      ],
      alts: [{ name: 'Stryker India', state: 'Maharashtra', riskScore: 12 }, { name: 'Sutures India', state: 'Karnataka', riskScore: 18 }],
    },
    foodbeverage: {
      suppliers: [
        { id: '1', name: 'ITC Agri Business', location: 'Kolkata', state: 'West Bengal', riskScore: 12, reliabilityScore: 93, leadTime: 3, costIndex: 75, category: 'Raw Ingredients', dependencies: 4, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '2', name: 'Amul Dairy', location: 'Anand', state: 'Gujarat', riskScore: 10, reliabilityScore: 96, leadTime: 2, costIndex: 70, category: 'Dairy & Milk Products', dependencies: 3, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '3', name: 'Zomato Hyperpure', location: 'Gurgaon', state: 'Haryana', riskScore: 22, reliabilityScore: 84, leadTime: 1, costIndex: 65, category: 'Kitchen Supplies', dependencies: 3, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '4', name: 'Local Vegetable Mandi', location: 'Local', state: 'Local', riskScore: 45, reliabilityScore: 70, leadTime: 0, costIndex: 35, category: 'Fresh Produce', dependencies: 2, lastDeliveryStatus: 'delayed' as const, alerts: ['Seasonal price spikes', 'Quality varies by season'] },
      ],
      topRisks: [
        { risk: 'Seasonal price volatility for fresh produce', impact: '20-40% cost increase during off-season', mitigation: 'Contract farming or fixed-price agreements with farmers' },
        { risk: 'FSSAI compliance and food safety audit failures', impact: 'License suspension risk', mitigation: 'Regular internal audits and staff FSSAI training' },
      ],
      alts: [{ name: 'BigBasket B2B', state: 'Karnataka', riskScore: 18 }, { name: 'Udaan', state: 'Karnataka', riskScore: 22 }],
    },
    kiranagrocery: {
      suppliers: [
        { id: '1', name: 'Udaan Wholesale', location: 'Bangalore', state: 'Karnataka', riskScore: 15, reliabilityScore: 88, leadTime: 1, costIndex: 60, category: 'FMCG & Staples', dependencies: 4, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '2', name: 'Metro Cash & Carry', location: 'Hyderabad', state: 'Telangana', riskScore: 12, reliabilityScore: 92, leadTime: 0, costIndex: 65, category: 'Wholesale Groceries', dependencies: 3, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '3', name: 'JioMart B2B', location: 'Mumbai', state: 'Maharashtra', riskScore: 18, reliabilityScore: 85, leadTime: 1, costIndex: 58, category: 'Digital Wholesale', dependencies: 3, lastDeliveryStatus: 'on-time' as const, alerts: [] },
        { id: '4', name: 'Local APMC Vendor', location: 'Local', state: 'Local', riskScore: 40, reliabilityScore: 72, leadTime: 0, costIndex: 40, category: 'Fresh & Perishables', dependencies: 2, lastDeliveryStatus: 'on-time' as const, alerts: ['Price fluctuation risk'] },
      ],
      topRisks: [
        { risk: 'FMCG stock expiry management', impact: 'Dead stock loss of 3-5% revenue', mitigation: 'FIFO inventory system and near-expiry discounting' },
        { risk: 'Competition from quick-commerce (Blinkit, Zepto)', impact: 'Customer attrition', mitigation: 'Add home delivery, loyalty programs, and exclusive local products' },
      ],
      alts: [{ name: 'Walmart/Flipkart B2B', state: 'Karnataka', riskScore: 15 }, { name: 'Reliance Market', state: 'Maharashtra', riskScore: 14 }],
    },
  };
  // Map alternative industry names
  const keyMap: Record<string, string> = {
    'realestate': 'realestate', 'real estate': 'realestate',
    'saas': 'saas', 'fintech': 'saas', 'edtech': 'saas',
    'ecommerce': 'ecommerce', 'e-commerce': 'ecommerce', 'd2cfashion': 'ecommerce', 'd2c fashion': 'ecommerce', 'retail': 'ecommerce',
    'healthcare': 'healthcare', 'beautywellness': 'healthcare', 'beauty & wellness': 'healthcare',
    'foodbeverage': 'foodbeverage', 'food & beverage': 'foodbeverage',
    'kiranagrocery': 'kiranagrocery', 'kirana/grocery': 'kiranagrocery',
    'manufacturing': 'realestate', 'logistics': 'ecommerce', 'consulting': 'saas',
  };
  const key = keyMap[industryKey] || keyMap[industry?.toLowerCase()] || 'saas';
  const config = configs[key] || configs.saas;
  const s = config.suppliers;
  return {
    suppliers: s,
    overallRiskScore: Math.round(s.reduce((a, b) => a + b.riskScore, 0) / s.length),
    highRiskCount: s.filter(x => x.riskScore >= 50).length,
    avgLeadTime: Math.round(s.reduce((a, b) => a + b.leadTime, 0) / s.length),
    topRisks: config.topRisks,
    alternativeSuppliers: config.alts,
  };
}

const FALLBACK_MARKET_ENTRY = {
  targetState: {
    name: 'Karnataka', code: 'KA', tier: 'Tier 1' as const, population: 67, gdpPerCapita: 285000,
    marketSize: 45000, competitionLevel: 'High' as const, regulatoryEase: 78, infrastructureScore: 82,
    digitalPenetration: 72, laborCost: 85, entryBarriers: ['High competition', 'Established players'],
    keyIndustries: ['IT/ITES', 'Biotechnology', 'Aerospace'], recommendedEntry: 'Partner with local distributor, focus on Bangalore first',
  },
  alternativeStates: [
    { name: 'Tamil Nadu', code: 'TN', tier: 'Tier 1' as const, population: 77, gdpPerCapita: 265000, marketSize: 42000, competitionLevel: 'High' as const, regulatoryEase: 75, infrastructureScore: 80, digitalPenetration: 68, laborCost: 75, entryBarriers: ['Language barrier'], keyIndustries: ['Auto', 'Manufacturing'], recommendedEntry: 'Direct entry with local team' },
    { name: 'Telangana', code: 'TS', tier: 'Tier 1' as const, population: 38, gdpPerCapita: 275000, marketSize: 28000, competitionLevel: 'Medium' as const, regulatoryEase: 82, infrastructureScore: 78, digitalPenetration: 70, laborCost: 70, entryBarriers: ['Emerging market'], keyIndustries: ['Pharma', 'IT'], recommendedEntry: 'Hyderabad-first strategy' },
    { name: 'Gujarat', code: 'GJ', tier: 'Tier 1' as const, population: 70, gdpPerCapita: 255000, marketSize: 38000, competitionLevel: 'Medium' as const, regulatoryEase: 85, infrastructureScore: 85, digitalPenetration: 62, laborCost: 65, entryBarriers: ['Business culture difference'], keyIndustries: ['Chemicals', 'Textiles', 'Pharma'], recommendedEntry: 'GIFT City as entry point' },
  ],
  projectedROI: [
    { month: 3, conservative: -15, moderate: -8, aggressive: 5 },
    { month: 6, conservative: -5, moderate: 10, aggressive: 25 },
    { month: 9, conservative: 8, moderate: 22, aggressive: 45 },
    { month: 12, conservative: 18, moderate: 35, aggressive: 65 },
  ],
  investmentRequired: { min: 1500000, max: 3000000 },
  breakEvenMonths: 9,
  riskFactors: [
    { factor: 'Competition from established players', severity: 'High' as const, mitigation: 'Differentiate on pricing and service' },
    { factor: 'Regulatory compliance costs', severity: 'Medium' as const, mitigation: 'Partner with local CA firm' },
  ],
  successProbability: 68,
  recommendations: ['Start with Bangalore IT corridor', 'Build local partnerships first', 'Allocate 20% budget for marketing'],
};

// Cash flow derived from user's MRR and team size
function getCashFlowFromProfile(mrr: number, teamSize: number, industry: string) {
  const monthlyInflow = mrr;
  const avgSalary = 50000; // avg monthly salary per team member
  const salaryBurn = teamSize * avgSalary;
  const opsBurn = Math.round(mrr * 0.15);
  const marketingBurn = Math.round(mrr * 0.10);
  const otherBurn = Math.round(mrr * 0.05);
  const totalBurn = salaryBurn + opsBurn + marketingBurn + otherBurn;
  const netMonthly = monthlyInflow - totalBurn;
  const currentBalance = Math.round(mrr * 3); // estimated 3 months of MRR as working capital
  const runway = totalBurn > 0 ? Math.max(1, Math.round(currentBalance / totalBurn)) : 12;
  const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026'];
  let bal = Math.round(currentBalance + mrr * 0.5); // start slightly higher
  const history = months.map((period, i) => {
    const growthFactor = 1 + (i < 3 ? -0.02 + i * 0.01 : 0.02 * (i - 2));
    const inflow = Math.round(monthlyInflow * growthFactor);
    const outflow = Math.round(totalBurn * (1 + (i > 3 ? 0.02 : 0)));
    const nf = inflow - outflow;
    bal = Math.round(bal + nf);
    return { period, inflow, outflow, netFlow: nf, balance: bal, predicted: i >= 3 };
  });
  const proj30 = history[4]?.balance || currentBalance;
  const proj60 = history[5]?.balance || currentBalance;
  const proj90 = history[6]?.balance || currentBalance;
  const alerts: Array<{ type: 'warning' | 'danger' | 'info'; message: string; date?: string }> = [];
  if (runway < 6) alerts.push({ type: 'warning', message: `Runway is ${runway} months - consider fundraising or reducing burn`, date: 'Feb 2026' });
  if (netMonthly < 0) alerts.push({ type: 'danger', message: `Monthly burn exceeds revenue by ₹${Math.abs(netMonthly).toLocaleString('en-IN')}`, date: 'Immediate' });
  alerts.push({ type: 'info', message: 'Festival seasons typically see 20% higher collections', date: 'Q4 2026' });
  return {
    currentBalance,
    projectedBalance30: proj30,
    projectedBalance60: proj60,
    projectedBalance90: proj90,
    burnRate: totalBurn,
    runway,
    cashFlowHistory: history,
    inflowCategories: [
      { category: 'Primary Revenue', amount: Math.round(mrr * 0.65), percentage: 65, trend: 'up' as const },
      { category: 'Services', amount: Math.round(mrr * 0.25), percentage: 25, trend: 'stable' as const },
      { category: 'Other', amount: Math.round(mrr * 0.10), percentage: 10, trend: 'stable' as const },
    ],
    outflowCategories: [
      { category: 'Salaries', amount: salaryBurn, percentage: Math.round((salaryBurn / totalBurn) * 100), trend: 'up' as const },
      { category: 'Operations', amount: opsBurn, percentage: Math.round((opsBurn / totalBurn) * 100), trend: 'stable' as const },
      { category: 'Marketing', amount: marketingBurn, percentage: Math.round((marketingBurn / totalBurn) * 100), trend: 'stable' as const },
      { category: 'Others', amount: otherBurn, percentage: Math.round((otherBurn / totalBurn) * 100), trend: 'stable' as const },
    ],
    alerts,
    recommendations: [
      'Accelerate receivables collection',
      runway < 6 ? 'Urgently reduce burn rate or raise capital' : 'Negotiate better payment terms with vendors',
      'Consider invoice factoring for immediate cash',
    ],
  };
}

const FALLBACK_WORKFORCE = {
  currentHeadcount: 24,
  recommendedHeadcount: 32,
  staffingGap: 8,
  monthlyBurnIncrease: 480000,
  seasonalPlan: [
    { month: 'Feb', currentStaff: 24, requiredStaff: 26, gap: 2, seasonalFactor: 1.0, festivals: [] },
    { month: 'Mar', currentStaff: 26, requiredStaff: 28, gap: 2, seasonalFactor: 1.1, festivals: ['Holi'] },
    { month: 'Apr', currentStaff: 28, requiredStaff: 28, gap: 0, seasonalFactor: 0.95, festivals: [] },
    { month: 'May', currentStaff: 28, requiredStaff: 30, gap: 2, seasonalFactor: 1.0, festivals: [] },
    { month: 'Jun', currentStaff: 30, requiredStaff: 30, gap: 0, seasonalFactor: 0.9, festivals: [] },
    { month: 'Jul', currentStaff: 30, requiredStaff: 28, gap: -2, seasonalFactor: 0.85, festivals: [] },
    { month: 'Aug', currentStaff: 28, requiredStaff: 30, gap: 2, seasonalFactor: 1.0, festivals: ['Raksha Bandhan'] },
    { month: 'Sep', currentStaff: 30, requiredStaff: 32, gap: 2, seasonalFactor: 1.1, festivals: ['Ganesh Chaturthi'] },
    { month: 'Oct', currentStaff: 32, requiredStaff: 36, gap: 4, seasonalFactor: 1.3, festivals: ['Navratri', 'Dussehra'] },
    { month: 'Nov', currentStaff: 34, requiredStaff: 40, gap: 6, seasonalFactor: 1.5, festivals: ['Diwali'] },
    { month: 'Dec', currentStaff: 36, requiredStaff: 34, gap: -2, seasonalFactor: 1.1, festivals: ['Christmas'] },
    { month: 'Jan', currentStaff: 32, requiredStaff: 28, gap: -4, seasonalFactor: 0.9, festivals: [] },
  ],
  roleRequirements: [
    { role: 'Sales Executive', current: 6, required: 10, gap: 4, priority: 'Critical' as const, costPerMonth: 45000 },
    { role: 'Customer Support', current: 4, required: 6, gap: 2, priority: 'High' as const, costPerMonth: 30000 },
    { role: 'Operations', current: 3, required: 4, gap: 1, priority: 'Medium' as const, costPerMonth: 35000 },
    { role: 'Marketing', current: 2, required: 3, gap: 1, priority: 'Medium' as const, costPerMonth: 50000 },
  ],
  hiringTimeline: [
    { role: 'Sales Executive', hireBy: 'Mar 2026', count: 2 },
    { role: 'Customer Support', hireBy: 'Apr 2026', count: 1 },
    { role: 'Sales Executive', hireBy: 'Sep 2026', count: 2 },
  ],
  costImpact: { currentMonthlyCost: 960000, projectedMonthlyCost: 1440000, annualSavings: 720000 },
  recommendations: ['Hire sales team before festival season', 'Consider contract staff for peak periods', 'Cross-train existing team for flexibility'],
};

const DECISION_TYPES = [
  { value: 'growth', label: 'Growth Strategy', icon: TrendingUp, description: 'How to scale my business?' },
  { value: 'hiring', label: 'Hiring & Team', icon: Users, description: 'When and whom to hire?' },
  { value: 'funding', label: 'Funding & Investment', icon: Calculator, description: 'Should I raise funds?' },
  { value: 'marketing', label: 'Marketing & Sales', icon: Target, description: 'How to acquire customers?' },
  { value: 'operations', label: 'Operations', icon: BarChart3, description: 'How to optimize operations?' },
  { value: 'pivot', label: 'Pivot / New Market', icon: Lightbulb, description: 'Should I pivot?' },
  { value: 'compliance', label: 'Compliance & Legal', icon: Shield, description: 'GST, TDS, DPDP?' },
  { value: 'custom', label: 'Custom Query', icon: Brain, description: 'Ask anything' },
];

const AGENT_CONFIG = {
  orchestrator: { name: 'Central Orchestrator', color: '#A855F7', level: 'L1' },
  simulation_cluster: { name: 'Simulation Cluster', color: '#06B6D4', level: 'L2' },
  decision_intelligence: { name: 'Decision Intelligence', color: '#22C55E', level: 'L2' },
  operations_optimizer: { name: 'Operations Optimizer', color: '#F97316', level: 'L2' },
  personal_coach: { name: 'Personal Coach', color: '#14B8A6', level: 'L3' },
  innovation_advisor: { name: 'Innovation Advisor', color: '#EAB308', level: 'L3' },
  growth_strategist: { name: 'Growth Strategist', color: '#EC4899', level: 'L3' },
  learning_adaptation: { name: 'Learning Agent', color: '#84CC16', level: 'L4' },
};

// Graph Card with Conclusion and Expand functionality
function GraphCard({ title, conclusion, children }: { title: string; conclusion: string; children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h4 className="font-bold text-white">{title}</h4>
          <button
            onClick={() => setIsExpanded(true)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
            title="Expand chart"
          >
            <Maximize2 size={16} />
          </button>
        </div>
        <div className="p-3 sm:p-6 h-64 sm:h-72">
          {children}
        </div>
        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-t border-white/5">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] sm:text-xs text-gray-300">{conclusion}</p>
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h4 className="font-bold text-white text-lg">{title}</h4>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 h-[60vh]">
                {children}
              </div>
              <div className="px-6 py-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-t border-white/5">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">{conclusion}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Decision Popup
function DecisionPopup({ path, onClose, onExplorePath, isRecommended, isRisky }: {
  path: DecisionPath; onClose: () => void; onExplorePath: () => void; isRecommended: boolean; isRisky: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className={`max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-2xl p-6 border-2 ${
          isRecommended ? 'bg-green-950/95 border-green-500' : isRisky ? 'bg-red-950/95 border-red-500' : 'bg-orange-950/95 border-orange-500'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-black">{path.name}</h2>
              {isRecommended && <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1"><Check size={12} /> BEST</span>}
              {isRisky && <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1"><AlertTriangle size={12} /> RISKY</span>}
            </div>
            <p className="text-gray-400 text-sm">{path.description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-xl">×</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          {[
            { label: 'Expected Value', value: `₹${(path.expectedValue / 100000).toFixed(1)}L` },
            { label: 'Probability', value: `${(path.probability * 100).toFixed(0)}%` },
            { label: 'Risk', value: `${path.riskScore}/100`, color: path.riskScore > 60 ? 'text-red-400' : path.riskScore > 30 ? 'text-yellow-400' : 'text-green-400' },
            { label: 'Timeline', value: `${path.timeline}d` },
          ].map((m) => (
            <div key={m.label} className="p-2 sm:p-3 rounded-lg bg-black/30">
              <div className="text-[10px] text-gray-400">{m.label}</div>
              <div className={`text-base sm:text-lg font-bold ${m.color || ''}`}>{m.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-green-900/30 border border-green-500/30">
            <h4 className="font-bold text-green-400 text-sm mb-2">✓ Strengths</h4>
            <ul className="text-xs space-y-1 text-green-200">
              <li>• Revenue: ₹{(path.expectedValue / 100000).toFixed(1)}L potential</li>
              <li>• Success rate: {(path.probability * 100).toFixed(0)}%</li>
              <li>• Efficiency gain: {path.benefits?.efficiency || 15}%</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/30">
            <h4 className="font-bold text-red-400 text-sm mb-2">⚠ Risks</h4>
            <ul className="text-xs space-y-1 text-red-200">
              <li>• Risk score: {path.riskScore}/100</li>
              <li>• Timeline: {path.timeline} days</li>
              <li>• Upfront cost required</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onExplorePath}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
            isRecommended ? 'bg-green-500 hover:bg-green-600' : isRisky ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
          } text-white`}
        >
          <Map size={18} /> Explore This Path <ArrowRight size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const {
    profile, setProfile, agents, updateAgent, setCurrentResult, currentResult, addResult,
    selectedPath, setSelectedPath, sidebarOpen, toggleSidebar, rightPanelOpen, toggleRightPanel,
    rightPanelTab, setRightPanelTab, isLoading, setIsLoading,
    setCascadingPaths, setCascadingLevel, setBreadcrumbPath, setFestivalMultiplier, setRegionalAdjustment, addAuditEntry,
  } = useNeoBIStore();

  const router = useRouter();
  const { t } = useLanguage();
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);
  const [roadmapInitialPathId, setRoadmapInitialPathId] = useState<string | undefined>(undefined);
  const [decisionType, setDecisionType] = useState('');
  const [decisionQuery, setDecisionQuery] = useState('');
  const [showDecisionInput, setShowDecisionInput] = useState(false);
  const [selectedDecisionPath, setSelectedDecisionPath] = useState<DecisionPath | null>(null);
  const [exploredPaths, setExploredPaths] = useState<string[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'calculators' | 'advanced'>('analytics');

  const [formData, setFormData] = useState({
    name: '', industry: '', mrr: 500000, customers: 50, location: 'Bangalore',
    teamSize: 5, growthTarget: 20, cityTier: 1 as 1 | 2 | 3, festival: 'Diwali',
  });

  const handleProfileSubmit = () => {
    if (!formData.name || !formData.industry) return;
    const newProfile: BusinessProfile = {
      id: crypto.randomUUID(), name: formData.name, industry: formData.industry,
      mrr: formData.mrr, customers: formData.customers, location: formData.location,
      teamSize: formData.teamSize, foundedDate: new Date(), growthTarget: formData.growthTarget,
      riskTolerance: 'medium', vibeMode: 'balanced',
    };
    setProfile(newProfile);
    setShowDecisionInput(true);
  };

  const handleSimulate = async () => {
    if (!profile) return;
    setIsLoading(true);
    setActiveAgents([]);

    const agentIds: Array<keyof typeof agents> = [
      'orchestrator', 'simulation_cluster', 'decision_intelligence', 'operations_optimizer',
      'personal_coach', 'innovation_advisor', 'growth_strategist', 'learning_adaptation',
    ];

    for (const agentId of agentIds) {
      setActiveAgents(prev => [...prev, agentId]);
      updateAgent(agentId, { status: 'thinking' });
      await new Promise(r => setTimeout(r, 200));
      updateAgent(agentId, { status: 'complete', contribution: Math.random() * 30 + 10 });
    }

    const agentContributions = {
      orchestrator: agents.orchestrator?.contribution || 12,
      simulation_cluster: agents.simulation_cluster?.contribution || 16,
      decision_intelligence: agents.decision_intelligence?.contribution || 20,
      operations_optimizer: agents.operations_optimizer?.contribution || 18,
      personal_coach: agents.personal_coach?.contribution || 10,
      innovation_advisor: agents.innovation_advisor?.contribution || 8,
      growth_strategist: agents.growth_strategist?.contribution || 10,
      learning_adaptation: agents.learning_adaptation?.contribution || 6,
    };
    // Pass query to generateDecisionPaths for intent-specific recommendations
    const paths = generateDecisionPaths(profile, agentContributions, decisionQuery);

    let marlState: MARLState = {
      episode: 0, totalReward: 500,
      agentRewards: { orchestrator: 0, simulation_cluster: 0, decision_intelligence: 0, operations_optimizer: 0, personal_coach: 0, innovation_advisor: 0, growth_strategist: 0, learning_adaptation: 0 },
      convergenceMetric: 0, replayBufferSize: 0, policyVersion: 0,
    };
    for (let i = 0; i < 10; i++) { marlState = simulateMARLEpisode(i, marlState, agentContributions); await new Promise(r => setTimeout(r, 50)); }

    const enhancedMetrics = await Promise.all([
      fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'cascading-paths', payload: { parentPath: paths[1], profile, level: 1 } }) }).then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'reward-decomposition', payload: { path: paths[1], profile } }) }).then(r => r.json()).catch(() => ({ data: FALLBACK_REWARD_DECOMPOSITION })),
      fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'curriculum-learning', payload: { episodes: 100 } }) }).then(r => r.json()).catch(() => ({ data: FALLBACK_CURRICULUM_LEVELS })),
      fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'burnout-trajectory', payload: { vibeMode: 'balanced' } }) }).then(r => r.json()).catch(() => ({ data: FALLBACK_BURNOUT_TRAJECTORY })),
      fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'confidence-distribution', payload: { ensembleSize: 10 } }) }).then(r => r.json()).catch(() => ({ data: FALLBACK_CONFIDENCE_DISTRIBUTION })),
      fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'ablation-study', payload: {} }) }).then(r => r.json()).catch(() => ({ data: FALLBACK_ABLATION_STUDY })),
    ]);

    const result: SimulationResult & any = {
      id: crypto.randomUUID(), timestamp: new Date(), profile,
      query: decisionQuery || `What is the optimal ${decisionType || 'growth'} strategy?`,
      paths, recommendation: paths[1], marlState, confidence: 92, executionTime: 2100, costUsed: 0,
      cascadingPaths: enhancedMetrics[0]?.data, rewardDecomposition: enhancedMetrics[1]?.data,
      curriculumLevels: enhancedMetrics[2]?.data, burnoutTrajectory: enhancedMetrics[3]?.data,
      confidenceDistribution: enhancedMetrics[4]?.data, ablationStudy: enhancedMetrics[5]?.data,
    };

    setCurrentResult(result); addResult(result); setSelectedPath(paths[1]);
    setCascadingPaths(enhancedMetrics[0]?.data); setCascadingLevel(1); setBreadcrumbPath(['Level 1', paths[1].name]);
    addAuditEntry({ timestamp: new Date(), action: 'simulation-run', details: { profile: profile.name, query: decisionQuery } });
    setIsLoading(false); setActiveAgents([]);
    agentIds.forEach(id => updateAgent(id, { status: 'idle' }));
  };

  const getPathColors = (path: DecisionPath) => {
    if (!currentResult) return { bg: 'bg-gray-800', border: 'border-gray-600', text: 'text-gray-400' };
    const sorted = [...currentResult.paths].sort((a, b) => a.riskScore - b.riskScore);
    if (path.id === sorted[0]?.id) return { bg: 'bg-green-900/40', border: 'border-green-500', text: 'text-green-400', badge: 'bg-green-500' };
    if (path.id === sorted[sorted.length - 1]?.id) return { bg: 'bg-red-900/40', border: 'border-red-500', text: 'text-red-400', badge: 'bg-red-500' };
    return { bg: 'bg-orange-900/40', border: 'border-orange-500', text: 'text-orange-400', badge: 'bg-orange-500' };
  };

  // Profile Input Modal
  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent mb-1">NeoBI India</h1>
          <p className="text-gray-400 text-sm mb-4">Agentic BI Co-pilot for Indian Entrepreneurs</p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-300">Business Name *</label>
              <input type="text" placeholder="Your startup name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-amber-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-300">Industry *</label>
              <select value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-amber-500 outline-none text-sm">
                <option value="">Select Industry</option>
                {['SaaS', 'E-commerce', 'Healthcare', 'FinTech', 'EdTech', 'Food & Beverage', 'Manufacturing', 'Logistics', 'Retail', 'Kirana/Grocery', 'D2C Fashion', 'Real Estate', 'Consulting', 'Beauty & Wellness'].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs font-bold mb-1 text-gray-300">MRR (₹)</label><input type="number" value={formData.mrr} onChange={(e) => setFormData({ ...formData, mrr: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 outline-none text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1 text-gray-300">Team Size</label><input type="number" value={formData.teamSize} onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 outline-none text-sm" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs font-bold mb-1 text-gray-300">Location</label>
                <select value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 outline-none text-sm">
                  {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Other'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold mb-1 text-gray-300">City Tier</label>
                <select value={formData.cityTier} onChange={(e) => setFormData({ ...formData, cityTier: parseInt(e.target.value) as 1 | 2 | 3 })} className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 outline-none text-sm">
                  <option value="1">Tier 1 - Metro</option><option value="2">Tier 2 - City</option><option value="3">Tier 3 - Town</option>
                </select>
              </div>
            </div>
            <button onClick={handleProfileSubmit} disabled={!formData.name || !formData.industry} className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold disabled:opacity-50 mt-2">
              Continue →
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Decision Query Modal
  if (showDecisionInput) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full">
          <h1 className="text-xl font-black text-white mb-1">What decision do you need help with?</h1>
          <p className="text-gray-400 text-sm mb-4">Select a category or describe your question</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {DECISION_TYPES.map((t) => (
              <button key={t.value} onClick={() => setDecisionType(t.value)} className={`p-2 sm:p-3 rounded-lg border text-left transition-all ${decisionType === t.value ? 'border-amber-500 bg-amber-500/20' : 'border-white/10 hover:border-white/30'}`}>
                <t.icon size={18} className={decisionType === t.value ? 'text-amber-400' : 'text-gray-400'} />
                <div className="font-bold text-[10px] sm:text-xs mt-1">{t.label}</div>
              </button>
            ))}
          </div>

          <textarea placeholder="Describe your specific question (optional)..." value={decisionQuery} onChange={(e) => setDecisionQuery(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 h-20 resize-none outline-none text-sm mb-4" />

          <div className="flex gap-3">
            <button onClick={() => { setShowDecisionInput(false); setProfile(null); }} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm">← Back</button>
            <button onClick={() => { setShowDecisionInput(false); handleSimulate(); }} disabled={!decisionType && !decisionQuery} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              <Zap size={18} /> Run Intelligence
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-400 mb-2">Running Intelligence...</h3>
            <div className="flex gap-2 justify-center">
              {Object.entries(AGENT_CONFIG).map(([id, cfg]) => (
                <motion.div key={id} className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }}
                  animate={activeAgents.includes(id) ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.5, repeat: activeAgents.includes(id) ? Infinity : 0 }} />
              ))}
            </div>
          </div>
        </div>
      )}

      <LiveTickerBar />

      <div className="flex-1 flex overflow-hidden mt-16 pb-16">
        {/* Left Sidebar - Hidden on mobile, overlay when opened */}
        <motion.div
          animate={{ width: sidebarOpen ? '250px' : '0px', opacity: sidebarOpen ? 1 : 0 }}
          className="hidden md:flex bg-slate-900/50 border-r border-white/10 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto min-h-0">
            <AgentActivityTree />
          </div>
          <div className="border-t-2 border-amber-500/30 flex-shrink-0 bg-slate-900/80 backdrop-blur">
            <ControlBar />
          </div>
        </motion.div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="md:hidden fixed inset-y-0 left-0 w-[280px] bg-slate-900 border-r border-white/10 flex flex-col z-40 mt-16"
            >
              <div className="flex-1 overflow-y-auto min-h-0">
                <AgentActivityTree />
              </div>
              <div className="border-t-2 border-amber-500/30 flex-shrink-0 bg-slate-900/80 backdrop-blur safe-bottom">
                <ControlBar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && <div onClick={toggleSidebar} className="md:hidden fixed inset-0 bg-black/50 z-30 mt-16" />}

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Header - Responsive */}
          <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg">{sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}</button>
              <h2 className="text-base sm:text-lg font-black bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
                <span className="hidden sm:inline">Decision Intelligence</span>
                <span className="sm:hidden">NeoBI</span>
              </h2>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button onClick={() => { setCurrentResult(null); setDecisionQuery(''); setDecisionType(''); setShowDecisionInput(true); }} className="px-2 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold text-xs sm:text-sm flex items-center gap-1">
                <Search size={14} /> <span className="hidden sm:inline">New Query</span>
              </button>
              {currentResult && <button onClick={() => setShowFullRoadmap(true)} className="px-2 sm:px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/30 text-amber-200 font-bold text-xs sm:text-sm flex items-center gap-1">
                <Map size={14} /> <span className="hidden sm:inline">Roadmap</span>
              </button>}
              <button onClick={() => router.push('/benchmarks')} className="px-2 sm:px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 font-bold text-xs sm:text-sm">
                <span className="hidden sm:inline">📊 Benchmarks</span>
                <span className="sm:hidden">📊</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentResult ? (
              <div className="max-w-5xl mx-auto space-y-6">
                {/* Query */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400">{t('common', 'search')}</div>
                  <div className="font-bold">{currentResult.query}</div>
                </div>

                {/* Decision Paths */}
                <div>
                  <h3 className="font-bold text-lg mb-3">{t('roadmap', 'decisions')} <span className="text-xs text-gray-400 font-normal ml-2">{t('common', 'expand')}</span></h3>
                  <div className="space-y-3">
                    {currentResult.paths.map((path, idx) => {
                      const colors = getPathColors(path);
                      const sorted = [...currentResult.paths].sort((a, b) => a.riskScore - b.riskScore);
                      const isRec = path.id === sorted[0]?.id;
                      const isRisky = path.id === sorted[sorted.length - 1]?.id;

                      return (
                        <motion.div key={path.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                          onClick={() => setSelectedDecisionPath(path)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${colors.bg} ${colors.border}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold">{path.name}</h4>
                              {isRec && <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">✓ RECOMMENDED</span>}
                              {isRisky && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">⚠ RISKY</span>}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${colors.badge} text-white`}>{path.timeline}d</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{path.description}</p>
                          <div className="flex gap-6 text-sm">
                            <div><span className="text-gray-400">EV:</span> <span className="font-bold">₹{(path.expectedValue / 100000).toFixed(1)}L</span></div>
                            <div><span className="text-gray-400">Prob:</span> <span className="font-bold">{(path.probability * 100).toFixed(0)}%</span></div>
                            <div><span className="text-gray-400">Risk:</span> <span className={`font-bold ${colors.text}`}>{path.riskScore}/100</span></div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-white/10 pb-2">
                  {[
                    { id: 'analytics', label: `📊 ${t('common', 'reports')}` },
                    { id: 'calculators', label: `🧮 ${t('gst', 'title')}` },
                    { id: 'advanced', label: `🔬 ${t('nav', 'advanced')}` },
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white'}`}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'analytics' && (
                  <div className="space-y-4">
                    <MRRHealthPulse currentMRR={profile.mrr} previousWeekMRR={profile.mrr * 0.95} cashOnHand={profile.mrr * 3} monthlyBurn={profile.teamSize * 50000 + profile.mrr * 0.3} />

                    <GraphCard title="MARL Convergence Curve" conclusion="System converged to optimal reward of 850 after 10 episodes. Multi-agent coordination is effective.">
                      <MARLConvergenceCurve />
                    </GraphCard>

                    <GraphCard title="Cash Flow Projection (12 months)" conclusion="Projected positive cash flow from month 4. Runway is sufficient for balanced growth strategy.">
                      <CashFlowProjectionChart />
                    </GraphCard>

                    <GraphCard title="SHAP Feature Importance" conclusion="MRR and team size are the strongest predictors. Consider optimizing these factors first.">
                      <SHAPBeeswarm />
                    </GraphCard>

                    <GraphCard title="Agent Contribution Analysis" conclusion="Decision Intelligence (22%) and Operations Optimizer (18%) contributed most to recommendations.">
                      <AgentContributionPie />
                    </GraphCard>

                    <GraphCard title="Burnout Risk Assessment" conclusion="Current burnout risk is moderate (45%). Balanced approach recommended to prevent escalation.">
                      <BurnoutRiskChart />
                    </GraphCard>

                    <GraphCard title="Confidence Distribution" conclusion="92% of predictions fall within 70-95% confidence range. Recommendations are reliable.">
                      <ConfidenceDistributionHistogram distribution={currentResult.confidenceDistribution ?? FALLBACK_CONFIDENCE_DISTRIBUTION} />
                    </GraphCard>
                  </div>
                )}

                {activeTab === 'calculators' && (
                  <div className="space-y-6">
                    {/* Financial Calculators */}
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/10">
                      <h4 className="font-bold text-lg mb-2">🧮 Financial Calculators</h4>
                      <p className="text-sm text-gray-400 mb-4">Calculate GST, TDS, invoice discounts, and assess fraud risk.</p>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                          <CompliancePanel />
                        </div>

                        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                          <InvoiceDiscountCalculator />
                        </div>

                        <div className="lg:col-span-2 bg-black/30 rounded-xl p-4 border border-white/10">
                          <h5 className="font-bold text-red-400 mb-3">🛡️ UPI Fraud Risk Simulator</h5>
                          <UFraudRiskSimulator fraudScore={{
                            score: 45,
                            fraudAttempts: 12,
                            defenseLevel: 70,
                            mitigationStrategies: [
                              'Enable transaction monitoring',
                              'Implement 2FA on high-value transactions',
                              'Add device binding for authentication',
                            ],
                            estimatedLoss: 15000,
                          }} />
                        </div>
                      </div>
                    </div>

                    {/* Operational Tools */}
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/10">
                      <h4 className="font-bold text-lg mb-2">⚙️ Operational Tools</h4>
                      <p className="text-sm text-gray-400 mb-4">Manage inventory, find suppliers, and hire staff.</p>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                          <InventoryControlPanel />
                        </div>

                        <div className="bg-black/30 rounded-xl p-4 border border-purple-500/20">
                          <StaffHiringPanel />
                        </div>

                        <div className="bg-black/30 rounded-xl p-4 border border-orange-500/20">
                          <SupplierFinderPanel />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="space-y-6">
                    {/* Advanced India-Specific Features - One per row for clarity */}
                    <div className="space-y-4">
                      {/* Burnout Mitigation */}
                      <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/10 rounded-xl p-4 border border-pink-500/30">
                        <BurnoutMitigationPathways trajectories={FALLBACK_BURNOUT_MITIGATION} />
                      </div>

                      {/* Regional Adjustment */}
                      <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 rounded-xl p-4 border border-cyan-500/30">
                        <RegionalInequalityAdjustment regions={FALLBACK_REGIONAL_DATA} selectedTier={1} />
                      </div>

                      {/* Festival Demand Multiplier */}
                      <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 rounded-xl p-4 border border-amber-500/30">
                        <FestivalAwareDemandMultiplier
                          festivals={FALLBACK_FESTIVALS}
                          selectedFestival="Valentine's Day"
                          onSelectFestival={() => {}}
                        />
                      </div>

                      {/* Self-Evolving Jugaad */}
                      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 rounded-xl p-4 border border-green-500/30">
                        <SelfEvolvingJugaadGenerator
                          ideas={FALLBACK_JUGAAD_IDEAS as any}
                          onGenerateNew={() => {}}
                        />
                      </div>

                      {/* NEW FEATURES - Business Intelligence Suite */}
                      <div className="mt-6 mb-4">
                        <h3 className="text-lg font-bold text-white mb-1">Business Intelligence Suite</h3>
                        <p className="text-sm text-gray-400">Advanced analytics and planning tools for Indian businesses</p>
                      </div>

                      {/* GST Compliance Checker */}
                      <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/10 rounded-xl p-4 border border-indigo-500/30">
                        <GSTComplianceChecker data={FALLBACK_GST_DATA} />
                      </div>

                      {/* Funding Readiness Score */}
                      <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 rounded-xl p-4 border border-purple-500/30">
                        <FundingReadinessScore data={FALLBACK_FUNDING_DATA} />
                      </div>

                      {/* Supplier Risk Map */}
                      <div className="bg-gradient-to-br from-orange-900/20 to-red-900/10 rounded-xl p-4 border border-orange-500/30">
                        <SupplierRiskMap data={getIndustrySuppliers(profile?.industry || 'SaaS')} />
                      </div>

                      {/* Market Entry Simulator */}
                      <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/10 rounded-xl p-4 border border-emerald-500/30">
                        <MarketEntrySimulator data={FALLBACK_MARKET_ENTRY} />
                      </div>

                      {/* Cash Flow Predictor */}
                      <div className="bg-gradient-to-br from-sky-900/20 to-indigo-900/10 rounded-xl p-4 border border-sky-500/30">
                        <CashFlowPredictor data={getCashFlowFromProfile(profile?.mrr || 500000, profile?.teamSize || 5, profile?.industry || 'SaaS')} />
                      </div>

                      {/* Seasonal Workforce Planner */}
                      <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/10 rounded-xl p-4 border border-violet-500/30">
                        <SeasonalWorkforcePlanner data={FALLBACK_WORKFORCE} />
                      </div>

                      {/* NEW v2.2 - Integration & Export Suite */}
                      <div className="mt-6 mb-4">
                        <h3 className="text-lg font-bold text-white mb-1">Integration & Export Suite</h3>
                        <p className="text-sm text-gray-400">Connect with Tally, Zoho, export to Excel, and share via WhatsApp</p>
                      </div>

                      {/* Integration Dashboard - Tally, Zoho, GST */}
                      <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 rounded-xl p-4 border border-blue-500/30">
                        <IntegrationDashboard />
                      </div>

                      {/* Competitor Benchmarking */}
                      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 rounded-xl p-4 border border-purple-500/30">
                        <CompetitorBenchmark />
                      </div>

                      {/* Excel Export */}
                      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 rounded-xl p-4 border border-green-500/30">
                        <ExcelExport />
                      </div>

                      {/* Voice Input & WhatsApp Share - Side by Side */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/10 rounded-xl p-4 border border-red-500/30">
                          <VoiceInput
                            onTranscript={(text) => console.log('Voice:', text)}
                            onCommand={(cmd) => console.log('Command:', cmd)}
                          />
                        </div>
                        <div className="bg-gradient-to-br from-green-900/20 to-teal-900/10 rounded-xl p-4 border border-green-500/30">
                          <WhatsAppShare />
                        </div>
                      </div>

                      {/* Language Selector */}
                      <div className="bg-gradient-to-br from-indigo-900/20 to-violet-900/10 rounded-xl p-4 border border-indigo-500/30">
                        <LanguageSelector />
                      </div>
                    </div>

                    {/* Audit Trail */}
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/10">
                      <h4 className="font-bold text-lg mb-2">📋 Advanced Audit Trail</h4>
                      <p className="text-sm text-gray-400 mb-4">Full transparency of all AI decisions and recommendations.</p>
                      <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                        <AdvancedAuditTrail entries={FALLBACK_AUDIT_ENTRIES} onExport={() => {}} />
                      </div>
                    </div>

                    {/* Analytics Charts */}
                    <div className="space-y-4">
                      <GraphCard title="Reward Decomposition" conclusion="Revenue (35%) drives most value. Operational efficiency (22%) is the second-highest contributor.">
                        <RewardDecompositionChart decomposition={currentResult.rewardDecomposition ?? FALLBACK_REWARD_DECOMPOSITION} />
                      </GraphCard>

                      <GraphCard title="Curriculum Learning Progress" conclusion="System mastered 3-level hierarchical learning. Ready for complex multi-agent decisions.">
                        <CurriculumBreakdown levels={currentResult.curriculumLevels ?? FALLBACK_CURRICULUM_LEVELS} />
                      </GraphCard>

                      <GraphCard title="Ablation Study" conclusion="MARL contributes 30.4% to performance. Removing it causes the largest accuracy drop.">
                        <AblationStudyChart ablations={currentResult.ablationStudy ?? FALLBACK_ABLATION_STUDY} />
                      </GraphCard>

                      <GraphCard title="Burnout Trajectory" conclusion="With recommended path, burnout risk reduces by 33% over 30 days compared to baseline.">
                        <BurnoutTrajectoryChart trajectory={currentResult.burnoutTrajectory ?? FALLBACK_BURNOUT_TRAJECTORY} />
                      </GraphCard>
                    </div>
                  </div>
                )}

                {/* Explored Path */}
                {exploredPaths.length > 0 && (
                  <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                    <h4 className="font-bold text-green-400 mb-2">Your Explored Path</h4>
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                      {exploredPaths.map((p, i) => (
                        <React.Fragment key={i}>
                          <span className="px-3 py-1 bg-green-500/20 rounded-lg">{p}</span>
                          {i < exploredPaths.length - 1 && <ArrowRight size={14} className="text-green-400" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {showFullRoadmap && <FullPageRoadmap onClose={() => { setShowFullRoadmap(false); setRoadmapInitialPathId(undefined); }} initialPathId={roadmapInitialPathId} />}

                <AnimatePresence>
                  {selectedDecisionPath && (
                    <DecisionPopup
                      path={selectedDecisionPath}
                      onClose={() => setSelectedDecisionPath(null)}
                      onExplorePath={() => { setExploredPaths([...exploredPaths, selectedDecisionPath.name]); setRoadmapInitialPathId(selectedDecisionPath.id); setSelectedDecisionPath(null); setShowFullRoadmap(true); }}
                      isRecommended={selectedDecisionPath.id === [...currentResult.paths].sort((a, b) => a.riskScore - b.riskScore)[0]?.id}
                      isRisky={selectedDecisionPath.id === [...currentResult.paths].sort((a, b) => a.riskScore - b.riskScore)[currentResult.paths.length - 1]?.id}
                    />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold mb-2">Ready to Analyze</h3>
                  <p className="text-gray-400 mb-4">Enter your business details and decision query</p>
                  <button onClick={() => setShowDecisionInput(true)} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold rounded-lg">
                    Start Decision Query
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <motion.div animate={{ width: rightPanelOpen ? '280px' : '0px', opacity: rightPanelOpen ? 1 : 0 }} className="bg-slate-900/50 border-l border-white/10 overflow-hidden flex flex-col">
          {rightPanelOpen && (
            <>
              <div className="flex border-b border-white/10">
                {['deep-dive', 'operations'].map((tab) => (
                  <button key={tab} onClick={() => setRightPanelTab(tab as any)}
                    className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors capitalize ${rightPanelTab === tab ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-400'}`}>
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {rightPanelTab === 'deep-dive' && <RiskAndCoachPanel />}
                {rightPanelTab === 'operations' && <OperationsPanel />}
              </div>
            </>
          )}
        </motion.div>

        <button onClick={toggleRightPanel} className="fixed right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-l-lg z-30">
          {rightPanelOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <MetricsAndExportBar />
    </div>
  );
}
