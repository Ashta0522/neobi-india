# INTEGRATION STEPS - QUICK START GUIDE

## 🎯 How to Integrate Phase 3 Features into Main Page

### **Total Time: ~75 minutes**

---

## ✅ STEP 1: Import Components (5 minutes)

Add to `src/app/page.tsx` at the top:

```typescript
import {
  // New Tier 2 Visualizations
  GlobalSHAPBeeswarm,
  RewardDecompositionChart,
  CurriculumBreakdown,
  AblationStudyChart,
  BurnoutTrajectoryChart,
  ConfidenceDistributionHistogram,
  // New Tier 1 Interactions
  FestivalMultiplierSlider,
  CascadingPathSelector,
  JugaadGenerator,
  RegionalAdjustmentGauge,
  CompetitorHeatmapChart,
  UFraudRiskSimulator,
} from '@/components';
```

---

## ✅ STEP 2: Add State Variables (3 minutes)

Inside the Home component function, add:

```typescript
const {
  // ... existing state
  cascadingLevel,
  setCascadingLevel,
  cascadingPaths,
  setCascadingPaths,
  breadcrumbPath,
  setBreadcrumbPath,
  festivalMultiplier,
  setFestivalMultiplier,
  regionalAdjustment,
  setRegionalAdjustment,
  jugaadHistory,
  addJugaadIdea,
  updateJugaadIdea,
  auditTrail,
  addAuditEntry,
} = useNeoBIStore();
```

---

## ✅ STEP 3: Add Profile Form Fields (5 minutes)

In the onboarding modal, add city tier and festival selectors:

```typescript
<div>
  <label className="block text-sm font-bold mb-2">City Tier</label>
  <select
    value={formData.cityTier || 1}
    onChange={(e) => setFormData({ ...formData, cityTier: parseInt(e.target.value) as 1 | 2 | 3 })}
    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20"
  >
    <option value="1">Tier 1 - Metro (Bangalore, Mumbai, Delhi, etc.)</option>
    <option value="2">Tier 2 - City (Pune, Chandigarh, etc.)</option>
    <option value="3">Tier 3 - Town (Smaller cities)</option>
  </select>
</div>

<div>
  <label className="block text-sm font-bold mb-2">Festival Preference</label>
  <select
    value={formData.festival || 'Holi'}
    onChange={(e) => setFormData({ ...formData, festival: e.target.value })}
    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20"
  >
    <option value="Holi">Holi</option>
    <option value="Diwali">Diwali</option>
    <option value="Ganesh Chaturthi">Ganesh Chaturthi</option>
    <option value="Navratri">Navratri</option>
    <option value="Eid">Eid</option>
    <option value="Christmas">Christmas</option>
    <option value="New Year">New Year</option>
  </select>
</div>
```

---

## ✅ STEP 4: Enhance Simulation Handler (15 minutes)

Replace/enhance `handleRunSimulation()`:

