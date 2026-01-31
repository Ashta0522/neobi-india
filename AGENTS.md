# NeoBI India v2.0 - Agent Specifications

## 8 Hierarchical Agents - Complete Reference

---

## L1: Central Orchestrator 👑🧠

**Color:** `#9333EA` (Purple)  
**Icon:** 👑🧠  
**Role:** Query parsing, workflow planning, India context detection, agent coordination

### Responsibilities
- Parse user business profile (MRR, customers, location, team size)
- Detect India-specific context (NSE trends, festival demand, GST applicability)
- Route query to appropriate L2 agents (Simulation → Decision → Operations)
- Coordinate parallel execution
- Aggregate results into decision paths
- Ensure compliance with India regulations (DPDP, GST, UPI)

### Inputs
- BusinessProfile
- User query / context
- Current market state (NIFTY, festival)
- Risk tolerance slider

### Outputs
- Recommended decision path
- Agent delegation plan
- Confidence score
- Execution timeline

### Code Location
- `store.ts` — Agent definition
- `page.tsx` — Orchestration logic in `handleSimulate()`
- `simulationEngine.ts` — SHAP aggregation

---

## L2: Simulation Cluster 🔮📊

**Color:** `#06B6D4` (Cyan)  
**Icon:** 🔮📊  
**Role:** Market/demand/competitor forecasting with NSE trends

### Responsibilities
- Forecast demand using business profile (MRR, customers, growth target)
- Simulate 3 competitor personalities:
  - **Aggressive:** Price wars, rapid feature launches
  - **Conservative:** Margin protection, slow scaling
  - **Innovative:** New market creation, partnerships
- Integrate NSE market trends (NIFTY movement)
- Adjust for festival seasonality (Holi +35%, Diwali +50%)
- Generate competitor response scenarios

### Inputs
- BusinessProfile
- Historical NIFTY data
- Festival dates + demand lift percentages
- Competitor profiles

### Outputs
- 3-month demand forecast (units)
- Revenue projection (₹)
- Competitor response matrix
- Market risk factors

### Code Location
- `store.ts` — Agent definition
- `simulationEngine.ts` — `predictWorldModel()`, `generateCompetitorHeatmap()`
- `indiaContext.ts` — Festival data, market hours
- `Graphs.tsx` — CashFlowProjectionChart visualization

### Integration Points
- Feeds into **Decision Intelligence** for path evaluation
- Triggers **Operations Optimizer** for capacity planning

---

## L2: Decision Intelligence 🌳🎯

**Color:** `#10B981` (Emerald)  
**Icon:** 🌳🎯  
**Role:** Multi-level decision trees, EV/probability calculation, SHAP attribution

### Responsibilities
- Build decision tree for each business problem
  - Root: Base scenario (no action)
  - L1 branches: Strategic options (Aggressive/Balanced/Conservative)
  - L2 branches: Execution paths (hiring, fundraising, partnerships)
- Calculate Expected Value (EV) for each path:
  - EV = (Probability × Benefit) - Cost
- Assign probabilities using:
  - Historical success rates
  - Team capacity
  - Market conditions (festival boost, seasonality)
- Generate SHAP attributions:
  - Why this path scores highest?
  - Which factors matter most? (MRR, team size, growth target)
- Rank paths by risk-adjusted return

### Inputs
- Decision problem statement
- 3 forecasts from **Simulation Cluster**
- Operational constraints from **Operations Optimizer**
- Risk tolerance (0-100 slider)

### Outputs
- 3 decision paths with:
  - Expected Value (₹L)
  - Probability (%)
  - Risk score (0-100)
  - Timeline (days)
  - SHAP feature importance
  - Agent contribution breakdown

### Code Location
- `store.ts` — Agent definition
- `simulationEngine.ts` — `generateDecisionPaths()`, `calculateSHAPValues()`
- `DecisionRoadmap.tsx` — UI for path display
- `AdvancedGraphs.tsx` — SHAPBeeswarm, AgentContributionPie

### Integration Points
- Receives demand forecast from **Simulation Cluster**
- Receives constraints from **Operations Optimizer**
- Feeds to **Personal Coach** for burnout impact
- Feeds to **Growth Strategist** for acquisition implications

---

## L2: Operations Optimizer ⚙️🏭

**Color:** `#F97316` (Orange)  
**Icon:** ⚙️🏭  
**Role:** Hiring/inventory/supplier optimization, compliance, risk scoring

