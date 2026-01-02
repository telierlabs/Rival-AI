import React from 'react';
import { format } from 'date-fns';
import { Message, UserProfile } from '../types';
import { MessageActions } from './MessageActions';
import { ArtifactCard } from './ArtifactCard';
import { ImageDisplay } from './ImageDisplay';

interface MessageRowProps {
  message: Message;
  profile: UserProfile;
  isDark: boolean;
  borderColor: string;
  assistantRowBg: string;
  cleanTextFromCode: (text: string) => string;
  onCopy: (text: string, id: string) => void;
  onToggleSave: (id: string) => void;
  onDownloadImage: (url: string) => void;
  onViewImage: (url: string) => void;
  onOpenArtifact: (code: string) => void;
  copyFeedback: string | null;
}

export const MessageRow: React.FC<MessageRowProps> = ({
  message,
  profile,
  isDark,
  borderColor,
  assistantRowBg,
  cleanTextFromCode,
  onCopy,
  onToggleSave,
  onDownloadImage,
  onViewImage,
  onOpenArtifact,
  copyFeedback
}) => {
  const msg = message;

  return (
    <div className={`w-full flex justify-center py-10 md:py-16 border-b ${borderColor} ${msg.role === 'assistant' ? assistantRowBg : 'bg-transparent'}`}>
      <div className="w-full max-w-4xl flex gap-6 md:gap-10 px-6">
        <div className="flex-shrink-0">
          <img 
            src={msg.role === 'assistant' ? profile.aiAvatar : profile.avatar} 
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-sm ${borderColor} border`} 
            alt={msg.role} 
          />
        </div>
        
        <div className="flex-1 min-w-0 pt-1">
          <div className="mb-3 flex items-center gap-4">
            <span className={`text-xs font-black uppercase tracking-[0.2em] opacity-60`}>
              {msg.role === 'assistant' ? profile.aiName : 'Anda'}
            </span>
            <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
              {format(msg.timestamp, 'eeee, dd MMM yyyy · HH:mm')}
            </span>
          </div>
          
          <div className={`text-base md:text-lg leading-[1.8] font-medium whitespace-pre-wrap ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
            {msg.role === 'assistant' ? cleanTextFromCode(msg.content) : msg.content}
          </div>
          
          {msg.role === 'assistant' && msg.codeSnippet && (
            <ArtifactCard 
              code={msg.codeSnippet}
              timestamp={msg.timestamp}
              isDark={isDark}
              borderColor={borderColor}
              onOpen={() => onOpenArtifact(msg.codeSnippet!)}
            />
          )}

          {msg.imageUrl && (
            <ImageDisplay 
              imageUrl={msg.imageUrl}
              borderColor={borderColor}
              onView={() => onViewImage(msg.imageUrl!)}
              onDownload={() => onDownloadImage(msg.imageUrl!)}
            />
          )}

          <MessageActions 
            message={msg}
            isDark={isDark}
            copyFeedback={copyFeedback}
            cleanTextFromCode={cleanTextFromCode}
            onCopy={onCopy}
            onToggleSave={onToggleSave}
          />
        </div>
      </div>
    </div>
  );
};
