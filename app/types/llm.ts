export interface LLMResponse {
  model: string;
  response: string;
  error?: string;
  loading?: boolean;
  question?: string;
}

export interface APIKeys {
  openai: string;
  deepseek: string;
  gemini: string;
  anthropic: string;
}