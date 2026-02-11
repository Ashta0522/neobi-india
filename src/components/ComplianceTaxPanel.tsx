'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, AlertTriangle, CheckCircle, Info,
  Calendar, DollarSign, Percent, Clock,
  Download, Bell, Shield
} from 'lucide-react';

// TDS Sections and rates as per Indian tax law
const TDS_SECTIONS = {
  '194C': { name: 'Contractor Payments', rate: 0.01, threshold: 30000, description: 'Single payment or ₹1L aggregate' },
  '194J': { name: 'Professional Fees', rate: 0.10, threshold: 30000, description: 'Technical/professional services' },
  '194H': { name: 'Commission/Brokerage', rate: 0.05, threshold: 15000, description: 'Commission payments' },
  '194I': { name: 'Rent', rate: 0.10, threshold: 240000, description: 'Rent for land/building/machinery' },
  '194A': { name: 'Interest (Non-Bank)', rate: 0.10, threshold: 5000, description: 'Interest other than securities' },
  '194Q': { name: 'Purchase of Goods', rate: 0.001, threshold: 5000000, description: 'Purchase exceeding ₹50L' },
} as const;

type TDSSection = keyof typeof TDS_SECTIONS;

interface TDSCalculation {
  section: TDSSection;
  amount: number;
  tdsAmount: number;
  netPayable: number;
  threshold: number;
  isApplicable: boolean;
}

