import { apiKeyManager } from './apiKeyManager';

function handleGeminiError(error: any, context: string): never {
  console.error(`${context} Error:`, error);
  
  if (error?.message?.includes('API key')) {
    throw new Error('Invalid API key. Please check your configuration.');
  }
  
  if (error?.message?.includes('quota')) {
    throw new Error('API quota exceeded. Please try again later.');
  }
  
  if (error?.message?.includes('network')) {
    throw new Error('Network error. Please check your connection.');
  }
  
  throw new Error(`${context} failed: ${error?.message || 'Unknown error'}`);
}

interface ImageGenerationResult {
  generatedImageUrl: string | null;
  textResponse: string;
}

export class ImageGenerationService {
  async generateImage(prompt: string): Promise<ImageGenerationResult> {
    try {
      const ai = apiKeyManager.getRotatedAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', // ← INI YANG BENER!
        contents: {
          parts: [{ text: prompt }]
        }
      });

      let generatedImageUrl: string | null = null;
      let textResponse = "";

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            generatedImageUrl = `data:image/png;base64,${base64Data}`;
          } else if (part.text) {
            textResponse += part.text.replace(/\*\*/g, '');
          }
        }
      }

      return { generatedImageUrl, textResponse };
    } catch (error) {
      return handleGeminiError(error, "Gemini Image Generation");
    }
  }
}

export const imageGenerationService = new ImageGenerationService();
