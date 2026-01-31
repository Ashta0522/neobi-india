'use client';

import React, { useState } from 'react';
import { useNeoBIStore } from '@/lib/store';
import { Agent } from '@/types';
import { ChevronDown, Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgentActivityTreeProps {}

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
    const totalContribution = Object.values(agents).reduce((sum, a) => sum + a.contribution, 1);
    const agentContrib = selectedPath?.agentContributions?.[agent.id] || agent.contribution || 0;

    return (
      <motion.div
        key={agent.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pl-4 py-2 border-l border-white/10 hover:border-white/30 transition-colors"
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`w-3 h-3 rounded-full ${
              agent.status === 'executing' ? 'bg-agents-growth animate-pulse' : 'bg-white/30'
            }`}
          />
          <span className="text-sm font-semibold" style={{ color: agent.color }}>
            {agent.icon} {agent.name}
          </span>
          <div className="ml-auto text-xs text-gray-400 font-mono">
            {agentContrib}%
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-5">{agent.description}</p>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap size={16} className="text-agents-orchestrator" />
          Agent Activity Tree
        </h3>
        <p className="text-xs text-gray-400 mt-1">Live status & contributions</p>
      </div>

      {/* Hierarchy */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* L1 */}
        <div>
          <button
            onClick={() => setExpandedLevel(expandedLevel === 'L1' ? null : 'L1')}
            className="flex items-center gap-2 w-full text-left text-xs font-bold text-agents-orchestrator hover:text-agents-growth transition-colors"
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${expandedLevel === 'L1' ? 'rotate-0' : '-rotate-90'}`}
            />
            L1: Central Orchestrator
          </button>
          {expandedLevel === 'L1' && <div>{agentsByLevel.L1.map(renderAgent)}</div>}
        </div>

        {/* L2 */}
        <div>
          <button
            onClick={() => setExpandedLevel(expandedLevel === 'L2' ? null : 'L2')}
            className="flex items-center gap-2 w-full text-left text-xs font-bold text-agents-simulation hover:text-agents-growth transition-colors"
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${expandedLevel === 'L2' ? 'rotate-0' : '-rotate-90'}`}
            />
            L2: Decision Cluster (3 agents)
          </button>
          {expandedLevel === 'L2' && <div>{agentsByLevel.L2.map(renderAgent)}</div>}
        </div>

        {/* L3 */}
        <div>
          <button
            onClick={() => setExpandedLevel(expandedLevel === 'L3' ? null : 'L3')}
            className="flex items-center gap-2 w-full text-left text-xs font-bold text-agents-coach hover:text-agents-growth transition-colors"
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${expandedLevel === 'L3' ? 'rotate-0' : '-rotate-90'}`}
            />
            L3: Support Agents (3 agents)
          </button>
          {expandedLevel === 'L3' && <div>{agentsByLevel.L3.map(renderAgent)}</div>}
        </div>

        {/* L4 */}
        <div>
          <button
            onClick={() => setExpandedLevel(expandedLevel === 'L4' ? null : 'L4')}
            className="flex items-center gap-2 w-full text-left text-xs font-bold text-agents-learning hover:text-agents-growth transition-colors"
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${expandedLevel === 'L4' ? 'rotate-0' : '-rotate-90'}`}
            />
            L4: Learning & Adaptation
          </button>
          {expandedLevel === 'L4' && <div>{agentsByLevel.L4.map(renderAgent)}</div>}
        </div>
      </div>
    </div>
  );
};
