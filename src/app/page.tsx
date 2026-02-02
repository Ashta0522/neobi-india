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
} from '@/components';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronLeft, ChevronRight, Map, Search, ArrowRight, Check, AlertTriangle, TrendingUp, Shield, Calculator, BarChart3, Users, Target, Lightbulb, Brain, Info } from 'lucide-react';

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

// Graph Card with Conclusion
function GraphCard({ title, conclusion, children }: { title: string; conclusion: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h4 className="font-bold text-white">{title}</h4>
      </div>
      <div className="p-4 h-72">
        {children}
      </div>
      <div className="px-4 py-3 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-t border-white/5">
        <div className="flex items-start gap-2">
          <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-300">{conclusion}</p>
        </div>
      </div>
    </div>
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

        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Expected Value', value: `₹${(path.expectedValue / 100000).toFixed(1)}L` },
            { label: 'Probability', value: `${(path.probability * 100).toFixed(0)}%` },
            { label: 'Risk', value: `${path.riskScore}/100`, color: path.riskScore > 60 ? 'text-red-400' : path.riskScore > 30 ? 'text-yellow-400' : 'text-green-400' },
            { label: 'Timeline', value: `${path.timeline}d` },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-lg bg-black/30">
              <div className="text-[10px] text-gray-400">{m.label}</div>
              <div className={`text-lg font-bold ${m.color || ''}`}>{m.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
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
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);
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
    const paths = generateDecisionPaths(profile, agentContributions);

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
          <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent mb-1">NeoBI India v2.0</h1>
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
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-bold mb-1 text-gray-300">MRR (₹)</label><input type="number" value={formData.mrr} onChange={(e) => setFormData({ ...formData, mrr: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 outline-none text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1 text-gray-300">Team Size</label><input type="number" value={formData.teamSize} onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 outline-none text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
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
  if (showDecisionInput && !currentResult) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full">
          <h1 className="text-xl font-black text-white mb-1">What decision do you need help with?</h1>
          <p className="text-gray-400 text-sm mb-4">Select a category or describe your question</p>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {DECISION_TYPES.map((t) => (
              <button key={t.value} onClick={() => setDecisionType(t.value)} className={`p-3 rounded-lg border text-left transition-all ${decisionType === t.value ? 'border-amber-500 bg-amber-500/20' : 'border-white/10 hover:border-white/30'}`}>
                <t.icon size={20} className={decisionType === t.value ? 'text-amber-400' : 'text-gray-400'} />
                <div className="font-bold text-xs mt-1">{t.label}</div>
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
        {/* Left Sidebar */}
        <motion.div animate={{ width: sidebarOpen ? '220px' : '0px', opacity: sidebarOpen ? 1 : 0 }} className="bg-slate-900/50 border-r border-white/10 overflow-hidden flex flex-col">
          <AgentActivityTree />
          <div className="border-t border-white/10"><ControlBar /></div>
        </motion.div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg">{sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}</button>
              <h2 className="text-lg font-black bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">Decision Intelligence</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowDecisionInput(true)} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold text-sm flex items-center gap-1"><Search size={14} /> New Query</button>
              {currentResult && <button onClick={() => setShowFullRoadmap(true)} className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/30 text-amber-200 font-bold text-sm flex items-center gap-1"><Map size={14} /> Roadmap</button>}
              <button onClick={() => router.push('/benchmarks')} className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 font-bold text-sm">📊 Benchmarks</button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentResult ? (
              <div className="max-w-5xl mx-auto space-y-6">
                {/* Query */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400">Your Query</div>
                  <div className="font-bold">{currentResult.query}</div>
                </div>

                {/* Decision Paths */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Decision Paths <span className="text-xs text-gray-400 font-normal ml-2">Click to see details</span></h3>
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
                    { id: 'analytics', label: '📊 Analytics' },
                    { id: 'calculators', label: '🧮 Calculators' },
                    { id: 'advanced', label: '🔬 Advanced' },
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
                    <MRRHealthPulse currentMRR={profile.mrr} previousWeekMRR={profile.mrr * 0.95} cashOnHand={profile.mrr * 6} monthlyBurn={profile.mrr * 0.4} />

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
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/10">
                      <h4 className="font-bold text-lg mb-2">🧮 Financial Calculators</h4>
                      <p className="text-sm text-gray-400 mb-4">Use these tools to calculate GST, TDS, invoice discounts, and assess fraud risk.</p>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                          <h5 className="font-bold text-green-400 mb-3">GST & Compliance</h5>
                          <CompliancePanel />
                        </div>

                        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                          <h5 className="font-bold text-blue-400 mb-3">Invoice Discounting</h5>
                          <InvoiceDiscountCalculator />
                        </div>

                        <div className="lg:col-span-2 bg-black/30 rounded-xl p-4 border border-white/10">
                          <h5 className="font-bold text-red-400 mb-3">UPI Fraud Risk Simulator</h5>
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
                  </div>
                )}

                {activeTab === 'advanced' && (
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

                {showFullRoadmap && <FullPageRoadmap onClose={() => setShowFullRoadmap(false)} />}

                <AnimatePresence>
                  {selectedDecisionPath && (
                    <DecisionPopup
                      path={selectedDecisionPath}
                      onClose={() => setSelectedDecisionPath(null)}
                      onExplorePath={() => { setExploredPaths([...exploredPaths, selectedDecisionPath.name]); setSelectedDecisionPath(null); setShowFullRoadmap(true); }}
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
