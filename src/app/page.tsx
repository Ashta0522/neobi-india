'use client';

import React, { useState, useEffect } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { BusinessProfile, SimulationResult, MARLState, JugaadIdea, RewardDecomposition, CurriculumLevel, AblationStudy, BurnoutTrajectory, ConfidenceDistribution } from '@/types';
import { generateDecisionPaths, simulateMARLEpisode, generateCompetitorHeatmap } from '@/utils/simulationEngine';
import { LiveTickerBar } from '@/components/LiveTickerBar';
import { AgentActivityTree } from '@/components/AgentActivityTree';
import { ControlBar } from '@/components/ControlBar';
import { DecisionRoadmap } from '@/components/DecisionRoadmap';
import { MARLConvergenceCurve, WorldModelAccuracyChart, CashFlowProjectionChart, InventoryTurnoverChart } from '@/components/Graphs';
import { SHAPBeeswarm, AgentContributionPie, ConfidenceDistributionHistogram, BurnoutRiskChart } from '@/components/AdvancedGraphs';
import { OperationsPanel } from '@/components/OperationsPanel';
import { RiskAndCoachPanel } from '@/components/RiskAndCoachPanel';
import { MetricsAndExportBar } from '@/components/MetricsAndExportBar';
// NEW: Tier 2 & 3 Features
import {
  FullPageRoadmap, BurnoutMitigationPathways, AdvancedAuditTrail, SelfEvolvingJugaadGenerator,
  UPIFraudDefense, RegionalInequalityAdjustment, FestivalAwareDemandMultiplier,
  CompliancePanel,
  GlobalSHAPBeeswarm, RewardDecompositionChart, CurriculumBreakdown, AblationStudyChart,
  BurnoutTrajectoryChart, FestivalMultiplierSlider, CascadingPathSelector, JugaadGenerator,
  RegionalAdjustmentGauge, CompetitorHeatmapChart, UFraudRiskSimulator,
} from '@/components';
import { motion } from 'framer-motion';
import { Zap, BookOpen, ChevronLeft, ChevronRight, Map, Download } from 'lucide-react';

