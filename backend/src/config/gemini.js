import { GoogleGenAI } from "@google/genai";
import env from "./env.js";

// Single shared Gemini client instance, consumed by services/ai.service.js.
// Kept isolated here so the SDK is never imported directly in controllers.
export const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const GEMINI_MODEL = env.GEMINI_MODEL;
