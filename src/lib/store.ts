import { create } from 'zustand';
import { Agent, BusinessProfile, SimulationResult, AgentId, DecisionPath, IndiaContext, GraphData, AssessmentMetrics, JugaadIdea, AuditLogEntry, CascadingPath, FestivalMultiplier, RegionalAdjustment } from '@/types';

interface NeoBIStore {
  // Profile
  profile: BusinessProfile | null;
  setProfile: (profile: BusinessProfile | null) => void;

  // Agents
  agents: Record<AgentId, Agent>;
  updateAgent: (id: AgentId, updates: Partial<Agent>) => void;
  
  // Simulation Results
  currentResult: SimulationResult | null;
  results: SimulationResult[];
  setCurrentResult: (result: SimulationResult) => void;
  addResult: (result: SimulationResult) => void;

  // Selected Decision Path & Cascading
  selectedPath: DecisionPath | null;
  setSelectedPath: (path: DecisionPath | null) => void;
  cascadingLevel: number; // Current level in cascading path tree (0 = root, 1, 2, 3...)
  setCascadingLevel: (level: number) => void;
  cascadingPaths: CascadingPath[]; // Sub-paths for current parent
  setCascadingPaths: (paths: CascadingPath[]) => void;
  breadcrumbPath: string[]; // Navigation breadcrumb
  setBreadcrumbPath: (path: string[]) => void;

  // India Context
  indiaContext: IndiaContext;
  updateIndiaContext: (context: Partial<IndiaContext>) => void;

  // Graph Data
  graphData: GraphData;
  updateGraphData: (data: Partial<GraphData>) => void;

  // Metrics
  metrics: AssessmentMetrics;
  updateMetrics: (metrics: Partial<AssessmentMetrics>) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  rightPanelOpen: boolean;
  toggleRightPanel: () => void;
  rightPanelTab: 'deep-dive' | 'operations' | 'tier2' | 'tier3' | 'compliance';
  setRightPanelTab: (tab: 'deep-dive' | 'operations' | 'tier2' | 'tier3' | 'compliance') => void;
  showRoadmap: boolean;
  setShowRoadmap: (show: boolean) => void;

  // Risk & Vibe
  riskSlider: number;
  setRiskSlider: (value: number) => void;
  vibeMode: 'aggressive' | 'balanced' | 'conservative';
  setVibeMode: (mode: 'aggressive' | 'balanced' | 'conservative') => void;

  // Festival & Regional
  festivalMultiplier: FestivalMultiplier | null;
  setFestivalMultiplier: (multiplier: FestivalMultiplier | null) => void;
  regionalAdjustment: RegionalAdjustment | null;
  setRegionalAdjustment: (adjustment: RegionalAdjustment | null) => void;

  // Jugaad & Innovation
  jugaadHistory: JugaadIdea[];
  addJugaadIdea: (idea: JugaadIdea) => void;
  updateJugaadIdea: (id: string, updates: Partial<JugaadIdea>) => void;

  // Decision history for roadmap traversal
  decisionHistory: string[];
  pushDecision: (path: string) => void;
  popDecision: () => void;
  resetDecisionHistory: () => void;

  // Audit Trail
  auditTrail: AuditLogEntry[];
  addAuditEntry: (entry: AuditLogEntry) => void;

  // Compliance & Tax
  complianceChecks: any[];
  computeITC: (invoices: any[]) => { suggestedClaim: number; issues: string[] };
  computeTDS: (amount: number, rate?: number) => number;
  tdsReminders: Array<{ id: string; vendor: string; amount: number; dueDate: string }>;
  scheduleTDSReminder: (payload: { vendor: string; amount: number; dueDate: string }) => void;

  // Funding & Cashflow
  invoices: { id: string; amount: number; dueDate: string; buyer?: string }[];
  addInvoice: (inv: { id: string; amount: number; dueDate: string; buyer?: string }) => void;
  removeInvoice: (id: string) => void;
  calculateRunway: (cashOnHand: number, monthlyBurn: number, delayedReceivables?: number) => { months: number; bridgeNeeded: number };

  // Hiring Benchmarks
  hiringBenchmarks: Record<string, { min: number; max: number }>;
  getHiringBenchmark: (industry: string) => { min: number; max: number } | null;

  // Cybersecurity
  cyberRiskScore: number;
  computeCyberRisk: (profile: any) => number;

  // Burnout / Wellness
  burnoutTrajectory: any[];
  recordCheckin: (score: number) => void;

  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingStates: {
    simulation: boolean;
    nifty: boolean;
    festivals: boolean;
    profile: boolean;
    tier2: boolean;
    tier3: boolean;
  };
  setLoadingState: (key: string, loading: boolean) => void;
}

