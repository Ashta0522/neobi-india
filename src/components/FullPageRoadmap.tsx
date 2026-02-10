'use client';

import React, { useCallback, useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Zap, Target, TrendingUp, Shield, Brain, Code2, Package, Users, Lightbulb, Loader2, CheckCircle, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import { useNeoBIStore } from '@/lib/store';
import { generateExecutionOptions, getIndustryPaths, ExecutionOption } from '@/lib/industryStrategies';

// Roadmap Summary Component - Shows user path vs optimal path
const RoadmapSummary = memo(({ decisionHistory, profile, onClose, onExportPDF }: {
  decisionHistory: string[];
  profile: any;
  onClose: () => void;
  onExportPDF: () => void;
}) => {
  const { vibeMode, riskSlider, currentResult } = useNeoBIStore();

  // Calculate optimal path based on recommendation from simulation or fallback to vibe mode
  const optimalPath = useMemo(() => {
    const recommendation = currentResult?.recommendation;
    const query = currentResult?.query || '';

    // If we have a recommendation from the simulation, use it
    if (recommendation) {
      return {
        strategy: recommendation.name,
        steps: recommendation.steps || [
          `Implement ${recommendation.name}`,
          'Monitor key metrics',
          'Adjust based on results',
          'Scale successful strategies',
        ],
        expectedROI: `${Math.round((recommendation.expectedValue / (profile?.mrr * 12 || 100000)) * 100)}%`,
        risk: `${recommendation.riskScore > 60 ? 'High' : recommendation.riskScore > 40 ? 'Medium' : 'Low'} (${recommendation.riskScore}/100)`,
        timeline: `${Math.round(recommendation.timeline / 30)} months`,
        reasoning: `Based on your query "${query.substring(0, 40)}${query.length > 40 ? '...' : ''}", this ${recommendation.name} path is recommended with ${Math.round(recommendation.probability * 100)}% success probability.`,
      };
    }

    // Fallback to vibe mode based recommendations
    const riskTolerance = riskSlider / 100;

    if (vibeMode === 'conservative' || riskTolerance < 0.33) {
      return {
        strategy: 'Conservative Path',
        steps: ['Focus on customer retention', 'Build 12+ months runway', 'Optimize profit margins', 'Organic growth only'],
        expectedROI: '60-80%',
        risk: 'Low (20/100)',
        timeline: '12-18 months',
        reasoning: 'Based on your conservative vibe mode and low risk tolerance, this path prioritizes stability over rapid growth.',
      };
    } else if (vibeMode === 'aggressive' || riskTolerance > 0.66) {
      return {
        strategy: 'Aggressive Scaling',
        steps: ['Raise funding immediately', 'Hire aggressively (10+ roles)', 'Launch multi-city expansion', 'Heavy marketing spend'],
        expectedROI: '150-200%',
        risk: 'High (72/100)',
        timeline: '3-6 months',
        reasoning: 'Based on your aggressive vibe mode and high risk tolerance, this path maximizes growth potential.',
      };
    } else {
      return {
        strategy: 'Balanced Growth',
        steps: ['Optimize current operations', 'Hire 3-5 key roles strategically', 'Phased market expansion', 'Focus on unit economics'],
        expectedROI: '100-120%',
        risk: 'Medium (45/100)',
        timeline: '6-12 months',
        reasoning: 'Based on your balanced vibe mode, this path offers sustainable growth with manageable risk.',
      };
    }
  }, [vibeMode, riskSlider, currentResult, profile]);

  // Calculate match score between user path and optimal path
  const matchScore = useMemo(() => {
    if (decisionHistory.length === 0) return 0;

    const userPathLower = decisionHistory.map(d => d.toLowerCase()).join(' ');
    const optimalLower = optimalPath.strategy.toLowerCase();

    // Simple matching - check if user explored similar path
    if (userPathLower.includes('conservative') || userPathLower.includes('safe')) {
      if (optimalLower.includes('conservative')) return 95;
      if (optimalLower.includes('balanced')) return 70;
      return 45;
    }
    if (userPathLower.includes('aggressive') || userPathLower.includes('rapid') || userPathLower.includes('scaling')) {
      if (optimalLower.includes('aggressive')) return 95;
      if (optimalLower.includes('balanced')) return 65;
      return 40;
    }
    if (userPathLower.includes('balanced') || userPathLower.includes('phased') || userPathLower.includes('organic')) {
      if (optimalLower.includes('balanced')) return 95;
      return 70;
    }

    return Math.min(85, 50 + decisionHistory.length * 10);
  }, [decisionHistory, optimalPath]);

  if (decisionHistory.length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 right-4 z-[60] max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Decision Summary
            </h3>
            <p className="text-sm text-gray-400 mt-1">Your exploration path vs AI-recommended optimal strategy</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* User's Path */}
          <div className="p-4 bg-blue-900/30 rounded-xl border border-blue-500/30">
            <h4 className="font-bold text-blue-400 text-sm mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Your Explored Path
            </h4>
            <div className="space-y-2">
              {decisionHistory.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-white">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optimal Path */}
          <div className="p-4 bg-green-900/30 rounded-xl border border-green-500/30">
            <h4 className="font-bold text-green-400 text-sm mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              AI Optimal Path: {optimalPath.strategy}
            </h4>
            <div className="space-y-2">
              {optimalPath.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-green-500/30 text-green-300 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-white">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Match Score & Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="p-3 bg-black/30 rounded-lg text-center">
            <div className="text-2xl font-black text-amber-400">{matchScore}%</div>
            <div className="text-[10px] text-gray-400">Path Match</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg text-center">
            <div className="text-lg font-bold text-green-400">{optimalPath.expectedROI}</div>
            <div className="text-[10px] text-gray-400">Expected ROI</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg text-center">
            <div className="text-lg font-bold text-orange-400">{optimalPath.risk}</div>
            <div className="text-[10px] text-gray-400">Risk Level</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-400">{optimalPath.timeline}</div>
            <div className="text-[10px] text-gray-400">Timeline</div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30 mb-4">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-purple-400 mb-1">AI Reasoning</div>
              <p className="text-xs text-gray-300">{optimalPath.reasoning}</p>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`p-3 rounded-lg ${matchScore >= 80 ? 'bg-green-900/30 border border-green-500/30' : matchScore >= 60 ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
          <div className="flex items-center gap-2">
            {matchScore >= 80 ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            <span className="text-sm font-bold text-white">
              {matchScore >= 80
                ? 'Excellent! Your path aligns well with AI recommendations.'
                : matchScore >= 60
                ? 'Good exploration! Consider the optimal path elements for better results.'
                : 'Your path diverges from optimal. Review AI recommendations for higher success probability.'}
            </span>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onExportPDF}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold rounded-lg text-sm flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <FileText className="w-4 h-4" />
            Export to PDF Report
          </button>
        </div>
      </div>
    </motion.div>
  );
});

RoadmapSummary.displayName = 'RoadmapSummary';

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  level: 1 | 2 | 3;
  children: string[];
  metrics: { label: string; value: number }[];
  actions: { label: string; action: () => void }[];
}

// Memoized node component for better performance
const RoadmapNodeCard = memo(({ node, isSelected, onClick, getNodeColor }: {
  node: RoadmapNode;
  isSelected: boolean;
  onClick: () => void;
  getNodeColor: (level: 1 | 2 | 3) => string;
}) => (
  <motion.button
    onClick={onClick}
    className={`
      relative p-4 rounded-xl border-2 transition-all cursor-pointer
      ${isSelected
        ? 'border-amber-400 bg-gradient-to-br ' + getNodeColor(node.level) + ' shadow-lg scale-110'
        : 'border-amber-500/30 bg-gradient-to-br ' + getNodeColor(node.level) + ' hover:border-amber-400 shadow'
      }
    `}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="text-white flex gap-3 items-start min-w-[180px]">
      <div className="mt-1">{node.icon}</div>
      <div className="text-left">
        <h4 className="font-bold text-sm">{node.title}</h4>
        <p className="text-xs opacity-80 line-clamp-2">{node.description}</p>
      </div>
    </div>
  </motion.button>
));

RoadmapNodeCard.displayName = 'RoadmapNodeCard';

// Memoized execution option card
const ExecutionOptionCard = memo(({ child, onExplore }: {
  child: any;
  onExplore: () => void;
}) => (
  <div className="w-72 p-4 rounded-lg bg-black/40 border border-amber-400/20 hover:border-amber-400/50 transition-all">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0">
        {child.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-amber-200 text-sm">{child.title}</div>
        <div className="text-xs text-amber-300/60 mt-1 line-clamp-2">{child.description}</div>
      </div>
    </div>

    {child.category && (
      <div className="mt-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
          child.category === 'marketing' ? 'bg-pink-500/20 text-pink-300' :
          child.category === 'operations' ? 'bg-blue-500/20 text-blue-300' :
          child.category === 'growth' ? 'bg-green-500/20 text-green-300' :
          child.category === 'partnerships' ? 'bg-purple-500/20 text-purple-300' :
          child.category === 'technology' ? 'bg-cyan-500/20 text-cyan-300' :
          'bg-gray-500/20 text-gray-300'
        }`}>
          {child.category}
        </span>
      </div>
    )}

    <div className="mt-3 grid grid-cols-3 gap-1">
      {child.metrics.map((m: any) => (
        <div key={m.label} className="text-center p-1.5 bg-black/40 rounded">
          <div className="text-[10px] text-amber-300/50">{m.label.replace('Projected ', '').replace(' Delta', '')}</div>
          <div className={`text-xs font-bold ${
            m.label.includes('Revenue') ? 'text-green-400' :
            m.label.includes('Risk') ? 'text-orange-400' :
            m.label.includes('Burnout') ? (m.value < 0 ? 'text-green-400' : 'text-red-400') :
            'text-amber-300'
          }`}>
            {m.label.includes('Burnout') && m.value > 0 ? '+' : ''}{m.value}{m.label.includes('Revenue') ? '%' : ''}
          </div>
        </div>
      ))}
    </div>

    {(child.cost || child.timelineDays) && (
      <div className="mt-2 flex justify-between text-[10px] text-amber-300/50">
        {child.cost && <span>Est. Cost: ₹{(child.cost / 1000).toFixed(0)}K</span>}
        {child.timelineDays && <span>{child.timelineDays} days</span>}
      </div>
    )}

    <div className="mt-3">
      <button
        onClick={onExplore}
        className="w-full px-3 py-2 bg-gradient-to-r from-amber-600/40 to-amber-700/40 hover:from-amber-600 hover:to-amber-700 rounded text-amber-100 text-xs font-semibold transition-all"
      >
        Explore Strategy →
      </button>
    </div>
  </div>
));

ExecutionOptionCard.displayName = 'ExecutionOptionCard';

const FullPageRoadmap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentResult, setCascadingLevel, setBreadcrumbPath, decisionHistory, pushDecision, popDecision, resetDecisionHistory, profile } = useNeoBIStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Auto-show summary when user has explored 3+ decisions
  const shouldShowSummaryButton = (decisionHistory || []).length >= 2;

  const handleExportPDF = useCallback(() => {
    // Store roadmap data in localStorage for the report page
    if (typeof window !== 'undefined') {
      const roadmapData = {
        decisionHistory: decisionHistory || [],
        profile,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('neobi_roadmap_export', JSON.stringify(roadmapData));
      // Open the share report modal or trigger PDF generation
      window.print();
    }
  }, [decisionHistory, profile]);

  const industryPaths = useMemo(() => {
    return getIndustryPaths(profile?.industry || 'generic');
  }, [profile?.industry]);

  // Determine roadmap context based on user query
  const queryContext = useMemo(() => {
    const query = currentResult?.query || '';
    const queryLower = query.toLowerCase();

    if (queryLower.includes('legal') || queryLower.includes('compliance') || queryLower.includes('staff') || queryLower.includes('hr')) {
      return { type: 'compliance', title: 'Compliance & Legal Strategy', icon: <Shield className="w-8 h-8" /> };
    }
    if (queryLower.includes('fund') || queryLower.includes('money') || queryLower.includes('cash') || queryLower.includes('runway')) {
      return { type: 'funding', title: 'Funding & Financial Strategy', icon: <TrendingUp className="w-8 h-8" /> };
    }
    if (queryLower.includes('hir') || queryLower.includes('team') || queryLower.includes('recruit')) {
      return { type: 'hiring', title: 'Hiring & Team Strategy', icon: <Users className="w-8 h-8" /> };
    }
    if (queryLower.includes('market') || queryLower.includes('expand') || queryLower.includes('growth')) {
      return { type: 'growth', title: 'Market Expansion Strategy', icon: <Target className="w-8 h-8" /> };
    }
    if (queryLower.includes('operation') || queryLower.includes('efficien') || queryLower.includes('process')) {
      return { type: 'operations', title: 'Operations Optimization', icon: <Zap className="w-8 h-8" /> };
    }
    if (queryLower.includes('pivot') || queryLower.includes('change') || queryLower.includes('new direction')) {
      return { type: 'pivot', title: 'Business Pivot Strategy', icon: <Lightbulb className="w-8 h-8" /> };
    }
    return { type: 'growth', title: `${profile?.industry || 'Business'} Growth Strategy`, icon: <Target className="w-8 h-8" /> };
  }, [currentResult?.query, profile?.industry]);

  const nodes: Record<string, RoadmapNode> = useMemo(() => {
    const businessName = profile?.name || 'Your Business';
    const industry = profile?.industry || 'Business';
    const location = profile?.location || 'India';
    const paths = currentResult?.paths || [];

    // Build dynamic child IDs from actual paths
    const pathIds = paths.map(p => p.id);

    // Base nodes with dynamic context
    const baseNodes: Record<string, RoadmapNode> = {
      root: {
        id: 'root',
        title: queryContext.title,
        description: currentResult?.query
          ? `Strategy for: "${currentResult.query.substring(0, 50)}${currentResult.query.length > 50 ? '...' : ''}"`
          : `Strategic decision tree for ${businessName} in ${location}`,
        icon: queryContext.icon,
        level: 1,
        children: pathIds.length > 0 ? pathIds : ['conservative', 'balanced', 'aggressive'],
        metrics: [
          { label: 'Risk Score', value: profile?.riskTolerance === 'high' ? 70 : profile?.riskTolerance === 'low' ? 30 : 50 },
          { label: 'Growth Target', value: profile?.growthTarget || 30 },
          { label: 'Confidence', value: currentResult?.confidence || 85 },
        ],
        actions: [],
      },
    };

    // Add dynamic nodes from currentResult.paths
    paths.forEach((path, idx) => {
      const iconMap: Record<string, React.ReactNode> = {
        aggressive: <Zap className="w-6 h-6" />,
        balanced: <TrendingUp className="w-6 h-6" />,
        conservative: <Shield className="w-6 h-6" />,
      };
      const defaultIcon = idx === 0 ? <Target className="w-6 h-6" /> : idx === 1 ? <Brain className="w-6 h-6" /> : <Lightbulb className="w-6 h-6" />;

      baseNodes[path.id] = {
        id: path.id,
        title: path.name,
        description: path.description,
        icon: iconMap[path.id] || defaultIcon,
        level: 2,
        children: [],
        metrics: [
          { label: 'Success Prob', value: Math.round(path.probability * 100) },
          { label: 'Risk Score', value: path.riskScore },
          { label: 'Timeline', value: Math.min(100, Math.round(path.timeline / 3)) },
        ],
        actions: [],
      };
    });

    // Fallback nodes if no paths from currentResult
    if (paths.length === 0) {
      baseNodes.conservative = {
        id: 'conservative',
        title: industryPaths.conservative,
        description: 'Low-risk, steady growth approach',
        icon: <Shield className="w-6 h-6" />,
        level: 2,
        children: ['partnership', 'organic', 'optimization'],
        metrics: [{ label: 'Risk', value: 20 }, { label: 'Timeline', value: 120 }, { label: 'ROI', value: 60 }],
        actions: [],
      };
      baseNodes.balanced = {
        id: 'balanced',
        title: industryPaths.balanced,
        description: 'Balanced growth with sustainability',
        icon: <TrendingUp className="w-6 h-6" />,
        level: 2,
        children: ['market-expansion', 'team-scaling', 'product-launch'],
        metrics: [{ label: 'Risk', value: 50 }, { label: 'Timeline', value: 150 }, { label: 'ROI', value: 120 }],
        actions: [],
      };
      baseNodes.aggressive = {
        id: 'aggressive',
        title: industryPaths.aggressive,
        description: 'High-growth market capture',
        icon: <Zap className="w-6 h-6" />,
        level: 2,
        children: ['vc-funding', 'market-takeover', 'international'],
        metrics: [{ label: 'Risk', value: 75 }, { label: 'Timeline', value: 200 }, { label: 'ROI', value: 200 }],
        actions: [],
      };
      // Level 3 fallback nodes
      baseNodes.partnership = { id: 'partnership', title: 'Strategic Partnerships', description: `Partner with ${industry} businesses`, icon: <Users className="w-6 h-6" />, level: 3, children: [], metrics: [{ label: 'Cost', value: 30 }, { label: 'Speed', value: 85 }, { label: 'Sustainability', value: 80 }], actions: [] };
      baseNodes.organic = { id: 'organic', title: 'Organic Growth', description: 'Bootstrap with existing profits', icon: <Brain className="w-6 h-6" />, level: 3, children: [], metrics: [{ label: 'Cost', value: 20 }, { label: 'Speed', value: 40 }, { label: 'Independence', value: 95 }], actions: [] };
      baseNodes.optimization = { id: 'optimization', title: 'Process Optimization', description: 'Improve efficiency', icon: <TrendingUp className="w-6 h-6" />, level: 3, children: [], metrics: [{ label: 'Impact', value: 70 }, { label: 'Implementation', value: 60 }, { label: 'Payback', value: 50 }], actions: [] };
      baseNodes['market-expansion'] = { id: 'market-expansion', title: 'Market Expansion', description: 'Expand to new markets', icon: <Zap className="w-6 h-6" />, level: 3, children: [], metrics: [{ label: 'Market Size', value: 90 }, { label: 'Competition', value: 65 }, { label: 'Entry Cost', value: 75 }], actions: [] };
      baseNodes['team-scaling'] = { id: 'team-scaling', title: 'Team Scaling', description: `Grow from ${profile?.teamSize || 5}`, icon: <Users className="w-6 h-6" />, level: 3, children: [], metrics: [{ label: 'Hiring Needs', value: 55 }, { label: 'Training', value: 45 }, { label: 'Retention', value: 70 }], actions: [] };
      baseNodes['product-launch'] = { id: 'product-launch', title: 'New Product', description: 'Launch new offerings', icon: <Package className="w-6 h-6" />, level: 3, children: [], metrics: [{ label: 'Development', value: 60 }, { label: 'Market Fit', value: 50 }, { label: 'Revenue', value: 85 }], actions: [] };
      baseNodes['vc-funding'] = { id: 'vc-funding', title: 'Funding Round', description: 'Raise capital', icon: <Zap className="w-6 h-6" />, level: 3, children: [], metrics: [{ label: 'Capital', value: 95 }, { label: 'Dilution', value: 40 }, { label: 'Timeline', value: 75 }], actions: [] };
      baseNodes['market-takeover'] = { id: 'market-takeover', title: 'Market Leadership', description: 'Become market leader', icon: <Shield className="w-6 h-6" />, level: 3, children: [], metrics: [{ label: 'Market Share', value: 85 }, { label: 'Brand', value: 90 }, { label: 'Risk', value: 85 }], actions: [] };
      baseNodes.international = { id: 'international', title: 'Geographic Expansion', description: 'Expand beyond current', icon: <Target className="w-6 h-6" />, level: 3, children: [], metrics: [{ label: 'Potential', value: 95 }, { label: 'Complexity', value: 80 }, { label: 'Investment', value: 90 }], actions: [] };
    }

    return baseNodes;
  }, [profile, industryPaths, currentResult, queryContext]);

  const getNodeColor = useCallback((level: 1 | 2 | 3) => {
    const colors = { 1: 'from-amber-600 to-amber-700', 2: 'from-amber-500 to-amber-600', 3: 'from-amber-400 to-amber-500' };
    return colors[level];
  }, []);

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case 'marketing': return <TrendingUp className="w-6 h-6" />;
      case 'operations': return <Shield className="w-6 h-6" />;
      case 'growth': return <Zap className="w-6 h-6" />;
      case 'partnerships': return <Users className="w-6 h-6" />;
      case 'technology': return <Code2 className="w-6 h-6" />;
      default: return <Lightbulb className="w-6 h-6" />;
    }
  }, []);

  // Seeded random for consistent but varied shuffling
  const seededRandom = useCallback((seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return () => {
      hash = (hash * 1103515245 + 12345) & 0x7fffffff;
      return hash / 0x7fffffff;
    };
  }, []);

  const generateSubPaths = useCallback((rootLabel: string, nodeId: string) => {
    const used = new Set(decisionHistory || []);
    const historyLength = (decisionHistory || []).length;

    // Create unique seeds for each node path to ensure variety
    const nodeSeed = `${nodeId}-${rootLabel}`;
    const industrySeed = profile?.industry || 'generic';

    // Get strategies from multiple seed variations to build a diverse pool
    const seedVariations = [
      `${rootLabel}`,
      `${rootLabel}-${nodeId}`,
      `${nodeSeed}-growth`,
      `${nodeSeed}-operations`,
      `${nodeSeed}-marketing`,
      `${rootLabel}-${industrySeed}-${historyLength}`,
    ];

    // Collect strategies from different seed variations
    const allStrategies: ExecutionOption[] = [];
    for (const seedVar of seedVariations) {
      const options = generateExecutionOptions(profile, seedVar);
      allStrategies.push(...options);
    }

    // Filter out already used strategies
    let candidates = allStrategies.filter((opt) => !used.has(opt.title));

    // Remove duplicates by title while preserving order
    const uniqueMap = new Map<string, typeof candidates[0]>();
    candidates.forEach(opt => {
      if (!uniqueMap.has(opt.title)) {
        uniqueMap.set(opt.title, opt);
      }
    });
    candidates = Array.from(uniqueMap.values());

    // Create a unique seed combining node path and industry for shuffling
    const shuffleSeed = `${nodeId}-${rootLabel}-${industrySeed}-${historyLength}`;
    const rng = seededRandom(shuffleSeed);

    // Fisher-Yates shuffle with seeded random
    const shuffled = [...candidates];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Pick top 5 unique strategies
    const picks = shuffled.slice(0, 5);

    return picks.map((option, idx) => ({
      id: `${option.id}-${nodeSeed}-${idx}`,
      title: option.title,
      description: option.description,
      icon: getCategoryIcon(option.category),
      level: 3 as 1 | 2 | 3,
      metrics: [
        { label: 'Projected Revenue', value: option.projectedRevenue },
        { label: 'Risk Delta', value: option.riskDelta },
        { label: 'Burnout Delta', value: option.burnoutDelta },
      ],
      cost: option.cost,
      timelineDays: option.timelineDays,
      category: option.category,
    }));
  }, [profile, decisionHistory, getCategoryIcon, seededRandom]);

  const handleExplore = useCallback((child: any) => {
    setIsLoading(true);
    setTimeout(() => {
      pushDecision(child.title);
      setSelectedNode(child.id);
      setCascadingLevel(child.level);
      setBreadcrumbPath([...(decisionHistory || []), child.title]);
      setIsLoading(false);
    }, 100);
  }, [pushDecision, setCascadingLevel, setBreadcrumbPath, decisionHistory]);

  const renderNode = useCallback((nodeId: string, depth: number = 0) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const isSelected = selectedNode === nodeId;
    const hasChildren = node.children.length > 0;
    const rootLabel = decisionHistory?.length ? decisionHistory[decisionHistory.length - 1] : node.title;
    const dynamicChildren = !hasChildren && node.level === 3 ? generateSubPaths(rootLabel, nodeId) : [];

    return (
      <motion.div
        key={nodeId}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <RoadmapNodeCard
          node={node}
          isSelected={isSelected}
          onClick={() => setSelectedNode(isSelected ? null : nodeId)}
          getNodeColor={getNodeColor}
        />

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-sm bg-black/40 border border-amber-500/30 rounded-lg p-4"
            >
              <h5 className="text-amber-300 font-bold mb-2 text-sm">Key Metrics</h5>
              <div className="space-y-2">
                {node.metrics.map((metric) => (
                  <div key={metric.label} className="flex justify-between items-center text-xs">
                    <span className="text-amber-200">{metric.label}</span>
                    <div className="w-24 h-1.5 bg-amber-900/50 rounded-full overflow-hidden">
                      <div style={{ width: `${metric.value}%` }} className="h-full bg-gradient-to-r from-amber-400 to-amber-300" />
                    </div>
                    <span className="w-8 text-right text-amber-300">{metric.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {hasChildren && (
          <div className="flex gap-4 justify-center flex-wrap max-w-2xl">
            {node.children.map((childId) => renderNode(childId, depth + 1))}
          </div>
        )}

        {dynamicChildren.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap max-w-4xl mt-4">
            <div className="w-full text-center mb-2">
              <span className="text-sm text-amber-300/80 font-semibold">Execution Options for {node.title}</span>
            </div>
            {dynamicChildren.map((child: any) => (
              <ExecutionOptionCard key={child.id} child={child} onExplore={() => handleExplore(child)} />
            ))}
          </div>
        )}
      </motion.div>
    );
  }, [nodes, selectedNode, decisionHistory, generateSubPaths, getNodeColor, handleExplore]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-slate-900/95 to-slate-900/98 backdrop-blur-sm z-50 flex flex-col"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      )}

      <div className="flex justify-between items-center p-4 border-b border-amber-500/20">
        <div>
          <h1 className="text-2xl font-bold text-amber-300">Strategic Roadmap</h1>
          <div className="mt-1 text-xs text-amber-200/60 flex items-center gap-2">
            <span>Path:</span>
            {(decisionHistory || []).length === 0 ? (
              <span>Root</span>
            ) : (
              (decisionHistory || []).map((p, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3" />}
                  {p}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {shouldShowSummaryButton && (
            <button
              onClick={() => setShowSummary(!showSummary)}
              className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 ${
                showSummary
                  ? 'bg-green-500 text-black'
                  : 'bg-green-600/30 hover:bg-green-600 text-green-100'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              {showSummary ? 'Hide Summary' : 'View Summary'}
            </button>
          )}
          <button
            onClick={() => {
              popDecision();
              setBreadcrumbPath((decisionHistory || []).slice(0, -1));
              setSelectedNode(null);
            }}
            className="px-3 py-1 text-xs bg-amber-600/30 hover:bg-amber-600 rounded text-amber-100"
          >
            ◀ Back
          </button>
          <button
            onClick={() => {
              resetDecisionHistory();
              setBreadcrumbPath([]);
              setSelectedNode(null);
              setShowSummary(false);
            }}
            className="px-3 py-1 text-xs bg-amber-600/30 hover:bg-amber-600 rounded text-amber-100"
          >
            Reset
          </button>
          <button onClick={onClose} className="p-2 hover:bg-amber-500/20 rounded-lg">
            <X className="w-6 h-6 text-amber-300" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-2 border-b border-amber-500/20">
        <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))} className="px-2 py-1 text-xs bg-amber-600/50 rounded text-amber-100">−</button>
        <span className="text-xs text-amber-200 px-2">{Math.round(zoomLevel * 100)}%</span>
        <button onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.2))} className="px-2 py-1 text-xs bg-amber-600/50 rounded text-amber-100">+</button>
      </div>

      <div className="flex-1 overflow-auto flex items-start justify-center p-8" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center top' }}>
        <div className="space-y-12">{renderNode('root')}</div>
      </div>

      {/* Roadmap Summary Panel */}
      <AnimatePresence>
        {showSummary && (
          <RoadmapSummary
            decisionHistory={decisionHistory || []}
            profile={profile}
            onClose={() => setShowSummary(false)}
            onExportPDF={handleExportPDF}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(FullPageRoadmap);