### Responsibilities
- **Hiring Optimization:**
  - Calculate required headcount for each path (Aggressive: +50%, Balanced: +20%, Conservative: 0%)
  - Generate Gantt timeline for hiring (typical cycle: 60-90 days)
  - Estimate cost per hire (avg ₹8L-15L total comp per engineer in India)
  - Calculate savings from efficiency gains
  
- **Inventory Management:**
  - Calculate optimal reorder point based on:
    - Lead time (supplier dependent, 14-21 days)
    - Average daily usage (from MRR + business model)
    - Safety stock (2-3 weeks buffer)
  - Forecast turnover ratio (target: 4-6x annually)
  - Identify stockout/overstock risks

- **Supplier Optimization:**
  - Score suppliers on:
    - Reliability (on-time delivery %)
    - Cost (₹ per unit)
    - Lead time (days)
    - Negotiation potential (discount feasibility)
  - Model supplier switching costs
  - Recommend diversification strategy

- **Compliance Verification:**
  - ✅ **GST:** Check if business liable (>20L revenue threshold)
    - Standard rate: 18% (most categories)
    - Reduced: 12% (some services)
    - Preferential: 5% (agri products)
  - ✅ **DPDP Act:** Ensure data privacy policy + consent management
    - Status: "Compliant" or "Action Required"
  - ✅ **UPI:** Validate settlement (30min-1day for INR transfers)

- **Risk Scoring:**
  - Operational risk (0-100):
    - Hiring execution risk (+20 if aggressive, +5 if balanced)
    - Supplier concentration risk (-10 if diversified)
    - Cash runway risk (based on burn rate)

### Inputs
- Decision path (Aggressive/Balanced/Conservative)
- Current team size, burn rate (from profile)
- Current supplier list
- Inventory levels

### Outputs
- Hiring plan (timeline, cost, headcount)
- Inventory reorder points
- Supplier scorecard (reliability, cost, negotiation potential)
- Compliance checklist (GST, DPDP, UPI)
- Operational risk score (0-100)

### Code Location
- `store.ts` — Agent definition
- `simulationEngine.ts` — `generateOperationalMetrics()`
- `indiaContext.ts` — GST rates, DPDP validation
- `OperationsPanel.tsx` — UI for hiring, suppliers, inventory, compliance

### Data Sources
- Profile MRR (burn rate)
- Market data (supplier lead times)
- Compliance rules (GST rates, DPDP requirements)

### Integration Points
- Feeds hiring timeline to **Learning & Adaptation** for cost tracking
- Feeds cost estimates to **Decision Intelligence** for EV calculation
- Feeds risk score to **Personal Coach** for burnout estimation

---

## L3: Personal Coach 💡❤️

**Color:** `#14B8A6` (Teal)  
**Icon:** 💡❤️  
**Role:** Stress detection, burnout reduction, wellness advice

### Responsibilities
- **Stress Assessment:**
  - Baseline burnout risk: 65% (typical startup founder)
  - Adjust based on path:
    - **Aggressive path:** +15 (hiring pressure, cash burn, go-to-market stress)
    - **Balanced path:** -10 (moderate growth, sustainable pace)
    - **Conservative path:** -25 (low growth, stability focus, time for wellness)
  
- **Vibe Mode Adjustment:**
  - **Aggressive:** Risk reduction 10% (fast but stressful)
    - Recommendation: Daily standups, weekly 1:1s, monthly reviews
    - Tools: Stress monitoring, quick wins, delegation
    - Outcome: 10% burnout reduction vs pure aggression
  
  - **Balanced:** Risk reduction 35% (sustainable default)
    - Recommendation: Balanced workload, 2-day weekends, monthly off
    - Tools: Wellness programs, team building, mentorship
    - Outcome: 35% burnout reduction, good growth pace
  
  - **Conservative:** Risk reduction 60% (low growth, high wellness)
    - Recommendation: Flexible schedule, sabbaticals, deep work time
    - Tools: Coaching, therapy, hobby time
    - Outcome: 60% burnout reduction, stable foundation

- **Wellness Advice:**
  - Personalized based on:
    - Team size (small teams = higher personal load)
    - MRR (cash pressure varies with profitability)
    - Growth target (aggressive targets = stress)
    - Location (city factor: Bangalore high-pressure, Goa low-pressure)

### Inputs
- Selected decision path
- BusinessProfile (team size, MRR, location)
- Vibe mode selection
- Current stress level (implicit from path aggressiveness)