```typescript
const handleRunSimulation = async () => {
  setIsLoading(true);
  
  try {
    // 1. Reset agent statuses
    const agentIds: AgentId[] = [
      'orchestrator',
      'simulation_cluster',
      'decision_intelligence',
      'operations_optimizer',
      'personal_coach',
      'innovation_advisor',
      'growth_strategist',
      'learning_adaptation',
    ];

    agentIds.forEach((id) => {
      updateAgent(id, { status: 'running', lastActive: new Date() });
    });

    // 2. Generate base paths (existing code)
    const agentContributions = agentIds.reduce(
      (acc, id) => ({ ...acc, [id]: Math.round(100 / agentIds.length) }),
      {} as Record<string, number>
    );
    const paths = generateDecisionPaths(profile, agentContributions);

    // 3. Get festival & regional settings
    const festivalData = await fetch('/api/enhanced', {
      method: 'POST',
      body: JSON.stringify({
        action: 'festival-multiplier',
        payload: { festivalName: formData.festival, daysUntil: 45 }
      })
    }).then(r => r.json()).then(res => res.data);

    const regionalData = await fetch('/api/enhanced', {
      method: 'POST',
      body: JSON.stringify({
        action: 'regional-adjustment',
        payload: { cityTier: formData.cityTier, location: formData.location }
      })
    }).then(r => r.json()).then(res => res.data);

    setFestivalMultiplier(festivalData);
    setRegionalAdjustment(regionalData);

    // 4. Select balanced path and generate cascading
    const selectedPath = paths[1];
    setSelectedPath(selectedPath);

    const cascadingData = await fetch('/api/enhanced', {
      method: 'POST',
      body: JSON.stringify({
        action: 'cascading-paths',
        payload: { parentPath: selectedPath, profile, level: 1 }
      })
    }).then(r => r.json()).then(res => res.data);

    setCascadingPaths(cascadingData);
    setCascadingLevel(1);
    setBreadcrumbPath(['Level 1', selectedPath.name]);

    // 5. Simulate MARL
    let marlState: MARLState = {
      episode: 0,
      totalReward: 500,
      agentRewards: {
        orchestrator: 0,
        simulation_cluster: 0,
        decision_intelligence: 0,
        operations_optimizer: 0,
        personal_coach: 0,
        innovation_advisor: 0,
        growth_strategist: 0,
        learning_adaptation: 0,
      },
      convergenceMetric: 0,
      replayBufferSize: 0,
      policyVersion: 0,
    };

    for (let i = 0; i < 10; i++) {
      marlState = simulateMARLEpisode(i, marlState, agentContributions);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // 6. Get all enhanced metrics in parallel
    const [
      rewardDecompRes,
      curriculumRes,
      burnoutRes,
      confidenceRes,
      ablationRes,
      competitorRes,
      fraudRes,
    ] = await Promise.all([
      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'reward-decomposition',
          payload: { path: selectedPath, profile, cityTier: formData.cityTier, festivalMultiplier: festivalData.demandMultiplier }
        })
      }).then(r => r.json()),

      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'curriculum-learning',
          payload: { episodes: 100 }
        })
      }).then(r => r.json()),

      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'burnout-trajectory',
          payload: { vibeMode: 'balanced', timeline: 30 }
        })
      }).then(r => r.json()),

      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'confidence-distribution',
          payload: { ensembleSize: 10 }
        })
      }).then(r => r.json()),

      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'ablation-study',
          payload: {}
        })
      }).then(r => r.json()),

      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'competitor-heatmap',
          payload: { path: selectedPath }
        })
      }).then(r => r.json()),

      fetch('/api/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          action: 'upi-fraud',
          payload: { profile, revenueIncrease: 25 }
        })
      }).then(r => r.json()),
    ]);

    // 7. Create extended result object
    const result: SimulationResult & any = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      profile,
      query: 'What is the optimal growth strategy for my business?',
      paths,
      recommendation: selectedPath,
      marlState,
      confidence: 92,
      executionTime: 2100,
      costUsed: 0,
      // NEW: Enhanced metrics
      cascadingPaths: cascadingData,
      rewardDecomposition: rewardDecompRes.data,
      curriculumLevels: curriculumRes.data,
      burnoutTrajectory: burnoutRes.data,
      confidenceDistribution: confidenceRes.data,
      ablationStudy: ablationRes.data,
      competitorHeatmap: competitorRes.data,
      fraudRisk: fraudRes.data,
    };

    setCurrentResult(result);
    addResult(result);

    // 8. Log initial action
    addAuditEntry({
      timestamp: new Date(),
      action: 'simulation-run',
      details: { profile: profile.name, paths: paths.length, selectedPath: selectedPath.name }
    });

    // 9. Reset agent statuses
    agentIds.forEach((id) => {
      updateAgent(id, { status: 'idle' });
    });

    setIsLoading(false);
  } catch (error) {
    console.error('Simulation error:', error);
    setIsLoading(false);
  }
};
```

---

## ✅ STEP 5: Add Event Handlers (10 minutes)

Add these functions to the component:

