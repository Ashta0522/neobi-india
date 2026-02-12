'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle, Maximize2, X, ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, BarChart, Bar } from 'recharts';

interface CashFlowPeriod {
  period: string; // "Mar 2026", "Apr 2026", etc.
  inflow: number;
  outflow: number;
  netFlow: number;
  balance: number;
  predicted: boolean;
}

interface CashFlowCategory {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface CashFlowData {
  currentBalance: number;
  projectedBalance30: number;
  projectedBalance60: number;
  projectedBalance90: number;
  burnRate: number;
  runway: number; // months
  cashFlowHistory: CashFlowPeriod[];
  inflowCategories: CashFlowCategory[];
  outflowCategories: CashFlowCategory[];
  alerts: Array<{ type: 'warning' | 'danger' | 'info'; message: string; date?: string }>;
  recommendations: string[];
}

interface CashFlowProps {
  data: CashFlowData;
  onRefresh?: () => void;
}

const CashFlowPredictor: React.FC<CashFlowProps> = ({ data, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'flow' | 'balance'>('flow');

  const chartData = useMemo(() =>
    data.cashFlowHistory.map(p => ({
      ...p,
      displayPeriod: p.period,
    })),
    [data.cashFlowHistory]
  );

  const categoryChartData = useMemo(() => [
    ...data.inflowCategories.map(c => ({ category: c.category, amount: c.amount, type: 'inflow' })),
  ], [data.inflowCategories]);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-red-900/20 border-red-500/30 text-red-300';
      case 'warning': return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300';
      default: return 'bg-blue-900/20 border-blue-500/30 text-blue-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-3 h-3 text-green-400" />;
      case 'down': return <ArrowDown className="w-3 h-3 text-red-400" />;
      default: return <span className="w-3 h-3 text-gray-400">—</span>;
    }
  };

