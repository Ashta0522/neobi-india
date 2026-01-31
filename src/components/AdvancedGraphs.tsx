 'use client';

import React, { useState } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';

export const GraphContainer: React.FC<{ title: string; subtitle?: string } & React.HTMLAttributes<HTMLDivElement>> = ({ title, subtitle, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="glass p-4" style={{ height: expanded ? 'auto' : 320 }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2">{title} {subtitle && <span className="text-xs text-gray-400 font-normal">{subtitle}</span>}</h4>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded((s) => !s)}
              className="px-2 py-1 text-xs bg-amber-600/30 hover:bg-amber-600 rounded text-amber-100"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
        <div style={{ height: expanded ? 600 : 256 }} className="w-full">
          {children}
        </div>
      </div>
      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl h-[80vh] glass p-6 overflow-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={() => setExpanded(false)} className="px-3 py-1 text-sm bg-amber-600/30 rounded">Close</button>
            </div>
            <div style={{ height: 'calc(100% - 50px)' }}>{children}</div>
          </div>
        </div>
      )}
    </>
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
