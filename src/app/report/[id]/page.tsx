'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Share2, Copy, MessageCircle, Mail, QrCode, Download,
  TrendingUp, AlertTriangle, Clock, DollarSign, Users, Target,
  ChevronLeft, CheckCircle, Map, ArrowRight, Brain, FileText
} from 'lucide-react';
import { getShareableReport, generateWhatsAppText, generateEmailText, copyReportUrl, generateQRCodeUrl, ShareableReport } from '@/utils/shareableReport';

// Roadmap Data Interface
interface RoadmapExport {
  decisionHistory: string[];
  profile: any;
  timestamp: string;
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<ShareableReport | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState<RoadmapExport | null>(null);

  useEffect(() => {
    if (reportId) {
      const fetchedReport = getShareableReport(reportId);
      setReport(fetchedReport);
      setLoading(false);

      // Try to load roadmap export data
      if (typeof window !== 'undefined') {
        const savedRoadmap = localStorage.getItem('neobi_roadmap_export');
        if (savedRoadmap) {
          try {
            setRoadmapData(JSON.parse(savedRoadmap));
          } catch (e) {
            console.error('Failed to parse roadmap data:', e);
          }
        }
      }
    }
  }, [reportId]);

  // Calculate optimal path based on profile
  const getOptimalPath = (profile: any) => {
    const riskTolerance = profile?.riskTolerance || 'medium';

    if (riskTolerance === 'low') {
      return {
        strategy: 'Conservative Path',
        steps: ['Focus on customer retention', 'Build cash reserves', 'Optimize profit margins', 'Organic growth only'],
        expectedROI: '60-80%',
        risk: 'Low (20/100)',
        timeline: '12-18 months',
      };
    } else if (riskTolerance === 'high') {
      return {
        strategy: 'Aggressive Scaling',
        steps: ['Raise funding immediately', 'Hire aggressively', 'Multi-city expansion', 'Heavy marketing spend'],
        expectedROI: '150-200%',
        risk: 'High (72/100)',
        timeline: '3-6 months',
      };
    } else {
      return {
        strategy: 'Balanced Growth',
        steps: ['Optimize operations', 'Strategic hiring (3-5 roles)', 'Phased expansion', 'Focus on unit economics'],
        expectedROI: '100-120%',
        risk: 'Medium (45/100)',
        timeline: '6-12 months',
      };
    }
  };

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
    <div className="min-h-screen bg-raven-base print:bg-white print:text-black">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .glass, .glass-dark { background: white !important; border: 1px solid #e5e7eb !important; }
          .text-white { color: #111827 !important; }
          .text-gray-300, .text-gray-400 { color: #4b5563 !important; }
          .text-agents-growth { color: #059669 !important; }
          .text-purple-400, .text-purple-300 { color: #7c3aed !important; }
          .text-blue-400, .text-blue-300 { color: #2563eb !important; }
          .text-green-400, .text-green-300 { color: #059669 !important; }
          .text-orange-400 { color: #d97706 !important; }
          .text-red-400 { color: #dc2626 !important; }
          .bg-white\\/5, .bg-black\\/40, .bg-white\\/10 { background: #f9fafb !important; }
          .bg-blue-900\\/30, .bg-green-900\\/30, .bg-purple-900\\/20 { background: #f3f4f6 !important; border: 1px solid #d1d5db !important; }
          .border-white\\/10 { border-color: #e5e7eb !important; }
          h2, h3, h4 { color: #111827 !important; }
          .particle-bg { display: none !important; }
          .sticky { position: relative !important; }
          @page { margin: 1cm; }
        }
      `}</style>
      {/* Particle Background */}
      <div className="particle-bg print:hidden" />

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

          <div className="flex items-center gap-2 print:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
              className="px-3 py-2 glass hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold"
              title="Print/Save as PDF"
            >
              <Download size={16} />
              Save PDF
            </motion.button>
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
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setShowQR(false)}
          >
            <div className="glass p-6 rounded-2xl text-center max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Scan to View Report</h3>
              <div className="bg-white p-3 rounded-lg inline-block mb-4">
                <img
                  src={generateQRCodeUrl(report.shareUrl)}
                  alt="QR Code"
                  className="mx-auto"
                  width={180}
                  height={180}
                />
              </div>
              <p className="text-sm text-gray-400 mb-2">Scan with any QR code reader</p>
              {report.shareUrl.includes('localhost') && (
                <div className="text-xs text-amber-400 bg-amber-500/10 rounded-lg p-2 mb-4">
                  ⚠️ QR links to localhost - only works on this device. In production, the link will be publicly accessible.
                </div>
              )}
              <div className="space-y-2">
                <button
                  onClick={handleCopyLink}
                  className="w-full px-4 py-2 bg-agents-growth/20 hover:bg-agents-growth/30 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? <><CheckCircle size={16} className="text-green-400" /> Copied!</> : <><Copy size={16} /> Copy Link</>}
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
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

        {/* Roadmap Comparison Section */}
        {roadmapData && roadmapData.decisionHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-2xl mt-6 print:break-before-page print:mt-8"
          >
            <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2 print:text-2xl print:mb-4">
              <Map size={24} className="text-purple-400" />
              Decision Roadmap Comparison
            </h2>
            <p className="text-sm text-gray-400 mb-6 print:text-base print:mb-4">
              Your exploration path vs AI-recommended optimal strategy
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* User's Explored Path */}
              <div className="p-5 bg-blue-900/30 rounded-xl border-2 border-blue-500/50 print:border-blue-500">
                <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2 text-base print:text-lg">
                  <Users size={20} />
                  Your Explored Path ({roadmapData.decisionHistory.length} steps)
                </h3>
                <div className="space-y-3">
                  {roadmapData.decisionHistory.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 print:text-base">
                      <span className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 print:w-8 print:h-8">
                        {idx + 1}
                      </span>
                      <span className="text-white text-sm pt-1 print:text-base">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Optimal Path */}
              <div className="p-5 bg-green-900/30 rounded-xl border-2 border-green-500/50 print:border-green-500">
                <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2 text-base print:text-lg">
                  <Brain size={20} />
                  AI Optimal: {getOptimalPath(profile).strategy}
                </h3>
                <div className="space-y-3">
                  {getOptimalPath(profile).steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 print:text-base">
                      <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 print:w-8 print:h-8">
                        {idx + 1}
                      </span>
                      <span className="text-white text-sm pt-1 print:text-base">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg text-center border border-green-500/30 print:border-green-500">
                <div className="text-xs text-gray-400 mb-1 print:text-sm">Expected ROI</div>
                <div className="font-black text-2xl text-green-400 print:text-3xl">{getOptimalPath(profile).expectedROI}</div>
                <div className="text-xs text-green-400/60 mt-1">annual return</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center border border-orange-500/30 print:border-orange-500">
                <div className="text-xs text-gray-400 mb-1 print:text-sm">Risk Level</div>
                <div className="font-black text-2xl text-orange-400 print:text-3xl">{getOptimalPath(profile).risk}</div>
                <div className="text-xs text-orange-400/60 mt-1">risk score</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center border border-blue-500/30 print:border-blue-500">
                <div className="text-xs text-gray-400 mb-1 print:text-sm">Timeline</div>
                <div className="font-black text-2xl text-blue-400 print:text-3xl">{getOptimalPath(profile).timeline}</div>
                <div className="text-xs text-blue-400/60 mt-1">to achieve</div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="p-5 bg-purple-900/20 rounded-xl border-2 border-purple-500/50 print:border-purple-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <Brain size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-purple-300 mb-2 print:text-lg">AI Recommendation Summary</div>
                  <p className="text-sm text-gray-300 leading-relaxed print:text-base">
                    Based on your business profile <strong>({profile.industry} in {profile.location})</strong> with
                    ₹{(profile.mrr / 100000).toFixed(1)}L MRR and {profile.teamSize} team members,
                    the <span className="text-green-400 font-bold">{getOptimalPath(profile).strategy}</span> offers
                    the best balance of growth potential ({getOptimalPath(profile).expectedROI} ROI) and risk management
                    ({getOptimalPath(profile).risk}).
                  </p>
                  <p className="text-sm text-gray-300 mt-3 leading-relaxed print:text-base">
                    <strong>Key Insight:</strong> Your explored path demonstrates thoughtful decision-making.
                    For optimal results, focus on the top 2-3 strategies that align with your current
                    resources and growth trajectory within the {getOptimalPath(profile).timeline} timeframe.
                  </p>
                </div>
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
