'use client';

import React, { memo, useMemo } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { DecisionPath } from '@/types';
import { ChevronRight, Zap, TrendingUp, Shield, AlertTriangle, Check, Star, Clock, DollarSign, Target, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DecisionPathSkeleton, PulseDot } from './LoadingSkeletons';

// Memoized path card for better performance
const PathCard = memo(function PathCard({
  path,
  isSelected,
  isRecommended,
  index,
  onSelect,
}: {
  path: DecisionPath;
  isSelected: boolean;
  isRecommended: boolean;
  index: number;
  onSelect: () => void;
}) {
  const riskLevel = path.riskScore > 60 ? 'high' : path.riskScore > 30 ? 'medium' : 'low';
  const riskColors = {
    high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    low: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={onSelect}
        className={`w-full p-4 rounded-xl transition-all text-left relative overflow-hidden ${
          isSelected
            ? 'bg-gradient-to-br from-amber-500 to-pink-500 shadow-2xl shadow-amber-500/30 text-black'
            : 'bg-slate-800/50 hover:bg-slate-800 border border-white/10 hover:border-amber-500/30'
        }`}
      >
        {/* Recommended badge */}
        {isRecommended && !isSelected && (
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full"
          >
            <Star size={10} /> BEST
          </motion.div>
        )}

        {/* Animated background glow for selected */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-pink-400/20 to-amber-400/20"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3 relative">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {path.riskScore <= 30 ? (
                <Shield size={16} className={isSelected ? 'text-black/70' : 'text-green-400'} />
              ) : path.riskScore <= 60 ? (
                <TrendingUp size={16} className={isSelected ? 'text-black/70' : 'text-amber-400'} />
              ) : (
                <Zap size={16} className={isSelected ? 'text-black/70' : 'text-red-400'} />
              )}
              <h4 className="font-bold text-sm truncate">{path.name}</h4>
            </div>
            <p className={`text-xs line-clamp-2 ${isSelected ? 'text-black/70' : 'text-gray-400'}`}>
              {path.description}
            </p>
          </div>
          <motion.span
            className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
              isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Clock size={10} />
            {path.timeline}d
          </motion.span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <motion.div
            className={`p-2 rounded-lg ${isSelected ? 'bg-black/10' : 'bg-white/5'}`}
            whileHover={{ scale: 1.05 }}
          >
            <span className={`text-[10px] block ${isSelected ? 'text-black/60' : 'text-gray-500'}`}>
              Expected Value
            </span>
            <span className="font-bold text-sm flex items-center gap-1">
              <DollarSign size={12} />
              ₹{(path.expectedValue / 100000).toFixed(1)}L
            </span>
          </motion.div>
          <motion.div
            className={`p-2 rounded-lg ${isSelected ? 'bg-black/10' : 'bg-white/5'}`}
            whileHover={{ scale: 1.05 }}
          >
            <span className={`text-[10px] block ${isSelected ? 'text-black/60' : 'text-gray-500'}`}>
              Success Rate
            </span>
            <span className="font-bold text-sm flex items-center gap-1">
              <Target size={12} />
              {(path.probability * 100).toFixed(0)}%
            </span>
          </motion.div>
          <motion.div
            className={`p-2 rounded-lg ${isSelected ? 'bg-black/10' : riskColors[riskLevel].bg}`}
            whileHover={{ scale: 1.05 }}
          >
            <span className={`text-[10px] block ${isSelected ? 'text-black/60' : 'text-gray-500'}`}>
              Risk Level
            </span>
            <span className={`font-bold text-sm ${isSelected ? '' : riskColors[riskLevel].text}`}>
              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
            </span>
          </motion.div>
        </div>

        {/* Animated Progress Bar */}
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${path.probability * 100}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isSelected
                ? 'bg-black/40'
                : path.riskScore > 60
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : path.riskScore > 30
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                : 'bg-gradient-to-r from-green-500 to-emerald-500'
            }`}
          />
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, delay: index * 0.2, repeat: Infinity, repeatDelay: 3 }}
          />
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 pt-3 border-t border-black/20"
            >
              {/* Costs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between p-2 bg-black/10 rounded">
                  <span className="text-black/60">Upfront Cost</span>
                  <span className="font-bold">₹{(path.costs.immediate / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between p-2 bg-black/10 rounded">
                  <span className="text-black/60">Monthly</span>
                  <span className="font-bold">₹{(path.costs.monthly / 100000).toFixed(2)}L</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="p-2 bg-black/10 rounded text-xs">
                <div className="flex justify-between">
                  <span className="text-black/60">Revenue Potential</span>
                  <span className="font-bold text-green-600">
                    +₹{(path.benefits.revenue / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>

              {/* CTA */}
              <motion.div
                className="flex items-center justify-center gap-2 text-xs font-bold text-black/80"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Click to explore sub-paths <ArrowRight size={14} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
});

export const DecisionRoadmap: React.FC = memo(function DecisionRoadmap() {
  const { currentResult, selectedPath, setSelectedPath, isLoading } = useNeoBIStore();

  // Find recommended path (highest probability with acceptable risk)
  const recommendedPathId = useMemo(() => {
    if (!currentResult?.paths) return null;
    const paths = currentResult.paths;
    // Recommend path with best balance of probability and risk
    const scored = paths.map(p => ({
      id: p.id,
      score: p.probability * 100 - p.riskScore * 0.3,
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.id;
  }, [currentResult?.paths]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Zap size={16} className="text-amber-500" />
            </motion.div>
            <span className="text-sm font-bold text-white">Analyzing paths...</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {[0, 1, 2].map((i) => (
            <DecisionPathSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!currentResult) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6"
        >
          <motion.div
            className="text-5xl mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧭
          </motion.div>
          <p className="text-sm text-gray-400 mb-2">No simulation results yet</p>
          <p className="text-xs text-gray-500">
            Enter your business profile and run a simulation to see AI-generated decision paths
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap size={16} className="text-amber-500" />
            </motion.div>
            Decision Paths
          </h3>
          <div className="flex items-center gap-2">
            <PulseDot color="#22C55E" size={6} />
            <span className="text-[10px] text-gray-400">Live</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {currentResult.paths.length} paths analyzed • Click to explore
        </p>
      </div>

      {/* Path Legend */}
      <div className="px-4 py-2 border-b border-white/10 flex gap-3 text-[10px]">
        <span className="flex items-center gap-1 text-green-400">
          <Shield size={10} /> Low Risk
        </span>
        <span className="flex items-center gap-1 text-amber-400">
          <TrendingUp size={10} /> Balanced
        </span>
        <span className="flex items-center gap-1 text-red-400">
          <Zap size={10} /> Aggressive
        </span>
      </div>

      {/* Paths */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <AnimatePresence mode="popLayout">
          {currentResult.paths.map((path, idx) => (
            <PathCard
              key={path.id}
              path={path}
              isSelected={selectedPath?.id === path.id}
              isRecommended={path.id === recommendedPathId}
              index={idx}
              onSelect={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer - Agent Contributions */}
      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-800/50"
          >
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <Check size={12} className="text-green-400" />
              Recommended by these AI agents:
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedPath.agentContributions || {})
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([agentId, contrib], idx) => (
                  <motion.span
                    key={agentId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-xs px-2 py-1 rounded-lg bg-white/10 font-mono flex items-center gap-1"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {agentId.replace(/_/g, ' ')}: {contrib.toFixed(0)}%
                  </motion.span>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
