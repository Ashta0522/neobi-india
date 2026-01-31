// LLM routing with zero-cost strategy
// Prioritize: Ollama (local) → Groq (free tier) → Gemini (free tier)

export interface LLMProvider {
  name: string;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  cost: number; // per request
  rateLimit: number; // requests per minute
}

const providers: Record<string, LLMProvider> = {
  ollama: {
    name: 'Ollama',
    baseUrl: process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434',
    model: 'llama2',
    cost: 0,
    rateLimit: 100,
  },
  groq: {
    name: 'Groq',
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    model: 'mixtral-8x7b-32768',
    cost: 0, // Free tier
    rateLimit: 30,
  },
  gemini: {
    name: 'Gemini',
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
    cost: 0, // Free tier
    rateLimit: 15,
  },
};

export const selectLLMProvider = async (): Promise<LLMProvider> => {
  // Priority: Ollama (local, free) → Groq → Gemini
  if (providers.ollama.baseUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(`${providers.ollama.baseUrl}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        return providers.ollama;
      }
    } catch (e) {
      // Ollama not available - continue to fallback
      console.warn('Ollama unavailable, falling back to cloud providers');
    }
  }

  if (providers.groq.apiKey) return providers.groq;
  if (providers.gemini.apiKey) return providers.gemini;

  throw new Error('No LLM provider configured. Set NEXT_PUBLIC_GROQ_API_KEY, NEXT_PUBLIC_GEMINI_API_KEY, or NEXT_PUBLIC_OLLAMA_URL');
};

export const callLLM = async (prompt: string): Promise<string> => {
  const provider = await selectLLMProvider();

  if (provider.name === 'Ollama') {
    return callOllama(prompt);
  } else if (provider.name === 'Groq') {
    return callGroq(prompt);
  } else if (provider.name === 'Gemini') {
    return callGemini(prompt);
  }

  throw new Error('LLM provider not available');
};

const callOllama = async (prompt: string): Promise<string> => {
  const response = await fetch(`${providers.ollama.baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response;
};

const callGroq = async (prompt: string): Promise<string> => {
  const apiKey = providers.groq.apiKey;
  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: providers.groq.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert business advisor for Indian entrepreneurs. Provide concise, actionable insights.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from Groq';
  } catch (error) {
    console.error('Groq API call failed:', error);
    throw error;
  }
};

const callGemini = async (prompt: string): Promise<string> => {
  const apiKey = providers.gemini.apiKey;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${providers.gemini.model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert business advisor for Indian entrepreneurs. Provide concise, actionable insights.\n\nUser: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response from Gemini';
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
};

export const getCurrentLLMCost = async (): Promise<number> => {
  const provider = await selectLLMProvider();
  return provider.cost;
};
