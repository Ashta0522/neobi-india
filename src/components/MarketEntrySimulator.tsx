'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Users, Building, Maximize2, X, ArrowRight, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

interface StateData {
  name: string;
  code: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  population: number; // in millions
  gdpPerCapita: number; // in INR
  marketSize: number; // potential in crores
  competitionLevel: 'Low' | 'Medium' | 'High';
  regulatoryEase: number; // 0-100
  infrastructureScore: number; // 0-100
  digitalPenetration: number; // percentage
  laborCost: number; // relative index
  entryBarriers: string[];
  keyIndustries: string[];
  recommendedEntry: string;
}

interface MarketEntryData {
  targetState: StateData;
  alternativeStates: StateData[];
  projectedROI: Array<{ month: number; conservative: number; moderate: number; aggressive: number }>;
  investmentRequired: { min: number; max: number };
  breakEvenMonths: number;
  riskFactors: Array<{ factor: string; severity: 'Low' | 'Medium' | 'High'; mitigation: string }>;
  successProbability: number;
  recommendations: string[];
}

interface MarketEntryProps {
  data: MarketEntryData;
  onSimulate?: (state: string) => void;
}

const MarketEntrySimulator: React.FC<MarketEntryProps> = ({ data, onSimulate }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedState, setSelectedState] = useState<StateData>(data.targetState);

  const comparisonData = useMemo(() => [
    { ...selectedState, fill: '#10B981' },
    ...data.alternativeStates.slice(0, 3).map((s, idx) => ({ ...s, fill: ['#3B82F6', '#F59E0B', '#8B5CF6'][idx] }))
  ].map(s => ({
    state: s.name,
    market: s.marketSize / 100,
    regulatory: s.regulatoryEase,
    infrastructure: s.infrastructureScore,
    digital: s.digitalPenetration,
  })), [selectedState, data.alternativeStates]);

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'High': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const ComparisonChart = ({ height = 250 }: { height?: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={comparisonData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" />
        <YAxis type="category" dataKey="state" stroke="#94A3B8" width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: '1px solid #10B981',
            borderRadius: '8px',
            color: '#86EFAC',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="regulatory" fill="#10B981" name="Regulatory Ease" />
        <Bar dataKey="infrastructure" fill="#3B82F6" name="Infrastructure" />
        <Bar dataKey="digital" fill="#8B5CF6" name="Digital %" />
      </BarChart>
    </ResponsiveContainer>
  );

  const ROIChart = ({ height = 250 }: { height?: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data.projectedROI}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#94A3B8" label={expanded ? { value: 'Months', position: 'bottom', fill: '#94A3B8' } : undefined} />
        <YAxis stroke="#94A3B8" label={expanded ? { value: 'ROI %', angle: -90, position: 'insideLeft', fill: '#94A3B8' } : undefined} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: '1px solid #10B981',
            borderRadius: '8px',
            color: '#86EFAC',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="conservative" stroke="#94A3B8" name="Conservative" strokeWidth={2} />
        <Line type="monotone" dataKey="moderate" stroke="#10B981" name="Moderate" strokeWidth={2} />
        <Line type="monotone" dataKey="aggressive" stroke="#F59E0B" name="Aggressive" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );

  // Expanded Modal
  if (expanded) {
    return (
      <>
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg" onClick={() => setExpanded(false)} />
        <div
          className="fixed z-[10000] bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl flex flex-col overflow-y-auto"
          style={{ top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', width: '90vw', height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-emerald-300 flex items-center gap-2">
                <MapPin className="w-7 h-7" />
                Market Entry Simulator
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Target: <span className="text-emerald-400 font-bold">{selectedState.name}</span> ({selectedState.tier}) |
                Success Probability: <span className="text-green-400 font-bold">{data.successProbability}%</span>
              </p>
            </div>
            <div className="flex gap-3">
              {onSimulate && (
                <button
                  onClick={() => onSimulate(selectedState.code)}
                  className="px-4 py-3 text-sm font-bold bg-emerald-600/50 hover:bg-emerald-600 rounded-lg border border-emerald-400/30 text-emerald-100 transition-all"
                >
                  Run Simulation
                </button>
              )}
              <button onClick={() => setExpanded(false)} className="px-6 py-3 text-base bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-bold flex items-center gap-2">
                <X size={20} /> Close
              </button>
            </div>
          </div>

          {/* State Selector */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setSelectedState(data.targetState)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedState.code === data.targetState.code
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
              }`}
            >
              {data.targetState.name} (Target)
            </button>
            {data.alternativeStates.map((state) => (
              <button
                key={state.code}
                onClick={() => setSelectedState(state)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  selectedState.code === state.code
                    ? 'bg-blue-600 text-white'
                    : 'bg-black/40 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30'
                }`}
              >
                {state.name}
              </button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-black/40 rounded-lg p-4 border border-emerald-500/30">
              <p className="text-sm text-emerald-400 font-semibold">Market Size</p>
              <p className="text-2xl font-bold text-emerald-300">₹{(selectedState.marketSize / 100).toFixed(0)}Cr</p>
              <p className="text-xs text-emerald-400/60">addressable market</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-blue-400 font-semibold">Investment</p>
              <p className="text-2xl font-bold text-blue-300">₹{(data.investmentRequired.min / 100000).toFixed(0)}L-{(data.investmentRequired.max / 100000).toFixed(0)}L</p>
              <p className="text-xs text-blue-400/60">required capital</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-yellow-500/30">
              <p className="text-sm text-yellow-400 font-semibold">Break Even</p>
              <p className="text-2xl font-bold text-yellow-300">{data.breakEvenMonths} months</p>
              <p className="text-xs text-yellow-400/60">to profitability</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
              <p className="text-sm text-purple-400 font-semibold">Competition</p>
              <span className={`text-xl font-bold px-2 py-1 rounded ${getCompetitionColor(selectedState.competitionLevel)}`}>
                {selectedState.competitionLevel}
              </span>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-green-400 font-semibold">Success Rate</p>
              <p className="text-2xl font-bold text-green-300">{data.successProbability}%</p>
              <p className="text-xs text-green-400/60">probability</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* State Comparison */}
            <div className="bg-black/40 rounded-xl p-4 border border-emerald-500/20">
              <h4 className="text-base font-bold text-emerald-300 mb-4">State Comparison Analysis</h4>
              <ComparisonChart height={280} />
            </div>

            {/* ROI Projection */}
            <div className="bg-black/40 rounded-xl p-4 border border-emerald-500/20">
              <h4 className="text-base font-bold text-emerald-300 mb-4">Projected ROI Over Time</h4>
              <ROIChart height={280} />
            </div>
          </div>

          {/* State Details & Risks */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            {/* State Profile */}
            <div className="bg-black/40 rounded-xl p-4 border border-emerald-500/20">
              <h4 className="text-base font-bold text-emerald-300 mb-3 flex items-center gap-2">
                <Building className="w-5 h-5" /> State Profile
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Population</span><span className="text-white">{selectedState.population}M</span></div>
                <div className="flex justify-between"><span className="text-gray-400">GDP/Capita</span><span className="text-white">₹{(selectedState.gdpPerCapita / 1000).toFixed(0)}K</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Regulatory Ease</span><span className="text-white">{selectedState.regulatoryEase}/100</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Infrastructure</span><span className="text-white">{selectedState.infrastructureScore}/100</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Digital %</span><span className="text-white">{selectedState.digitalPenetration}%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Labor Cost Index</span><span className="text-white">{selectedState.laborCost}</span></div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-emerald-400 font-semibold mb-2">Key Industries</p>
                <div className="flex flex-wrap gap-1">
                  {selectedState.keyIndustries.map((ind, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded bg-emerald-600/30 text-emerald-200">{ind}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-black/40 rounded-xl p-4 border border-red-500/20">
              <h4 className="text-base font-bold text-red-300 mb-3">Risk Factors</h4>
              <div className="space-y-3">
                {data.riskFactors.map((risk, idx) => (
                  <div key={idx} className="p-2 bg-red-900/10 rounded-lg border border-red-500/20">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-red-200">{risk.factor}</p>
                      <span className={`text-xs font-bold ${getSeverityColor(risk.severity)}`}>{risk.severity}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">↳ {risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
              <h4 className="text-base font-bold text-green-300 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Recommendations
              </h4>
              <div className="space-y-2">
                {data.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-green-200">
                    <ArrowRight className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                <p className="text-xs text-emerald-400 font-semibold">Recommended Entry Strategy</p>
                <p className="text-sm text-emerald-200 mt-1">{selectedState.recommendedEntry}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-emerald-500/30 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-emerald-300">Market Entry Simulator</h3>
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="px-3 py-1.5 text-xs bg-emerald-600/30 hover:bg-emerald-600 rounded text-emerald-100 font-semibold flex items-center gap-1 transition-colors"
        >
          <Maximize2 size={14} /> Expand
        </button>
      </div>

      {/* Target State */}
      <div className="bg-black/40 rounded-lg p-3 border border-emerald-500/20 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-emerald-400 font-semibold">Target Market</p>
            <p className="text-xl font-bold text-emerald-300">{data.targetState.name}</p>
            <p className="text-xs text-gray-400">{data.targetState.tier} | Market: ₹{(data.targetState.marketSize / 100).toFixed(0)}Cr</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-400 font-semibold">Success Rate</p>
            <p className="text-2xl font-bold text-green-300">{data.successProbability}%</p>
          </div>
        </div>
      </div>

      {/* Mini Charts */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/40 rounded-lg p-2 border border-blue-500/20">
          <p className="text-xs text-blue-400 font-semibold mb-1">Investment</p>
          <p className="text-lg font-bold text-blue-300">₹{(data.investmentRequired.min / 100000).toFixed(0)}L</p>
        </div>
        <div className="bg-black/40 rounded-lg p-2 border border-yellow-500/20">
          <p className="text-xs text-yellow-400 font-semibold mb-1">Break Even</p>
          <p className="text-lg font-bold text-yellow-300">{data.breakEvenMonths} mo</p>
        </div>
      </div>

      <ROIChart height={120} />
    </motion.div>
  );
};

export default MarketEntrySimulator;
