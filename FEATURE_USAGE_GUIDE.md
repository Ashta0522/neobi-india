# NeoBI India v2.0 - Feature Usage Guide

## 🎯 Complete Feature Overview & Integration Guide

### Part 1: NEW SIMULATION ENGINE FUNCTIONS

All functions are in `src/utils/enhancedSimulationEngine.ts` and can be called directly or via the API.

#### **1. Cascading Paths Generation**

```typescript
// Direct usage
import { generateCascadingPaths } from '@/utils/enhancedSimulationEngine';

const paths = generateCascadingPaths(parentPath, profile, level);
// Returns: CascadingPath[] with 3 execution strategies

// API usage
const response = await fetch('/api/enhanced', {
  method: 'POST',
  body: JSON.stringify({
    action: 'cascading-paths',
    payload: { parentPath, profile, level }
  })
});
const { data: paths } = await response.json();
```

**Output Structure:**
- `path.name` - "Budget-Optimized Execution" | "Accelerated Channel Mix" | "Staged Rollout"
- `path.expectedValue` - Adjusted EV based on execution
- `path.riskScore` - Risk with execution strategy
- `path.timeline` - Days to execute
- `path.executionOptions` - Budget split, timeline options, channel mix, A/B variants
- `path.breadcrumbPath` - Navigation path

#### **2. Reward Decomposition**

```typescript
import { calculateRewardDecomposition } from '@/utils/enhancedSimulationEngine';

const decomposition = calculateRewardDecomposition(path, profile, regionalAdj, festivalMultiplier);
// Returns: { totalReward, components: { revenue%, riskReduction%, burnoutMitigation%, efficiency%, compliance% } }
```

**Use Case:** Show founder how total reward breaks down across 5 dimensions. Festival multiplier scales revenue component.

#### **3. Curriculum Learning**

```typescript
import { generateCurriculumLearning } from '@/utils/enhancedSimulationEngine';

const levels = generateCurriculumLearning(100); // episodes
// Returns: CurriculumLevel[] with 3 levels
// Each level has: episodes[], rewards[], convergenceMetric[], agentContributions{}
```

**Level Details:**
- **Level 1**: Single-decision learning (base path selection) - simple convergence
- **Level 2**: Sequential learning (cascading paths) - medium complexity
- **Level 3**: Multi-agent cooperative (full ensemble) - complex convergence

#### **4. Burnout Trajectory**

```typescript
import { generateBurnoutTrajectory } from '@/utils/enhancedSimulationEngine';

const trajectory = generateBurnoutTrajectory('balanced', 30); // 30 days
// Returns: { timestamp[], baselineRisk[], afterPathRisk[], vibeMode, trajectory }
```

**Vibe Mode Impact:**
- Conservative: 60% burnout reduction
- Balanced: 35% reduction
- Aggressive: 10% reduction (high stress)

#### **5. Confidence Distribution**

```typescript
import { generateConfidenceDistribution } from '@/utils/enhancedSimulationEngine';

const dist = generateConfidenceDistribution(10); // 10 ensemble members
// Returns: { bins[], counts[], mean, stdDev, minConfidence, maxConfidence }
```

**Interpretation:** Shows if ensemble is aligned (narrow distribution) or misaligned (wide).

#### **6. Ablation Study**

```typescript
import { generateAblationStudy } from '@/utils/enhancedSimulationEngine';

const ablations = generateAblationStudy();
// Returns: AblationStudy[] with { component, performanceWithout, performanceWith, dropPercentage }
```

**Components Tested:**
1. MARL (28% drop if removed)
2. SHAP (21% drop)
3. Personal Coach (13% drop)
4. Simulation Cluster (26% drop)
5. Operations Optimizer (17% drop)

#### **7. Competitor Heatmap**

```typescript
import { generateCompetitorHeatmapMatrix } from '@/utils/enhancedSimulationEngine';

const heatmap = generateCompetitorHeatmapMatrix(selectedPath);
// Returns: CompetitorHeatmap[] with likelihood of response
```

**Matrix:**
- Your Actions: Price Cut 20%, Feature Launch, Market Expansion
- Competitor Types: Aggressive, Conservative, Innovative
- Likelihood: 0-100%
- Response Time: Days
- Impact: Revenue change %

