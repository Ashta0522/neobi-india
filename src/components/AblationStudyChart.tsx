'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { AblationStudy } from '@/types';

interface AblationStudyChartProps {
  ablations: AblationStudy[];
}

export function AblationStudyChart({ ablations }: AblationStudyChartProps) {
  const data = ablations.map((ablation) => ({
    component: ablation.component.replace(/([A-Z])/g, ' $1').trim(),
    'Performance Drop %': ablation.dropPercentage,
    'Without Component': ablation.performanceWithout,
    'With Component': ablation.performanceWith,
  }));

  // Sort by drop percentage (most important first)
  data.sort((a, b) => b['Performance Drop %'] - a['Performance Drop %']);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-amber-300">Ablation Study</h3>
        <p className="text-xs text-amber-200/60">Component importance: performance drop without</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,146,60,0.1)" />
          <XAxis
            dataKey="component"
            stroke="rgba(251,146,60,0.3)"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            stroke="rgba(251,146,60,0.3)"
            label={{ value: 'Performance Drop %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 23, 0.95)',
              border: '1px solid rgba(251,146,60,0.5)',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [value.toFixed(1) + '%', 'Drop']}
          />
          <Bar
            dataKey="Performance Drop %"
            fill="rgba(251,146,60,0.6)"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry['Performance Drop %'] > 20
                    ? '#EF4444'
                    : entry['Performance Drop %'] > 10
                    ? '#F97316'
                    : '#FACC15'
                }
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {data.slice(0, 3).map((entry, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700"
          >
            <div className="flex items-center gap-2">
              <div className="text-2xl">{idx === 0 ? '🏆' : idx === 1 ? '🥈' : '🥉'}</div>
              <span className="font-semibold text-amber-300">{entry.component}</span>
            </div>
            <span className="text-amber-200">{entry['Performance Drop %'].toFixed(1)}% impact</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        🔍 Top 3 most critical components. All 5 required for optimal performance.
      </div>
    </motion.div>
  );
}
