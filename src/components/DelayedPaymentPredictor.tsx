'use client';

import React, { useState } from 'react';

export const DelayedPaymentPredictor: React.FC = () => {
  const [buyer, setBuyer] = useState('Big Buyer Pvt Ltd');
  const [overdue, setOverdue] = useState(800000);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'delayed-payment-predictor', payload: { buyer, overdueAmount: overdue } }) });
      const j = await res.json();
      alert(`Predicted delay: ${j.data.predictedDelayDays} days (risk: ${j.data.risk})`);
    } catch (error) {
      console.error('Payment prediction failed:', error);
      alert('Failed to predict payment delay. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Delayed Payment Predictor</h3>
      <p className="text-xs text-gray-300">Predict risk and expected delay</p>
      <div className="mt-3 text-xs">
        <div className="flex gap-2"><input value={buyer} onChange={(e:any)=>setBuyer(e.target.value)} className="p-2 rounded bg-black/40" disabled={loading} /> <span>Buyer</span></div>
        <div className="flex gap-2 mt-2"><input value={overdue} onChange={(e:any)=>setOverdue(+e.target.value)} className="p-2 rounded bg-black/40" disabled={loading} /> <span>Overdue</span></div>
        <div className="mt-3"><button onClick={run} className="px-3 py-1 bg-amber-600 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? 'Predicting...' : 'Run Predictor'}</button></div>
      </div>
    </div>
  );
};
