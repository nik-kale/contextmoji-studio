
import { GoogleGenAI, Type } from "@google/genai";
import { Platform, GeminiResponse } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const processTextWithEmoji = async (
  text: string,
  platform: Platform,
  emojiCount: number
): Promise<GeminiResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert social media copywriter for ${platform}.
    
    TASK:
    1. Take the provided text and insert EXACTLY ${emojiCount} emojis into it.
    2. The placement must feel natural and match the professional/casual tone of ${platform}.
    3. For LinkedIn: Use professional, non-face emojis (e.g., 🚀, 📈, ✅, 💡).
    4. For X/Threads: Use high-energy, trending emojis.
    5. Provide 2 variations of the text rewritten to be more viral/engaging for ${platform}, also using EXACTLY ${emojiCount} emojis.

    INPUT TEXT: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalWithEmoji: { type: Type.STRING },
          variations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["text", "explanation"]
            }
          },
          platformAdvice: { type: Type.STRING },
          emojiCountUsed: { type: Type.INTEGER }
        },
        required: ["originalWithEmoji", "variations", "platformAdvice", "emojiCountUsed"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as GeminiResponse;
};
