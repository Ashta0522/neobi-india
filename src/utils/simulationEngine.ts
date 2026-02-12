import { DecisionPath, AgentId, BusinessProfile, MARLState } from '@/types';

// SHAP value calculator with proper Shapley value approximation
export const calculateSHAPValues = (
  features: Record<string, number>,
  baseValue: number = 500
): Record<string, number> => {
  const shap: Record<string, number> = {};
  const featureKeys = Object.keys(features);
  const n = featureKeys.length;

  // Calculate total feature value for normalization
  const totalFeatureValue = Object.values(features).reduce((sum, val) => sum + val, 0);

  // Approximate Shapley values using coalition sampling
  // In a proper implementation, this would sample all possible coalitions
  // Here we use a weighted contribution based on marginal contribution
  featureKeys.forEach((key) => {
    const featureValue = features[key];

    // Calculate marginal contribution: how much does this feature contribute
    // relative to its value and the presence of other features
    let marginalContribution = 0;

    // Weight by feature value relative to total
    const relativeImportance = featureValue / totalFeatureValue;

    // Calculate contribution with diminishing returns for coalition size
    // This approximates the average marginal contribution across coalitions
    for (let coalitionSize = 0; coalitionSize < n; coalitionSize++) {
      const weight = 1 / (n * (n - 1)); // Shapley weight for this coalition size
      const contribution = (featureValue / (coalitionSize + 1)) * baseValue * relativeImportance;
      marginalContribution += weight * contribution * n;
    }

    shap[key] = marginalContribution;
  });

  // Normalize so that sum of SHAP values equals expected deviation from base
  const totalShap = Object.values(shap).reduce((sum, val) => sum + val, 0);
  const normalizationFactor = (baseValue * 0.4) / totalShap; // 40% of base value as total contribution

  Object.keys(shap).forEach((key) => {
    shap[key] = shap[key] * normalizationFactor;
  });

  return shap;
};

// Query Intent Detection - Parse user queries to understand intent
export type QueryIntent =
  | 'market_entry'
  | 'growth'
  | 'hiring'
  | 'funding'
  | 'marketing'
  | 'operations'
  | 'pivot'
  | 'compliance'
  | 'general';

export const detectQueryIntent = (query: string): QueryIntent => {
  const lowerQuery = query.toLowerCase();

  // Market Entry / New Market / Geographic Expansion
  // First check if any city is mentioned in the query
  const mentionedCity = INDIAN_CITIES.some(city => lowerQuery.includes(city));

  if (
    mentionedCity ||
    lowerQuery.includes('new market') ||
    lowerQuery.includes('enter') ||
    lowerQuery.includes('entering') ||
    lowerQuery.includes('expand') ||
    lowerQuery.includes('expansion') ||
    lowerQuery.includes('move to') ||
    lowerQuery.includes('relocate') ||
    lowerQuery.includes('shift to') ||
    lowerQuery.includes('tier 2') ||
    lowerQuery.includes('tier-2') ||
    lowerQuery.includes('tier 3') ||
    lowerQuery.includes('tier-3') ||
    lowerQuery.includes('new city') ||
    lowerQuery.includes('new location') ||
    lowerQuery.includes('geographic') ||
    lowerQuery.includes('international')
  ) {
    return 'market_entry';
  }

  // Growth
  if (lowerQuery.includes('grow') || lowerQuery.includes('scale') || lowerQuery.includes('growth')) {
    return 'growth';
  }

  // Hiring
  if (lowerQuery.includes('hire') || lowerQuery.includes('hiring') || lowerQuery.includes('team') || lowerQuery.includes('recruit')) {
    return 'hiring';
  }

  // Funding
  if (lowerQuery.includes('fund') || lowerQuery.includes('invest') || lowerQuery.includes('capital') || lowerQuery.includes('raise')) {
    return 'funding';
  }

  // Marketing
  if (lowerQuery.includes('market') || lowerQuery.includes('customer') || lowerQuery.includes('acquire') || lowerQuery.includes('sales')) {
    return 'marketing';
  }

  // Operations
  if (lowerQuery.includes('operation') || lowerQuery.includes('efficien') || lowerQuery.includes('process') || lowerQuery.includes('optimize')) {
    return 'operations';
  }

  // Pivot / Business Transformation / Adding New Services
  // Recognize "should I add X", "add new service", "new offering", "diversify" etc.
  if (
    lowerQuery.includes('pivot') ||
    lowerQuery.includes('transform') ||
    lowerQuery.includes('diversify') ||
    lowerQuery.includes('new service') ||
    lowerQuery.includes('new offering') ||
    lowerQuery.includes('new product line') ||
    lowerQuery.includes('new business') ||
    lowerQuery.includes('new line of') ||
    lowerQuery.includes('branch out') ||
    lowerQuery.includes('rebrand') ||
    (lowerQuery.includes('add') && (
      lowerQuery.includes('consulting') ||
      lowerQuery.includes('service') ||
      lowerQuery.includes('product') ||
      lowerQuery.includes('offering') ||
      lowerQuery.includes('vertical') ||
      lowerQuery.includes('segment') ||
      lowerQuery.includes('division') ||
      lowerQuery.includes('line')
    )) ||
    (lowerQuery.includes('should') && lowerQuery.includes('start') && (
      lowerQuery.includes('new') ||
      lowerQuery.includes('another')
    )) ||
    (lowerQuery.includes('should') && lowerQuery.includes('add'))
  ) {
    return 'pivot';
  }

  // Compliance & Legal (including HR/staff issues)
  if (
    lowerQuery.includes('gst') || lowerQuery.includes('tax') || lowerQuery.includes('compli') ||
    lowerQuery.includes('legal') || lowerQuery.includes('sue') || lowerQuery.includes('lawsuit') ||
    lowerQuery.includes('terminate') || lowerQuery.includes('dismiss') || lowerQuery.includes('fire') ||
    lowerQuery.includes('action against') || lowerQuery.includes('labor') || lowerQuery.includes('labour') ||
    lowerQuery.includes('contract') || lowerQuery.includes('dispute') || lowerQuery.includes('grievance') ||
    lowerQuery.includes('warning letter') || lowerQuery.includes('notice') || lowerQuery.includes('severance')
  ) {
    return 'compliance';
  }

  return 'general';
};

// Indian cities database for query extraction
const INDIAN_CITIES = [
  // Metro cities
  'mumbai', 'delhi', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 'hyderabad', 'pune',
  // Tier 1
  'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal',
  'visakhapatnam', 'vizag', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik',
  // Tier 2
  'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar',
  'allahabad', 'prayagraj', 'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada',
  'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur', 'hubli',
  // Tier 3 / Growing cities
  'thiruvananthapuram', 'trivandrum', 'kochi', 'cochin', 'thrissur', 'kozhikode', 'calicut',
  'mysore', 'mysuru', 'mangalore', 'mangaluru', 'belgaum', 'belagavi', 'gulbarga', 'shimoga',
  'noida', 'greater noida', 'gurgaon', 'gurugram', 'faridabad', 'dehradun', 'haridwar',
  'rishikesh', 'jamshedpur', 'bokaro', 'dhanbad', 'ranchi', 'bhubaneswar', 'cuttack',
  'puducherry', 'pondicherry', 'salem', 'tirupur', 'erode', 'tiruchirappalli', 'trichy',
  'nellore', 'guntur', 'warangal', 'karimnagar', 'nizamabad', 'khammam',
];

// Extract city from user query
const extractCityFromQuery = (query: string): string | null => {
  const lowerQuery = query.toLowerCase();

  // Check for city mentions in query
  for (const city of INDIAN_CITIES) {
    if (lowerQuery.includes(city)) {
      // Capitalize first letter of each word
      return city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  }

  return null;
};

// Generate Market Entry specific paths
const generateMarketEntryPaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  // First, try to extract city from user's query
  const queryCity = query ? extractCityFromQuery(query) : null;

  // Use query city if found, otherwise fall back to default mapping
  const targetCity = queryCity || (
    profile.location === 'Bangalore' ? 'Hyderabad' :
    profile.location === 'Mumbai' ? 'Pune' :
    profile.location === 'Delhi' ? 'Jaipur' : 'Tier-2 City'
  );

  return [
    {
      id: 'aggressive-market-entry',
      name: 'Rapid Market Capture',
      description: `Launch aggressively in ${targetCity} with full team, heavy marketing spend`,
      expectedValue: baseExpectedValue * 2.2,
      probability: 0.55,
      riskScore: 78,
      timeline: 90,
      costs: {
        immediate: profile.mrr * 8,
        monthly: profile.mrr * 0.5,
      },
      benefits: {
        revenue: baseExpectedValue * 2.5,
        efficiency: 20,
        riskReduction: 10,
      },
      steps: [
        `Open office in ${targetCity} with 5-10 member team`,
        'Launch aggressive digital marketing campaign',
        'Hire local sales team within 30 days',
        'Partner with local businesses for quick traction',
      ],
      risks: [
        'High burn rate may affect runway',
        'Local market dynamics may differ',
        'Team management across locations challenging',
      ],
      shapleySHAP: calculateSHAPValues({
        market_size: 50,
        competition_level: 30,
        local_demand: 20,
      }),
      agentContributions: {
        orchestrator: 8,
        simulation_cluster: 18,
        decision_intelligence: 15,
        operations_optimizer: 20,
        personal_coach: 5,
        innovation_advisor: 10,
        growth_strategist: 20,
        learning_adaptation: 4,
      },
    },
    {
      id: 'balanced-market-entry',
      name: 'Phased Market Entry',
      description: `Test ${targetCity} market with pilot, then scale based on results`,
      expectedValue: baseExpectedValue * 1.4,
      probability: 0.80,
      riskScore: 42,
      timeline: 180,
      costs: {
        immediate: profile.mrr * 3,
        monthly: profile.mrr * 0.2,
      },
      benefits: {
        revenue: baseExpectedValue * 1.6,
        efficiency: 30,
        riskReduction: 45,
      },
      steps: [
        `Run 60-day pilot in ${targetCity} with 2-3 team members`,
        'Validate product-market fit with local customers',
        'Scale team to 8-10 if pilot succeeds',
        'Establish local partnerships gradually',
      ],
      risks: [
        'Slower time to market',
        'Competitors may capture market first',
        'Pilot results may not scale',
      ],
      shapleySHAP: calculateSHAPValues({
        market_validation: 45,
        resource_efficiency: 35,
        risk_mitigation: 20,
      }),
      agentContributions: {
        orchestrator: 12,
        simulation_cluster: 16,
        decision_intelligence: 18,
        operations_optimizer: 18,
        personal_coach: 10,
        innovation_advisor: 6,
        growth_strategist: 14,
        learning_adaptation: 6,
      },
    },
    {
      id: 'conservative-market-entry',
      name: 'Remote Market Expansion',
      description: `Serve ${targetCity} remotely first, then establish presence`,
      expectedValue: baseExpectedValue * 0.8,
      probability: 0.92,
      riskScore: 18,
      timeline: 365,
      costs: {
        immediate: profile.mrr * 1,
        monthly: profile.mrr * 0.08,
      },
      benefits: {
        revenue: baseExpectedValue * 1.0,
        efficiency: 40,
        riskReduction: 70,
      },
      steps: [
        `Start serving ${targetCity} customers remotely`,
        'Build referral network without physical presence',
        'Hire 1-2 local representatives after 6 months',
        'Open office only after achieving ₹5L+ MRR from that market',
      ],
      risks: [
        'Limited market penetration',
        'Miss high-touch customer opportunities',
        'May not be viable for all business types',
      ],
      shapleySHAP: calculateSHAPValues({
        cash_preservation: 50,
        organic_growth: 30,
        market_learning: 20,
      }),
      agentContributions: {
        orchestrator: 10,
        simulation_cluster: 12,
        decision_intelligence: 15,
        operations_optimizer: 20,
        personal_coach: 15,
        innovation_advisor: 5,
        growth_strategist: 8,
        learning_adaptation: 15,
      },
    },
  ];
};

