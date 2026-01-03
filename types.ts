export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  imageUrls?: string[]; // Multiple images
  isImageEditing?: boolean;
  codeSnippet?: string;
  isSaved?: boolean;
  documentUrl?: string; // PDF/DOC
  mapData?: MapData; // Maps
  ebookData?: EbookData; // eBook
  sources?: WebSource[]; // Web search sources
}

export interface MapData {
  latitude: number;
  longitude: number;
  placeName: string;
  address: string;
  googleMapsUrl: string;
}

export interface EbookData {
  title: string;
  pages: {
    pageNumber: number;
    content: string;
    imageUrl?: string;
  }[];
}

export interface WebSource {
  title: string;
  url: string;
  snippet: string;
}

export type ConversationMode = 'general' | 'coding' | 'image' | 'document' | 'youtube' | 'websearch';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
  activeMode?: ConversationMode;
  isGroup?: boolean;
  groupName?: string;
  groupDescription?: string;
  groupMembers?: string[];
  groupInviteLink?: string;
}

export interface UserUsage {
  lastResetDate: string;
  imageCount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  aiAvatar: string;
  bio: string;
  joinedDate: string;
  theme: 'white' | 'black' | 'cream' | 'slate';
  font: 'inter' | 'serif' | 'mono' | 'modern';
  fontSize: number;
  aiName: string;
  aiPersona: string;
  isSubscribed: boolean;
  security: {
    twoFactor: boolean;
    encryptSessions: boolean;
    autoDelete: 'never' | '24h' | '30d';
  };
}
