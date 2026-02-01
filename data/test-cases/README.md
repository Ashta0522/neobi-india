# NeoBI India - Test Cases Dataset

## Overview

This directory contains 100 synthetic test cases designed to validate NeoBI's decision intelligence across diverse Indian startup scenarios.

## Test Case Structure

Each test case follows this schema:

```json
{
  "id": "cafe-001",
  "name": "Healthy Cafe in Bangalore Mall",
  "category": "Food & Beverage",
  "profile": {
    "industry": "Food & Beverage",
    "mrr": 500000,
    "customers": 80,
    "teamSize": 5,
    "location": "Bangalore",
    "cityTier": 1,
    "foundedDate": "2024-01-15",
    "growthTarget": 25,
    "riskTolerance": "balanced"
  },
  "expertRating": {
    "bestPath": "Local Partnership",
    "score": 4.5,
    "reasoning": "Given Bangalore's competitive F&B market and mall location, local partnerships with complementary businesses (gym, wellness centers) would drive foot traffic cost-effectively. Alternative paths like aggressive marketing would burn cash without sustainable ROI in Tier 1 markets."
  },
  "metadata": {
    "complexity": "medium",
    "seasonality": true,
    "festivalSensitivity": "high"
  }
}
```

## Categories

- **Food & Beverage** (20 cases): Cafes, restaurants, cloud kitchens
- **D2C Clothing** (20 cases): Fashion, ethnic wear, accessories
- **SaaS B2B** (20 cases): HR tech, FinTech, MarTech
- **Kirana Store Chain** (20 cases): Retail, groceries, quick commerce
- **Mixed** (20 cases): EdTech, FinTech, Healthcare, Logistics, etc.

## Validation Metrics

Each test case can be used to measure:
- **Accuracy**: Does NeoBI recommend the expert-rated path?
- **Reasoning Alignment**: Does the justification match expert logic?
- **Risk Assessment**: Risk score within ±10% of expert assessment
- **Timeline Estimation**: Timeline within ±20% of expert estimate

## Usage

```typescript
import { loadTestCases } from '@/data/test-cases/loader';

const testCases = loadTestCases();
const accuracy = runBacktest(testCases);
console.log(`Accuracy: ${accuracy}%`); // Target: >90%
```

## Ground Truth

Expert ratings are based on:
1. Real Indian market conditions (as of 2026)
2. Regional economics (Tier 1/2/3 dynamics)
3. Cultural factors (festivals, local preferences)
4. Compliance requirements (GST, DPDP, labor laws)
5. Historical success rates of similar startups

## License

MIT - For research and validation purposes
