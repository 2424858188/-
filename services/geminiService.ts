import { GoogleGenAI } from '@google/genai';
import { CelestialBody } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCelestialInfo = async (body: CelestialBody): Promise<string> => {
  const prompt = `
    Provide a brief, engaging astronomical summary for the celestial body named "${body.name}" (Chinese name: ${body.cnName || 'Unknown'}). 
    If it is a planet, mention its key characteristic. 
    If it is a star, mention its constellation, color, and if it has any mythological significance.
    Keep it under 80 words. Plain text only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Data transmission from deep space failed.";
  } catch (error) {
    console.error("Gemini transmission error:", error);
    return "Unable to retrieve deep space telemetry.";
  }
};
