'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Users, DollarSign, Maximize2, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface FundingMetrics {
  revenueGrowth: number; // 0-100
  marketSize: number; // 0-100
  teamStrength: number; // 0-100
  productMarketFit: number; // 0-100
  unitEconomics: number; // 0-100
  competitiveAdvantage: number; // 0-100
  scalability: number; // 0-100
  financialHealth: number; // 0-100
}

interface FundingReadinessData {
  overallScore: number;
  fundingStage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+';
  metrics: FundingMetrics;
  strengths: string[];
  improvements: string[];
  estimatedValuation: { min: number; max: number };
  investorMatch: Array<{ name: string; fit: number; focus: string }>;
  recommendations: string[];
}

interface FundingReadinessProps {
  data: FundingReadinessData;
  onRefresh?: () => void;
}

const FundingReadinessScore: React.FC<FundingReadinessProps> = ({ data, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);

  const radarData = useMemo(() => [
    { metric: 'Revenue Growth', value: data.metrics.revenueGrowth, fullMark: 100 },
    { metric: 'Market Size', value: data.metrics.marketSize, fullMark: 100 },
    { metric: 'Team', value: data.metrics.teamStrength, fullMark: 100 },
    { metric: 'PMF', value: data.metrics.productMarketFit, fullMark: 100 },
    { metric: 'Unit Economics', value: data.metrics.unitEconomics, fullMark: 100 },
    { metric: 'Moat', value: data.metrics.competitiveAdvantage, fullMark: 100 },
    { metric: 'Scalability', value: data.metrics.scalability, fullMark: 100 },
    { metric: 'Financial Health', value: data.metrics.financialHealth, fullMark: 100 },
  ], [data.metrics]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const ChartContent = ({ height = 250 }: { height?: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={radarData}>
        <PolarGrid stroke="#334155" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: '#94A3B8', fontSize: expanded ? 12 : 10 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
        <Radar name="Your Score" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} strokeWidth={2} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: '1px solid #8B5CF6',
            borderRadius: '8px',
            color: '#C4B5FD',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );

  // Expanded Modal
  if (expanded) {
    return (
      <>
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg" onClick={() => setExpanded(false)} />
        <div
          className="fixed z-[10000] bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl flex flex-col overflow-y-auto"
          style={{ top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', width: '90vw', height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
                <Target className="w-7 h-7" />
                Funding Readiness Score
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Ready for: <span className="text-purple-400 font-bold">{data.fundingStage}</span> |
                Est. Valuation: <span className="text-green-400 font-bold">₹{(data.estimatedValuation.min / 10000000).toFixed(1)}Cr - ₹{(data.estimatedValuation.max / 10000000).toFixed(1)}Cr</span>
              </p>
            </div>
            <div className="flex gap-3">
              {onRefresh && (
                <button onClick={onRefresh} className="px-4 py-3 text-sm font-bold bg-purple-600/50 hover:bg-purple-600 rounded-lg border border-purple-400/30 text-purple-100 transition-all">
                  Recalculate
                </button>
              )}
              <button onClick={() => setExpanded(false)} className="px-6 py-3 text-base bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-bold flex items-center gap-2">
                <X size={20} /> Close
              </button>
            </div>
          </div>

          {/* Main Score */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30 col-span-1">
              <p className="text-sm text-purple-400 font-semibold mb-2">Overall Score</p>
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#334155" strokeWidth="8" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    stroke={data.overallScore >= 70 ? '#10B981' : data.overallScore >= 50 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${data.overallScore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-black ${getScoreColor(data.overallScore)}`}>{data.overallScore}</span>
                </div>
              </div>
              <p className="text-center text-xs text-purple-400/60 mt-2">out of 100</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-green-400 font-semibold">Funding Stage</p>
              <p className="text-2xl font-bold text-green-300 mt-2">{data.fundingStage}</p>
              <p className="text-xs text-green-400/60 mt-1">recommended round</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-blue-400 font-semibold">Min Valuation</p>
              <p className="text-2xl font-bold text-blue-300 mt-2">₹{(data.estimatedValuation.min / 10000000).toFixed(1)}Cr</p>
              <p className="text-xs text-blue-400/60 mt-1">conservative estimate</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-orange-500/30">
              <p className="text-sm text-orange-400 font-semibold">Max Valuation</p>
              <p className="text-2xl font-bold text-orange-300 mt-2">₹{(data.estimatedValuation.max / 10000000).toFixed(1)}Cr</p>
              <p className="text-xs text-orange-400/60 mt-1">optimistic estimate</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* Radar Chart */}
            <div className="bg-black/40 rounded-xl p-4 border border-purple-500/20">
              <h4 className="text-base font-bold text-purple-300 mb-4">Investor Readiness Metrics</h4>
              <ChartContent height={300} />
            </div>

            {/* Strengths & Improvements */}
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
                <h4 className="text-base font-bold text-green-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Key Strengths
                </h4>
                <div className="space-y-2">
                  {data.strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-green-200">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20">
                <h4 className="text-base font-bold text-orange-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Areas to Improve
                </h4>
                <div className="space-y-2">
                  {data.improvements.map((improvement, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-orange-200">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      {improvement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Investor Match */}
          <div className="mt-6 bg-black/40 rounded-xl p-4 border border-purple-500/20">
            <h4 className="text-base font-bold text-purple-300 mb-4">Potential Investor Match</h4>
            <div className="grid grid-cols-3 gap-4">
              {data.investorMatch.map((investor, idx) => (
                <div key={idx} className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-purple-200">{investor.name}</p>
                    <span className={`text-sm font-bold ${getScoreColor(investor.fit)}`}>{investor.fit}% fit</span>
                  </div>
                  <p className="text-xs text-purple-400/60 mt-1">{investor.focus}</p>
                </div>
              ))}
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
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-purple-500/30 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-purple-300">Funding Readiness Score</h3>
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="px-3 py-1.5 text-xs bg-purple-600/30 hover:bg-purple-600 rounded text-purple-100 font-semibold flex items-center gap-1 transition-colors"
        >
          <Maximize2 size={14} /> Expand
        </button>
      </div>

      {/* Score Display */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="#334155" strokeWidth="6" fill="none" />
            <circle
              cx="32" cy="32" r="28"
              stroke={data.overallScore >= 70 ? '#10B981' : data.overallScore >= 50 ? '#F59E0B' : '#EF4444'}
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${data.overallScore * 1.76} 176`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-black ${getScoreColor(data.overallScore)}`}>{data.overallScore}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-purple-400 font-semibold">Ready for</p>
          <p className="text-xl font-bold text-purple-300">{data.fundingStage}</p>
        </div>
      </div>

      {/* Mini Radar */}
      <ChartContent height={150} />

      {/* Valuation Range */}
      <div className="mt-4 p-3 bg-black/40 rounded-lg border border-purple-500/20">
        <p className="text-xs text-purple-400 font-semibold mb-1">Estimated Valuation Range</p>
        <p className="text-lg font-bold text-purple-300">
          ₹{(data.estimatedValuation.min / 10000000).toFixed(1)}Cr - ₹{(data.estimatedValuation.max / 10000000).toFixed(1)}Cr
        </p>
      </div>
    </motion.div>
  );
};

export default FundingReadinessScore;