  const FlowChart = ({ height = 250 }: { height?: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="displayPeriod" stroke="#94A3B8" tick={{ fontSize: expanded ? 12 : 9 }} />
        <YAxis stroke="#94A3B8" tick={{ fontSize: expanded ? 12 : 9 }} width={expanded ? 60 : 50} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: '1px solid #6366F1',
            borderRadius: '8px',
            color: '#A5B4FC',
          }}
          formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, '']}
        />
        <Legend wrapperStyle={{ fontSize: expanded ? 12 : 10 }} />
        <ReferenceLine y={0} stroke="#64748B" strokeDasharray="3 3" />
        <Area type="monotone" dataKey="inflow" stroke="#10B981" fill="url(#colorInflow)" name="Cash Inflow" strokeWidth={2} />
        <Area type="monotone" dataKey="outflow" stroke="#EF4444" fill="url(#colorOutflow)" name="Cash Outflow" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );

  const BalanceChart = ({ height = 250 }: { height?: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="displayPeriod" stroke="#94A3B8" tick={{ fontSize: expanded ? 12 : 9 }} />
        <YAxis stroke="#94A3B8" tick={{ fontSize: expanded ? 12 : 9 }} width={expanded ? 60 : 50} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: '1px solid #6366F1',
            borderRadius: '8px',
            color: '#A5B4FC',
          }}
          formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, '']}
        />
        <Legend wrapperStyle={{ fontSize: expanded ? 12 : 10 }} />
        <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="5 5" label={expanded ? { value: 'Zero Balance', fill: '#EF4444' } : undefined} />
        <Area type="monotone" dataKey="balance" stroke="#6366F1" fill="url(#colorBalance)" name="Cash Balance" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );

  // Expanded Modal
  if (expanded) {
    return (
      <>
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg" onClick={() => setExpanded(false)} />
        <div
          className="fixed z-[10000] bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl flex flex-col overflow-y-auto"
          style={{ top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', width: '90vw', height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-indigo-300 flex items-center gap-2">
                <Wallet className="w-7 h-7" />
                Cash Flow Predictor
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Current Balance: <span className="text-green-400 font-bold">₹{(data.currentBalance / 100000).toFixed(1)}L</span> |
                Runway: <span className={`font-bold ${data.runway >= 6 ? 'text-green-400' : data.runway >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>{data.runway} months</span>
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex rounded-lg overflow-hidden border border-indigo-500/30">
                <button
                  onClick={() => setViewMode('flow')}
                  className={`px-4 py-2 text-sm font-semibold ${viewMode === 'flow' ? 'bg-indigo-600 text-white' : 'bg-black/40 text-indigo-300'}`}
                >
                  Cash Flow
                </button>
                <button
                  onClick={() => setViewMode('balance')}
                  className={`px-4 py-2 text-sm font-semibold ${viewMode === 'balance' ? 'bg-indigo-600 text-white' : 'bg-black/40 text-indigo-300'}`}
                >
                  Balance
                </button>
              </div>
              {onRefresh && (
                <button onClick={onRefresh} className="px-4 py-3 text-sm font-bold bg-indigo-600/50 hover:bg-indigo-600 rounded-lg border border-indigo-400/30 text-indigo-100 transition-all">
                  Refresh
                </button>
              )}
              <button onClick={() => setExpanded(false)} className="px-6 py-3 text-base bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-bold flex items-center gap-2">
                <X size={20} /> Close
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-green-400 font-semibold">Current Balance</p>
              <p className="text-2xl font-bold text-green-300">₹{(data.currentBalance / 100000).toFixed(1)}L</p>
              <p className="text-xs text-green-400/60">available cash</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-blue-400 font-semibold">30-Day Projection</p>
              <p className="text-2xl font-bold text-blue-300">₹{(data.projectedBalance30 / 100000).toFixed(1)}L</p>
              <p className="text-xs text-blue-400/60">{data.projectedBalance30 > data.currentBalance ? '+' : ''}{(((data.projectedBalance30 - data.currentBalance) / data.currentBalance) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
              <p className="text-sm text-purple-400 font-semibold">60-Day Projection</p>
              <p className="text-2xl font-bold text-purple-300">₹{(data.projectedBalance60 / 100000).toFixed(1)}L</p>
              <p className="text-xs text-purple-400/60">{data.projectedBalance60 > data.currentBalance ? '+' : ''}{(((data.projectedBalance60 - data.currentBalance) / data.currentBalance) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-orange-500/30">
              <p className="text-sm text-orange-400 font-semibold">90-Day Projection</p>
              <p className="text-2xl font-bold text-orange-300">₹{(data.projectedBalance90 / 100000).toFixed(1)}L</p>
              <p className="text-xs text-orange-400/60">{data.projectedBalance90 > data.currentBalance ? '+' : ''}{(((data.projectedBalance90 - data.currentBalance) / data.currentBalance) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-red-500/30">
              <p className="text-sm text-red-400 font-semibold">Monthly Burn</p>
              <p className="text-2xl font-bold text-red-300">₹{(data.burnRate / 100000).toFixed(1)}L</p>
              <p className="text-xs text-red-400/60">{data.runway} mo runway</p>
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-black/40 rounded-xl p-4 border border-indigo-500/20 mb-6">
            <h4 className="text-base font-bold text-indigo-300 mb-4">
              {viewMode === 'flow' ? 'Cash Inflow vs Outflow' : 'Projected Cash Balance'}
            </h4>
            {viewMode === 'flow' ? <FlowChart height={300} /> : <BalanceChart height={300} />}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Inflow Categories */}
            <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
              <h4 className="text-base font-bold text-green-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Inflow Sources
              </h4>
              <div className="space-y-2">
                {data.inflowCategories.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-green-900/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(cat.trend)}
                      <span className="text-sm text-green-200">{cat.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-300">₹{(cat.amount / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-green-400/60">{cat.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outflow Categories */}
            <div className="bg-black/40 rounded-xl p-4 border border-red-500/20">
              <h4 className="text-base font-bold text-red-300 mb-3 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" /> Outflow Categories
              </h4>
              <div className="space-y-2">
                {data.outflowCategories.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-red-900/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(cat.trend)}
                      <span className="text-sm text-red-200">{cat.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-300">₹{(cat.amount / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-red-400/60">{cat.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts & Recommendations */}
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-4 border border-yellow-500/20">
                <h4 className="text-base font-bold text-yellow-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Alerts
                </h4>
                <div className="space-y-2">
                  {data.alerts.map((alert, idx) => (
                    <div key={idx} className={`p-2 rounded-lg border ${getAlertColor(alert.type)}`}>
                      <p className="text-xs">{alert.message}</p>
                      {alert.date && <p className="text-xs opacity-60 mt-1">{alert.date}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-indigo-500/20">
                <h4 className="text-sm font-bold text-indigo-300 mb-2">Recommendations</h4>
                <ul className="space-y-1 text-xs text-indigo-200">
                  {data.recommendations.map((rec, idx) => (
                    <li key={idx}>• {rec}</li>
                  ))}
                </ul>
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
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-indigo-500/30 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-indigo-300">Cash Flow Predictor</h3>
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="px-3 py-1.5 text-xs bg-indigo-600/30 hover:bg-indigo-600 rounded text-indigo-100 font-semibold flex items-center gap-1 transition-colors"
        >
          <Maximize2 size={14} /> Expand
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/40 rounded-lg p-3 border border-green-500/20">
          <p className="text-xs text-green-400 font-semibold">Current Balance</p>
          <p className="text-xl font-bold text-green-300">₹{(data.currentBalance / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-black/40 rounded-lg p-3 border border-red-500/20">
          <p className="text-xs text-red-400 font-semibold">Runway</p>
          <p className={`text-xl font-bold ${data.runway >= 6 ? 'text-green-300' : data.runway >= 3 ? 'text-yellow-300' : 'text-red-300'}`}>
            {data.runway} months
          </p>
        </div>
      </div>

      {/* Mini Chart */}
      <BalanceChart height={120} />

      {/* Top Alert */}
      {data.alerts.length > 0 && (
        <div className={`mt-4 p-2 rounded-lg border ${getAlertColor(data.alerts[0].type)}`}>
          <p className="text-xs flex items-center gap-1">
            <AlertTriangle size={12} /> {data.alerts[0].message}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CashFlowPredictor;
