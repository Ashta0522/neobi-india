'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle, Clock, Maximize2, X, IndianRupee } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface GSTComplianceData {
  gstNumber: string;
  filingStatus: 'compliant' | 'pending' | 'overdue';
  lastFiledDate: string;
  nextDueDate: string;
  pendingReturns: Array<{
    type: string;
    period: string;
    dueDate: string;
    status: 'filed' | 'pending' | 'overdue';
    penalty?: number;
  }>;
  complianceScore: number;
  totalTaxLiability: number;
  inputTaxCredit: number;
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
  }>;
}

interface GSTComplianceProps {
  data: GSTComplianceData;
  onRefresh?: () => void;
}

const GSTComplianceChecker: React.FC<GSTComplianceProps> = ({ data, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);

  const complianceData = useMemo(() => [
    { name: 'Filed', value: data.pendingReturns.filter(r => r.status === 'filed').length, color: '#10B981' },
    { name: 'Pending', value: data.pendingReturns.filter(r => r.status === 'pending').length, color: '#F59E0B' },
    { name: 'Overdue', value: data.pendingReturns.filter(r => r.status === 'overdue').length, color: '#EF4444' },
  ], [data.pendingReturns]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filed': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'overdue': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  const ChartContent = ({ size = 120 }: { size?: number }) => (
    <ResponsiveContainer width="100%" height={size}>
      <PieChart>
        <Pie
          data={complianceData}
          cx="50%"
          cy="50%"
          innerRadius={size * 0.25}
          outerRadius={size * 0.4}
          paddingAngle={5}
          dataKey="value"
        >
          {complianceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: '1px solid #6366F1',
            borderRadius: '8px',
            color: '#A5B4FC',
          }}
        />
        <Legend wrapperStyle={{ fontSize: expanded ? 14 : 11 }} />
      </PieChart>
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
                <FileText className="w-7 h-7" />
                GST Compliance Checker
              </h3>
              <p className="text-sm text-gray-400 mt-1">GSTIN: {data.gstNumber} | Compliance Score: {data.complianceScore}%</p>
            </div>
            <div className="flex gap-3">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="px-4 py-3 text-sm font-bold bg-indigo-600/50 hover:bg-indigo-600 rounded-lg border border-indigo-400/30 text-indigo-100 transition-all"
                >
                  Refresh Data
                </button>
              )}
              <button onClick={() => setExpanded(false)} className="px-6 py-3 text-base bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-bold flex items-center gap-2">
                <X size={20} /> Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-black/40 rounded-lg p-4 border border-indigo-500/30">
              <p className="text-sm text-indigo-400 font-semibold">Compliance Score</p>
              <p className="text-3xl font-bold text-indigo-300">{data.complianceScore}%</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${data.complianceScore}%` }} />
              </div>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-green-400 font-semibold">Input Tax Credit</p>
              <p className="text-3xl font-bold text-green-300">₹{(data.inputTaxCredit / 100000).toFixed(1)}L</p>
              <p className="text-xs text-green-400/60">available credit</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-orange-500/30">
              <p className="text-sm text-orange-400 font-semibold">Tax Liability</p>
              <p className="text-3xl font-bold text-orange-300">₹{(data.totalTaxLiability / 100000).toFixed(1)}L</p>
              <p className="text-xs text-orange-400/60">pending payment</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-blue-400 font-semibold">Next Due Date</p>
              <p className="text-2xl font-bold text-blue-300">{data.nextDueDate}</p>
              <p className="text-xs text-blue-400/60">upcoming filing</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* Returns Status */}
            <div className="bg-black/40 rounded-xl p-4 border border-indigo-500/20">
              <h4 className="text-base font-bold text-indigo-300 mb-4">Filing Status by Return Type</h4>
              <ChartContent size={200} />
              <div className="space-y-2 mt-4">
                {data.pendingReturns.map((ret, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(ret.status)}`}>
                        {ret.type}
                      </span>
                      <span className="text-sm text-gray-300">{ret.period}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">Due: {ret.dueDate}</span>
                      {ret.penalty && ret.penalty > 0 && (
                        <span className="text-xs text-red-400">Penalty: ₹{ret.penalty}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts & Recommendations */}
            <div className="bg-black/40 rounded-xl p-4 border border-indigo-500/20">
              <h4 className="text-base font-bold text-indigo-300 mb-4">Alerts & Recommendations</h4>
              <div className="space-y-3">
                {data.alerts.map((alert, idx) => (
                  <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg ${
                    alert.type === 'error' ? 'bg-red-900/20 border border-red-500/30' :
                    alert.type === 'warning' ? 'bg-yellow-900/20 border border-yellow-500/30' :
                    'bg-blue-900/20 border border-blue-500/30'
                  }`}>
                    {getAlertIcon(alert.type)}
                    <span className="text-sm text-gray-300">{alert.message}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
                <h5 className="font-bold text-indigo-300 mb-2">Quick Actions</h5>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-indigo-600/50 hover:bg-indigo-600 rounded-lg text-sm text-white font-semibold transition-colors">
                    File GSTR-3B for Current Month
                  </button>
                  <button className="w-full px-4 py-2 bg-green-600/50 hover:bg-green-600 rounded-lg text-sm text-white font-semibold transition-colors">
                    Download ITC Statement
                  </button>
                  <button className="w-full px-4 py-2 bg-orange-600/50 hover:bg-orange-600 rounded-lg text-sm text-white font-semibold transition-colors">
                    Pay Pending Tax Liability
                  </button>
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
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-indigo-500/30 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-indigo-300">GST Compliance Checker</h3>
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="px-3 py-1.5 text-xs bg-indigo-600/30 hover:bg-indigo-600 rounded text-indigo-100 font-semibold flex items-center gap-1 transition-colors"
        >
          <Maximize2 size={14} /> Expand
        </button>
      </div>

      {/* Compliance Score */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/40 rounded-lg p-3 border border-indigo-500/20">
          <p className="text-xs text-indigo-400 font-semibold">Compliance Score</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-indigo-300">{data.complianceScore}%</p>
            <div className="flex-1">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${data.complianceScore >= 80 ? 'bg-green-500' : data.complianceScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${data.complianceScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black/40 rounded-lg p-3 border border-indigo-500/20">
          <p className="text-xs text-indigo-400 font-semibold">Next Filing Due</p>
          <p className="text-xl font-bold text-indigo-300 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {data.nextDueDate}
          </p>
        </div>
      </div>

      {/* Mini Chart */}
      <ChartContent size={120} />

      {/* Alerts Preview */}
      <div className="mt-4 space-y-2">
        {data.alerts.slice(0, 2).map((alert, idx) => (
          <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
            alert.type === 'error' ? 'bg-red-900/20 text-red-300' :
            alert.type === 'warning' ? 'bg-yellow-900/20 text-yellow-300' :
            'bg-blue-900/20 text-blue-300'
          }`}>
            {getAlertIcon(alert.type)}
            <span className="truncate">{alert.message}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GSTComplianceChecker;
