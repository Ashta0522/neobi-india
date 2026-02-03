// AI API Route - Provides AI-powered business insights
import { NextRequest, NextResponse } from 'next/server';
import { aiClient, BusinessContext } from '@/lib/ai-client';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, context, query } = body;

    // Check if AI is configured
    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'AI provider not configured. Please add API keys to environment variables.',
        fallback: true,
        message: generateFallbackResponse(action, context, query),
      });
    }

    let response;

    switch (action) {
      case 'insight':
        response = await aiClient.generateBusinessInsight(context as BusinessContext);
        break;
      case 'market-entry':
        response = await aiClient.analyzeMarketEntry(context.targetState, context.industry);
        break;
      case 'funding':
        response = await aiClient.assessFundingReadiness(context as BusinessContext);
        break;
      case 'cashflow':
        response = await aiClient.predictCashFlow(context);
        break;
      case 'workforce':
        response = await aiClient.planWorkforce(context);
        break;
      case 'gst':
        response = await aiClient.checkGSTCompliance(context);
        break;
      case 'chat':
      default:
        response = await aiClient.chat(query || context.query);
        break;
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        fallback: true,
        message: 'AI service temporarily unavailable. Using fallback analysis.',
      },
      { status: 500 }
    );
  }
}

// Fallback response generator when AI is not configured
function generateFallbackResponse(action: string, context: any, query: string): string {
  const responses: Record<string, string> = {
    'insight': `Based on your ${context?.industry || 'business'} in ${context?.location || 'India'}, here are key insights:

1. **Market Position**: Your MRR of ₹${((context?.mrr || 0) / 100000).toFixed(1)}L positions you in the growth phase.

2. **Key Metrics to Track**:
   - Customer Acquisition Cost (CAC)
   - Monthly Recurring Revenue growth rate
   - Churn rate
   - Net Promoter Score

3. **Recommendations**:
   - Focus on customer retention strategies
   - Explore regional expansion opportunities
   - Consider strategic partnerships

4. **India-Specific Factors**:
   - Festival seasons can boost sales 30-50%
   - Tier 2/3 cities offer untapped potential
   - Digital payment adoption is growing 40% YoY`,

    'market-entry': `Market Entry Analysis for ${context?.targetState || 'target state'}:

1. **Market Opportunity**: Strong potential in ${context?.industry || 'your industry'}

2. **Entry Strategy Options**:
   - Direct entry with local partnerships
   - Franchise model for faster scaling
   - E-commerce first approach

3. **Key Considerations**:
   - State-specific regulations
   - Local competition landscape
   - Infrastructure availability

4. **Recommended Timeline**: 6-12 months for full market entry`,

    'funding': `Funding Readiness Assessment:

1. **Current Stage**: Based on your metrics, you appear ready for ${context?.stage || 'Seed'} funding

2. **Valuation Range**: ₹${((context?.mrr || 500000) * 30 / 10000000).toFixed(1)}Cr - ₹${((context?.mrr || 500000) * 50 / 10000000).toFixed(1)}Cr

3. **Strengths**:
   - Clear product-market fit
   - Strong team
   - Growing MRR

4. **Areas to Improve**:
   - Unit economics documentation
   - Go-to-market strategy clarity
   - Financial projections`,

    'cashflow': `Cash Flow Analysis:

1. **Current Runway**: ${Math.floor((context?.currentBalance || 1000000) / (context?.monthlyOutflow || 200000))} months

2. **30-Day Projection**: ${context?.currentBalance ? '₹' + ((context.currentBalance * 0.95) / 100000).toFixed(1) + 'L' : 'Needs data'}

3. **Recommendations**:
   - Negotiate better payment terms with vendors
   - Accelerate receivables collection
   - Consider invoice factoring for immediate cash needs`,

    'workforce': `Workforce Planning Analysis:

1. **Current Headcount**: ${context?.currentHeadcount || 'N/A'}

2. **Recommended Hiring**:
   - Sales: +2 for growth targets
   - Operations: +1 for scaling
   - Tech: +1 for product development

3. **Seasonal Considerations**:
   - Festival season requires 20-30% temporary staff increase
   - Plan hiring 2 months in advance`,

    'gst': `GST Compliance Summary:

1. **Filing Status**: Review pending returns

2. **Upcoming Deadlines**:
   - GSTR-1: 11th of next month
   - GSTR-3B: 20th of next month

3. **Recommendations**:
   - Automate GST filing process
   - Reconcile ITC monthly
   - Keep documentation for 6 years`,
  };

  return responses[action] || `Analysis for "${query || 'your query'}":

Based on the Indian business context, here are our recommendations:

1. Focus on sustainable growth strategies
2. Maintain strong cash reserves (6+ months runway)
3. Build local partnerships for market penetration
4. Stay compliant with GST and labor regulations
5. Leverage festival seasons for marketing campaigns

For detailed AI-powered insights, please configure an AI provider (OpenAI, Anthropic, or Google Gemini) in the environment variables.`;
}

export async function GET() {
  return NextResponse.json({
    status: 'AI API is running',
    configured: !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_AI_API_KEY),
    provider: process.env.AI_PROVIDER || 'openai',
    endpoints: [
      'POST /api/ai - Generate AI insights',
      'Actions: insight, market-entry, funding, cashflow, workforce, gst, chat',
    ],
  });
}
