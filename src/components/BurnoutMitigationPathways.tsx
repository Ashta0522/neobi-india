'use client';

import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

interface BurnoutMitigationProps {
  trajectories: Array<{
    day: number;
    baseline: number;
    withPathA: number;
    withPathB: number;
    withPathC: number;
    threshold: number;
  }>;
}

const BurnoutMitigationPathways: React.FC<BurnoutMitigationProps> = ({ trajectories }) => {
  const [expanded, setExpanded] = useState(false);
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const ChartContent = ({ height = 300 }: { height?: number }) => (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={trajectories}>
          <defs>
            <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorPathA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: expanded ? 14 : 11 }} label={expanded ? { value: 'Day', position: 'bottom', fill: '#94A3B8' } : undefined} />
          <YAxis stroke="#94A3B8" tick={{ fontSize: expanded ? 14 : 11 }} label={expanded ? { value: 'Burnout Risk %', angle: -90, position: 'insideLeft', fill: '#94A3B8' } : undefined} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: '1px solid #3B82F6',
              borderRadius: '8px',
              color: '#93C5FD',
              fontSize: expanded ? 14 : 12,
            }}
          />
          <Area type="monotone" dataKey="baseline" stroke="#94A3B8" fill="url(#colorBaseline)" name="No Action (Baseline)" strokeWidth={expanded ? 3 : 2} />
          <Area type="monotone" dataKey="withPathA" stroke="#10B981" fill="url(#colorPathA)" name="Mitigation A (Team)" strokeWidth={expanded ? 3 : 2} />
          <Area type="monotone" dataKey="withPathB" stroke="#3B82F6" name="Mitigation B (Automation)" strokeWidth={expanded ? 3 : 2} />
          <Area type="monotone" dataKey="withPathC" stroke="#F59E0B" name="Mitigation C (Restructure)" strokeWidth={expanded ? 3 : 2} />
          <Legend wrapperStyle={{ fontSize: expanded ? 14 : 11 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  // Expanded Modal
  if (expanded) {
    return (
      <>
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg" onClick={() => setExpanded(false)} />
        <div
          className="fixed z-[10000] bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl flex flex-col"
          style={{ top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', width: '90vw', height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-blue-300">🛡️ Burnout Mitigation Pathways</h3>
              <p className="text-sm text-gray-400 mt-1">30-day projection comparing different intervention strategies</p>
            </div>
            <button onClick={() => setExpanded(false)} className="px-6 py-3 text-base bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-bold flex items-center gap-2">
              <X size={20} /> Close
            </button>
          </div>
          <div className="flex-1" style={{ minHeight: 0, height: 'calc(90vh - 200px)' }}>
            <ChartContent height={typeof window !== 'undefined' ? window.innerHeight * 0.55 : 400} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-base flex-shrink-0">
            {[
              { label: 'Path A: Team Expansion', impact: 35, icon: '👥', desc: 'Hire additional team members to distribute workload' },
              { label: 'Path B: Process Automation', impact: 42, icon: '⚙️', desc: 'Automate repetitive tasks to reduce manual effort' },
              { label: 'Path C: Role Restructure', impact: 28, icon: '🔄', desc: 'Reorganize roles for better efficiency' },
            ].map((path) => (
              <div key={path.label} className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
                <div className="text-3xl mb-2">{path.icon}</div>
                <p className="text-blue-200 font-semibold">{path.label}</p>
                <p className="text-gray-400 text-sm mt-1">{path.desc}</p>
                <p className="text-blue-400 mt-2 text-lg font-bold">Burnout Reduction: {path.impact}%</p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-blue-500/30 p-6"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-300">🛡️ Burnout Mitigation Pathways</h3>
        <button
          onClick={() => setExpanded(true)}
          className="px-3 py-1.5 text-xs bg-blue-600/30 hover:bg-blue-600 rounded text-blue-100 font-semibold flex items-center gap-1 transition-colors"
        >
          <Maximize2 size={14} /> Expand
        </button>
      </motion.div>

      <ChartContent height={300} />

      <motion.div variants={itemVariants} className="mt-4 grid grid-cols-3 gap-3 text-sm">
        {[
          { label: 'Path A: Team Expansion', impact: 35, icon: '👥' },
          { label: 'Path B: Process Automation', impact: 42, icon: '⚙️' },
          { label: 'Path C: Role Restructure', impact: 28, icon: '🔄' },
        ].map((path) => (
          <div key={path.label} className="bg-black/40 rounded-lg p-3 border border-blue-500/20">
            <div className="text-xl mb-1">{path.icon}</div>
            <p className="text-blue-200 text-xs font-semibold">{path.label}</p>
            <p className="text-blue-400 text-xs mt-1">Impact: {path.impact}%</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BurnoutMitigationPathways;
