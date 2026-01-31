'use client';

import React, { useState } from 'react';
import { useNeoBIStore } from '@/lib/store';

export const FundingPanel: React.FC = () => {
  const { calculateRunway, invoices } = useNeoBIStore();
  const [cashOnHand, setCashOnHand] = useState(200000);
  const [monthlyBurn, setMonthlyBurn] = useState(80000);

  const runway = calculateRunway(cashOnHand, monthlyBurn, invoices.reduce((s,i)=>s+i.amount,0));

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Funding & Cash Flow</h3>
      <p className="text-xs text-gray-300">Runway calculator, invoice discounting and pre-qualifiers</p>

      <div className="mt-3 text-sm">
        <div className="flex justify-between"><span>Cash On Hand</span><strong>₹{cashOnHand}</strong></div>
        <div className="flex justify-between mt-1"><span>Monthly Burn</span><strong>₹{monthlyBurn}</strong></div>
        <div className="flex justify-between mt-1"><span>Runway</span><strong>{runway.months} months</strong></div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => alert('Open BharatNXT pre-qualifier') } className="px-3 py-1 bg-amber-600 rounded text-xs">UPI Credit Pre-qualifier</button>
          <button onClick={() => alert('Show Mudra/CGTMSE options') } className="px-3 py-1 bg-amber-600 rounded text-xs">Government Schemes</button>
        </div>
      </div>
    </div>
  );
};
