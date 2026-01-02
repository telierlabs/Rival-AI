geminiService.tsimport { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration } from "@google/genai";

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
   * Mengambil API Key yang tersedia dan melakukan rotasi jika ada lebih dari satu.
   * Disesuaikan untuk membaca API_KEY_1, API_KEY_2, dst sesuai di Vercel.
   */
  private getRotatedAI(): GoogleGenAI {
    // Mencari semua key di environment yang namanya diawali dengan API_KEY_
    const keys = Object.keys(process.env)
      .filter(key => key.startsWith('API_KEY_'))
      .map(key => process.env[key] || '')
      .filter(val => val.trim().length > 0);
    
    if (keys.length === 0) {
      throw new Error("API Key tidak ditemukan! Pastikan di Vercel sudah ada API_KEY_1, API_KEY_2, atau API_KEY_3.");
    }

    // Ambil key berdasarkan index rotasi saat ini
    const currentKey = keys[keyIndex % keys.length];
    
    // Geser index untuk request berikutnya
    keyIndex++;
    
    // Selalu buat instance baru untuk memastikan key yang digunakan adalah yang terbaru
    return new GoogleGenAI({ apiKey: currentKey });
  }

  async chat(prompt: string, history: { role: string; parts: { text: string }[] }[] = [], systemInstruction: string) {
    try {
      const ai = this.getRotatedAI();
      
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
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      throw error;
    }
  }

  async generateImage(prompt: string) {
    try {
      const ai = this.getRotatedAI();
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
            textResponse += part.text.replace(/\*\*/g, '');
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
      const ai = this.getRotatedAI();
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
            textResponse = part.text.replace(/\*\*/g, '');
          }
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
