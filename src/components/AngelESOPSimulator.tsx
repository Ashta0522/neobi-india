'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Clock, Users, TrendingUp } from 'lucide-react';

interface VestingScheduleItem {
  period: string;
  vestedPercent: number;
  vestedValue: number;
  cumulative: number;
}

export const AngelESOPSimulator: React.FC = () => {
  const [companyValuation, setCompanyValuation] = useState(100000000); // ₹10Cr
  const [esopPoolPercent, setEsopPoolPercent] = useState(10);
  const [employeeGrantPercent, setEmployeeGrantPercent] = useState(0.5);
  const [vestingYears, setVestingYears] = useState(4);
  const [cliffMonths, setCliffMonths] = useState(12);
  const [mode, setMode] = useState<'esop' | 'angel'>('esop');

  // Angel tax inputs
  const [raised, setRaised] = useState(5000000);
  const [premium, setPremium] = useState(1000000);

  // ESOP Calculation
  const esopResult = useMemo(() => {
    const poolValue = companyValuation * (esopPoolPercent / 100);
    const grantValue = companyValuation * (employeeGrantPercent / 100);
    const cliffPercent = cliffMonths / (vestingYears * 12);
    const cliffValue = grantValue * cliffPercent;
    const remainingMonths = (vestingYears * 12) - cliffMonths;
    const monthlyVesting = remainingMonths > 0 ? (grantValue - cliffValue) / remainingMonths : 0;

    // Generate vesting schedule
    const schedule: VestingScheduleItem[] = [];

    // Cliff period
    schedule.push({
      period: `Month 0-${cliffMonths} (Cliff)`,
      vestedPercent: 0,
      vestedValue: 0,
      cumulative: 0,
    });

    // At cliff
    schedule.push({
      period: `Month ${cliffMonths} (Cliff Vests)`,
      vestedPercent: Math.round(cliffPercent * 100 * 100) / 100,
      vestedValue: Math.round(cliffValue),
      cumulative: Math.round(cliffValue),
    });

    // Yearly milestones after cliff
    for (let year = 1; year <= vestingYears; year++) {
      const monthsFromStart = year * 12;
      if (monthsFromStart <= cliffMonths) continue;
      const vestedMonths = monthsFromStart - cliffMonths;
      const totalVested = cliffValue + (monthlyVesting * vestedMonths);
      const percent = Math.min(100, (totalVested / grantValue) * 100);
      schedule.push({
        period: `Year ${year} (Month ${monthsFromStart})`,
        vestedPercent: Math.round(percent * 100) / 100,
        vestedValue: Math.round(Math.min(grantValue, totalVested)),
        cumulative: Math.round(Math.min(grantValue, totalVested)),
      });
    }

    return {
      poolValue,
      grantValue,
      cliffValue: Math.round(cliffValue),
      cliffPercent: Math.round(cliffPercent * 100 * 100) / 100,
      monthlyVesting: Math.round(monthlyVesting),
      schedule,
    };
  }, [companyValuation, esopPoolPercent, employeeGrantPercent, vestingYears, cliffMonths]);

  // Angel Tax Calculation
  const angelTaxResult = useMemo(() => {
    const estimatedAngelTax = Math.round(premium * 0.3048); // ~30.48% for non-resident, varies
    const section56Tax = Math.round(premium * 0.30); // 30% under Section 56(2)(viib)
    return {
      raised,
      premium,
      estimatedAngelTax: section56Tax,
      exemptUnder: 'Section 56(2)(viib) - DPIIT registered startups exempt',
      dpiitBenefit: section56Tax,
    };
  }, [raised, premium]);

  return (
    <div className="glass p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="text-amber-400" size={18} />
          <h3 className="font-bold text-amber-400 text-sm">ESOP & Angel Tax Calculator</h3>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-amber-500/30">
          <button
            onClick={() => setMode('esop')}
            className={`px-3 py-1 text-xs font-semibold ${mode === 'esop' ? 'bg-amber-600 text-white' : 'bg-black/40 text-amber-300'}`}
          >
            ESOP
          </button>
          <button
            onClick={() => setMode('angel')}
            className={`px-3 py-1 text-xs font-semibold ${mode === 'angel' ? 'bg-amber-600 text-white' : 'bg-black/40 text-amber-300'}`}
          >
            Angel Tax
          </button>
        </div>
      </div>

      {mode === 'esop' ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">Company Valuation (₹)</label>
              <input
                type="number"
                value={companyValuation}
                onChange={(e) => setCompanyValuation(Number(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">ESOP Pool (%)</label>
              <input
                type="number"
                value={esopPoolPercent}
                onChange={(e) => setEsopPoolPercent(Number(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
                min={1} max={30} step={1}
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">Employee Grant (%)</label>
              <input
                type="number"
                value={employeeGrantPercent}
                onChange={(e) => setEmployeeGrantPercent(Number(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
                min={0.01} max={10} step={0.1}
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">Vesting (Years)</label>
              <input
                type="number"
                value={vestingYears}
                onChange={(e) => setVestingYears(Number(e.target.value) || 1)}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
                min={1} max={6} step={1}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">Cliff Period (Months)</label>
            <input
              type="number"
              value={cliffMonths}
              onChange={(e) => setCliffMonths(Number(e.target.value) || 0)}
              className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
              min={0} max={24} step={3}
            />
          </div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/20 space-y-3"
          >
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-black/30 rounded-lg">
                <div className="text-[9px] text-gray-400">Pool Value</div>
                <div className="text-sm font-bold text-amber-400">₹{(esopResult.poolValue / 100000).toFixed(1)}L</div>
              </div>
              <div className="p-2 bg-black/30 rounded-lg">
                <div className="text-[9px] text-gray-400">Grant Value</div>
                <div className="text-sm font-bold text-green-400">₹{(esopResult.grantValue / 100000).toFixed(1)}L</div>
              </div>
              <div className="p-2 bg-black/30 rounded-lg">
                <div className="text-[9px] text-gray-400">Monthly Vest</div>
                <div className="text-sm font-bold text-blue-400">₹{esopResult.monthlyVesting.toLocaleString()}</div>
              </div>
            </div>

            {/* Vesting Schedule */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 mb-2 flex items-center gap-1">
                <Clock size={10} /> Vesting Schedule
              </h4>
              <div className="space-y-1">
                {esopResult.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-black/20 rounded text-[10px]">
                    <span className="text-gray-300">{item.period}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400">{item.vestedPercent}%</span>
                      <span className="text-green-400 font-mono">₹{(item.cumulative / 100000).toFixed(2)}L</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">Amount Raised (₹)</label>
              <input
                type="number"
                value={raised}
                onChange={(e) => setRaised(Number(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">Share Premium (₹)</label>
              <input
                type="number"
                value={premium}
                onChange={(e) => setPremium(Number(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl border border-red-500/20 space-y-2"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-black/30 rounded-lg">
                <div className="text-[9px] text-gray-400">Potential Angel Tax</div>
                <div className="text-sm font-bold text-red-400">₹{(angelTaxResult.estimatedAngelTax / 100000).toFixed(2)}L</div>
              </div>
              <div className="p-2 bg-black/30 rounded-lg">
                <div className="text-[9px] text-gray-400">DPIIT Exemption</div>
                <div className="text-sm font-bold text-green-400">₹{(angelTaxResult.dpiitBenefit / 100000).toFixed(2)}L</div>
              </div>
            </div>
            <div className="p-2 bg-green-900/20 rounded border border-green-500/20">
              <p className="text-[10px] text-green-300">
                <strong>DPIIT registered startups</strong> are exempt from angel tax under Section 56(2)(viib). Register at startupindia.gov.in
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
