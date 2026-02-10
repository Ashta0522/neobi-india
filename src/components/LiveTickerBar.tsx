'use client';

import React, { useState, useEffect } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, RefreshCw, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const LiveTickerBar: React.FC = () => {
  const { indiaContext, updateIndiaContext, setProfile } = useNeoBIStore();
  const [marketStatus, setMarketStatus] = useState<string>('');
  const [nextMarketTime, setNextMarketTime] = useState<string>('');

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
          },
        });

        setMarketStatus(data.marketStatus || (data.isMarketOpen ? 'Market Open' : 'Market Closed'));
        setNextMarketTime(data.nextMarketTime || '');
      } catch (error) {
        console.error('Failed to fetch NIFTY data:', error);
      }
    };

    fetchNIFTY();
    const interval = setInterval(fetchNIFTY, 60000);
    return () => clearInterval(interval);
  }, [updateIndiaContext]);

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
          },
        });
      } catch (error) {
        console.error('Failed to fetch festival data:', error);
      }
    };

    updateFestivalCountdown();
    const interval = setInterval(updateFestivalCountdown, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [updateIndiaContext]);

  const { niftyLive, festivalCountdown, marketHours } = indiaContext;
  const isPositive = niftyLive.change >= 0;

  return (
    <div className="fixed top-0 left-0 right-0 h-14 sm:h-16 glass glass-dark border-b border-white/10 z-50 flex items-center px-2 sm:px-6 gap-2 sm:gap-6 no-print overflow-x-auto touch-scroll">
      {/* Logo */}
      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        <div className="text-lg sm:text-2xl font-black bg-gradient-peach bg-clip-text text-transparent">
          NeoBI
        </div>
        <span className="hidden sm:inline text-xs px-2 py-1 rounded bg-agents-orchestrator/20 text-agents-orchestrator font-mono">
          India
        </span>
      </div>

      {/* NIFTY Ticker - Compact on mobile */}
      <motion.div
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/5 border border-white/10 flex-shrink-0"
        whileHover={{ scale: 1.02 }}
      >
        <span className="hidden sm:inline text-xs text-gray-400">NIFTY</span>
        <span className="text-sm sm:text-lg font-bold">{niftyLive.value.toFixed(0)}</span>
        <div className={`flex items-center gap-0.5 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span className="text-xs sm:text-sm font-semibold">
            {isPositive ? '+' : ''}{niftyLive.changePercent.toFixed(1)}%
          </span>
        </div>
      </motion.div>

      {/* Market Status - Hidden on small mobile */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
        <motion.div
          className={`w-2.5 h-2.5 rounded-full ${marketHours.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
          animate={marketHours.isOpen ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 1.5, repeat: marketHours.isOpen ? Infinity : 0 }}
        />
        <div className="flex flex-col leading-tight">
          <span className={`text-xs font-semibold ${marketHours.isOpen ? 'text-green-400' : 'text-gray-400'}`}>
            {marketStatus || (marketHours.isOpen ? 'Open' : 'Closed')}
          </span>
        </div>
      </div>

      {/* Festival Countdown - Compact on mobile */}
      <motion.div
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-agents-growth/10 border border-agents-growth/20 flex-shrink-0"
        whileHover={{ scale: 1.02 }}
      >
        <Calendar size={12} className="text-agents-growth" />
        <span className="hidden sm:inline text-xs text-gray-300">{festivalCountdown.next}</span>
        <span className="text-xs sm:text-sm font-bold text-agents-growth">
          {festivalCountdown.daysUntil}d
        </span>
        <span className="hidden lg:inline text-xs text-agents-growth/70 font-mono bg-agents-growth/20 px-1.5 py-0.5 rounded">
          +{festivalCountdown.expectedDemandLift}%
        </span>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1 min-w-0" />

      {/* New Profile Button - Icon only on mobile */}
      <button
        onClick={() => setProfile(null)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 rounded border border-white/10 hover:border-white/20 transition-all flex-shrink-0"
        title="Start with new profile"
      >
        <RefreshCw size={12} />
        <span className="hidden sm:inline">New Profile</span>
      </button>

      {/* Current Time - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono flex-shrink-0">
        <Clock size={12} />
        {format(new Date(), 'HH:mm:ss')}
      </div>
    </div>
  );
};
