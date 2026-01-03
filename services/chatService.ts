import { GenerateContentResponse } from "@google/genai";
import { apiKeyManager } from './apiKeyManager';
import { allFunctionDeclarations } from './functionDeclarations';

// ✅ Helper function langsung di sini (TIDAK PERLU folder utils/)
function cleanResponseParts(parts: any[]): any[] {
  return parts.map(part => {
    if (part.text) {
      // Hapus double asterisks untuk bold
      part.text = part.text.replace(/\*\*/g, '');
      // Bersihkan whitespace berlebih
      part.text = part.text.trim();
    }
    return part;
  });
}

// ✅ Helper function untuk handle error langsung di sini
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
