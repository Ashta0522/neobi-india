'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, IndianRupee, Clock, TrendingDown, CheckCircle } from 'lucide-react';

interface DiscountResult {
  netProceeds: number;
  discountFee: number;
  effectiveRate: number;
  savings: number;
}

export const InvoiceDiscountCalculator: React.FC = () => {
  const [amount, setAmount] = useState(500000);
  const [tenor, setTenor] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiscountResult | null>(null);

  const compute = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invoice-discount', payload: { amount, tenorDays: tenor } })
      });
      const j = await res.json();
      setResult({
        netProceeds: j.data?.netProceeds || Math.round(amount * 0.99),
        discountFee: j.data?.discountFee || Math.round(amount * 0.01),
        effectiveRate: j.data?.effectiveRate || 12,
        savings: j.data?.savings || Math.round(amount * 0.005),
      });
    } catch (error) {
      console.error('Invoice calculation failed:', error);
      // Provide fallback calculation
      const discountRate = 0.01 + (tenor / 365) * 0.12;
      const discountFee = Math.round(amount * discountRate);
      setResult({
        netProceeds: amount - discountFee,
        discountFee,
        effectiveRate: Math.round(discountRate * 100 * 100) / 100,
        savings: Math.round(discountFee * 0.1),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calculator className="text-blue-400" size={18} />
        <h4 className="font-bold text-blue-400">Invoice Discounting</h4>
      </div>
      <p className="text-xs text-gray-400">Estimate discounting fees and net proceeds from TReDS/factoring</p>

      {/* Input Fields */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Invoice Amount (₹)</label>
          <div className="relative">
            <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 bg-black/40 border border-blue-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400"
              disabled={loading}
              min={10000}
              step={10000}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Tenor (Days)</label>
          <div className="relative">
            <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="number"
              value={tenor}
              onChange={(e) => setTenor(Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 bg-black/40 border border-blue-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400"
              disabled={loading}
              min={7}
              max={180}
            />
          </div>
        </div>

        <button
          onClick={compute}
          disabled={loading || amount < 10000}
          className="w-full py-2.5 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-500/40 rounded-lg text-blue-200 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
              Computing...
            </>
          ) : (
            <>
              <Calculator size={16} />
              Calculate Discount
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl border border-blue-500/30 space-y-3"
        >
          <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
            <CheckCircle size={16} />
            Calculation Complete
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-black/30 rounded-lg">
              <div className="text-[10px] text-gray-400 uppercase">Invoice Amount</div>
              <div className="text-lg font-bold text-white">₹{amount.toLocaleString('en-IN')}</div>
            </div>
            <div className="p-3 bg-black/30 rounded-lg">
              <div className="text-[10px] text-gray-400 uppercase">Discount Fee</div>
              <div className="text-lg font-bold text-red-400">-₹{result.discountFee.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="p-4 bg-green-900/30 rounded-lg border border-green-500/30">
            <div className="text-xs text-gray-400 mb-1">Net Proceeds (You Receive)</div>
            <div className="text-2xl font-black text-green-400">
              ₹{result.netProceeds.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-2 bg-black/20 rounded">
              <span className="text-gray-400">Effective Rate</span>
              <span className="text-yellow-400 font-bold">{result.effectiveRate}% p.a.</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-black/20 rounded">
              <span className="text-gray-400">Tenor</span>
              <span className="text-blue-400 font-bold">{tenor} days</span>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 mt-2">
            * Rates are indicative. Actual rates may vary based on buyer creditworthiness and market conditions.
            Consider platforms like TReDS (M1xchange, RXIL, Invoicemart) for competitive rates.
          </div>
        </motion.div>
      )}

      {/* Quick Tips */}
      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
        <h5 className="text-xs font-bold text-gray-400 mb-2">💡 Tips for Better Rates</h5>
        <ul className="text-[10px] text-gray-500 space-y-1">
          <li>• Shorter tenor = Lower discount fee</li>
          <li>• Large corporates as buyers = Better rates</li>
          <li>• Register on TReDS for MSME benefits</li>
          <li>• Maintain good GST compliance score</li>
        </ul>
      </div>
    </div>
  );
};
