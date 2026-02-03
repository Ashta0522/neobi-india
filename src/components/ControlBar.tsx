'use client';

import React from 'react';
import { useNeoBIStore } from '@/lib/store';
import { Wind, Target, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ControlBar: React.FC = () => {
  const { riskSlider, setRiskSlider, vibeMode, setVibeMode, profile } = useNeoBIStore();

  const vibeModes = [
    { id: 'aggressive' as const, label: 'Aggro', fullLabel: 'Aggressive', icon: '⚡', color: 'bg-red-500/20 text-red-400 border-red-500/50' },
    { id: 'balanced' as const, label: 'Balance', fullLabel: 'Balanced', icon: '⚖️', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50' },
    { id: 'conservative' as const, label: 'Safe', fullLabel: 'Conservative', icon: '🛡️', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
  ];

  const getRiskColor = () => {
    if (riskSlider < 33) return 'text-green-400';
    if (riskSlider < 66) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="px-3 py-3 space-y-4">
      {/* Profile Status */}
      {profile && (
        <div className="text-xs space-y-1.5 p-2 bg-black/20 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">MRR</span>
            <span className="font-bold text-agents-growth">₹{(profile.mrr / 100000).toFixed(1)}L</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Customers</span>
            <span className="font-bold">{profile.customers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Team</span>
            <span className="font-bold">{profile.teamSize} members</span>
          </div>
        </div>
      )}

      {/* Risk Tolerance Section - ALWAYS VISIBLE */}
      <div className="p-3 bg-gradient-to-br from-orange-900/30 to-red-900/20 rounded-lg border border-orange-500/30">
        <label className="text-xs font-bold text-white flex items-center gap-2 mb-3">
          <AlertCircle size={14} className="text-orange-400" />
          Risk Tolerance
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={riskSlider}
            onChange={(e) => setRiskSlider(Number(e.target.value))}
            className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <span className={`text-lg font-black min-w-[50px] text-right ${getRiskColor()}`}>
            {riskSlider}%
          </span>
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-gray-500">
          <span>Conservative</span>
          <span>Aggressive</span>
        </div>
      </div>

      {/* Vibe Mode Section - ALWAYS VISIBLE */}
      <div className="p-3 bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-lg border border-purple-500/30">
        <label className="text-xs font-bold text-white flex items-center gap-2 mb-3">
          <Wind size={14} className="text-purple-400" />
          Vibe Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {vibeModes.map((mode) => (
            <motion.button
              key={mode.id}
              onClick={() => setVibeMode(mode.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={mode.fullLabel}
              className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-1 border ${
                vibeMode === mode.id
                  ? `bg-gradient-peach text-black border-transparent shadow-lg`
                  : mode.color
              }`}
            >
              <span className="text-lg">{mode.icon}</span>
              <span className="text-center leading-tight">{mode.label}</span>
            </motion.button>
          ))}
        </div>
        <div className="mt-2 text-[10px] text-center text-gray-400">
          Current: <span className="font-bold text-white capitalize">{vibeMode}</span>
        </div>
      </div>
    </div>
  );
};
