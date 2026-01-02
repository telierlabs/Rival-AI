import { apiKeyManager } from './apiKeyManager';
import { removeBoldMarkers } from '../utils/textCleaner';
import { handleGeminiError } from '../utils/errorHandler';

interface ImageGenerationResult {
  generatedImageUrl: string | null;
  textResponse: string;
}

export class ImageGenerationService {
  async generateImage(prompt: string): Promise<ImageGenerationResult> {
    try {
      const ai = apiKeyManager.getRotatedAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
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
            textResponse += removeBoldMarkers(part.text);
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
