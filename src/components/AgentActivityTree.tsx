'use client';

import React, { useState } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { Agent } from '@/types';
import { ChevronDown, Zap, Brain, Cpu, Target, Users, Lightbulb, TrendingUp, GraduationCap, Heart } from 'lucide-react';
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

    return (
      <motion.div
        key={agent.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pl-4 py-3 border-l-2 transition-all relative"
        style={{
          borderLeftColor: isActive ? agentColor : 'rgba(255,255,255,0.1)',
          backgroundColor: isActive ? `${agentColor}10` : 'transparent',
        }}
      >
        {/* Glowing effect when active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              background: `radial-gradient(ellipse at left, ${agentColor}20, transparent 70%)`,
            }}
          />
        )}

        <div className="flex items-center gap-3 mb-1 relative">
          {/* Agent Icon with Glow */}
          <motion.div
            className={`p-2 rounded-lg relative ${isActive ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: isActive || isComplete ? `${agentColor}30` : 'rgba(255,255,255,0.05)',
              boxShadow: isActive ? `0 0 20px ${agentColor}60, 0 0 40px ${agentColor}30` : 'none',
            }}
            animate={isActive ? {
              scale: [1, 1.1, 1],
              boxShadow: [
                `0 0 10px ${agentColor}40`,
                `0 0 25px ${agentColor}70`,
                `0 0 10px ${agentColor}40`,
              ],
            } : {}}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
          >
            <span style={{ color: agentColor }}>
              {AGENT_ICONS[agent.id] || agent.icon}
            </span>

            {/* Activity indicator */}
            {isActive && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: agentColor }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* Agent Name */}
          <div className="flex-1">
            <span
              className="text-sm font-bold"
              style={{ color: isActive ? agentColor : isComplete ? agentColor : '#fff' }}
            >
              {agent.name}
            </span>
            {isActive && (
              <motion.span
                className="ml-2 text-xs"
                style={{ color: agentColor }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Processing...
              </motion.span>
            )}
          </div>

          {/* Contribution Badge */}
          <motion.div
            className="text-xs font-mono px-2 py-1 rounded"
            style={{
              backgroundColor: isActive || isComplete ? `${agentColor}20` : 'rgba(255,255,255,0.05)',
              color: agentColor,
            }}
            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
          >
            {agentContrib.toFixed(0)}%
          </motion.div>
        </div>

        <p className="text-xs text-gray-500 ml-11">{agent.description}</p>

        {/* Status bar */}
        {(isActive || isComplete) && (
          <motion.div
            className="mt-2 ml-11 h-1 rounded-full overflow-hidden bg-white/10"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: agentColor }}
              initial={{ width: '0%' }}
              animate={{ width: isComplete ? '100%' : '60%' }}
              transition={{ duration: isActive ? 2 : 0.5, repeat: isActive ? Infinity : 0 }}
            />
          </motion.div>
        )}
      </motion.div>
    );
  };

  const levelColors = {
    L1: '#A855F7',
    L2: '#06B6D4',
    L3: '#14B8A6',
    L4: '#84CC16',
  };

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
        <p className="text-xs text-gray-400 mt-1">Live status & contributions</p>
      </div>

      {/* Agent Activity Summary */}
      <div className="px-4 py-2 border-b border-white/10 flex gap-2">
        {Object.entries(AGENT_COLORS).map(([id, color]) => {
          const agent = agents[id as keyof typeof agents];
          const isActive = agent?.status === 'thinking' || agent?.status === 'executing';
          return (
            <motion.div
              key={id}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
              animate={isActive ? {
                scale: [1, 1.5, 1],
                boxShadow: [`0 0 0px ${color}`, `0 0 8px ${color}`, `0 0 0px ${color}`],
              } : {}}
              transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
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
