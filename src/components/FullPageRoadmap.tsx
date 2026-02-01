'use client';

import React, { useCallback, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Zap, Target, TrendingUp, Shield, Brain, Code2, Package, Users, Lightbulb } from 'lucide-react';
import { useNeoBIStore } from '@/lib/store';
import { generateExecutionOptions, getIndustryPaths, ExecutionOption } from '@/lib/industryStrategies';

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

const FullPageRoadmap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentResult, setCascadingLevel, setBreadcrumbPath, decisionHistory, pushDecision, popDecision, resetDecisionHistory, profile } = useNeoBIStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Get industry-specific path names
  const industryPaths = useMemo(() => {
    return getIndustryPaths(profile?.industry || 'generic');
  }, [profile?.industry]);

  // Generate dynamic nodes based on business profile
  const nodes: Record<string, RoadmapNode> = useMemo(() => {
    const businessName = profile?.name || 'Your Business';
    const industry = profile?.industry || 'Business';
    const location = profile?.location || 'India';

    return {
      root: {
        id: 'root',
        title: `${industry} Growth Strategy`,
        description: `Strategic decision tree for ${businessName} in ${location}`,
        icon: <Target className="w-8 h-8" />,
        level: 1,
        children: ['conservative', 'balanced', 'aggressive'],
        metrics: [
          { label: 'Risk Score', value: profile?.riskTolerance === 'high' ? 70 : profile?.riskTolerance === 'low' ? 30 : 50 },
          { label: 'Growth Target', value: profile?.growthTarget || 30 },
          { label: 'Team Size', value: Math.min(100, (profile?.teamSize || 5) * 10) },
        ],
        actions: [
          {
            label: 'Expand All',
            action: () => {
              setSelectedNode(null);
            },
          },
        ],
      },
      conservative: {
        id: 'conservative',
        title: industryPaths.conservative,
        description: 'Low-risk, steady growth approach focused on stability',
        icon: <Shield className="w-6 h-6" />,
        level: 2,
        children: ['partnership', 'organic', 'optimization'],
        metrics: [
          { label: 'Risk', value: 20 },
          { label: 'Timeline', value: 120 },
          { label: 'ROI', value: 60 },
        ],
        actions: [],
      },
      balanced: {
        id: 'balanced',
        title: industryPaths.balanced,
        description: 'Mixed approach balancing growth with sustainability',
        icon: <TrendingUp className="w-6 h-6" />,
        level: 2,
        children: ['market-expansion', 'team-scaling', 'product-launch'],
        metrics: [
          { label: 'Risk', value: 50 },
          { label: 'Timeline', value: 150 },
          { label: 'ROI', value: 120 },
        ],
        actions: [],
      },
      aggressive: {
        id: 'aggressive',
        title: industryPaths.aggressive,
        description: 'High-growth strategy for rapid market capture',
        icon: <Zap className="w-6 h-6" />,
        level: 2,
        children: ['vc-funding', 'market-takeover', 'international'],
        metrics: [
          { label: 'Risk', value: 75 },
          { label: 'Timeline', value: 200 },
          { label: 'ROI', value: 200 },
        ],
        actions: [],
      },
      partnership: {
        id: 'partnership',
        title: 'Strategic Partnerships',
        description: `Partner with complementary ${industry} businesses`,
        icon: <Users className="w-6 h-6" />,
        level: 3,
        children: [],
        metrics: [
          { label: 'Cost', value: 30 },
          { label: 'Speed', value: 85 },
          { label: 'Sustainability', value: 80 },
        ],
        actions: [],
      },
      organic: {
        id: 'organic',
        title: 'Organic Growth',
        description: 'Bootstrap using existing customer base and profits',
        icon: <Brain className="w-6 h-6" />,
        level: 3,
        children: [],
        metrics: [
          { label: 'Cost', value: 20 },
          { label: 'Speed', value: 40 },
          { label: 'Independence', value: 95 },
        ],
        actions: [],
      },
      optimization: {
        id: 'optimization',
        title: 'Process Optimization',
        description: 'Improve efficiency and reduce operational costs',
        icon: <TrendingUp className="w-6 h-6" />,
        level: 3,
        children: [],
        metrics: [
          { label: 'Impact', value: 70 },
          { label: 'Implementation', value: 60 },
          { label: 'Payback', value: 50 },
        ],
        actions: [],
      },
      'market-expansion': {
        id: 'market-expansion',
        title: 'Market Expansion',
        description: `Expand ${industry} presence to new markets`,
        icon: <Zap className="w-6 h-6" />,
        level: 3,
        children: [],
        metrics: [
          { label: 'Market Size', value: 90 },
          { label: 'Competition', value: 65 },
          { label: 'Entry Cost', value: 75 },
        ],
        actions: [],
      },
      'team-scaling': {
        id: 'team-scaling',
        title: 'Team Scaling',
        description: `Grow team from ${profile?.teamSize || 5} to optimize operations`,
        icon: <Users className="w-6 h-6" />,
        level: 3,
        children: [],
        metrics: [
          { label: 'Hiring Needs', value: 55 },
          { label: 'Training', value: 45 },
          { label: 'Retention', value: 70 },
        ],
        actions: [],
      },
      'product-launch': {
        id: 'product-launch',
        title: 'Product/Service Launch',
        description: `Launch new ${industry} offerings`,
        icon: <Package className="w-6 h-6" />,
        level: 3,
        children: [],
        metrics: [
          { label: 'Development', value: 60 },
          { label: 'Market Fit', value: 50 },
          { label: 'Revenue Impact', value: 85 },
        ],
        actions: [],
      },
      'vc-funding': {
        id: 'vc-funding',
        title: 'Funding Round',
        description: 'Raise capital from investors for rapid scaling',
        icon: <Zap className="w-6 h-6" />,
        level: 3,
        children: [],
        metrics: [
          { label: 'Capital Raised', value: 95 },
          { label: 'Dilution', value: 40 },
          { label: 'Timeline', value: 75 },
        ],
        actions: [],
      },
      'market-takeover': {
        id: 'market-takeover',
        title: 'Market Leadership',
        description: `Become the leading ${industry} player in ${location}`,
        icon: <Shield className="w-6 h-6" />,
        level: 3,
        children: [],
        metrics: [
          { label: 'Market Share', value: 85 },
          { label: 'Brand Impact', value: 90 },
          { label: 'Risk Level', value: 85 },
        ],
        actions: [],
      },
      international: {
        id: 'international',
        title: 'Geographic Expansion',
        description: 'Expand beyond current location strategically',
        icon: <Target className="w-6 h-6" />,
        level: 3,
        children: [],
        metrics: [
          { label: 'Market Potential', value: 95 },
          { label: 'Complexity', value: 80 },
          { label: 'Investment', value: 90 },
        ],
        actions: [],
      },
    };
  }, [profile, industryPaths]);

  const getNodeColor = (level: 1 | 2 | 3) => {
    const colors = {
      1: 'from-amber-600 to-amber-700',
      2: 'from-amber-500 to-amber-600',
      3: 'from-amber-400 to-amber-500',
    };
    return colors[level];
  };

  // Get category icon based on execution option category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing': return <TrendingUp className="w-6 h-6" />;
      case 'operations': return <Shield className="w-6 h-6" />;
      case 'growth': return <Zap className="w-6 h-6" />;
      case 'partnerships': return <Users className="w-6 h-6" />;
      case 'technology': return <Code2 className="w-6 h-6" />;
      default: return <Lightbulb className="w-6 h-6" />;
    }
  };

  // Generate DYNAMIC industry-specific execution options
  const generateSubPaths = useCallback((rootLabel: string) => {
    // Use the industry strategies generator instead of hardcoded options
    const executionOptions = generateExecutionOptions(profile, rootLabel);

    // Filter out already selected decisions
    const used = decisionHistory || [];
    const candidates = executionOptions.filter((opt) => !used.includes(opt.title));
    const picks = candidates.slice(0, Math.min(5, candidates.length));

    return picks.map((option) => ({
      id: option.id,
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
  }, [profile, decisionHistory]);

  const renderNode = (nodeId: string, parentX: number = 0, parentY: number = 0, depth: number = 0) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const isSelected = selectedNode === nodeId;
    const hasChildren = node.children.length > 0;

    const rootLabel = decisionHistory && decisionHistory.length ? decisionHistory[decisionHistory.length - 1] : node.title || 'Growth Strategy Root';
    const dynamicChildren = generateSubPaths(rootLabel);

    return (
      <motion.div
        key={nodeId}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.button
          onClick={() => setSelectedNode(isSelected ? null : nodeId)}
          className={`
            relative p-4 rounded-xl border-2 transition-all cursor-pointer
            ${
              isSelected
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
              <p className="text-xs opacity-80">{node.description}</p>
            </div>
          </div>
        </motion.button>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-sm bg-black/40 border border-amber-500/30 rounded-lg p-4 backdrop-blur"
            >
              {/* Metrics */}
              <div className="mb-4">
                <h5 className="text-amber-300 font-bold mb-2 text-sm">Key Metrics</h5>
                <div className="space-y-2">
                  {node.metrics.map((metric) => (
                    <div key={metric.label} className="flex justify-between items-center text-xs">
                      <span className="text-amber-200">{metric.label}</span>
                      <div className="w-24 h-1.5 bg-amber-900/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-300"
                        />
                      </div>
                      <span className="w-8 text-right text-amber-300">{metric.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {node.actions.length > 0 && (
                <div className="space-y-2">
                  {node.actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className="w-full px-3 py-1.5 text-xs font-semibold bg-amber-600/50 hover:bg-amber-600 rounded border border-amber-400/30 text-amber-100 transition-all"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {hasChildren && (
          <div className="flex gap-4 justify-center flex-wrap max-w-2xl">
            {node.children.map((childId) => (
              <div key={childId}>{renderNode(childId, 0, 0, depth + 1)}</div>
            ))}
          </div>
        )}

        {/* Dynamic generated children (Explore options) - ONLY for leaf nodes (no children) */}
        {!hasChildren && node.level === 3 && dynamicChildren.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap max-w-4xl mt-4">
            <div className="w-full text-center mb-2">
              <span className="text-sm text-amber-300/80 font-semibold">🎯 Execution Options for {node.title}</span>
              <p className="text-xs text-amber-300/40 mt-1">Tailored strategies based on your {profile?.industry || 'business'} profile</p>
            </div>
            {dynamicChildren.map((child: any) => (
              <div key={child.id} className="w-72 p-4 rounded-lg bg-black/40 border border-amber-400/20 hover:border-amber-400/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0">{child.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-amber-200 text-sm">{child.title}</div>
                    <div className="text-xs text-amber-300/60 mt-1 line-clamp-2">{child.description}</div>
                  </div>
                </div>

                {/* Category Tag */}
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

                {/* Metrics */}
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

                {/* Cost & Timeline */}
                {(child.cost || child.timelineDays) && (
                  <div className="mt-2 flex justify-between text-[10px] text-amber-300/50">
                    {child.cost && <span>Est. Cost: ₹{(child.cost / 1000).toFixed(0)}K</span>}
                    {child.timelineDays && <span>{child.timelineDays} days</span>}
                  </div>
                )}

                <div className="mt-3">
                  <button
                    onClick={() => {
                      pushDecision(child.title);
                      setSelectedNode(child.id);
                      setCascadingLevel(child.level);
                      setBreadcrumbPath([...(decisionHistory || []), child.title]);
                    }}
                    className="w-full px-3 py-2 bg-gradient-to-r from-amber-600/40 to-amber-700/40 hover:from-amber-600 hover:to-amber-700 rounded text-amber-100 text-xs font-semibold transition-all"
                  >
                    Explore Strategy →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-slate-900/95 to-slate-900/98 backdrop-blur-sm z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-amber-500/20">
        <div>
          <h1 className="text-3xl font-bold text-amber-300">🗺️ Strategic Roadmap</h1>
          <p className="text-amber-200/60 text-sm">Full-page decision tree explorer with multi-level analysis</p>
          <div className="mt-2 text-xs text-amber-200/60 flex items-center gap-2">
            <span className="opacity-80">Breadcrumb:</span>
            <div className="flex items-center gap-1">
              {(decisionHistory || []).length === 0 ? (
                <span className="text-amber-300/80">Root</span>
              ) : (
                (decisionHistory || []).map((p, i) => (
                  <span key={i} className="text-amber-200/80 flex items-center gap-1">
                    {i > 0 && <ChevronRight className="w-3 h-3 text-amber-400" />}
                    <span>{p}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newHistory = (decisionHistory || []).slice(0, Math.max(0, (decisionHistory || []).length - 1));
              popDecision();
              setBreadcrumbPath(newHistory);
              setSelectedNode(null);
              setCascadingLevel(Math.max(0, newHistory.length));
            }}
            className="px-3 py-1 text-xs font-semibold bg-amber-600/30 hover:bg-amber-600 rounded border border-amber-400/20 text-amber-100"
          >
            ◀ Back
          </button>
          <button
            onClick={() => {
              resetDecisionHistory();
              setBreadcrumbPath([]);
              setSelectedNode(null);
              setCascadingLevel(0);
            }}
            className="px-3 py-1 text-xs font-semibold bg-amber-600/30 hover:bg-amber-600 rounded border border-amber-400/20 text-amber-100"
          >
            Reset
          </button>
          <button onClick={onClose} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
            <X className="w-6 h-6 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex gap-2 p-4 border-b border-amber-500/20">
        <button
          onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
          className="px-3 py-1 text-xs font-semibold bg-amber-600/50 hover:bg-amber-600 rounded border border-amber-400/30 text-amber-100"
        >
          🔍−
        </button>
        <span className="text-xs text-amber-200 flex items-center px-3">{Math.round(zoomLevel * 100)}%</span>
        <button
          onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.2))}
          className="px-3 py-1 text-xs font-semibold bg-amber-600/50 hover:bg-amber-600 rounded border border-amber-400/30 text-amber-100"
        >
          🔍+
        </button>
      </div>

      {/* Roadmap Canvas */}
      <div
        className="flex-1 overflow-auto flex items-center justify-center p-8"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center top',
        }}
      >
        <div className="space-y-12">{renderNode('root')}</div>
      </div>

      {/* Legend */}
      <div className="border-t border-amber-500/20 bg-black/40 p-4 flex gap-8 text-xs text-amber-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-600 to-amber-700" />
          <span>Level 1: Strategic Root</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-500 to-amber-600" />
          <span>Level 2: Primary Paths</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-400 to-amber-500" />
          <span>Level 3: Execution Nodes</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FullPageRoadmap;
