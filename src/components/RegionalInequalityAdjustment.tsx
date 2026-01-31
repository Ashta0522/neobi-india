'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { motion } from 'framer-motion';

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
  const chartData = regions.map((r) => ({
    tier: `Tier ${r.tier}`,
    demand: r.demandMultiplier,
    cost: r.costMultiplier,
    competition: r.competitionLevel,
    growth: r.growthPotential,
  }));

  const scatterData = regions.map((r, idx) => ({
    x: r.marketSize,
    y: r.averageRevenue,
    z: r.demandMultiplier * 100,
    tier: r.tier,
    name: `Tier ${r.tier}`,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-cyan-500/30 p-6">
      <h3 className="text-lg font-bold text-cyan-300 mb-4">🌍 Regional Inequality Adjustment</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="tier" stroke="#22D3EE" />
              <YAxis stroke="#22D3EE" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #06B6D4',
                  borderRadius: '8px',
                  color: '#06E4FD',
                }}
              />
              <Legend />
              <Bar dataKey="demand" fill="#06B6D4" name="Demand Multiplier" />
              <Bar dataKey="growth" fill="#22D3EE" name="Growth Potential" />
              <Bar dataKey="competition" fill="#A5F3FC" name="Competition Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scatter Chart */}
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" dataKey="x" name="Market Size" stroke="#22D3EE" />
              <YAxis type="number" dataKey="y" name="Avg Revenue" stroke="#22D3EE" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #06B6D4',
                  borderRadius: '8px',
                  color: '#06E4FD',
                }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              {[1, 2, 3].map((tier, idx) => (
                <Scatter key={`tier-${tier}`} name={`Tier ${tier}`} data={scatterData.filter((d) => d.tier === tier)} fill={['#06B6D4', '#22D3EE', '#A5F3FC'][idx]} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

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
              <p>Market: ₹{region.marketSize}Cr</p>
              <p>Avg Revenue: ₹{region.averageRevenue}L</p>
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
