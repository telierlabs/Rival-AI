import { GenerateContentResponse } from "@google/genai";
import { apiKeyManager } from './apiKeyManager';
import { allFunctionDeclarations } from './functionDeclarations';
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
        "\n\nYou have access to multiple capabilities:" +
        "\n- Generate images using generate_visual function" +
        "\n- Search web for latest information using search_web function" +
        "\n- Create PDF/DOC documents using generate_document function" +
        "\n- Summarize YouTube videos using summarize_youtube function" +
        "\n- Find locations and show maps using find_location function" +
        "\n- Generate eBooks/playbooks using generate_ebook function" +
        "\n\nSTRICT RULE: Never use double asterisks (**) in your output. No markdown bolding allowed." +
        "\n\nFor coding tasks, you can write code in ANY language: Python, JavaScript, TypeScript, React, Node.js, Java, C++, Go, Rust, etc. Always provide complete, production-ready code with proper structure and best practices.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: finalInstruction,
          tools: [{ functionDeclarations: allFunctionDeclarations }],
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
