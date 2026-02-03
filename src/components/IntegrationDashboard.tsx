'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface TallyData {
  totalSales: number;
  totalPurchases: number;
  receivables: number;
  payables: number;
  cashBalance: number;
  bankBalance: number;
}

interface ZohoInvoice {
  invoiceId: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
}

interface GSTSummary {
  totalSales: number;
  outputTax: number;
  inputTax: number;
  netPayable: number;
  itcBalance: number;
}

interface IntegrationProps {
  tallyData?: TallyData;
  zohoInvoices?: ZohoInvoice[];
  gstSummary?: GSTSummary;
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

const IntegrationDashboard: React.FC<IntegrationProps> = ({
  tallyData = {
    totalSales: 2500000,
    totalPurchases: 1800000,
    receivables: 450000,
    payables: 320000,
    cashBalance: 150000,
    bankBalance: 850000,
  },
  zohoInvoices = [
    { invoiceId: 'INV-001', customerName: 'Reliance Industries', amount: 250000, status: 'paid', date: '2026-01-10', dueDate: '2026-02-10' },
    { invoiceId: 'INV-002', customerName: 'Tata Motors', amount: 180000, status: 'pending', date: '2026-01-15', dueDate: '2026-02-15' },
    { invoiceId: 'INV-003', customerName: 'Infosys Ltd', amount: 320000, status: 'overdue', date: '2025-12-20', dueDate: '2026-01-20' },
    { invoiceId: 'INV-004', customerName: 'Wipro Tech', amount: 95000, status: 'paid', date: '2026-01-22', dueDate: '2026-02-22' },
  ],
  gstSummary = {
    totalSales: 2500000,
    outputTax: 450000,
    inputTax: 324000,
    netPayable: 126000,
    itcBalance: 45000,
  },
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'tally' | 'zoho' | 'gst'>('tally');
  const [connectionStatus, setConnectionStatus] = useState({
    tally: 'demo',
    zoho: 'demo',
    gst: 'demo',
  });

  const tallyChartData = useMemo(() => [
    { name: 'Sales', value: tallyData.totalSales / 100000 },
    { name: 'Purchases', value: tallyData.totalPurchases / 100000 },
    { name: 'Receivables', value: tallyData.receivables / 100000 },
    { name: 'Payables', value: tallyData.payables / 100000 },
  ], [tallyData]);

  const invoiceStatusData = useMemo(() => {
    const paid = zohoInvoices.filter(i => i.status === 'paid').length;
    const pending = zohoInvoices.filter(i => i.status === 'pending').length;
    const overdue = zohoInvoices.filter(i => i.status === 'overdue').length;
    return [
      { name: 'Paid', value: paid },
      { name: 'Pending', value: pending },
      { name: 'Overdue', value: overdue },
    ];
  }, [zohoInvoices]);

  const gstChartData = useMemo(() => [
    { name: 'Output Tax', value: gstSummary.outputTax / 1000 },
    { name: 'Input Tax (ITC)', value: gstSummary.inputTax / 1000 },
    { name: 'Net Payable', value: gstSummary.netPayable / 1000 },
    { name: 'ITC Balance', value: gstSummary.itcBalance / 1000 },
  ], [gstSummary]);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const content = (
    <div className={expanded ? 'p-6' : 'p-4'}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Integration Hub</h3>
            <p className="text-xs text-gray-400">Tally • Zoho • GST Portal</p>
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

      {/* Connection Status */}
      <div className="flex gap-2 mb-4">
        {['tally', 'zoho', 'gst'].map((service) => (
          <button
            key={service}
            onClick={() => setActiveTab(service as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === service
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              connectionStatus[service as keyof typeof connectionStatus] === 'connected'
                ? 'bg-green-500'
                : connectionStatus[service as keyof typeof connectionStatus] === 'demo'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`} />
            {service.charAt(0).toUpperCase() + service.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'tally' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-3 border border-purple-500/20">
                <p className="text-xs text-purple-400 mb-1">Tally ERP Integration</p>
                <p className="text-white font-semibold">Financial Summary</p>
              </div>

              {/* Tally Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Total Sales</p>
                  <p className="text-lg text-green-400 font-bold">{formatCurrency(tallyData.totalSales)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Cash + Bank</p>
                  <p className="text-lg text-blue-400 font-bold">{formatCurrency(tallyData.cashBalance + tallyData.bankBalance)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Net Receivables</p>
                  <p className="text-lg text-yellow-400 font-bold">{formatCurrency(tallyData.receivables - tallyData.payables)}</p>
                </div>
              </div>

              {expanded && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tallyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `₹${v}L`} />
                      <Tooltip
                        formatter={(value: number) => [`₹${value.toFixed(1)}L`, '']}
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: '#F3F4F6' }}
                      />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {activeTab === 'zoho' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-3 border border-orange-500/20">
                <p className="text-xs text-orange-400 mb-1">Zoho Books Integration</p>
                <p className="text-white font-semibold">Invoice Tracking</p>
              </div>

              {/* Invoice Status Summary */}
              <div className="flex items-center gap-4">
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={invoiceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        dataKey="value"
                      >
                        {invoiceStatusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {invoiceStatusData.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="text-sm text-gray-300">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {expanded && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {zohoInvoices.map((invoice) => (
                    <div key={invoice.invoiceId} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                      <div>
                        <p className="text-white text-sm font-medium">{invoice.customerName}</p>
                        <p className="text-xs text-gray-400">{invoice.invoiceId} • Due: {invoice.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatCurrency(invoice.amount)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          invoice.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gst' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-3 border border-green-500/20">
                <p className="text-xs text-green-400 mb-1">GST Portal Integration</p>
                <p className="text-white font-semibold">Tax Summary</p>
              </div>

              {/* GST Summary Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Output Tax (CGST+SGST+IGST)</p>
                  <p className="text-lg text-red-400 font-bold">{formatCurrency(gstSummary.outputTax)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Input Tax Credit (ITC)</p>
                  <p className="text-lg text-green-400 font-bold">{formatCurrency(gstSummary.inputTax)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Net GST Payable</p>
                  <p className="text-lg text-yellow-400 font-bold">{formatCurrency(gstSummary.netPayable)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">ITC Balance Available</p>
                  <p className="text-lg text-blue-400 font-bold">{formatCurrency(gstSummary.itcBalance)}</p>
                </div>
              </div>

              {expanded && (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gstChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `₹${v}K`} />
                      <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} width={80} />
                      <Tooltip
                        formatter={(value: number) => [`₹${value.toFixed(0)}K`, '']}
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Configure Button */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <button className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors">
          ⚙️ Configure Integrations
        </button>
      </div>
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
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto border border-white/10"
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

export default IntegrationDashboard;