```typescript
// Handle cascading path selection
const handleCascadingSelect = async (subPath: CascadingPath) => {
  setSelectedPath(subPath);
  
  const newLevel = cascadingLevel + 1;
  setCascadingLevel(newLevel);
  setBreadcrumbPath([...breadcrumbPath, subPath.name]);
  
  // Could generate next level cascading here if implementing 3 levels
  
  addAuditEntry({
    timestamp: new Date(),
    action: 'cascading-select',
    details: { level: newLevel, pathName: subPath.name, riskScore: subPath.riskScore }
  });
};

// Handle festival override
const handleFestivalOverride = (newMultiplier: number) => {
  const updated = { ...festivalMultiplier, userOverride: newMultiplier };
  setFestivalMultiplier(updated);
  
  addAuditEntry({
    timestamp: new Date(),
    action: 'festival-override',
    details: { newMultiplier, original: festivalMultiplier.demandMultiplier }
  });
};

// Handle jugaad feedback
const handleJugaadFeedback = async (ideaId: string, feedback: 'thumbs_up' | 'thumbs_down') => {
  const idea = jugaadHistory.find(j => j.id === ideaId);
  if (!idea) return;
  
  const evolvedRes = await fetch('/api/enhanced', {
    method: 'POST',
    body: JSON.stringify({
      action: 'jugaad-evolve',
      payload: { idea, feedback }
    })
  }).then(r => r.json());
  
  const evolved = evolvedRes.data;
  addJugaadIdea(evolved);
  updateJugaadIdea(ideaId, { userFeedback: feedback });
  
  addAuditEntry({
    timestamp: new Date(),
    action: 'jugaad-feedback',
    details: { ideaId, feedback, generation: evolved.generation }
  });
};

// Generate new jugaad
const generateNewJugaad = async () => {
  const categories = ['partnership', 'frugal', 'pivot', 'growth-hack'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  const descriptions = {
    partnership: 'Partner with local kirana chains for last-mile delivery',
    frugal: 'Use student interns for 50% cost reduction',
    pivot: 'Pivot to B2B SaaS instead of direct B2C',
    'growth-hack': 'Launch referral program with ₹500 incentive'
  };
  
  const idea: JugaadIdea = {
    id: `jugaad-${Date.now()}`,
    createdAt: new Date(),
    description: descriptions[category as keyof typeof descriptions],
    feasibilityScore: 65,
    potentialImpact: 35,
    category: category as any,
    userFeedback: null,
    generation: 1,
    parentId: null,
  };
  
  addJugaadIdea(idea);
  
  addAuditEntry({
    timestamp: new Date(),
    action: 'jugaad-generate',
    details: { category, ideaId: idea.id }
  });
};

// Export audit trail
const handleExportAuditTrail = () => {
  const csv = ['timestamp,action,details']
    .concat(
      auditTrail.map(entry =>
        `"${entry.timestamp.toISOString()}","${entry.action}","${JSON.stringify(entry.details).replace(/"/g, '\\"')}"`
      )
    )
    .join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neobi-audit-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## ✅ STEP 6: Render New Components (30 minutes)

After the existing graph sections, add:

```typescript
{/* TIER 1: Game-Changing Novelties Section */}
{currentResult && (
  <>
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-bold text-amber-300">🎯 Tier 1: Game-Changing Novelties</h2>
      <p className="text-sm text-amber-200/60">Strategic insights to transform your business</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {cascadingPaths.length > 0 && (
        <CascadingPathSelector
          parentName={selectedPath?.name || 'Selected Path'}
          cascadingPaths={cascadingPaths}
          onSelectPath={handleCascadingSelect}
          breadcrumb={breadcrumbPath}
        />
      )}

      {festivalMultiplier && (
        <FestivalMultiplierSlider
          festivalMultiplier={festivalMultiplier}
          onOverrideChange={handleFestivalOverride}
        />
      )}

      {regionalAdjustment && (
        <RegionalAdjustmentGauge adjustment={regionalAdjustment} />
      )}

      <JugaadGenerator
        ideas={jugaadHistory}
        onGenerateNew={generateNewJugaad}
        onEvolve={handleJugaadFeedback}
      />
    </div>
  </>
)}

{/* TIER 2: Critical Visualizations Section */}
{currentResult && (
  <>
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-bold text-amber-300">📊 Tier 2: Advanced Analytics</h2>
      <p className="text-sm text-amber-200/60">Deep insights across 8 dimensions</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div style={{ height: '400px' }}>
        <GlobalSHAPBeeswarm
          features={['MRR', 'Team Size', 'Market Growth', 'Seasonality', 'Competitor', 'Cash Flow']}
          baseValue={currentResult.marlState.totalReward}
        />
      </div>

      {currentResult.rewardDecomposition && (
        <div style={{ height: '400px' }}>
          <RewardDecompositionChart decomposition={currentResult.rewardDecomposition} />
        </div>
      )}

      {currentResult.curriculumLevels && (
        <div style={{ height: '400px' }}>
          <CurriculumBreakdown levels={currentResult.curriculumLevels} />
        </div>
      )}

      {currentResult.ablationStudy && (
        <div style={{ height: '400px' }}>
          <AblationStudyChart ablations={currentResult.ablationStudy} />
        </div>
      )}

      {currentResult.burnoutTrajectory && (
        <div style={{ height: '400px' }}>
          <BurnoutTrajectoryChart trajectory={currentResult.burnoutTrajectory} />
        </div>
      )}

      {currentResult.confidenceDistribution && (
        <div style={{ height: '400px' }}>
          <ConfidenceDistributionHistogram distribution={currentResult.confidenceDistribution} />
        </div>
      )}

      {currentResult.competitorHeatmap && (
        <div style={{ height: '400px' }}>
          <CompetitorHeatmapChart heatmapData={currentResult.competitorHeatmap} />
        </div>
      )}

      {currentResult.fraudRisk && (
        <div style={{ height: '400px' }}>
          <UFraudRiskSimulator fraudScore={currentResult.fraudRisk} />
        </div>
      )}
    </div>
  </>
)}

{/* Audit Trail Export Button */}
{auditTrail.length > 0 && (
  <div className="mt-8 flex justify-end">
    <button
      onClick={handleExportAuditTrail}
      className="px-4 py-2 bg-amber-600/40 hover:bg-amber-600/60 border border-amber-500/40 rounded-lg text-amber-200 transition-all"
    >
      📥 Export Audit Trail ({auditTrail.length} entries)
    </button>
  </div>
)}
```

---

## ✅ STEP 7: Update Types (2 minutes)

Ensure `SimulationResult` type includes new fields in `src/types/index.ts`:

```typescript
export interface SimulationResult {
  // ... existing fields
  id: string;
  timestamp: Date;
  profile: BusinessProfile;
  query: string;
  paths: DecisionPath[];
  recommendation: DecisionPath;
  marlState: MARLState;
  confidence: number;
  executionTime: number;
  costUsed: number;
  
  // NEW: Phase 3 fields
  cascadingPaths?: CascadingPath[];
  rewardDecomposition?: RewardDecomposition;
  curriculumLevels?: CurriculumLevel[];
  burnoutTrajectory?: BurnoutTrajectory;
  confidenceDistribution?: ConfidenceDistribution;
  ablationStudy?: AblationStudy[];
  competitorHeatmap?: CompetitorHeatmap[];
  fraudRisk?: UFraudRiskScore;
}
```

---

## ✅ STEP 8: Test Integration (5 minutes)

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Fill in profile form with city tier and festival
4. Click "Run Intelligence"
5. Verify all new components render
6. Test cascading path selection
7. Test festival slider
8. Test jugaad generation
9. Export audit trail
10. Check browser console for errors

---

## ✅ STEP 9: Polish & Optimization (5 minutes)

- Add loading states for API calls
- Add error boundary
- Optimize image loading
- Add keyboard shortcuts
- Add tooltips for complex features

---

## 🎉 DONE!

Total integration time: ~75 minutes

All Phase 3 features now integrated and functional!

