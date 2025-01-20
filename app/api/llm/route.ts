import { NextRequest, NextResponse } from 'next/server';
import { queryLLM, LLM_MODELS } from '@/app/utils/llm';

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKeys } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!apiKeys?.openai || !apiKeys?.deepseek) {
      return NextResponse.json(
        { error: 'API keys are required' },
        { status: 400 }
      );
    }

    const responses = await Promise.all(
      Object.keys(LLM_MODELS).map(async (model) => {
        try {
          const response = await queryLLM(model as keyof typeof LLM_MODELS, prompt, apiKeys);
          return { model, response, loading: false };
        } catch (error: any) {
          return {
            model,
            response: '',
            error: error.message || 'Failed to get response',
            loading: false,
          };
        }
      })
    );

    return NextResponse.json({ responses });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}