
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  isImageEditing?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
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
  aiName: string;
  aiPersona: string;
  security: {
    twoFactor: boolean;
    encryptSessions: boolean;
    autoDelete: 'never' | '24h' | '30d';
  };
}
