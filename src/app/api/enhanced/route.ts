import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();

    switch (action) {
      case 'cascading-paths': {
        return Response.json({ success: true, data: [
          { id: 'cp-1', name: 'Local Partnership', riskScore: 20, expectedValue: 120000, probability: 0.45, timeline: 30, level: 1, benefits: { revenue: 120000, efficiency: 8 } },
          { id: 'cp-2', name: 'Promo Push', riskScore: 35, expectedValue: 80000, probability: 0.35, timeline: 14, level: 1, benefits: { revenue: 50000, efficiency: 5 } },
          { id: 'cp-3', name: 'Product Add-on', riskScore: 50, expectedValue: 200000, probability: 0.25, timeline: 60, level: 2, benefits: { revenue: 200000, efficiency: 12 } },
        ] });
      }

      case 'reward-decomposition': {
        return Response.json({ success: true, data: { totalReward: 850, components: { revenue: 35, riskReduction: 20, burnoutMitigation: 15, operationalEfficiency: 22, complianceScore: 8 }, timestamp: new Date().toISOString() } });
      }

      case 'curriculum-learning': {
        return Response.json({ success: true, data: [ { level:1, description:'Single-Decision', episodes:[0,10,20], rewards:[400,520,620], convergenceMetric:[0,30,60], agentContributions:{} } ] });
      }

      case 'burnout-trajectory': {
        return Response.json({ success: true, data: { timestamp: Array.from({ length: 7 }, (_, i) => new Date(Date.now() + i * 5 * 24 * 60 * 60 * 1000).toISOString()), baselineRisk: [65,69,73,77,81,85,88], afterPathRisk: [42,45,48,50,52,54,55], vibeMode: 'balanced', trajectory: 'improving' } });
      }

      case 'confidence-distribution': {
        return Response.json({ success: true, data: { bins: ['60-70%','70-80%','80-90%','90-95%','95-100%'], count: [10,25,35,20,10] } });
      }

      case 'ablation-study': {
        return Response.json({ success: true, data: [ { component: 'MARL', performanceWithout: 64, performanceWith: 92, dropPercentage: 30.4 } ] });
      }

      case 'jugaad-evolve': {
        const idea = payload?.idea || {};
        const evolved = { ...idea, id: `jugaad-${Date.now()}`, generation: (idea?.generation || 1) + 1, description: (idea?.description || '') + ' (evolved)' };
        return Response.json({ success: true, data: evolved });
      }

      case 'invoice-discount': {
        const amt = payload?.amount || 0;
        const tenorDays = payload?.tenorDays || 30;
        const factor = tenorDays <= 30 ? 0.01 : tenorDays <= 90 ? 0.03 : 0.06;
        return Response.json({ success: true, data: { amount: amt, tenorDays, discountFee: Math.round(amt * factor), netProceeds: Math.round(amt - amt * factor) } });
      }

      case 'angel-esop-sim': {
        const raised = payload?.raised || 0;
        const premium = payload?.premium || 0;
        return Response.json({ success: true, data: { raised, premium, estimatedAngelTax: Math.round(premium * 0.1) } });
      }

      case 'delayed-payment-predictor': {
        const buyer = payload?.buyer || 'unknown';
        const overdue = payload?.overdueAmount || 0;
        const risk = overdue > 500000 ? 'high' : overdue > 100000 ? 'medium' : 'low';
        return Response.json({ success: true, data: { buyer, overdue, predictedDelayDays: risk === 'high' ? 45 : risk === 'medium' ? 18 : 5, risk } });
      }

      case 'tds-schedule': {
        return Response.json({ success: true, data: { scheduled: true, reminderId: `r-${Date.now()}`, details: payload } });
      }

      case 'burnout-schedule': {
        return Response.json({ success: true, data: { scheduled: true, nextCheckIn: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString() } });
      }

      case 'regional-adjustment': {
        const cityTier = payload?.cityTier || 1;
        const demandMult = cityTier === 1 ? 1.0 : cityTier === 2 ? 0.85 : 0.7;
        const hiringCostMult = cityTier === 1 ? 1.0 : cityTier === 2 ? 0.75 : 0.55;
        const supplierCostMult = cityTier === 1 ? 1.0 : cityTier === 2 ? 0.8 : 0.6;
        const complianceBurden = cityTier === 1 ? 100 : cityTier === 2 ? 85 : 65;
        const adjustment = {
          cityTier,
          demandMultiplier: demandMult,
          hiringCostMultiplier: hiringCostMult,
          supplierCostMultiplier: supplierCostMult,
          complianceBurden,
          regionalNote: `Tier ${cityTier} regional multipliers applied`
        };
        return Response.json({ success: true, data: adjustment });
      }

      default:
        return Response.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
