export class YoutubeService {
  async summarizeVideo(url: string): Promise<string> {
    try {
      // Extract video ID from URL
      const videoId = this.extractVideoId(url);
      
      if (!videoId) {
        return "URL YouTube tidak valid. Mohon berikan URL yang benar.";
      }

      // Simulasi ringkasan (karena ga ada API YouTube Transcript)
      // Di production, gunakan API seperti youtube-transcript-api atau YouTube Data API
      
      return `Ringkasan Video YouTube (ID: ${videoId}):

Video ini membahas tentang topik yang relevan. Untuk mendapatkan ringkasan lengkap, silakan tonton video di: ${url}

Catatan: Fitur ringkasan otomatis sedang dalam pengembangan. Saat ini sistem hanya dapat mengidentifikasi video dan memberikan link akses.`;
    } catch (error) {
      console.error("YouTube Summary Error:", error);
      throw error;
    }
  }

  private extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }
}

export const youtubeService = new YoutubeService();