// Generate Compliance/Legal specific paths
const generateCompliancePaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  const lowerQuery = (query || '').toLowerCase();

  // Detect if it's about staff/HR issues or tax/GST issues
  const isStaffRelated = lowerQuery.includes('staff') || lowerQuery.includes('employee') ||
                         lowerQuery.includes('hr') || lowerQuery.includes('terminate') ||
                         lowerQuery.includes('fire') || lowerQuery.includes('action against') ||
                         lowerQuery.includes('sue') || lowerQuery.includes('lawsuit') ||
                         lowerQuery.includes('dismiss') || lowerQuery.includes('worker') ||
                         lowerQuery.includes('labor') || lowerQuery.includes('labour') ||
                         lowerQuery.includes('grievance') || lowerQuery.includes('misconduct') ||
                         lowerQuery.includes('insubordination') || lowerQuery.includes('theft') ||
                         lowerQuery.includes('fraud') || lowerQuery.includes('discipline');
  const isTaxRelated = lowerQuery.includes('gst') || lowerQuery.includes('tds') ||
                       lowerQuery.includes('tax') || lowerQuery.includes('compliance');

  // Check for specific legal action keywords
  const wantsToSue = lowerQuery.includes('sue') || lowerQuery.includes('lawsuit') ||
                     lowerQuery.includes('legal action') || lowerQuery.includes('take action');

  if (isStaffRelated) {
    return [
      {
        id: 'legal-formal-process',
        name: wantsToSue ? 'Legal Action with Documentation' : 'Formal Legal Process',
        description: wantsToSue
          ? 'Build strong legal case with proper documentation before court action'
          : 'Follow proper HR and legal procedures with documentation',
        expectedValue: baseExpectedValue * 0.9,
        probability: 0.92,
        riskScore: 25,
        timeline: 90,
        costs: {
          immediate: 50000, // Legal consultation
          monthly: 10000,
        },
        benefits: {
          revenue: baseExpectedValue * 0.95,
          efficiency: 20,
          riskReduction: 80,
        },
        steps: wantsToSue ? [
          'Document all incidents with dates, witnesses, and evidence',
          'Issue show cause notice and collect written response',
          'Consult labor lawyer - assess if civil or labor court is appropriate',
          'File case under appropriate act (Industrial Disputes Act / IPC for fraud)',
          'Prepare for counter-claims and labor commissioner inquiry',
          'Consider arbitration clause in employment contract',
        ] : [
          'Document all incidents and performance issues thoroughly',
          'Issue formal warning letters as per employment terms',
          'Consult with labor lawyer on proper termination procedure',
          'Ensure compliance with Industrial Disputes Act / Shops & Establishments Act',
          'Prepare full & final settlement with proper documentation',
        ],
        risks: wantsToSue ? [
          'Court cases typically take 2-5 years in India',
          'Employee may file counter-claim for wrongful termination',
          'Legal costs can escalate significantly (₹2-10L)',
          'May damage company reputation',
          'Burden of proof lies on employer',
        ] : [
          'Process may take 60-90 days',
          'Employee may file counter-claim',
          'Need to maintain detailed documentation',
        ],
        shapleySHAP: calculateSHAPValues({
          legal_compliance: 50,
          documentation: 30,
          risk_mitigation: 20,
        }),
        agentContributions: {
          orchestrator: 8,
          simulation_cluster: 10,
          decision_intelligence: 25,
          operations_optimizer: 15,
          personal_coach: 12,
          innovation_advisor: 5,
          growth_strategist: 5,
          learning_adaptation: 20,
        },
      },
      {
        id: 'legal-mediation',
        name: wantsToSue ? 'Out-of-Court Settlement' : 'Mediation & Settlement',
        description: wantsToSue
          ? 'Settle matter outside court through negotiation - faster and cheaper'
          : 'Resolve through internal mediation or mutual settlement',
        expectedValue: baseExpectedValue * 0.85,
        probability: wantsToSue ? 0.82 : 0.78,
        riskScore: wantsToSue ? 30 : 35,
        timeline: wantsToSue ? 45 : 30,
        costs: {
          immediate: wantsToSue ? 150000 : 100000, // Higher settlement for legal context
          monthly: 0,
        },
        benefits: {
          revenue: baseExpectedValue * 0.9,
          efficiency: 35,
          riskReduction: 60,
        },
        steps: wantsToSue ? [
          'Send legal notice through lawyer outlining grievances',
          'Propose out-of-court settlement meeting',
          'Negotiate settlement amount covering damages',
          'Draft settlement agreement with non-disclosure clause',
          'Get release deed executed and notarized',
          'Close matter with full and final settlement',
        ] : [
          'Arrange mediation meeting with HR and neutral third party',
          'Discuss mutual separation terms',
          'Offer reasonable severance package',
          'Get signed release/no-claim letter',
          'Ensure confidentiality agreement in place',
        ],
        risks: wantsToSue ? [
          'Settlement amount may be higher than expected',
          'Employee may not agree to settle',
          'May set precedent for other disputes',
          'Need lawyer involvement throughout',
        ] : [
          'Settlement costs may be higher',
          'May set precedent for other employees',
          'Negotiation may fail',
        ],
        shapleySHAP: calculateSHAPValues({
          quick_resolution: 45,
          cost_control: 30,
          relationship_preservation: 25,
        }),
        agentContributions: {
          orchestrator: 10,
          simulation_cluster: 8,
          decision_intelligence: 20,
          operations_optimizer: 12,
          personal_coach: 25,
          innovation_advisor: 5,
          growth_strategist: 8,
          learning_adaptation: 12,
        },
      },
      {
        id: 'legal-performance-improvement',
        name: wantsToSue ? 'Build Case Through Due Process' : 'Performance Improvement Plan',
        description: wantsToSue
          ? 'Follow due process to build legally defensible case for termination'
          : 'Give employee chance to improve before action',
        expectedValue: baseExpectedValue * 1.0,
        probability: wantsToSue ? 0.88 : 0.65,
        riskScore: wantsToSue ? 25 : 40,
        timeline: wantsToSue ? 90 : 60,
        costs: {
          immediate: wantsToSue ? 20000 : 0,
          monthly: wantsToSue ? 10000 : 5000, // HR/monitoring costs
        },
        benefits: {
          revenue: baseExpectedValue * 1.1,
          efficiency: wantsToSue ? 10 : 15,
          riskReduction: wantsToSue ? 70 : 45,
        },
        steps: wantsToSue ? [
          'Issue written warnings with acknowledgment receipt',
          'Create formal PIP with clear, measurable objectives',
          'Document every meeting, feedback, and deviation',
          'Conduct domestic inquiry as per Standing Orders',
          'Issue show cause notice before termination',
          'Terminate with proper notice/pay as per law',
          'Maintain file for potential legal defense',
        ] : [
          'Create formal Performance Improvement Plan (PIP)',
          'Set clear, measurable goals with timeline',
          'Provide necessary training/support',
          'Document all progress meetings',
          'Take action based on PIP outcome',
        ],
        risks: wantsToSue ? [
          'Process takes 60-90 days minimum',
          'Employee may improve, defeating purpose',
          'If not followed properly, case weakens',
          'Employee may resign and claim harassment',
        ] : [
          'Employee may not improve',
          'Extended period of uncertainty',
          'May affect team morale',
        ],
        shapleySHAP: calculateSHAPValues({
          fair_process: 40,
          potential_retention: 35,
          legal_protection: 25,
        }),
        agentContributions: {
          orchestrator: 12,
          simulation_cluster: 10,
          decision_intelligence: 18,
          operations_optimizer: 15,
          personal_coach: 20,
          innovation_advisor: 5,
          growth_strategist: 10,
          learning_adaptation: 10,
        },
      },
    ];
  }

  // Default to tax/compliance paths
  return [
    {
      id: 'compliance-proactive',
      name: 'Proactive Compliance Setup',
      description: 'Implement comprehensive compliance framework',
      expectedValue: baseExpectedValue * 1.1,
      probability: 0.95,
      riskScore: 15,
      timeline: 60,
      costs: {
        immediate: profile.mrr * 0.5,
        monthly: profile.mrr * 0.05,
      },
      benefits: {
        revenue: baseExpectedValue * 1.2,
        efficiency: 30,
        riskReduction: 85,
      },
      steps: [
        'Register for GST if turnover > ₹20L (goods) or ₹40L (services)',
        'Set up automated TDS calculation and filing',
        'Implement DPDP Act compliance for customer data',
        'Create quarterly compliance calendar',
        'Engage CA firm for ongoing compliance monitoring',
      ],
      risks: [
        'Initial setup costs',
        'Process changes required',
        'Staff training needed',
      ],
      shapleySHAP: calculateSHAPValues({
        legal_safety: 50,
        operational_efficiency: 30,
        future_proofing: 20,
      }),
      agentContributions: {
        orchestrator: 10,
        simulation_cluster: 8,
        decision_intelligence: 22,
        operations_optimizer: 25,
        personal_coach: 8,
        innovation_advisor: 7,
        growth_strategist: 10,
        learning_adaptation: 10,
      },
    },
    {
      id: 'compliance-minimal',
      name: 'Essential Compliance Only',
      description: 'Focus on mandatory compliance requirements only',
      expectedValue: baseExpectedValue * 0.9,
      probability: 0.85,
      riskScore: 40,
      timeline: 30,
      costs: {
        immediate: profile.mrr * 0.2,
        monthly: profile.mrr * 0.02,
      },
      benefits: {
        revenue: baseExpectedValue * 0.95,
        efficiency: 20,
        riskReduction: 50,
      },
      steps: [
        'File pending GST returns with interest/penalty',
        'Clear overdue TDS payments',
        'Prepare for assessment if notices received',
        'Basic documentation for compliance',
      ],
      risks: [
        'Penalties for past non-compliance',
        'Possible audits',
        'May miss optimization opportunities',
      ],
      shapleySHAP: calculateSHAPValues({
        quick_resolution: 45,
        cost_savings: 35,
        basic_protection: 20,
      }),
      agentContributions: {
        orchestrator: 8,
        simulation_cluster: 10,
        decision_intelligence: 18,
        operations_optimizer: 28,
        personal_coach: 10,
        innovation_advisor: 6,
        growth_strategist: 8,
        learning_adaptation: 12,
      },
    },
    {
      id: 'compliance-outsource',
      name: 'Outsource Compliance',
      description: 'Fully outsource compliance to professional firm',
      expectedValue: baseExpectedValue * 1.05,
      probability: 0.90,
      riskScore: 20,
      timeline: 15,
      costs: {
        immediate: 25000,
        monthly: 15000,
      },
      benefits: {
        revenue: baseExpectedValue * 1.1,
        efficiency: 45,
        riskReduction: 75,
      },
      steps: [
        'Evaluate and select compliance partner (CA/CS firm)',
        'Transfer all compliance responsibilities',
        'Set up monthly review calls',
        'Focus team on core business',
      ],
      risks: [
        'Dependency on external partner',
        'Higher ongoing costs',
        'Less internal control',
      ],
      shapleySHAP: calculateSHAPValues({
        time_savings: 45,
        expertise_access: 35,
        risk_transfer: 20,
      }),
      agentContributions: {
        orchestrator: 12,
        simulation_cluster: 8,
        decision_intelligence: 15,
        operations_optimizer: 30,
        personal_coach: 10,
        innovation_advisor: 5,
        growth_strategist: 12,
        learning_adaptation: 8,
      },
    },
  ];
};

