'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, TrendingUp, Zap } from 'lucide-react';

interface Vulnerability {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
  defenseLevel: number;
}

interface UPIFraudDefenseProps {
  currentRisk: number;
  vulnerabilities: Vulnerability[];
}

const UPIFraudDefense: React.FC<UPIFraudDefenseProps> = ({ currentRisk, vulnerabilities }) => {
  const [defenseLevel, setDefenseLevel] = useState(40);
  const [activeDefense, setActiveDefense] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'text-red-500 bg-red-500/20',
      high: 'text-orange-500 bg-orange-500/20',
      medium: 'text-yellow-500 bg-yellow-500/20',
      low: 'text-blue-500 bg-blue-500/20',
    };
    return colors[severity as keyof typeof colors];
  };

  const mitigatedRisk = Math.max(0, currentRisk - defenseLevel * 0.8);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-red-500/30 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-red-300 mb-2">🛡️ UPI Fraud Defense System</h3>
        <p className="text-xs text-red-400">Real-time threat detection & mitigation strategies</p>
      </div>

      {/* Risk Gauge */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-xs text-red-400 font-semibold mb-2">Current Risk</div>
          <div className="relative h-12 bg-red-900/30 rounded-full overflow-hidden border border-red-500/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentRisk}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-red-600 to-red-400"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{currentRisk}%</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-green-400 font-semibold mb-2">After Defense</div>
          <div className="relative h-12 bg-green-900/30 rounded-full overflow-hidden border border-green-500/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${mitigatedRisk}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-green-600 to-green-400"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{Math.round(mitigatedRisk)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Defense Level Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-amber-300">Defense Investment Level</label>
          <span className="text-sm font-bold text-amber-300">${(defenseLevel * 1000).toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={defenseLevel}
          onChange={(e) => setDefenseLevel(parseInt(e.target.value))}
          className="w-full h-2 bg-amber-900/30 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-amber-400 mt-1">
          <span>No Investment</span>
          <span>$100K</span>
        </div>
      </div>

      {/* Defense Strategies */}
      <div className="mb-6 space-y-2">
        <h4 className="text-xs font-bold text-amber-300">Active Defenses</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: '2FA Authentication', effectiveness: 95 },
            { name: 'Transaction Limits', effectiveness: 75 },
            { name: 'Real-time Monitoring', effectiveness: 85 },
            { name: 'User Verification', effectiveness: 88 },
          ].map((defense) => (
            <motion.button
              key={defense.name}
              onClick={() => setActiveDefense(activeDefense === defense.name ? null : defense.name)}
              className={`text-xs font-semibold px-2 py-1.5 rounded border transition-all ${
                activeDefense === defense.name
                  ? 'bg-amber-600/60 border-amber-400 text-amber-100'
                  : 'bg-black/40 border-amber-500/30 text-amber-200 hover:bg-black/60'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {defense.name} ({defense.effectiveness}%)
            </motion.button>
          ))}
        </div>
      </div>

      {/* Vulnerabilities */}
      <div>
        <h4 className="text-xs font-bold text-red-300 mb-2">🚨 Active Threats</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {vulnerabilities.map((vuln) => (
            <motion.div
              key={vuln.type}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-2 rounded border ${getSeverityColor(vuln.severity)} bg-black/40`}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-xs">
                  <p className="font-semibold">{vuln.type}</p>
                  <p className="opacity-70">{vuln.description}</p>
                  <p className="text-xs opacity-60 mt-1">→ {vuln.mitigation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 pt-4 border-t border-red-500/20 flex items-center justify-between text-xs text-red-300">
        <span>Risk Reduction: {((currentRisk - mitigatedRisk) / currentRisk * 100).toFixed(0)}%</span>
        <span>ROI: {(((currentRisk - mitigatedRisk) / currentRisk * 100) / (defenseLevel / 10)).toFixed(1)}x</span>
      </motion.div>
    </motion.div>
  );
};

export default UPIFraudDefense;
