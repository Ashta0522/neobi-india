'use client';

import { motion } from 'framer-motion';
import { CascadingPath } from '@/types';

interface CascadingPathSelectorProps {
  parentName: string;
  cascadingPaths: CascadingPath[];
  onSelectPath: (path: CascadingPath) => void;
  breadcrumb: string[];
}

export function CascadingPathSelector({
  parentName,
  cascadingPaths,
  onSelectPath,
  breadcrumb,
}: CascadingPathSelectorProps) {
  if (cascadingPaths.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg border border-purple-500/30 p-4"
    >
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-xs">
          <span className="text-purple-300">📍</span>
          {breadcrumb.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-purple-200">{crumb}</span>
              {idx < breadcrumb.length - 1 && <span className="text-purple-500/60">/</span>}
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg font-semibold text-purple-300 mb-4">
        🌳 Sub-Paths for {parentName}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cascadingPaths.map((path, idx) => (
          <motion.button
            key={path.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelectPath(path)}
            className="p-4 text-left bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 rounded-lg transition-all hover:border-purple-400/60 group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-purple-300 group-hover:text-purple-200 text-sm">
                  {path.name}
                </div>
                <div className="text-xs text-purple-200/60 mt-1 line-clamp-2">
                  {path.description}
                </div>
              </div>
              <div className="text-lg opacity-0 group-hover:opacity-100 transition">▶</div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="p-2 bg-purple-800/40 rounded border border-purple-600/20">
                <div className="text-purple-200/60">EV</div>
                <div className="font-semibold text-purple-300">₹{(path.expectedValue / 100000).toFixed(1)}L</div>
              </div>
              <div className="p-2 bg-purple-800/40 rounded border border-purple-600/20">
                <div className="text-purple-200/60">Risk</div>
                <div className="font-semibold text-purple-300">{path.riskScore}%</div>
              </div>
              <div className="p-2 bg-purple-800/40 rounded border border-purple-600/20">
                <div className="text-purple-200/60">Prob</div>
                <div className="font-semibold text-purple-300">{(path.probability * 100).toFixed(0)}%</div>
              </div>
              <div className="p-2 bg-purple-800/40 rounded border border-purple-600/20">
                <div className="text-purple-200/60">Timeline</div>
                <div className="font-semibold text-purple-300">{path.timeline}d</div>
              </div>
            </div>

            {/* Benefits breakdown */}
            <div className="mt-3 pt-2 border-t border-purple-600/20">
              <div className="text-xs text-purple-200/60 mb-1">Monthly Impact</div>
              <div className="text-xs text-purple-300 space-y-1">
                {(() => {
                  const revenue = Number(path?.benefits?.revenue ?? 0);
                  const efficiency = Number(path?.benefits?.efficiency ?? 0);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-semibold">+₹{(revenue / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <span className="font-semibold">+{efficiency}%</span>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Level indicator */}
            <div className="mt-3 flex items-center gap-2">
              <div className="text-xs px-2 py-1 bg-purple-700/40 rounded text-purple-200">
                Level {path.level}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-900/20 rounded border border-purple-500/20 text-xs text-purple-200/70">
        💡 Each sub-path shows different execution strategies. Select one to dive deeper into Level 2 options.
      </div>
    </motion.div>
  );
}
