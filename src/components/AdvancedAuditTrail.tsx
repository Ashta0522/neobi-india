'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, Search, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface AuditEntry {
  timestamp: Date;
  action: string;
  details: Record<string, any>;
  status?: 'success' | 'warning' | 'error';
  userId?: string;
  impact?: number;
}

interface AdvancedAuditTrailProps {
  entries: AuditEntry[];
  onExport: () => void;
}

const AdvancedAuditTrail: React.FC<AdvancedAuditTrailProps> = ({ entries, onExport }) => {
  const [filter, setFilter] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const filteredEntries = useMemo(
    () => entries.filter((e) => e.action.toLowerCase().includes(filter.toLowerCase())),
    [entries, filter]
  );

  const getIcon = (action: string) => {
    if (action.includes('success') || action.includes('complete')) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (action.includes('warning') || action.includes('override')) return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    if (action.includes('error')) return <AlertCircle className="w-4 h-4 text-red-400" />;
    return <Zap className="w-4 h-4 text-blue-400" />;
  };

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const entryVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-purple-500/30 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-purple-300">📋 Advanced Audit Trail</h3>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-purple-600/50 hover:bg-purple-600 rounded border border-purple-400/30 text-purple-100 transition-all"
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
        <input
          type="text"
          placeholder="Filter audit trail..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-purple-100 text-sm placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
        />
      </div>

      <div className="space-y-0 max-h-96 overflow-y-auto">
        <motion.div variants={timelineVariants} initial="hidden" animate="visible">
          {filteredEntries.map((entry, idx) => (
            <motion.div
              key={idx}
              variants={entryVariants}
              onClick={() => setExpandedId(expandedId === idx ? null : idx)}
              className="cursor-pointer border-l-2 border-purple-500/30 hover:border-purple-400 pl-4 py-3 transition-all bg-black/20 hover:bg-black/40 px-4 mb-2 rounded-r-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getIcon(entry.action)}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-200">{entry.action}</p>
                    <p className="text-xs text-purple-400/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {entry.impact && <span className="text-xs font-bold text-purple-300 bg-purple-600/30 px-2 py-1 rounded">{entry.impact}% impact</span>}
              </div>

              <AnimatePresence>
                {expandedId === idx && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-purple-500/20">
                    <pre className="text-xs text-purple-300/70 font-mono bg-black/60 p-3 rounded overflow-auto max-h-32">{JSON.stringify(entry.details, null, 2)}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-500/20 grid grid-cols-3 gap-2 text-xs text-purple-300">
        <div>Total Actions: {entries.length}</div>
        <div>Filtered: {filteredEntries.length}</div>
        <div>Time Span: {entries.length > 0 ? Math.round((Date.now() - entries[0].timestamp.getTime()) / 60000) : 0} min</div>
      </div>
    </motion.div>
  );
};

export default AdvancedAuditTrail;
