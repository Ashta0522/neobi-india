'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { ConfidenceDistribution } from '@/types';

interface ConfidenceDistributionHistogramProps {
  distribution: ConfidenceDistribution;
}

export function ConfidenceDistributionHistogram({ distribution }: ConfidenceDistributionHistogramProps) {
  const data = distribution.bins.map((bin, idx) => ({
    range: bin,
    count: distribution.counts[idx],
    percentage: ((distribution.counts[idx] / distribution.counts.reduce((a, b) => a + b, 0)) * 100).toFixed(1),
  }));

  const colors = ['#EF4444', '#F97316', '#FACC15', '#10B981', '#06B6D4'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-amber-300">Confidence Distribution</h3>
        <p className="text-xs text-amber-200/60">
          Ensemble reliability: {distribution.mean.toFixed(1)}% ± {distribution.stdDev.toFixed(1)}%
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,146,60,0.1)" />
          <XAxis
            dataKey="range"
            stroke="rgba(251,146,60,0.3)"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            stroke="rgba(251,146,60,0.3)"
            label={{ value: 'Ensemble Members', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 23, 0.95)',
              border: '1px solid rgba(251,146,60,0.5)',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [value, 'Count']}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
        <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
          <div className="text-amber-200/60 mb-1">Mean</div>
          <div className="font-bold text-amber-300">{distribution.mean.toFixed(1)}%</div>
        </div>
        <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
          <div className="text-amber-200/60 mb-1">Std Dev</div>
          <div className="font-bold text-amber-300">±{distribution.stdDev.toFixed(1)}%</div>
        </div>
        <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
          <div className="text-amber-200/60 mb-1">Min</div>
          <div className="font-bold text-amber-300">{distribution.minConfidence.toFixed(0)}%</div>
        </div>
        <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
          <div className="text-amber-200/60 mb-1">Max</div>
          <div className="font-bold text-amber-300">{distribution.maxConfidence.toFixed(0)}%</div>
        </div>
      </div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        📊 {distribution.mean > 85 ? '✅ High confidence ensemble!' : '⚠️ Check outlier agents for misalignment.'}
      </div>
    </motion.div>
  );
}
