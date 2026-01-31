'use client';

import React from 'react';
import { useNeoBIStore } from '@/lib/store';
import { AlertCircle, TrendingUp, Heart } from 'lucide-react';
import { calculateBurnoutReduction, generateCompetitorHeatmap } from '@/utils/simulationEngine';

export const RiskAndCoachPanel: React.FC = () => {
  const { selectedPath, profile, vibeMode } = useNeoBIStore();

  if (!selectedPath || !profile) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-gray-400">Select a path to see insights</p>
      </div>
    );
  }

  const burnoutData = calculateBurnoutReduction(65, vibeMode);
  const competitorHeatmap = generateCompetitorHeatmap(selectedPath);

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto">
      {/* Why This Path? */}
      <div className="glass p-4">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-agents-decision" />
          Why This Path?
        </h4>
        <div className="space-y-2 text-xs">
          <p className="text-gray-300">
            <strong>Expected Value:</strong> ₹{(selectedPath.expectedValue / 100000).toFixed(1)}L
          </p>
          <p className="text-gray-300">
            <strong>Success Probability:</strong> {(selectedPath.probability * 100).toFixed(0)}%
          </p>
          <p className="text-gray-300">
            <strong>Timeline:</strong> {selectedPath.timeline} days
          </p>
          <p className="text-gray-300 pt-2">
            <strong>Key Benefits:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Revenue: +₹{(selectedPath.benefits.revenue / 100000).toFixed(1)}L</li>
            <li>Efficiency: +{selectedPath.benefits.efficiency}%</li>
            <li>Risk Reduction: {selectedPath.benefits.riskReduction}%</li>
          </ul>
        </div>
      </div>

      {/* SHAP Explainability */}
      <div className="glass p-4">
        <h4 className="text-sm font-bold mb-3">🔍 Decision Factors (SHAP)</h4>
        <div className="space-y-1 text-xs">
          {Object.entries(selectedPath.shapleySHAP || {})
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([factor, value]) => (
              <div key={factor} className="flex justify-between items-center">
                <span className="text-gray-400 capitalize">{factor.replace(/_/g, ' ')}</span>
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-peach rounded-full"
                    style={{ width: `${Math.min(100, (value / 50) * 100)}%` }}
                  />
                </div>
                <span className="text-agents-growth font-bold w-8 text-right">{value.toFixed(0)}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Burnout Coach */}
      <div className="glass p-4 bg-agents-coach/5 border-agents-coach/30">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Heart size={16} className="text-agents-coach" />
          Burnout Risk Analysis
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Base Risk</span>
            <span className="font-bold">{burnoutData.baseRisk}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">After {vibeMode === 'conservative' ? 'Conservative' : vibeMode === 'balanced' ? 'Balanced' : 'Aggressive'} Mode</span>
            <span className="font-bold text-agents-coach">
              {burnoutData.riskAfterAdjustment.toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-agents-coach/20">
            <span className="text-agents-coach font-bold">Risk Reduction</span>
            <span className="font-bold text-agents-coach">
              {burnoutData.reduction}%
            </span>
          </div>
          <p className="text-agents-coach/80 italic mt-2 pt-2 border-t border-agents-coach/20">
            💡 {burnoutData.modeNote}
          </p>
        </div>
      </div>

      {/* Competitor Response */}
      <div className="glass p-4">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-agents-operations" />
          Competitor Response
        </h4>
        <div className="space-y-1 text-xs">
          {competitorHeatmap.map((scenario, idx) => (
            <div key={idx} className="p-2 bg-white/5 rounded">
              <p className="font-bold mb-1">{scenario.scenario}</p>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div>
                  <span className="text-gray-400 text-xs">Aggressive</span>
                  <p className="font-bold text-red-400">{scenario.aggressiveScore.toFixed(0)}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Conservative</span>
                  <p className="font-bold text-green-400">{scenario.conservativeScore.toFixed(0)}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Innovative</span>
                  <p className="font-bold text-yellow-400">{scenario.innovativeScore.toFixed(0)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
