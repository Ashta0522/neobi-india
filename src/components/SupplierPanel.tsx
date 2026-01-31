'use client';

import React from 'react';

export const SupplierPanel: React.FC = () => {
  const prefillIndiaMart = (product = 'protein shake') => `https://www.indiamart.com/search.html?ss=${encodeURIComponent(product)}`;

  const negotiationScript = (vendor = 'Vendor A') => `Hi ${vendor}, we are a growing chain. Can you offer 10% discount on bulk orders and 30-day credit? We can commit to repeat orders.`;

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Suppliers & Vendors</h3>
      <p className="text-xs text-gray-300">Find suppliers, negotiation help and PO templates</p>

      <div className="mt-3">
        <a href={prefillIndiaMart()} target="_blank" rel="noreferrer" className="px-3 py-1 bg-amber-600 rounded text-xs">Search on IndiaMART</a>
        <div className="mt-3">
          <h4 className="text-xs font-semibold">Negotiation Script</h4>
          <pre className="text-xs bg-black/40 p-2 rounded mt-2">{negotiationScript()}</pre>
        </div>

        <div className="mt-3">
            <button onClick={() => {
              const po = 'po_number,vendor,product,qty,price\nPO-'+Date.now()+',Vendor A,Sample Product,100,250\n'
              const blob = new Blob([po], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `purchase-order-${Date.now()}.csv`
              a.click()
              URL.revokeObjectURL(url)
            }} className="px-3 py-1 bg-amber-600 rounded text-xs">Generate Purchase Order</button>
        </div>
      </div>
    </div>
  );
};
