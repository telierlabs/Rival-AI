import { GenerateContentResponse } from "@google/genai";
import { apiKeyManager } from './apiKeyManager';
import { generateVisualFunction } from './functionDeclarations';
import { cleanResponseParts } from '../utils/textCleaner';
import { handleGeminiError } from '../utils/errorHandler';

export class ChatService {
  async chat(
    prompt: string, 
    history: { role: string; parts: { text: string }[] }[] = [], 
    systemInstruction: string
  ): Promise<GenerateContentResponse> {
    try {
      const ai = apiKeyManager.getRotatedAI();
      
      const finalInstruction = (systemInstruction || "You are Rival, a professional AI assistant.") + 
        "\nSTRICT RULE: Never use double asterisks (**) in your output. No markdown bolding allowed.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: finalInstruction,
          tools: [{ functionDeclarations: [generateVisualFunction] }],
        }
      });

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        candidate.content.parts = cleanResponseParts(candidate.content.parts);
      }

      return response;
    } catch (error) {
      return handleGeminiError(error, "Gemini Chat");
    }
  }
}

export const chatService = new ChatService();
