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
    <div className="fixed top-0 left-0 right-0 h-16 glass glass-dark border-b border-white/10 z-50 flex items-center px-6 gap-6 no-print">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-black bg-gradient-peach bg-clip-text text-transparent">
          NeoBI
        </div>
        <span className="text-xs px-2 py-1 rounded bg-agents-orchestrator/20 text-agents-orchestrator font-mono">
          v2.0
        </span>
      </div>

      {/* NIFTY Ticker */}
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
        whileHover={{ scale: 1.02 }}
      >
        <span className="text-xs text-gray-400">NIFTY 50</span>
        <span className="text-lg font-bold">{niftyLive.value.toFixed(0)}</span>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="text-sm font-semibold">
            {isPositive ? '+' : ''}{niftyLive.changePercent.toFixed(2)}%
          </span>
        </div>
      </motion.div>

      {/* Market Status */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
        <motion.div
          className={`w-2.5 h-2.5 rounded-full ${marketHours.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
          animate={marketHours.isOpen ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 1.5, repeat: marketHours.isOpen ? Infinity : 0 }}
        />
        <div className="flex flex-col leading-tight">
          <span className={`text-xs font-semibold ${marketHours.isOpen ? 'text-green-400' : 'text-gray-400'}`}>
            {marketStatus || (marketHours.isOpen ? 'Market Open' : 'Market Closed')}
          </span>
          {nextMarketTime && (
            <span className="text-[10px] text-gray-500">{nextMarketTime}</span>
          )}
        </div>
      </div>

      {/* Festival Countdown */}
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-agents-growth/10 border border-agents-growth/20"
        whileHover={{ scale: 1.02 }}
      >
        <Calendar size={14} className="text-agents-growth" />
        <span className="text-xs text-gray-300">{festivalCountdown.next}</span>
        <span className="text-sm font-bold text-agents-growth">
          {festivalCountdown.daysUntil}d
        </span>
        <span className="text-xs text-agents-growth/70 font-mono bg-agents-growth/20 px-1.5 py-0.5 rounded">
          +{festivalCountdown.expectedDemandLift}%
        </span>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* New Profile Button */}
      <button
        onClick={() => setProfile(null)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 rounded border border-white/10 hover:border-white/20 transition-all"
        title="Start with new profile"
      >
        <RefreshCw size={12} />
        New Profile
      </button>

      {/* Current Time */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
        <Clock size={12} />
        {format(new Date(), 'HH:mm:ss')}
      </div>
    </div>
  );
};
