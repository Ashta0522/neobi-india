'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FestivalMultiplier } from '@/types';

interface FestivalMultiplierSliderProps {
  festivalMultiplier: FestivalMultiplier | null;
  onOverrideChange: (value: number) => void;
}

export function FestivalMultiplierSlider({ festivalMultiplier, onOverrideChange }: FestivalMultiplierSliderProps) {
  if (!festivalMultiplier) return null;

  const [overrideActive, setOverrideActive] = useState(false);
  const [overrideValue, setOverrideValue] = useState(festivalMultiplier.demandMultiplier);

  const handleOverride = (newValue: number) => {
    setOverrideValue(newValue);
    onOverrideChange(newValue);
  };

  const affectedCount = festivalMultiplier.affectedCategories.length;
  const hiringNeeded = festivalMultiplier.cascadeImpacts.hiringNeeded;
  const inventoryBoost = festivalMultiplier.cascadeImpacts.inventoryBoost;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-lg border border-red-500/30 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-red-300">
            🎉 {festivalMultiplier.festivalName} Festival Boost
          </h3>
          <p className="text-xs text-red-200/60">{festivalMultiplier.daysUntil} days until peak demand</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-red-400">
            {(overrideActive ? overrideValue : festivalMultiplier.demandMultiplier).toFixed(2)}x
          </div>
          <div className="text-xs text-red-200/50">Demand Multiplier</div>
        </div>
      </div>

      {/* Slider for override */}
      <div className="mb-4 p-3 bg-red-900/20 rounded border border-red-500/20">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={overrideActive}
            onChange={(e) => setOverrideActive(e.target.checked)}
            className="w-4 h-4 accent-red-500"
          />
          <label className="text-sm text-red-200">Override multiplier based on strategy</label>
        </div>

        {overrideActive && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-red-200">Conservative</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={overrideValue}
                onChange={(e) => handleOverride(parseFloat(e.target.value))}
                className="flex-1 accent-red-500"
              />
              <span className="text-xs text-red-200">Aggressive</span>
            </div>
            <div className="text-xs text-red-200/70 text-center">
              Selected: {overrideValue.toFixed(2)}x (
              {overrideValue < festivalMultiplier.demandMultiplier
                ? 'conservative'
                : overrideValue > festivalMultiplier.demandMultiplier
                ? 'aggressive'
                : 'matched'}
              )
            </div>
          </div>
        )}
      </div>

      {/* Impact metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-red-900/20 rounded border border-red-500/20">
          <div className="text-xs text-red-200/60 mb-1">Affected Categories</div>
          <div className="font-bold text-red-300">{affectedCount}</div>
          {festivalMultiplier.affectedCategories.slice(0, 2).map((cat, idx) => (
            <div key={idx} className="text-xs text-red-200/50">{cat}</div>
          ))}
        </div>

        <div className="p-2 bg-red-900/20 rounded border border-red-500/20">
          <div className="text-xs text-red-200/60 mb-1">Temp Hiring</div>
          <div className="font-bold text-red-300">{hiringNeeded} roles</div>
          <div className="text-xs text-red-200/50">~₹{(hiringNeeded * 80000 / 100000).toFixed(1)}L budget</div>
        </div>

        <div className="p-2 bg-red-900/20 rounded border border-red-500/20">
          <div className="text-xs text-red-200/60 mb-1">Inventory Boost</div>
          <div className="font-bold text-red-300">+{inventoryBoost}%</div>
          <div className="text-xs text-red-200/50">Safe reorder level: 800 units</div>
        </div>
      </div>

      {/* Cascade suggestions */}
      <div className="p-3 bg-red-900/10 rounded border border-red-500/15 text-xs space-y-1">
        <div className="font-semibold text-red-300">💡 Cascade Impacts:</div>
        <div className="text-red-200/70">
          • {festivalMultiplier.cascadeImpacts.supplierNegotiation}
        </div>
        <div className="text-red-200/70">
          • Demand forecast: {(festivalMultiplier.demandMultiplier * 100).toFixed(0)}% above baseline
        </div>
        <div className="text-red-200/70">
          • Revenue upside: ₹{((overrideActive ? overrideValue : festivalMultiplier.demandMultiplier) - 1) * 500000 / 100000}L
        </div>
      </div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        ✨ Festival optimization cascades through all 8 agents for coordinated execution.
      </div>
    </motion.div>
  );
}
