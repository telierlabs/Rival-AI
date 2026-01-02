import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { ProfilePage } from './components/ProfilePage';
import { GalleryPage } from './components/GalleryPage';
import { LoginPage } from './components/LoginPage';
import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';
import { useImageUsage } from './hooks/useImageUsage';
import { useSessions } from './hooks/useSessions';
import { useTabNavigation } from './hooks/useTabNavigation';

const App: React.FC = () => {
  const { isLoggedIn, handleLogin, handleLogout } = useAuth();
  const { userProfile, setUserProfile } = useUserProfile();
  const { checkImageLimit, incrementImageUsage } = useImageUsage(userProfile.isSubscribed);
  const {
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    currentSession,
    createNewChat,
    updateSessionMessages,
    deleteSession,
    clearAllData
  } = useSessions();
  const { activeTab, setActiveTab } = useTabNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

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
