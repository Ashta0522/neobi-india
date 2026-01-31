'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Zap, Target, TrendingUp, Shield, Brain, Code2 } from 'lucide-react';
import { useNeoBIStore } from '@/lib/store';

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
  const { currentResult, setCascadingLevel, setBreadcrumbPath, decisionHistory, pushDecision, popDecision, resetDecisionHistory } = useNeoBIStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const nodes: Record<string, RoadmapNode> = {
    root: {
      id: 'root',
      title: 'Growth Strategy Root',
      description: 'Strategic decision tree for your business',
      icon: <Target className="w-8 h-8" />,
      level: 1,
      children: ['conservative', 'balanced', 'aggressive'],
      metrics: [
        { label: 'Risk Score', value: 45 },
        { label: 'Potential Return', value: 75 },
        { label: 'Timeline', value: 180 },
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
      title: 'Conservative Path',
      description: 'Low-risk, steady growth approach',
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
      title: 'Balanced Path',
      description: 'Mixed approach for optimal growth',
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
      title: 'Aggressive Path',
      description: 'High-growth, higher-risk strategy',
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
      description: 'Leverage existing relationships for growth',
      icon: <Code2 className="w-6 h-6" />,
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
      description: 'Bootstrap and reinvest profits',
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
      description: 'Improve efficiency and reduce costs',
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
      description: 'Enter new geographic or product markets',
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
      description: 'Build and optimize your team structure',
      icon: <Brain className="w-6 h-6" />,
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
      title: 'Product Launch',
      description: 'Develop and release new offerings',
      icon: <Code2 className="w-6 h-6" />,
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
      title: 'VC Funding',
      description: 'Raise capital from investors',
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
      title: 'Market Takeover',
      description: 'Aggressive market domination strategy',
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
      title: 'International Expansion',
      description: 'Enter global markets strategically',
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

  const getNodeColor = (level: 1 | 2 | 3) => {
    const colors = {
      1: 'from-amber-600 to-amber-700',
      2: 'from-amber-500 to-amber-600',
      3: 'from-amber-400 to-amber-500',
    };
    return colors[level];
  };

  // Generate synthetic subpaths avoiding repeats from decisionHistory
  const generateSubPaths = (rootLabel: string) => {
    const base = [
      'Joint Membership Bundle',
      'Free Smoothie Promo',
      'Co-Branded Flyer Campaign',
      'In-Gym Sampling Events',
      'Social Media Cross-Promo',
    ];
    const used = decisionHistory || [];
    const candidates = base.filter((b) => !used.includes(b));
    const picks = candidates.slice(0, Math.min(5, candidates.length));
    return picks.map((name, i) => ({
      id: `${rootLabel.toLowerCase().replace(/\s+/g, '-')}-sub-${i}`,
      title: name,
      description: `Execution option for ${rootLabel}: ${name}`,
      icon: <Zap className="w-6 h-6" />,
      level: 3 as 1 | 2 | 3,
      metrics: [
        { label: 'Projected Revenue', value: Math.round(Math.random() * 100) },
        { label: 'Risk Delta', value: Math.round(Math.random() * 50) },
        { label: 'Burnout Delta', value: Math.round(Math.random() * 30) },
      ],
    }));
  };

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

        {/* Dynamic generated children (Explore options) */}
        {dynamicChildren.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap max-w-3xl mt-4">
            {dynamicChildren.map((child) => (
              <div key={child.id} className="w-64 p-3 rounded-lg bg-black/30 border border-amber-400/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-amber-600 flex items-center justify-center">{child.icon}</div>
                  <div>
                    <div className="font-semibold text-amber-200">{child.title}</div>
                    <div className="text-xs text-amber-300/60">{child.description}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-amber-200/60 flex gap-2 flex-wrap">
                  {child.metrics.map((m) => (
                    <div key={m.label} className="px-2 py-1 bg-black/60 rounded">{m.label}: {m.value}</div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      pushDecision(child.title);
                      setSelectedNode(child.id);
                      setCascadingLevel(child.level);
                      setBreadcrumbPath([...(decisionHistory || []), child.title]);
                    }}
                    className="px-2 py-1 bg-amber-600/30 hover:bg-amber-600 rounded text-amber-200 text-xs"
                  >
                    Explore
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
