/**
 * NeoBI India v2.0 - LLM Router
 */

interface LLMRequest {
  prompt: string;
  context?: any;
  maxTokens?: number;
  temperature?: number;
}

interface LLMResponse {
  content: string;
  model: string;
  tokensUsed: number;
  cost: number;
}

export async function routeLLMQuery(request: LLMRequest): Promise<LLMResponse> {
  const complexity = analyzeQueryComplexity(request.prompt);
  const model = selectModel(complexity);

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return getMockResponse(request.prompt, model);
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are NeoBI, an AI business intelligence assistant for Indian entrepreneurs.',
          },
          { role: 'user', content: request.prompt },
        ],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
      }),
    });

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: model,
      tokensUsed: data.usage.total_tokens,
      cost: data.usage.total_tokens * 0.000003,
    };
  } catch (error) {
    return getMockResponse(request.prompt, model);
  }
}

function analyzeQueryComplexity(prompt: string): number {
  let complexity = 20;
  if (prompt.length > 200) complexity += 20;
  if (prompt.includes('analyze') || prompt.includes('explain')) complexity += 15;
  return Math.min(100, complexity);
}

function selectModel(complexity: number): string {
  if (complexity < 30) return 'anthropic/claude-3-haiku';
  if (complexity < 70) return 'anthropic/claude-3.5-sonnet';
  return 'anthropic/claude-opus-4-5';
}

function getMockResponse(prompt: string, model: string): LLMResponse {
  return {
    content: `Based on "${prompt.substring(0, 50)}...", focus on core metrics and seasonal trends.`,
    model: model + ' (mock)',
    tokensUsed: 150,
    cost: 0,
  };
}