### Outputs
- Burnout risk score after adjustment (0-100, lower is better)
- Recommended vibe mode
- Wellness recommendations (specific actions)
- Risk reduction % (vs baseline)
- Stress factors to monitor

### Code Location
- `store.ts` — Agent definition, vibe mode state
- `simulationEngine.ts` — `calculateBurnoutReduction()`
- `RiskAndCoachPanel.tsx` — Burnout display + vibe coaching
- `ControlBar.tsx` — Vibe mode selector (Aggressive/Balanced/Conservative)
- `AdvancedGraphs.tsx` — BurnoutRiskChart (by vibe mode)

### Integration Points
- Adjusts **Decision Intelligence** recommendations based on burnout
- Feeds wellness advice to final output
- Influences **Growth Strategist** on acquisition pace

---

## L3: Innovation Advisor ⚡🧬

**Color:** `#FACC15` (Yellow)  
**Icon:** ⚡🧬  
**Role:** Jugaad solutions, pivots, partnerships

### Responsibilities
- **Jugaad Solutions:** Identify low-cost, high-impact alternatives
  - Examples: Bartering with agencies, using free tools (Figma, Notion, etc.), MVP-first launches
  - India-specific: Leverage network, bootstrap instead of fundraise
  
- **Pivot Detection:** Identify if current trajectory misaligned
  - Triggers: Revenue plateau, competitor wins, market shift
  - Alternatives: Adjacent market, product pivot, go-upmarket
  
- **Partnership Opportunities:**
  - Co-marketing with complementary startups
  - Revenue sharing with distribution partners
  - Technology partnerships (API integrations)
  - Regional partnerships (state-specific players)

- **Risk Mitigation:** Suggest low-risk experiments
  - Test new feature with 10% users (A/B test)
  - Pilot in new market (low-cost region first)
  - Pre-sales validation (30-day customer interviews)

### Inputs
- Business situation (revenue, growth rate, team)
- Market data (competitor moves, festivals)
- Decision path (to identify innovation opportunities)

### Outputs
- 3-5 innovation opportunities with:
  - Risk level (low/medium/high)
  - Time to validate (days)
  - Expected impact (revenue, efficiency, risk reduction)
  - Required team (headcount)

### Code Location
- `store.ts` — Agent definition
- Integration point: **Growth Strategist** for partnership recommendations

---

## L3: Growth Strategist 📣📈

**Color:** `#EC4899` (Pink)  
**Icon:** 📣📈  
**Role:** Marketing/acquisition strategies, growth hacks, ROI modeling

### Responsibilities
- **Acquisition Strategy:**
  - Calculate CAC (Customer Acquisition Cost) based on MRR & customer count
  - Recommend channels:
    - **Organic:** Content, SEO (high effort, low cost)
    - **Paid:** Google Ads, LinkedIn (fast, high cost)
    - **Partnerships:** Affiliate, reseller (moderate effort & cost)
    - **Viral:** Referral programs (requires product-market fit)

- **Growth Hacks:** India-specific
  - Festival-based campaigns (Diwali discounts, Holi themed)
  - Regional targeting (state-wise penetration)
  - UPI-first pricing (cheaper for digital payments)
  - Community building (LinkedIn, Twitter, WhatsApp groups)

- **ROI Modeling:**
  - Model acquisition cost for each channel
  - Project revenue growth from 50%, 100%, 200% CAC spend
  - Identify optimal spend allocation
  - Calculate payback period

- **Retention Strategies:**
  - Churn analysis (project LTV)
  - Loyalty programs
  - Product improvements (reduce churn)

### Inputs
- BusinessProfile (MRR, customers, location)
- Market forecast (Simulation Cluster)
- Budget availability (from decision path)
- Competitive landscape

### Outputs
- Acquisition strategy (channels, CAC, timeline)
- Growth hack recommendations
- ROI model (3 budget scenarios)
- Retention recommendations

### Code Location
- `store.ts` — Agent definition
- Integration: **Decision Intelligence** for market-fit validation

---

## L4: Learning & Adaptation 🔄🧠

**Color:** `#84CC16` (Lime)  
**Icon:** 🔄🧠  
**Role:** MARL training, replay buffer, policy updates, versioning

### Responsibilities
- **Multi-Agent RL Training:**
  - Run episodes of agent decisions
  - Collect rewards (EV, success rate, team satisfaction)
  - Update agent policies (neural networks or rule sets)
  - Convergence metric: Track total reward → target 850
  
