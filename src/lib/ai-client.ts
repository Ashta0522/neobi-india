// AI Client - Supports OpenAI, Anthropic, and Google Gemini
// This provides real AI integration for NeoBI India

export type AIProvider = 'openai' | 'anthropic' | 'gemini';

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: AIProvider;
}

interface BusinessContext {
  industry: string;
  location: string;
  mrr: number;
  teamSize: number;
  stage: string;
  query: string;
}

// Default models for each provider
const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: 'gpt-4-turbo-preview',
  anthropic: 'claude-3-sonnet-20240229',
  gemini: 'gemini-pro',
};

// System prompt for business intelligence
const SYSTEM_PROMPT = `You are NeoBI, an AI-powered business intelligence assistant specifically designed for Indian entrepreneurs and businesses. You have deep knowledge of:

1. Indian Market Dynamics: GST regulations, regional economic variations, festival-based demand patterns, Tier 1/2/3 city dynamics
2. Business Strategy: Market entry, competitive analysis, funding readiness, growth strategies
3. Financial Planning: Cash flow management, burn rate optimization, unit economics
4. Operations: Supply chain for India, workforce planning, regulatory compliance
5. India-Specific Challenges: Payment cycles, credit systems, regional labor laws, import/export regulations

When responding:
- Always consider the Indian business context
- Provide actionable, specific recommendations
- Include relevant metrics and KPIs
- Consider regional variations (North/South/East/West India)
- Factor in festival seasons and their business impact
- Be aware of regulatory requirements (GST, labor laws, FDI norms)

Format your responses with clear sections and bullet points for easy reading.`;

class AIClient {
  private config: AIConfig;

  constructor(config: Partial<AIConfig> = {}) {
    this.config = {
      provider: (process.env.AI_PROVIDER as AIProvider) || config.provider || 'openai',
      apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_AI_API_KEY || config.apiKey || '',
      model: config.model,
    };
  }

  private getModel(): string {
    return this.config.model || DEFAULT_MODELS[this.config.provider];
  }

  async generateBusinessInsight(context: BusinessContext): Promise<AIResponse> {
    const prompt = this.buildBusinessPrompt(context);
    return this.chat(prompt);
  }

  private buildBusinessPrompt(context: BusinessContext): string {
    return `
Business Profile:
- Industry: ${context.industry}
- Location: ${context.location}
- Monthly Recurring Revenue: ₹${(context.mrr / 100000).toFixed(1)} Lakhs
- Team Size: ${context.teamSize} members
- Stage: ${context.stage}

User Query: ${context.query}

Please provide detailed, actionable insights based on this business context. Include:
1. Direct answer to the query
2. Key metrics to track
3. Potential risks and mitigations
4. Recommended next steps
5. India-specific considerations
`;
  }

  async chat(userMessage: string, systemPrompt?: string): Promise<AIResponse> {
    const system = systemPrompt || SYSTEM_PROMPT;

    switch (this.config.provider) {
      case 'openai':
        return this.callOpenAI(userMessage, system);
      case 'anthropic':
        return this.callAnthropic(userMessage, system);
      case 'gemini':
        return this.callGemini(userMessage, system);
      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`);
    }
  }

  private async callOpenAI(userMessage: string, systemPrompt: string): Promise<AIResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.getModel(),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      provider: 'openai',
    };
  }

  private async callAnthropic(userMessage: string, systemPrompt: string): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.getModel(),
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
      provider: 'anthropic',
    };
  }

  private async callGemini(userMessage: string, systemPrompt: string): Promise<AIResponse> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.getModel()}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemPrompt}\n\nUser: ${userMessage}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
      provider: 'gemini',
    };
  }

  // Specialized methods for different business needs
  async analyzeMarketEntry(targetState: string, industry: string): Promise<AIResponse> {
    const prompt = `Analyze market entry opportunity for a ${industry} business entering ${targetState}, India.

Include:
1. Market size and growth potential
2. Competitive landscape
3. Regulatory requirements specific to ${targetState}
4. Entry barriers and how to overcome them
5. Recommended entry strategy (franchise, direct, partnership)
6. Timeline and investment estimate
7. Key success factors`;

    return this.chat(prompt);
  }

  async assessFundingReadiness(profile: BusinessContext): Promise<AIResponse> {
    const prompt = `Assess funding readiness for this business:
${JSON.stringify(profile, null, 2)}

Provide:
1. Overall funding readiness score (0-100)
2. Recommended funding stage (Pre-Seed, Seed, Series A, etc.)
3. Valuation range estimate
4. Key strengths for investors
5. Areas that need improvement before fundraising
6. Potential investor types that would be interested
7. Specific action items to improve fundraising success`;

    return this.chat(prompt);
  }

  async predictCashFlow(financials: {
    currentBalance: number;
    monthlyInflow: number;
    monthlyOutflow: number;
    seasonalFactors?: string[];
  }): Promise<AIResponse> {
    const prompt = `Predict cash flow for the next 90 days:
- Current Balance: ₹${(financials.currentBalance / 100000).toFixed(1)} Lakhs
- Monthly Inflow: ₹${(financials.monthlyInflow / 100000).toFixed(1)} Lakhs
- Monthly Outflow: ₹${(financials.monthlyOutflow / 100000).toFixed(1)} Lakhs
${financials.seasonalFactors ? `- Seasonal Factors: ${financials.seasonalFactors.join(', ')}` : ''}

Provide:
1. 30/60/90 day cash balance projections
2. Runway estimate
3. Cash flow risks
4. Recommendations for improving cash position
5. Working capital optimization suggestions`;

    return this.chat(prompt);
  }

  async planWorkforce(context: {
    currentHeadcount: number;
    industry: string;
    growthTarget: number;
    upcomingFestivals?: string[];
  }): Promise<AIResponse> {
    const prompt = `Create workforce plan:
- Current Headcount: ${context.currentHeadcount}
- Industry: ${context.industry}
- Growth Target: ${context.growthTarget}%
${context.upcomingFestivals ? `- Upcoming Festivals: ${context.upcomingFestivals.join(', ')}` : ''}

Provide:
1. Optimal staffing levels by month
2. Role-wise hiring recommendations
3. Cost impact analysis
4. Seasonal adjustments needed
5. Training and onboarding timeline
6. Contractor vs full-time recommendations`;

    return this.chat(prompt);
  }

  async checkGSTCompliance(gstDetails: {
    turnover: number;
    filingHistory: string;
    state: string;
  }): Promise<AIResponse> {
    const prompt = `Analyze GST compliance status:
- Annual Turnover: ₹${(gstDetails.turnover / 10000000).toFixed(1)} Crores
- Filing History: ${gstDetails.filingHistory}
- State: ${gstDetails.state}

Provide:
1. Compliance assessment
2. Upcoming filing deadlines
3. Potential penalty risks
4. Input Tax Credit optimization opportunities
5. State-specific GST considerations
6. Recommendations for maintaining compliance`;

    return this.chat(prompt);
  }
}

// Export singleton instance
export const aiClient = new AIClient();

// Export class for custom configurations
export { AIClient };

// Export types
export type { AIResponse, BusinessContext, AIConfig };
