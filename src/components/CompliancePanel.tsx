'use client';

import React, { useState } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Shield, Calculator, AlertTriangle, FileText, Bell, Download, CheckCircle, IndianRupee } from 'lucide-react';

export default function CompliancePanel() {
  const [gstTurnover, setGstTurnover] = useState<number>(0);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [itcJson, setItcJson] = useState('');
  const [tdsVendor, setTdsVendor] = useState('');
  const [tdsAmount, setTdsAmount] = useState('');
  const [tdsDue, setTdsDue] = useState('');
  const [gstCalculated, setGstCalculated] = useState<{ gst: number; total: number } | null>(null);

  const checkPitfalls = () => {
    const a: string[] = [];
    if (gstTurnover > 500000 && gstTurnover < 2000000) {
      a.push('You are approaching GST registration threshold (₹20L for services, ₹40L for goods)');
    }
    if (gstTurnover >= 2000000 && gstTurnover < 4000000) {
      a.push('GST registration mandatory for services. Apply within 30 days of crossing ₹20L.');
    }
    if (gstTurnover >= 4000000) {
      a.push('GST registration mandatory. Ensure quarterly returns (GSTR-1, GSTR-3B) are filed.');
    }
    if (gstTurnover > 10000000) {
      a.push('Annual return (GSTR-9) mandatory. Consider hiring GST consultant.');
    }
    if (gstTurnover > 50000000) {
      a.push('Monthly e-invoicing mandatory. GST audit required.');
    }
    if (a.length === 0 && gstTurnover > 0) {
      a.push('No immediate compliance concerns. Continue tracking turnover.');
    }
    setAlerts(a);
  };

  const calculateGST = () => {
    const gstRate = 0.18;
    const gst = gstTurnover * gstRate;
    setGstCalculated({
      gst: Math.round(gst),
      total: Math.round(gstTurnover + gst),
    });
  };

  const generateITC = () => {
    const data = {
      suggestedClaims: [
        { invoice: 'INV-001', vendor: 'Office Supplies Ltd', amount: 12500, eligible: true, gstComponent: 1912 },
        { invoice: 'INV-002', vendor: 'Software Services', amount: 45000, eligible: true, gstComponent: 6864 },
        { invoice: 'INV-003', vendor: 'Unregistered Vendor', amount: 8000, eligible: false, gstComponent: 0 },
        { invoice: 'INV-004', vendor: 'Marketing Agency', amount: 25000, eligible: true, gstComponent: 3814 },
      ],
      totalClaimable: 12590,
      note: 'Verify all invoices with your CA. Claims subject to GSTR-2B matching.',
    };
    setItcJson(JSON.stringify(data, null, 2));
  };

  const downloadExport = () => {
    const blob = new Blob([itcJson || '{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'itc-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const scheduleTDS = () => {
    if (Number(tdsAmount) > 0 && tdsVendor) {
      useNeoBIStore.getState().scheduleTDSReminder({
        vendor: tdsVendor,
        amount: Number(tdsAmount),
        dueDate: tdsDue || new Date().toISOString().slice(0, 10),
      });
      alert(`TDS reminder scheduled for ${tdsVendor}`);
      setTdsVendor('');
      setTdsAmount('');
      setTdsDue('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="text-green-400" size={20} />
        <h3 className="text-lg font-bold text-white">Compliance & Tax</h3>
      </div>

      {/* GST Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl border border-green-500/30"
      >
        <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
          <Calculator size={16} />
          GST Calculator & Pitfall Check
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Estimated Annual Turnover (₹)</label>
            <input
              className="w-full px-3 py-2 bg-black/30 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
              type="number"
              placeholder="Enter turnover"
              value={gstTurnover || ''}
              onChange={(e) => setGstTurnover(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={checkPitfalls}
              className="flex-1 px-3 py-2 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-500/40 rounded-lg text-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <AlertTriangle size={14} />
              Check Pitfalls
            </button>
            <button
              onClick={calculateGST}
              className="flex-1 px-3 py-2 bg-green-600/40 hover:bg-green-600/60 border border-green-500/40 rounded-lg text-green-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <IndianRupee size={14} />
              Calculate GST
            </button>
          </div>

          {gstCalculated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-green-900/30 rounded-lg border border-green-500/20"
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Base Amount:</span>
                <span className="text-white">₹{gstTurnover.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">GST (18%):</span>
                <span className="text-green-400">₹{gstCalculated.gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-green-500/20 pt-1 mt-1">
                <span className="text-gray-300">Total:</span>
                <span className="text-green-300">₹{gstCalculated.total.toLocaleString('en-IN')}</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-br from-yellow-900/30 to-orange-800/20 rounded-xl border border-yellow-500/30"
        >
          <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
            <AlertTriangle size={16} />
            Compliance Alerts
          </h4>
          <ul className="space-y-2">
            {alerts.map((alert, i) => (
              <li key={i} className="text-xs text-yellow-200 flex items-start gap-2">
                <CheckCircle size={12} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                {alert}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ITC Optimizer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl border border-blue-500/30"
      >
        <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
          <FileText size={16} />
          ITC Optimizer
        </h4>
        <div className="flex gap-2 mb-3">
          <button
            onClick={generateITC}
            className="flex-1 px-3 py-2 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-500/40 rounded-lg text-blue-200 text-xs font-bold transition-all"
          >
            Run ITC Optimizer
          </button>
          <button
            onClick={downloadExport}
            disabled={!itcJson}
            className="px-3 py-2 bg-gray-600/40 hover:bg-gray-600/60 border border-gray-500/40 rounded-lg text-gray-200 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
          >
            <Download size={14} />
            Export
          </button>
        </div>
        {itcJson && (
          <pre className="text-[10px] bg-black/30 p-3 rounded-lg max-h-32 overflow-auto text-blue-200 border border-blue-500/20">
            {itcJson}
          </pre>
        )}
      </motion.div>

      {/* TDS Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl border border-purple-500/30"
      >
        <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
          <Bell size={16} />
          TDS Reminder
        </h4>
        <div className="space-y-2">
          <input
            placeholder="Vendor Name"
            value={tdsVendor}
            onChange={(e) => setTdsVendor(e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Amount (₹)"
              type="number"
              value={tdsAmount}
              onChange={(e) => setTdsAmount(e.target.value)}
              className="px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
            />
            <input
              type="date"
              value={tdsDue}
              onChange={(e) => setTdsDue(e.target.value)}
              className="px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <button
            onClick={scheduleTDS}
            disabled={!tdsVendor || !tdsAmount}
            className="w-full px-3 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 rounded-lg text-purple-200 text-xs font-bold transition-all disabled:opacity-50"
          >
            Schedule TDS Reminder
          </button>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
        <h4 className="text-xs font-bold text-gray-400 mb-2">Quick Resources</h4>
        <div className="space-y-1 text-xs">
          <a href="https://www.gst.gov.in" target="_blank" rel="noopener" className="block text-blue-400 hover:underline">
            → GST Portal
          </a>
          <a href="https://www.incometax.gov.in" target="_blank" rel="noopener" className="block text-blue-400 hover:underline">
            → Income Tax Portal
          </a>
          <a href="https://www.mca.gov.in" target="_blank" rel="noopener" className="block text-blue-400 hover:underline">
            → MCA (Company Registration)
          </a>
        </div>
      </div>
    </div>
  );
}

export { CompliancePanel };