const INITIAL_AGENTS: Record<AgentId, Agent> = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Central Orchestrator',
    icon: '👑🧠',
    color: '#9333EA',
    level: 'L1',
    description: 'Query parsing, workflow planning, India context detection',
    status: 'idle',
    contribution: 0,
    lastActive: new Date(),
  },
  simulation_cluster: {
    id: 'simulation_cluster',
    name: 'Simulation Cluster',
    icon: '🔮📊',
    color: '#06B6D4',
    level: 'L2',
    description: 'Market/demand/competitor forecasting with NSE trends',
    status: 'idle',
    contribution: 0,
    lastActive: new Date(),
  },
  decision_intelligence: {
    id: 'decision_intelligence',
    name: 'Decision Intelligence',
    icon: '🌳🎯',
    color: '#10B981',
    level: 'L2',
    description: 'Multi-level decision trees, EV/prob calculation, SHAP',
    status: 'idle',
    contribution: 0,
    lastActive: new Date(),
  },
  operations_optimizer: {
    id: 'operations_optimizer',
    name: 'Operations Optimizer',
    icon: '⚙️🏭',
    color: '#F97316',
    level: 'L2',
    description: 'Hiring/inventory/supplier optimization, compliance',
    status: 'idle',
    contribution: 0,
    lastActive: new Date(),
  },
  personal_coach: {
    id: 'personal_coach',
    name: 'Personal Coach',
    icon: '💡❤️',
    color: '#14B8A6',
    level: 'L3',
    description: 'Stress detection, burnout reduction, wellness advice',
    status: 'idle',
    contribution: 0,
    lastActive: new Date(),
  },
  innovation_advisor: {
    id: 'innovation_advisor',
    name: 'Innovation Advisor',
    icon: '⚡🧬',
    color: '#FACC15',
    level: 'L3',
    description: 'Jugaad solutions, pivots, partnerships',
    status: 'idle',
    contribution: 0,
    lastActive: new Date(),
  },
  growth_strategist: {
    id: 'growth_strategist',
    name: 'Growth Strategist',
    icon: '📣📈',
    color: '#EC4899',
    level: 'L3',
    description: 'Marketing/acquisition strategies, growth hacks',
    status: 'idle',
    contribution: 0,
    lastActive: new Date(),
  },
  learning_adaptation: {
    id: 'learning_adaptation',
    name: 'Learning & Adaptation',
    icon: '🔄🧠',
    color: '#84CC16',
    level: 'L4',
    description: 'MARL training, policy updates, versioning',
    status: 'idle',
    contribution: 0,
    lastActive: new Date(),
  },
};

const DEFAULT_INDIA_CONTEXT: IndiaContext = {
  niftyLive: {
    value: 23450,
    change: 125,
    changePercent: 0.54,
    timestamp: new Date(),
  },
  festivalCountdown: {
    next: 'Holi',
    daysUntil: 45,
    expectedDemandLift: 35,
  },
  marketHours: {
    isOpen: true,
    nextOpen: new Date(),
  },
  gstRate: 18,
  dpdpStatus: 'compliant',
  upiAdoption: 78,
};

const DEFAULT_GRAPH_DATA: GraphData = {
  marlConvergence: {
    episodes: Array.from({ length: 100 }, (_, i) => i),
    rewards: Array.from({ length: 100 }, (_, i) => Math.sin(i / 10) * 100 + 500),
    mean: Array.from({ length: 100 }, (_, i) => 500 + (i * 3)),
    stdDev: Array.from({ length: 100 }, (_, i) => 100 - (i * 0.5)),
  },
  worldModelAccuracy: {
    horizons: [1, 5, 10, 20, 30],
    mae: [50, 120, 250, 450, 650],
    rmse: [70, 180, 350, 600, 850],
  },
  shapBeeswarm: {
    features: ['MRR', 'Team Size', 'Market Growth', 'Seasonality', 'Competitor', 'Cash Flow'],
    shapValues: [45, 30, 25, 20, 15, 10],
    baseValue: 500,
  },
  cashFlowProjection: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    path1: [100000, 110000, 121000, 133100, 146410, 161051],
    path2: [100000, 105000, 110250, 115762, 121550, 127627],
    path3: [100000, 100000, 100000, 100000, 100000, 100000],
    ci_lower: [80000, 85000, 90000, 95000, 100000, 105000],
    ci_upper: [120000, 130000, 140000, 150000, 160000, 170000],
  },
  hiringGantt: [],
  supplierScorecard: [],
  inventoryTurnover: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    turnover: [4, 4.2, 4.5, 4.3, 4.8, 5.1],
    reorderPoint: 500,
  },
  competitorHeatmap: [],
  burnoutRisk: [],
  agentContribution: [],
  confidenceDistribution: {
    bins: ['60-70%', '70-80%', '80-90%', '90-95%', '95-100%'],
    count: [10, 25, 35, 20, 10],
  },
};

