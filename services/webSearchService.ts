import { WebSource } from '../types';

export class WebSearchService {
  async searchWeb(query: string): Promise<{ sources: WebSource[]; summary: string }> {
    try {
      // Simulasi web search (karena ga ada API key Google Search)
      // Di production, ganti dengan real API seperti Serper, Bing, atau Google Custom Search
      
      const mockSources: WebSource[] = [
        {
          title: `Hasil pencarian untuk: ${query}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Informasi terkait ${query} dari berbagai sumber terpercaya.`
        }
      ];

      const summary = `Berdasarkan pencarian web tentang "${query}", berikut informasi yang ditemukan dari sumber-sumber terpercaya.`;

      return { sources: mockSources, summary };
    } catch (error) {
      console.error("Web Search Error:", error);
      throw error;
    }
  }
}

export const webSearchService = new WebSearchService();
