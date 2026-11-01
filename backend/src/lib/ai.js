// backend/src/lib/ai.js
import OpenAI from 'openai';

// OpenAI-compatible client. Defaults to Mistral's free tier (La Plateforme).
// To switch providers later, just change these env vars — no code changes:
//   Mistral: AI_BASE_URL=https://api.mistral.ai/v1      AI_MODEL=mistral-small-latest
//   Groq:    AI_BASE_URL=https://api.groq.com/openai/v1  AI_MODEL=gpt-oss-120b
//   OpenAI:  (omit AI_BASE_URL)                          AI_MODEL=gpt-4o-mini
export const ai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || 'https://api.mistral.ai/v1',
});

export const AI_MODEL = process.env.AI_MODEL || 'mistral-small-latest';

// Ask the model for strict JSON and parse it tolerantly.
export const askJSON = async (prompt, { maxTokens = 4000 } = {}) => {
  const completion = await ai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an exam question generator. Always respond with valid JSON only. No markdown, no explanations, no code fences.',
      },
      { role: 'user', content: prompt },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  });

  let text = completion.choices[0]?.message?.content?.trim() || '';
  // Tolerant cleanup: strip ```json fences if the model adds them anyway
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();

  return JSON.parse(text);
};