import { EbookData } from '../types';
import { apiKeyManager } from './apiKeyManager';

export class EbookService {
  async generateEbook(title: string, topic: string, pages: number): Promise<EbookData> {
    try {
      const maxPages = Math.min(pages, 10);
      const ai = apiKeyManager.getRotatedAI();
      
      const prompt = `Create a professional ${maxPages}-page eBook/playbook about "${topic}". 
      
      For each page, provide:
      1. Page number
      2. Content (detailed, informative, well-structured)
      3. Suggest an image description for visual enhancement
      
      Format your response as JSON with this structure:
      {
        "pages": [
          {
            "pageNumber": 1,
            "content": "Page content here...",
            "imageDescription": "Description of suggested image"
          }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const text = response.text || '';
      const cleanText = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanText);

      const ebookData: EbookData = {
        title,
        pages: data.pages.map((p: any) => ({
          pageNumber: p.pageNumber,
          content: p.content,
          imageUrl: undefined // Bisa di-generate nanti dengan AI image
        }))
      };

      return ebookData;
    } catch (error) {
      console.error("eBook Generation Error:", error);
      throw error;
    }
  }
}

export const ebookService = new EbookService();
