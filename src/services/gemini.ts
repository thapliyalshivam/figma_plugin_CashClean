/**
 * Gemini API service – single initialised instance for use across features.
 * API key is injected at build time via webpack DefinePlugin from .env (GEMINI_API_KEY).
 */

declare const __GEMINI_API_KEY__: string;

/** Use a model that is supported for generateContent (v1beta). gemini-1.5-flash is not found; use 2.0. */
const DEFAULT_MODEL = "gemini-2.0-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiConfig {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiApiError {
  status: number;
  code?: number;
  message?: string;
  statusText?: string;
}

function getApiKey(): string {
  return typeof __GEMINI_API_KEY__ === "string" ? __GEMINI_API_KEY__ : "";
}

function getUrl(model: string, apiKey: string): string {
  return `${BASE_URL}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

/**
 * Strip preamble, code blocks, and quotes from a model response to get plain text.
 */
function extractPlainText(raw: string): string {
  let text = raw.trim();
  const codeBlockMatch = text.match(/^```(?:[\w]*)\n?([\s\S]*?)```$/);
  if (codeBlockMatch) {
    text = codeBlockMatch[1].trim();
  }
  const prefixes = [
    /^corrected text:\s*/i,
    /^here is the corrected text:\s*/i,
    /^the corrected text is:\s*/i,
    /^corrected:\s*/i,
    /^fixed:\s*/i,
    /^result:\s*/i,
  ];
  for (const p of prefixes) {
    text = text.replace(p, "");
  }
  text = text.trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    text = text.slice(1, -1);
  }
  return text.trim();
}

type GenerateResult =
  | { ok: true; raw: string }
  | { ok: false; error: GeminiApiError };

/**
 * Call Gemini generateContent. Returns raw text on success, or error details on failure.
 */
async function generateContent(
  apiKey: string,
  prompt: string,
  config: GeminiConfig = {}
): Promise<GenerateResult> {
  if (!apiKey.trim()) {
    return { ok: false, error: { status: 0, message: "No API key configured." } };
  }
  const model = config.model ?? DEFAULT_MODEL;
  const url = getUrl(model, apiKey);
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: config.temperature ?? 0.2,
      maxOutputTokens: config.maxOutputTokens ?? 1024,
    },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const resText = await res.text();

  if (!res.ok) {
    let code: number | undefined;
    let message = res.statusText || `HTTP ${res.status}`;
    try {
      const data = JSON.parse(resText);
      if (data?.error) {
        code = data.error.code;
        message = data.error.message ?? message;
      }
    } catch (_) {
      if (resText) message = resText.slice(0, 200);
    }
    const err: GeminiApiError = { status: res.status, code, message, statusText: res.statusText };
    console.error("[Gemini] API error:", err);
    return { ok: false, error: err };
  }

  let data: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  try {
    data = JSON.parse(resText);
  } catch (_) {
    return { ok: false, error: { status: res.status, message: "Invalid JSON response." } };
  }
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof raw !== "string") {
    return { ok: false, error: { status: res.status, message: "No text in response." } };
  }
  return { ok: true, raw };
}

export type FixCopyResult =
  | { ok: true; corrected: string; raw: string }
  | { ok: false; error: GeminiApiError };

export type FixCopyBatchResult =
  | { ok: true; corrected: string[] }
  | { ok: false; error: GeminiApiError };

/**
 * Extract JSON array of strings from model response (may be wrapped in markdown code block).
 */
function parseJsonStringArray(raw: string): string[] | null {
  let text = raw.trim();
  const codeBlockMatch = text.match(/^```(?:json)?\s*\n?([\s\S]*?)```$/);
  if (codeBlockMatch) text = codeBlockMatch[1].trim();
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return null;
    if (!parsed.every((x) => typeof x === "string")) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Initialised Gemini service object for use across any feature.
 */
export const geminiService = {
  get isConfigured(): boolean {
    return getApiKey().trim().length > 0;
  },

  /**
   * Fix grammar and punctuation for multiple texts in one API call (used by Copycat only).
   * Sends a JSON array of strings, expects a JSON array of corrected strings in the same order.
   */
  async fixGrammarAndPunctuationBatch(texts: string[]): Promise<FixCopyBatchResult> {
    if (texts.length === 0) {
      return { ok: true, corrected: [] };
    }
    const apiKey = getApiKey();
    if (!apiKey.trim()) {
      return { ok: false, error: { status: 0, message: "No API key configured." } };
    }
    const inputJson = JSON.stringify(texts);
    const prompt = `You are a copy editor. Fix only grammar and punctuation for each string in the following JSON array. Preserve meaning, tone, and formatting. Do not add or remove content except to fix grammar/punctuation. Keep the exact same order and array length.

Output rule: Reply with ONLY a valid JSON array of strings. No markdown, no explanation, no preamble. Example: ["corrected one", "corrected two"]

Input (JSON array of strings to fix):
${inputJson}`;
    const result = await generateContent(apiKey, prompt, {
      temperature: 0.2,
      maxOutputTokens: 8192,
    });
    if (!result.ok) return { ok: false, error: result.error };
    const corrected = parseJsonStringArray(result.raw);
    if (!corrected || corrected.length !== texts.length) {
      return {
        ok: false,
        error: {
          status: 200,
          message: `Expected JSON array of ${texts.length} strings. Got ${corrected?.length ?? 0}.`,
        },
      };
    }
    return { ok: true, corrected };
  },
};
