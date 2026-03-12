import { GoogleGenAI } from "@google/genai";

export const getGeminiModel = (modelName: string = "gemini-3-flash-preview") => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
  }
  const ai = new GoogleGenAI({ apiKey });
  return ai;
};
