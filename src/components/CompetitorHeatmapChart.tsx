'use client';

import { motion } from 'framer-motion';
import { CompetitorHeatmap } from '@/types';

interface CompetitorHeatmapChartProps {
  heatmapData: CompetitorHeatmap[];
}

export function CompetitorHeatmapChart({ heatmapData }: CompetitorHeatmapChartProps) {
  if (heatmapData.length === 0) return null;

  // Group data by your action
  const groupedByAction = heatmapData.reduce(
    (acc, item) => {
      if (!acc[item.yourAction]) acc[item.yourAction] = [];
      acc[item.yourAction].push(item);
      return acc;
    },
    {} as Record<string, CompetitorHeatmap[]>
  );

  const actions = Object.keys(groupedByAction);

  const getColorIntensity = (likelihood: number) => {
    if (likelihood > 85) return 'from-red-600 to-red-500';
    if (likelihood > 60) return 'from-orange-600 to-orange-500';
    if (likelihood > 40) return 'from-yellow-600 to-yellow-500';
    return 'from-green-600 to-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-amber-300">⚔️ Competitor Response Heatmap</h3>
        <p className="text-xs text-amber-200/60">Likelihood they'll respond to your actions</p>
      </div>

      {/* Color legend */}
      <div className="flex gap-2 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-600" />
          <span className="text-amber-200/60">&lt;40% likely</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-600" />
          <span className="text-amber-200/60">40-60%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-600" />
          <span className="text-amber-200/60">60-85%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-600" />
          <span className="text-amber-200/60">&gt;85% likely</span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="space-y-4">
        {actions.map((action, actionIdx) => (
          <motion.div
            key={action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: actionIdx * 0.1 }}
          >
            <div className="text-sm font-semibold text-amber-300 mb-2">📌 {action}</div>
            <div className="grid grid-cols-3 gap-2">
              {groupedByAction[action].map((item, idx) => {
                const maxImpact = Math.max(...heatmapData.map((d) => d.likelihood));
                const minImpact = Math.min(...heatmapData.map((d) => d.likelihood));

                return (
                  <motion.div
                    key={`${action}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: actionIdx * 0.1 + idx * 0.05 }}
                    className={`p-3 rounded-lg bg-gradient-to-br ${getColorIntensity(
                      item.likelihood
                    )} border border-white/10 text-white`}
                  >
                    <div className="text-xs opacity-80 mb-1">{item.competitorPersonality}</div>
                    <div className="text-sm font-bold mb-2">{item.likelihood.toFixed(0)}%</div>
                    <div className="text-xs opacity-70 space-y-1">
                      <div>Response in {item.timeline}d</div>
                      <div>
                        Impact:{' '}
                        <span className={item.revenueImpact > 0 ? 'text-green-200' : 'text-red-200'}>
                          {item.revenueImpact > 0 ? '+' : ''}
                          {item.revenueImpactPercent.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 p-3 bg-slate-800/50 rounded border border-slate-700 text-xs space-y-2"
      >
        <div className="font-semibold text-amber-300">🎯 Competitive Insights:</div>
        <div className="text-amber-200/70">
          • Most aggressive competitors respond within 7-12 days
        </div>
        <div className="text-amber-200/70">
          • Price cuts trigger fastest responses (avg. 7 days)
        </div>
        <div className="text-amber-200/70">
          • Conservative players focus on feature-level responses
        </div>
      </motion.div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        💡 Plan your moves anticipating competitor responses. Red cells = expect counters.
      </div>
    </motion.div>
  );
}
