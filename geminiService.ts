
import { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateVisualFunction: FunctionDeclaration = {
  name: 'generate_visual',
  parameters: {
    type: Type.OBJECT,
    description: 'Fungsi untuk menghasilkan gambar atau visual baru berdasarkan deskripsi teks.',
    properties: {
      prompt: {
        type: Type.STRING,
        description: 'Deskripsi detail tentang gambar yang ingin dibuat.',
      },
    },
    required: ['prompt'],
  },
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async chat(prompt: string, history: { role: string; parts: { text: string }[] }[] = [], systemInstruction: string) {
    try {
      // Menggunakan instance baru setiap kali untuk memastikan API Key terbaru digunakan
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: systemInstruction || "You are Rival, a professional AI assistant.",
          tools: [{ functionDeclarations: [generateVisualFunction] }],
        }
      });

      return response;
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      throw error;
    }
  }

  async generateImage(prompt: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || API_KEY });
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
            generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            textResponse += part.text;
          }
        }
      }

      return { generatedImageUrl, textResponse };
    } catch (error) {
      console.error("Gemini Image Generation Error:", error);
      throw error;
    }
  }

  async editImage(prompt: string, imageBase64: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || API_KEY });
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

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          editedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
        } else if (part.text) {
          textResponse = part.text;
        }
      }

      return { editedImageUrl, textResponse };
    } catch (error) {
      console.error("Gemini Image Edit Error:", error);
      throw error;
    }
  }
}

export const gemini = new GeminiService();
