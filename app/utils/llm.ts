import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export const LLM_MODELS = {
  "gemini-2.0-flash-exp": {
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    useTemperature: true,
    description: "Latest Gemini model with enhanced speed and capabilities",
  },
  "gemini-1.5-flash": {
    name: "Gemini 1.5 Flash",
    provider: "gemini",
    useTemperature: true,
    description: "Fast and efficient Gemini model",
  },
  "deepseek-reasoner": {
    name: "DeepSeek Reasoner",
    provider: "deepseek",
    useTemperature: false,
    description: "Optimized for logical reasoning and analytical tasks",
  },
  "deepseek-chat": {
    name: "DeepSeek Chat",
    provider: "deepseek",
    useTemperature: true,
    description: "General-purpose chat model with creative capabilities",
  },
  "gpt-4o-2024-11-20": {
    name: "GPT-4o",
    provider: "openai",
    useTemperature: true,
    description: "Latest GPT-4 model with enhanced capabilities",
  },
  "gpt-4o-mini": {
    name: "GPT-4o Mini",
    provider: "openai",
    useTemperature: true,
    description: "Lighter and faster version of GPT-4",
  },
  "claude-3-5-sonnet-20241022": {
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    useTemperature: true,
    description: "Advanced language model from Anthropic",
  },
} as const;

async function queryGemini(
  model: string,
  prompt: string,
  apiKey: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || `Failed to get response from ${model}`
      );
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "";
  } catch (error: any) {
    console.error(`Error querying ${model}:`, error);
    throw new Error(error.message || `Failed to get response from ${model}`);
  }
}

async function queryAnthropic(
  model: string,
  prompt: string,
  apiKey: string
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey,
  });

  const response = await anthropic.messages.create({
    model,
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  return (response.content[0] as any).text;
}

export async function queryLLM(
  model: keyof typeof LLM_MODELS,
  prompt: string,
  apiKeys: {
    openai: string;
    deepseek: string;
    gemini: string;
    anthropic: string;
  }
) {
  const config = LLM_MODELS[model];

  // Get the required API key based on provider
  let requiredKey: string;
  const provider = config.provider as
    | "openai"
    | "deepseek"
    | "gemini"
    | "anthropic";
  switch (provider) {
    case "openai":
      requiredKey = apiKeys.openai;
      break;
    case "deepseek":
      requiredKey = apiKeys.deepseek;
      break;
    case "gemini":
      requiredKey = apiKeys.gemini;
      break;
    case "anthropic":
      requiredKey = apiKeys.anthropic;
      break;
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }

  if (!requiredKey || requiredKey.trim() === "") {
    throw new Error(`${provider.toUpperCase()} API key is not set`);
  }

  async function queryModel(model: string, prompt: string, provider: string) {
    switch (provider) {
      case "openai":
        const client = new OpenAI({
          apiKey: requiredKey,
          baseURL: undefined,
        });
        const params: OpenAI.ChatCompletionCreateParams = {
          model,
          messages: [{ role: "user" as const, content: prompt }],
          max_tokens: 1000,
        };

        if (config.useTemperature) {
          Object.assign(params, { temperature: 0.7 });
        }

        const response = await client.chat.completions.create(params);

        return response.choices[0].message.content || "";
      case "deepseek":
        const deepseekClient = new OpenAI({
          apiKey: requiredKey,
          baseURL: "https://api.deepseek.com/v1",
        });
        const deepseekParams: OpenAI.ChatCompletionCreateParams = {
          model,
          messages: [{ role: "user" as const, content: prompt }],
          max_tokens: 1000,
        };

        if (config.useTemperature) {
          Object.assign(deepseekParams, { temperature: 0.7 });
        }

        const deepseekResponse = await deepseekClient.chat.completions.create(
          deepseekParams
        );

        return deepseekResponse.choices[0].message.content || "";
      case "gemini":
        return queryGemini(model, prompt, requiredKey);
      case "anthropic":
        return queryAnthropic(model, prompt, requiredKey);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  return queryModel(model, prompt, provider);
}