- **Replay Buffer Management:**
  - Store successful decision outcomes
  - Sample from buffer to prevent catastrophic forgetting
  - Max buffer size: 10,000 episodes
  - Prune old, low-reward experiences

- **Policy Versioning:**
  - Version agent policies (v0, v1, v2, ...)
  - Track which version best for each business type
  - A/B test new policies before rollout
  - Rollback on performance degradation

- **Feedback Integration:**
  - Collect user feedback (decision outcome after 30/90 days)
  - Update reward signal: "Did we predict correctly?"
  - Adjust SHAP weights based on outcome errors
  - Continuous improvement loop

- **Cross-Episode Learning:**
  - Extract patterns from past decisions
  - Identify common failure modes
  - Share learnings across businesses (anonymized)

### Inputs
- Decision path executed
- User feedback (outcome after N days)
- Execution data (did hiring happen on time? did revenue grow?)
- Market outcome (actual vs predicted)

### Outputs
- Updated agent policies
- Improved SHAP weights
- New replay buffer entries
- Policy version number (for auditability)
- Convergence metric (0-100, 100 = optimal)

### Code Location
- `store.ts` — Agent definition, MARL state tracking
- `simulationEngine.ts` — `simulateMARLEpisode()` (100 episodes, convergence to 850)
- `Graphs.tsx` — MARLConvergenceCurve (shows learning over episodes)

### Integration Points
- Central feedback loop: All agents' recommendations → Learning → Next iteration
- Affects all agents' future recommendations
- Critical for long-term improvement

---

## 🎯 Agent Contribution Weighting (MARL Reward Distribution)

When a decision path is recommended, rewards are distributed:

```
Total Reward = 1000 (max)
├── Orchestrator: 12% (120 pts) — Coordination, context detection
├── Simulation Cluster: 16% (160 pts) — Market accuracy
├── Decision Intelligence: 20% (200 pts) — Path evaluation, SHAP
├── Operations Optimizer: 25% (250 pts) — Feasibility, risk assessment
├── Personal Coach: 11% (110 pts) — Burnout reduction, wellness
├── Innovation Advisor: 8% (80 pts) — Creativity, risk mitigation
├── Growth Strategist: 10% (100 pts) — Acquisition feasibility
└── Learning & Adaptation: 15% (150 pts) — Policy update quality
```

These weights are **dynamically adjusted** based on:
- Business type (SaaS vs E-commerce: different weights)
- Growth stage (early: favor innovation; late: favor operations)
- User feedback (high accuracy → higher weight in future)

---

## 🔄 Agent Execution Flow

```
User Query + Profile
        ↓
[Orchestrator] — Detects India context (NSE, festivals, compliance)
        ↓
    ┌───────────────────────────────────┐
    ↓                                   ↓
[Simulation Cluster]          [Operations Optimizer]
(Market forecasting)          (Hiring, inventory, suppliers)
    ↓                                   ↓
[Decision Intelligence] ← Receives forecasts + constraints
(Build decision tree, SHAP)
    ↓
┌─────────────────────────────────────────┐
│ Generate 3 Decision Paths                 │
│ ├─ Aggressive (Aggressive/Balanced/Conservative personality)
│ ├─ Balanced
│ └─ Conservative
└─────────────────────────────────────────┘
    ↓
    ├→ [Personal Coach] — Adjust for burnout (vibe mode)
    ├→ [Innovation Advisor] — Add innovation ideas
    ├→ [Growth Strategist] — Add growth hacks
    └→ [Learning & Adaptation] — Log for feedback
    ↓
Return 3 paths with:
├─ Expected Value
├─ Probability
├─ Risk score
├─ SHAP factors
├─ Agent contributions
└─ Burnout impact (by vibe)
```

---

## ✅ Agent Completeness Checklist

- ✅ **All 8 agents** defined in `store.ts` (INITIAL_AGENTS)
- ✅ **All icons & colors** matched to spec
- ✅ **All roles documented** with inputs/outputs
- ✅ **MARL reward distribution** (1000 pts split 8 ways)
- ✅ **India-specific logic** in Orchestrator, Operations, Coach
- ✅ **Real-time context** (NIFTY, festivals, market hours)
- ✅ **UI integration** (sidebar hierarchy, contribution pie, burnout chart)
- ✅ **API endpoints** for simulation + profile
- ✅ **Visualization** for agent activity + contributions
- ✅ **Extensible** — Weights easily adjustable per business type

---

**NeoBI India v2.0 — 8 Agents, Infinite Wisdom** 🧠👑
