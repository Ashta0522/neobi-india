'use client';

import React from 'react';
import { useNeoBIStore } from '@/lib/store';
import { DecisionPath } from '@/types';
import { ChevronRight, Zap, Smartphone, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const DecisionRoadmap: React.FC = () => {
  const { currentResult, selectedPath, setSelectedPath } = useNeoBIStore();

  if (!currentResult) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🧭</div>
          <p className="text-sm text-gray-400">Run a simulation to see decision paths</p>
        </div>
      </div>
    );
  }

  const renderPath = (path: DecisionPath, isSelected: boolean, index: number) => (
    <motion.div
      key={path.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={() => setSelectedPath(isSelected ? null : path)}
        className={`w-full p-4 rounded-lg transition-all micro-hover text-left ${
          isSelected
            ? 'bg-gradient-peach shadow-2xl shadow-agents-growth/30 text-black'
            : 'glass hover:bg-white/10'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-sm">{path.name}</h4>
            <p className={`text-xs ${isSelected ? 'text-black/60' : 'text-gray-400'}`}>
              {path.description}
            </p>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            isSelected ? 'bg-black/20' : 'bg-white/10'
          }`}>
            {path.timeline}d
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div>
            <span className={`${isSelected ? 'text-black/60' : 'text-gray-500'} block`}>EV</span>
            <span className="font-bold">₹{(path.expectedValue / 100000).toFixed(1)}L</span>
          </div>
          <div>
            <span className={`${isSelected ? 'text-black/60' : 'text-gray-500'} block`}>Prob</span>
            <span className="font-bold">{(path.probability * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span className={`${isSelected ? 'text-black/60' : 'text-gray-500'} block`}>Risk</span>
            <span className={`font-bold ${
              path.riskScore > 60 ? 'text-red-400' : path.riskScore > 30 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {path.riskScore}/100
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${path.probability * 100}%` }}
            className={`h-full ${isSelected ? 'bg-black/30' : 'bg-agents-growth'}`}
          />
        </div>

        {/* Costs & Benefits */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs space-y-2 mt-3 pt-3 border-t border-black/20"
          >
            <div className="flex justify-between">
              <span>Immediate Cost:</span>
              <span className="font-bold">₹{(path.costs.immediate / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Cost:</span>
              <span className="font-bold">₹{(path.costs.monthly / 100000).toFixed(2)}L</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-black/20">
              <span>Revenue Upside:</span>
              <span className="font-bold">₹{(path.benefits.revenue / 100000).toFixed(1)}L</span>
            </div>
          </motion.div>
        )}
      </button>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap size={16} className="text-agents-growth" />
          Decision Paths
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Select a path to explore execution sub-trees
        </p>
      </div>

      {/* Paths */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {currentResult?.paths.map((path, idx) => renderPath(path, selectedPath?.id === path.id, idx))}
      </div>

      {/* Footer */}
      {selectedPath && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-xs text-gray-400 mb-2">Recommended by:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedPath.agentContributions || {})
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([agentId, contrib]) => (
                <span
                  key={agentId}
                  className="text-xs px-2 py-1 rounded bg-white/10 font-mono"
                >
                  {agentId}: {contrib}%
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
