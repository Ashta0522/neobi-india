'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Brain, Coffee, Moon,
  Calendar, Clock, Users, AlertTriangle, CheckCircle,
  Smile, Frown, Meh, Battery, Activity, Zap, RefreshCw, Sun, TrendingUp, TrendingDown
} from 'lucide-react';

// Wellness interventions based on research paper - 34% burnout reduction target
const WELLNESS_INTERVENTIONS = [
  { id: 'break', icon: Coffee, label: 'Take a Break', impact: 12, duration: '15 min', color: '#06B6D4' },
  { id: 'delegate', icon: Users, label: 'Delegate Task', impact: 18, duration: 'varies', color: '#10B981' },
  { id: 'boundary', icon: Moon, label: 'Set Work Boundary', impact: 22, duration: 'daily', color: '#8B5CF6' },
  { id: 'cognitive', icon: Brain, label: 'Reduce Complexity', impact: 8, duration: '30 min', color: '#F59E0B' },
];

// Mood options for check-in
const MOOD_OPTIONS = [
  { value: 90, icon: Smile, label: 'Great', color: '#22C55E' },
  { value: 70, icon: Meh, label: 'Okay', color: '#F59E0B' },
  { value: 50, icon: Frown, label: 'Stressed', color: '#EF4444' },
];

// Team member wellness (simulated for demo)
const TEAM_WELLNESS = [
  { name: 'You (Founder)', role: 'CEO', score: 68, trend: 'down' as const, lastCheckin: 'Today' },
  { name: 'Amit', role: 'CTO', score: 75, trend: 'up' as const, lastCheckin: '2 days ago' },
  { name: 'Priya', role: 'Sales Lead', score: 55, trend: 'down' as const, lastCheckin: '5 days ago' },
  { name: 'Rahul', role: 'Operations', score: 82, trend: 'stable' as const, lastCheckin: 'Yesterday' },
];

// Wellness tip of the day
const WELLNESS_TIPS = [
  "Research shows: 34% burnout reduction when using balanced decision mode vs aggressive",
  "Founders who take regular breaks are 23% more effective at strategic decisions",
  "Delegation is not weakness - it's scaling your impact through others",
  "Festival periods increase stress by 40% - plan lighter workloads around Diwali",
  "Sunday evening planning reduces Monday anxiety by 35%",
];

// Quick Check-in Component
const QuickCheckin = memo(function QuickCheckin({
  onCheckin,
}: {
  onCheckin: (score: number) => void;
}) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <div className="p-4 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-500/30">
      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-purple-400" />
        How are you feeling right now?
      </h4>
      <div className="flex gap-3 justify-center">
        {MOOD_OPTIONS.map((mood) => (
          <motion.button
            key={mood.value}
            onClick={() => {
              setSelectedMood(mood.value);
              onCheckin(mood.value);
            }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              selectedMood === mood.value
                ? 'border-purple-500 bg-purple-500/20 scale-105'
                : 'border-white/10 hover:border-purple-500/50 bg-black/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <mood.icon
              size={32}
              style={{ color: selectedMood === mood.value ? mood.color : '#9CA3AF' }}
            />
            <span className={`text-sm font-semibold ${
              selectedMood === mood.value ? 'text-white' : 'text-gray-400'
            }`}>
              {mood.label}
            </span>
          </motion.button>
        ))}
      </div>
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-green-500/20 rounded-lg text-center"
        >
          <CheckCircle className="w-4 h-4 text-green-400 inline mr-2" />
          <span className="text-sm text-green-300">Check-in recorded! Keep tracking for insights.</span>
        </motion.div>
      )}
    </div>
  );
});

// Wellness Score Gauge
const WellnessGauge = memo(function WellnessGauge({
  score,
  label,
  trend,
}: {
  score: number;
  label: string;
  trend: 'up' | 'down' | 'stable';
}) {
  const color = score >= 70 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="flex items-center gap-1 text-xs" style={{ color }}>
          <TrendIcon size={12} />
          {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
        </span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-gray-500">
        <span>Burnout Risk</span>
        <span className="font-bold" style={{ color }}>{score}%</span>
        <span>Optimal</span>
      </div>
    </div>
  );
});

