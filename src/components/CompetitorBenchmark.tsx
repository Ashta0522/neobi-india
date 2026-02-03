'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import {
  CompetitorData,
  fetchCompetitorData,
  getAvailableIndustries,
  searchCompetitors,
  generateUserCompanyProfile,
  calculateCompetitivePosition,
} from '@/lib/competitor-data';

interface BenchmarkProps {
  userCompany?: CompetitorData;
  competitors?: CompetitorData[];
  industry?: string;
  businessProfile?: {
    name: string;
    mrr: number;
    teamSize: number;
    growthTarget: number;
  };
}

const CompetitorBenchmark: React.FC<BenchmarkProps> = ({
  userCompany: propUserCompany,
  competitors: propCompetitors,
  industry = 'SaaS',
  businessProfile,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(industry);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompetitorData[]>([]);
  const [showAddCompetitor, setShowAddCompetitor] = useState(false);
  const [customCompetitors, setCustomCompetitors] = useState<CompetitorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dynamicCompetitors, setDynamicCompetitors] = useState<CompetitorData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [dataSource, setDataSource] = useState<'api' | 'cache' | 'generated'>('cache');

  // Available industries from the dynamic database
  const availableIndustries = useMemo(() => getAvailableIndustries(), []);

  // Generate user company profile if business profile provided
  const userCompany = useMemo(() => {
    if (propUserCompany) return propUserCompany;
    if (businessProfile) {
      return generateUserCompanyProfile(
        businessProfile.name,
        selectedIndustry,
        businessProfile.mrr,
        businessProfile.teamSize,
        businessProfile.growthTarget
      );
    }
    return generateUserCompanyProfile('Your Company', selectedIndustry, 500000, 10, 30);
  }, [propUserCompany, businessProfile, selectedIndustry]);

  // Fetch competitors dynamically when industry changes
  const fetchCompetitors = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchCompetitorData(selectedIndustry, businessProfile);
      setDynamicCompetitors(result.competitors.filter(c => c.name !== userCompany.name));
      setLastUpdated(result.lastUpdated);
      setDataSource(result.source);
    } catch (error) {
      console.error('Failed to fetch competitors:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedIndustry, businessProfile, userCompany.name]);

  useEffect(() => {
    if (!propCompetitors) {
      fetchCompetitors();
    }
  }, [fetchCompetitors, propCompetitors]);

  // Search for competitors
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = searchCompetitors(query);
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, []);

  // Add competitor from search
  const addCompetitor = useCallback((competitor: CompetitorData) => {
    if (!customCompetitors.find(c => c.name === competitor.name)) {
      setCustomCompetitors(prev => [...prev, competitor]);
    }
    setSearchQuery('');
    setSearchResults([]);
    setShowAddCompetitor(false);
  }, [customCompetitors]);

  // Remove custom competitor
  const removeCompetitor = useCallback((name: string) => {
    setCustomCompetitors(prev => prev.filter(c => c.name !== name));
  }, []);

  // Combine all competitors
  const activeCompetitors = useMemo(() => {
    const base = propCompetitors || dynamicCompetitors;
    return [...base, ...customCompetitors];
  }, [propCompetitors, dynamicCompetitors, customCompetitors]);

  const allCompanies = useMemo(() => [userCompany, ...activeCompetitors], [userCompany, activeCompetitors]);

  // Calculate competitive position
  const competitivePosition = useMemo(() => {
    return calculateCompetitivePosition(userCompany, activeCompetitors);
  }, [userCompany, activeCompetitors]);

  const radarData = useMemo(() => {
    const metrics = ['customerSatisfaction', 'priceCompetitiveness', 'productQuality', 'brandStrength', 'digitalPresence', 'innovation'];
    const labels = ['Customer Sat.', 'Price', 'Quality', 'Brand', 'Digital', 'Innovation'];

    return metrics.map((metric, idx) => {
      const data: any = { metric: labels[idx] };
      allCompanies.slice(0, 5).forEach((company) => {
        data[company.name] = company[metric as keyof CompetitorData];
      });
      return data;
    });
  }, [allCompanies]);

  const marketShareData = useMemo(() => {
    return allCompanies.slice(0, 6).map((c) => ({
      name: c.name.length > 12 ? c.name.slice(0, 12) + '...' : c.name,
      marketShare: c.marketShare,
      fill: c.name === userCompany.name ? '#10B981' : '#3B82F6',
    }));
  }, [allCompanies, userCompany.name]);

  const growthData = useMemo(() => {
    return allCompanies.slice(0, 6).map((c) => ({
      name: c.name.length > 12 ? c.name.slice(0, 12) + '...' : c.name,
      growth: c.growthRate,
      fill: c.growthRate > 0 ? (c.name === userCompany.name ? '#10B981' : '#3B82F6') : '#EF4444',
    }));
  }, [allCompanies, userCompany.name]);

  const overallScore = useMemo(() => {
    const weights = { customerSatisfaction: 0.18, priceCompetitiveness: 0.12, productQuality: 0.20, brandStrength: 0.15, digitalPresence: 0.18, innovation: 0.17 };
    return allCompanies.map((company) => {
      const score = Object.entries(weights).reduce((sum, [metric, weight]) => {
        return sum + (company[metric as keyof CompetitorData] as number) * weight;
      }, 0);
      return { name: company.name, score: Math.round(score) };
    }).sort((a, b) => b.score - a.score);
  }, [allCompanies]);

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  const content = (
    <div className={expanded ? 'p-6' : 'p-4'}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Competitor Benchmark</h3>
            <p className="text-xs text-gray-400">
              Real-time data • {activeCompetitors.length} competitors
              {lastUpdated && <span className="ml-2">• Updated {new Date(lastUpdated).toLocaleTimeString()}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCompetitors}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Refresh data"
          >
            <svg className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Industry Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {availableIndustries.map((ind) => (
          <button
            key={ind}
            onClick={() => setSelectedIndustry(ind)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              selectedIndustry === ind
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-400">Fetching competitor data...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Your Rank */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 mb-4 border border-green-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">Your Overall Ranking</p>
                <p className="text-2xl font-bold text-white">
                  #{competitivePosition.rank} <span className="text-sm text-gray-400">of {competitivePosition.total}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Competitive Score</p>
                <p className="text-2xl font-bold text-green-400">
                  {competitivePosition.score}/100
                </p>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <p className="text-xs text-green-400 font-medium mb-2">💪 Strengths</p>
              {competitivePosition.strengths.length > 0 ? (
                competitivePosition.strengths.map((s) => (
                  <p key={s} className="text-sm text-gray-300">• {s}</p>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No significant advantages</p>
              )}
            </div>
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <p className="text-xs text-red-400 font-medium mb-2">⚠️ Weaknesses</p>
              {competitivePosition.weaknesses.length > 0 ? (
                competitivePosition.weaknesses.map((w) => (
                  <p key={w} className="text-sm text-gray-300">• {w}</p>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No significant gaps</p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {competitivePosition.recommendations.length > 0 && (
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 mb-4">
              <p className="text-xs text-blue-400 font-medium mb-2">💡 AI Recommendations</p>
              {competitivePosition.recommendations.slice(0, 3).map((r, i) => (
                <p key={i} className="text-sm text-gray-300">• {r}</p>
              ))}
            </div>
          )}

          {expanded && (
            <>
              {/* Radar Chart */}
              <div className="mb-6">
                <h4 className="text-white text-sm font-medium mb-3">Multi-Metric Comparison</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" fontSize={11} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4B5563" fontSize={10} />
                      {allCompanies.slice(0, 5).map((company, idx) => (
                        <Radar
                          key={company.name}
                          name={company.name}
                          dataKey={company.name}
                          stroke={COLORS[idx % COLORS.length]}
                          fill={COLORS[idx % COLORS.length]}
                          fillOpacity={company.name === userCompany.name ? 0.4 : 0.1}
                          strokeWidth={company.name === userCompany.name ? 2 : 1}
                        />
                      ))}
                      <Legend />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Market Share & Growth Charts */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-white text-sm font-medium mb-3">Market Share (%)</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={marketShareData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                        <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={10} width={70} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                        <Bar dataKey="marketShare" radius={[0, 4, 4, 0]}>
                          {marketShareData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium mb-3">Growth Rate (%)</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={growthData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                        <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={10} width={70} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                        <Bar dataKey="growth" radius={[0, 4, 4, 0]}>
                          {growthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Competitor Details Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-white/10">
                      <th className="text-left py-2">Company</th>
                      <th className="text-right py-2">Revenue (₹L)</th>
                      <th className="text-right py-2">Market %</th>
                      <th className="text-right py-2">Growth %</th>
                      <th className="text-right py-2">Score</th>
                      <th className="text-right py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCompanies.map((company) => (
                      <tr key={company.name} className={`border-b border-white/5 ${company.name === userCompany.name ? 'bg-green-500/10' : ''}`}>
                        <td className="py-2 text-white font-medium">
                          {company.name}
                          {company.website && (
                            <span className="text-xs text-gray-500 ml-2">({company.website})</span>
                          )}
                        </td>
                        <td className="py-2 text-right text-gray-300">{company.revenue.toLocaleString()}</td>
                        <td className="py-2 text-right text-gray-300">{company.marketShare}%</td>
                        <td className={`py-2 text-right ${company.growthRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {company.growthRate > 0 ? '+' : ''}{company.growthRate}%
                        </td>
                        <td className="py-2 text-right text-blue-400 font-medium">
                          {overallScore.find((c) => c.name === company.name)?.score}
                        </td>
                        <td className="py-2 text-right">
                          {customCompetitors.find(c => c.name === company.name) && (
                            <button
                              onClick={() => removeCompetitor(company.name)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Add Competitor */}
          <div className="mt-4 pt-4 border-t border-white/10">
            {showAddCompetitor ? (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search companies (e.g., Zoho, Flipkart, Swiggy)..."
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-white/10 rounded-lg overflow-hidden z-10">
                      {searchResults.map((result) => (
                        <button
                          key={result.name}
                          onClick={() => addCompetitor(result)}
                          className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors"
                        >
                          <span className="text-white font-medium">{result.name}</span>
                          <span className="text-gray-400 text-xs ml-2">
                            ₹{result.revenue}L • {result.growthRate > 0 ? '+' : ''}{result.growthRate}% growth
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowAddCompetitor(false)}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCompetitor(true)}
                className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors"
              >
                + Add Custom Competitor
              </button>
            )}
          </div>

          {/* Data Source Indicator */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className={`w-2 h-2 rounded-full ${dataSource === 'api' ? 'bg-green-500' : dataSource === 'cache' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
            <span>Data source: {dataSource === 'api' ? 'Live API' : dataSource === 'cache' ? 'Cached' : 'Generated'}</span>
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
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-auto border border-white/10"
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

export default CompetitorBenchmark;
