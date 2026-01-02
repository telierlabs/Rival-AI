export const IMAGE_LIMIT = 20;

export const DEFAULT_USER_PROFILE = {
  name: "User Instance",
  email: "user@rival.studio",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
  aiAvatar: "https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=100",
  bio: "Rival Intelligence Architect.",
  theme: 'white',
  font: 'inter',
  fontSize: 16,
  aiName: 'Rival',
  aiPersona: 'You are Rival, a professional and elegant AI assistant. IMPORTANT: Never use double asterisks (**) for bolding. Always respond in clean plain text without any markdown bold markers.',
  isSubscribed: false,
  security: {
    twoFactor: false,
    encryptSessions: true,
    autoDelete: 'never'
  }
};

export const STORAGE_KEYS = {
  AUTH_STATUS: 'rival_auth_status',
  PROFILE: 'nova_profile',
  SESSIONS: 'nova_sessions',
  USAGE: 'rival_usage'
};
