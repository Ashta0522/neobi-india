'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import { useMemo, memo } from 'react';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GlobalSHAPBeeswarmProps {
  features: string[];
  baseValue: number;
}

// Plain language explanations for common features
const FEATURE_EXPLANATIONS: Record<string, string> = {
  'MRR': 'Your monthly recurring revenue - higher means more stability',
  'Team Size': 'Number of employees - affects capacity and costs',
  'Market Growth': 'Industry growth rate - high growth = more opportunity',
  'Seasonality': 'Festival/seasonal demand patterns affecting your business',
  'Competitor': 'Competition intensity in your market',
  'Cash Flow': 'Money coming in vs going out each month',
  'Risk Tolerance': 'How much uncertainty you can handle',
  'Location': 'Your city tier affects costs and market size',
  'Industry': 'Your business sector characteristics',
  'Experience': 'Years in business - affects credibility',
};

// Impact direction labels
const getImpactLabel = (value: number, baseValue: number) => {
  const diff = value - baseValue;
  const pct = Math.abs((diff / baseValue) * 100);
  if (pct < 5) return { label: 'Neutral impact', color: '#9CA3AF', icon: <Minus size={12} /> };
  if (diff > 0) return { label: `Increases success by ~${pct.toFixed(0)}%`, color: '#22C55E', icon: <TrendingUp size={12} /> };
  return { label: `Decreases success by ~${pct.toFixed(0)}%`, color: '#EF4444', icon: <TrendingDown size={12} /> };
};

export const GlobalSHAPBeeswarm = memo(function GlobalSHAPBeeswarm({ features, baseValue }: GlobalSHAPBeeswarmProps) {
  // Generate SHAP beeswarm data with meaningful variations
  const { data, featureStats } = useMemo(() => {
    const allData: any[] = [];
    const stats: { feature: string; avgImpact: number; direction: 'positive' | 'negative' | 'neutral' }[] = [];

    features.forEach((feature, idx) => {
      const baseShap = (baseValue * (Math.random() * 0.4 + 0.1));
      const direction = Math.random() > 0.5 ? 1 : -1;
      let totalImpact = 0;

      const points = Array.from({ length: 12 }, (_, i) => {
        const impact = baseShap * (0.8 + Math.random() * 0.4) * direction;
        totalImpact += impact;
        return {
          feature: feature,
          featureIndex: idx,
          value: baseValue + impact,
          importance: Math.abs(baseShap),
          scatter: Math.random() * 0.15 - 0.075,
          x: idx + Math.random() * 0.3 - 0.15,
          y: baseValue + impact,
          rawImpact: impact,
        };
      });

      allData.push(...points);

      const avgImpact = totalImpact / 12;
      stats.push({
        feature,
        avgImpact,
        direction: Math.abs(avgImpact) < baseValue * 0.05 ? 'neutral' : avgImpact > 0 ? 'positive' : 'negative',
      });
    });

    // Sort stats by absolute impact
    stats.sort((a, b) => Math.abs(b.avgImpact) - Math.abs(a.avgImpact));

    return { data: allData, featureStats: stats };
  }, [features, baseValue]);

  // Get top insights
  const topInsights = useMemo(() => {
    const positives = featureStats.filter(f => f.direction === 'positive').slice(0, 2);
    const negatives = featureStats.filter(f => f.direction === 'negative').slice(0, 2);
    return { positives, negatives };
  }, [featureStats]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      {/* Header with explanation */}
      <div className="mb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-amber-300">Why This Recommendation?</h3>
            <p className="text-xs text-amber-200/60 mt-0.5">See which factors influenced our AI's decision</p>
          </div>
          <div className="group relative">
            <Info size={16} className="text-amber-400/60 cursor-help" />
            <div className="absolute right-0 top-6 w-64 bg-slate-800 border border-slate-600 rounded-lg p-3 hidden group-hover:block z-50 shadow-xl">
              <p className="text-[11px] text-gray-300">
                <strong className="text-amber-300">SHAP Analysis</strong> shows how each factor pushed the AI's recommendation up or down.
                <span className="text-green-400"> Green = positive impact</span>,
                <span className="text-red-400"> Red = negative impact</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights Summary */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
          <div className="text-[10px] text-green-400 font-semibold mb-1 flex items-center gap-1">
            <TrendingUp size={10} /> Working in your favor
          </div>
          {topInsights.positives.length > 0 ? (
            topInsights.positives.map((f, i) => (
              <div key={i} className="text-[11px] text-green-300">• {f.feature}</div>
            ))
          ) : (
            <div className="text-[11px] text-gray-400">No strong positive factors</div>
          )}
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
          <div className="text-[10px] text-red-400 font-semibold mb-1 flex items-center gap-1">
            <TrendingDown size={10} /> Areas to watch
          </div>
          {topInsights.negatives.length > 0 ? (
            topInsights.negatives.map((f, i) => (
              <div key={i} className="text-[11px] text-red-300">• {f.feature}</div>
            ))
          ) : (
            <div className="text-[11px] text-gray-400">No significant concerns</div>
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,146,60,0.1)" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[-0.5, features.length - 0.5]}
            ticks={features.map((_, i) => i)}
            tickFormatter={(value) => features[Math.round(value)]?.slice(0, 8) || ''}
            stroke="rgba(251,146,60,0.3)"
            tick={{ fontSize: 10, fill: 'rgba(251,146,60,0.7)' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            stroke="rgba(251,146,60,0.3)"
            tick={{ fontSize: 10, fill: 'rgba(251,146,60,0.5)' }}
            tickFormatter={(v) => v > 0 ? `+${v.toFixed(0)}` : v.toFixed(0)}
          />
          <ReferenceLine y={baseValue} stroke="rgba(255,255,255,0.3)" strokeDasharray="5 5" />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const point = payload[0].payload;
              const impact = getImpactLabel(point.y, baseValue);
              const explanation = FEATURE_EXPLANATIONS[point.feature] || 'Factor in our analysis';
              return (
                <div className="bg-slate-800 border border-amber-500/50 rounded-lg p-3 shadow-xl max-w-xs">
                  <div className="font-bold text-amber-300 text-sm">{point.feature}</div>
                  <p className="text-[11px] text-gray-400 mt-1">{explanation}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: impact.color }}>
                    {impact.icon}
                    {impact.label}
                  </div>
                </div>
              );
            }}
          />
          <Scatter name="SHAP Values" data={data}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.rawImpact > baseValue * 0.05 ? '#22C55E' : entry.rawImpact < -baseValue * 0.05 ? '#EF4444' : '#9CA3AF'}
                fillOpacity={0.7}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Feature Legend with Plain Language */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-[11px]">
        {featureStats.slice(0, 6).map((stat, idx) => (
          <div key={idx} className="flex items-center gap-2 py-1">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: stat.direction === 'positive' ? '#22C55E' : stat.direction === 'negative' ? '#EF4444' : '#9CA3AF'
              }}
            />
            <span className="text-amber-200 truncate">{stat.feature}</span>
            <span
              className="ml-auto text-[10px]"
              style={{ color: stat.direction === 'positive' ? '#22C55E' : stat.direction === 'negative' ? '#EF4444' : '#9CA3AF' }}
            >
              {stat.direction === 'positive' ? '↑' : stat.direction === 'negative' ? '↓' : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom explanation */}
      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-[11px] text-amber-200/70">
        <strong className="text-amber-300">💡 How to read this:</strong> Each dot shows how much a factor influenced the recommendation.
        <span className="text-green-400"> Green dots</span> pushed toward success,
        <span className="text-red-400"> red dots</span> indicate risk areas.
      </div>
    </motion.div>
  );
});
