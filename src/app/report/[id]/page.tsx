'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Share2, Copy, MessageCircle, Mail, QrCode, Download,
  TrendingUp, AlertTriangle, Clock, DollarSign, Users, Target,
  ChevronLeft, CheckCircle
} from 'lucide-react';
import { getShareableReport, generateWhatsAppText, generateEmailText, copyReportUrl, generateQRCodeUrl, ShareableReport } from '@/utils/shareableReport';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<ShareableReport | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reportId) {
      const fetchedReport = getShareableReport(reportId);
      setReport(fetchedReport);
      setLoading(false);
    }
  }, [reportId]);

  const handleCopyLink = async () => {
    if (!report) return;
    const success = await copyReportUrl(report.shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (!report) return;
    const text = generateWhatsAppText(report);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailShare = () => {
    if (!report) return;
    const { subject, body } = generateEmailText(report);
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-raven-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-agents-growth border-t-transparent mb-4"></div>
          <h3 className="text-xl font-bold text-white">Loading report...</h3>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-raven-base flex items-center justify-center">
        <div className="text-center max-w-md glass p-8 rounded-2xl">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">Report Not Found</h3>
          <p className="text-gray-400 mb-6">The report you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-peach text-black font-bold rounded-lg hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { profile, selectedPath, simulationResult } = report;

  return (
    <div className="min-h-screen bg-raven-base">
      {/* Particle Background */}
      <div className="particle-bg" />

      {/* Header */}
      <div className="glass glass-dark border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-semibold">Back to Dashboard</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black bg-gradient-peach bg-clip-text text-transparent">
              NeoBI India Report
            </h1>
            <span className="text-xs text-gray-400">
              {new Date(report.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="p-2 glass hover:bg-white/20 rounded-lg transition-all"
              title="Copy link"
            >
              {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsAppShare}
              className="p-2 glass hover:bg-white/20 rounded-lg transition-all"
              title="Share on WhatsApp"
            >
              <MessageCircle size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEmailShare}
              className="p-2 glass hover:bg-white/20 rounded-lg transition-all"
              title="Share via Email"
            >
              <Mail size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQR(!showQR)}
              className="p-2 glass hover:bg-white/20 rounded-lg transition-all"
              title="Show QR Code"
            >
              <QrCode size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* QR Code Modal */}
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center"
            onClick={() => setShowQR(false)}
          >
            <div className="glass p-8 rounded-2xl text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Scan to View Report</h3>
              <img src={generateQRCodeUrl(report.shareUrl)} alt="QR Code" className="mx-auto rounded-lg" />
              <p className="text-sm text-gray-400 mt-4">Scan with any QR code reader</p>
              <button
                onClick={() => setShowQR(false)}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* Business Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl mb-6"
        >
          <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
            <DollarSign size={24} className="text-agents-growth" />
            {profile.name}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Industry</div>
              <div className="font-bold text-white">{profile.industry}</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Monthly Revenue</div>
              <div className="font-bold text-agents-growth">₹{(profile.mrr / 100000).toFixed(1)}L</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Customers</div>
              <div className="font-bold text-white flex items-center justify-center gap-1">
                <Users size={14} />
                {profile.customers}
              </div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Team Size</div>
              <div className="font-bold text-white">{profile.teamSize}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span>📍 Location:</span>
              <span className="text-white font-semibold">{profile.location}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-gray-400">
              <Target size={14} />
              <span>Growth Target:</span>
              <span className="text-agents-growth font-semibold">{profile.growthTarget}%/year</span>
            </div>
          </div>
        </motion.div>

        {/* Recommended Strategy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl mb-6 bg-gradient-to-br from-agents-growth/20 to-transparent border border-agents-growth/30"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={24} className="text-agents-growth" />
              <h2 className="text-xl font-black text-white">Recommended Strategy</h2>
            </div>
            <div className="text-xs px-3 py-1 bg-agents-growth/20 rounded-full text-agents-growth font-bold">
              AI Recommended
            </div>
          </div>

          <h3 className="text-2xl font-black text-agents-growth mb-2">{selectedPath.name}</h3>
          <p className="text-gray-300 mb-4">{selectedPath.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-gray-400 mb-1">Expected Revenue Impact</div>
              <div className="font-black text-xl text-agents-growth">
                ₹{(selectedPath.benefits.revenue / 100000).toFixed(1)}L
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-gray-400 mb-1">Risk Score</div>
              <div className={`font-black text-xl ${
                selectedPath.riskScore > 60 ? 'text-red-400' :
                selectedPath.riskScore > 30 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {selectedPath.riskScore}/100
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Clock size={12} />
                Timeline
              </div>
              <div className="font-black text-xl text-white">{selectedPath.timeline} days</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-gray-400 mb-1">Efficiency Gain</div>
              <div className="font-black text-xl text-agents-growth">+{selectedPath.benefits.efficiency}%</div>
            </div>
          </div>

          {selectedPath.steps && selectedPath.steps.length > 0 && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-gray-400 mb-2">Implementation Steps</div>
              <div className="space-y-2">
                {selectedPath.steps.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-agents-growth font-bold">{idx + 1}.</span>
                    <span className="text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPath.risks && selectedPath.risks.length > 0 && (
            <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertTriangle size={16} />
                <span className="text-xs font-bold">Risk Factors</span>
              </div>
              <ul className="space-y-1">
                {selectedPath.risks.map((risk: string, idx: number) => (
                  <li key={idx} className="text-xs text-red-300 flex items-start gap-2">
                    <span>•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Simulation Metrics */}
        {simulationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-2xl"
          >
            <h2 className="text-xl font-black text-white mb-4">Simulation Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Confidence Score</div>
                <div className="font-black text-2xl text-agents-growth">{simulationResult.confidence}%</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Execution Time</div>
                <div className="font-black text-2xl text-white">{(simulationResult.executionTime / 1000).toFixed(1)}s</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Cost per Query</div>
                <div className="font-black text-2xl text-green-400">₹{simulationResult.costUsed.toFixed(2)}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>🤖 Powered by <span className="text-agents-growth font-bold">NeoBI India</span> - AI Co-pilot for Indian Entrepreneurs</p>
          <p className="mt-2 text-xs">
            This report was generated using multi-agent AI simulation specifically designed for the Indian market.
          </p>
        </div>
      </div>
    </div>
  );
}
