import { apiKeyManager } from './apiKeyManager';

// ✅ Helper function langsung di sini
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
        model: 'gemini-2.0-flash-exp',
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
            textResponse = part.text.replace(/\*\*/g, '');
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
