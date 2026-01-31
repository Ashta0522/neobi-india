
import { generateDecisionPaths, simulateMARLEpisode } from '@/utils/simulationEngine';
import { BusinessProfile, SimulationResult } from '@/types';

export async function POST(request: Request) {
  try {
    const { profile, riskTolerance } = await request.json();

    if (!profile) {
      return Response.json({ error: 'Profile required' }, { status: 400 });
    }

    // Simulate MARL training
    let marlState = {
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

    for (let i = 0; i < 100; i++) {
      marlState = simulateMARLEpisode(i, marlState, {
        orchestrator: 0.12,
        simulation_cluster: 0.16,
        decision_intelligence: 0.18,
        operations_optimizer: 0.2,
        personal_coach: 0.11,
        innovation_advisor: 0.08,
        growth_strategist: 0.1,
        learning_adaptation: 0.15,
      });
    }

    // Generate decision paths
    const paths = generateDecisionPaths(profile, {
      orchestrator: 12,
      simulation_cluster: 18,
      decision_intelligence: 20,
      operations_optimizer: 25,
      personal_coach: 5,
      innovation_advisor: 8,
      growth_strategist: 22,
      learning_adaptation: 10,
    });

    const result: SimulationResult = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      profile,
      query: 'Optimal growth strategy',
      paths,
      recommendation: paths[1],
      marlState,
      confidence: 92,
      executionTime: 2100,
      costUsed: 0,
    };

    return Response.json(result);
  } catch (error) {
    console.error('Simulation error:', error);
    return Response.json(
      { error: 'Simulation failed' },
      { status: 500 }
    );
  }
}
