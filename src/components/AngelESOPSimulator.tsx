'use client';

import React, { useState } from 'react';

export const AngelESOPSimulator: React.FC = () => {
  const [raised, setRaised] = useState(5000000);
  const [premium, setPremium] = useState(1000000);
  const [loading, setLoading] = useState(false);
  const simulate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'angel-esop-sim', payload: { raised, premium } }) });
      const j = await res.json();
      alert(`Estimated Angel Tax: ₹${j.data.estimatedAngelTax}`);
    } catch (error) {
      console.error('Angel tax simulation failed:', error);
      alert('Failed to calculate angel tax. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Angel / ESOP Tax Simulator</h3>
      <p className="text-xs text-gray-300">Estimate potential tax on share premium / ESOP events</p>
      <div className="mt-3 text-xs">
        <div className="flex gap-2"><input value={raised} onChange={(e:any)=>setRaised(+e.target.value)} className="p-2 rounded bg-black/40" disabled={loading} /> <span>Raised</span></div>
        <div className="flex gap-2 mt-2"><input value={premium} onChange={(e:any)=>setPremium(+e.target.value)} className="p-2 rounded bg-black/40" disabled={loading} /> <span>Share Premium</span></div>
        <div className="mt-3"><button onClick={simulate} disabled={loading} className="px-3 py-1 bg-amber-600 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Calculating...' : 'Simulate'}</button></div>
      </div>
    </div>
  );
};