#### **8. Regional Adjustment**

```typescript
import { calculateRegionalAdjustment } from '@/utils/enhancedSimulationEngine';

const adjustment = calculateRegionalAdjustment(1, 'Bangalore'); // tier, location
// Returns: { demandMultiplier, hiringCostMultiplier, supplierCostMultiplier, complianceBurden, msmeEligibility }
```

**Tier Multipliers:**
- Tier 1 (Metro): 1.0x demand, 1.0x hiring, MSME eligible
- Tier 2 (Cities): 0.75x demand, 0.75x hiring, tax holidays available
- Tier 3 (Towns): 0.6x demand, 0.6x hiring, highest margins

#### **9. Festival Multiplier**

```typescript
import { calculateFestivalMultiplier } from '@/utils/enhancedSimulationEngine';

const festival = calculateFestivalMultiplier(45, 'Holi'); // days until, festival name
// Returns: { demandMultiplier, affectedCategories[], cascadeImpacts{} }
```

**Festival Multipliers:**
- Holi: 1.35x
- Diwali: 2.5x
- Ganesh Chaturthi: 1.8x
- Navratri: 1.95x
- Eid: 1.4x
- Christmas: 1.6x
- New Year: 1.5x

#### **10. UPI Fraud Simulator**

```typescript
import { simulateUPIFraudRisk } from '@/utils/enhancedSimulationEngine';

const fraudScore = simulateUPIFraudRisk(profile, revenueIncrease);
// Returns: { score 0-100, fraudAttempts, defenseLevel, mitigationStrategies[], estimatedLoss }
```

**Game Theory:**
- Fraudsters: 10% of new volume (scales with growth)
- You: Defense investment = 2FA, velocity checks, monitoring
- Win if: defense level > fraudster aggressiveness

#### **11. Jugaad Evolution**

```typescript
import { evolveSuggestion } from '@/utils/enhancedSimulationEngine';

const evolved = evolveSuggestion(originalIdea, 'thumbs_up'); // feedback
// Returns: new JugaadIdea with same category but evolved description & feasibility
```

**Jugaad Categories:**
- Partnership (kirana chains, artisans, NGOs, WhatsApp Business, micro-influencers)
- Frugal (interns, barter, free SaaS, DIY)
- Pivot (adjacent segment, B2B, subscription, marketplace, geographic)
- Growth-hack (referrals, flash sales, viral, community, Product Hunt)

**Evolution:**
- 👍 Approve: Feasibility +8%, Impact +15%
- 👎 Reject: Feasibility -5%, Impact -15% (will pivot category)

---

### Part 2: REACT COMPONENTS & INTEGRATION

#### **Component: CascadingPathSelector**

```typescript
import { CascadingPathSelector } from '@/components';

<CascadingPathSelector
  parentName="Balanced Growth"
  cascadingPaths={cascadingPaths}
  onSelectPath={(path) => {
    // Handle path selection
    // Update cascadingLevel, setCascadingPaths for next level
  }}
  breadcrumb={['Level 1', 'Balanced Growth']}
/>
```

**When to show:** After user selects Level 1 path, show 3 execution options at Level 2.

#### **Component: RewardDecompositionChart**

```typescript
import { RewardDecompositionChart } from '@/components';

<RewardDecompositionChart decomposition={decomposition} />
```

**Shows:** 5 stacked horizontal bars (Revenue, Risk Reduction, Burnout Mitigation, Efficiency, Compliance)

#### **Component: CurriculumBreakdown**

```typescript
import { CurriculumBreakdown } from '@/components';

<CurriculumBreakdown levels={curriculumLevels} />
```

**Shows:** 3 line charts (one per level) showing convergence over episodes

#### **Component: AblationStudyChart**

```typescript
import { AblationStudyChart } from '@/components';

<AblationStudyChart ablations={ablations} />
```

**Shows:** Top 5 components ranked by performance impact

#### **Component: BurnoutTrajectoryChart**

```typescript
import { BurnoutTrajectoryChart } from '@/components';

<BurnoutTrajectoryChart trajectory={trajectory} />
```