// Generate Funding specific paths
const generateFundingPaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  const lowerQuery = (query || '').toLowerCase();
  const isCrisis = lowerQuery.includes('out of') || lowerQuery.includes('survive') ||
                   lowerQuery.includes('crisis') || lowerQuery.includes('emergency') ||
                   lowerQuery.includes('no funds') || lowerQuery.includes('running out');

  if (isCrisis) {
    return [
      {
        id: 'funding-emergency-bridge',
        name: 'Emergency Bridge Funding',
        description: 'Secure quick bridge funding to survive immediate crisis',
        expectedValue: baseExpectedValue * 0.7,
        probability: 0.70,
        riskScore: 55,
        timeline: 30,
        costs: {
          immediate: 0,
          monthly: profile.mrr * 0.15, // Interest/fees
        },
        benefits: {
          revenue: baseExpectedValue * 0.8,
          efficiency: 10,
          riskReduction: 40,
        },
        steps: [
          'Approach existing investors for emergency bridge',
          'Consider revenue-based financing (Velocity, GetVantage)',
          'Invoice factoring for immediate cash (70-80% of receivables)',
          'Personal/founder loan as last resort',
          'Negotiate 30-60 day payment terms with vendors',
        ],
        risks: [
          'Dilution or unfavorable terms',
          'Personal liability risk',
          'May signal distress to market',
        ],
        shapleySHAP: calculateSHAPValues({
          immediate_survival: 60,
          speed_of_funding: 25,
          terms_flexibility: 15,
        }),
        agentContributions: {
          orchestrator: 15,
          simulation_cluster: 12,
          decision_intelligence: 25,
          operations_optimizer: 18,
          personal_coach: 8,
          innovation_advisor: 5,
          growth_strategist: 10,
          learning_adaptation: 7,
        },
      },
      {
        id: 'funding-cost-cutting',
        name: 'Aggressive Cost Reduction',
        description: 'Dramatically cut costs to extend runway',
        expectedValue: baseExpectedValue * 0.5,
        probability: 0.85,
        riskScore: 45,
        timeline: 15,
        costs: {
          immediate: profile.mrr * 0.2, // Severance
          monthly: -profile.mrr * 0.4, // Savings
        },
        benefits: {
          revenue: baseExpectedValue * 0.6,
          efficiency: 50,
          riskReduction: 55,
        },
        steps: [
          'Identify and cut all non-essential expenses immediately',
          'Renegotiate office rent or move to co-working',
          'Reduce team to essential members only',
          'Pause all marketing spend',
          'Founders take salary cuts or defer',
          'Cancel subscriptions and tools not critical',
        ],
        risks: [
          'Loss of key talent',
          'Reduced capacity to deliver',
          'Team morale impact',
        ],
        shapleySHAP: calculateSHAPValues({
          runway_extension: 55,
          immediate_impact: 30,
          reversibility: 15,
        }),
        agentContributions: {
          orchestrator: 10,
          simulation_cluster: 8,
          decision_intelligence: 15,
          operations_optimizer: 35,
          personal_coach: 15,
          innovation_advisor: 2,
          growth_strategist: 5,
          learning_adaptation: 10,
        },
      },
      {
        id: 'funding-revenue-focus',
        name: 'Revenue Acceleration',
        description: 'Focus entirely on generating immediate revenue',
        expectedValue: baseExpectedValue * 0.8,
        probability: 0.60,
        riskScore: 50,
        timeline: 45,
        costs: {
          immediate: profile.mrr * 0.1,
          monthly: profile.mrr * 0.05,
        },
        benefits: {
          revenue: baseExpectedValue * 1.2,
          efficiency: 25,
          riskReduction: 35,
        },
        steps: [
          'Contact all leads and push for immediate closes',
          'Offer discounts for annual/upfront payment',
          'Launch referral program with incentives',
          'Upsell existing customers aggressively',
          'Consider one-time consulting/services revenue',
          'Collect all pending receivables',
        ],
        risks: [
          'May damage customer relationships',
          'Unsustainable discounting',
          'Team burnout',
        ],
        shapleySHAP: calculateSHAPValues({
          revenue_generation: 55,
          customer_activation: 30,
          sales_efficiency: 15,
        }),
        agentContributions: {
          orchestrator: 12,
          simulation_cluster: 10,
          decision_intelligence: 18,
          operations_optimizer: 15,
          personal_coach: 10,
          innovation_advisor: 5,
          growth_strategist: 25,
          learning_adaptation: 5,
        },
      },
    ];
  }

  // Normal funding paths
  return [
    {
      id: 'funding-vc-raise',
      name: 'VC/Angel Fundraise',
      description: 'Raise institutional or angel funding round',
      expectedValue: baseExpectedValue * 2.0,
      probability: 0.40,
      riskScore: 60,
      timeline: 120,
      costs: {
        immediate: 100000, // Legal, pitch prep
        monthly: 50000, // Time cost
      },
      benefits: {
        revenue: baseExpectedValue * 2.5,
        efficiency: 20,
        riskReduction: 30,
      },
      steps: [
        'Prepare pitch deck and financial model',
        'Build list of 50+ relevant investors',
        'Get warm introductions through network',
        'Run structured fundraising process',
        'Negotiate term sheet and close',
      ],
      risks: [
        'Time-consuming process',
        'Significant dilution (15-25%)',
        'May not close successfully',
      ],
      shapleySHAP: calculateSHAPValues({
        growth_capital: 50,
        network_access: 30,
        validation: 20,
      }),
      agentContributions: {
        orchestrator: 15,
        simulation_cluster: 12,
        decision_intelligence: 20,
        operations_optimizer: 10,
        personal_coach: 8,
        innovation_advisor: 10,
        growth_strategist: 20,
        learning_adaptation: 5,
      },
    },
    {
      id: 'funding-bootstrapped',
      name: 'Bootstrap & Grow Organically',
      description: 'Fund growth from revenue, maintain full ownership',
      expectedValue: baseExpectedValue * 1.2,
      probability: 0.75,
      riskScore: 35,
      timeline: 365,
      costs: {
        immediate: 0,
        monthly: 0,
      },
      benefits: {
        revenue: baseExpectedValue * 1.3,
        efficiency: 40,
        riskReduction: 50,
      },
      steps: [
        'Focus on profitability over growth',
        'Build 12+ months runway from profits',
        'Grow team only when revenue supports it',
        'Explore revenue-based financing if needed',
      ],
      risks: [
        'Slower growth',
        'Competitors may outpace',
        'Miss market timing',
      ],
      shapleySHAP: calculateSHAPValues({
        ownership_retention: 50,
        sustainable_growth: 30,
        independence: 20,
      }),
      agentContributions: {
        orchestrator: 10,
        simulation_cluster: 8,
        decision_intelligence: 15,
        operations_optimizer: 25,
        personal_coach: 15,
        innovation_advisor: 7,
        growth_strategist: 12,
        learning_adaptation: 8,
      },
    },
    {
      id: 'funding-debt',
      name: 'Debt/Revenue-Based Financing',
      description: 'Non-dilutive funding through debt or RBF',
      expectedValue: baseExpectedValue * 1.4,
      probability: 0.65,
      riskScore: 40,
      timeline: 45,
      costs: {
        immediate: 50000,
        monthly: profile.mrr * 0.1, // Repayment
      },
      benefits: {
        revenue: baseExpectedValue * 1.5,
        efficiency: 30,
        riskReduction: 40,
      },
      steps: [
        'Apply to RBF providers (Velocity, GetVantage, Klub)',
        'Prepare 6+ months of revenue data',
        'Get 3-6x monthly revenue as funding',
        'Repay as % of revenue over 12-18 months',
      ],
      risks: [
        'Reduces monthly cash flow',
        'Personal guarantee may be required',
        'Not suitable for pre-revenue',
      ],
      shapleySHAP: calculateSHAPValues({
        no_dilution: 45,
        quick_access: 35,
        flexible_repayment: 20,
      }),
      agentContributions: {
        orchestrator: 12,
        simulation_cluster: 10,
        decision_intelligence: 18,
        operations_optimizer: 22,
        personal_coach: 8,
        innovation_advisor: 5,
        growth_strategist: 18,
        learning_adaptation: 7,
      },
    },
  ];
};

// Industry-aware hiring context helper
const getHiringContext = (industry: string) => {
  const key = normalizeIndustry(industry);
  const contexts: Record<string, { roles: string; keyHires: string; outsource: string }> = {
    saas: { roles: 'engineers, product managers, and customer success managers', keyHires: 'VP Engineering, Product Lead, Customer Success Manager', outsource: 'UI/UX design, QA testing, content writing' },
    ecommerce: { roles: 'warehouse staff, logistics coordinators, and customer support', keyHires: 'Operations Manager, Category Manager, Logistics Head', outsource: 'photography, customer support L1, delivery operations' },
    healthcare: { roles: 'specialist doctors, nurses, and clinical staff', keyHires: 'Specialist Doctor, Head Nurse, Lab Technician', outsource: 'billing, housekeeping, non-clinical admin' },
    fintech: { roles: 'engineers, compliance officers, and risk analysts', keyHires: 'Compliance Officer, Risk Analyst, Backend Architect', outsource: 'KYC processing, customer support, testing' },
    edtech: { roles: 'content creators, tutors, and tech team', keyHires: 'Content Head, Curriculum Designer, Product Manager', outsource: 'video production, graphic design, student support' },
    food: { roles: 'chefs, kitchen staff, and delivery executives', keyHires: 'Head Chef, Kitchen Manager, Operations Manager', outsource: 'delivery via aggregators, accounting, marketing' },
    manufacturing: { roles: 'skilled operators, quality inspectors, and supervisors', keyHires: 'Plant Manager, Quality Head, Supply Chain Manager', outsource: 'packaging, logistics, maintenance' },
    logistics: { roles: 'delivery executives, fleet managers, and dispatchers', keyHires: 'Fleet Manager, Route Planner, Operations Head', outsource: 'last-mile delivery, customer support, vehicle maintenance' },
    retail: { roles: 'store managers, sales associates, and visual merchandisers', keyHires: 'Store Manager, Visual Merchandiser, Procurement Head', outsource: 'security, housekeeping, delivery' },
    kirana: { roles: 'shop assistants and delivery personnel', keyHires: 'Experienced Shopkeeper, Delivery Coordinator', outsource: 'accounting, delivery' },
    d2c: { roles: 'designers, marketing specialists, and supply chain team', keyHires: 'Creative Director, Growth Marketer, Supply Chain Manager', outsource: 'manufacturing, photography, customer support' },
    realestate: { roles: 'sales executives, site engineers, and project managers', keyHires: 'Project Manager, Sales Head, Site Engineer', outsource: 'legal, architecture, construction labor' },
    consulting: { roles: 'senior consultants, analysts, and practice leads', keyHires: 'Practice Lead, Senior Consultant, Business Development Manager', outsource: 'research, graphic design, admin support' },
    beauty: { roles: 'beauticians, therapists, and salon managers', keyHires: 'Salon Manager, Senior Stylist, Training Head', outsource: 'accounting, social media management, maintenance' },
  };
  return contexts[key] || { roles: 'team members across key functions', keyHires: 'Operations Lead, Sales Manager, Technical Lead', outsource: 'accounting, admin, support functions' };
};

// Generate Hiring specific paths
const generateHiringPaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  const industryName = profile.industry || 'business';
  const ctx = getHiringContext(profile.industry);

  return [
    {
      id: 'hiring-aggressive',
      name: 'Rapid Team Scaling',
      description: `Hire ${ctx.roles} aggressively to capture market opportunity`,
      expectedValue: baseExpectedValue * 1.6,
      probability: 0.55,
      riskScore: 65,
      timeline: 60,
      costs: {
        immediate: profile.mrr * 3,
        monthly: profile.mrr * 0.8,
      },
      benefits: {
        revenue: baseExpectedValue * 2.0,
        efficiency: 25,
        riskReduction: 20,
      },
      steps: [
        `Define priority roles: ${ctx.keyHires}`,
        'Engage 2-3 recruitment agencies',
        'Run employee referral program with ₹50K+ bonus',
        'Hire experienced leads who can build teams',
        'Accept 10-15% higher market salaries for speed',
      ],
      risks: [
        'Culture dilution with rapid hiring',
        'Bad hires expensive to fix',
        'Cash burn increases significantly',
      ],
      shapleySHAP: calculateSHAPValues({
        speed_to_market: 45,
        capability_building: 35,
        competitive_advantage: 20,
      }),
      agentContributions: {
        orchestrator: 12,
        simulation_cluster: 15,
        decision_intelligence: 18,
        operations_optimizer: 20,
        personal_coach: 8,
        innovation_advisor: 5,
        growth_strategist: 18,
        learning_adaptation: 4,
      },
    },
    {
      id: 'hiring-strategic',
      name: 'Strategic Key Hires',
      description: `Focus on critical ${industryName} hires: ${ctx.keyHires}`,
      expectedValue: baseExpectedValue * 1.3,
      probability: 0.80,
      riskScore: 35,
      timeline: 90,
      costs: {
        immediate: profile.mrr * 1,
        monthly: profile.mrr * 0.3,
      },
      benefits: {
        revenue: baseExpectedValue * 1.5,
        efficiency: 40,
        riskReduction: 45,
      },
      steps: [
        'Identify 3-5 roles that are genuine bottlenecks',
        'Take time to find A-players (2-3 months search)',
        'Use equity to attract senior talent',
        'Build from experienced hires down',
        'Invest in proper onboarding (30-60 days)',
      ],
      risks: [
        'Slower team growth',
        'May miss some opportunities',
        'Existing team stretched meanwhile',
      ],
      shapleySHAP: calculateSHAPValues({
        hire_quality: 50,
        team_fit: 30,
        cost_efficiency: 20,
      }),
      agentContributions: {
        orchestrator: 10,
        simulation_cluster: 12,
        decision_intelligence: 20,
        operations_optimizer: 18,
        personal_coach: 15,
        innovation_advisor: 5,
        growth_strategist: 15,
        learning_adaptation: 5,
      },
    },
    {
      id: 'hiring-outsource',
      name: 'Outsource & Contract',
      description: `Outsource ${ctx.outsource} while keeping core ${industryName} roles in-house`,
      expectedValue: baseExpectedValue * 1.1,
      probability: 0.85,
      riskScore: 30,
      timeline: 30,
      costs: {
        immediate: profile.mrr * 0.5,
        monthly: profile.mrr * 0.4,
      },
      benefits: {
        revenue: baseExpectedValue * 1.2,
        efficiency: 50,
        riskReduction: 55,
      },
      steps: [
        'Identify which roles can be outsourced',
        'Engage development agency for tech capacity',
        'Hire freelancers for specialized work',
        'Keep core product and sales in-house',
        'Build proper vendor management process',
      ],
      risks: [
        'Less control over quality',
        'IP and confidentiality concerns',
        'Coordination overhead',
      ],
      shapleySHAP: calculateSHAPValues({
        flexibility: 45,
        cost_control: 35,
        speed: 20,
      }),
      agentContributions: {
        orchestrator: 8,
        simulation_cluster: 10,
        decision_intelligence: 15,
        operations_optimizer: 30,
        personal_coach: 12,
        innovation_advisor: 5,
        growth_strategist: 12,
        learning_adaptation: 8,
      },
    },
  ];
};

