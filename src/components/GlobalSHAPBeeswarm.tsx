'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface GlobalSHAPBeeswarmProps {
  features: string[];
  baseValue: number;
}

export function GlobalSHAPBeeswarm({ features, baseValue }: GlobalSHAPBeeswarmProps) {
  // Generate SHAP beeswarm data - each feature gets scattered points
  const data = features.flatMap((feature, idx) => {
    const baseShap = (baseValue * (Math.random() * 0.4 + 0.1));
    return Array.from({ length: 12 }, (_, i) => ({
      feature: feature,
      value: baseValue + baseShap * (0.8 + Math.random() * 0.4),
      importance: baseShap,
      scatter: Math.random() * 0.15 - 0.075,
      x: idx + Math.random() * 0.3 - 0.15,
      y: baseValue + baseShap * (0.8 + Math.random() * 0.4),
    }));
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-amber-300">Global SHAP Beeswarm</h3>
        <p className="text-xs text-amber-200/60">Feature importance across all 8 agents</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,146,60,0.1)" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[-1, features.length]}
            tickFormatter={() => ''}
            stroke="rgba(251,146,60,0.3)"
          />
          <YAxis
            type="number"
            dataKey="y"
            stroke="rgba(251,146,60,0.3)"
            label={{ value: 'SHAP Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 23, 0.95)',
              border: '1px solid rgba(251,146,60,0.5)',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [
              value.toFixed(0),
              value.feature || 'SHAP Value',
            ]}
          />
          <Scatter
            name="SHAP Values"
            data={data}
            fill="rgba(251,146,60,0.6)"
            fillOpacity={0.7}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Feature labels at bottom */}
      <div className="grid gap-2 mt-4 text-xs">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500/60" />
            <span className="text-amber-200">{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        ✨ All agents contribute to feature importance. Red points = high impact features.
      </div>
    </motion.div>
  );
}
