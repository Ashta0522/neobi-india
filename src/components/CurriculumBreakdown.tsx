'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { CurriculumLevel } from '@/types';

interface CurriculumBreakdownProps {
  levels: CurriculumLevel[];
}

export function CurriculumBreakdown({ levels }: CurriculumBreakdownProps) {
  // Prepare data for visualization - show all 3 levels with different colors
  const maxEpisodes = Math.max(...levels.map(l => Math.max(...l.episodes)));
  
  const chartData = Array.from({ length: maxEpisodes + 1 }, (_, idx) => {
    const point: Record<string, any> = { episode: idx };
    
    levels.forEach((level) => {
      const episodeIndex = level.episodes.indexOf(idx);
      if (episodeIndex >= 0) {
        point[`Level ${level.level} Reward`] = level.rewards[episodeIndex];
        point[`L${level.level} Convergence`] = level.convergenceMetric[episodeIndex];
      }
    });
    
    return point;
  }).filter(p => Object.keys(p).length > 1);

  const colors = ['#10B981', '#06B6D4', '#FACC15'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-amber-300">Curriculum Learning Breakdown</h3>
        <p className="text-xs text-amber-200/60">3-level hierarchical learning convergence</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,146,60,0.1)" />
          <XAxis
            dataKey="episode"
            stroke="rgba(251,146,60,0.3)"
            label={{ value: 'Episode', position: 'right', offset: -10 }}
          />
          <YAxis stroke="rgba(251,146,60,0.3)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 23, 0.95)',
              border: '1px solid rgba(251,146,60,0.5)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {levels.map((level, idx) => (
            <Line
              key={`level-${level.level}`}
              type="monotone"
              dataKey={`Level ${level.level} Reward`}
              stroke={colors[idx]}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={idx * 200}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {levels.map((level, idx) => (
          <motion.div
            key={level.level}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-3 bg-slate-800/50 rounded border border-slate-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[idx] }} />
              <span className="font-semibold text-amber-300">Level {level.level}</span>
            </div>
            <div className="text-xs text-amber-200/70 mb-2">{level.description}</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Final Reward:</span>
                <span className="text-amber-300">{level.rewards[level.rewards.length - 1]?.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Convergence:</span>
                <span className="text-amber-300">{level.convergenceMetric[level.convergenceMetric.length - 1]?.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-amber-200/50">
                <span>Top Agent:</span>
                <span className="text-amber-300">Decision Intel</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        📚 Each level increases complexity. L3 agents cooperate across time horizons.
      </div>
    </motion.div>
  );
}