const DEFAULT_METRICS: AssessmentMetrics = {
  taskCompletionRate: 96,
  decisionQuality: 92,
  adaptationRate: 87,
  latencyFirst: 2100,
  latencyCached: 85,
  burnoutRiskReduction: 34,
  revenueProjAccuracy: 3.2,
  cacheHitRate: 82,
  costPerQuery: 0,
};

export const useNeoBIStore = create<NeoBIStore>((set) => ({
  // Profile
  profile: null,
  setProfile: (profile) => set({ profile }),

  // Agents
  agents: INITIAL_AGENTS,
  updateAgent: (id, updates) =>
    set((state) => ({
      agents: {
        ...state.agents,
        [id]: { ...state.agents[id], ...updates },
      },
    })),

  // Results
  currentResult: null,
  results: [],
  setCurrentResult: (result) => set({ currentResult: result }),
  addResult: (result) => set((state) => ({ results: [...state.results, result] })),

  // Decision Path & Cascading
  selectedPath: null,
  setSelectedPath: (path) => set({ selectedPath: path }),
  cascadingLevel: 0,
  setCascadingLevel: (level) => set({ cascadingLevel: level }),
  cascadingPaths: [],
  setCascadingPaths: (paths) => set({ cascadingPaths: paths }),
  breadcrumbPath: [],
  setBreadcrumbPath: (path) => set({ breadcrumbPath: path }),

  // India Context
  indiaContext: DEFAULT_INDIA_CONTEXT,
  updateIndiaContext: (context) =>
    set((state) => ({
      indiaContext: { ...state.indiaContext, ...context },
    })),

  // Graph Data
  graphData: DEFAULT_GRAPH_DATA,
  updateGraphData: (data) =>
    set((state) => ({
      graphData: { ...state.graphData, ...data },
    })),

  // Metrics
  metrics: DEFAULT_METRICS,
  updateMetrics: (metrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    })),

  // UI State
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  rightPanelOpen: true,
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  rightPanelTab: 'deep-dive',
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  showRoadmap: false,
  setShowRoadmap: (show) => set({ showRoadmap: show }),

  // Risk & Vibe
  riskSlider: 50,
  setRiskSlider: (value) => set({ riskSlider: value }),
  vibeMode: 'balanced',
  setVibeMode: (mode) => set({ vibeMode: mode }),

  // Festival & Regional
  festivalMultiplier: null,
  setFestivalMultiplier: (multiplier) => set({ festivalMultiplier: multiplier }),
  regionalAdjustment: null,
  setRegionalAdjustment: (adjustment) => set({ regionalAdjustment: adjustment }),

  // Jugaad & Innovation
  jugaadHistory: [],
  addJugaadIdea: (idea) =>
    set((state) => {
      const normalized = {
        ...idea,
        feasibility: (idea as any).feasibility ?? (idea as any).feasibilityScore ?? 50,
        impact: (idea as any).impact ?? (idea as any).potentialImpact ?? 10,
        mutations: (idea as any).mutations ?? 0,
        successRate: (idea as any).successRate ?? 30,
      } as JugaadIdea & { feasibility: number; impact: number; mutations: number; successRate: number };
      return { jugaadHistory: [...state.jugaadHistory, normalized] };
    }),
  updateJugaadIdea: (id, updates) =>
    set((state) => ({
      jugaadHistory: state.jugaadHistory.map((idea) => (idea.id === id ? { ...idea, ...updates } : idea)),
    })),

  // Decision history for roadmap traversal
  decisionHistory: [],
  pushDecision: (path: string) =>
    set((state) => ({ decisionHistory: [...state.decisionHistory, path] })),
  popDecision: () =>
    set((state) => ({ decisionHistory: state.decisionHistory.slice(0, Math.max(0, state.decisionHistory.length - 1)) })),
  resetDecisionHistory: () => set({ decisionHistory: [] }),

  // Audit Trail
  auditTrail: [],
  addAuditEntry: (entry) => set((state) => ({ auditTrail: [...state.auditTrail, entry] })),

  // Compliance & Tax
  complianceChecks: [],
  computeITC: (invoices: any[]) => {
    // Better ITC heuristic: only consider invoices within last 1 year and with valid gstIn and invoiceDate
    const now = Date.now();
    const oneYear = 1000 * 60 * 60 * 24 * 365;
    const eligible = invoices.filter((i) => {
      const date = i.invoiceDate ? new Date(i.invoiceDate).getTime() : now;
      return (now - date) <= oneYear && !!i.itcEligibleAmount && !!i.vendorGst;
    });
    const suggested = eligible.reduce((s, i) => s + ((i.itcEligibleAmount as number) || 0), 0);
    const issues = invoices
      .filter((i) => !i.vendorGst || !i.invoiceDate)
      .map((i) => `Missing fields on invoice ${i.id}`);
    return { suggestedClaim: suggested, issues };
  },
  computeTDS: (amount: number, rate = 0.02) => Math.round(amount * rate),

  // TDS reminders
  tdsReminders: [],
  scheduleTDSReminder: (payload: { vendor: string; amount: number; dueDate: string }) =>
    set((state) => ({ tdsReminders: [...state.tdsReminders, { ...payload, id: `tds-${Date.now()}` }] })),

  // Funding & Cashflow
  invoices: [],
  addInvoice: (inv) => set((state) => ({ invoices: [...state.invoices, inv] })),
  removeInvoice: (id) => set((state) => ({ invoices: state.invoices.filter((i) => i.id !== id) })),
  calculateRunway: (cashOnHand, monthlyBurn, delayedReceivables = 0) => {
    const effectiveCash = cashOnHand + delayedReceivables;
    const months = Math.max(0, +(effectiveCash / Math.max(1, monthlyBurn)).toFixed(2));
    const bridge = Math.max(0, Math.round((monthlyBurn * 3) - effectiveCash));
    return { months, bridgeNeeded: bridge };
  },

  // Hiring Benchmarks
  hiringBenchmarks: { saas: { min: 8, max: 18 }, ecommerce: { min: 6, max: 15 } },
  getHiringBenchmark: (industry) => ( ({} as any)[industry] ? ({} as any)[industry] : null ),

  // Cybersecurity
  cyberRiskScore: 30,
  computeCyberRisk: (profile) => {
    // naive: higher team size and budget reduces risk
    const size = (profile?.teamSize) || 5;
    const score = Math.max(10, 80 - size * 2);
    return score;
  },

  // Burnout / Wellness
  burnoutTrajectory: [],
  recordCheckin: (score) => set((state) => ({ burnoutTrajectory: [...state.burnoutTrajectory, { timestamp: new Date(), score }] })),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  loadingStates: {
    simulation: false,
    nifty: false,
    festivals: false,
    profile: false,
    tier2: false,
    tier3: false,
  },
  setLoadingState: (key, loading) => set((state) => ({
    loadingStates: { ...state.loadingStates, [key]: loading }
  })),
}));

