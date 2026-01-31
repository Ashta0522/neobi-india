'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JugaadIdea } from '@/types';

interface JugaadGeneratorProps {
  ideas: JugaadIdea[];
  onGenerateNew: () => void;
  onEvolve: (ideaId: string, feedback: 'thumbs_up' | 'thumbs_down') => void;
}

export function JugaadGenerator({ ideas, onGenerateNew, onEvolve }: JugaadGeneratorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const recentIdeas = ideas.slice(-3).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg border border-cyan-500/30 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cyan-300">⚡ Self-Evolving Jugaad Generator</h3>
        <button
          onClick={() => onGenerateNew()}
          className="px-3 py-1 bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-500/40 rounded text-sm text-cyan-200 transition-all"
        >
          🎲 Mutate
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {recentIdeas.map((idea, idx) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.1 }}
              className="p-3 bg-cyan-900/40 border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 transition-all cursor-pointer"
              onClick={() => setExpandedId(expandedId === idea.id ? null : idea.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-cyan-300">Gen {idea.generation}</span>
                    <span className="text-xs px-2 py-0.5 bg-cyan-700/40 rounded text-cyan-200">
                      {idea.category}
                    </span>
                    <span className="text-xs text-cyan-200/60">
                      {idea.feasibilityScore}% feasible
                    </span>
                  </div>
                  <p className="text-sm text-cyan-200 line-clamp-2">{idea.description}</p>
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {expandedId === idea.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 pt-3 border-t border-cyan-600/20 space-y-2"
                  >
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between text-cyan-200/70">
                        <span>Potential Impact:</span>
                        <span className="text-cyan-300">{idea.potentialImpact.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-cyan-200/70">
                        <span>Feasibility:</span>
                        <span className="text-cyan-300">{idea.feasibilityScore}%</span>
                      </div>
                      {idea.generation > 1 && (
                        <div className="text-cyan-200/60">
                          🧬 Evolved from Gen {idea.generation - 1}
                        </div>
                      )}
                    </div>

                    {/* Feedback buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEvolve(idea.id, 'thumbs_up');
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-green-600/30 hover:bg-green-600/50 border border-green-500/30 rounded text-green-200 transition-all"
                      >
                        👍 Improve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEvolve(idea.id, 'thumbs_down');
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 rounded text-red-200 transition-all"
                      >
                        👎 Pivot
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {ideas.length === 0 && (
        <div className="text-center py-6 text-cyan-200/60 text-sm">
          No jugaad ideas yet. Click "Mutate" to generate first idea!
        </div>
      )}

      <div className="mt-4 p-3 bg-cyan-900/20 rounded border border-cyan-500/20 text-xs text-cyan-200/70">
        🚀 Each idea mutates based on your feedback. Better ideas get more feasible over generations.
      </div>
    </motion.div>
  );
}
