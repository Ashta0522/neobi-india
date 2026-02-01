'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNeoBIStore } from '@/lib/store';
import { Gauge, Download, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateShareableReport } from '@/utils/shareableReport';

export const MetricsAndExportBar: React.FC = () => {
  const router = useRouter();
  const { metrics, currentResult, profile, selectedPath } = useNeoBIStore();
  const [shareLoading, setShareLoading] = useState(false);

  const exportOptions = [
    { label: 'PDF Report', icon: '📄', format: 'pdf' },
    { label: 'PNG Chart', icon: '🖼️', format: 'png' },
    { label: 'JSON+SHAP', icon: '📊', format: 'json' },
    { label: 'Audit Trail', icon: '📋', format: 'audit' },
  ];

  const handleShareReport = () => {
    if (!profile || !selectedPath || !currentResult) {
      alert('Please run intelligence first to generate a report');
      return;
    }

    setShareLoading(true);
    try {
      const report = generateShareableReport(profile, selectedPath, currentResult);
      router.push(`/report/${report.id}`);
    } catch (err) {
      console.error('Share failed:', err);
      alert('Failed to generate shareable report');
    } finally {
      setShareLoading(false);
    }
  };

  const handleExport = (format: string) => {
    try {
      if (format === 'json') {
        const payload = currentResult || { profile };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neobi-result-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      if (format === 'audit') {
        const audit = (window as any).__NEOBI_STORE__?.auditTrail || [];
        const csv = ['timestamp,action,details']
          .concat(
            (audit || []).map((entry: any) =>
              `"${new Date(entry.timestamp).toISOString()}","${entry.action}","${JSON.stringify(entry.details).replace(/"/g, '\\"')}"`
            )
          )
          .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neobi-audit-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      if (format === 'pdf') {
        // Best-effort: invoke print to allow user to save as PDF
        window.print();
        return;
      }

      if (format === 'png') {
        // PNG export not supported in-headless; fallback to JSON export of current result
        const payload = currentResult || { profile };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neobi-result-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
    } catch (err) {
      // graceful fallback
      console.error('Export failed', err);
      alert('Export failed — see console for details');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 glass glass-dark border-t border-white/10 px-6 py-3 no-print flex items-center gap-6 z-40">
      {/* Metrics Row */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Task Completion</span>
          <span className="font-bold text-agents-growth">{metrics.taskCompletionRate}%</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Decision Quality</span>
          <span className="font-bold text-agents-decision">{metrics.decisionQuality}%</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Latency (cached)</span>
          <span className="font-bold text-agents-coach">{metrics.latencyCached}ms</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Cost/Query</span>
          <span className="font-bold text-green-400">₹{metrics.costPerQuery}.00</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Share Report Button */}
      {currentResult && selectedPath && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShareReport}
          disabled={shareLoading}
          className="text-xs px-4 py-2 rounded bg-gradient-peach text-black hover:shadow-lg transition-all font-bold flex items-center gap-2 disabled:opacity-50"
          title="Share Report"
        >
          <Share2 size={14} />
          {shareLoading ? 'Generating...' : 'Share Report'}
        </motion.button>
      )}

      {/* Export Buttons */}
      <div className="flex items-center gap-2">
        {exportOptions.map((option) => (
          <motion.button
            key={option.format}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport(option.format)}
            className="text-xs px-3 py-2 rounded glass hover:bg-white/20 transition-all font-semibold"
            title={option.label}
          >
            {option.icon} {option.label}
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Was this helpful?</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="text-lg cursor-pointer"
        >
          👍
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="text-lg cursor-pointer"
        >
          👎
        </motion.button>
      </div>
    </div>
  );
};
