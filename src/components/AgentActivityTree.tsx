'use client';

import React, { useState, useMemo, memo } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { Agent } from '@/types';
import { ChevronDown, Zap, Brain, Cpu, Target, Users, Lightbulb, TrendingUp, GraduationCap, Heart, CheckCircle, Clock, Loader2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentActivityTreeProps {}

// Agent icons mapping
const AGENT_ICONS: Record<string, React.ReactNode> = {
  orchestrator: <Brain size={16} />,
  simulation_cluster: <Cpu size={16} />,
  decision_intelligence: <Target size={16} />,
  operations_optimizer: <Users size={16} />,
  personal_coach: <Heart size={16} />,
  innovation_advisor: <Lightbulb size={16} />,
  growth_strategist: <TrendingUp size={16} />,
  learning_adaptation: <GraduationCap size={16} />,
};

// Agent colors
const AGENT_COLORS: Record<string, string> = {
  orchestrator: '#A855F7',
  simulation_cluster: '#06B6D4',
  decision_intelligence: '#22C55E',
  operations_optimizer: '#F97316',
  personal_coach: '#14B8A6',
  innovation_advisor: '#EAB308',
  growth_strategist: '#EC4899',
  learning_adaptation: '#84CC16',
};

// Plain language status descriptions
const STATUS_LABELS: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  idle: { label: 'Ready', icon: <Clock size={10} />, description: 'Waiting for tasks' },
  thinking: { label: 'Analyzing', icon: <Loader2 size={10} className="animate-spin" />, description: 'Processing your query' },
  executing: { label: 'Working', icon: <Zap size={10} />, description: 'Executing recommendations' },
  complete: { label: 'Done', icon: <CheckCircle size={10} />, description: 'Task completed' },
  error: { label: 'Issue', icon: <AlertCircle size={10} />, description: 'Encountered a problem' },
};

// Plain language descriptions for what each agent does
const AGENT_PLAIN_DESCRIPTIONS: Record<string, string> = {
  orchestrator: 'Routes your question to the right experts',
  simulation_cluster: 'Forecasts market trends and demand patterns',
  decision_intelligence: 'Calculates best options with success probabilities',
  operations_optimizer: 'Finds ways to improve hiring, inventory & suppliers',
  personal_coach: 'Monitors your wellbeing and suggests breaks',
  innovation_advisor: 'Generates creative solutions and pivot ideas',
  growth_strategist: 'Plans marketing and customer acquisition',
  learning_adaptation: 'Learns from outcomes to improve future advice',
};

