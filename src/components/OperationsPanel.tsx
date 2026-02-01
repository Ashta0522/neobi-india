'use client';

import React from 'react';
import { useNeoBIStore } from '@/lib/store';
import { ChevronRight, AlertCircle, CheckCircle, Calendar, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateOperationalMetrics } from '@/utils/simulationEngine';

export const OperationsPanel: React.FC = () => {
  const { profile, selectedPath } = useNeoBIStore();

  if (!profile || !selectedPath) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">⚙️</div>
          <p className="text-sm text-gray-400">Select a decision path</p>
        </div>
      </div>
    );
  }

  const ops = generateOperationalMetrics(profile);

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto">
      {/* Hiring */}
      <div className="glass p-4">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Users size={16} className="text-agents-operations" />
          Hiring Plan ({ops.hiring.required} roles)
        </h4>
        <div className="space-y-2 text-xs">
          {Object.entries(ops.hiring.timeline).map(([role, timeline]) => (
            <div key={role} className="border-l-2 border-agents-operations pl-3">
              <p className="font-bold">{role}</p>
              <p className="text-gray-400 text-xs">
                {new Date(timeline.start).toLocaleDateString()} → {new Date(timeline.end).toLocaleDateString()}
              </p>
              <p className="text-agents-growth font-bold">
                ₹{(timeline.cost / 100000).toFixed(1)}L
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 p-2 bg-green-500/10 rounded text-xs text-green-400 font-bold">
          Estimated Savings: ₹{(ops.hiring.estimatedSavings / 100000).toFixed(1)}L
        </div>
      </div>

      {/* Inventory */}
      <div className="glass p-4">
        <h4 className="text-sm font-bold mb-3">📦 Inventory Health</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Current Level</span>
            <span className="font-bold">{ops.inventory.currentLevel} units</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Reorder Point</span>
            <span className="font-bold text-agents-operations">{ops.inventory.reorderPoint}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Safety Stock</span>
            <span className="font-bold">{ops.inventory.safetyStock}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Turnover Ratio</span>
            <span className="font-bold text-agents-growth">{ops.inventory.turnoverRatio.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Suppliers */}
      <div className="glass p-4">
        <h4 className="text-sm font-bold mb-3">🤝 Supplier Scorecard</h4>
        <div className="space-y-2">
          {ops.suppliers.map((supplier, idx) => (
            <div key={idx} className="p-2 bg-white/5 rounded text-xs space-y-1">
              <p className="font-bold text-agents-growth">{supplier.name}</p>
              <div className="flex justify-between">
                <span className="text-gray-400">Reliability</span>
                <span className="font-bold">{supplier.reliability}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lead Time</span>
                <span className="font-bold">{supplier.leadTime}d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Negotiation Potential</span>
                <span className="font-bold text-agents-growth">+{supplier.negotiationPotential}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance */}
      <div className="glass p-4">
        <h4 className="text-sm font-bold mb-3">✅ Compliance Status</h4>
        <div className="space-y-2 text-xs">
          {[
            { name: 'GST', status: ops.compliance.gst },
            { name: 'DPDP', status: ops.compliance.dpdp },
            { name: 'UPI', status: ops.compliance.upi },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              {item.status ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <AlertCircle size={16} className="text-red-400" />
              )}
              <span className="font-bold">{item.name}</span>
              <span className={item.status ? 'text-green-400' : 'text-red-400'}>
                {item.status ? 'Compliant' : 'Action Required'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