**Shows:** 2 area charts (baseline red, with-path green) over 30 days

#### **Component: ConfidenceDistributionHistogram**

```typescript
import { ConfidenceDistributionHistogram } from '@/components';

<ConfidenceDistributionHistogram distribution={distribution} />
```

**Shows:** 5-bin histogram of ensemble member confidence

#### **Component: CompetitorHeatmapChart**

```typescript
import { CompetitorHeatmapChart } from '@/components';

<CompetitorHeatmapChart heatmapData={heatmapData} />
```

**Shows:** 3 sections (one per action), 3 cards per section (competitor types), color-coded likelihood

#### **Component: UFraudRiskSimulator**

```typescript
import { UFraudRiskSimulator } from '@/components';

<UFraudRiskSimulator fraudScore={fraudScore} />
```

**Interactive:** Defense investment slider, mitigation strategy list

#### **Component: FestivalMultiplierSlider**

```typescript
import { FestivalMultiplierSlider } from '@/components';

<FestivalMultiplierSlider
  festivalMultiplier={festivalMultiplier}
  onOverrideChange={(value) => {
    // Update store, recalculate paths with new multiplier
  }}
/>
```

**Interactive:** Override slider (conservative to aggressive)

#### **Component: CascadingPathSelector**

```typescript
import { CascadingPathSelector } from '@/components';

<CascadingPathSelector
  parentName="Balanced Growth"
  cascadingPaths={paths}
  onSelectPath={(path) => {
    // Navigate to Level 2
  }}
  breadcrumb={breadcrumb}
/>
```

**Interactive:** Click cards to select execution strategy

#### **Component: JugaadGenerator**

```typescript
import { JugaadGenerator } from '@/components';

<JugaadGenerator
  ideas={jugaadHistory}
  onGenerateNew={() => {
    // Generate random jugaad from categories
  }}
  onEvolve={(ideaId, feedback) => {
    // Mutate idea based on feedback
  }}
/>
```

**Interactive:** Mutate button, expand for details, 👍/👎 feedback

#### **Component: RegionalAdjustmentGauge**

```typescript
import { RegionalAdjustmentGauge } from '@/components';

<RegionalAdjustmentGauge adjustment={regionalAdjustment} />
```

**Shows:** City tier badge, 4 multiplier metrics, MSME eligibility, revenue impact gauge

#### **Component: GlobalSHAPBeeswarm**

```typescript
import { GlobalSHAPBeeswarm } from '@/components';

<GlobalSHAPBeeswarm features={features} baseValue={baseValue} />
```

