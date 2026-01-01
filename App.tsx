
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { ProfilePage } from './components/ProfilePage';
import { ChatSession, Message, UserProfile } from './types';
import { format } from 'date-fns';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'profile'>('chat');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nova_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old profiles to include security
      if (!parsed.security) {
        parsed.security = { twoFactor: false, encryptSessions: true, autoDelete: 'never' };
      }
      return parsed;
    }
    return {
      name: "User Instance",
      email: "user@rival.studio",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      aiAvatar: "https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=100",
      bio: "Rival Intelligence Architect.",
      joinedDate: format(new Date(), 'MMMM yyyy'),
      theme: 'black',
      font: 'inter',
      aiName: 'Rival',
      aiPersona: 'You are Rival, a professional and elegant AI assistant. Your responses should be helpful, sophisticated, and concise.',
      security: {
        twoFactor: false,
        encryptSessions: true,
        autoDelete: 'never'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('nova_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    const saved = localStorage.getItem('nova_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hydrated = parsed.map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
        setSessions(hydrated);
        if (hydrated.length > 0) {
          setCurrentSessionId(hydrated[0].id);
        } else {
          createNewChat();
        }
      } catch (e) {
        console.error("Hydration error", e);
        createNewChat();
      }
    } else {
      createNewChat();
    }
    setActiveTab('chat');
  }, []);

  useEffect(() => {
    localStorage.setItem('nova_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: "Sesi Baru",
      messages: [],
      updatedAt: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setActiveTab('chat');
  };

  const updateSessionMessages = (id: string, newMessages: Message[]) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        let title = s.title;
        if ((title === "Sesi Baru" || title === "New Session") && newMessages.length > 0) {
          title = newMessages[0].content.slice(0, 30).toUpperCase() + (newMessages[0].content.length > 30 ? "..." : "");
        }
        return { ...s, messages: newMessages, updatedAt: new Date(), title };
      }
      return s;
    }));
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (currentSessionId === id) {
      setCurrentSessionId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const clearAllData = () => {
    setSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem('nova_sessions');
    createNewChat();
  };

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  return (
    <div className={`flex h-screen overflow-hidden theme-${userProfile.theme} font-${userProfile.font} transition-colors duration-500`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        sessions={sessions}
        activeSessionId={currentSessionId}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setActiveTab('chat');
        }}
        onNewChat={createNewChat}
        onDeleteSession={deleteSession}
        userProfile={userProfile}
        onProfileClick={() => setActiveTab('profile')}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-inherit">
        {activeTab === 'chat' ? (
          <ChatInterface 
            session={currentSession}
            profile={userProfile}
            onUpdateMessages={(msgs) => currentSessionId && updateSessionMessages(currentSessionId, msgs)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        ) : (
          <ProfilePage 
            profile={userProfile} 
            onUpdateProfile={setUserProfile}
            onBack={() => setActiveTab('chat')}
            onClearData={clearAllData}
          />
        )}
      </main>
    </div>
  );
};

export default App;
