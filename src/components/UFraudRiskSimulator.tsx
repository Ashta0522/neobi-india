'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UFraudRiskScore } from '@/types';

interface UFraudRiskSimulatorProps {
  fraudScore: UFraudRiskScore;
}

export function UFraudRiskSimulator({ fraudScore }: UFraudRiskSimulatorProps) {
  const [defenseLevel, setDefenseLevel] = useState(fraudScore.defenseLevel);

  const riskLevel = fraudScore.score > 60 ? 'High' : fraudScore.score > 35 ? 'Medium' : 'Low';
  const riskColor =
    fraudScore.score > 60 ? 'from-red-600 to-red-500' : fraudScore.score > 35 ? 'from-orange-600 to-orange-500' : 'from-green-600 to-green-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-amber-500/20 p-4"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-amber-300">🚨 UPI Fraud Risk Assessment</h3>
        <p className="text-xs text-amber-200/60">Mini-MARL: Fraudster vs Defender game</p>
      </div>

      {/* Risk Score Gauge */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`bg-gradient-to-r ${riskColor} p-6 rounded-lg text-white text-center mb-4`}
      >
        <div className="text-4xl font-bold">{fraudScore.score}</div>
        <div className="text-sm mt-1">{riskLevel} Risk</div>
      </motion.div>

      {/* Defense Level Adjustment */}
      <div className="mb-4 p-3 bg-slate-800/50 rounded border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-amber-300">Defense Investment Level</label>
          <span className="text-sm font-bold text-amber-300">{defenseLevel}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={defenseLevel}
          onChange={(e) => setDefenseLevel(parseInt(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="text-xs text-amber-200/60 mt-1">
          ₹{(defenseLevel * 50000) / 100}L annual investment
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
          <div className="text-xs text-amber-200/60 mb-1">Fraud Attempts (Monthly)</div>
          <div className="text-2xl font-bold text-amber-300">{fraudScore.fraudAttempts}</div>
        </div>

        <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
          <div className="text-xs text-amber-200/60 mb-1">Estimated Loss</div>
          <div className="text-2xl font-bold text-red-400">₹{(fraudScore.estimatedLoss / 100000).toFixed(1)}L</div>
        </div>
      </div>

      {/* Mitigation Strategies */}
      <div className="mb-4 p-3 bg-slate-800/50 rounded border border-slate-700">
        <div className="text-sm font-semibold text-amber-300 mb-2">🛡️ Recommended Mitigations:</div>
        <div className="space-y-1 text-xs">
          {fraudScore.mitigationStrategies.map((strategy, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-2 text-amber-200/70"
            >
              <span className="text-amber-500 mt-0.5">✓</span>
              <span>{strategy}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Theory Explanation */}
      <div className="p-3 bg-cyan-900/20 rounded border border-cyan-500/20 text-xs space-y-1 text-cyan-200/70">
        <div className="font-semibold text-cyan-300">🎮 The Game:</div>
        <div>
          • <strong>Fraudsters:</strong> Increase attempts as your revenue grows (10% of volume)
        </div>
        <div>
          • <strong>You:</strong> Invest in defense (2FA, velocity checks, monitoring)
        </div>
        <div>
          • <strong>Equilibrium:</strong> Win if defense level &gt; fraudster aggressiveness
        </div>
      </div>

      <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 text-xs text-amber-200/70">
        💳 Fraud score updates with growth. Monitor daily and adjust defense investment.
      </div>
    </motion.div>
  );
}
