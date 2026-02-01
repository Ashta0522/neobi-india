'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { BurnoutTrajectory } from '@/types';

interface BurnoutTrajectoryChartProps {
  trajectory: BurnoutTrajectory;
}

export function BurnoutTrajectoryChart({ trajectory }: BurnoutTrajectoryChartProps) {
  const data = trajectory.timestamp.map((date, idx) => ({
    date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    'Baseline Risk': trajectory.baselineRisk[idx],
    'With Path': trajectory.afterPathRisk[idx],
    'Reduction': trajectory.baselineRisk[idx] - trajectory.afterPathRisk[idx],
  }));

  const reduction = trajectory.baselineRisk[0] - trajectory.afterPathRisk[trajectory.afterPathRisk.length - 1];
  const reductionPercent = ((reduction / trajectory.baselineRisk[0]) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-amber-300">Burnout Trajectory</h3>
        <p className="text-xs text-amber-200/60">
          {trajectory.vibeMode.toUpperCase()} mode: {reductionPercent}% reduction over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="withPathGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,146,60,0.1)" />
          <XAxis
            dataKey="date"
            stroke="rgba(251,146,60,0.3)"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            stroke="rgba(251,146,60,0.3)"
            label={{ value: 'Risk %', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 23, 0.95)',
              border: '1px solid rgba(251,146,60,0.5)',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [value.toFixed(0) + '%', '']}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="Baseline Risk"
            stroke="#EF4444"
            fill="url(#baselineGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="With Path"
            stroke="#10B981"
            fill="url(#withPathGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="p-3 bg-slate-800/50 rounded border border-red-500/20">
          <div className="text-xs text-red-200/60 mb-1">Baseline (No Change)</div>
          <div className="text-lg font-bold text-red-400">{trajectory.baselineRisk[trajectory.baselineRisk.length - 1]?.toFixed(0)}%</div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded border border-green-500/20">
          <div className="text-xs text-green-200/60 mb-1">With Selected Path</div>
          <div className="text-lg font-bold text-green-400">{trajectory.afterPathRisk[trajectory.afterPathRisk.length - 1]?.toFixed(0)}%</div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded border border-amber-500/20">
          <div className="text-xs text-amber-200/60 mb-1">Total Reduction</div>
          <div className="text-lg font-bold text-amber-300">{reductionPercent}%</div>
        </div>
      </div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        ❤️ Founder wellness improves with {trajectory.vibeMode} approach. Monitor stress factors weekly.
      </div>
    </motion.div>
  );
}
