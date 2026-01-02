import { apiKeyManager } from './apiKeyManager';
import { removeBoldMarkers } from '../utils/textCleaner';
import { handleGeminiError } from '../utils/errorHandler';

interface ImageEditResult {
  editedImageUrl: string | null;
  textResponse: string;
}

export class ImageEditService {
  async editImage(prompt: string, imageBase64: string): Promise<ImageEditResult> {
    try {
      const ai = apiKeyManager.getRotatedAI();
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: 'image/png',
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let editedImageUrl: string | null = null;
      let textResponse = "";

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            editedImageUrl = `data:image/png;base64,${base64Data}`;
          } else if (part.text) {
            textResponse = removeBoldMarkers(part.text);
          }
        }
      }

      return { editedImageUrl, textResponse };
    } catch (error) {
      return handleGeminiError(error, "Gemini Image Edit");
    }
  }
}

export const imageEditService = new ImageEditService();