// Fallback data so Tier 2 & Tier 3 sections and right-panel tabs always render
const FALLBACK_REWARD_DECOMPOSITION: RewardDecomposition = {
  totalReward: 850,
  components: { revenue: 35, riskReduction: 20, burnoutMitigation: 15, operationalEfficiency: 22, complianceScore: 8 },
  timestamp: new Date(),
};
const FALLBACK_CONFIDENCE_DISTRIBUTION: ConfidenceDistribution = {
  bins: [60, 70, 80, 90, 95],
  counts: [2, 3, 5, 3, 2],
  mean: 84,
  stdDev: 8,
  minConfidence: 72,
  maxConfidence: 94,
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
const FALLBACK_MITIGATION_TRAJECTORIES = Array.from({ length: 7 }, (_, i) => ({
  day: i * 5,
  baseline: 65 + i * 4,
  withPathA: 42 + i * 2,
  withPathB: 45 + i * 1.5,
  withPathC: 48 + i * 1.2,
  threshold: 40,
}));
const FALLBACK_CURRICULUM_LEVELS: CurriculumLevel[] = [
  { level: 1, description: 'Single-Decision', episodes: [0, 10, 20, 30], rewards: [400, 520, 620, 700], convergenceMetric: [0, 30, 60, 85], agentContributions: { orchestrator: 15, simulation_cluster: 20, decision_intelligence: 30, operations_optimizer: 15, personal_coach: 5, innovation_advisor: 5, growth_strategist: 5, learning_adaptation: 5 } },
  { level: 2, description: 'Sequential', episodes: [0, 15, 30], rewards: [500, 650, 780], convergenceMetric: [0, 50, 90], agentContributions: { orchestrator: 12, simulation_cluster: 22, decision_intelligence: 28, operations_optimizer: 18, personal_coach: 6, innovation_advisor: 6, growth_strategist: 4, learning_adaptation: 4 } },
  { level: 3, description: 'Multi-Agent', episodes: [0, 20], rewards: [600, 820], convergenceMetric: [0, 75], agentContributions: { orchestrator: 10, simulation_cluster: 25, decision_intelligence: 25, operations_optimizer: 20, personal_coach: 5, innovation_advisor: 5, growth_strategist: 5, learning_adaptation: 5 } },
];

function burnoutTrajectoryToMitigation(t: BurnoutTrajectory): Array<{ day: number; baseline: number; withPathA: number; withPathB: number; withPathC: number; threshold: number }> {
  const n = Math.min(t.baselineRisk.length, t.afterPathRisk.length);
  return Array.from({ length: n }, (_, i) => ({
    day: i * 5,
    baseline: t.baselineRisk[i],
    withPathA: t.afterPathRisk[i] * 0.65,
    withPathB: t.afterPathRisk[i] * 0.58,
    withPathC: t.afterPathRisk[i] * 0.72,
    threshold: 40,
  }));
}

const DEFAULT_REGIONS = [
  { tier: 1 as const, cities: ['Bangalore', 'Mumbai'], demandMultiplier: 1.5, costMultiplier: 1.4, competitionLevel: 85, growthPotential: 90, marketSize: 500, averageRevenue: 250 },
  { tier: 2 as const, cities: ['Pune', 'Chandigarh'], demandMultiplier: 1.2, costMultiplier: 1.1, competitionLevel: 60, growthPotential: 75, marketSize: 200, averageRevenue: 120 },
  { tier: 3 as const, cities: ['Smaller cities'], demandMultiplier: 0.9, costMultiplier: 0.8, competitionLevel: 40, growthPotential: 65, marketSize: 100, averageRevenue: 60 },
];

export default function Home() {
  const {
    profile,
    setProfile,
    agents,
    updateAgent,
    setCurrentResult,
    currentResult,
    addResult,
    selectedPath,
    setSelectedPath,
    sidebarOpen,
    toggleSidebar,
    rightPanelOpen,
    toggleRightPanel,
    rightPanelTab,
    setRightPanelTab,
    showRoadmap,
    setShowRoadmap,
    isLoading,
    setIsLoading,
  } = useNeoBIStore();

  const [profileStep, setProfileStep] = useState<number>(0);
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    mrr: 500000,
    customers: 50,
    location: 'Bangalore',
    teamSize: 5,
    growthTarget: 20,
    cityTier: 1 as 1 | 2 | 3,
    festival: 'Diwali',
  });

  // NEW: Tier 2/3 state management
  const {
    cascadingPaths, setCascadingPaths, setCascadingLevel, setBreadcrumbPath,
    festivalMultiplier, setFestivalMultiplier, regionalAdjustment, setRegionalAdjustment,
    jugaadHistory, addJugaadIdea, updateJugaadIdea, auditTrail, addAuditEntry,
  } = useNeoBIStore();

  // Handle profile onboarding
  const handleProfileSubmit = () => {
    if (!formData.name || !formData.industry) return;

    const newProfile: BusinessProfile = {
      id: crypto.randomUUID(),
      name: formData.name,
      industry: formData.industry,
      mrr: formData.mrr,
      customers: formData.customers,
      location: formData.location,
      teamSize: formData.teamSize,
      foundedDate: new Date(),
      growthTarget: formData.growthTarget,
      riskTolerance: 'medium',
      vibeMode: 'balanced',
    };

    setProfile(newProfile);
    setProfileStep(0);
  };

  // NEW: Tier 2/3 handlers
  const handleCascadingSelect = async (subPath: any) => {
    setSelectedPath(subPath);
    setCascadingLevel(2);
    setBreadcrumbPath(['Level 1', selectedPath?.name, subPath.name]);
    addAuditEntry({
      timestamp: new Date(),
      action: 'cascading-select',
      details: { level: 2, pathName: subPath.name, riskScore: subPath.riskScore },
    });
  };

  const handleFestivalOverride = (newMultiplier: number) => {
    if (!festivalMultiplier) return;
    const updated = { ...festivalMultiplier, userOverride: newMultiplier };
    setFestivalMultiplier(updated);
    addAuditEntry({
      timestamp: new Date(),
      action: 'festival-override',
      details: { newMultiplier, original: festivalMultiplier.demandMultiplier },
    });
  };

  const handleJugaadFeedback = async (ideaId: string, feedback: 'thumbs_up' | 'thumbs_down') => {
    const idea = jugaadHistory.find((j) => j.id === ideaId);
    if (!idea) return;
    const evolvedRes = await fetch('/api/enhanced', {
      method: 'POST',
      body: JSON.stringify({ action: 'jugaad-evolve', payload: { idea, feedback } }),
    }).then((r) => r.json());
    addJugaadIdea(evolvedRes.data);
    updateJugaadIdea(ideaId, { userFeedback: feedback });
    addAuditEntry({
      timestamp: new Date(),
      action: 'jugaad-feedback',
      details: { ideaId, feedback, generation: evolvedRes.data.generation },
    });
  };

  const generateNewJugaad = () => {
    const categories = ['partnership', 'frugal', 'pivot', 'growth-hack'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const idea: JugaadIdea = {
      id: `jugaad-${Date.now()}`,
      createdAt: new Date(),
      description: `Innovative ${category} strategy for growth`,
      feasibilityScore: 65,
      potentialImpact: 35,
      category: category as any,
      userFeedback: null,
      generation: 1,
    };
    addJugaadIdea(idea);
    addAuditEntry({
      timestamp: new Date(),
      action: 'jugaad-generate',
      details: { category, ideaId: idea.id },
    });
  };

  const handleExportAuditTrail = () => {
    const csv = ['timestamp,action,details']
      .concat(
        auditTrail.map((entry) =>
          `"${entry.timestamp.toISOString()}","${entry.action}","${JSON.stringify(entry.details).replace(/"/g, '\\"')}"`
        )
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neobi-audit-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simulate decision intelligence
  const handleSimulate = async () => {
    if (!profile) return;

    setIsLoading(true);

    // Simulate agents thinking
    const agentIds: Array<keyof typeof agents> = [
      'orchestrator',
      'simulation_cluster',
      'decision_intelligence',
      'operations_optimizer',
    ];

    for (const agentId of agentIds) {
      updateAgent(agentId, { status: 'thinking' });
      await new Promise((resolve) => setTimeout(resolve, 500));
      updateAgent(agentId, { status: 'complete', contribution: Math.random() * 30 + 10 });
    }

    // Generate paths
    const agentContributions = Object.entries(agents).reduce(
      (acc, [id, agent]) => ({
        ...acc,
        [id]: agent.contribution || 0,
      }),
      {} as Record<string, number>
    );

    const paths = generateDecisionPaths(profile, agentContributions);

    // Simulate MARL
    let marlState: MARLState = {
      episode: 0,
      totalReward: 500,
      agentRewards: {
        orchestrator: 0,
        simulation_cluster: 0,
        decision_intelligence: 0,
        operations_optimizer: 0,
        personal_coach: 0,
        innovation_advisor: 0,
        growth_strategist: 0,
        learning_adaptation: 0,
      },
      convergenceMetric: 0,
      replayBufferSize: 0,
      policyVersion: 0,
    };

    for (let i = 0; i < 10; i++) {
      marlState = simulateMARLEpisode(i, marlState, agentContributions);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    updateAgent('learning_adaptation', { status: 'complete', contribution: 15 });

    // NEW: Fetch all Tier 2/3 enhanced metrics in parallel with error handling
    const enhancedMetrics = await Promise.all([
      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'festival-multiplier',
          payload: { festivalName: formData.festival, daysUntil: 45 }
        })
      }).then(r => r.json()).catch(e => { console.error('Festival multiplier failed:', e); return { data: null }; }),
      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'regional-adjustment',
          payload: { cityTier: formData.cityTier, location: formData.location }
        })
      }).then(r => r.json()).catch(e => { console.error('Regional adjustment failed:', e); return { data: null }; }),
      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'cascading-paths',
          payload: { parentPath: paths[1], profile, level: 1 }
        })
      }).then(r => r.json()).catch(e => { console.error('Cascading paths failed:', e); return { data: [] }; }),
      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'reward-decomposition',
          payload: { path: paths[1], profile, cityTier: formData.cityTier, festivalMultiplier: 1.3 }
        })
      }).then(r => r.json()).catch(e => { console.error('Reward decomposition failed:', e); return { data: FALLBACK_REWARD_DECOMPOSITION }; }),
      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'curriculum-learning',
          payload: { episodes: 100 }
        })
      }).then(r => r.json()).catch(e => { console.error('Curriculum learning failed:', e); return { data: FALLBACK_CURRICULUM_LEVELS }; }),
      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'burnout-trajectory',
          payload: { vibeMode: 'balanced', timeline: 30 }
        })
      }).then(r => r.json()).catch(e => { console.error('Burnout trajectory failed:', e); return { data: FALLBACK_BURNOUT_TRAJECTORY }; }),
      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'confidence-distribution',
          payload: { ensembleSize: 10 }
        })
      }).then(r => r.json()).catch(e => { console.error('Confidence distribution failed:', e); return { data: FALLBACK_CONFIDENCE_DISTRIBUTION }; }),
      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'ablation-study',
          payload: {}
        })
      }).then(r => r.json()).catch(e => { console.error('Ablation study failed:', e); return { data: FALLBACK_ABLATION_STUDY }; }),
    ]);

    const result: SimulationResult & any = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      profile,
      query: 'What is the optimal growth strategy for my business?',
      paths,
      recommendation: paths[1],
      marlState,
      confidence: 92,
      executionTime: 2100,
      costUsed: 0,
      // NEW: Tier 2/3 data
      cascadingPaths: enhancedMetrics[2]?.data,
      rewardDecomposition: enhancedMetrics[3]?.data,
      curriculumLevels: enhancedMetrics[4]?.data,
      burnoutTrajectory: enhancedMetrics[5]?.data,
      confidenceDistribution: enhancedMetrics[6]?.data,
      ablationStudy: enhancedMetrics[7]?.data,
    };

    setCurrentResult(result);
    addResult(result);
    setSelectedPath(paths[1]);
    
    // Update Tier 2/3 state
    setFestivalMultiplier(enhancedMetrics[0]?.data);
    setRegionalAdjustment(enhancedMetrics[1]?.data);
    setCascadingPaths(enhancedMetrics[2]?.data);
    setCascadingLevel(1);
    setBreadcrumbPath(['Level 1', paths[1].name]);

    addAuditEntry({
      timestamp: new Date(),
      action: 'simulation-run',
      details: { profile: profile.name, paths: paths.length, selectedPath: paths[1].name }
    });

    setIsLoading(false);

    // Reset agent statuses
    agentIds.forEach((id) => {
      updateAgent(id, { status: 'idle' });
    });
  };

  // Onboarding Modal
  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-8 max-w-2xl w-full mx-4"
        >
          <h1 className="text-3xl font-black bg-gradient-peach bg-clip-text text-transparent mb-2">
            NeoBI India v2.0
          </h1>
          <p className="text-gray-400 mb-6">Agentic BI Co-pilot for Indian Entrepreneurs</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Business Name</label>
              <input
                type="text"
                placeholder="Your startup name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-agents-growth"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-agents-growth appearance-none cursor-pointer"
              >
                <option value="">Select Industry</option>
                <option value="SaaS">SaaS</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Healthcare">Healthcare</option>
                <option value="FinTech">FinTech</option>
                <option value="EdTech">EdTech</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Logistics">Logistics</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Retail">Retail</option>
                <option value="Automotive">Automotive</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Fashion">Fashion</option>
                <option value="Media & Entertainment">Media & Entertainment</option>
                <option value="Consulting">Consulting</option>
                <option value="Telecom">Telecom</option>
                <option value="Energy">Energy</option>
                <option value="Travel & Tourism">Travel & Tourism</option>
                <option value="Legal Services">Legal Services</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">MRR (₹)</label>
                <input
                  type="number"
                  value={formData.mrr}
                  onChange={(e) => setFormData({ ...formData, mrr: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-agents-growth"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Team Size</label>
                <input
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-agents-growth"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Customers</label>
                <input
                  type="number"
                  value={formData.customers}
                  onChange={(e) => setFormData({ ...formData, customers: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-agents-growth"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Growth Target (%/yr)</label>
                <input
                  type="number"
                  value={formData.growthTarget}
                  onChange={(e) => setFormData({ ...formData, growthTarget: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-agents-growth"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-agents-growth appearance-none cursor-pointer"
              >
                <option>Select Location</option>
                <option>Bangalore</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Hyderabad</option>
                <option>Pune</option>
                <option>Chennai</option>
                <option>Kolkata</option>
                <option>Indore</option>
                <option>Jaipur</option>
                <option>Chandigarh</option>
                <option>Ahmedabad</option>
                <option>Surat</option>
                <option>Lucknow</option>
                <option>Coimbatore</option>
                <option>Kochi</option>
                <option>Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">City Tier</label>
                <select
                  value={formData.cityTier}
                  onChange={(e) => setFormData({ ...formData, cityTier: parseInt(e.target.value) as 1 | 2 | 3 })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-agents-growth appearance-none cursor-pointer"
                >
                  <option value="1">Tier 1 - Metro</option>
                  <option value="2">Tier 2 - City</option>
                  <option value="3">Tier 3 - Town</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Festival Preference</label>
                <select
                  value={formData.festival}
                  onChange={(e) => setFormData({ ...formData, festival: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-agents-growth appearance-none cursor-pointer"
                >
                  <option value="Diwali">Diwali</option>
                  <option value="Holi">Holi</option>
                  <option value="Ganesh Chaturthi">Ganesh Chaturthi</option>
                  <option value="Navratri">Navratri</option>
                  <option value="Eid">Eid</option>
                  <option value="Christmas">Christmas</option>
                  <option value="New Year">New Year</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProfileSubmit}
              disabled={!formData.name || !formData.industry}
              className="w-full py-3 rounded-lg bg-gradient-peach text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Intelligence Journey →
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-raven-base overflow-hidden">
      {/* Particle Background */}
      <div className="particle-bg" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-agents-growth border-t-transparent mb-4"></div>
            <h3 className="text-xl font-bold bg-gradient-peach bg-clip-text text-transparent">Running Intelligence...</h3>
            <p className="text-gray-400 text-sm mt-2">Analyzing decision paths, MARL simulation, and enhanced metrics</p>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <LiveTickerBar />

      {/* Main Grid */}
      <div className="flex-1 flex overflow-hidden mt-16 pb-16">
        {/* Left Sidebar */}
        <motion.div
          animate={{
            width: sidebarOpen ? '20%' : '0px',
            opacity: sidebarOpen ? 1 : 0,
          }}
          className="glass glass-dark border-r border-white/10 overflow-hidden flex flex-col"
        >
          <AgentActivityTree />
          <div className="border-t border-white/10">
            <ControlBar />
          </div>
        </motion.div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden px-6 py-4 gap-4">
          {/* Header with Simulate Button */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Toggle sidebar"
              >
                {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              <h2 className="text-2xl font-black bg-gradient-peach bg-clip-text text-transparent">
                Decision Intelligence Canvas
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSimulate}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gradient-peach text-black font-bold flex items-center gap-2 disabled:opacity-50"
              >
                <Zap size={18} />
                {isLoading ? 'Thinking...' : 'Run Intelligence'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRoadmap(!showRoadmap)}
                className="px-4 py-2 rounded-lg glass hover:bg-white/20 transition-all font-bold flex items-center gap-2"
              >
                <BookOpen size={18} />
                Roadmap
              </motion.button>

              {/* NEW: Full Page Roadmap Button */}
              {currentResult && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFullRoadmap(true)}
                  className="px-4 py-2 rounded-lg bg-amber-600/40 hover:bg-amber-600/60 border border-amber-400/40 font-bold flex items-center gap-2 text-amber-200"
                >
                  <Map size={18} />
                  Full Roadmap
                </motion.button>
              )}
            </div>
          </div>

          {/* Dynamic Canvas View */}
          {showRoadmap ? (
            // Full-page Roadmap View with ALL 12 graphs
            <div className="flex-1 overflow-y-auto space-y-4">
              <h3 className="text-lg font-bold text-agents-growth">Core Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <MARLConvergenceCurve />
                <WorldModelAccuracyChart />
              </div>
              
              <h3 className="text-lg font-bold text-agents-growth mt-6">Financial & Operations</h3>
              <div className="grid grid-cols-2 gap-4">
                <CashFlowProjectionChart />
                <InventoryTurnoverChart />
              </div>
              
              <h3 className="text-lg font-bold text-agents-growth mt-6">Advanced Analytics</h3>
              <div className="grid grid-cols-2 gap-4">
                <SHAPBeeswarm />
                <AgentContributionPie />
              </div>
              
              <h3 className="text-lg font-bold text-agents-growth mt-6">Risk & Insights</h3>
              <div className="grid grid-cols-2 gap-4">
                <ConfidenceDistributionHistogram />
                <BurnoutRiskChart />
              </div>
            </div>
          ) : (
            // Default Decision Canvas - Shows decision paths then graphs
            <div className="flex-1 overflow-y-auto space-y-4">
              {currentResult ? (
                <>
                  {/* Decision Paths Roadmap */}
                  <div>
                    <h3 className="text-lg font-bold text-agents-growth mb-3">Decision Paths</h3>
                    <div className="space-y-3">
                      {currentResult.paths.map((path, idx) => (
                        <motion.div
                          key={path.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <button
                            onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
                            className={`w-full p-4 rounded-lg transition-all micro-hover text-left ${
                              selectedPath?.id === path.id
                                ? 'bg-gradient-peach shadow-2xl shadow-agents-growth/30 text-black'
                                : 'glass hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold">{path.name}</h4>
                                <p className={`text-xs ${selectedPath?.id === path.id ? 'text-black/60' : 'text-gray-400'}`}>
                                  {path.description}
                                </p>
                              </div>
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                selectedPath?.id === path.id ? 'bg-black/20' : 'bg-white/10'
                              }`}>
                                {path.timeline}d
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                              <div>
                                <span className={`${selectedPath?.id === path.id ? 'text-black/60' : 'text-gray-500'} block text-[10px]`}>EV</span>
                                <span className="font-bold">₹{(path.expectedValue / 100000).toFixed(1)}L</span>
                              </div>
                              <div>
                                <span className={`${selectedPath?.id === path.id ? 'text-black/60' : 'text-gray-500'} block text-[10px]`}>Prob</span>
                                <span className="font-bold">{(path.probability * 100).toFixed(0)}%</span>
                              </div>
                              <div>
                                <span className={`${selectedPath?.id === path.id ? 'text-black/60' : 'text-gray-500'} block text-[10px]`}>Risk</span>
                                <span className={`font-bold ${
                                  path.riskScore > 60 ? 'text-red-400' : path.riskScore > 30 ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                  {path.riskScore}/100
                                </span>
                              </div>
                            </div>

                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${path.probability * 100}%` }}
                                className={`h-full ${selectedPath?.id === path.id ? 'bg-black/30' : 'bg-agents-growth'}`}
                              />
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Graphs Below Paths */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-agents-growth mb-3">Analytics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <MARLConvergenceCurve />
                      <CashFlowProjectionChart />
                      <SHAPBeeswarm />
                      <AgentContributionPie />
                      <BurnoutRiskChart />
                      <ConfidenceDistributionHistogram />
                    </div>
                  </div>

                  {/* NEW: TIER 1 - Game-Changing Novelties */}
                  {cascadingPaths && cascadingPaths.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-amber-300 mb-3">🎯 Tier 1: Game-Changing Novelties</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <CascadingPathSelector
                          parentName={selectedPath?.name || 'Strategy'}
                          cascadingPaths={cascadingPaths}
                          onSelectPath={handleCascadingSelect}
                          breadcrumb={['Level 1', selectedPath?.name || 'Root']}
                        />
                        {festivalMultiplier && (
                          <FestivalMultiplierSlider
                            festivalMultiplier={festivalMultiplier}
                            onOverrideChange={handleFestivalOverride}
                          />
                        )}
                        {regionalAdjustment && (
                          <RegionalAdjustmentGauge adjustment={regionalAdjustment} />
                        )}
                        <JugaadGenerator
                          ideas={jugaadHistory}
                          onGenerateNew={generateNewJugaad}
                          onEvolve={handleJugaadFeedback}
                        />
                      </div>
                    </div>
                  )}

                  {/* TIER 2 - Critical Visualizations (always show with fallback data) */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-amber-300 mb-3">📊 Tier 2: Advanced Analytics</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div style={{ height: '300px' }}>
                        <GlobalSHAPBeeswarm
                          features={['MRR', 'Team Size', 'Market Growth', 'Seasonality', 'Competitor']}
                          baseValue={currentResult.marlState?.totalReward ?? 500}
                        />
                      </div>
                      <div style={{ height: '300px' }}>
                        <RewardDecompositionChart decomposition={currentResult.rewardDecomposition ?? FALLBACK_REWARD_DECOMPOSITION} />
                      </div>
                      <div style={{ height: '300px' }}>
                        <CurriculumBreakdown levels={currentResult.curriculumLevels ?? FALLBACK_CURRICULUM_LEVELS} />
                      </div>
                      <div style={{ height: '300px' }}>
                        <AblationStudyChart ablations={currentResult.ablationStudy ?? FALLBACK_ABLATION_STUDY} />
                      </div>
                      <div style={{ height: '300px' }}>
                        <BurnoutTrajectoryChart trajectory={currentResult.burnoutTrajectory ?? FALLBACK_BURNOUT_TRAJECTORY} />
                      </div>
                      <div style={{ height: '300px' }}>
                        <ConfidenceDistributionHistogram distribution={currentResult.confidenceDistribution ?? FALLBACK_CONFIDENCE_DISTRIBUTION} />
                      </div>
                    </div>
                  </div>

                  {/* TIER 3 - Deep Intelligence (always show with fallback data) */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-amber-300 mb-3">🔬 Tier 3: Deep Intelligence</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div style={{ height: '340px' }}>
                        <BurnoutMitigationPathways
                          trajectories={currentResult.burnoutTrajectory
                            ? burnoutTrajectoryToMitigation(currentResult.burnoutTrajectory)
                            : FALLBACK_MITIGATION_TRAJECTORIES}
                        />
                      </div>
                      <UPIFraudDefense
                        currentRisk={65}
                        vulnerabilities={[
                          { type: 'Transaction Spoofing', severity: 'high', description: 'Fraudulent payment requests', mitigation: 'Implement 2FA on all transactions', defenseLevel: 75 },
                          { type: 'Phishing Links', severity: 'medium', description: 'Fake UPI links in messages', mitigation: 'Real-time link validation', defenseLevel: 82 },
                          { type: 'SIM Swap', severity: 'high', description: 'OTP interception', mitigation: 'Biometric + device binding', defenseLevel: 70 },
                        ]}
                      />
                      <SelfEvolvingJugaadGenerator ideas={jugaadHistory} onGenerateNew={generateNewJugaad} />
                      <RegionalInequalityAdjustment regions={DEFAULT_REGIONS} selectedTier={selectedRegion} />
                    </div>
                  </div>

                  {/* Festival Awareness */}
                  <FestivalAwareDemandMultiplier
                    festivals={[
                      {
                        name: formData.festival,
                        date: formData.festival,
                        daysUntil: 45,
                        baseMultiplier: 1.0,
                        peakMultiplier: 2.5,
                        demandCurve: Array.from({ length: 30 }, (_, i) => ({
                          day: i,
                          multiplier: 1 + (Math.sin((i / 30) * Math.PI) * 1.5),
                        })),
                        affectedCategories: ['Gifts', 'Electronics', 'Clothing', 'Home Decor'],
                        historicalSales: 5000,
                      },
                    ]}
                    selectedFestival={formData.festival}
                    onSelectFestival={setSelectedFestival}
                  />

                  {/* Advanced Audit Trail */}
                  <AdvancedAuditTrail entries={auditTrail} onExport={handleExportAuditTrail} />

                  {/* Full Page Roadmap Modal */}
                  {showFullRoadmap && <FullPageRoadmap onClose={() => setShowFullRoadmap(false)} />}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold mb-2">Run Intelligence</h3>
                    <p className="text-gray-400">Click "Run Intelligence" to generate decision paths with MARL simulation</p>
                    <p className="text-gray-500 text-sm mt-2">All Tier 1, 2, 3 features will appear here</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <motion.div
          animate={{
            width: rightPanelOpen ? '20%' : '0px',
            opacity: rightPanelOpen ? 1 : 0,
          }}
          className="glass glass-dark border-l border-white/10 overflow-hidden flex flex-col"
        >
          {rightPanelOpen && (
            <>
              {/* Tabs */}
              <div className="flex border-b border-white/10 overflow-x-auto text-xs">
                <button 
                  onClick={() => setRightPanelTab('deep-dive')}
                  className={`flex-1 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${
                    rightPanelTab === 'deep-dive' 
                      ? 'border-agents-growth text-agents-growth' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Deep Dive
                </button>
                <button 
                  onClick={() => setRightPanelTab('operations')}
                  className={`flex-1 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${
                    rightPanelTab === 'operations' 
                      ? 'border-agents-growth text-agents-growth' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Operations
                </button>
                <button 
                  onClick={() => setRightPanelTab('tier2')}
                  className={`flex-1 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${
                    rightPanelTab === 'tier2' 
                      ? 'border-amber-400 text-amber-300' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Tier 2
                </button>
                <button 
                  onClick={() => setRightPanelTab('compliance')}
                  className={`flex-1 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${
                    rightPanelTab === 'compliance' 
                      ? 'border-green-400 text-green-300' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Compliance
                </button>
                <button 
                  onClick={() => setRightPanelTab('tier3')}
                  className={`flex-1 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${
                    rightPanelTab === 'tier3' 
                      ? 'border-amber-400 text-amber-300' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Tier 3
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {rightPanelTab === 'deep-dive' && <RiskAndCoachPanel />}
                {rightPanelTab === 'operations' && <OperationsPanel />}
                {rightPanelTab === 'compliance' && <CompliancePanel />}
                {rightPanelTab === 'tier2' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-amber-300 sticky top-0 bg-raven-base/95 py-1 z-10">📊 Tier 2: Advanced Analytics</h4>
                    {!currentResult ? (
                      <p className="text-xs text-gray-400">Run Intelligence to load Tier 2 data, or explore with sample data below.</p>
                    ) : null}
                    <div className="space-y-3">
                      <div className="h-64">
                        <GlobalSHAPBeeswarm
                          features={['MRR', 'Team Size', 'Market Growth', 'Seasonality', 'Competitor']}
                          baseValue={currentResult?.marlState?.totalReward ?? 500}
                        />
                      </div>
                      <div className="h-64">
                        <RewardDecompositionChart decomposition={currentResult?.rewardDecomposition ?? FALLBACK_REWARD_DECOMPOSITION} />
                      </div>
                      <div className="h-64">
                        <CurriculumBreakdown levels={currentResult?.curriculumLevels ?? FALLBACK_CURRICULUM_LEVELS} />
                      </div>
                      <div className="h-64">
                        <AblationStudyChart ablations={currentResult?.ablationStudy ?? FALLBACK_ABLATION_STUDY} />
                      </div>
                      <div className="h-64">
                        <BurnoutTrajectoryChart trajectory={currentResult?.burnoutTrajectory ?? FALLBACK_BURNOUT_TRAJECTORY} />
                      </div>
                      <div className="h-64">
                        <ConfidenceDistributionHistogram distribution={currentResult?.confidenceDistribution ?? FALLBACK_CONFIDENCE_DISTRIBUTION} />
                      </div>
                    </div>
                  </div>
                )}
                {rightPanelTab === 'tier3' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-amber-300 sticky top-0 bg-raven-base/95 py-1 z-10">🔬 Tier 3: Deep Intelligence</h4>
                    {!currentResult ? (
                      <p className="text-xs text-gray-400">Run Intelligence to load Tier 3 data, or explore with sample data below.</p>
                    ) : null}
                    <div className="space-y-3">
                      <div className="h-72">
                        <BurnoutMitigationPathways
                          trajectories={currentResult?.burnoutTrajectory
                            ? burnoutTrajectoryToMitigation(currentResult.burnoutTrajectory)
                            : FALLBACK_MITIGATION_TRAJECTORIES}
                        />
                      </div>
                      <UPIFraudDefense
                        currentRisk={65}
                        vulnerabilities={[
                          { type: 'Transaction Spoofing', severity: 'high', description: 'Fraudulent payment requests', mitigation: 'Implement 2FA on all transactions', defenseLevel: 75 },
                          { type: 'Phishing Links', severity: 'medium', description: 'Fake UPI links in messages', mitigation: 'Real-time link validation', defenseLevel: 82 },
                        ]}
                      />
                      <SelfEvolvingJugaadGenerator ideas={jugaadHistory} onGenerateNew={generateNewJugaad} />
                      <RegionalInequalityAdjustment regions={DEFAULT_REGIONS} selectedTier={selectedRegion} />
                      <div className="pt-2">
                        <AdvancedAuditTrail entries={auditTrail} onExport={handleExportAuditTrail} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* Toggle Right Panel Button */}
        <button
          onClick={toggleRightPanel}
          className="fixed right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-l-lg transition-colors z-30"
        >
          {rightPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Bottom Metrics & Export Bar */}
      <MetricsAndExportBar />
    </div>
  );
}
