'use client';

import React, { useState } from 'react';

export const InvoiceDiscountCalculator: React.FC = () => {
  const [amount, setAmount] = useState(500000);
  const [tenor, setTenor] = useState(30);
  const [loading, setLoading] = useState(false);

  const compute = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'invoice-discount', payload: { amount, tenorDays: tenor } }) });
      const j = await res.json();
      alert(`Net proceeds: ₹${j.data.netProceeds} (fee ₹${j.data.discountFee})`);
    } catch (error) {
      console.error('Invoice calculation failed:', error);
      alert('Failed to calculate invoice discount. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Invoice Discounting</h3>
      <p className="text-xs text-gray-300">Estimate discounting fees and net proceeds</p>
      <div className="mt-3 text-xs">
        <div className="flex gap-2"><input value={amount} onChange={(e:any)=>setAmount(+e.target.value)} className="p-2 rounded bg-black/40" disabled={loading} /> <span>Amount</span></div>
        <div className="flex gap-2 mt-2"><input value={tenor} onChange={(e:any)=>setTenor(+e.target.value)} className="p-2 rounded bg-black/40" disabled={loading} /> <span>Tenor days</span></div>
        <div className="mt-3"><button onClick={compute} className="px-3 py-1 bg-amber-600 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? 'Computing...' : 'Compute'}</button></div>
      </div>
    </div>
  );
};
