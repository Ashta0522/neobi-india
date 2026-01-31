'use client';

import React from 'react';

export const ExportReadiness: React.FC = () => {
  const checks = [
    { name: 'IEC Code', ok: false },
    { name: 'GST Export Eligibility', ok: true },
    { name: 'Cross-border payments', ok: false },
  ];

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Export & Global Scale</h3>
      <p className="text-xs text-gray-300">Checks for export readiness and helpful links</p>

      <div className="mt-3 text-xs">
        {checks.map((c) => (
          <div key={c.name} className="flex justify-between"><span>{c.name}</span><span>{c.ok ? '✅' : '⚠️'}</span></div>
        ))}

        <div className="mt-3 flex gap-2">
          <a href="https://www.dgft.gov.in/" target="_blank" rel="noreferrer" className="px-3 py-1 bg-amber-600 rounded text-xs">DGFT</a>
          <a href="https://www.icegate.gov.in/" target="_blank" rel="noreferrer" className="px-3 py-1 bg-amber-600 rounded text-xs">ICEGATE</a>
        </div>
      </div>
    </div>
  );
};
