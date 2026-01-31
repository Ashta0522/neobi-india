'use client';

import { motion } from 'framer-motion';
import { RegionalAdjustment } from '@/types';

interface RegionalAdjustmentGaugeProps {
  adjustment: RegionalAdjustment | null;
}

export function RegionalAdjustmentGauge({ adjustment }: RegionalAdjustmentGaugeProps) {
  if (!adjustment) return null;

  // Provide defaults for missing properties
  const demandMultiplier = adjustment.demandMultiplier ?? 1.0;
  const hiringCostMultiplier = adjustment.hiringCostMultiplier ?? 1.0;
  const supplierCostMultiplier = adjustment.supplierCostMultiplier ?? 1.0;
  const complianceBurden = adjustment.complianceBurden ?? 100;
  const cityTier = (adjustment.cityTier ?? 1) as 1 | 2 | 3;

  const getTierColor = (tier: 1 | 2 | 3) => {
    if (tier === 1) return 'from-green-600 to-green-500';
    if (tier === 2) return 'from-amber-600 to-amber-500';
    return 'from-red-600 to-red-500';
  };

  const getTierLabel = (tier: 1 | 2 | 3) => {
    if (tier === 1) return 'Metro';
    if (tier === 2) return 'Tier-2 City';
    return 'Tier-3 Town';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-amber-300">🗺️ Regional Inequality Adjustment</h3>
        <p className="text-xs text-amber-200/60">{adjustment.regionalNote ?? 'Regional multipliers applied'}</p>
      </div>

      {/* City Tier Badge */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`bg-gradient-to-r ${getTierColor(cityTier)} p-4 rounded-lg text-white text-center mb-4`}
      >
        <div className="text-2xl font-bold">{getTierLabel(cityTier)}</div>
        <div className="text-xs opacity-90">Tier {cityTier} City</div>
      </motion.div>

      {/* Multiplier Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-slate-800/50 rounded border border-green-500/20">
          <div className="text-xs text-amber-200/60 mb-1">Demand</div>
          <div className="text-2xl font-bold text-green-400">{demandMultiplier.toFixed(2)}x</div>
          <div className="text-xs text-amber-200/50 mt-1">
            {demandMultiplier >= 1 ? '✅ Higher' : '⚠️ Lower'} vs metros
          </div>
        </div>

        <div className="p-3 bg-slate-800/50 rounded border border-blue-500/20">
          <div className="text-xs text-amber-200/60 mb-1">Hiring Cost</div>
          <div className="text-2xl font-bold text-blue-400">{hiringCostMultiplier.toFixed(2)}x</div>
          <div className="text-xs text-amber-200/50 mt-1">
            {hiringCostMultiplier < 1 ? '💰 Savings!' : '📈 Premium'}
          </div>
        </div>

        <div className="p-3 bg-slate-800/50 rounded border border-purple-500/20">
          <div className="text-xs text-amber-200/60 mb-1">Supplier Cost</div>
          <div className="text-2xl font-bold text-purple-400">{supplierCostMultiplier.toFixed(2)}x</div>
          <div className="text-xs text-amber-200/50 mt-1">Raw material cost</div>
        </div>

        <div className="p-3 bg-slate-800/50 rounded border border-orange-500/20">
          <div className="text-xs text-amber-200/60 mb-1">Compliance Load</div>
          <div className="text-2xl font-bold text-orange-400">{complianceBurden}%</div>
          <div className="text-xs text-amber-200/50 mt-1">GST/DPDP/UPI</div>
        </div>
      </div>

      {/* MSME Eligibility */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-3 bg-amber-900/20 rounded border border-amber-500/20 mb-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-amber-300">MSME Government Incentives</span>
          <span className={`font-bold ${cityTier > 1 ? 'text-green-400' : 'text-yellow-400'}`}>
            {cityTier > 1 ? '✅ Eligible' : '⚠️ Limited'}
          </span>
        </div>
        <div className="mt-2 text-xs text-amber-200/70 space-y-1">
          <div>• GST registration mandatory in Tier-1</div>
          <div>• EPF/ESI from 1st employee (all tiers)</div>
          <div>• Tier-2/3: 5% income tax holiday available</div>
        </div>
      </motion.div>

      {/* Revenue Impact Forecast */}
      <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
        <div className="text-xs text-amber-200/60 mb-2">Revenue Impact Projection (vs Tier-1)</div>
        <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden flex items-center">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(demandMultiplier * 100)}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full bg-gradient-to-r ${getTierColor(cityTier)} flex items-center justify-end pr-2`}
          >
            <span className="text-xs font-bold text-white">
              {Math.round((demandMultiplier - 1) * 100)}%
            </span>
          </motion.div>
        </div>
      </div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        🎯 Region affects demand but also reduces costs. Tier-2/3 = higher margins with lower ceiling.
      </div>
    </motion.div>
  );
}
