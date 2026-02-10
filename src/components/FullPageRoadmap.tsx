'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronDown, Target, Shield, Zap, TrendingUp, Users, Brain, CheckCircle, Clock, AlertTriangle, DollarSign, ArrowRight, Play, Flag } from 'lucide-react';
import { useNeoBIStore } from '@/lib/store';

// Roadmap Node Component
const RoadmapNode = memo(({
  node,
  isExpanded,
  isSelected,
  isCompleted,
  onToggle,
  onSelect,
  depth = 0,
  isLast = false,
  parentExpanded = true
}: {
  node: any;
  isExpanded: boolean;
  isSelected: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  onSelect: () => void;
  depth: number;
  isLast?: boolean;
  parentExpanded?: boolean;
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const hasSteps = node.steps && node.steps.length > 0;

  const nodeColors = {
    root: 'from-purple-600 to-purple-800 border-purple-400',
    aggressive: 'from-red-600 to-red-800 border-red-400',
    balanced: 'from-amber-600 to-amber-800 border-amber-400',
    conservative: 'from-green-600 to-green-800 border-green-400',
    default: 'from-blue-600 to-blue-800 border-blue-400',
  };

  const getNodeColor = () => {
    if (node.id === 'root') return nodeColors.root;
    if (node.id.includes('aggressive') || node.id.includes('legal-formal')) return nodeColors.aggressive;
    if (node.id.includes('balanced') || node.id.includes('mediation') || node.id.includes('settlement')) return nodeColors.balanced;
    if (node.id.includes('conservative') || node.id.includes('improvement') || node.id.includes('due-process')) return nodeColors.conservative;
    return nodeColors.default;
  };

  const getIcon = () => {
    if (node.id === 'root') return <Target className="w-5 h-5" />;
    if (node.id.includes('aggressive') || node.id.includes('legal-formal')) return <Zap className="w-5 h-5" />;
    if (node.id.includes('balanced') || node.id.includes('mediation')) return <TrendingUp className="w-5 h-5" />;
    if (node.id.includes('conservative') || node.id.includes('improvement')) return <Shield className="w-5 h-5" />;
    return <Brain className="w-5 h-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: depth * 0.1 }}
      className="relative"
    >
      {/* Vertical connector line from parent */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 w-8 h-full"
          style={{ marginLeft: `${(depth - 1) * 48}px` }}
        >
          {/* Vertical line */}
          <div className={`absolute left-4 top-0 w-0.5 bg-amber-500/40 ${isLast ? 'h-8' : 'h-full'}`} />
          {/* Horizontal connector */}
          <div className="absolute left-4 top-8 w-8 h-0.5 bg-amber-500/40" />
        </div>
      )}

      {/* Node card */}
      <div
        className="relative"
        style={{ marginLeft: `${depth * 48}px` }}
      >
        <motion.div
          className={`
            relative p-4 rounded-xl border-2 cursor-pointer transition-all
            bg-gradient-to-br ${getNodeColor()}
            ${isSelected ? 'ring-2 ring-white shadow-xl scale-105' : 'hover:scale-102'}
            ${isCompleted ? 'opacity-60' : ''}
          `}
          onClick={onSelect}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`
              p-2 rounded-lg bg-white/20 flex-shrink-0
              ${isCompleted ? 'bg-green-500/40' : ''}
            `}>
              {isCompleted ? <CheckCircle className="w-5 h-5 text-green-300" /> : getIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm truncate">{node.name || node.title}</h3>
                {node.timeline && (
                  <span className="px-2 py-0.5 bg-black/30 rounded text-[10px] text-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {node.timeline}d
                  </span>
                )}
              </div>
              <p className="text-xs text-white/70 mt-1 line-clamp-2">{node.description}</p>

              {/* Metrics row */}
              {(node.probability || node.riskScore) && (
                <div className="flex gap-3 mt-2">
                  {node.probability && (
                    <div className="flex items-center gap-1 text-[10px] text-green-300">
                      <CheckCircle className="w-3 h-3" />
                      {Math.round(node.probability * 100)}% success
                    </div>
                  )}
                  {node.riskScore && (
                    <div className="flex items-center gap-1 text-[10px] text-orange-300">
                      <AlertTriangle className="w-3 h-3" />
                      Risk: {node.riskScore}/100
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Expand button */}
            {(hasChildren || hasSteps) && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-white" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Expanded content: Steps */}
        <AnimatePresence>
          {isExpanded && hasSteps && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-8"
            >
              <div className="relative p-4 bg-slate-800/80 rounded-lg border border-amber-500/30">
                <h4 className="text-xs font-bold text-amber-300 mb-3 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Implementation Steps
                </h4>
                <div className="space-y-2">
                  {node.steps.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      {/* Step connector */}
                      <div className="relative flex flex-col items-center">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${idx === 0 ? 'bg-green-500 text-white' : 'bg-amber-500/30 text-amber-300'}
                        `}>
                          {idx + 1}
                        </div>
                        {idx < node.steps.length - 1 && (
                          <div className="w-0.5 h-4 bg-amber-500/30 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-300 pt-1 flex-1">{step}</p>
                    </div>
                  ))}
                </div>

                {/* Risks */}
                {node.risks && node.risks.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-amber-500/20">
                    <h5 className="text-[10px] font-bold text-red-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Key Risks
                    </h5>
                    <div className="space-y-1">
                      {node.risks.slice(0, 3).map((risk: string, idx: number) => (
                        <p key={idx} className="text-[10px] text-red-300/70">• {risk}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Costs */}
                {node.costs && (
                  <div className="mt-3 flex gap-4 text-[10px]">
                    <div className="flex items-center gap-1 text-amber-300">
                      <DollarSign className="w-3 h-3" />
                      Upfront: ₹{(node.costs.immediate / 1000).toFixed(0)}K
                    </div>
                    {node.costs.monthly > 0 && (
                      <div className="flex items-center gap-1 text-amber-300">
                        Monthly: ₹{(node.costs.monthly / 1000).toFixed(0)}K
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

RoadmapNode.displayName = 'RoadmapNode';

// Timeline visualization
const TimelineView = memo(({ paths, selectedPath, onSelectPath }: {
  paths: any[];
  selectedPath: string | null;
  onSelectPath: (id: string) => void;
}) => {
  if (!paths.length) return null;

  const maxTimeline = Math.max(...paths.map(p => p.timeline || 90));

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/20">
      <h3 className="text-sm font-bold text-amber-300 mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Timeline Comparison
      </h3>
      <div className="space-y-3">
        {paths.map((path, idx) => {
          const widthPercent = ((path.timeline || 90) / maxTimeline) * 100;
          const isSelected = selectedPath === path.id;

          return (
            <div
              key={path.id}
              className={`cursor-pointer transition-all ${isSelected ? 'scale-102' : 'hover:scale-101'}`}
              onClick={() => onSelectPath(path.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                  {path.name}
                </span>
                <span className="text-xs text-amber-300">{path.timeline || 90} days</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`h-full rounded-full ${
                    idx === 0 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    idx === 1 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                    'bg-gradient-to-r from-green-500 to-green-600'
                  } ${isSelected ? 'ring-2 ring-white' : ''}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

TimelineView.displayName = 'TimelineView';

// Main Roadmap Component
const FullPageRoadmap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentResult, profile } = useNeoBIStore();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const query = currentResult?.query || '';
  const paths = currentResult?.paths || [];

  // Determine query context
  const queryContext = useMemo(() => {
    const queryLower = query.toLowerCase();

    if (queryLower.includes('sue') || queryLower.includes('legal') || queryLower.includes('staff') ||
        queryLower.includes('terminate') || queryLower.includes('employee') || queryLower.includes('fire')) {
      return { type: 'compliance', title: 'Legal & HR Strategy', color: 'from-purple-600 to-purple-800' };
    }
    if (queryLower.includes('fund') || queryLower.includes('money') || queryLower.includes('invest')) {
      return { type: 'funding', title: 'Funding Strategy', color: 'from-green-600 to-green-800' };
    }
    if (queryLower.includes('hire') || queryLower.includes('team') || queryLower.includes('recruit')) {
      return { type: 'hiring', title: 'Team Building Strategy', color: 'from-blue-600 to-blue-800' };
    }
    if (queryLower.includes('market') || queryLower.includes('expand') || queryLower.includes('grow')) {
      return { type: 'growth', title: 'Growth Strategy', color: 'from-amber-600 to-amber-800' };
    }
    return { type: 'general', title: 'Business Strategy', color: 'from-slate-600 to-slate-800' };
  }, [query]);

  // Build roadmap tree
  const roadmapTree = useMemo(() => {
    const root = {
      id: 'root',
      name: queryContext.title,
      description: query ? `Strategy for: "${query}"` : 'Your strategic decision roadmap',
      children: paths.map(path => ({
        ...path,
        children: [], // Can add sub-options later
      })),
    };
    return root;
  }, [paths, query, queryContext]);

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const selectNode = useCallback((nodeId: string) => {
    setSelectedNode(prev => prev === nodeId ? null : nodeId);
    // Auto-expand when selected
    setExpandedNodes(prev => {
      const next = new Set(prev);
      next.add(nodeId);
      return next;
    });
  }, []);

  const renderTree = useCallback((node: any, depth: number = 0, isLast: boolean = true) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;
    const isCompleted = completedSteps.has(node.id);
    const children = node.children || [];

    return (
      <div key={node.id} className="mb-3">
        <RoadmapNode
          node={node}
          isExpanded={isExpanded}
          isSelected={isSelected}
          isCompleted={isCompleted}
          onToggle={() => toggleNode(node.id)}
          onSelect={() => selectNode(node.id)}
          depth={depth}
          isLast={isLast}
        />

        {/* Children */}
        <AnimatePresence>
          {isExpanded && children.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              {children.map((child: any, idx: number) =>
                renderTree(child, depth + 1, idx === children.length - 1)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }, [expandedNodes, selectedNode, completedSteps, toggleNode, selectNode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-500/20 bg-black/30">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${queryContext.color}`}>
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Strategic Roadmap</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {query ? `Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"` : 'Decision tree visualization'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedNodes(new Set(['root', ...paths.map(p => p.id)]))}
            className="px-3 py-1.5 text-xs bg-amber-600/30 hover:bg-amber-600 rounded-lg text-amber-100 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpandedNodes(new Set(['root']))}
            className="px-3 py-1.5 text-xs bg-slate-600/30 hover:bg-slate-600 rounded-lg text-slate-100 transition-colors"
          >
            Collapse All
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left: Roadmap tree */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Legend */}
            <div className="mb-6 p-3 bg-slate-800/50 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-400">Path Types:</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-gray-300">Aggressive</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-gray-300">Balanced</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-gray-300">Conservative</span>
                </div>
              </div>
            </div>

            {/* Start marker */}
            <div className="flex items-center gap-3 mb-4 ml-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-green-400 font-medium">Start Here</span>
              <ArrowRight className="w-4 h-4 text-green-400" />
            </div>

            {/* Roadmap tree */}
            {renderTree(roadmapTree)}

            {/* End marker */}
            {paths.length > 0 && (
              <div className="flex items-center gap-3 mt-6 ml-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-amber-400 font-medium">Click on any path to see implementation steps</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Timeline & Summary */}
        <div className="w-80 border-l border-amber-500/20 bg-black/20 p-4 overflow-auto">
          <div className="space-y-4">
            {/* Timeline comparison */}
            <TimelineView
              paths={paths}
              selectedPath={selectedNode}
              onSelectPath={selectNode}
            />

            {/* Selected path details */}
            {selectedNode && selectedNode !== 'root' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/20"
              >
                <h3 className="text-sm font-bold text-amber-300 mb-3">Selected Path Details</h3>
                {(() => {
                  const path = paths.find(p => p.id === selectedNode);
                  if (!path) return null;
                  return (
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-400">Expected Value</span>
                        <p className="text-lg font-bold text-green-400">
                          ₹{((path.expectedValue || 0) / 100000).toFixed(1)}L
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-black/30 rounded">
                          <span className="text-[10px] text-gray-400">Success Rate</span>
                          <p className="text-sm font-bold text-green-400">
                            {Math.round((path.probability || 0.8) * 100)}%
                          </p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <span className="text-[10px] text-gray-400">Risk Score</span>
                          <p className="text-sm font-bold text-orange-400">
                            {path.riskScore || 50}/100
                          </p>
                        </div>
                      </div>
                      {path.benefits && (
                        <div className="pt-2 border-t border-amber-500/20">
                          <span className="text-xs text-gray-400">Key Benefits</span>
                          <div className="mt-1 space-y-1">
                            <p className="text-xs text-green-300">• Revenue: +{path.benefits.revenue ? Math.round(path.benefits.revenue / 1000) : 0}K</p>
                            <p className="text-xs text-blue-300">• Efficiency: +{path.benefits.efficiency || 0}%</p>
                            <p className="text-xs text-purple-300">• Risk Reduction: {path.benefits.riskReduction || 0}%</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Help text */}
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <h4 className="text-xs font-bold text-amber-300 mb-2">How to use</h4>
              <ul className="text-[10px] text-gray-400 space-y-1">
                <li>• Click nodes to select and see details</li>
                <li>• Click arrows to expand/collapse steps</li>
                <li>• Compare timelines in the panel</li>
                <li>• Review risks before choosing a path</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(FullPageRoadmap);
