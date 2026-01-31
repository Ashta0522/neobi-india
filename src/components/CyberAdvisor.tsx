'use client';

import React from 'react';
import { useNeoBIStore } from '@/lib/store';

export const CyberAdvisor: React.FC = () => {
  const { cyberRiskScore } = useNeoBIStore();

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Cybersecurity & DPDP</h3>
      <p className="text-xs text-gray-300">DPDP checklist and simple risk score</p>

      <div className="mt-3">
        <div className="flex justify-between text-xs"><span>DPDP Compliance</span><span>Partial</span></div>
        <div className="flex justify-between text-xs mt-1"><span>Cyber Risk Score</span><strong>{cyberRiskScore}</strong></div>
        <div className="mt-3">
          <button onClick={() => alert('Run Cyber Threat Simulator')} className="px-3 py-1 bg-amber-600 rounded text-xs">Run Threat Simulator</button>
        </div>
      </div>
    </div>
  );
};