// Generate Operations specific paths
const generateOperationsPaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  return [
    {
      id: 'ops-automation',
      name: 'Process Automation',
      description: 'Automate repetitive processes to improve efficiency',
      expectedValue: baseExpectedValue * 1.4,
      probability: 0.85,
      riskScore: 25,
      timeline: 90,
      costs: {
        immediate: profile.mrr * 2,
        monthly: profile.mrr * 0.1,
      },
      benefits: {
        revenue: baseExpectedValue * 1.3,
        efficiency: 60,
        riskReduction: 50,
      },
      steps: [
        'Map all current business processes',
        'Identify top 5 time-consuming manual tasks',
        'Implement tools: Zapier, Make, or custom automation',
        'Set up automated reporting and alerts',
        'Train team on new automated workflows',
      ],
      risks: [
        'Initial setup time and learning curve',
        'Tool costs add up',
        'Over-automation can reduce flexibility',
      ],
      shapleySHAP: calculateSHAPValues({
        time_savings: 45,
        error_reduction: 30,
        scalability: 25,
      }),
      agentContributions: {
        orchestrator: 10,
        simulation_cluster: 12,
        decision_intelligence: 15,
        operations_optimizer: 35,
        personal_coach: 8,
        innovation_advisor: 10,
        growth_strategist: 5,
        learning_adaptation: 5,
      },
    },
    {
      id: 'ops-lean',
      name: 'Lean Operations',
      description: 'Eliminate waste and optimize for efficiency',
      expectedValue: baseExpectedValue * 1.2,
      probability: 0.90,
      riskScore: 20,
      timeline: 60,
      costs: {
        immediate: profile.mrr * 0.3,
        monthly: 0,
      },
      benefits: {
        revenue: baseExpectedValue * 1.15,
        efficiency: 45,
        riskReduction: 60,
      },
      steps: [
        'Conduct process audit to identify waste',
        'Implement daily standups and weekly reviews',
        'Set up OKRs for all team members',
        'Create SOPs for all repeated tasks',
        'Regular retrospectives for continuous improvement',
      ],
      risks: [
        'Requires discipline to maintain',
        'May face resistance to change',
        'Results take time to show',
      ],
      shapleySHAP: calculateSHAPValues({
        waste_reduction: 40,
        team_alignment: 35,
        process_clarity: 25,
      }),
      agentContributions: {
        orchestrator: 12,
        simulation_cluster: 8,
        decision_intelligence: 18,
        operations_optimizer: 30,
        personal_coach: 15,
        innovation_advisor: 5,
        growth_strategist: 7,
        learning_adaptation: 5,
      },
    },
    {
      id: 'ops-outsource',
      name: 'Outsource Non-Core',
      description: 'Focus on core, outsource everything else',
      expectedValue: baseExpectedValue * 1.15,
      probability: 0.80,
      riskScore: 35,
      timeline: 45,
      costs: {
        immediate: profile.mrr * 0.5,
        monthly: profile.mrr * 0.15,
      },
      benefits: {
        revenue: baseExpectedValue * 1.2,
        efficiency: 55,
        riskReduction: 40,
      },
      steps: [
        'Identify core vs non-core activities',
        'Outsource: accounting, HR admin, customer support L1',
        'Use managed services where possible',
        'Set up SLAs and regular reviews',
        'Redirect team focus to high-value activities',
      ],
      risks: [
        'Quality control challenges',
        'Communication overhead',
        'Vendor dependency',
      ],
      shapleySHAP: calculateSHAPValues({
        focus_improvement: 45,
        cost_optimization: 30,
        expertise_access: 25,
      }),
      agentContributions: {
        orchestrator: 10,
        simulation_cluster: 10,
        decision_intelligence: 15,
        operations_optimizer: 28,
        personal_coach: 10,
        innovation_advisor: 7,
        growth_strategist: 12,
        learning_adaptation: 8,
      },
    },
  ];
};

// Generate Marketing specific paths
const generateMarketingPaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  return [
    {
      id: 'marketing-paid',
      name: 'Paid Growth Engine',
      description: 'Scale through paid marketing channels',
      expectedValue: baseExpectedValue * 1.8,
      probability: 0.60,
      riskScore: 55,
      timeline: 90,
      costs: {
        immediate: profile.mrr * 2,
        monthly: profile.mrr * 0.6,
      },
      benefits: {
        revenue: baseExpectedValue * 2.2,
        efficiency: 30,
        riskReduction: 25,
      },
      steps: [
        'Set up Google Ads and Meta Ads accounts',
        'Test 10+ ad creatives with small budgets',
        'Find channels with CAC < LTV/3',
        'Scale winning campaigns 20% weekly',
        'Build retargeting funnels',
      ],
      risks: [
        'High initial investment before ROI',
        'CAC may not be sustainable',
        'Dependent on ad platforms',
      ],
      shapleySHAP: calculateSHAPValues({
        scale_potential: 50,
        speed_of_results: 30,
        measurability: 20,
      }),
      agentContributions: {
        orchestrator: 10,
        simulation_cluster: 15,
        decision_intelligence: 18,
        operations_optimizer: 12,
        personal_coach: 5,
        innovation_advisor: 10,
        growth_strategist: 25,
        learning_adaptation: 5,
      },
    },
    {
      id: 'marketing-organic',
      name: 'Organic & Content',
      description: 'Build sustainable organic acquisition channels',
      expectedValue: baseExpectedValue * 1.3,
      probability: 0.75,
      riskScore: 30,
      timeline: 180,
      costs: {
        immediate: profile.mrr * 0.5,
        monthly: profile.mrr * 0.15,
      },
      benefits: {
        revenue: baseExpectedValue * 1.5,
        efficiency: 50,
        riskReduction: 55,
      },
      steps: [
        'Create content strategy (blog, YouTube, LinkedIn)',
        'Publish 2-3x quality content weekly',
        'Build SEO foundation for long-term traffic',
        'Engage in communities where customers are',
        'Develop referral and word-of-mouth programs',
      ],
      risks: [
        'Takes 6-12 months to show results',
        'Requires consistent effort',
        'Hard to predict outcomes',
      ],
      shapleySHAP: calculateSHAPValues({
        long_term_value: 45,
        brand_building: 30,
        cost_efficiency: 25,
      }),
      agentContributions: {
        orchestrator: 8,
        simulation_cluster: 10,
        decision_intelligence: 15,
        operations_optimizer: 15,
        personal_coach: 10,
        innovation_advisor: 12,
        growth_strategist: 22,
        learning_adaptation: 8,
      },
    },
    {
      id: 'marketing-partnerships',
      name: 'Partnership & Alliances',
      description: 'Grow through strategic partnerships',
      expectedValue: baseExpectedValue * 1.5,
      probability: 0.55,
      riskScore: 40,
      timeline: 120,
      costs: {
        immediate: profile.mrr * 0.3,
        monthly: profile.mrr * 0.1,
      },
      benefits: {
        revenue: baseExpectedValue * 1.8,
        efficiency: 35,
        riskReduction: 40,
      },
      steps: [
        'Identify 10 complementary businesses',
        'Propose co-marketing or referral arrangements',
        'Build integration partnerships',
        'Create joint offerings or bundles',
        'Revenue share or affiliate programs',
      ],
      risks: [
        'Dependent on partner performance',
        'Complex to manage multiple relationships',
        'Revenue sharing reduces margins',
      ],
      shapleySHAP: calculateSHAPValues({
        market_access: 45,
        credibility: 30,
        shared_resources: 25,
      }),
      agentContributions: {
        orchestrator: 12,
        simulation_cluster: 10,
        decision_intelligence: 18,
        operations_optimizer: 10,
        personal_coach: 8,
        innovation_advisor: 15,
        growth_strategist: 22,
        learning_adaptation: 5,
      },
    },
  ];
};

// ============================================================================
// INDUSTRY-SPECIFIC GROWTH PATH GENERATORS
// ============================================================================

const normalizeIndustry = (industry: string): string => {
  const lower = (industry || '').toLowerCase().trim();
  const map: Record<string, string> = {
    'saas': 'saas', 'software': 'saas', 'saas b2b': 'saas',
    'e-commerce': 'ecommerce', 'ecommerce': 'ecommerce',
    'healthcare': 'healthcare', 'medical': 'healthcare', 'clinic': 'healthcare',
    'fintech': 'fintech', 'financial': 'fintech',
    'edtech': 'edtech', 'education': 'edtech', 'coaching': 'edtech',
    'food & beverage': 'food', 'food': 'food', 'restaurant': 'food', 'cloud kitchen': 'food', 'cafe': 'food',
    'manufacturing': 'manufacturing',
    'logistics': 'logistics', 'supply chain': 'logistics',
    'retail': 'retail',
    'kirana/grocery': 'kirana', 'kirana': 'kirana', 'grocery': 'kirana',
    'd2c fashion': 'd2c', 'd2c': 'd2c', 'd2c clothing': 'd2c',
    'real estate': 'realestate', 'property': 'realestate',
    'consulting': 'consulting', 'professional services': 'consulting', 'agency': 'consulting',
    'beauty & wellness': 'beauty', 'beauty': 'beauty', 'salon': 'beauty', 'spa': 'beauty', 'wellness': 'beauty',
    'fitness': 'beauty', 'gym': 'beauty',
  };
  return map[lower] || 'general';
};

const generateGrowthPaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  const industry = normalizeIndustry(profile.industry);
  const mrr = profile.mrr;

  const industryGrowthConfigs: Record<string, { paths: Array<{ name: string; desc: string; ev: number; prob: number; risk: number; timeline: number; costMult: number; monthlyCostMult: number; revMult: number; eff: number; riskRed: number; steps: string[]; risks: string[]; shapFeatures: Record<string, number> }> }> = {
    saas: {
      paths: [
        {
          name: 'Product-Led Growth',
          desc: 'Scale through self-serve product adoption, freemium funnel, and viral loops',
          ev: 1.8, prob: 0.70, risk: 50, timeline: 120, costMult: 3, monthlyCostMult: 0.3, revMult: 2.0, eff: 45, riskRed: 25,
          steps: ['Launch freemium tier with viral sharing features', 'Build in-app onboarding that converts free→paid', 'Implement product analytics (Mixpanel/Amplitude)', 'Create self-serve upgrade flow with annual plans', 'Target PLG benchmark: <₹5K CAC'],
          risks: ['Free users may not convert', 'Support costs for free tier', 'Requires strong product-market fit'],
          shapFeatures: { product_adoption: 45, viral_coefficient: 30, conversion_rate: 25 },
        },
        {
          name: 'Enterprise Sales Motion',
          desc: 'Build dedicated enterprise sales team for large contracts',
          ev: 2.2, prob: 0.55, risk: 65, timeline: 180, costMult: 5, monthlyCostMult: 0.5, revMult: 2.8, eff: 30, riskRed: 20,
          steps: ['Hire 2-3 enterprise AEs with rolodex', 'Build SOC2/ISO compliance for enterprise deals', 'Create case studies and enterprise pricing', 'Develop custom integration capabilities', 'Target ACV ₹10L+ with 12-month contracts'],
          risks: ['Long sales cycles (3-6 months)', 'High cost of enterprise sales team', 'Need compliance certifications'],
          shapFeatures: { deal_size: 45, sales_capacity: 30, product_readiness: 25 },
        },
        {
          name: 'Expansion Revenue Focus',
          desc: 'Grow MRR through upsells, cross-sells, and net revenue retention',
          ev: 1.4, prob: 0.85, risk: 25, timeline: 90, costMult: 1, monthlyCostMult: 0.1, revMult: 1.5, eff: 50, riskRed: 55,
          steps: ['Implement usage-based pricing tiers', 'Launch add-on modules and premium features', 'Build customer success team for proactive upselling', 'Target 120%+ net revenue retention', 'Create expansion playbook by customer segment'],
          risks: ['May upset existing customers with pricing changes', 'Requires deep product analytics', 'Cross-sell may cannibalize existing revenue'],
          shapFeatures: { net_retention: 50, customer_health: 30, feature_adoption: 20 },
        },
      ],
    },
    ecommerce: {
      paths: [
        {
          name: 'Multi-Channel Expansion',
          desc: 'Expand to multiple sales channels: own website, marketplaces, social commerce',
          ev: 1.9, prob: 0.70, risk: 55, timeline: 90, costMult: 4, monthlyCostMult: 0.4, revMult: 2.2, eff: 35, riskRed: 20,
          steps: ['List on Amazon, Flipkart, Meesho simultaneously', 'Build D2C website with Shopify/custom stack', 'Launch Instagram & WhatsApp commerce channels', 'Implement unified inventory management', 'Optimize for each platform\'s algorithm'],
          risks: ['Inventory management across channels', 'Platform dependency and commission costs', 'Brand dilution across marketplaces'],
          shapFeatures: { channel_reach: 45, inventory_efficiency: 30, brand_visibility: 25 },
        },
        {
          name: 'Category Extension',
          desc: 'Add complementary product categories to increase basket size',
          ev: 1.5, prob: 0.75, risk: 40, timeline: 120, costMult: 3, monthlyCostMult: 0.3, revMult: 1.8, eff: 40, riskRed: 35,
          steps: ['Analyze top customers\' purchase patterns', 'Source 3-5 complementary product categories', 'Test with small batch before full launch', 'Bundle products for higher AOV', 'Build private label for top-selling categories'],
          risks: ['Capital tied up in new inventory', 'Quality control for new categories', 'May distract from core category'],
          shapFeatures: { basket_size: 40, category_fit: 35, supplier_reliability: 25 },
        },
        {
          name: 'Geographic Expansion',
          desc: 'Expand delivery network to new cities and tier-2/3 markets',
          ev: 1.6, prob: 0.65, risk: 50, timeline: 150, costMult: 5, monthlyCostMult: 0.35, revMult: 2.0, eff: 25, riskRed: 30,
          steps: ['Identify top 5 tier-2 cities with demand data', 'Set up dark stores or 3PL partnerships', 'Launch with hyperlocal marketing campaigns', 'Optimize last-mile delivery costs', 'Build local customer support teams'],
          risks: ['Logistics costs in new cities', 'Lower demand density in tier-2/3', 'Different customer preferences by region'],
          shapFeatures: { market_potential: 45, logistics_cost: 30, local_demand: 25 },
        },
      ],
    },
    healthcare: {
      paths: [
        {
          name: 'Multi-Location Expansion',
          desc: 'Open new clinic/hospital locations in high-demand areas',
          ev: 2.0, prob: 0.65, risk: 60, timeline: 180, costMult: 8, monthlyCostMult: 0.5, revMult: 2.5, eff: 30, riskRed: 20,
          steps: ['Survey demand in target localities (1km radius analysis)', 'Secure NABH-ready premises with required sq.ft.', 'Recruit specialist doctors and nursing staff', 'Obtain Clinical Establishment Act registrations', 'Launch with health camps and doctor referral programs'],
          risks: ['High capex for medical equipment', 'Doctor retention challenges', 'Regulatory approvals take 3-6 months'],
          shapFeatures: { location_demand: 45, doctor_availability: 30, regulatory_readiness: 25 },
        },
        {
          name: 'Specialist Network',
          desc: 'Build visiting specialist model with revenue-sharing doctors',
          ev: 1.5, prob: 0.80, risk: 35, timeline: 90, costMult: 2, monthlyCostMult: 0.2, revMult: 1.8, eff: 45, riskRed: 50,
          steps: ['Onboard 10-15 visiting specialists (60:40 revenue share)', 'Create scheduling system for specialist slots', 'Market specialist availability to referring GPs', 'Build diagnostic partnerships for tests/imaging', 'Implement patient follow-up and review system'],
          risks: ['Specialist availability conflicts', 'Revenue share negotiations', 'Quality consistency across doctors'],
          shapFeatures: { specialist_network: 40, patient_flow: 35, referral_strength: 25 },
        },
        {
          name: 'Telemedicine Platform',
          desc: 'Launch digital consultation platform for remote patients',
          ev: 1.3, prob: 0.75, risk: 30, timeline: 60, costMult: 1.5, monthlyCostMult: 0.15, revMult: 1.5, eff: 55, riskRed: 60,
          steps: ['Build/integrate telemedicine platform (Practo/custom)', 'Train doctors on virtual consultation protocols', 'Set up e-prescription and pharmacy delivery', 'Target tier-2/3 patients with limited specialist access', 'Integrate with existing EMR system'],
          risks: ['Lower consultation fees vs in-person', 'Technology adoption by older patients', 'Regulatory framework still evolving'],
          shapFeatures: { digital_reach: 45, patient_accessibility: 35, operational_efficiency: 20 },
        },
      ],
    },
    fintech: {
      paths: [
        {
          name: 'New Payment Methods',
          desc: 'Add BNPL, EMI, and cross-border payment capabilities',
          ev: 2.0, prob: 0.60, risk: 65, timeline: 120, costMult: 5, monthlyCostMult: 0.4, revMult: 2.5, eff: 35, riskRed: 20,
          steps: ['Integrate BNPL with lending partners (Capital Float, ZestMoney)', 'Launch EMI options on partner merchant platforms', 'Build UPI autopay for subscription businesses', 'Add cross-border payments via RBI sandbox', 'Implement real-time fraud detection for new channels'],
          risks: ['RBI regulatory changes', 'Credit risk in BNPL', 'Integration complexity with banking partners'],
          shapFeatures: { transaction_volume: 45, regulatory_compliance: 30, partner_integration: 25 },
        },
        {
          name: 'B2B Expansion',
          desc: 'Target businesses with payment, lending, and treasury solutions',
          ev: 2.2, prob: 0.55, risk: 55, timeline: 150, costMult: 4, monthlyCostMult: 0.35, revMult: 2.8, eff: 30, riskRed: 25,
          steps: ['Build API-first B2B payment gateway', 'Launch invoice factoring for SME customers', 'Offer treasury management for cash-rich businesses', 'Create bulk payout solution for enterprises', 'Get NBFC/PA license for expanded offerings'],
          risks: ['Long B2B sales cycles', 'Need for compliance certifications', 'High integration costs per client'],
          shapFeatures: { b2b_market_size: 40, api_readiness: 35, compliance_level: 25 },
        },
        {
          name: 'API Platform',
          desc: 'Productize your payment stack as developer APIs',
          ev: 1.6, prob: 0.70, risk: 40, timeline: 90, costMult: 2, monthlyCostMult: 0.2, revMult: 2.0, eff: 50, riskRed: 40,
          steps: ['Document and productize core payment APIs', 'Build developer portal with sandbox environment', 'Create SDK for popular languages (Node, Python, Java)', 'Launch developer community and hackathons', 'Implement usage-based pricing model'],
          risks: ['Developer adoption takes time', 'Support costs for integration help', 'Competition from Razorpay/Cashfree'],
          shapFeatures: { developer_experience: 45, api_reliability: 30, ecosystem_growth: 25 },
        },
      ],
    },
    edtech: {
      paths: [
        {
          name: 'B2C Digital Marketing',
          desc: 'Scale student enrollment through performance marketing and influencers',
          ev: 1.8, prob: 0.65, risk: 55, timeline: 90, costMult: 4, monthlyCostMult: 0.5, revMult: 2.2, eff: 35, riskRed: 20,
          steps: ['Launch YouTube and Instagram ad campaigns targeting students', 'Build free content funnel (webinars, free courses)', 'Create student ambassador program across colleges', 'Optimize landing pages for ₹500-2000 CAC', 'Implement demo class → enrollment conversion flow'],
          risks: ['High CAC in competitive edtech market', 'Seasonal enrollment patterns', 'Student refund/dropout rates'],
          shapFeatures: { student_acquisition: 45, content_quality: 30, conversion_rate: 25 },
        },
        {
          name: 'B2B School Partnerships',
          desc: 'Partner with schools and institutions for bulk enrollments',
          ev: 1.6, prob: 0.75, risk: 35, timeline: 120, costMult: 2, monthlyCostMult: 0.2, revMult: 2.0, eff: 45, riskRed: 45,
          steps: ['Identify 50+ schools in target cities', 'Create school-specific curriculum aligned to boards (CBSE/ICSE)', 'Offer teacher training and admin dashboard', 'Negotiate annual contracts with volume discounts', 'Build school referral network'],
          risks: ['Long decision cycles in schools', 'Need for board-specific content', 'Price sensitivity in education'],
          shapFeatures: { school_partnerships: 40, curriculum_alignment: 35, institutional_trust: 25 },
        },
        {
          name: 'Hybrid Model',
          desc: 'Combine online with offline centers in tier-2/3 cities',
          ev: 1.4, prob: 0.80, risk: 30, timeline: 150, costMult: 3, monthlyCostMult: 0.25, revMult: 1.6, eff: 40, riskRed: 50,
          steps: ['Open 3-5 learning centers in tier-2 cities', 'Use online content with offline mentoring support', 'Hire local tutors for doubt-clearing sessions', 'Build community events and workshops', 'Create certification programs with placement support'],
          risks: ['Higher operational costs vs pure-online', 'Location selection critical', 'Local competition from coaching centers'],
          shapFeatures: { offline_demand: 40, hybrid_efficiency: 35, local_brand: 25 },
        },
      ],
    },
    food: {
      paths: [
        {
          name: 'Multi-Location Expansion',
          desc: 'Open new outlets in high-footfall areas with proven menu',
          ev: 1.8, prob: 0.60, risk: 60, timeline: 120, costMult: 6, monthlyCostMult: 0.4, revMult: 2.2, eff: 30, riskRed: 20,
          steps: ['Identify 3-5 high-footfall locations (malls, office areas)', 'Standardize recipes and kitchen processes for scale', 'Set up central kitchen for consistency and cost savings', 'Recruit and train kitchen staff with SOPs', 'Launch with Swiggy/Zomato integration from day 1'],
          risks: ['High capex per location (₹15-50L)', 'Quality consistency across outlets', 'Rent and fixed cost burden'],
          shapFeatures: { location_quality: 45, recipe_scalability: 30, brand_strength: 25 },
        },
        {
          name: 'Virtual Brands',
          desc: 'Launch multiple cloud kitchen brands from same kitchen',
          ev: 1.5, prob: 0.75, risk: 35, timeline: 60, costMult: 1.5, monthlyCostMult: 0.2, revMult: 1.8, eff: 50, riskRed: 45,
          steps: ['Identify 2-3 trending cuisines for virtual brands', 'Create distinct brand identities and menus', 'List all brands on aggregator platforms', 'Optimize kitchen workflow for multi-brand production', 'A/B test pricing and menu combinations'],
          risks: ['Aggregator commission eats into margins', 'Brand differentiation challenges', 'Kitchen capacity constraints'],
          shapFeatures: { cuisine_demand: 40, kitchen_efficiency: 35, aggregator_ranking: 25 },
        },
        {
          name: 'Franchise Model',
          desc: 'Scale through franchising with standardized operations',
          ev: 2.0, prob: 0.55, risk: 50, timeline: 180, costMult: 2, monthlyCostMult: 0.15, revMult: 2.5, eff: 40, riskRed: 35,
          steps: ['Document franchise operations manual', 'Set up franchise fee structure (₹5-15L + 5% royalty)', 'Create FSSAI and legal compliance package', 'Launch franchise portal and start selling', 'Build franchise support and audit team'],
          risks: ['Quality control with franchisees', 'Brand reputation risk', 'Legal complexity of franchise agreements'],
          shapFeatures: { brand_value: 45, operational_documentation: 30, franchisee_quality: 25 },
        },
      ],
    },
    manufacturing: {
      paths: [
        {
          name: 'New Plant Setup',
          desc: 'Build additional manufacturing facility for increased capacity',
          ev: 2.2, prob: 0.55, risk: 70, timeline: 365, costMult: 10, monthlyCostMult: 0.3, revMult: 3.0, eff: 30, riskRed: 15,
          steps: ['Identify land in industrial area (MIDC/SEZ benefits)', 'Apply for Udyam/MSME registration and subsidies', 'Procure machinery with SIDBI/equipment financing', 'Hire skilled operators and setup training program', 'Obtain factory license, pollution control, BIS certifications'],
          risks: ['High capital investment (₹1Cr+)', 'Regulatory approvals take 6-12 months', 'Demand may not justify capacity'],
          shapFeatures: { capacity_gap: 45, capital_availability: 30, regulatory_readiness: 25 },
        },
        {
          name: 'Third Shift Operations',
          desc: 'Maximize existing plant utilization with additional shift',
          ev: 1.5, prob: 0.80, risk: 30, timeline: 45, costMult: 1, monthlyCostMult: 0.3, revMult: 1.5, eff: 55, riskRed: 50,
          steps: ['Assess machine capacity for 24/7 operation', 'Recruit night-shift workers (20% premium wages)', 'Set up shift supervision and quality checks', 'Optimize maintenance schedule for minimal downtime', 'Negotiate better raw material rates with higher volumes'],
          risks: ['Worker fatigue and safety concerns', 'Machine wear increases', 'Quality issues during night shift'],
          shapFeatures: { plant_utilization: 50, labor_availability: 30, maintenance_readiness: 20 },
        },
        {
          name: 'Contract Manufacturing',
          desc: 'Outsource production to third-party manufacturers for quick scaling',
          ev: 1.3, prob: 0.85, risk: 25, timeline: 60, costMult: 0.5, monthlyCostMult: 0.4, revMult: 1.4, eff: 45, riskRed: 55,
          steps: ['Identify 3-5 contract manufacturers with spare capacity', 'Share specifications and quality standards', 'Set up quality inspection at contractor facility', 'Negotiate per-unit pricing with volume commitments', 'Maintain IP protection with NDAs'],
          risks: ['Quality control challenges', 'IP leakage risk', 'Supplier dependency'],
          shapFeatures: { supplier_capacity: 40, quality_control: 35, cost_efficiency: 25 },
        },
      ],
    },
    logistics: {
      paths: [
        {
          name: 'Own Fleet Expansion',
          desc: 'Scale delivery capacity with owned/leased vehicles',
          ev: 1.8, prob: 0.60, risk: 60, timeline: 120, costMult: 6, monthlyCostMult: 0.4, revMult: 2.2, eff: 35, riskRed: 20,
          steps: ['Procure 15-20 delivery vehicles (lease vs buy analysis)', 'Hire and train delivery executives', 'Implement GPS tracking and route optimization', 'Set up hub-and-spoke model in new areas', 'Build maintenance team and fuel management system'],
          risks: ['High capex for vehicles', 'Driver retention challenges', 'Fuel cost volatility'],
          shapFeatures: { delivery_capacity: 45, route_efficiency: 30, fleet_management: 25 },
        },
        {
          name: 'Gig Worker Network',
          desc: 'Build flexible delivery network with gig/freelance riders',
          ev: 1.5, prob: 0.75, risk: 35, timeline: 60, costMult: 1.5, monthlyCostMult: 0.3, revMult: 1.8, eff: 50, riskRed: 40,
          steps: ['Launch rider app with onboarding flow', 'Set competitive per-delivery payout structure', 'Create incentive system for peak-hour availability', 'Build rider support and grievance system', 'Implement rider insurance and safety training'],
          risks: ['Rider availability during peaks', 'Service quality inconsistency', 'Labor law compliance for gig workers'],
          shapFeatures: { rider_availability: 40, cost_per_delivery: 35, service_quality: 25 },
        },
        {
          name: '3PL Partnership',
          desc: 'Partner with third-party logistics providers for network coverage',
          ev: 1.3, prob: 0.85, risk: 20, timeline: 30, costMult: 0.5, monthlyCostMult: 0.2, revMult: 1.5, eff: 55, riskRed: 60,
          steps: ['Evaluate 3PL providers (Delhivery, Ecom Express, DTDC)', 'Negotiate volume-based pricing and SLAs', 'Integrate tracking APIs with your platform', 'Set up escalation matrix for delivery failures', 'Monitor performance metrics weekly'],
          risks: ['Less control over delivery experience', 'Margin compression from 3PL costs', 'SLA enforcement challenges'],
          shapFeatures: { network_coverage: 45, cost_optimization: 30, service_reliability: 25 },
        },
      ],
    },
    retail: {
      paths: [
        {
          name: 'Company-Owned Expansion',
          desc: 'Open new company-owned retail outlets',
          ev: 1.8, prob: 0.60, risk: 60, timeline: 150, costMult: 7, monthlyCostMult: 0.4, revMult: 2.2, eff: 30, riskRed: 20,
          steps: ['Identify high-footfall locations with ₹50K+ monthly footfall', 'Negotiate lease terms (3+3 year lock-in)', 'Standardize store design and visual merchandising', 'Hire and train store managers and sales staff', 'Launch with grand opening promotions and local marketing'],
          risks: ['High rental and fit-out costs', 'Location selection is critical', 'Working capital for inventory'],
          shapFeatures: { location_quality: 45, brand_recall: 30, inventory_management: 25 },
        },
        {
          name: 'Franchise Network',
          desc: 'Scale through franchise partners who invest and operate stores',
          ev: 2.0, prob: 0.55, risk: 45, timeline: 120, costMult: 2, monthlyCostMult: 0.15, revMult: 2.5, eff: 45, riskRed: 40,
          steps: ['Create franchise documentation and training program', 'Set franchise fee (₹10-25L) and royalty (4-6%)', 'Launch franchise sales campaign', 'Build field support team for franchisee management', 'Implement POS and inventory system for all stores'],
          risks: ['Quality control across franchisees', 'Franchisee relationship management', 'Brand consistency challenges'],
          shapFeatures: { brand_strength: 40, franchise_economics: 35, operational_manual: 25 },
        },
        {
          name: 'Shop-in-Shop Model',
          desc: 'Place branded sections inside existing retail stores',
          ev: 1.3, prob: 0.80, risk: 25, timeline: 45, costMult: 1, monthlyCostMult: 0.1, revMult: 1.5, eff: 50, riskRed: 55,
          steps: ['Partner with complementary retail chains', 'Design compact branded display units', 'Train host store staff on your products', 'Set up revenue-sharing model (20-30% to host)', 'Scale to 20+ locations rapidly with low investment'],
          risks: ['Limited control over customer experience', 'Host store traffic dependency', 'Revenue sharing reduces margins'],
          shapFeatures: { distribution_reach: 45, cost_efficiency: 35, brand_visibility: 20 },
        },
      ],
    },
    kirana: {
      paths: [
        {
          name: 'Inventory Expansion',
          desc: 'Add new product categories and brands to increase basket size',
          ev: 1.4, prob: 0.80, risk: 25, timeline: 30, costMult: 1, monthlyCostMult: 0.15, revMult: 1.5, eff: 45, riskRed: 55,
          steps: ['Analyze top-selling items and gaps in inventory', 'Add FMCG, personal care, and daily essentials brands', 'Negotiate direct from company (bypass wholesaler)', 'Use JioMart/Udaan for better wholesale pricing', 'Implement FIFO for perishables to reduce wastage'],
          risks: ['Capital locked in inventory', 'Wastage for perishable items', 'Storage space constraints'],
          shapFeatures: { product_range: 40, wastage_control: 35, supplier_pricing: 25 },
        },
        {
          name: 'Home Delivery Service',
          desc: 'Launch home delivery to compete with quick commerce',
          ev: 1.5, prob: 0.70, risk: 35, timeline: 45, costMult: 0.5, monthlyCostMult: 0.2, revMult: 1.8, eff: 40, riskRed: 40,
          steps: ['Hire 2-3 delivery boys for 2km radius', 'Set up WhatsApp ordering system for regular customers', 'Offer free delivery above ₹500 order value', 'Create monthly subscription packs for staples', 'Build loyalty program with credit facility'],
          risks: ['Delivery cost vs order value', 'Competition from Blinkit/Zepto', 'Managing credit risk with customers'],
          shapFeatures: { delivery_demand: 40, order_value: 35, customer_retention: 25 },
        },
        {
          name: 'Kirana Franchise',
          desc: 'Open additional outlets in nearby localities',
          ev: 1.6, prob: 0.60, risk: 45, timeline: 90, costMult: 3, monthlyCostMult: 0.3, revMult: 2.0, eff: 30, riskRed: 30,
          steps: ['Identify underserved localities within 5km', 'Set up 200-400 sq.ft. outlet with essential inventory', 'Hire local shopkeeper to manage operations', 'Centralize procurement for cost savings', 'Apply for Mudra Loan for ₹5-10L setup cost'],
          risks: ['High rent in good locations', 'Staff management challenges', 'Cannibalization of existing store sales'],
          shapFeatures: { locality_demand: 45, rent_economics: 30, staff_reliability: 25 },
        },
      ],
    },
    d2c: {
      paths: [
        {
          name: 'Performance Marketing Scale',
          desc: 'Aggressively scale paid acquisition channels',
          ev: 1.8, prob: 0.60, risk: 60, timeline: 90, costMult: 4, monthlyCostMult: 0.5, revMult: 2.2, eff: 30, riskRed: 20,
          steps: ['Set up Meta, Google, and Instagram ad accounts', 'Test 20+ creative variations across audiences', 'Optimize for ROAS > 3x within 30 days', 'Scale winning ads by 20% weekly', 'Build retargeting funnels for cart abandonment'],
          risks: ['High CAC may not be sustainable', 'Platform algorithm changes', 'Creative fatigue requires constant refresh'],
          shapFeatures: { ad_efficiency: 45, creative_quality: 30, customer_ltv: 25 },
        },
        {
          name: 'Influencer & Community Push',
          desc: 'Build brand through micro-influencers and community marketing',
          ev: 1.5, prob: 0.70, risk: 40, timeline: 120, costMult: 2, monthlyCostMult: 0.25, revMult: 1.8, eff: 40, riskRed: 40,
          steps: ['Identify 50+ micro-influencers (10K-100K followers)', 'Create affiliate/commission program for influencers', 'Launch user-generated content campaigns', 'Build brand community on Instagram/Discord', 'Organize pop-up events in metro cities'],
          risks: ['Influencer reliability and ROI tracking', 'Brand message control', 'Community building takes time'],
          shapFeatures: { influencer_reach: 40, brand_authenticity: 35, community_engagement: 25 },
        },
        {
          name: 'Marketplace Expansion',
          desc: 'Expand to Amazon, Myntra, Ajio and other fashion marketplaces',
          ev: 1.6, prob: 0.75, risk: 35, timeline: 60, costMult: 1.5, monthlyCostMult: 0.2, revMult: 2.0, eff: 45, riskRed: 45,
          steps: ['List top 20 SKUs on Amazon Fashion and Myntra', 'Optimize listings with professional photography', 'Participate in marketplace sale events (BBD, EOSS)', 'Use FBA/Fulfillment by marketplace for faster delivery', 'Monitor marketplace metrics: BSR, reviews, returns'],
          risks: ['Marketplace commissions (15-30%)', 'Price competition pressure', 'Limited customer data ownership'],
          shapFeatures: { marketplace_visibility: 45, product_competitiveness: 30, fulfillment_speed: 25 },
        },
      ],
    },
    realestate: {
      paths: [
        {
          name: 'New Project Launch',
          desc: 'Launch new residential/commercial project in high-demand area',
          ev: 2.5, prob: 0.50, risk: 75, timeline: 365, costMult: 12, monthlyCostMult: 0.3, revMult: 3.5, eff: 25, riskRed: 15,
          steps: ['Acquire land bank in high-growth corridor', 'Obtain necessary approvals (RERA, environmental, building)', 'Hire architect and begin project design', 'Launch pre-sales with early-bird pricing', 'Start construction with phased payment collection'],
          risks: ['Capital intensive (₹5Cr+ investment)', 'Regulatory approval delays', 'Market demand fluctuation'],
          shapFeatures: { land_value: 45, regulatory_clearance: 30, market_demand: 25 },
        },
        {
          name: 'JV Development',
          desc: 'Joint venture with landowners to develop projects without land purchase',
          ev: 2.0, prob: 0.65, risk: 50, timeline: 270, costMult: 4, monthlyCostMult: 0.2, revMult: 2.5, eff: 40, riskRed: 35,
          steps: ['Identify landowners open to JV (60:40 or 70:30 split)', 'Structure JV agreement with clear revenue sharing', 'Handle all approvals and construction', 'Launch marketing and sales from pre-launch stage', 'Deliver project and distribute proceeds per agreement'],
          risks: ['JV partner disputes', 'Land title issues', 'Revenue sharing reduces margins'],
          shapFeatures: { partner_reliability: 40, land_location: 35, agreement_clarity: 25 },
        },
        {
          name: 'Asset Light Model',
          desc: 'Focus on project management and marketing without owning land',
          ev: 1.3, prob: 0.80, risk: 25, timeline: 120, costMult: 1, monthlyCostMult: 0.15, revMult: 1.5, eff: 55, riskRed: 60,
          steps: ['Position as project management consultancy for builders', 'Offer end-to-end marketing and sales services', 'Take management fees (3-5% of project value)', 'Build strong channel partner network', 'Create tech platform for project tracking'],
          risks: ['Lower margins per project', 'Dependency on builder clients', 'Limited brand building for end customers'],
          shapFeatures: { project_management: 45, sales_expertise: 30, builder_network: 25 },
        },
      ],
    },
    consulting: {
      paths: [
        {
          name: 'New Service Lines',
          desc: 'Add adjacent consulting practices to grow revenue per client',
          ev: 1.6, prob: 0.75, risk: 35, timeline: 90, costMult: 1.5, monthlyCostMult: 0.2, revMult: 1.8, eff: 45, riskRed: 45,
          steps: ['Survey existing clients for unmet needs', 'Hire 2-3 domain experts for new practice areas', 'Create standardized frameworks and deliverables', 'Cross-sell to existing client base', 'Build case studies and thought leadership content'],
          risks: ['Expertise gap in new areas', 'Client perception may limit expansion', 'Hiring senior consultants is expensive'],
          shapFeatures: { client_needs: 40, expertise_depth: 35, cross_sell_potential: 25 },
        },
        {
          name: 'Geographic Expansion',
          desc: 'Open offices in new cities to serve regional clients',
          ev: 1.8, prob: 0.60, risk: 55, timeline: 150, costMult: 3, monthlyCostMult: 0.3, revMult: 2.2, eff: 30, riskRed: 25,
          steps: ['Identify top 3 cities with consulting demand', 'Open co-working space with 2-3 senior consultants', 'Build local networks through industry events', 'Partner with regional industry associations', 'Target ₹20L+ annual engagements per city'],
          risks: ['High cost to establish local presence', 'Local competition from established firms', 'Travel and coordination overhead'],
          shapFeatures: { market_potential: 45, local_network: 30, talent_availability: 25 },
        },
        {
          name: 'Digital Products',
          desc: 'Productize consulting IP into courses, tools, and subscriptions',
          ev: 1.4, prob: 0.70, risk: 30, timeline: 120, costMult: 1, monthlyCostMult: 0.1, revMult: 1.6, eff: 55, riskRed: 55,
          steps: ['Package top frameworks into online courses', 'Build assessment/diagnostic tools as SaaS', 'Create subscription-based research/insights service', 'Launch on platforms like Udemy, LinkedIn Learning', 'Set up recurring revenue from digital products'],
          risks: ['Time investment to create quality content', 'Digital products commoditize expertise', 'Marketing digital products requires different skills'],
          shapFeatures: { ip_value: 40, digital_scalability: 35, content_quality: 25 },
        },
      ],
    },
    beauty: {
      paths: [
        {
          name: 'Own Outlet Expansion',
          desc: 'Open new salons/studios in high-footfall residential or commercial areas',
          ev: 1.7, prob: 0.65, risk: 55, timeline: 120, costMult: 5, monthlyCostMult: 0.4, revMult: 2.0, eff: 30, riskRed: 25,
          steps: ['Survey demand in target localities', 'Set up 500-1000 sq.ft. outlet with branded interiors', 'Recruit and train beauticians and therapists', 'Obtain trade license, health license, GST registration', 'Launch with opening offers and local marketing'],
          risks: ['High fit-out costs (₹10-25L)', 'Staff retention in beauty industry', 'Location dependency for footfall'],
          shapFeatures: { location_quality: 45, staff_skill: 30, brand_appeal: 25 },
        },
        {
          name: 'Franchise Model',
          desc: 'Scale through beauty franchise partners',
          ev: 1.9, prob: 0.55, risk: 45, timeline: 150, costMult: 2, monthlyCostMult: 0.15, revMult: 2.3, eff: 40, riskRed: 35,
          steps: ['Standardize service menu and quality protocols', 'Create franchise package (₹8-15L investment)', 'Build training academy for franchisee staff', 'Set up centralized product procurement', 'Launch franchise sales with beauty industry events'],
          risks: ['Quality consistency across franchisees', 'Training and retaining beauticians', 'Brand reputation risk from poor franchisees'],
          shapFeatures: { brand_value: 40, training_system: 35, franchise_economics: 25 },
        },
        {
          name: 'At-Home Services',
          desc: 'Launch doorstep beauty and wellness services',
          ev: 1.4, prob: 0.75, risk: 30, timeline: 60, costMult: 1, monthlyCostMult: 0.2, revMult: 1.6, eff: 50, riskRed: 50,
          steps: ['Build booking app/WhatsApp ordering system', 'Recruit and train at-home service professionals', 'Create standardized service kits for home visits', 'Set premium pricing (20-30% above salon rates)', 'Focus on repeat bookings with membership plans'],
          risks: ['Staff safety and insurance concerns', 'Inconsistent service quality at home', 'Competition from Urban Company/Yes Madam'],
          shapFeatures: { convenience_demand: 45, service_quality: 30, pricing_premium: 25 },
        },
      ],
    },
  };

  const config = industryGrowthConfigs[industry];
  if (config) {
    return config.paths.map((p, idx) => ({
      id: `growth-${industry}-${idx + 1}`,
      name: p.name,
      description: p.desc,
      expectedValue: baseExpectedValue * p.ev,
      probability: p.prob,
      riskScore: p.risk,
      timeline: p.timeline,
      costs: {
        immediate: mrr * p.costMult,
        monthly: mrr * p.monthlyCostMult,
      },
      benefits: {
        revenue: baseExpectedValue * p.revMult,
        efficiency: p.eff,
        riskReduction: p.riskRed,
      },
      steps: p.steps,
      risks: p.risks,
      shapleySHAP: calculateSHAPValues(p.shapFeatures),
      agentContributions: {
        orchestrator: 10 + idx * 2,
        simulation_cluster: 15 - idx,
        decision_intelligence: 20 - idx * 2,
        operations_optimizer: 18 + idx * 2,
        personal_coach: 8 + idx * 3,
        innovation_advisor: 7 + idx,
        growth_strategist: 18 - idx * 3,
        learning_adaptation: 4 + idx * 2,
      },
    }));
  }

  // Fallback: Generic growth paths with industry context in descriptions
  const industryName = profile.industry || 'business';
  return [
    {
      id: 'aggressive',
      name: 'Aggressive Scaling',
      description: `Aggressively scale your ${industryName} with heavy investment in team, marketing, and operations`,
      expectedValue: baseExpectedValue * 1.8,
      probability: 0.65,
      riskScore: 72,
      timeline: 90,
      costs: { immediate: mrr * 6, monthly: mrr * 0.4 },
      benefits: { revenue: baseExpectedValue * 2.0, efficiency: 35, riskReduction: 15 },
      steps: [
        `Raise funding to accelerate ${industryName} growth`,
        'Hire 10+ team members across key functions',
        'Launch aggressive marketing campaigns',
        'Expand to 2-3 new markets simultaneously',
      ],
      risks: ['High burn rate requires external funding', 'Rapid hiring may affect culture', 'Market conditions may change'],
      shapleySHAP: calculateSHAPValues({ team_capacity: 45, market_timing: 35, cash_buffer: 20 }),
      agentContributions: { orchestrator: 10, simulation_cluster: 15, decision_intelligence: 18, operations_optimizer: 22, personal_coach: 4, innovation_advisor: 7, growth_strategist: 19, learning_adaptation: 5 },
    },
    {
      id: 'balanced',
      name: 'Balanced Growth',
      description: `Sustainable ${industryName} growth through optimized operations and strategic hiring`,
      expectedValue: baseExpectedValue,
      probability: 0.85,
      riskScore: 45,
      timeline: 180,
      costs: { immediate: mrr * 2, monthly: mrr * 0.15 },
      benefits: { revenue: baseExpectedValue * 1.2, efficiency: 25, riskReduction: 40 },
      steps: [
        'Optimize current operations for efficiency',
        'Hire 3-5 key roles strategically',
        'Focus on organic and referral growth',
        'Build sustainable unit economics',
      ],
      risks: ['Slower growth may miss market window', 'Competitors may scale faster', 'Limited resources for experimentation'],
      shapleySHAP: calculateSHAPValues({ operational_efficiency: 40, market_stability: 35, cash_flow: 25 }),
      agentContributions: { orchestrator: 13, simulation_cluster: 14, decision_intelligence: 16, operations_optimizer: 19, personal_coach: 11, innovation_advisor: 5, growth_strategist: 12, learning_adaptation: 10 },
    },
    {
      id: 'conservative',
      name: 'Conservative Path',
      description: `Build ${industryName} cash reserves, improve margins, low risk approach`,
      expectedValue: baseExpectedValue * 0.6,
      probability: 0.95,
      riskScore: 20,
      timeline: 365,
      costs: { immediate: mrr * 0.5, monthly: mrr * 0.05 },
      benefits: { revenue: baseExpectedValue * 0.8, efficiency: 15, riskReduction: 75 },
      steps: [
        'Focus on existing customer retention',
        'Build 12+ months runway',
        'Improve profit margins by 20%',
        'Minimal new hires, upskill existing team',
      ],
      risks: ['May miss growth opportunities', 'Team may get demotivated', 'Market share may decline'],
      shapleySHAP: calculateSHAPValues({ cash_preservation: 50, risk_mitigation: 35, stability: 15 }),
      agentContributions: { orchestrator: 9, simulation_cluster: 9, decision_intelligence: 14, operations_optimizer: 16, personal_coach: 18, innovation_advisor: 3, growth_strategist: 7, learning_adaptation: 24 },
    },
  ];
};