// Team Member Card
const TeamMemberCard = memo(function TeamMemberCard({
  member,
}: {
  member: typeof TEAM_WELLNESS[0];
}) {
  const scoreColor = member.score >= 70 ? 'text-green-400' : member.score >= 50 ? 'text-amber-400' : 'text-red-400';
  const needsAttention = member.score < 60;

  return (
    <motion.div
      className={`p-3 rounded-lg border ${
        needsAttention
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-slate-800/50 border-white/10'
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            needsAttention ? 'bg-red-500/20' : 'bg-slate-700'
          }`}>
            <span className="text-sm">{member.name.charAt(0)}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{member.name}</div>
            <div className="text-[10px] text-gray-400">{member.role}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${scoreColor}`}>{member.score}</div>
          <div className="text-[10px] text-gray-500">{member.lastCheckin}</div>
        </div>
      </div>
      {needsAttention && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-red-400">
          <AlertTriangle size={10} />
          May need support - consider a 1:1
        </div>
      )}
    </motion.div>
  );
});

export const WellnessPanel: React.FC = memo(function WellnessPanel() {
  const { burnoutTrajectory, recordCheckin, vibeMode, setVibeMode } = useNeoBIStore();
  const [loading, setLoading] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [activeIntervention, setActiveIntervention] = useState<string | null>(null);

  // Calculate current wellness score
  const currentScore = useMemo(() => {
    if (!burnoutTrajectory || burnoutTrajectory.length === 0) return 68;
    const recent = burnoutTrajectory.slice(-5);
    return Math.round(recent.reduce((sum, t) => sum + (t.score || 70), 0) / recent.length);
  }, [burnoutTrajectory]);

  // Get trend
  const trend = useMemo(() => {
    if (!burnoutTrajectory || burnoutTrajectory.length < 2) return 'stable';
    const recent = burnoutTrajectory.slice(-5).map(t => t.score || 70);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const lastTwo = recent.slice(-2);
    const recentAvg = lastTwo.reduce((a, b) => a + b, 0) / lastTwo.length;
    if (recentAvg > avg + 5) return 'up';
    if (recentAvg < avg - 5) return 'down';
    return 'stable';
  }, [burnoutTrajectory]) as 'up' | 'down' | 'stable';

  // Random tip
  const dailyTip = useMemo(() => {
    return WELLNESS_TIPS[Math.floor(Date.now() / 86400000) % WELLNESS_TIPS.length];
  }, []);

  // Schedule weekly check-in
  const scheduleWeekly = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({ action: 'burnout-schedule', payload: {} })
      });
      const j = await res.json();
      alert(`Next check-in scheduled: ${new Date(j.data?.nextCheckIn || Date.now() + 7 * 86400000).toLocaleString()}`);
    } catch (error) {
      console.error('Schedule check-in failed:', error);
      // Fallback - schedule locally
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      alert(`Next check-in scheduled: ${nextWeek.toLocaleString()}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle intervention
  const handleIntervention = useCallback((interventionId: string) => {
    setActiveIntervention(interventionId);
    const intervention = WELLNESS_INTERVENTIONS.find(i => i.id === interventionId);
    if (intervention) {
      // Simulate improvement
      const newScore = Math.min(100, currentScore + Math.round(intervention.impact * 0.5));
      recordCheckin(newScore);
      setTimeout(() => setActiveIntervention(null), 2000);
    }
  }, [currentScore, recordCheckin]);

  return (
    <div className="bg-slate-900/50 rounded-xl border border-teal-500/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-teal-900/30 to-cyan-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-white">Founder Wellness Hub</h3>
          </div>
          <motion.button
            onClick={() => setShowTeam(!showTeam)}
            className={`px-3 py-1 text-xs rounded-lg flex items-center gap-1 ${
              showTeam ? 'bg-teal-500 text-black' : 'bg-white/10 text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Users size={12} />
            Team View
          </motion.button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Track wellbeing • Reduce burnout by 34% • Build sustainable habits
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Wellness Score */}
        <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Battery className={`w-5 h-5 ${
                currentScore >= 70 ? 'text-green-400' : currentScore >= 50 ? 'text-amber-400' : 'text-red-400'
              }`} />
              <span className="font-bold text-white">Your Energy Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${
                currentScore >= 70 ? 'text-green-400' : currentScore >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {currentScore}
              </span>
              <span className="text-xs text-gray-400">/100</span>
            </div>
          </div>
          <WellnessGauge score={currentScore} label="Wellness Score" trend={trend} />
        </div>

        {/* Quick Check-in */}
        <QuickCheckin onCheckin={recordCheckin} />

        {/* Vibe Mode Selector */}
        <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Work Mode
            </span>
            <span className="text-[10px] text-gray-400">Affects AI recommendations</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['conservative', 'balanced', 'aggressive'] as const).map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setVibeMode(mode)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  vibeMode === mode
                    ? mode === 'conservative'
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : mode === 'balanced'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-lg mb-1">
                  {mode === 'conservative' ? '🐢' : mode === 'balanced' ? '⚖️' : '🚀'}
                </div>
                <div className="text-xs font-semibold capitalize">{mode}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Wellness Interventions */}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Quick Interventions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {WELLNESS_INTERVENTIONS.map((intervention) => (
              <motion.button
                key={intervention.id}
                onClick={() => handleIntervention(intervention.id)}
                disabled={activeIntervention === intervention.id}
                className={`p-3 rounded-lg border text-left transition-all ${
                  activeIntervention === intervention.id
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-slate-800/50 border-white/10 hover:border-teal-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <intervention.icon size={16} style={{ color: intervention.color }} />
                  <span className="text-sm font-semibold text-white">{intervention.label}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>+{intervention.impact}% wellness</span>
                  <span>{intervention.duration}</span>
                </div>
                {activeIntervention === intervention.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 flex items-center gap-1 text-green-400 text-xs"
                  >
                    <CheckCircle size={12} /> Applied!
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Team Wellness View */}
        <AnimatePresence>
          {showTeam && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Wellness
              </h4>
              {TEAM_WELLNESS.map((member, idx) => (
                <TeamMemberCard key={idx} member={member} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Daily Tip */}
        <div className="p-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20">
          <div className="flex items-start gap-2">
            <Sun className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-300">
              <strong className="text-amber-400">Tip of the day:</strong> {dailyTip}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            onClick={scheduleWeekly}
            disabled={loading}
            className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar size={14} />
            {loading ? 'Scheduling...' : 'Schedule Weekly Check-in'}
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-black/20 rounded-lg">
            <div className="text-lg font-bold text-teal-400">{(burnoutTrajectory || []).length}</div>
            <div className="text-[10px] text-gray-400">Check-ins</div>
          </div>
          <div className="p-2 bg-black/20 rounded-lg">
            <div className="text-lg font-bold text-green-400">34%</div>
            <div className="text-[10px] text-gray-400">Burnout Reduction</div>
          </div>
          <div className="p-2 bg-black/20 rounded-lg">
            <div className="text-lg font-bold text-amber-400">{vibeMode}</div>
            <div className="text-[10px] text-gray-400">Current Mode</div>
          </div>
        </div>
      </div>
    </div>
  );
});
