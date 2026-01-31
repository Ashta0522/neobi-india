'use client';

import React from 'react';

export const WeeklyDigest: React.FC = () => {
  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Weekly Founder Digest</h3>
      <p className="text-xs text-gray-300">Summary: MRR, market, festival reminders</p>
      <div className="mt-3 text-xs">
        <div>MRR: +8%</div>
        <div>NIFTY: +1.2%</div>
        <div>Next festival: Holi in 45 days</div>
      </div>
    </div>
  );
};
