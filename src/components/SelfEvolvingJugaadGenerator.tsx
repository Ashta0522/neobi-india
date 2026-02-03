'use client';

import React, { useState } from 'react';
import { JugaadIdea } from '@/types';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

interface SelfEvolvingJugaadProps {
  ideas: JugaadIdea[];
  onGenerateNew: () => void;
}

const SelfEvolvingJugaadGenerator: React.FC<SelfEvolvingJugaadProps> = ({ ideas, onGenerateNew }) => {
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const evolutionData = ideas.map((idea) => ({
    name: `Gen ${idea.generation}`,
    feasibility: (idea as any).feasibility ?? (idea as any).feasibilityScore ?? 0,
    impact: (idea as any).impact ?? (idea as any).potentialImpact ?? 0,
  }));

  const categoryDistribution = Object.entries(
    ideas.reduce(
      (acc, idea) => {
        const cat = idea.category || 'unknown';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

  const ChartsContent = ({ barHeight = 250, pieHeight = 250 }: { barHeight?: number; pieHeight?: number }) => (
    <div className={expanded ? 'grid grid-cols-2 gap-6' : 'grid grid-cols-2 gap-4'}>
      {/* Evolution Chart */}
      <div style={{ width: '100%', height: barHeight }}>
        <p className={`text-center mb-2 ${expanded ? 'text-sm text-green-300' : 'text-xs text-green-400'}`}>Idea Evolution by Generation</p>
        <ResponsiveContainer>
          <BarChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#86EFAC" tick={{ fontSize: expanded ? 14 : 11 }} />
            <YAxis stroke="#86EFAC" tick={{ fontSize: expanded ? 14 : 11 }} label={expanded ? { value: 'Score %', angle: -90, position: 'insideLeft', fill: '#86EFAC' } : undefined} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #22C55E',
                borderRadius: '8px',
                color: '#86EFAC',
                fontSize: expanded ? 14 : 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: expanded ? 13 : 11 }} />
            <Bar dataKey="feasibility" fill="#22C55E" name="Feasibility %" />
            <Bar dataKey="impact" fill="#84CC16" name="Impact %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div style={{ width: '100%', height: pieHeight }}>
        <p className={`text-center mb-2 ${expanded ? 'text-sm text-green-300' : 'text-xs text-green-400'}`}>Category Distribution</p>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={expanded ? 60 : 40} outerRadius={expanded ? 100 : 80} paddingAngle={5} dataKey="value" label={expanded ? ({ name, value }) => `${name}: ${value}` : undefined}>
              {categoryDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #22C55E',
                borderRadius: '8px',
                color: '#86EFAC',
                fontSize: expanded ? 14 : 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: expanded ? 13 : 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Expanded Modal
  if (expanded) {
    return (
      <>
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg" onClick={() => setExpanded(false)} />
        <div
          className="fixed z-[10000] bg-slate-900 border border-green-500/30 rounded-2xl p-6 shadow-2xl flex flex-col overflow-y-auto"
          style={{ top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', width: '90vw', height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-green-300">🧬 Self-Evolving Jugaad Generator</h3>
              <p className="text-sm text-gray-400 mt-1">AI-generated innovative solutions with evolutionary optimization</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onGenerateNew}
                className="px-4 py-3 text-sm font-bold bg-green-600/50 hover:bg-green-600 rounded-lg border border-green-400/30 text-green-100 transition-all"
              >
                🔄 Generate New
              </button>
              <button onClick={() => setExpanded(false)} className="px-6 py-3 text-base bg-green-500 hover:bg-green-600 rounded-lg text-white font-bold flex items-center gap-2">
                <X size={20} /> Close
              </button>
            </div>
          </div>

          <div className="mb-6">
            <ChartsContent barHeight={300} pieHeight={300} />
          </div>

          {/* Ideas List - Expanded */}
          <div className="flex-1 min-h-0">
            <h4 className="text-base font-bold text-green-300 mb-3">Generated Ideas ({ideas.length})</h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {ideas.map((idea) => (
                <motion.div
                  key={idea.id}
                  onClick={() => setSelectedIdea(selectedIdea === idea.id ? null : idea.id)}
                  className="cursor-pointer p-4 bg-black/40 hover:bg-black/60 rounded-lg border border-green-500/20 hover:border-green-400 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-green-300 text-base">{idea.title || idea.description}</span>
                    <span className="text-sm bg-green-600/40 px-3 py-1 rounded text-green-200">Gen {idea.generation}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-green-400">
                    <span>Feasibility: {(idea as any).feasibility ?? (idea as any).feasibilityScore}%</span>
                    <span>•</span>
                    <span>Impact: {(idea as any).impact ?? (idea as any).potentialImpact}%</span>
                    <span>•</span>
                    <span>Success Rate: {(idea as any).successRate ?? 0}%</span>
                  </div>
                  {selectedIdea === idea.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-green-500/20 text-sm text-green-300">
                      <p><strong>Category:</strong> {idea.category}</p>
                      <p className="mt-2"><strong>Full Description:</strong></p>
                      <p className="text-green-200">{idea.description}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Footer */}
          <div className="mt-4 pt-4 border-t border-green-500/20 flex justify-between text-sm text-green-300 flex-shrink-0">
            <span>Total Ideas: {ideas.length}</span>
            <span>Avg Generation: {(ideas.reduce((acc, i) => acc + (i.generation || 0), 0) / Math.max(1, ideas.length)).toFixed(1)}</span>
            <span>Avg Success Rate: {(ideas.reduce((acc, i) => acc + ((i as any).successRate ?? 0), 0) / Math.max(1, ideas.length)).toFixed(0)}%</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-green-500/30 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-green-300">🧬 Self-Evolving Jugaad Generator</h3>
        <div className="flex gap-2">
          <button
            onClick={onGenerateNew}
            className="px-3 py-1.5 text-xs font-bold bg-green-600/50 hover:bg-green-600 rounded border border-green-400/30 text-green-100 transition-all"
          >
            🔄 Generate New
          </button>
          <button
            onClick={() => setExpanded(true)}
            className="px-3 py-1.5 text-xs bg-green-600/30 hover:bg-green-600 rounded text-green-100 font-semibold flex items-center gap-1 transition-colors"
          >
            <Maximize2 size={14} /> Expand
          </button>
        </div>
      </div>

      <div className="mb-4">
        <ChartsContent />
      </div>

      {/* Ideas List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {ideas.map((idea) => (
          <motion.div
            key={idea.id}
            onClick={() => setSelectedIdea(selectedIdea === idea.id ? null : idea.id)}
            className="cursor-pointer p-3 bg-black/40 hover:bg-black/60 rounded-lg border border-green-500/20 hover:border-green-400 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-green-300 text-sm">{(idea.title || idea.description).substring(0, 40)}...</span>
              <span className="text-xs bg-green-600/40 px-2 py-1 rounded text-green-200">Gen {idea.generation}</span>
            </div>
            <div className="flex gap-2 text-xs text-green-400">
              <span>Feasibility: {(idea as any).feasibility ?? (idea as any).feasibilityScore}%</span>
              <span>•</span>
              <span>Impact: {(idea as any).impact ?? (idea as any).potentialImpact}%</span>
              <span>•</span>
              <span>Success: {(idea as any).successRate ?? 0}%</span>
            </div>

            {selectedIdea === idea.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-green-500/20 text-xs text-green-300">
                <p>Mutations: {(idea as any).mutations ?? 0}</p>
                <p>Category: {idea.category}</p>
                <p className="mt-2 font-semibold text-green-200">Full Description:</p>
                <p>{idea.description}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-green-500/20 flex justify-between text-xs text-green-300">
        <span>Total Ideas: {ideas.length}</span>
        <span>Avg Generation: {(ideas.reduce((acc, i) => acc + (i.generation || 0), 0) / Math.max(1, ideas.length)).toFixed(1)}</span>
        <span>Avg Success: {(ideas.reduce((acc, i) => acc + ((i as any).successRate ?? 0), 0) / Math.max(1, ideas.length)).toFixed(0)}%</span>
      </div>
    </motion.div>
  );
};

export default SelfEvolvingJugaadGenerator;
