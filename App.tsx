
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { ProfilePage } from './components/ProfilePage';
import { GalleryPage } from './components/GalleryPage';
import { ChatSession, Message, UserProfile, UserUsage } from './types';
import { format } from 'date-fns';

const IMAGE_LIMIT = 20; // Default limit based on the free card description

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('rival_auth_status') === 'true';
  });
  
  const [activeTab, setActiveTab] = useState<'chat' | 'profile' | 'gallery'>('chat');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nova_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        isSubscribed: parsed.isSubscribed || false
      };
    }
    return {
      name: "User Instance",
      email: "user@rival.studio",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      aiAvatar: "https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=100",
      bio: "Rival Intelligence Architect.",
      joinedDate: format(new Date(), 'MMMM yyyy'),
      theme: 'white', // Default to white as requested for login page look
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
  });

  const [usage, setUsage] = useState<UserUsage>(() => {
    const saved = localStorage.getItem('rival_usage');
    const today = format(new Date(), 'yyyy-MM-dd');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.lastResetDate !== today) {
        return { lastResetDate: today, imageCount: 0 };
      }
      return parsed;
    }
    return { lastResetDate: today, imageCount: 0 };
  });

  useEffect(() => {
    localStorage.setItem('rival_usage', JSON.stringify(usage));
  }, [usage]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${userProfile.fontSize}px`;
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
        createNewChat();
      }
    } else {
      createNewChat();
    }
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

  const checkImageLimit = useCallback(() => {
    if (userProfile.isSubscribed) return true;
    const today = format(new Date(), 'yyyy-MM-dd');
    if (usage.lastResetDate !== today) {
      setUsage({ lastResetDate: today, imageCount: 0 });
      return true;
    }
    return usage.imageCount < IMAGE_LIMIT;
  }, [usage, userProfile.isSubscribed]);

  const incrementImageUsage = useCallback(() => {
    if (userProfile.isSubscribed) return;
    setUsage(prev => ({ ...prev, imageCount: prev.imageCount + 1 }));
  }, [userProfile.isSubscribed]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('rival_auth_status', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('rival_auth_status');
  };

  if (!isLoggedIn) {
    return (
      <div className={`flex h-screen items-center justify-center theme-white font-inter bg-white`}>
        <div className="max-w-md w-full p-12 text-center animate-in fade-in zoom-in duration-700">
           <div className="flex items-center justify-center gap-3 mb-6">
             <h1 className="text-6xl font-black tracking-tighter text-black">RIVAL</h1>
             <span className="bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mt-2">BETA</span>
           </div>
           
           <p className="text-[11px] font-black uppercase tracking-[0.5em] text-black/40 mb-10">Neural Intelligence Assistant</p>
           
           <div className="mb-14 space-y-4 text-left border-l-2 border-black/5 pl-8">
             <div className="flex items-start gap-4">
               <span className="text-lg">✨</span>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-black">Generative Visuals</p>
                 <p className="text-[11px] text-black/40 font-medium leading-relaxed">Hasilkan gambar berkualitas tinggi secara instan.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <span className="text-lg">💻</span>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-black">Code Artifacts</p>
                 <p className="text-[11px] text-black/40 font-medium leading-relaxed">Bangun aplikasi web langsung dari dalam chat.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <span className="text-lg">🧠</span>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-black">Advanced Reasoning</p>
                 <p className="text-[11px] text-black/40 font-medium leading-relaxed">Percakapan natural dengan model AI tercanggih.</p>
               </div>
             </div>
           </div>
           
           <button 
             onClick={handleLogin}
             className="w-full py-5 rounded-[2rem] bg-black text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20"
           >
             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12.48 10.92v3.28h7.84c-.24 1.84-1.92 5.36-7.84 5.36-5.12 0-9.28-4.24-9.28-9.52s4.16-9.52 9.28-9.52c2.92 0 4.88 1.24 6 2.32l2.6-2.6C19.12 1.12 16 0 12.48 0 5.56 0 0 5.56 0 12.5s5.56 12.5 12.48 12.5c7.24 0 12.04-5.12 12.04-12.28 0-.84-.08-1.48-.2-2.12h-11.84z"/>
             </svg>
             Masuk dengan Google
           </button>
           
           <div className="mt-12 space-y-2">
             <p className="text-[9px] opacity-20 uppercase font-black tracking-widest">Powered by Rival Neural Engine v1.0</p>
             <p className="text-[8px] opacity-10 uppercase font-bold tracking-[0.2em]">© 2025 RIVAL STUDIO. SEMUA HAK DILINDUNGI.</p>
           </div>
        </div>
      </div>
    );
  }

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
        onGalleryClick={() => setActiveTab('gallery')}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-inherit">
        {activeTab === 'chat' ? (
          <ChatInterface 
            key={currentSessionId || 'empty'}
            session={currentSession}
            profile={userProfile}
            onUpdateMessages={(msgs) => currentSessionId && updateSessionMessages(currentSessionId, msgs)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onNewChat={createNewChat}
            checkImageLimit={checkImageLimit}
            incrementImageUsage={incrementImageUsage}
          />
        ) : activeTab === 'profile' ? (
          <ProfilePage 
            profile={userProfile} 
            onUpdateProfile={setUserProfile}
            onBack={() => setActiveTab('chat')}
            onClearData={clearAllData}
            onLogout={handleLogout}
          />
        ) : (
          <GalleryPage 
            sessions={sessions}
            profile={userProfile}
            onBack={() => setActiveTab('chat')}
            onUpdateSessions={setSessions}
          />
        )}
      </main>
    </div>
  );
};

export default App;
