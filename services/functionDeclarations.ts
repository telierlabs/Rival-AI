import { Type, FunctionDeclaration } from "@google/genai";

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

export const searchWebFunction: FunctionDeclaration = {
  name: 'search_web',
  parameters: {
    type: Type.OBJECT,
    description: 'Mencari informasi terbaru di web dengan sumber yang valid.',
    properties: {
      query: {
        type: Type.STRING,
        description: 'Query pencarian untuk mencari informasi di web.',
      },
    },
    required: ['query'],
  },
};

export const generateDocumentFunction: FunctionDeclaration = {
  name: 'generate_document',
  parameters: {
    type: Type.OBJECT,
    description: 'Membuat dokumen PDF atau DOC berdasarkan konten yang diberikan.',
    properties: {
      title: {
        type: Type.STRING,
        description: 'Judul dokumen',
      },
      content: {
        type: Type.STRING,
        description: 'Konten lengkap dokumen dalam format markdown',
      },
      format: {
        type: Type.STRING,
        description: 'Format dokumen: pdf atau doc',
      },
    },
    required: ['title', 'content', 'format'],
  },
};

export const summarizeYoutubeFunction: FunctionDeclaration = {
  name: 'summarize_youtube',
  parameters: {
    type: Type.OBJECT,
    description: 'Meringkas video YouTube berdasarkan URL yang diberikan.',
    properties: {
      url: {
        type: Type.STRING,
        description: 'URL lengkap video YouTube',
      },
    },
    required: ['url'],
  },
};

export const findLocationFunction: FunctionDeclaration = {
  name: 'find_location',
  parameters: {
    type: Type.OBJECT,
    description: 'Mencari lokasi dan menampilkan peta.',
    properties: {
      query: {
        type: Type.STRING,
        description: 'Nama tempat atau alamat yang dicari',
      },
    },
    required: ['query'],
  },
};

export const generateEbookFunction: FunctionDeclaration = {
  name: 'generate_ebook',
  parameters: {
    type: Type.OBJECT,
    description: 'Membuat eBook atau playbook dengan maksimal 10 halaman.',
    properties: {
      title: {
        type: Type.STRING,
        description: 'Judul eBook',
      },
      topic: {
        type: Type.STRING,
        description: 'Topik atau tema eBook',
      },
      pages: {
        type: Type.NUMBER,
        description: 'Jumlah halaman (max 10)',
      },
    },
    required: ['title', 'topic', 'pages'],
  },
};

export const allFunctionDeclarations = [
  generateVisualFunction,
  searchWebFunction,
  generateDocumentFunction,
  summarizeYoutubeFunction,
  findLocationFunction,
  generateEbookFunction,
];