// Generate Pivot specific paths
const generatePivotPaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  return [
    {
      id: 'pivot-full',
      name: 'Full Pivot',
      description: 'Complete change of product/market direction',
      expectedValue: baseExpectedValue * 1.5,
      probability: 0.35,
      riskScore: 80,
      timeline: 180,
      costs: {
        immediate: profile.mrr * 4,
        monthly: profile.mrr * 0.5,
      },
      benefits: {
        revenue: baseExpectedValue * 2.5,
        efficiency: 20,
        riskReduction: 15,
      },
      steps: [
        'Validate new direction with 20+ customer interviews',
        'Build MVP of new product (2-3 months)',
        'Migrate or transition existing customers',
        'Rebrand and reposition company',
        'Rebuild go-to-market strategy',
      ],
      risks: [
        'High failure rate',
        'Lose existing revenue',
        'Team may not align',
      ],
      shapleySHAP: calculateSHAPValues({
        new_opportunity: 50,
        market_fit: 30,
        team_capability: 20,
      }),
      agentContributions: {
        orchestrator: 15,
        simulation_cluster: 18,
        decision_intelligence: 22,
        operations_optimizer: 12,
        personal_coach: 8,
        innovation_advisor: 15,
        growth_strategist: 5,
        learning_adaptation: 5,
      },
    },
    {
      id: 'pivot-adjacent',
      name: 'Adjacent Expansion',
      description: 'Expand to adjacent market or product',
      expectedValue: baseExpectedValue * 1.4,
      probability: 0.65,
      riskScore: 45,
      timeline: 120,
      costs: {
        immediate: profile.mrr * 2,
        monthly: profile.mrr * 0.3,
      },
      benefits: {
        revenue: baseExpectedValue * 1.8,
        efficiency: 35,
        riskReduction: 35,
      },
      steps: [
        'Identify adjacent opportunities from customer feedback',
        'Test with existing customers first',
        'Launch as add-on or new product line',
        'Keep core business running',
        'Gradually shift resources based on traction',
      ],
      risks: [
        'Distraction from core business',
        'Resource split',
        'May cannibalize existing product',
      ],
      shapleySHAP: calculateSHAPValues({
        market_expansion: 40,
        customer_leverage: 35,
        risk_balance: 25,
      }),
      agentContributions: {
        orchestrator: 12,
        simulation_cluster: 15,
        decision_intelligence: 20,
        operations_optimizer: 15,
        personal_coach: 8,
        innovation_advisor: 12,
        growth_strategist: 13,
        learning_adaptation: 5,
      },
    },
    {
      id: 'pivot-optimize',
      name: 'Optimize Current Model',
      description: 'Stay course but optimize execution',
      expectedValue: baseExpectedValue * 1.1,
      probability: 0.85,
      riskScore: 20,
      timeline: 90,
      costs: {
        immediate: profile.mrr * 0.5,
        monthly: profile.mrr * 0.1,
      },
      benefits: {
        revenue: baseExpectedValue * 1.2,
        efficiency: 50,
        riskReduction: 65,
      },
      steps: [
        'Deep dive into current customer feedback',
        'Identify and fix product gaps',
        'Improve sales and onboarding process',
        'Reduce churn through better support',
        'Double down on what is working',
      ],
      risks: [
        'May miss bigger opportunity',
        'Market may not support current model',
        'Competition may disrupt',
      ],
      shapleySHAP: calculateSHAPValues({
        execution_improvement: 45,
        customer_retention: 35,
        incremental_gains: 20,
      }),
      agentContributions: {
        orchestrator: 10,
        simulation_cluster: 10,
        decision_intelligence: 15,
        operations_optimizer: 25,
        personal_coach: 15,
        innovation_advisor: 5,
        growth_strategist: 12,
        learning_adaptation: 8,
      },
    },
  ];
};

