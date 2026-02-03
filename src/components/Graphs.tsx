'use client';

import React from 'react';
import { useNeoBIStore } from '@/lib/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom legend to avoid overlapping
const CompactLegend = ({ payload }: any) => (
  <div className="flex gap-4 justify-center text-xs mt-1">
    {payload?.map((entry: any, index: number) => (
      <div key={index} className="flex items-center gap-1">
        <div className="w-3 h-0.5" style={{ backgroundColor: entry.color }} />
        <span className="text-gray-400">{entry.value}</span>
      </div>
    ))}
  </div>
);

export const MARLConvergenceCurve: React.FC = () => {
  const { graphData } = useNeoBIStore();
  const { marlConvergence } = graphData;

  // Sample data to reduce x-axis crowding
  const sampledData = marlConvergence.episodes
    .filter((_, idx) => idx % 3 === 0 || idx === marlConvergence.episodes.length - 1)
    .map((ep, idx) => ({
      episode: ep,
      reward: marlConvergence.rewards[idx * 3] || marlConvergence.rewards[marlConvergence.rewards.length - 1],
      mean: marlConvergence.mean[idx * 3] || marlConvergence.mean[marlConvergence.mean.length - 1],
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={sampledData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="episode"
          stroke="#666"
          tick={{ fontSize: 10 }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis stroke="#666" tick={{ fontSize: 10 }} tickLine={false} width={35} />
        <Tooltip
          contentStyle={{ background: 'rgba(15,15,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11 }}
        />
        <Legend content={<CompactLegend />} />
        <Line type="monotone" dataKey="reward" stroke="#FF6B6B" dot={false} strokeWidth={1.5} name="Episode Reward" />
        <Line type="monotone" dataKey="mean" stroke="#FFB347" strokeWidth={2} dot={false} name="Mean (Converged)" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const WorldModelAccuracyChart: React.FC = () => {
  const { graphData } = useNeoBIStore();
  const { worldModelAccuracy } = graphData;

  const data = worldModelAccuracy.horizons.map((h, idx) => ({
    horizon: `${h}d`,
    mae: worldModelAccuracy.mae[idx],
    rmse: worldModelAccuracy.rmse[idx],
  }));

  return (
    <div className="glass p-4 h-80">
      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
        🎯 World Model Accuracy
        <span className="text-xs text-gray-400 font-normal">MAE/RMSE vs Horizon</span>
      </h4>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="horizon" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ background: 'rgba(15,15,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Legend />
          <Line type="monotone" dataKey="mae" stroke="#10B981" dot={{ r: 4 }} name="MAE" />
          <Line type="monotone" dataKey="rmse" stroke="#06B6D4" dot={{ r: 4 }} name="RMSE" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CashFlowProjectionChart: React.FC = () => {
  const { graphData } = useNeoBIStore();
  const { cashFlowProjection } = graphData;

  const data = cashFlowProjection.months.map((month, idx) => ({
    month,
    path1: cashFlowProjection.path1[idx],
    path2: cashFlowProjection.path2[idx],
    path3: cashFlowProjection.path3[idx],
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="month"
          stroke="#666"
          tick={{ fontSize: 10 }}
          tickLine={false}
        />
        <YAxis
          stroke="#666"
          tick={{ fontSize: 10 }}
          tickLine={false}
          width={45}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{ background: 'rgba(15,15,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11 }}
          formatter={(value) => `₹${(Number(value) / 100000).toFixed(1)}L`}
        />
        <Legend content={<CompactLegend />} />
        <Line type="monotone" dataKey="path1" stroke="#EC4899" name="Aggressive" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="path2" stroke="#FFB347" name="Balanced" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="path3" stroke="#10B981" name="Conservative" strokeWidth={2} dot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const InventoryTurnoverChart: React.FC = () => {
  const { graphData } = useNeoBIStore();
  const { inventoryTurnover } = graphData;

  const data = inventoryTurnover.months.map((month, idx) => ({
    month,
    turnover: inventoryTurnover.turnover[idx],
    reorderPoint: inventoryTurnover.reorderPoint / 100,
  }));

  return (
    <div className="glass p-4 h-80">
      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
        📦 Inventory Turnover
        <span className="text-xs text-gray-400 font-normal">Operational Health</span>
      </h4>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ background: 'rgba(15,15,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Legend />
          <Line type="monotone" dataKey="turnover" stroke="#14B8A6" strokeWidth={2} dot={{ r: 4 }} name="Turnover Ratio" />
          <Line type="monotone" dataKey="reorderPoint" stroke="#F97316" strokeDasharray="5 5" name="Reorder Point" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
