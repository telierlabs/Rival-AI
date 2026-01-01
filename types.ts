
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  isImageEditing?: boolean;
  codeSnippet?: string;
  isSaved?: boolean;
}

export type ConversationMode = 'general' | 'coding' | 'image';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
  activeMode?: ConversationMode;
}

export interface UserUsage {
  lastResetDate: string; // YYYY-MM-DD
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