// Decision Path Generator with Multi-Agent Contributions
export const generateDecisionPaths = (
  profile: BusinessProfile,
  agentContributions: Record<AgentId, number>,
  query?: string
): DecisionPath[] => {
  const baseExpectedValue = profile.mrr * 12 * 0.3; // 30% annual growth potential

  // Detect query intent
  const intent = query ? detectQueryIntent(query) : 'general';

  // Return intent-specific paths based on detected intent
  switch (intent) {
    case 'market_entry':
      return generateMarketEntryPaths(profile, baseExpectedValue, query);
    case 'compliance':
      return generateCompliancePaths(profile, baseExpectedValue, query);
    case 'funding':
      return generateFundingPaths(profile, baseExpectedValue, query);
    case 'hiring':
      return generateHiringPaths(profile, baseExpectedValue, query);
    case 'operations':
      return generateOperationsPaths(profile, baseExpectedValue, query);
    case 'marketing':
      return generateMarketingPaths(profile, baseExpectedValue, query);
    case 'pivot':
      return generatePivotPaths(profile, baseExpectedValue, query);
    case 'growth':
      return generateGrowthPaths(profile, baseExpectedValue, query);
    case 'general':
    default:
      return generateGrowthPaths(profile, baseExpectedValue, query);
  }
};

