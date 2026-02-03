'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

interface RegionalData {
  tier: 1 | 2 | 3;
  cities: string[];
  demandMultiplier: number;
  costMultiplier: number;
  competitionLevel: number;
  growthPotential: number;
  marketSize: number;
  averageRevenue: number;
}

interface RegionalInequalityAdjustmentProps {
  regions: RegionalData[];
  selectedTier: 1 | 2 | 3;
}

const RegionalInequalityAdjustment: React.FC<RegionalInequalityAdjustmentProps> = ({ regions, selectedTier }) => {
  const [expanded, setExpanded] = useState(false);

  const chartData = regions.map((r) => ({
    tier: `Tier ${r.tier}`,
    demand: r.demandMultiplier * 100,
    cost: r.costMultiplier * 100,
    competition: r.competitionLevel,
    growth: r.growthPotential,
  }));

  const scatterData = regions.map((r) => ({
    x: r.marketSize / 10000,
    y: r.averageRevenue / 1000,
    z: r.demandMultiplier * 100,
    tier: r.tier,
    name: `Tier ${r.tier}`,
  }));

  const ChartsContent = ({ barHeight = 250, scatterHeight = 250 }: { barHeight?: number; scatterHeight?: number }) => (
    <div className={expanded ? 'grid grid-cols-2 gap-6' : 'grid grid-cols-1 lg:grid-cols-2 gap-4'}>
      {/* Bar Chart */}
      <div style={{ width: '100%', height: barHeight }}>
        <p className={`text-center mb-2 ${expanded ? 'text-sm text-cyan-300' : 'text-xs text-cyan-400'}`}>Market Metrics by Tier</p>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="tier" stroke="#22D3EE" tick={{ fontSize: expanded ? 14 : 11 }} />
            <YAxis stroke="#22D3EE" tick={{ fontSize: expanded ? 14 : 11 }} label={expanded ? { value: 'Percentage', angle: -90, position: 'insideLeft', fill: '#22D3EE' } : undefined} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #06B6D4',
                borderRadius: '8px',
                color: '#06E4FD',
                fontSize: expanded ? 14 : 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: expanded ? 13 : 11 }} />
            <Bar dataKey="demand" fill="#06B6D4" name="Demand %" />
            <Bar dataKey="growth" fill="#22D3EE" name="Growth Potential %" />
            <Bar dataKey="competition" fill="#A5F3FC" name="Competition %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter Chart */}
      <div style={{ width: '100%', height: scatterHeight }}>
        <p className={`text-center mb-2 ${expanded ? 'text-sm text-cyan-300' : 'text-xs text-cyan-400'}`}>Market Size vs Avg Revenue</p>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" dataKey="x" name="Market Size" stroke="#22D3EE" tick={{ fontSize: expanded ? 14 : 11 }} label={expanded ? { value: 'Market Size (₹Cr)', position: 'bottom', fill: '#22D3EE' } : undefined} />
            <YAxis type="number" dataKey="y" name="Avg Revenue" stroke="#22D3EE" tick={{ fontSize: expanded ? 14 : 11 }} label={expanded ? { value: 'Avg Revenue (₹L)', angle: -90, position: 'insideLeft', fill: '#22D3EE' } : undefined} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #06B6D4',
                borderRadius: '8px',
                color: '#06E4FD',
                fontSize: expanded ? 14 : 12,
              }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Legend wrapperStyle={{ fontSize: expanded ? 13 : 11 }} />
            {[1, 2, 3].map((tier, idx) => (
              <Scatter key={`tier-${tier}`} name={`Tier ${tier}`} data={scatterData.filter((d) => d.tier === tier)} fill={['#06B6D4', '#22D3EE', '#A5F3FC'][idx]} />
            ))}
          </ScatterChart>
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
          className="fixed z-[10000] bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl flex flex-col overflow-y-auto"
          style={{ top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', width: '90vw', height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-cyan-300">🌍 Regional Inequality Adjustment</h3>
              <p className="text-sm text-gray-400 mt-1">Tier-wise market analysis for Indian cities</p>
            </div>
            <button onClick={() => setExpanded(false)} className="px-6 py-3 text-base bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-bold flex items-center gap-2">
              <X size={20} /> Close
            </button>
          </div>

          <ChartsContent barHeight={350} scatterHeight={350} />

          {/* Tier Details - Expanded */}
          <div className="mt-6 grid grid-cols-3 gap-4 flex-shrink-0">
            {regions.map((region) => (
              <motion.div
                key={`tier-${region.tier}`}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTier === region.tier
                    ? 'bg-cyan-600/40 border-cyan-400'
                    : 'bg-black/40 border-cyan-500/20 hover:border-cyan-400'
                }`}
              >
                <h4 className="font-bold text-cyan-300 mb-3 text-lg">Tier {region.tier}</h4>
                <div className="space-y-2 text-sm text-cyan-200">
                  <p><strong>Cities:</strong> {region.cities.join(', ')}</p>
                  <p><strong>Demand Multiplier:</strong> {(region.demandMultiplier * 100).toFixed(0)}%</p>
                  <p><strong>Cost Multiplier:</strong> {(region.costMultiplier * 100).toFixed(0)}%</p>
                  <p><strong>Market Size:</strong> ₹{(region.marketSize / 100000).toFixed(1)}Cr</p>
                  <p><strong>Avg Revenue:</strong> ₹{(region.averageRevenue / 1000).toFixed(1)}L</p>
                  <p><strong>Growth Potential:</strong> {region.growthPotential}%</p>
                  <p><strong>Competition Level:</strong> {region.competitionLevel}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-cyan-500/30 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-cyan-300">🌍 Regional Inequality Adjustment</h3>
        <button
          onClick={() => setExpanded(true)}
          className="px-3 py-1.5 text-xs bg-cyan-600/30 hover:bg-cyan-600 rounded text-cyan-100 font-semibold flex items-center gap-1 transition-colors"
        >
          <Maximize2 size={14} /> Expand
        </button>
      </div>

      <ChartsContent />

      {/* Tier Details */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {regions.map((region) => (
          <motion.div
            key={`tier-${region.tier}`}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedTier === region.tier
                ? 'bg-cyan-600/40 border-cyan-400'
                : 'bg-black/40 border-cyan-500/20 hover:border-cyan-400'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="font-bold text-cyan-300 mb-2">Tier {region.tier}</h4>
            <div className="space-y-1 text-xs text-cyan-200">
              <p>Cities: {region.cities.length}</p>
              <p>Demand: {(region.demandMultiplier * 100).toFixed(0)}%</p>
              <p>Market: ₹{(region.marketSize / 100000).toFixed(1)}Cr</p>
              <p>Avg Revenue: ₹{(region.averageRevenue / 1000).toFixed(1)}L</p>
              <p>Growth: {region.growthPotential}%</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* City List */}
      <div className="mt-4 pt-4 border-t border-cyan-500/20">
        <h4 className="text-xs font-bold text-cyan-300 mb-2">Selected Tier Cities</h4>
        <div className="flex flex-wrap gap-2">
          {regions
            .find((r) => r.tier === selectedTier)
            ?.cities.map((city) => (
              <span key={city} className="text-xs px-2 py-1 rounded bg-cyan-600/30 text-cyan-200 border border-cyan-500/30">
                {city}
              </span>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RegionalInequalityAdjustment;
