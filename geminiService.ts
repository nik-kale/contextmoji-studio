
import { GoogleGenAI, Type } from "@google/genai";
import { Platform, GeminiResponse, ImageStyle, ImageSize, ColorPalette, AspectRatio, TextDensity } from "./types";

export const processTextWithEmoji = async (
  text: string,
  platform: Platform,
  emojiCount: number,
  textDensity: TextDensity
): Promise<GeminiResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert social media copywriter for ${platform}.
    
    TASK:
    1. Take the provided text and insert EXACTLY ${emojiCount} emojis into it.
    2. Adjust text density to be: ${textDensity}.
       - Concise: Strip filler words, focus on ultra-punchy hooks, keep it under 200 characters if possible.
       - Balanced: Maintain original meaning but polish for readability and flow.
       - Detailed: Expand slightly on key points for depth, better for platforms like LinkedIn.
    3. Place emojis naturally (end of sentences or as line-starters for list items).
    4. Provide 2 additional creative rewrites that adapt the core message for ${platform}.

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

export const generatePostImageVariation = async (
  postText: string,
  style: ImageStyle,
  size: ImageSize,
  palette: ColorPalette,
  aspectRatio: AspectRatio,
  customHex?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const paletteDescription = palette === ColorPalette.CUSTOM && customHex 
    ? `strictly using the hex color ${customHex}` 
    : `following a ${palette} color scheme`;

  const prompt = `Create a high-quality ${style} visual for this social post: "${postText}".
  Design parameters: 
  - Style: ${style}
  - Palette: ${paletteDescription}
  - Resolution requirement: High fidelity, professional lighting/textures.
  ${style === ImageStyle.INFOGRAPHIC ? 'Focus on data-driven design elements.' : ''}
  Do not include generic stock characters; aim for bespoke digital art.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size as any,
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Variation failed. Ensure your API Key is correctly set.");
};