export const AgentActivityTree: React.FC<AgentActivityTreeProps> = () => {
  const { agents, selectedPath } = useNeoBIStore();
  const [expandedLevel, setExpandedLevel] = useState<string | null>('L1');

  const agentsByLevel = {
    L1: Object.values(agents).filter((a) => a.level === 'L1'),
    L2: Object.values(agents).filter((a) => a.level === 'L2'),
    L3: Object.values(agents).filter((a) => a.level === 'L3'),
    L4: Object.values(agents).filter((a) => a.level === 'L4'),
  };

  const renderAgent = (agent: Agent) => {
    const agentContrib = selectedPath?.agentContributions?.[agent.id] || agent.contribution || 0;
    const isActive = agent.status === 'thinking' || agent.status === 'executing';
    const isComplete = agent.status === 'complete';
    const agentColor = AGENT_COLORS[agent.id] || agent.color;
    const statusInfo = STATUS_LABELS[agent.status] || STATUS_LABELS.idle;
    const plainDescription = AGENT_PLAIN_DESCRIPTIONS[agent.id] || agent.description;

    return (
      <motion.div
        key={agent.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pl-4 py-3 border-l-2 transition-all relative group"
        style={{
          borderLeftColor: agentColor,
          backgroundColor: isActive ? `${agentColor}15` : `${agentColor}05`,
        }}
      >
        {/* Subtle constant glow for all agents */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: isActive ? [0.4, 0.7, 0.4] : [0.1, 0.2, 0.1],
          }}
          transition={{ duration: isActive ? 1.5 : 3, repeat: Infinity }}
          style={{
            background: `radial-gradient(ellipse at left, ${agentColor}${isActive ? '30' : '15'}, transparent 70%)`,
          }}
        />

        <div className="flex items-center gap-3 mb-1 relative">
          {/* Agent Icon with Constant Glow */}
          <motion.div
            className={`p-2 rounded-lg relative ${isActive ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: `${agentColor}${isActive ? '40' : '20'}`,
              boxShadow: `0 0 ${isActive ? '20' : '10'}px ${agentColor}${isActive ? '60' : '30'}`,
            }}
            animate={{
              scale: isActive ? [1, 1.1, 1] : [1, 1.02, 1],
              boxShadow: isActive
                ? [`0 0 10px ${agentColor}40`, `0 0 25px ${agentColor}70`, `0 0 10px ${agentColor}40`]
                : [`0 0 8px ${agentColor}25`, `0 0 12px ${agentColor}35`, `0 0 8px ${agentColor}25`],
            }}
            transition={{ duration: isActive ? 1 : 2.5, repeat: Infinity }}
          >
            <span style={{ color: agentColor }}>
              {AGENT_ICONS[agent.id] || agent.icon}
            </span>

            {/* Activity indicator - always visible but pulses faster when active */}
            <motion.div
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: agentColor }}
              animate={{
                scale: isActive ? [1, 1.4, 1] : [1, 1.15, 1],
                opacity: isActive ? [1, 0.5, 1] : [0.6, 0.9, 0.6],
              }}
              transition={{ duration: isActive ? 0.8 : 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Agent Name & Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-bold truncate"
                style={{ color: isActive ? agentColor : isComplete ? agentColor : '#fff' }}
              >
                {agent.name}
              </span>
              {/* Clear Status Badge */}
              <motion.span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap"
                style={{
                  backgroundColor: isActive ? `${agentColor}30` : isComplete ? '#22C55E20' : 'rgba(255,255,255,0.1)',
                  color: isActive ? agentColor : isComplete ? '#22C55E' : '#9CA3AF',
                }}
                animate={isActive ? { opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
              >
                {statusInfo.icon}
                {statusInfo.label}
              </motion.span>
            </div>
            {/* Plain Language Description */}
            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{plainDescription}</p>
          </div>

          {/* Contribution Badge with Tooltip */}
          <div className="relative">
            <motion.div
              className="text-xs font-mono px-2 py-1 rounded cursor-help"
              style={{
                backgroundColor: isActive || isComplete ? `${agentColor}20` : 'rgba(255,255,255,0.05)',
                color: agentColor,
              }}
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
              title={`This agent contributed ${agentContrib.toFixed(0)}% to the current analysis`}
            >
              {agentContrib.toFixed(0)}%
            </motion.div>
          </div>
        </div>

        {/* Status bar - always visible with subtle glow */}
        <motion.div
          className="mt-2 ml-11 h-1.5 rounded-full overflow-hidden bg-white/10"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: agentColor,
              boxShadow: `0 0 6px ${agentColor}`,
            }}
            initial={{ width: '0%' }}
            animate={{
              width: isActive ? ['40%', '80%', '40%'] : isComplete ? '100%' : `${Math.max(20, agentContrib * 2)}%`,
            }}
            transition={{
              duration: isActive ? 1.5 : 0.5,
              repeat: isActive ? Infinity : 0,
            }}
          />
        </motion.div>

        {/* Hover tooltip with more details */}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block pointer-events-none">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl w-48">
            <div className="text-xs font-bold text-white mb-1">{agent.name}</div>
            <p className="text-[10px] text-gray-300 mb-2">{agent.description}</p>
            <div className="flex items-center gap-1 text-[10px]">
              <span style={{ color: agentColor }}>{statusInfo.icon}</span>
              <span className="text-gray-400">{statusInfo.description}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const levelColors = {
    L1: '#A855F7',
    L2: '#06B6D4',
    L3: '#14B8A6',
    L4: '#84CC16',
  };

  // Calculate summary stats
  const agentStats = useMemo(() => {
    const allAgents = Object.values(agents);
    const active = allAgents.filter(a => a.status === 'thinking' || a.status === 'executing').length;
    const complete = allAgents.filter(a => a.status === 'complete').length;
    const idle = allAgents.filter(a => a.status === 'idle').length;
    return { active, complete, idle, total: allAgents.length };
  }, [agents]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <Zap size={16} className="text-agents-orchestrator" />
          </motion.div>
          Agent Activity Tree
        </h3>
        <p className="text-xs text-gray-400 mt-1">8 AI experts working on your query</p>
      </div>

      {/* Status Summary Bar - Clear counts */}
      <div className="px-4 py-2 border-b border-white/10 bg-black/20">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-3">
            {agentStats.active > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                <Loader2 size={10} className="animate-spin" />
                {agentStats.active} working
              </span>
            )}
            {agentStats.complete > 0 && (
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle size={10} />
                {agentStats.complete} done
              </span>
            )}
            {agentStats.idle > 0 && agentStats.active === 0 && (
              <span className="flex items-center gap-1 text-gray-400">
                <Clock size={10} />
                {agentStats.idle} ready
              </span>
            )}
          </div>
          <span className="text-gray-500">{agentStats.total} agents</span>
        </div>
      </div>

      {/* Agent Activity Dots - All agents glow */}
      <div className="px-4 py-2 border-b border-white/10 flex gap-2 items-center">
        <span className="text-[10px] text-gray-500 mr-1">Status:</span>
        {Object.entries(AGENT_COLORS).map(([id, color]) => {
          const agent = agents[id as keyof typeof agents];
          const isActive = agent?.status === 'thinking' || agent?.status === 'executing';
          const isComplete = agent?.status === 'complete';
          return (
            <motion.div
              key={id}
              className="w-3 h-3 rounded-full relative cursor-help"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 ${isActive ? '10' : '5'}px ${color}`,
                border: isComplete ? '2px solid #22C55E' : 'none',
              }}
              animate={{
                scale: isActive ? [1, 1.5, 1] : [1, 1.15, 1],
                boxShadow: isActive
                  ? [`0 0 5px ${color}`, `0 0 12px ${color}`, `0 0 5px ${color}`]
                  : [`0 0 3px ${color}`, `0 0 6px ${color}`, `0 0 3px ${color}`],
              }}
              transition={{ duration: isActive ? 0.8 : 2, repeat: Infinity }}
              title={`${agent?.name}: ${STATUS_LABELS[agent?.status || 'idle']?.label}`}
            />
          );
        })}
      </div>

      {/* Hierarchy */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {(['L1', 'L2', 'L3', 'L4'] as const).map((level) => {
          const levelAgents = agentsByLevel[level];
          const levelName = {
            L1: 'Central Orchestrator',
            L2: 'Decision Cluster (3 agents)',
            L3: 'Support Agents (3 agents)',
            L4: 'Learning & Adaptation',
          }[level];

          const hasActiveAgent = levelAgents.some(a => a.status === 'thinking' || a.status === 'executing');

          return (
            <div key={level}>
              <motion.button
                onClick={() => setExpandedLevel(expandedLevel === level ? null : level)}
                className="flex items-center gap-2 w-full text-left text-xs font-bold transition-colors py-2 px-2 rounded-lg"
                style={{
                  color: levelColors[level],
                  backgroundColor: hasActiveAgent ? `${levelColors[level]}15` : 'transparent',
                }}
                animate={hasActiveAgent ? {
                  backgroundColor: [`${levelColors[level]}10`, `${levelColors[level]}25`, `${levelColors[level]}10`],
                } : {}}
                transition={{ duration: 1.5, repeat: hasActiveAgent ? Infinity : 0 }}
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform ${expandedLevel === level ? 'rotate-0' : '-rotate-90'}`}
                />
                {level}: {levelName}
                {hasActiveAgent && (
                  <motion.span
                    className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${levelColors[level]}30` }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ACTIVE
                  </motion.span>
                )}
              </motion.button>
              <AnimatePresence>
                {expandedLevel === level && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {levelAgents.map(renderAgent)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
