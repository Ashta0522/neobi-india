'use client';

import React, { useState } from 'react';

export const PaymentRecovery: React.FC = () => {
  const [invoiceAmount, setInvoiceAmount] = useState(800000);
  const [dueDate, setDueDate] = useState('2025-12-01');

  const template = (amt: number, due: string) => `Subject: Payment Reminder — Invoice due\n\nDear Sir/Madam,\nOur records show invoice of ₹${amt} due on ${due}. Please arrange payment. If not cleared within 7 days, we will initiate recovery.`;

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Delayed Payment Recovery</h3>
      <p className="text-xs text-gray-300">Templates and links for recovery</p>

      <div className="mt-3 text-xs">
        <div className="flex gap-2">
          <input value={invoiceAmount} onChange={(e:any)=>setInvoiceAmount(+e.target.value)} className="p-2 rounded bg-black/40" />
          <input value={dueDate} onChange={(e:any)=>setDueDate(e.target.value)} className="p-2 rounded bg-black/40" />
        </div>
        <div className="mt-3">
          <button onClick={() => alert(template(invoiceAmount, dueDate))} className="px-3 py-1 bg-amber-600 rounded text-xs">Generate Notice</button>
          <button onClick={() => window.open('https://www.msmesamadhaan.gov.in/', '_blank')} className="px-3 py-1 bg-amber-600 rounded text-xs ml-2">Open MSME Samadhaan</button>
        </div>
      </div>
    </div>
  );
};
