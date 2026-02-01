import { BusinessProfile, DecisionPath, SimulationResult } from '@/types';

export interface ShareableReport {
  id: string;
  createdAt: string;
  profile: BusinessProfile;
  selectedPath: DecisionPath;
  simulationResult: SimulationResult;
  shareUrl: string;
}

/**
 * Generate a shareable report URL
 */
export function generateShareableReport(
  profile: BusinessProfile,
  selectedPath: DecisionPath,
  simulationResult: SimulationResult
): ShareableReport {
  const reportId = crypto.randomUUID().split('-')[0]; // Short ID
  const report: ShareableReport = {
    id: reportId,
    createdAt: new Date().toISOString(),
    profile,
    selectedPath,
    simulationResult,
    shareUrl: `${window.location.origin}/report/${reportId}`,
  };

  // Store in localStorage (in production, this would be a database)
  if (typeof window !== 'undefined') {
    const reports = JSON.parse(localStorage.getItem('neobi_reports') || '{}');
    reports[reportId] = report;
    localStorage.setItem('neobi_reports', JSON.stringify(reports));
  }

  return report;
}

/**
 * Retrieve a shareable report by ID
 */
export function getShareableReport(reportId: string): ShareableReport | null {
  if (typeof window === 'undefined') return null;

  const reports = JSON.parse(localStorage.getItem('neobi_reports') || '{}');
  return reports[reportId] || null;
}

/**
 * Generate WhatsApp share text
 */
export function generateWhatsAppText(report: ShareableReport): string {
  const { profile, selectedPath } = report;

  return `🚀 *NeoBI India Decision Report*

📊 *Business:* ${profile.name}
🏭 *Industry:* ${profile.industry}
💰 *MRR:* ₹${(profile.mrr / 100000).toFixed(1)}L

✅ *Recommended Path:* ${selectedPath.name}
📈 *Expected Revenue:* ₹${(selectedPath.benefits.revenue / 100000).toFixed(1)}L
⚠️ *Risk Score:* ${selectedPath.riskScore}/100
⏱️ *Timeline:* ${selectedPath.timeline} days

🔗 View full report: ${report.shareUrl}

🤖 Powered by NeoBI India - AI Co-pilot for Indian Entrepreneurs`;
}

/**
 * Generate email share text
 */
export function generateEmailText(report: ShareableReport): { subject: string; body: string } {
  const { profile, selectedPath } = report;

  return {
    subject: `NeoBI Decision Report: ${selectedPath.name} for ${profile.name}`,
    body: `Hi,

I wanted to share this decision analysis report from NeoBI India:

Business Profile:
- Name: ${profile.name}
- Industry: ${profile.industry}
- MRR: ₹${(profile.mrr / 100000).toFixed(1)}L
- Location: ${profile.location}

Recommended Strategy: ${selectedPath.name}

Key Insights:
- Expected Revenue Impact: ₹${(selectedPath.benefits.revenue / 100000).toFixed(1)}L
- Risk Score: ${selectedPath.riskScore}/100
- Implementation Timeline: ${selectedPath.timeline} days
- Operational Efficiency Gain: ${selectedPath.benefits.efficiency}%

View the complete interactive report here:
${report.shareUrl}

This report was generated using NeoBI India's multi-agent AI system, designed specifically for Indian entrepreneurs.

Best regards`
  };
}

/**
 * Copy report URL to clipboard
 */
export async function copyReportUrl(shareUrl: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    console.error('Failed to copy URL:', error);
    return false;
  }
}

/**
 * Generate QR code data URL for share URL
 */
export function generateQRCodeUrl(shareUrl: string): string {
  // Using QR Server API (free, no signup required)
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
}
