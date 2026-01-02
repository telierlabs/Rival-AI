import { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration } from "@google/genai";

// Variabel untuk melacak urutan rotasi key
let keyIndex = 0;

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
  /**
   * Mengambil API Key dari API_KEY_1, API_KEY_2, API_KEY_3 dan melakukan rotasi
   */
  private getRotatedAI(): GoogleGenAI {
    const key1 = process.env.API_KEY_1;
    const key2 = process.env.API_KEY_2;
    const key3 = process.env.API_KEY_3;
    
    const keys = [key1, key2, key3]
      .filter(k => k && k.trim().length > 0)
      .map(k => k!.trim());
    
    if (keys.length === 0) {
      throw new Error("API Key tidak ditemukan! Pastikan API_KEY_1, API_KEY_2, atau API_KEY_3 sudah di-set di environment variables.");
    }

    // Ambil key berdasarkan index saat ini
    const currentKey = keys[keyIndex % keys.length];
    
    // Geser index untuk request berikutnya
    keyIndex++;
    
    console.log(`Using API Key #${keyIndex} (Total: ${keys.length} keys available)`);
    
    return new GoogleGenAI({ apiKey: currentKey });
  }

  async chat(prompt: string, history: { role: string; parts: { text: string }[] }[] = [], systemInstruction: string) {
    try {
      const ai = this.getRotatedAI();
      
      const finalInstruction = (systemInstruction || "You are Rival, a professional AI assistant.") + 
        "\nSTRICT RULE: Never use double asterisks (**) in your output. No markdown bolding allowed.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: finalInstruction,
          tools: [{ functionDeclarations: [generateVisualFunction] }],
        }
      });

      // Post-processing: Bersihkan teks dari simbol ** secara aman
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        candidate.content.parts = candidate.content.parts.map(part => {
          if (part.text) {
            return { ...part, text: part.text.replace(/\*\*/g, '') };
          }
          return part;
        });
      }

      return response;
    } catch (error: any) {
      console.error("Gemini Chat Error:", {
        message: error?.message,
        status: error?.status,
        details: error
      });
      throw new Error(`Gemini Chat gagal: ${error?.message || 'Unknown error'}`);
    }
  }

  async generateImage(prompt: string) {
    try {
      const ai = this.getRotatedAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: {
          parts: [{ text: `Generate image: ${prompt}` }]
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
    } catch (error: any) {
      console.error("Gemini Image Generation Error:", {
        message: error?.message,
        status: error?.status,
        details: error
      });
      throw new Error(`Image generation gagal: ${error?.message || 'Unknown error'}`);
    }
  }

  async editImage(prompt: string, imageBase64: string) {
    try {
      const ai = this.getRotatedAI();
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
    } catch (error: any) {
      console.error("Gemini Image Edit Error:", {
        message: error?.message,
        status: error?.status,
        details: error
      });
      throw new Error(`Image edit gagal: ${error?.message || 'Unknown error'}`);
    }
  }
}

export const gemini = new GeminiService();
