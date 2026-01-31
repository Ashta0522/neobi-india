'use client';

import React from 'react';
import { useNeoBIStore } from '@/lib/store';

export const HiringBridge: React.FC = () => {
  const { hiringBenchmarks } = useNeoBIStore();

  const prefillNaukri = (role = 'Product Manager', location = 'Bangalore', salary = '12LPA') => `https://www.naukri.com/job-listings?keyword=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}&salary=${encodeURIComponent(salary)}`;
  const prefillLinkedIn = (role = 'Product Manager', location = 'Bangalore') => `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(role)}%20${encodeURIComponent(location)}`;

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Hiring Bridge</h3>
      <p className="text-xs text-gray-300">Post jobs, search candidates, and see skill-gap guidance</p>

      <div className="mt-3">
        <div className="text-xs">Benchmark (SaaS): {hiringBenchmarks['saas']?.min} - {hiringBenchmarks['saas']?.max} people</div>

        <div className="mt-3 flex gap-2">
          <a href={prefillNaukri()} target="_blank" rel="noreferrer" className="px-3 py-1 bg-amber-600 rounded text-xs">Post Job on Naukri</a>
          <a href={prefillLinkedIn()} target="_blank" rel="noreferrer" className="px-3 py-1 bg-amber-600 rounded text-xs">Search on LinkedIn</a>
        </div>

        <div className="mt-3">
          <button onClick={() => alert('Skill gap analysis: you need 2 more marketers')} className="px-3 py-1 bg-amber-600 rounded text-xs">Run Skill Gap Analyzer</button>
        </div>
      </div>
    </div>
  );
};
