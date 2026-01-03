import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, UserProfile, Message } from '../types'; // ← TAMBAHIN Message DI SINI
import { ChatHeader } from './ChatHeader';
import { EmptyState } from './EmptyState';
import { MessageRow } from './MessageRow';
import { ChatInput } from './ChatInput';
import { ArtifactModal } from './ArtifactModal';
import { ImageViewerModal } from './ImageViewerModal';
import { LimitErrorModal } from './LimitErrorModal';
import { useChatLogic } from '../hooks/useChatLogic';

interface ChatInterfaceProps {
  session: ChatSession | null;
  profile: UserProfile;
  onUpdateMessages: (messages: Message[]) => void;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  checkImageLimit: () => boolean;
  incrementImageUsage: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  session, 
  profile,
  onUpdateMessages,
  onToggleSidebar,
  onNewChat,
  checkImageLimit,
  incrementImageUsage
}) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [limitError, setLimitError] = useState(false);
  const [artifactCode, setArtifactCode] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    activeMode,
    setActiveMode,
    cleanTextFromCode,
    handleSend: handleSendLogic
  } = useChatLogic(session, profile, onUpdateMessages, checkImageLimit, incrementImageUsage);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [session?.messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleToggleSave = (id: string) => {
    if (!session) return;
    const newMessages = session.messages.map(m => 
      m.id === id ? { ...m, isSaved: !m.isSaved } : m
    );
    onUpdateMessages(newMessages);
  };

  const handleDownloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `rival-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSend = () => {
    handleSendLogic(input, selectedImage, setInput, setSelectedImage, setLimitError);
  };

  const isDark = profile.theme === 'black' || profile.theme === 'slate';
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const assistantRowBg = profile.theme === 'black' ? 'bg-zinc-900/40' : 
                        profile.theme === 'slate' ? 'bg-zinc-800/40' : 
                        profile.theme === 'cream' ? 'bg-[#f5f1e8]' : 'bg-gray-50';

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-inherit">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Initializing Rival System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <ChatHeader 
        sessionTitle={session.title}
        isDark={isDark}
        onToggleSidebar={onToggleSidebar}
        onNewChat={onNewChat}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pt-2 pb-60">
        {session.messages.length === 0 ? (
          <EmptyState 
            aiAvatar={profile.aiAvatar}
            activeMode={activeMode}
            isDark={isDark}
            borderColor={borderColor}
          />
        ) : (
          <div className="flex flex-col">
            {session.messages.map((msg) => (
              <MessageRow 
                key={msg.id}
                message={msg}
                profile={profile}
                isDark={isDark}
                borderColor={borderColor}
                assistantRowBg={assistantRowBg}
                cleanTextFromCode={cleanTextFromCode}
                onCopy={handleCopy}
                onToggleSave={handleToggleSave}
                onDownloadImage={handleDownloadImage}
                onViewImage={setViewingImage}
                onOpenArtifact={setArtifactCode}
                copyFeedback={copyFeedback}
              />
            ))}
            {isLoading && (
              <div className={`w-full flex justify-center py-12 md:py-20 animate-pulse ${assistantRowBg}`}>
                <div className="w-full max-w-4xl flex gap-8 md:gap-12 px-6">
                  <div className="w-12 h-12 rounded-xl bg-current/5" />
                  <div className="flex-1 space-y-4">
                    <div className="h-3 w-24 bg-current/10 rounded" />
                    <div className="h-5 w-full bg-current/5 rounded" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput 
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        isDark={isDark}
        onSend={handleSend}
      />

      {limitError && (
        <LimitErrorModal 
          isDark={isDark}
          borderColor={borderColor}
          onClose={() => setLimitError(false)}
        />
      )}

      {artifactCode && (
        <ArtifactModal 
          code={artifactCode}
          onClose={() => setArtifactCode(null)}
        />
      )}

      {viewingImage && (
        <ImageViewerModal 
          imageUrl={viewingImage}
          onClose={() => setViewingImage(null)}
          onDownload={() => handleDownloadImage(viewingImage)}
        />
      )}
    </div>
  );
};
