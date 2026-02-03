'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Truck, AlertTriangle, MapPin, Shield, Maximize2, X } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ZAxis } from 'recharts';

interface Supplier {
  id: string;
  name: string;
  location: string;
  state: string;
  riskScore: number; // 0-100 (higher = more risky)
  reliabilityScore: number; // 0-100
  leadTime: number; // days
  costIndex: number; // relative cost 0-100
  category: string;
  dependencies: number;
  lastDeliveryStatus: 'on-time' | 'delayed' | 'failed';
  alerts: string[];
}

interface SupplierRiskData {
  suppliers: Supplier[];
  overallRiskScore: number;
  highRiskCount: number;
  avgLeadTime: number;
  topRisks: Array<{ risk: string; impact: string; mitigation: string }>;
  alternativeSuppliers: Array<{ name: string; state: string; riskScore: number }>;
}

interface SupplierRiskProps {
  data: SupplierRiskData;
  onSelectSupplier?: (supplier: Supplier) => void;
}

const SupplierRiskMap: React.FC<SupplierRiskProps> = ({ data, onSelectSupplier }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const scatterData = useMemo(() =>
    data.suppliers.map(s => ({
      name: s.name,
      x: s.reliabilityScore,
      y: s.riskScore,
      z: s.dependencies * 10,
      category: s.category,
      original: s,
    })),
    [data.suppliers]
  );

  const getRiskColor = (score: number) => {
    if (score >= 70) return '#EF4444';
    if (score >= 40) return '#F59E0B';
    return '#10B981';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'text-green-400 bg-green-500/20';
      case 'delayed': return 'text-yellow-400 bg-yellow-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const ChartContent = ({ height = 250 }: { height?: number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          type="number"
          dataKey="x"
          name="Reliability"
          domain={[0, 100]}
          stroke="#94A3B8"
          label={expanded ? { value: 'Reliability Score %', position: 'bottom', fill: '#94A3B8' } : undefined}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Risk"
          domain={[0, 100]}
          stroke="#94A3B8"
          label={expanded ? { value: 'Risk Score %', angle: -90, position: 'insideLeft', fill: '#94A3B8' } : undefined}
        />
        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Dependencies" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: '1px solid #F97316',
            borderRadius: '8px',
            color: '#FDBA74',
          }}
          formatter={(value: number, name: string) => [
            name === 'x' ? `${value}%` : name === 'y' ? `${value}%` : value / 10,
            name === 'x' ? 'Reliability' : name === 'y' ? 'Risk' : 'Dependencies'
          ]}
          labelFormatter={(_, payload: any) => payload?.[0]?.payload?.name || ''}
        />
        <Scatter name="Suppliers" data={scatterData}>
          {scatterData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getRiskColor(entry.y)}
              cursor="pointer"
              onClick={() => {
                setSelectedSupplier(entry.original);
                if (onSelectSupplier) onSelectSupplier(entry.original);
              }}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );

  // Expanded Modal
  if (expanded) {
    return (
      <>
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg" onClick={() => setExpanded(false)} />
        <div
          className="fixed z-[10000] bg-slate-900 border border-orange-500/30 rounded-2xl p-6 shadow-2xl flex flex-col overflow-y-auto"
          style={{ top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', width: '90vw', height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-orange-300 flex items-center gap-2">
                <Truck className="w-7 h-7" />
                Supplier Risk Map
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {data.suppliers.length} suppliers | {data.highRiskCount} high risk | Avg lead time: {data.avgLeadTime} days
              </p>
            </div>
            <button onClick={() => setExpanded(false)} className="px-6 py-3 text-base bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-bold flex items-center gap-2">
              <X size={20} /> Close
            </button>
          </div>

          {/* Risk Overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-black/40 rounded-lg p-4 border border-orange-500/30">
              <p className="text-sm text-orange-400 font-semibold">Overall Risk Score</p>
              <p className="text-3xl font-bold text-orange-300">{data.overallRiskScore}%</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className={`h-2 rounded-full ${getRiskColor(data.overallRiskScore) === '#EF4444' ? 'bg-red-500' : getRiskColor(data.overallRiskScore) === '#F59E0B' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${data.overallRiskScore}%` }} />
              </div>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-red-500/30">
              <p className="text-sm text-red-400 font-semibold">High Risk Suppliers</p>
              <p className="text-3xl font-bold text-red-300">{data.highRiskCount}</p>
              <p className="text-xs text-red-400/60">need attention</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-blue-400 font-semibold">Total Suppliers</p>
              <p className="text-3xl font-bold text-blue-300">{data.suppliers.length}</p>
              <p className="text-xs text-blue-400/60">in network</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-green-400 font-semibold">Avg Lead Time</p>
              <p className="text-3xl font-bold text-green-300">{data.avgLeadTime} days</p>
              <p className="text-xs text-green-400/60">delivery time</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* Risk Scatter Plot */}
            <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20">
              <h4 className="text-base font-bold text-orange-300 mb-4">Risk vs Reliability Matrix</h4>
              <p className="text-xs text-gray-400 mb-2">Click on a supplier to view details. Bubble size = dependencies</p>
              <ChartContent height={350} />
            </div>

            {/* Supplier Details / List */}
            <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20 overflow-y-auto">
              {selectedSupplier ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-base font-bold text-orange-300">{selectedSupplier.name}</h4>
                    <button onClick={() => setSelectedSupplier(null)} className="text-xs text-gray-400 hover:text-white">
                      ← Back to list
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-black/30 rounded-lg">
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="font-semibold text-white flex items-center gap-1"><MapPin size={14} /> {selectedSupplier.location}, {selectedSupplier.state}</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg">
                      <p className="text-xs text-gray-400">Category</p>
                      <p className="font-semibold text-white">{selectedSupplier.category}</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg">
                      <p className="text-xs text-gray-400">Risk Score</p>
                      <p className={`font-bold text-lg ${selectedSupplier.riskScore >= 70 ? 'text-red-400' : selectedSupplier.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {selectedSupplier.riskScore}%
                      </p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg">
                      <p className="text-xs text-gray-400">Reliability</p>
                      <p className="font-bold text-lg text-blue-400">{selectedSupplier.reliabilityScore}%</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg">
                      <p className="text-xs text-gray-400">Lead Time</p>
                      <p className="font-semibold text-white">{selectedSupplier.leadTime} days</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg">
                      <p className="text-xs text-gray-400">Last Delivery</p>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedSupplier.lastDeliveryStatus)}`}>
                        {selectedSupplier.lastDeliveryStatus}
                      </span>
                    </div>
                  </div>
                  {selectedSupplier.alerts.length > 0 && (
                    <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                      <p className="text-sm font-bold text-red-400 mb-2 flex items-center gap-1"><AlertTriangle size={14} /> Active Alerts</p>
                      {selectedSupplier.alerts.map((alert, idx) => (
                        <p key={idx} className="text-xs text-red-200">• {alert}</p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h4 className="text-base font-bold text-orange-300 mb-4">Supplier List</h4>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {data.suppliers.map((supplier) => (
                      <div
                        key={supplier.id}
                        onClick={() => setSelectedSupplier(supplier)}
                        className="p-3 bg-black/30 rounded-lg border border-orange-500/10 hover:border-orange-500/50 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-white">{supplier.name}</p>
                            <p className="text-xs text-gray-400">{supplier.location}, {supplier.state}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${supplier.riskScore >= 70 ? 'text-red-400' : supplier.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                              {supplier.riskScore}% risk
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(supplier.lastDeliveryStatus)}`}>
                              {supplier.lastDeliveryStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Risks & Alternatives */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-black/40 rounded-xl p-4 border border-red-500/20">
              <h4 className="text-base font-bold text-red-300 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Top Supply Chain Risks
              </h4>
              <div className="space-y-3">
                {data.topRisks.map((risk, idx) => (
                  <div key={idx} className="p-3 bg-red-900/10 rounded-lg border border-red-500/20">
                    <p className="font-semibold text-red-300 text-sm">{risk.risk}</p>
                    <p className="text-xs text-gray-400 mt-1">Impact: {risk.impact}</p>
                    <p className="text-xs text-green-400 mt-1">Mitigation: {risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
              <h4 className="text-base font-bold text-green-300 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Alternative Suppliers
              </h4>
              <div className="space-y-2">
                {data.alternativeSuppliers.map((alt, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-green-900/10 rounded-lg border border-green-500/20">
                    <div>
                      <p className="font-semibold text-green-200">{alt.name}</p>
                      <p className="text-xs text-gray-400">{alt.state}</p>
                    </div>
                    <span className={`font-bold ${alt.riskScore >= 70 ? 'text-red-400' : alt.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {alt.riskScore}% risk
                    </span>
                  </div>
                ))}
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
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-orange-500/30 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-bold text-orange-300">Supplier Risk Map</h3>
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="px-3 py-1.5 text-xs bg-orange-600/30 hover:bg-orange-600 rounded text-orange-100 font-semibold flex items-center gap-1 transition-colors"
        >
          <Maximize2 size={14} /> Expand
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/40 rounded-lg p-3 border border-orange-500/20">
          <p className="text-xs text-orange-400 font-semibold">Overall Risk</p>
          <p className={`text-2xl font-bold ${data.overallRiskScore >= 70 ? 'text-red-400' : data.overallRiskScore >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
            {data.overallRiskScore}%
          </p>
        </div>
        <div className="bg-black/40 rounded-lg p-3 border border-red-500/20">
          <p className="text-xs text-red-400 font-semibold">High Risk</p>
          <p className="text-2xl font-bold text-red-300">{data.highRiskCount} suppliers</p>
        </div>
      </div>

      {/* Mini Chart */}
      <ChartContent height={150} />

      {/* Top Risk Alert */}
      {data.topRisks.length > 0 && (
        <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
          <p className="text-xs text-red-400 font-semibold flex items-center gap-1">
            <AlertTriangle size={12} /> Top Risk: {data.topRisks[0].risk}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SupplierRiskMap;
