'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';

interface FestivalData {
  name: string;
  date: string;
  daysUntil: number;
  baseMultiplier: number;
  peakMultiplier: number;
  demandCurve: Array<{ day: number; multiplier: number }>;
  affectedCategories: string[];
  historicalSales: number;
}

interface FestivalAwareDemandProps {
  festivals: FestivalData[];
  selectedFestival: string | null;
  onSelectFestival: (festival: string) => void;
}

const FestivalAwareDemandMultiplier: React.FC<FestivalAwareDemandProps> = ({ festivals, selectedFestival, onSelectFestival }) => {
  const selected = festivals.find((f) => f.name === selectedFestival);

  const combinedDemandData = useMemo(() => {
    if (!selected) return [];
    return selected.demandCurve.map((point) => ({
      day: `D-${point.day}`,
      multiplier: point.multiplier,
      estimatedSales: (point.multiplier * selected.historicalSales).toFixed(0),
    }));
  }, [selected]);

  const categoryColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-pink-500/30 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-bold text-pink-300">🎉 Festival-Aware Demand Multiplier</h3>
      </div>

      {/* Festival Selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {festivals.map((festival) => (
          <motion.button
            key={festival.name}
            onClick={() => onSelectFestival(festival.name)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              selectedFestival === festival.name
                ? 'bg-pink-600/60 border-pink-400 text-pink-100'
                : 'bg-black/40 border-pink-500/30 text-pink-200 hover:bg-black/60'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {festival.name}
            <span className="text-xs opacity-70 ml-1">({festival.daysUntil}d)</span>
          </motion.button>
        ))}
      </div>

      {selected && (
        <>
          {/* Demand Curve Chart */}
          <div style={{ width: '100%', height: 250 }} className="mb-4">
            <ResponsiveContainer>
              <LineChart data={combinedDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#EC4899" />
                <YAxis stroke="#EC4899" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #EC4899',
                    borderRadius: '8px',
                    color: '#F472B6',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="multiplier" stroke="#EC4899" strokeWidth={3} name="Demand Multiplier" dot={{ fill: '#F472B6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Festival Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/40 rounded-lg p-3 border border-pink-500/20">
              <p className="text-xs text-pink-400 font-semibold">Peak Multiplier</p>
              <p className="text-2xl font-bold text-pink-300">{selected.peakMultiplier.toFixed(1)}x</p>
              <p className="text-xs text-pink-400/60">on {selected.date}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-black/40 rounded-lg p-3 border border-pink-500/20">
              <p className="text-xs text-pink-400 font-semibold">Historical Sales</p>
              <p className="text-2xl font-bold text-pink-300">₹{(selected.historicalSales / 10).toFixed(0)}L</p>
              <p className="text-xs text-pink-400/60">avg revenue</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-black/40 rounded-lg p-3 border border-pink-500/20">
              <p className="text-xs text-pink-400 font-semibold">Projected Sales</p>
              <p className="text-2xl font-bold text-pink-300">₹{((selected.peakMultiplier * selected.historicalSales) / 10).toFixed(0)}L</p>
              <p className="text-xs text-pink-400/60">at peak</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-black/40 rounded-lg p-3 border border-pink-500/20">
              <p className="text-xs text-pink-400 font-semibold">Revenue Uplift</p>
              <p className="text-2xl font-bold text-pink-300">+{(((selected.peakMultiplier - 1) * 100)).toFixed(0)}%</p>
              <p className="text-xs text-pink-400/60">over baseline</p>
            </motion.div>
          </div>

          {/* Affected Categories */}
          <div className="mb-4 pt-4 border-t border-pink-500/20">
            <h4 className="text-xs font-bold text-pink-300 mb-2">📦 Affected Product Categories</h4>
            <div className="flex flex-wrap gap-2">
              {selected.affectedCategories.map((category, idx) => (
                <motion.span
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="text-xs px-3 py-1.5 rounded-full bg-pink-600/30 text-pink-200 border border-pink-500/30"
                >
                  {category}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-black/40 rounded-lg p-4 border border-pink-500/20">
            <h4 className="text-xs font-bold text-pink-300 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recommended Actions
            </h4>
            <ul className="space-y-2 text-xs text-pink-200">
              <li>✓ Increase inventory for {selected.affectedCategories[0]} by 40%</li>
              <li>✓ Launch targeted campaigns 7 days before peak</li>
              <li>✓ Staff up by 50% during D-3 to D+2</li>
              <li>✓ Negotiate bulk discounts with suppliers now</li>
              <li>✓ Prepare logistics for {((selected.peakMultiplier * 1.2) * 100).toFixed(0)}% volume surge</li>
            </ul>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FestivalAwareDemandMultiplier;
