import { GenerateContentResponse } from "@google/genai";
import { chatService } from './chatService';
import { imageGenerationService } from './imageGenerationService';
import { imageEditService } from './imageEditService';

export class GeminiService {
  async chat(
    prompt: string, 
    history: { role: string; parts: { text: string }[] }[] = [], 
    systemInstruction: string
  ): Promise<GenerateContentResponse> {
    return chatService.chat(prompt, history, systemInstruction);
  }

  async generateImage(prompt: string) {
    return imageGenerationService.generateImage(prompt);
  }

  async editImage(prompt: string, imageBase64: string) {
    return imageEditService.editImage(prompt, imageBase64);
  }
}

export const gemini = new GeminiService();

export { generateVisualFunction } from './functionDeclarations';