**Shows:** Scatter plot of feature importance (all 8 agents' perspective)

---

### Part 3: STATE MANAGEMENT (Zustand Store)

#### **New Store Methods**

```typescript
import { useNeoBIStore } from '@/lib/store';

const {
  // Cascading navigation
  cascadingLevel,
  setCascadingLevel,
  cascadingPaths,
  setCascadingPaths,
  breadcrumbPath,
  setBreadcrumbPath,
  
  // Festival & Regional
  festivalMultiplier,
  setFestivalMultiplier,
  regionalAdjustment,
  setRegionalAdjustment,
  
  // Jugaad & Audit
  jugaadHistory,
  addJugaadIdea,
  updateJugaadIdea,
  auditTrail,
  addAuditEntry,
  
  // UI
  rightPanelTab,
  setRightPanelTab,
} = useNeoBIStore();
```

#### **Example: Cascading Path Selection**

```typescript
// When user selects a Level 1 path
const handleSelectPath = async (path) => {
  setSelectedPath(path);
  
  // Generate cascading sub-paths
  const subPaths = generateCascadingPaths(path, profile, 1);
  setCascadingPaths(subPaths);
  
  // Update navigation
  setCascadingLevel(1);
  setBreadcrumbPath(['Level 1', path.name]);
  
  // Log to audit
  addAuditEntry({
    timestamp: new Date(),
    action: 'selected-path',
    pathId: path.id,
    level: 1,
    details: path.name
  });
};
```

#### **Example: Festival Override**

```typescript
// When user adjusts festival multiplier
const handleFestivalOverride = (newMultiplier) => {
  const updated = { ...festivalMultiplier, userOverride: newMultiplier };
  setFestivalMultiplier(updated);
  
  // Recalculate all paths with new multiplier
  // Would trigger simulation re-run
};
```

#### **Example: Jugaad Evolution**

```typescript
// When user clicks 👍 or 👎 on jugaad
const handleJugaadFeedback = async (ideaId, feedback) => {
  const idea = jugaadHistory.find(j => j.id === ideaId);
  const evolved = evolveSuggestion(idea, feedback);
  
  addJugaadIdea(evolved);
  updateJugaadIdea(ideaId, { userFeedback: feedback });
  
  addAuditEntry({
    timestamp: new Date(),
    action: 'jugaad-feedback',
    ideaId,
    feedback,
    evolution: evolved.generation
  });
};
```

---

### Part 4: API USAGE PATTERNS

#### **Example: Full Simulation with Enhanced Metrics**

```typescript
async function runEnhancedSimulation(profile) {
  const pathsResponse = await fetch('/api/simulate', {
    method: 'POST',
    body: JSON.stringify({ profile })
  });
  const { paths } = await pathsResponse.json();
  
  // Now enhance with all features
  const cascadingResponse = await fetch('/api/enhanced', {
    method: 'POST',
    body: JSON.stringify({
      action: 'cascading-paths',
      payload: { parentPath: paths[1], profile, level: 1 }
    })
  });
  const { data: cascadingPaths } = await cascadingResponse.json();
  
  // Get all metrics in parallel
  const [
    rewardDecomp,
    curriculum,
    burnoutTraj,
    confidence,
    ablation,
    competitor,
    fraud
  ] = await Promise.all([
    fetch('/api/enhanced', {
      method: 'POST',
      body: JSON.stringify({
        action: 'reward-decomposition',
        payload: { path: paths[1], profile, cityTier: 1, festivalMultiplier: 1.0 }
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
        payload: { path: paths[1] }
      })
    }).then(r => r.json()),
    
    fetch('/api/enhanced', {
      method: 'POST',
      body: JSON.stringify({
        action: 'upi-fraud',
        payload: { profile, revenueIncrease: 25 }
      })
    }).then(r => r.json())
  ]);
  
  // Store everything
  setCurrentResult({
    ...result,
    cascadingPaths,
    rewardDecomposition: rewardDecomp.data,
    curriculumLevels: curriculum.data,
    burnoutTrajectory: burnoutTraj.data,
    confidenceDistribution: confidence.data,
    ablationStudy: ablation.data,
    competitorHeatmap: competitor.data,
    fraudRisk: fraud.data
  });
}
```

---

### Part 5: INTEGRATION INTO MAIN PAGE

#### **Where to Add New Components in src/app/page.tsx**

```typescript
// Inside main render (after current graphs)

{/* TIER 1: Game-Changing Novelties */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
  {cascadingPaths.length > 0 && (
    <CascadingPathSelector
      parentName={selectedPath?.name || ''}
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

{/* TIER 2: Critical Visualizations */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
  <GlobalSHAPBeeswarm features={features} baseValue={baseValue} />
  <RewardDecompositionChart decomposition={rewardDecomposition} />
  <CurriculumBreakdown levels={curriculumLevels} />
  <AblationStudyChart ablations={ablationStudy} />
  <BurnoutTrajectoryChart trajectory={burnoutTrajectory} />
  <ConfidenceDistributionHistogram distribution={confidenceDistribution} />
  <CompetitorHeatmapChart heatmapData={competitorHeatmap} />
  <UFraudRiskSimulator fraudScore={fraudRisk} />
</div>
```

---

### Part 6: COMPLETE FLOW EXAMPLE

```typescript
// 1. User enters profile data and clicks "Run Intelligence"
const handleRunSimulation = async () => {
  setIsLoading(true);
  
  // 2. Generate base paths (existing)
  const paths = generateDecisionPaths(profile, agentContributions);
  
  // 3. Get festival & regional settings
  const festival = await calculateFestivalMultiplier(45, 'Holi');
  const regional = await calculateRegionalAdjustment(profile.cityTier, profile.location);
  
  setFestivalMultiplier(festival);
  setRegionalAdjustment(regional);
  
  // 4. Select "Balanced" path by default
  const selectedPath = paths[1];
  setSelectedPath(selectedPath);
  
  // 5. Generate cascading sub-paths
  const cascading = await generateCascadingPaths(selectedPath, profile, 1);
  setCascadingPaths(cascading);
  setBreadcrumbPath(['Level 1', selectedPath.name]);
  
  // 6. Calculate all enhancements in parallel
  const [
    decomp,
    curriculum,
    burnout,
    confidence,
    ablation,
    competitor,
    fraud
  ] = await Promise.all([
    calculateRewardDecomposition(selectedPath, profile, regional, festival.demandMultiplier),
    generateCurriculumLearning(100),
    generateBurnoutTrajectory(profile.vibeMode, 30),
    generateConfidenceDistribution(10),
    generateAblationStudy(),
    generateCompetitorHeatmapMatrix(selectedPath),
    simulateUPIFraudRisk(profile, 25)
  ]);
  
  // 7. Generate initial jugaad ideas
  const jugaad = [
    { id: '1', generation: 1, category: 'partnership', ... },
    { id: '2', generation: 1, category: 'frugal', ... }
  ];
  jugaadHistory.push(...jugaad);
  
  // 8. Store everything
  const result = {
    ...baseResult,
    cascadingPaths: cascading,
    rewardDecomposition: decomp,
    curriculumLevels: curriculum,
    burnoutTrajectory: burnout,
    confidenceDistribution: confidence,
    ablationStudy: ablation,
    competitorHeatmap: competitor,
    fraudRisk: fraud
  };
  
  setCurrentResult(result);
  
  // 9. Log initial action
  addAuditEntry({
    timestamp: new Date(),
    action: 'simulation-run',
    profile: profile.name,
    paths: paths.length,
    selectedPath: selectedPath.name
  });
  
  setIsLoading(false);
};

// 10. When user selects a cascading sub-path
const handleCascadingSelect = async (subPath) => {
  setSelectedPath(subPath);
  setCascadingLevel(2);
  setBreadcrumbPath([...breadcrumbPath, subPath.name]);
  
  // Could generate Level 3 sub-sub-paths
  const level2Cascading = generateCascadingPaths(subPath, profile, 2);
  setCascadingPaths(level2Cascading);
  
  addAuditEntry({
    timestamp: new Date(),
    action: 'cascading-select',
    level: 2,
    pathName: subPath.name,
    riskScore: subPath.riskScore
  });
};

// 11. When user provides jugaad feedback
const handleJugaadFeedback = async (ideaId, feedback) => {
  const idea = jugaadHistory.find(j => j.id === ideaId);
  const evolved = evolveSuggestion(idea, feedback);
  
  addJugaadIdea(evolved);
  updateJugaadIdea(ideaId, { userFeedback: feedback });
  
  addAuditEntry({
    timestamp: new Date(),
    action: 'jugaad-evolution',
    ideaId,
    feedback,
    generation: evolved.generation
  });
};

// 12. Export audit trail
const handleExportAuditTrail = () => {
  const csv = auditTrail.map(entry => 
    `${entry.timestamp},${entry.action},${JSON.stringify(entry.details)}`
  ).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neobi-audit-${new Date().toISOString()}.csv`;
  a.click();
};
```

---

### ✅ COMPLETE FEATURE CHECKLIST

- [x] Cascading paths (3 levels)
- [x] Reward decomposition (5 components)
- [x] Curriculum learning (3 levels)
- [x] Burnout trajectory
- [x] Confidence distribution
- [x] Ablation study
- [x] Competitor heatmap
- [x] Regional adjustment
- [x] Festival multiplier
- [x] UPI fraud simulator
- [x] Jugaad generator
- [x] Global SHAP beeswarm
- [x] All components built
- [x] API routes configured
- [x] Zustand store extended
- [x] Types defined
- ⏳ Integration into main page (manual step)
- ⏳ Audit trail export UI
- ⏳ Full-page roadmap (React Flow)