// Persist light-weight slices to localStorage on client
if (typeof window !== 'undefined') {
  try {
    const key = 'neobi_store_v1';
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Apply only known keys
      useNeoBIStore.setState({
        invoices: parsed.invoices || useNeoBIStore.getState().invoices,
        tdsReminders: parsed.tdsReminders || useNeoBIStore.getState().tdsReminders,
        jugaadHistory: parsed.jugaadHistory || useNeoBIStore.getState().jugaadHistory,
        auditTrail: parsed.auditTrail || useNeoBIStore.getState().auditTrail,
        profile: parsed.profile || useNeoBIStore.getState().profile,
      });
    }

    useNeoBIStore.subscribe((state) => {
      const snapshot = {
        invoices: state.invoices,
        tdsReminders: (state as any).tdsReminders || [],
        jugaadHistory: state.jugaadHistory || [],
        auditTrail: state.auditTrail || [],
        profile: state.profile || null,
      };

      try {
        localStorage.setItem(key, JSON.stringify(snapshot));
      } catch (e) {
        // Handle localStorage errors (QuotaExceededError, etc.)
        if (e instanceof Error) {
          console.error('Failed to persist state to localStorage:', e.message);

          // Check if quota exceeded
          if (e.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded. Consider clearing old data.');

            // Attempt to save minimal profile only
            try {
              const minimalSnapshot = { profile: state.profile };
              localStorage.setItem(key, JSON.stringify(minimalSnapshot));
              console.info('Saved minimal profile data only');
            } catch (retryError) {
              console.error('Could not save even minimal data:', retryError);

              // Notify user (could integrate with toast notification system later)
              // Only show once per session
              const shown = sessionStorage.getItem('storage_warning_shown');
              if (!shown) {
                sessionStorage.setItem('storage_warning_shown', 'true');
                console.warn('⚠️ Storage full. Some data may not persist. Clear browser cache if needed.');
              }
            }
          }
        }
      }
    });
  } catch (e) {
    console.error('Failed to initialize localStorage persistence:', e);
    // Continue without persistence - app will still work in-memory
  }
}
