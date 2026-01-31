'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { RewardDecomposition } from '@/types';

interface RewardDecompositionChartProps {
  decomposition: RewardDecomposition;
}

export function RewardDecompositionChart({ decomposition }: RewardDecompositionChartProps) {
  const data = [
    {
      name: 'Revenue',
      value: decomposition.components.revenue,
      contribution: (decomposition.totalReward * decomposition.components.revenue) / 100,
      color: '#10B981',
    },
    {
      name: 'Risk Reduction',
      value: decomposition.components.riskReduction,
      contribution: (decomposition.totalReward * decomposition.components.riskReduction) / 100,
      color: '#F97316',
    },
    {
      name: 'Burnout Mitigation',
      value: decomposition.components.burnoutMitigation,
      contribution: (decomposition.totalReward * decomposition.components.burnoutMitigation) / 100,
      color: '#14B8A6',
    },
    {
      name: 'Efficiency',
      value: decomposition.components.operationalEfficiency,
      contribution: (decomposition.totalReward * decomposition.components.operationalEfficiency) / 100,
      color: '#FACC15',
    },
    {
      name: 'Compliance',
      value: decomposition.components.complianceScore,
      contribution: (decomposition.totalReward * decomposition.components.complianceScore) / 100,
      color: '#EC4899',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-amber-300">Reward Decomposition</h3>
        <p className="text-xs text-amber-200/60">
          Total Reward: <span className="font-bold text-amber-300">{decomposition.totalReward.toFixed(1)}</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,146,60,0.1)" />
          <XAxis type="number" stroke="rgba(251,146,60,0.3)" />
          <YAxis dataKey="name" type="category" stroke="rgba(251,146,60,0.3)" width={110} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 23, 0.95)',
              border: '1px solid rgba(251,146,60,0.5)',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [value.toFixed(1), 'Contribution']}
          />
          <Bar dataKey="contribution" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded border border-slate-700">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
            <div>
              <div className="font-semibold text-amber-300">{entry.name}</div>
              <div className="text-amber-200/60">{entry.value.toFixed(1)}% ({entry.contribution.toFixed(1)})</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        💰 Each component contributes equally to success. Balance is key!
      </div>
    </motion.div>
  );
}
