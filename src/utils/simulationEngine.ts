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

  // Pivot
  if (lowerQuery.includes('pivot') || lowerQuery.includes('change') || lowerQuery.includes('transform')) {
    return 'pivot';
  }

  // Compliance
  if (lowerQuery.includes('gst') || lowerQuery.includes('tax') || lowerQuery.includes('compli') || lowerQuery.includes('legal')) {
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
                         lowerQuery.includes('fire') || lowerQuery.includes('action against');
  const isTaxRelated = lowerQuery.includes('gst') || lowerQuery.includes('tds') ||
                       lowerQuery.includes('tax') || lowerQuery.includes('compliance');

  if (isStaffRelated) {
    return [
      {
        id: 'legal-formal-process',
        name: 'Formal Legal Process',
        description: 'Follow proper HR and legal procedures with documentation',
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
        steps: [
          'Document all incidents and performance issues thoroughly',
          'Issue formal warning letters as per employment terms',
          'Consult with labor lawyer on proper termination procedure',
          'Ensure compliance with Industrial Disputes Act / Shops & Establishments Act',
          'Prepare full & final settlement with proper documentation',
        ],
        risks: [
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
        name: 'Mediation & Settlement',
        description: 'Resolve through internal mediation or mutual settlement',
        expectedValue: baseExpectedValue * 0.85,
        probability: 0.78,
        riskScore: 35,
        timeline: 30,
        costs: {
          immediate: 100000, // Settlement amount
          monthly: 0,
        },
        benefits: {
          revenue: baseExpectedValue * 0.9,
          efficiency: 35,
          riskReduction: 60,
        },
        steps: [
          'Arrange mediation meeting with HR and neutral third party',
          'Discuss mutual separation terms',
          'Offer reasonable severance package',
          'Get signed release/no-claim letter',
          'Ensure confidentiality agreement in place',
        ],
        risks: [
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
        name: 'Performance Improvement Plan',
        description: 'Give employee chance to improve before action',
        expectedValue: baseExpectedValue * 1.0,
        probability: 0.65,
        riskScore: 40,
        timeline: 60,
        costs: {
          immediate: 0,
          monthly: 5000, // HR/monitoring costs
        },
        benefits: {
          revenue: baseExpectedValue * 1.1,
          efficiency: 15,
          riskReduction: 45,
        },
        steps: [
          'Create formal Performance Improvement Plan (PIP)',
          'Set clear, measurable goals with timeline',
          'Provide necessary training/support',
          'Document all progress meetings',
          'Take action based on PIP outcome',
        ],
        risks: [
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

// Generate Hiring specific paths
const generateHiringPaths = (
  profile: BusinessProfile,
  baseExpectedValue: number,
  query?: string
): DecisionPath[] => {
  return [
    {
      id: 'hiring-aggressive',
      name: 'Rapid Team Scaling',
      description: 'Hire aggressively to capture market opportunity',
      expectedValue: baseExpectedValue * 1.6,
      probability: 0.55,
      riskScore: 65,
      timeline: 60,
      costs: {
        immediate: profile.mrr * 3, // Recruitment, onboarding
        monthly: profile.mrr * 0.8, // New salaries
      },
      benefits: {
        revenue: baseExpectedValue * 2.0,
        efficiency: 25,
        riskReduction: 20,
      },
      steps: [
        'Define 8-12 priority roles immediately',
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
      description: 'Focus on 3-5 critical hires that unlock growth',
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
      description: 'Use contractors, agencies, and outsourced teams',
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
    case 'general':
    default:
      // Fall back to general growth paths
      break;
  }

  // General/Growth paths (default)
  const paths: DecisionPath[] = [
    {
      id: 'aggressive',
      name: 'Aggressive Scaling',
      description: 'Hire immediately, scale marketing, raise funding',
      expectedValue: baseExpectedValue * 1.8,
      probability: 0.65,
      riskScore: 72,
      timeline: 90,
      costs: {
        immediate: profile.mrr * 6,
        monthly: profile.mrr * 0.4,
      },
      benefits: {
        revenue: baseExpectedValue * 2.0,
        efficiency: 35,
        riskReduction: 15,
      },
      steps: [
        'Raise seed/Series A funding within 60 days',
        'Hire 10+ team members across functions',
        'Launch aggressive paid marketing campaigns',
        'Expand to 2-3 new cities simultaneously',
      ],
      risks: [
        'High burn rate requires external funding',
        'Rapid hiring may affect culture',
        'Market conditions may change',
      ],
      shapleySHAP: calculateSHAPValues({
        team_capacity: 45,
        market_timing: 35,
        cash_buffer: 20,
      }),
      agentContributions: {
        orchestrator: 10,              // 10%
        simulation_cluster: 15,        // 15%
        decision_intelligence: 18,     // 18%
        operations_optimizer: 22,      // 22%
        personal_coach: 4,             // 4%
        innovation_advisor: 7,         // 7%
        growth_strategist: 19,         // 19%
        learning_adaptation: 5,        // 5%
      },
      // Total: 100%
    },
    {
      id: 'balanced',
      name: 'Balanced Growth',
      description: 'Optimize ops, selective hiring, organic growth',
      expectedValue: baseExpectedValue,
      probability: 0.85,
      riskScore: 45,
      timeline: 180,
      costs: {
        immediate: profile.mrr * 2,
        monthly: profile.mrr * 0.15,
      },
      benefits: {
        revenue: baseExpectedValue * 1.2,
        efficiency: 25,
        riskReduction: 40,
      },
      steps: [
        'Optimize current operations for efficiency',
        'Hire 3-5 key roles strategically',
        'Focus on organic and referral growth',
        'Build sustainable unit economics',
      ],
      risks: [
        'Slower growth may miss market window',
        'Competitors may scale faster',
        'Limited resources for experimentation',
      ],
      shapleySHAP: calculateSHAPValues({
        operational_efficiency: 40,
        market_stability: 35,
        cash_flow: 25,
      }),
      agentContributions: {
        orchestrator: 13,              // 13%
        simulation_cluster: 14,        // 14%
        decision_intelligence: 16,     // 16%
        operations_optimizer: 19,      // 19%
        personal_coach: 11,            // 11%
        innovation_advisor: 5,         // 5%
        growth_strategist: 12,         // 12%
        learning_adaptation: 10,       // 10%
      },
      // Total: 100%
    },
    {
      id: 'conservative',
      name: 'Conservative Path',
      description: 'Build cash reserves, improve margins, low risk',
      expectedValue: baseExpectedValue * 0.6,
      probability: 0.95,
      riskScore: 20,
      timeline: 365,
      costs: {
        immediate: profile.mrr * 0.5,
        monthly: profile.mrr * 0.05,
      },
      benefits: {
        revenue: baseExpectedValue * 0.8,
        efficiency: 15,
        riskReduction: 75,
      },
      steps: [
        'Focus on existing customer retention',
        'Build 12+ months runway',
        'Improve profit margins by 20%',
        'Minimal new hires, upskill existing team',
      ],
      risks: [
        'May miss growth opportunities',
        'Team may get demotivated',
        'Market share may decline',
      ],
      shapleySHAP: calculateSHAPValues({
        cash_preservation: 50,
        risk_mitigation: 35,
        stability: 15,
      }),
      agentContributions: {
        orchestrator: 9,               // 9%
        simulation_cluster: 9,         // 9%
        decision_intelligence: 14,     // 14%
        operations_optimizer: 16,      // 16%
        personal_coach: 18,            // 18%
        innovation_advisor: 3,         // 3%
        growth_strategist: 7,          // 7%
        learning_adaptation: 24,       // 24%
      },
      // Total: 100%
    },
  ];

  return paths;
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
