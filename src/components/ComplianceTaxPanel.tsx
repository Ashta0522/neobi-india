'use client';

import React, { useState } from 'react';
import { useNeoBIStore } from '@/lib/store';

export const ComplianceTaxPanel: React.FC = () => {
  const { computeITC, computeTDS } = useNeoBIStore();
  const [sampleInvoices] = useState([
    { id: 'inv-1', amount: 100000, itcEligibleAmount: 18000, vendor: 'Vendor A' },
    { id: 'inv-2', amount: 50000, itcEligibleAmount: 9000, vendor: 'Vendor B' },
  ]);

  const itc = computeITC(sampleInvoices);
  const tds = computeTDS(500000, 0.02);

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Compliance & Tax</h3>
      <p className="text-xs text-gray-300">Real-time GST checklist, ITC optimizer and TDS helpers</p>

      <div className="mt-3 text-sm">
        <div className="flex justify-between">
          <span>Suggested ITC Claim</span>
          <strong>₹{itc.suggestedClaim}</strong>
        </div>
        <div className="mt-2">
          <h4 className="text-xs font-semibold">TDS Calculator</h4>
          <div className="flex items-center gap-2 mt-1">
            <input className="p-2 rounded bg-black/40" defaultValue={500000} />
            <button
              onClick={() => alert(`TDS on ₹500000 = ₹${tds}`)}
              className="px-3 py-1 bg-amber-600 rounded text-xs"
            >
              Calculate TDS
            </button>
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-xs font-semibold">Common Pitfalls</h4>
          <ul className="text-xs mt-1">
            <li>- Turnover thresholds: know when to register GST</li>
            <li>- Missing invoice dates may disallow ITC</li>
          </ul>
        </div>

        <div className="mt-3">
          <button
            onClick={() => alert('Exporting GST summary as CSV/JSON...')}
            className="px-3 py-1 bg-amber-600 rounded text-xs"
          >
            Export GST Filing Summary
          </button>
        </div>
      </div>
    </div>
  );
};
