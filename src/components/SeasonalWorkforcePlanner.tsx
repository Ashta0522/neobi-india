'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, AlertTriangle, Maximize2, X, UserPlus, UserMinus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, ReferenceLine } from 'recharts';

interface MonthlyWorkforce {
  month: string;
  currentStaff: number;
  requiredStaff: number;
  gap: number;
  seasonalFactor: number;
  festivals: string[];
}

interface RoleRequirement {
  role: string;
  current: number;
  required: number;
  gap: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  costPerMonth: number;
}

interface WorkforceData {
  currentHeadcount: number;
  recommendedHeadcount: number;
  staffingGap: number;
  monthlyBurnIncrease: number;
  seasonalPlan: MonthlyWorkforce[];
  roleRequirements: RoleRequirement[];
  hiringTimeline: Array<{ role: string; hireBy: string; count: number }>;
  costImpact: {
    currentMonthlyCost: number;
    projectedMonthlyCost: number;
    annualSavings: number;
  };
  recommendations: string[];
}

interface WorkforceProps {
  data: WorkforceData;
  onGeneratePlan?: () => void;
}

const SeasonalWorkforcePlanner: React.FC<WorkforceProps> = ({ data, onGeneratePlan }) => {
  const [expanded, setExpanded] = useState(false);

  const chartData = useMemo(() =>
    data.seasonalPlan.map(m => ({
      ...m,
      displayMonth: m.month,
    })),
    [data.seasonalPlan]
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-400 bg-red-500/20';
      case 'High': return 'text-orange-400 bg-orange-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const StaffingChart = ({ height = 250 }: { height?: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorRequired" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="displayMonth" stroke="#94A3B8" tick={{ fontSize: expanded ? 12 : 10 }} />
        <YAxis stroke="#94A3B8" tick={{ fontSize: expanded ? 12 : 10 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: '1px solid #8B5CF6',
            borderRadius: '8px',
            color: '#C4B5FD',
          }}
          labelFormatter={(label: string, payload: any[]) => {
            const festivals = payload[0]?.payload?.festivals;
            return festivals?.length > 0 ? `${label} (${festivals.join(', ')})` : label;
          }}
        />
        <Legend wrapperStyle={{ fontSize: expanded ? 12 : 10 }} />
        <Area type="monotone" dataKey="currentStaff" stroke="#6366F1" fill="url(#colorCurrent)" name="Current Staff" strokeWidth={2} />
        <Area type="monotone" dataKey="requiredStaff" stroke="#10B981" fill="url(#colorRequired)" name="Required Staff" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );

  const GapChart = ({ height = 200 }: { height?: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="displayMonth" stroke="#94A3B8" tick={{ fontSize: 10 }} />
        <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: '1px solid #F59E0B',
            borderRadius: '8px',
            color: '#FCD34D',
          }}
        />
        <ReferenceLine y={0} stroke="#64748B" />
        <Bar dataKey="gap" name="Staffing Gap">
          {chartData.map((entry, index) => (
            <rect key={index} fill={entry.gap > 0 ? '#EF4444' : entry.gap < 0 ? '#10B981' : '#64748B'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  // Expanded Modal
  if (expanded) {
    return (
      <>
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg" onClick={() => setExpanded(false)} />
        <div
          className="fixed z-[10000] bg-slate-900 border border-violet-500/30 rounded-2xl p-6 shadow-2xl flex flex-col overflow-y-auto"
          style={{ top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', width: '90vw', height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-violet-300 flex items-center gap-2">
                <Users className="w-7 h-7" />
                Seasonal Workforce Planner
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Current: <span className="text-blue-400 font-bold">{data.currentHeadcount}</span> |
                Recommended: <span className="text-green-400 font-bold">{data.recommendedHeadcount}</span> |
                Gap: <span className={`font-bold ${data.staffingGap > 0 ? 'text-red-400' : 'text-green-400'}`}>{data.staffingGap > 0 ? '+' : ''}{data.staffingGap}</span>
              </p>
            </div>
            <div className="flex gap-3">
              {onGeneratePlan && (
                <button onClick={onGeneratePlan} className="px-4 py-3 text-sm font-bold bg-violet-600/50 hover:bg-violet-600 rounded-lg border border-violet-400/30 text-violet-100 transition-all">
                  Generate New Plan
                </button>
              )}
              <button onClick={() => setExpanded(false)} className="px-6 py-3 text-base bg-violet-500 hover:bg-violet-600 rounded-lg text-white font-bold flex items-center gap-2">
                <X size={20} /> Close
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-blue-400 font-semibold">Current Headcount</p>
              <p className="text-3xl font-bold text-blue-300">{data.currentHeadcount}</p>
              <p className="text-xs text-blue-400/60">employees</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-green-400 font-semibold">Recommended</p>
              <p className="text-3xl font-bold text-green-300">{data.recommendedHeadcount}</p>
              <p className="text-xs text-green-400/60">optimal staffing</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-red-500/30">
              <p className="text-sm text-red-400 font-semibold">Staffing Gap</p>
              <p className={`text-3xl font-bold ${data.staffingGap > 0 ? 'text-red-300' : 'text-green-300'}`}>
                {data.staffingGap > 0 ? '+' : ''}{data.staffingGap}
              </p>
              <p className="text-xs text-red-400/60">{data.staffingGap > 0 ? 'understaffed' : 'optimal'}</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-orange-500/30">
              <p className="text-sm text-orange-400 font-semibold">Monthly Cost</p>
              <p className="text-2xl font-bold text-orange-300">₹{(data.costImpact.currentMonthlyCost / 100000).toFixed(1)}L</p>
              <p className="text-xs text-orange-400/60">current payroll</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
              <p className="text-sm text-purple-400 font-semibold">Projected Cost</p>
              <p className="text-2xl font-bold text-purple-300">₹{(data.costImpact.projectedMonthlyCost / 100000).toFixed(1)}L</p>
              <p className="text-xs text-purple-400/60">after optimization</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-black/40 rounded-xl p-4 border border-violet-500/20">
              <h4 className="text-base font-bold text-violet-300 mb-4">Staffing vs Requirements (12-Month)</h4>
              <StaffingChart height={280} />
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-violet-500/20">
              <h4 className="text-base font-bold text-violet-300 mb-4">Monthly Staffing Gap</h4>
              <GapChart height={280} />
            </div>
          </div>

          {/* Role Requirements & Hiring Timeline */}
          <div className="grid grid-cols-2 gap-6">
            {/* Role Requirements */}
            <div className="bg-black/40 rounded-xl p-4 border border-violet-500/20">
              <h4 className="text-base font-bold text-violet-300 mb-4">Role Requirements</h4>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {data.roleRequirements.map((role, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(role.priority)}`}>
                        {role.priority}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{role.role}</p>
                        <p className="text-xs text-gray-400">₹{(role.costPerMonth / 1000).toFixed(0)}K/month per person</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">{role.current}</span>
                        <span className="text-gray-500">→</span>
                        <span className="text-green-400">{role.required}</span>
                      </div>
                      <p className={`text-xs font-bold ${role.gap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {role.gap > 0 ? `+${role.gap} needed` : 'Optimal'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hiring Timeline & Recommendations */}
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
                <h4 className="text-base font-bold text-green-300 mb-3 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" /> Hiring Timeline
                </h4>
                <div className="space-y-2">
                  {data.hiringTimeline.map((hire, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-green-900/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-200">{hire.role}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-300">+{hire.count}</p>
                        <p className="text-xs text-green-400/60">by {hire.hireBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-violet-500/20">
                <h4 className="text-sm font-bold text-violet-300 mb-2">Recommendations</h4>
                <ul className="space-y-1 text-xs text-violet-200">
                  {data.recommendations.map((rec, idx) => (
                    <li key={idx}>• {rec}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-yellow-500/20">
                <h4 className="text-sm font-bold text-yellow-300 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Cost Impact
                </h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Annual Savings Potential</span>
                  <span className="text-green-400 font-bold">₹{(data.costImpact.annualSavings / 100000).toFixed(1)}L</span>
                </div>
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
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-violet-500/30 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-violet-300">Seasonal Workforce Planner</h3>
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="px-3 py-1.5 text-xs bg-violet-600/30 hover:bg-violet-600 rounded text-violet-100 font-semibold flex items-center gap-1 transition-colors"
        >
          <Maximize2 size={14} /> Expand
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-black/40 rounded-lg p-2 border border-blue-500/20 text-center">
          <p className="text-xs text-blue-400">Current</p>
          <p className="text-lg font-bold text-blue-300">{data.currentHeadcount}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-2 border border-green-500/20 text-center">
          <p className="text-xs text-green-400">Needed</p>
          <p className="text-lg font-bold text-green-300">{data.recommendedHeadcount}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-2 border border-red-500/20 text-center">
          <p className="text-xs text-red-400">Gap</p>
          <p className={`text-lg font-bold ${data.staffingGap > 0 ? 'text-red-300' : 'text-green-300'}`}>
            {data.staffingGap > 0 ? '+' : ''}{data.staffingGap}
          </p>
        </div>
      </div>

      {/* Mini Chart */}
      <StaffingChart height={120} />

      {/* Next Hire */}
      {data.hiringTimeline.length > 0 && (
        <div className="mt-4 p-2 bg-green-900/20 rounded-lg border border-green-500/20">
          <p className="text-xs text-green-400 flex items-center gap-1">
            <UserPlus size={12} />
            Next: Hire {data.hiringTimeline[0].count} {data.hiringTimeline[0].role} by {data.hiringTimeline[0].hireBy}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SeasonalWorkforcePlanner;
