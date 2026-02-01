'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Clock, DollarSign } from 'lucide-react';

interface MRRHealthPulseProps {
  currentMRR: number;
  previousWeekMRR?: number;
  cashOnHand: number;
  monthlyBurn: number;
}

export function MRRHealthPulse({ currentMRR, previousWeekMRR, cashOnHand, monthlyBurn }: MRRHealthPulseProps) {
  // Calculate week-over-week trend
  const weekOverWeekChange = useMemo(() => {
    if (!previousWeekMRR || previousWeekMRR === 0) return 0;
    return ((currentMRR - previousWeekMRR) / previousWeekMRR) * 100;
  }, [currentMRR, previousWeekMRR]);

  // Calculate runway in months
  const runway = useMemo(() => {
    if (monthlyBurn === 0) return Infinity;
    return cashOnHand / monthlyBurn;
  }, [cashOnHand, monthlyBurn]);

  // Determine health score
  const healthScore = useMemo(() => {
    let score = 100;

    // Runway impact (50% weight)
    if (runway < 3) score -= 50;
    else if (runway < 6) score -= 30;
    else if (runway < 12) score -= 10;

    // MRR trend impact (30% weight)
    if (weekOverWeekChange < -10) score -= 30;
    else if (weekOverWeekChange < -5) score -= 20;
    else if (weekOverWeekChange < 0) score -= 10;

    // Burn rate impact (20% weight)
    const burnRatio = monthlyBurn / currentMRR;
    if (burnRatio > 2) score -= 20;
    else if (burnRatio > 1.5) score -= 10;

    return Math.max(0, Math.min(100, score));
  }, [runway, weekOverWeekChange, monthlyBurn, currentMRR]);

  // Health status
  const healthStatus = useMemo(() => {
    if (healthScore >= 80) return { label: 'Healthy', color: 'green', icon: <TrendingUp /> };
    if (healthScore >= 60) return { label: 'Stable', color: 'yellow', icon: <Clock /> };
    if (healthScore >= 40) return { label: 'Caution', color: 'orange', icon: <AlertTriangle /> };
    return { label: 'Critical', color: 'red', icon: <TrendingDown /> };
  }, [healthScore]);

  // Color classes
  const colorClasses = {
    green: {
      bg: 'from-green-500/20 to-green-600/20',
      border: 'border-green-500/50',
      text: 'text-green-400',
      gauge: 'bg-green-500',
    },
    yellow: {
      bg: 'from-yellow-500/20 to-yellow-600/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      gauge: 'bg-yellow-500',
    },
    orange: {
      bg: 'from-orange-500/20 to-orange-600/20',
      border: 'border-orange-500/50',
      text: 'text-orange-400',
      gauge: 'bg-orange-500',
    },
    red: {
      bg: 'from-red-500/20 to-red-600/20',
      border: 'border-red-500/50',
      text: 'text-red-400',
      gauge: 'bg-red-500',
    },
  };

  const colors = colorClasses[healthStatus.color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <DollarSign size={18} className={colors.text} />
          <h3 className="text-sm font-bold text-white">MRR Health Pulse</h3>
        </div>
        <div className={`flex items-center gap-1 ${colors.text}`}>
          {React.cloneElement(healthStatus.icon, { size: 16 })}
          <span className="text-xs font-semibold">{healthStatus.label}</span>
        </div>
      </div>

      {/* Health Score Gauge */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Health Score</span>
          <span className={`text-lg font-black ${colors.text}`}>{healthScore.toFixed(0)}/100</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${colors.gauge} rounded-full`}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <MetricBox
          label="Current MRR"
          value={`₹${(currentMRR / 100000).toFixed(1)}L`}
          change={weekOverWeekChange}
        />
        <MetricBox
          label="Runway"
          value={runway === Infinity ? '∞' : `${runway.toFixed(1)}mo`}
          warning={runway < 6}
        />
        <MetricBox
          label="Burn Rate"
          value={`₹${(monthlyBurn / 100000).toFixed(1)}L/mo`}
          warning={monthlyBurn > currentMRR}
        />
      </div>

      {/* Insights */}
      <div className="space-y-2">
        {runway < 6 && (
          <InsightBox
            icon={<AlertTriangle size={12} />}
            text={`Low runway: ${runway.toFixed(1)} months remaining`}
            color="red"
          />
        )}
        {weekOverWeekChange < -5 && (
          <InsightBox
            icon={<TrendingDown size={12} />}
            text={`MRR declining: ${weekOverWeekChange.toFixed(1)}% WoW`}
            color="orange"
          />
        )}
        {monthlyBurn > currentMRR && (
          <InsightBox
            icon={<AlertTriangle size={12} />}
            text="Burn rate exceeds MRR - consider cost optimization"
            color="red"
          />
        )}
        {healthScore >= 80 && weekOverWeekChange > 5 && (
          <InsightBox
            icon={<TrendingUp size={12} />}
            text={`Strong growth: +${weekOverWeekChange.toFixed(1)}% WoW`}
            color="green"
          />
        )}
        {healthScore >= 80 && runway > 12 && (
          <InsightBox
            icon={<TrendingUp size={12} />}
            text="Healthy runway - focus on growth"
            color="green"
          />
        )}
      </div>

      {/* Call to Action */}
      {healthScore < 60 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <button className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition-all">
            View Optimization Strategies →
          </button>
        </div>
      )}
    </motion.div>
  );
}

function MetricBox({ label, value, change, warning }: any) {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-sm font-bold ${warning ? 'text-red-400' : 'text-white'}`}>
        {value}
      </div>
      {change !== undefined && (
        <div className={`text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </div>
      )}
    </div>
  );
}

function InsightBox({ icon, text, color }: any) {
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
  };

  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="mt-0.5">{icon}</div>
      <p className="text-xs leading-tight">{text}</p>
    </div>
  );
}