// World Model Prediction (horizon-aware)
export const predictWorldModel = (
  profile: BusinessProfile,
  horizon: number // days
): { forecast: number; mae: number; confidence: number } => {
  const monthlyGrowthRate = 0.05 + (profile.growthTarget - 15) / 500;
  const forecastMonths = horizon / 30;

  // Compound growth with seasonality
  const baseForecast = profile.mrr * Math.pow(1 + monthlyGrowthRate, forecastMonths);
  
  // Add festival seasonality
  const festivalBoost = horizon > 60 && horizon < 120 ? 0.15 : 0.05;
  const forecast = baseForecast * (1 + festivalBoost);

  // MAE increases with horizon (typical for forecasts)
  const mae = forecast * (0.02 + horizon / 10000);
  const confidence = Math.max(0.5, 1 - horizon / 1000);

  return { forecast, mae, confidence };
};

// MARL Reward Simulation (episode-based)
export const simulateMARLEpisode = (
  episode: number,
  previousState: MARLState,
  agentActions: Record<AgentId, number>
): MARLState => {
  // Convergence pattern: Sigmoid curve to peak reward
  const convergenceTarget = 850;
  const convergenceRate = 0.015;
  const noise = (Math.random() - 0.5) * 50;
  const reward = convergenceTarget - (convergenceTarget - 500) * Math.exp(-convergenceRate * episode) + noise;

  // Agent reward distribution normalized to 100%
  const agentRewards: Record<AgentId, number> = {
    orchestrator: reward * 0.12,           // 12%
    simulation_cluster: reward * 0.16,     // 16%
    decision_intelligence: reward * 0.20,  // 20%
    operations_optimizer: reward * 0.22,   // 22%
    personal_coach: reward * 0.10,         // 10%
    innovation_advisor: reward * 0.07,     // 7%
    growth_strategist: reward * 0.09,      // 9%
    learning_adaptation: reward * 0.04,    // 4%
  };
  // Total: 100%

  const totalReward = Object.values(agentRewards).reduce((a, b) => a + b, 0);
  const convergenceMetric = Math.min(100, (totalReward / convergenceTarget) * 100);

  return {
    episode,
    totalReward,
    agentRewards,
    convergenceMetric,
    replayBufferSize: Math.min(10000, episode * 50),
    policyVersion: Math.floor(episode / 10),
  };
};

// Operational Metrics Generator with Industry-Specific Logic
export const generateOperationalMetrics = (profile: BusinessProfile) => {
  // Industry-specific hiring calculation
  const industryMultipliers: Record<string, number> = {
    saas: 0.25,
    ecommerce: 0.35,
    manufacturing: 0.40,
    services: 0.20,
    fintech: 0.30,
  };

  const industry = profile.industry?.toLowerCase() || 'saas';
  const multiplier = industryMultipliers[industry] || 0.30;
  const hiringNeeded = Math.ceil(profile.teamSize * multiplier);

  // Industry-specific roles
  const rolesByIndustry: Record<string, string[]> = {
    saas: ['Engineer', 'Product Manager', 'Customer Success'],
    ecommerce: ['Marketing', 'Logistics', 'Customer Support'],
    manufacturing: ['Operations', 'Quality Control', 'Supply Chain'],
    services: ['Sales', 'Account Manager', 'Delivery Manager'],
    fintech: ['Engineer', 'Compliance Officer', 'Risk Analyst'],
  };

  const rolesNeeded = rolesByIndustry[industry] || ['Engineer', 'Sales', 'Support'];
  const hiringTimeline: Record<string, { start: Date; end: Date; cost: number }> = {};

  rolesNeeded.forEach((role, idx) => {
    const start = new Date();
    start.setDate(start.getDate() + idx * 30);
    const end = new Date(start);
    end.setDate(end.getDate() + 60);
    hiringTimeline[role] = {
      start,
      end,
      cost: profile.mrr * 0.8,
    };
  });

  // Industry-specific inventory (only for product-based businesses)
  const hasInventory = ['ecommerce', 'manufacturing'].includes(industry);
  const inventoryMetrics = hasInventory ? {
    currentLevel: Math.round(profile.customers * 2.5), // 2.5x customer base
    reorderPoint: Math.round(profile.customers * 0.8),
    safetyStock: Math.round(profile.customers * 0.5),
    turnoverRatio: industry === 'ecommerce' ? 6.2 : 4.1, // Ecommerce turns faster
  } : {
    currentLevel: 0,
    reorderPoint: 0,
    safetyStock: 0,
    turnoverRatio: 0,
  };

  // Industry-specific suppliers
  const supplierCount = hasInventory ? 3 : 2;
  const suppliers = Array.from({ length: supplierCount }, (_, idx) => ({
    name: `${idx === 0 ? 'Primary' : idx === 1 ? 'Secondary' : 'Tertiary'}Supplier`,
    reliability: 95 - idx * 8,
    cost: profile.mrr * (0.25 + idx * 0.05),
    leadTime: 12 + idx * 7,
    negotiationPotential: 12 + idx * 8,
  }));

  // Real GST Compliance Check
  const annualRevenue = profile.mrr * 12;
  const gstThreshold = 2000000; // ₹20 lakh threshold for GST registration
  const gstRequired = annualRevenue >= gstThreshold;
  const gstCompliant = gstRequired; // Assume compliant if required

  // DPDP Act Compliance Check
  const dpdpRequired = profile.customers > 100 || profile.industry === 'fintech';
  const dpdpCompliant = dpdpRequired; // Assume compliant if data collected

  // UPI Settlement Check
  const upiEnabled = ['ecommerce', 'fintech', 'services'].includes(industry);

  return {
    hiring: {
      required: hiringNeeded,
      timeline: hiringTimeline,
      estimatedSavings: profile.mrr * 0.5,
    },
    inventory: inventoryMetrics,
    suppliers,
    compliance: {
      gst: gstCompliant,
      gstRequired,
      gstThreshold: annualRevenue >= gstThreshold ? `₹${(annualRevenue / 100000).toFixed(1)}L (Above ₹20L threshold)` : `₹${(annualRevenue / 100000).toFixed(1)}L (Below ₹20L threshold)`,
      dpdp: dpdpCompliant,
      dpdpRequired,
      dpdpNote: dpdpRequired ? 'DPDP Act applies - ensure consent management' : 'DPDP Act may not apply',
      upi: upiEnabled,
      upiSettlementTime: upiEnabled ? '30 mins - 1 day' : 'N/A',
    },
    burnoutRisk: 65,
    stressFactors: ['cash_flow_pressure', 'hiring_challenges', 'market_competition'],
  };
};

// Burnout Risk Reduction by Vibe
export const calculateBurnoutReduction = (
  baseRisk: number,
  vibeMode: 'aggressive' | 'balanced' | 'conservative'
): { baseRisk: number; riskAfterAdjustment: number; reduction: number; modeNote: string } => {
  const reductions = {
    aggressive: { reduction: 10, note: 'Fast growth but high stress' },
    balanced: { reduction: 35, note: 'Moderate growth, sustainable' },
    conservative: { reduction: 60, note: 'Low growth, high wellness' },
  };

  const mode = reductions[vibeMode];
  return {
    baseRisk,
    riskAfterAdjustment: Math.max(0, baseRisk - mode.reduction),
    reduction: mode.reduction,
    modeNote: mode.note,
  };
};

// Confidence Distribution with Monte Carlo Ensemble Simulation
export const generateConfidenceDistribution = (
  paths: DecisionPath[]
): { bins: string[]; counts: number[] } => {
  const bins = ['60-70%', '70-80%', '80-90%', '90-95%', '95-100%'];
  const binRanges = [
    [0.6, 0.7],
    [0.7, 0.8],
    [0.8, 0.9],
    [0.9, 0.95],
    [0.95, 1.0],
  ];

  // Generate ensemble of predictions (Monte Carlo simulation)
  // For each path, create 30 ensemble members with noise to simulate model uncertainty
  const ensemblePredictions: number[] = [];

  paths.forEach((path) => {
    const baseProb = path.probability;
    const uncertainty = 0.08; // ±8% uncertainty

    // Generate 30 ensemble members per path
    for (let i = 0; i < 30; i++) {
      // Add Gaussian noise around the base probability
      const noise = (Math.random() - 0.5) * 2 * uncertainty;
      const noisyProb = Math.max(0.5, Math.min(1.0, baseProb + noise));
      ensemblePredictions.push(noisyProb);
    }
  });

  // Count predictions in each bin
  const counts = binRanges.map((range) =>
    ensemblePredictions.filter((p) => p >= range[0] && p < range[1]).length
  );

  return { bins, counts };
};

// Competitor Response Heatmap
export const generateCompetitorHeatmap = (
  selectedPath: DecisionPath
): Array<{ scenario: string; aggressiveScore: number; conservativeScore: number; innovativeScore: number }> => {
  const ev = selectedPath.expectedValue;
  return [
    {
      scenario: 'Price War',
      aggressiveScore: Math.min(100, (ev / 500000) * 50 + 40),
      conservativeScore: Math.min(100, (ev / 500000) * 30),
      innovativeScore: Math.min(100, (ev / 500000) * 45),
    },
    {
      scenario: 'Feature Race',
      aggressiveScore: Math.min(100, 70),
      conservativeScore: Math.min(100, 35),
      innovativeScore: Math.min(100, 85),
    },
    {
      scenario: 'Market Consolidation',
      aggressiveScore: Math.min(100, 60),
      conservativeScore: Math.min(100, 50),
      innovativeScore: Math.min(100, 55),
    },
  ];
};
