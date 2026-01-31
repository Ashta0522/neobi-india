'use client';

import React, { useState, useEffect } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const LiveTickerBar: React.FC = () => {
  const { indiaContext, updateIndiaContext } = useNeoBIStore();

  // Fetch NIFTY data from API in real-time
  useEffect(() => {
    const fetchNIFTY = async () => {
      try {
        const response = await fetch('/api/nifty');
        const data = await response.json();

        updateIndiaContext({
          niftyLive: {
            value: data.value,
            change: data.change,
            changePercent: data.changePercent,
            timestamp: new Date(data.timestamp),
          },
          marketHours: {
            isOpen: data.isMarketOpen,
            nextOpen: indiaContext.marketHours.nextOpen,
            nextClose: indiaContext.marketHours.nextClose,
          },
        });
      } catch (error) {
        console.error('Failed to fetch NIFTY data:', error);
      }
    };

    // Fetch immediately on mount
    fetchNIFTY();

    // Then fetch every 60 seconds
    const interval = setInterval(fetchNIFTY, 60000);

    return () => clearInterval(interval);
  }, [updateIndiaContext]);

  // Update festival countdown in real-time
  useEffect(() => {
    const updateFestivalCountdown = async () => {
      try {
        const response = await fetch('/api/festivals');
        const data = await response.json();

        updateIndiaContext({
          festivalCountdown: {
            next: data.next,
            daysUntil: data.daysUntil,
            expectedDemandLift: data.expectedDemandLift,
            date: new Date(data.date),
          },
        });
      } catch (error) {
        console.error('Failed to fetch festival data:', error);
      }
    };

    // Fetch immediately
    updateFestivalCountdown();

    // Update every 6 hours (countdown changes once per day, but check periodically)
    const interval = setInterval(updateFestivalCountdown, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [updateIndiaContext]);

  const { niftyLive, festivalCountdown, marketHours } = indiaContext;
  const isPositive = niftyLive.change >= 0;

  return (
    <div className="fixed top-0 left-0 right-0 h-16 glass glass-dark border-b border-white/10 z-50 flex items-center px-6 gap-8 no-print">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-black bg-gradient-peach bg-clip-text text-transparent">
          NeoBI
        </div>
        <span className="text-xs px-2 py-1 rounded bg-agents-orchestrator/20 text-agents-orchestrator font-mono">
          v2.0
        </span>
      </div>

      {/* NIFTY Ticker */}
      <div className="flex items-center gap-2 cursor-pointer micro-hover">
        <span className="text-xs text-gray-400">NIFTY 50</span>
        <span className="text-lg font-bold">{niftyLive.value.toFixed(0)}</span>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="text-sm font-semibold">
            {isPositive ? '+' : ''}{niftyLive.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Festival Countdown */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{festivalCountdown.next}</span>
        <span className="text-sm font-bold text-agents-growth">
          {festivalCountdown.daysUntil}d
        </span>
        <span className="text-xs text-agents-growth/60 font-mono">
          +{festivalCountdown.expectedDemandLift}%
        </span>
      </div>

      {/* Market Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${marketHours.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-xs text-gray-400">
          {marketHours.isOpen ? 'Market Open' : 'Market Closed'}
        </span>
      </div>

      {/* Right Spacer */}
      <div className="flex-1" />

      {/* Timestamp */}
      <div className="text-xs text-gray-500 font-mono">
        {format(new Date(), 'HH:mm:ss')}
      </div>
    </div>
  );
};
