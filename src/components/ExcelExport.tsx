'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  exportBusinessProfile,
  exportFinancialReport,
  exportCompetitorAnalysis,
  exportRoadmapDecisions,
  exportMarketAnalysis,
  exportWorkforcePlan,
} from '@/lib/excel-export';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'profile',
    name: 'Business Profile',
    description: 'Company details, industry, MRR, team size',
    icon: '🏢',
    color: 'from-blue-500/20 to-blue-600/20',
  },
  {
    id: 'financial',
    name: 'Financial Report',
    description: 'Cash flow, GST summary, invoices',
    icon: '💰',
    color: 'from-green-500/20 to-green-600/20',
  },
  {
    id: 'competitor',
    name: 'Competitor Analysis',
    description: 'Benchmark scores, market share, growth',
    icon: '📊',
    color: 'from-purple-500/20 to-purple-600/20',
  },
  {
    id: 'roadmap',
    name: 'Roadmap Decisions',
    description: 'Decision history with ROI and timeline',
    icon: '🗺️',
    color: 'from-orange-500/20 to-orange-600/20',
  },
  {
    id: 'market',
    name: 'Market Analysis',
    description: 'State comparison, risk factors',
    icon: '🎯',
    color: 'from-pink-500/20 to-pink-600/20',
  },
  {
    id: 'workforce',
    name: 'Workforce Plan',
    description: 'Staffing projection, role requirements',
    icon: '👥',
    color: 'from-teal-500/20 to-teal-600/20',
  },
];

interface ExcelExportProps {
  businessProfile?: any;
  financialData?: any;
  competitorData?: any;
  roadmapDecisions?: any[];
  marketData?: any;
  workforceData?: any;
}

