'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

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
  const colors = ['#94A3B8', '#10B981', '#3B82F6', '#F59E0B'];
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-blue-500/30 p-6"
    >
      <motion.h3 variants={itemVariants} className="text-lg font-bold text-blue-300 mb-4">
        🛡️ Burnout Mitigation Pathways
      </motion.h3>

      <div style={{ width: '100%', height: 300 }}>
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
            <XAxis dataKey="day" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #3B82F6',
                borderRadius: '8px',
                color: '#93C5FD',
              }}
            />
            <Area type="monotone" dataKey="baseline" stroke="#94A3B8" fill="url(#colorBaseline)" name="No Action" />
            <Area type="monotone" dataKey="withPathA" stroke="#10B981" fill="url(#colorPathA)" name="Mitigation A" />
            <Area type="monotone" dataKey="withPathB" stroke="#3B82F6" name="Mitigation B" />
            <Area type="monotone" dataKey="withPathC" stroke="#F59E0B" name="Mitigation C" />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </div>

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
