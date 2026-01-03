export class DocumentService {
  async generateDocument(title: string, content: string, format: 'pdf' | 'doc'): Promise<string> {
    try {
      // Untuk PDF generation, bisa pakai library seperti jsPDF atau pdfmake
      // Untuk DOC, bisa pakai docx library
      
      // Saat ini return sebagai base64 data URL
      const blob = new Blob([content], { type: format === 'pdf' ? 'application/pdf' : 'application/msword' });
      const url = URL.createObjectURL(blob);
      
      return url;
    } catch (error) {
      console.error("Document Generation Error:", error);
      throw error;
    }
  }
}

export const documentService = new DocumentService();
