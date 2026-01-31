'use client';

import React from 'react';
import { useNeoBIStore } from '@/lib/store';
import { Volume2, Wind, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export const ControlBar: React.FC = () => {
  const { riskSlider, setRiskSlider, vibeMode, setVibeMode, profile } = useNeoBIStore();

  const vibeModes = [
    { id: 'aggressive' as const, label: 'Aggressive', icon: '⚡', color: 'text-red-400' },
    { id: 'balanced' as const, label: 'Balanced', icon: '⚖️', color: 'text-amber-400' },
    { id: 'conservative' as const, label: 'Conservative', icon: '🛡️', color: 'text-green-400' },
  ];

  return (
    <div className="px-4 py-3 border-b border-white/10 space-y-3">
      {/* Profile Status */}
      {profile && (
        <div className="text-xs space-y-1">
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

      <div className="border-t border-white/10 pt-3 space-y-3">
        {/* Risk Slider */}
        <div>
          <label className="text-xs font-bold text-gray-300 flex items-center gap-2 mb-2">
            <Target size={14} className="text-agents-operations" />
            Risk Tolerance: {riskSlider}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={riskSlider}
            onChange={(e) => setRiskSlider(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-agents-growth"
          />
        </div>

        {/* Vibe Mode */}
        <div>
          <label className="text-xs font-bold text-gray-300 flex items-center gap-2 mb-2">
            <Wind size={14} className="text-agents-coach" />
            Vibe Mode
          </label>
          <div className="flex gap-2">
            {vibeModes.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => setVibeMode(mode.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  vibeMode === mode.id
                    ? `bg-gradient-peach text-black shadow-lg shadow-agents-growth/50`
                    : `bg-white/10 hover:bg-white/20`
                }`}
              >
                <span className="mr-1">{mode.icon}</span>
                {mode.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
