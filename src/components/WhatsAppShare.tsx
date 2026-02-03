'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareableReport {
  id: string;
  type: string;
  title: string;
  summary: string;
  metrics?: Record<string, string | number>;
  generatedAt: string;
}

interface WhatsAppShareProps {
  reports?: ShareableReport[];
  businessName?: string;
  onShare?: (report: ShareableReport, phoneNumber?: string) => void;
}

const DEFAULT_REPORTS: ShareableReport[] = [
  {
    id: '1',
    type: 'financial',
    title: 'Financial Summary',
    summary: 'Monthly financial overview with cash flow and GST compliance',
    metrics: { revenue: '₹25L', expenses: '₹18L', profit: '₹7L', gstStatus: 'Compliant' },
    generatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'market',
    title: 'Market Analysis',
    summary: 'Competitor benchmarking and market entry recommendations',
    metrics: { marketShare: '8%', growthRate: '65%', rank: '#4 of 10' },
    generatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'roadmap',
    title: 'Strategy Roadmap',
    summary: 'AI-recommended decisions and implementation timeline',
    metrics: { decisions: 5, roi: '42%', timeline: '6 months' },
    generatedAt: new Date().toISOString(),
  },
];

const WhatsAppShare: React.FC<WhatsAppShareProps> = ({
  reports = DEFAULT_REPORTS,
  businessName = 'My Business',
  onShare,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ShareableReport | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [shareMethod, setShareMethod] = useState<'link' | 'direct'>('link');
  const [recentShares, setRecentShares] = useState<{ phone: string; report: string; time: string }[]>([]);

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    // Add India country code if not present
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    return cleaned;
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 12;
  };

  const generateShareMessage = (report: ShareableReport): string => {
    const date = new Date(report.generatedAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let message = `📊 *${businessName} - ${report.title}*\n\n`;
    message += `📅 Generated: ${date}\n\n`;
    message += `📋 *Summary:*\n${report.summary}\n\n`;

    if (report.metrics) {
      message += `📈 *Key Metrics:*\n`;
      Object.entries(report.metrics).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        message += `• ${formattedKey}: ${value}\n`;
      });
    }

    message += `\n🤖 Powered by NeoBI India`;

    if (customMessage) {
      message = customMessage + '\n\n---\n\n' + message;
    }

    return encodeURIComponent(message);
  };

  const shareViaWhatsApp = (report: ShareableReport) => {
    const message = generateShareMessage(report);

    if (shareMethod === 'direct' && phoneNumber) {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');

      // Track share
      setRecentShares(prev => [
        { phone: phoneNumber, report: report.title, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4),
      ]);
    } else {
      // Open WhatsApp with pre-filled message (user chooses contact)
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }

    if (onShare) {
      onShare(report, phoneNumber || undefined);
    }
  };

  const shareViaWhatsAppBusiness = (report: ShareableReport) => {
    const message = generateShareMessage(report);
    // WhatsApp Business API deep link (for businesses with API access)
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const copyToClipboard = async (report: ShareableReport) => {
    const message = decodeURIComponent(generateShareMessage(report));
    await navigator.clipboard.writeText(message);
    alert('Report copied to clipboard! Paste it in WhatsApp.');
  };

  const reportIcons: Record<string, string> = {
    financial: '💰',
    market: '📊',
    roadmap: '🗺️',
    gst: '📋',
    workforce: '👥',
    funding: '💎',
  };

  const content = (
    <div className={expanded ? 'p-6' : 'p-4'}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">WhatsApp Share</h3>
            <p className="text-xs text-gray-400">Share reports instantly</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Quick Share Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {reports.slice(0, 3).map((report) => (
          <button
            key={report.id}
            onClick={() => shareViaWhatsApp(report)}
            className="p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors group"
          >
            <span className="text-xl">{reportIcons[report.type] || '📄'}</span>
            <p className="text-xs text-white mt-1 truncate">{report.title.split(' ')[0]}</p>
            <p className="text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">Share →</p>
          </button>
        ))}
      </div>

      {expanded && (
        <>
          {/* Share Method Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShareMethod('link')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                shareMethod === 'link'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              📤 Share Link
            </button>
            <button
              onClick={() => setShareMethod('direct')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                shareMethod === 'direct'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              📱 Direct Message
            </button>
          </div>

          {/* Phone Number Input (for direct message) */}
          {shareMethod === 'direct' && (
            <div className="mb-4">
              <label className="text-xs text-gray-400 block mb-1">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-white/5 rounded-l-lg text-gray-400 border border-white/10 border-r-0">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9876543210"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  maxLength={10}
                />
              </div>
              {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                <p className="text-xs text-red-400 mt-1">Please enter a valid 10-digit number</p>
              )}
            </div>
          )}

          {/* Custom Message */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-1">Add Personal Message (Optional)</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Hi! Here's the latest report from our meeting..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
              rows={2}
            />
          </div>

          {/* Available Reports */}
          <div className="mb-4">
            <h4 className="text-sm text-white font-medium mb-2">Available Reports</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedReport?.id === report.id
                      ? 'bg-green-500/20 border-green-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{reportIcons[report.type] || '📄'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{report.title}</p>
                      <p className="text-gray-400 text-xs truncate">{report.summary}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareViaWhatsApp(report);
                      }}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs transition-colors"
                    >
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Shares */}
          {recentShares.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm text-white font-medium mb-2">Recent Shares</h4>
              <div className="space-y-2">
                {recentShares.map((share, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-xs">
                    <span className="text-gray-400">📱 {share.phone}</span>
                    <span className="text-gray-300">{share.report}</span>
                    <span className="text-gray-500">{share.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => selectedReport && copyToClipboard(selectedReport)}
              disabled={!selectedReport}
              className="py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            >
              📋 Copy Text
            </button>
            <button
              onClick={() => selectedReport && shareViaWhatsAppBusiness(selectedReport)}
              disabled={!selectedReport}
              className="py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            >
              💼 WA Business
            </button>
          </div>

          {/* WhatsApp Business API Info */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400">
              💡 <span className="text-white">Tip:</span> For bulk messaging and automated reports,
              integrate with WhatsApp Business API. Contact your admin for API setup.
            </p>
          </div>
        </>
      )}
    </div>
  );

  if (expanded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={() => setExpanded(false)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-white/10">
      {content}
    </div>
  );
};

export default WhatsAppShare;
