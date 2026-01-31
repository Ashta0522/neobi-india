'use client';

import React from 'react';
import { useNeoBIStore } from '@/lib/store';

export const SkillGapRecommender: React.FC = () => {
  const { hiringBenchmarks } = useNeoBIStore();

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Skill Gap & Upskilling</h3>
      <p className="text-xs text-gray-300">Compare team size vs industry benchmarks and recommend training</p>

      <div className="mt-3 text-xs">
        <div>For SaaS: recommended {hiringBenchmarks['saas']?.min}–{hiringBenchmarks['saas']?.max} members</div>
        <div className="mt-2">
          <button onClick={() => window.open('https://skillindia.gov.in/', '_blank')} className="px-3 py-1 bg-amber-600 rounded text-xs">Open Skill India</button>
          <button onClick={() => window.open('https://www.coursera.org/', '_blank')} className="px-3 py-1 bg-amber-600 rounded text-xs ml-2">Open Coursera</button>
        </div>
      </div>
    </div>
  );
};