// Memoized TDS Section Card
const TDSSectionCard = memo(function TDSSectionCard({
  section,
  info,
  isSelected,
  onSelect,
}: {
  section: TDSSection;
  info: typeof TDS_SECTIONS[TDSSection];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      className={`p-3 rounded-lg border text-left transition-all ${
        isSelected
          ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20'
          : 'bg-slate-800/50 border-white/10 hover:border-amber-500/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-gray-400'}`}>
          {section}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${isSelected ? 'bg-amber-500 text-black' : 'bg-white/10'}`}>
          {(info.rate * 100).toFixed(1)}%
        </span>
      </div>
      <div className="text-sm font-semibold text-white">{info.name}</div>
      <div className="text-[10px] text-gray-500 mt-1">
        Threshold: ₹{info.threshold.toLocaleString()}
      </div>
    </motion.button>
  );
});

// ITC Summary Component
const ITCSummary = memo(function ITCSummary({
  invoices,
  computeITC,
}: {
  invoices: any[];
  computeITC: (invoices: any[]) => { suggestedClaim: number; issues: string[] };
}) {
  const itcResult = useMemo(() => computeITC(invoices), [invoices, computeITC]);

  return (
    <div className="p-4 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-green-400" />
        <h4 className="font-bold text-green-400">ITC Optimization</h4>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="p-3 bg-black/30 rounded-lg">
          <div className="text-[10px] text-gray-400">Suggested Claim</div>
          <div className="text-xl font-bold text-green-400">
            ₹{itcResult.suggestedClaim.toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-black/30 rounded-lg">
          <div className="text-[10px] text-gray-400">Eligible Invoices</div>
          <div className="text-xl font-bold text-white">
            {invoices.filter(i => i.itcEligibleAmount).length}
          </div>
        </div>
      </div>

      {itcResult.issues.length > 0 && (
        <div className="p-2 bg-amber-500/10 rounded border border-amber-500/30">
          <div className="text-[10px] font-semibold text-amber-400 mb-1 flex items-center gap-1">
            <AlertTriangle size={10} /> Issues Found
          </div>
          <ul className="text-[10px] text-amber-200/80 space-y-0.5">
            {itcResult.issues.slice(0, 3).map((issue, i) => (
              <li key={i}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export const ComplianceTaxPanel: React.FC = memo(function ComplianceTaxPanel() {
  const { computeITC, scheduleTDSReminder, tdsReminders } = useNeoBIStore();

  // State
  const [selectedSection, setSelectedSection] = useState<TDSSection>('194C');
  const [paymentAmount, setPaymentAmount] = useState<number>(500000);
  const [vendorName, setVendorName] = useState<string>('');
  const [hasPAN, setHasPAN] = useState<boolean>(true);
  const [showReminders, setShowReminders] = useState<boolean>(false);

  // Sample invoices for ITC
  const [sampleInvoices] = useState([
    { id: 'inv-1', amount: 100000, itcEligibleAmount: 18000, vendor: 'Vendor A', vendorGst: '27AABCU9603R1ZM', invoiceDate: '2026-01-15' },
    { id: 'inv-2', amount: 50000, itcEligibleAmount: 9000, vendor: 'Vendor B', vendorGst: '29AABCT1234R1ZP', invoiceDate: '2026-01-20' },
    { id: 'inv-3', amount: 75000, itcEligibleAmount: 13500, vendor: 'Vendor C', invoiceDate: '2026-01-25' },
  ]);

  // Calculate TDS
  const tdsCalculation = useMemo((): TDSCalculation => {
    const section = TDS_SECTIONS[selectedSection];
    const effectiveRate = hasPAN ? section.rate : 0.20; // 20% if no PAN
    const isApplicable = paymentAmount >= section.threshold;
    const tdsAmount = isApplicable ? Math.round(paymentAmount * effectiveRate) : 0;

    return {
      section: selectedSection,
      amount: paymentAmount,
      tdsAmount,
      netPayable: paymentAmount - tdsAmount,
      threshold: section.threshold,
      isApplicable,
    };
  }, [selectedSection, paymentAmount, hasPAN]);

  // Handle reminder scheduling
  const handleScheduleReminder = useCallback(() => {
    if (!vendorName) {
      alert('Please enter vendor name');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(7); // 7th of next month
    if (dueDate <= new Date()) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    scheduleTDSReminder({
      vendor: vendorName,
      amount: tdsCalculation.tdsAmount,
      dueDate: dueDate.toISOString(),
    });

    alert(`TDS reminder scheduled for ${dueDate.toLocaleDateString()}`);
  }, [vendorName, tdsCalculation.tdsAmount, scheduleTDSReminder]);

  return (
    <div className="bg-slate-900/50 rounded-xl border border-amber-500/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white">Compliance & Tax Center</h3>
          </div>
          <motion.button
            onClick={() => setShowReminders(!showReminders)}
            className="relative p-2 hover:bg-white/10 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Bell size={16} className="text-amber-400" />
            {tdsReminders.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {tdsReminders.length}
              </span>
            )}
          </motion.button>
        </div>
        <p className="text-xs text-gray-400 mt-1">TDS Calculator, ITC Optimizer & Compliance Tracker</p>
      </div>

      {/* Reminders Dropdown */}
      <AnimatePresence>
        {showReminders && tdsReminders.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/10 bg-slate-800/50"
          >
            <div className="p-3 space-y-2">
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <Clock size={12} /> Upcoming TDS Deadlines
              </div>
              {tdsReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-2 bg-black/30 rounded text-xs">
                  <span className="text-white">{reminder.vendor}</span>
                  <span className="text-amber-400">₹{reminder.amount.toLocaleString()}</span>
                  <span className="text-gray-400">{new Date(reminder.dueDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 space-y-4">
        {/* TDS Section Selection */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-2 block">Select TDS Section</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(TDS_SECTIONS) as [TDSSection, typeof TDS_SECTIONS[TDSSection]][]).slice(0, 4).map(([section, info]) => (
              <TDSSectionCard
                key={section}
                section={section}
                info={info}
                isSelected={selectedSection === section}
                onSelect={() => setSelectedSection(section)}
              />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(Object.entries(TDS_SECTIONS) as [TDSSection, typeof TDS_SECTIONS[TDSSection]][]).slice(4).map(([section, info]) => (
              <TDSSectionCard
                key={section}
                section={section}
                info={info}
                isSelected={selectedSection === section}
                onSelect={() => setSelectedSection(section)}
              />
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1 block">Payment Amount (₹)</label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                className="w-full p-2 pl-8 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-amber-500 focus:outline-none"
                placeholder="Enter amount"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1 block">Vendor Name</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-amber-500 focus:outline-none"
              placeholder="For reminder"
            />
          </div>
        </div>

        {/* PAN Status */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasPAN}
              onChange={(e) => setHasPAN(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-300">Vendor has valid PAN</span>
          </label>
          {!hasPAN && (
            <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
              20% TDS applicable
            </span>
          )}
        </div>

        {/* TDS Calculation Result */}
        <motion.div
          layout
          className={`p-4 rounded-xl border ${
            tdsCalculation.isApplicable
              ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/30'
              : 'bg-slate-800/50 border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Percent size={16} className="text-amber-400" />
              TDS Calculation - {selectedSection}
            </h4>
            {tdsCalculation.isApplicable ? (
              <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-black rounded-full font-bold">
                TDS APPLICABLE
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                <CheckCircle size={10} /> Below Threshold
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="p-3 bg-black/30 rounded-lg">
              <div className="text-[10px] text-gray-400">Gross Amount</div>
              <div className="text-lg font-bold text-white">₹{paymentAmount.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-black/30 rounded-lg">
              <div className="text-[10px] text-gray-400">TDS Deducted</div>
              <div className="text-lg font-bold text-amber-400">₹{tdsCalculation.tdsAmount.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-black/30 rounded-lg">
              <div className="text-[10px] text-gray-400">Net Payable</div>
              <div className="text-lg font-bold text-green-400">₹{tdsCalculation.netPayable.toLocaleString()}</div>
            </div>
          </div>

          {/* Rate Breakdown */}
          <div className="p-2 bg-black/20 rounded-lg text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Applicable Rate:</span>
              <span className="font-mono">{hasPAN ? (TDS_SECTIONS[selectedSection].rate * 100).toFixed(1) : '20.0'}%</span>
            </div>
            <div className="flex justify-between text-gray-400 mt-1">
              <span>Threshold:</span>
              <span className="font-mono">₹{TDS_SECTIONS[selectedSection].threshold.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <motion.button
              onClick={handleScheduleReminder}
              disabled={!tdsCalculation.isApplicable}
              className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-semibold flex items-center justify-center gap-2 text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Bell size={14} /> Set Reminder
            </motion.button>
            <motion.button
              onClick={() => alert('Exporting TDS certificate...')}
              className="py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={14} />
            </motion.button>
          </div>
        </motion.div>

        {/* ITC Summary */}
        <ITCSummary invoices={sampleInvoices} computeITC={computeITC} />

        {/* Quick Tips */}
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-200/80 space-y-1">
              <p><strong className="text-blue-400">Key TDS Deadlines:</strong></p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>7th of next month - Deposit TDS to government</li>
                <li>Quarterly return (Form 26Q) - Due 31st of month following quarter</li>
                <li>Annual return (Form 24Q) - Due 31st May</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