const ExcelExport: React.FC<ExcelExportProps> = ({
  businessProfile = {
    companyName: 'Demo Startup Pvt Ltd',
    industry: 'Technology',
    location: 'Mumbai, Maharashtra',
    mrr: 850000,
    teamSize: 25,
    foundedYear: 2022,
    revenueStage: 'Growth',
  },
  financialData = {
    cashflow: [
      { period: 'Week 1', inflow: 250000, outflow: 180000, net: 70000, balance: 1070000 },
      { period: 'Week 2', inflow: 320000, outflow: 200000, net: 120000, balance: 1190000 },
      { period: 'Week 3', inflow: 280000, outflow: 220000, net: 60000, balance: 1250000 },
      { period: 'Week 4', inflow: 350000, outflow: 190000, net: 160000, balance: 1410000 },
    ],
    gst: {
      totalSales: 2500000,
      outputTax: 450000,
      inputTax: 324000,
      netPayable: 126000,
      itcBalance: 45000,
    },
    invoices: [
      { invoiceId: 'INV-001', customerName: 'Reliance', amount: 250000, status: 'paid', date: '2026-01-10', dueDate: '2026-02-10' },
      { invoiceId: 'INV-002', customerName: 'Tata Motors', amount: 180000, status: 'pending', date: '2026-01-15', dueDate: '2026-02-15' },
    ],
  },
  competitorData = {
    userCompany: { name: 'Your Company', marketShare: 8, revenue: 1500, growthRate: 65, customerSatisfaction: 82, priceCompetitiveness: 85, productQuality: 78, brandStrength: 55, digitalPresence: 70, innovation: 80 },
    competitors: [
      { name: 'Competitor A', marketShare: 25, revenue: 5000, growthRate: 20, customerSatisfaction: 78, priceCompetitiveness: 75, productQuality: 82, brandStrength: 80, digitalPresence: 85, innovation: 75 },
      { name: 'Competitor B', marketShare: 18, revenue: 3500, growthRate: 35, customerSatisfaction: 75, priceCompetitiveness: 80, productQuality: 75, brandStrength: 70, digitalPresence: 75, innovation: 70 },
    ],
  },
  roadmapDecisions = [
    { title: 'Expand to Maharashtra', risk: 'Medium', roi: '35%', timeline: '6 months' },
    { title: 'Launch mobile app', risk: 'Low', roi: '50%', timeline: '3 months' },
    { title: 'Partner with distributors', risk: 'Medium', roi: '25%', timeline: '2 months' },
  ],
  marketData = {
    targetState: { name: 'Maharashtra', marketSize: 5000, regulatoryEase: 85, infrastructureScore: 90, digitalPenetration: 78, roiPotential: 45 },
    alternatives: [
      { name: 'Karnataka', marketSize: 4200, regulatoryEase: 88, infrastructureScore: 85, digitalPenetration: 82, roiPotential: 42 },
      { name: 'Tamil Nadu', marketSize: 3800, regulatoryEase: 80, infrastructureScore: 82, digitalPenetration: 75, roiPotential: 38 },
    ],
    riskFactors: [
      { risk: 'Regulatory compliance', severity: 'Medium', mitigation: 'Engage local legal counsel' },
      { risk: 'Competition intensity', severity: 'High', mitigation: 'Differentiate on service quality' },
    ],
  },
  workforceData = {
    monthlyProjection: [
      { month: 'Feb 2026', required: 28, current: 25, gap: 3, festivalImpact: 'None' },
      { month: 'Mar 2026', required: 30, current: 25, gap: 5, festivalImpact: 'Holi' },
      { month: 'Apr 2026', required: 32, current: 25, gap: 7, festivalImpact: 'None' },
    ],
    roles: [
      { role: 'Sales Executive', needed: 3, priority: 'High', monthlyCost: 45000, hireBy: 'Feb 2026' },
      { role: 'Backend Developer', needed: 2, priority: 'Medium', monthlyCost: 85000, hireBy: 'Mar 2026' },
    ],
  },
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedExports, setSelectedExports] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');

  const toggleExport = (id: string) => {
    setSelectedExports(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedExports.length === 0) {
      setExportStatus('Please select at least one report to export');
      return;
    }

    setExporting(true);
    setExportStatus('Generating Excel files...');

    try {
      // Small delay between exports to prevent browser blocking
      for (const exportId of selectedExports) {
        switch (exportId) {
          case 'profile':
            exportBusinessProfile(businessProfile);
            break;
          case 'financial':
            exportFinancialReport(financialData);
            break;
          case 'competitor':
            exportCompetitorAnalysis(competitorData);
            break;
          case 'roadmap':
            exportRoadmapDecisions(roadmapDecisions);
            break;
          case 'market':
            exportMarketAnalysis(marketData);
            break;
          case 'workforce':
            exportWorkforcePlan(workforceData);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setExportStatus(`✅ ${selectedExports.length} file(s) exported successfully!`);
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('❌ Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    setSelectedExports(EXPORT_OPTIONS.map(o => o.id));
    setExporting(true);
    setExportStatus('Generating all Excel files...');

    try {
      exportBusinessProfile(businessProfile);
      await new Promise(resolve => setTimeout(resolve, 300));
      exportFinancialReport(financialData);
      await new Promise(resolve => setTimeout(resolve, 300));
      exportCompetitorAnalysis(competitorData);
      await new Promise(resolve => setTimeout(resolve, 300));
      exportRoadmapDecisions(roadmapDecisions);
      await new Promise(resolve => setTimeout(resolve, 300));
      exportMarketAnalysis(marketData);
      await new Promise(resolve => setTimeout(resolve, 300));
      exportWorkforcePlan(workforceData);

      setExportStatus('✅ All 6 files exported successfully!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('❌ Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const content = (
    <div className={expanded ? 'p-6' : 'p-4'}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Export to Excel</h3>
            <p className="text-xs text-gray-400">Download data as XLSX files</p>
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

      {/* Quick Export Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleExportAll}
          disabled={exporting}
          className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {exporting ? '⏳ Exporting...' : '📥 Export All'}
        </button>
        <button
          onClick={handleExport}
          disabled={exporting || selectedExports.length === 0}
          className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Export Selected ({selectedExports.length})
        </button>
      </div>

      {/* Export Status */}
      {exportStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg text-sm ${
            exportStatus.includes('✅')
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : exportStatus.includes('❌')
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}
        >
          {exportStatus}
        </motion.div>
      )}

      {/* Export Options Grid */}
      <div className={`grid ${expanded ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
        {EXPORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleExport(option.id)}
            className={`p-3 rounded-lg text-left transition-all ${
              selectedExports.includes(option.id)
                ? `bg-gradient-to-br ${option.color} border-2 border-white/30`
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">{option.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{option.name}</p>
                {expanded && (
                  <p className="text-gray-400 text-xs mt-1">{option.description}</p>
                )}
              </div>
              {selectedExports.includes(option.id) && (
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {expanded && (
        <>
          {/* File Format Info */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white text-sm font-medium mb-2">📋 Export Information</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>• Files are exported in .xls format (Excel 97-2003)</li>
              <li>• Compatible with Microsoft Excel, Google Sheets, LibreOffice</li>
              <li>• Includes formatted headers and auto-sized columns</li>
              <li>• Files include timestamp in filename</li>
              <li>• Indian Rupee (₹) formatting applied to currency fields</li>
            </ul>
          </div>

          {/* Recent Exports */}
          <div className="mt-4">
            <h4 className="text-white text-sm font-medium mb-2">📁 Why Export to Excel?</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-green-400 text-sm font-medium">📊 Share with CA</p>
                <p className="text-xs text-gray-400 mt-1">Send financial data to your chartered accountant</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-blue-400 text-sm font-medium">💼 Investor Reports</p>
                <p className="text-xs text-gray-400 mt-1">Create professional reports for stakeholders</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-purple-400 text-sm font-medium">📈 Custom Analysis</p>
                <p className="text-xs text-gray-400 mt-1">Import data into your own spreadsheets</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-orange-400 text-sm font-medium">🔄 Tally/Zoho Import</p>
                <p className="text-xs text-gray-400 mt-1">Import into accounting software</p>
              </div>
            </div>
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
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto border border-white/10"
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

export default ExcelExport;
