 'use client';

import React, { useState } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';

export const GraphContainer: React.FC<{ title: string; subtitle?: string } & React.HTMLAttributes<HTMLDivElement>> = ({ title, subtitle, children }) => {
  const [expanded, setExpanded] = useState(false);

  // When expanded, render a portal-like full-screen modal
  if (expanded) {
    return (
      <>
        {/* Backdrop - clicking closes */}
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg"
          onClick={() => setExpanded(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        {/* Modal content - doesn't close when clicking inside */}
        <div
          className="fixed z-[10000] bg-slate-900 border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col"
          style={{
            position: 'fixed',
            top: '5vh',
            left: '5vw',
            right: '5vw',
            bottom: '5vh',
            width: '90vw',
            height: '90vh',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="px-6 py-3 text-base bg-amber-500 hover:bg-amber-600 rounded-lg text-black font-bold transition-colors"
            >
              ✕ Close
            </button>
          </div>
          {/* Full height chart container */}
          <div className="flex-1 w-full" style={{ minHeight: 0, height: 'calc(90vh - 100px)' }}>
            {children}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="glass p-4" style={{ height: 320 }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2">{title} {subtitle && <span className="text-xs text-gray-400 font-normal">{subtitle}</span>}</h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(true)}
            className="px-3 py-1.5 text-xs bg-amber-600/30 hover:bg-amber-600 rounded text-amber-100 font-semibold transition-colors"
          >
            ⛶ Expand
          </button>
        </div>
      </div>
      <div style={{ height: 256 }} className="w-full">
        {children}
      </div>
    </div>
  );
};

export const SHAPBeeswarm: React.FC = () => {
  const { graphData } = useNeoBIStore();
  const { shapBeeswarm } = graphData;

  const data = shapBeeswarm.features.map((feature, idx) => ({
    feature,
    shap: shapBeeswarm.shapValues[idx],
  }));

  return (
    <GraphContainer title="🐝 Global SHAP Feature Importance" subtitle="Relative contributions">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 40 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis type="number" stroke="#888" />
          <YAxis dataKey="feature" type="category" stroke="#888" width={80} />
          <Tooltip
            contentStyle={{ background: 'rgba(15,15,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Bar dataKey="shap" fill="#FF6B6B" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

export const AgentContributionPie: React.FC = () => {
  const { agents, selectedPath } = useNeoBIStore();

  const data = Object.entries(selectedPath?.agentContributions || {})
    .filter(([, v]) => v > 0)
    .map(([agent, contribution]) => ({
      name: agent,
      value: contribution,
      color: agents[agent as keyof typeof agents].color,
    }));

  if (data.length === 0) {
    return (
      <div className="glass p-4 h-80 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Select a path to see agent contributions</p>
      </div>
    );
  }

  return (
    <GraphContainer title="🎭 Agent Contribution" subtitle="Transparency view">
      {data.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm">Select a path to see agent contributions</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'rgba(15,15,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </GraphContainer>
  );
};

export const ConfidenceDistributionHistogram: React.FC<{ distribution?: any }> = ({ distribution }) => {
  const { graphData } = useNeoBIStore();
  const { confidenceDistribution } = graphData;

  const source = distribution ?? confidenceDistribution;

  const data = (source?.bins || []).map((bin: string, idx: number) => ({
    bin,
    count: source.count?.[idx] ?? 0,
  }));

  return (
    <GraphContainer title="📊 Confidence Distribution" subtitle="Ensemble reliability">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="bin" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ background: 'rgba(15,15,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Bar dataKey="count" fill="#FACC15" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

export const BurnoutRiskChart: React.FC = () => {
  const { vibeMode } = useNeoBIStore();

  const data = [
    { name: 'Aggressive', reduction: 10 },
    { name: 'Balanced', reduction: 35 },
    { name: 'Conservative', reduction: 60 },
  ];

  return (
    <GraphContainer title="❤️ Burnout Risk Reduction" subtitle="by Vibe Mode">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ background: 'rgba(15,15,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Bar dataKey="reduction" fill="#14B8A6" radius={4}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.name.toLowerCase() === vibeMode
                    ? '#FF6B6B'
                    : '#14B8A6'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};
