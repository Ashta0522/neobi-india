'use client';

import React, { useState } from 'react';
import { useNeoBIStore } from '@/lib/store';

export const WellnessPanel: React.FC = () => {
  const { burnoutTrajectory, recordCheckin } = useNeoBIStore();
  const [loading, setLoading] = useState(false);
  const scheduleWeekly = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enhanced', { method: 'POST', body: JSON.stringify({ action: 'burnout-schedule', payload: {} }) });
      const j = await res.json();
      alert(`Next check-in scheduled: ${new Date(j.data.nextCheckIn).toLocaleString()}`);
    } catch (error) {
      console.error('Schedule check-in failed:', error);
      alert('Failed to schedule check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Founder Wellness</h3>
      <p className="text-xs text-gray-300">Weekly check-ins, trajectory and routine suggestions</p>

      <div className="mt-3">
        <div className="text-xs">Recent check-ins: {(burnoutTrajectory || []).length}</div>
        <div className="mt-2">
          <button onClick={() => { recordCheckin(70); alert('Check-in recorded'); }} className="px-3 py-1 bg-amber-600 rounded text-xs" disabled={loading}>Quick Check-in (70)</button>
          <button onClick={() => alert('Generated routine: 6h deep work + Sunday recharge')} className="px-3 py-1 bg-amber-600 rounded text-xs ml-2" disabled={loading}>Generate Routine</button>
        </div>
        <div className="mt-3">
          <button onClick={scheduleWeekly} className="px-3 py-1 bg-amber-600 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? 'Scheduling...' : 'Schedule Weekly Check-ins'}</button>
        </div>
      </div>
    </div>
  );
};
