import React from 'react';
import { format } from 'date-fns';
import { Message, UserProfile } from '../types';
import { MessageActions } from './MessageActions';
import { ArtifactCard } from './ArtifactCard';
import { ImageDisplay } from './ImageDisplay';
import { MapDisplay } from './MapDisplay';
import { EbookViewer } from './EbookViewer';
import { WebSourcesDisplay } from './WebSourcesDisplay';

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
          
          {/* Multiple Images Display */}
          {msg.imageUrls && msg.imageUrls.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {msg.imageUrls.map((url, idx) => (
                <div key={idx} className="cursor-zoom-in" onClick={() => onViewImage(url)}>
                  <img 
                    src={url} 
                    className="rounded-2xl border border-current/10 shadow-xl w-full h-32 object-cover" 
                    alt={`Image ${idx + 1}`} 
                  />
                </div>
              ))}
            </div>
          )}

          {/* Code Artifact */}
          {msg.role === 'assistant' && msg.codeSnippet && (
            <ArtifactCard 
              code={msg.codeSnippet}
              timestamp={msg.timestamp}
              isDark={isDark}
              borderColor={borderColor}
              onOpen={() => onOpenArtifact(msg.codeSnippet!)}
            />
          )}

          {/* Single Image */}
          {msg.imageUrl && (
            <ImageDisplay 
              imageUrl={msg.imageUrl}
              borderColor={borderColor}
              onView={() => onViewImage(msg.imageUrl!)}
              onDownload={() => onDownloadImage(msg.imageUrl!)}
            />
          )}

          {/* Map Display */}
          {msg.mapData && (
            <MapDisplay mapData={msg.mapData} isDark={isDark} />
          )}

          {/* eBook Viewer */}
          {msg.ebookData && (
            <EbookViewer ebookData={msg.ebookData} isDark={isDark} />
          )}

          {/* Web Sources */}
          {msg.sources && msg.sources.length > 0 && (
            <WebSourcesDisplay sources={msg.sources} isDark={isDark} />
          )}

          {/* Document Download */}
          {msg.documentUrl && (
            <div className="mt-6">
              <a 
                href={msg.documentUrl} 
                download
                className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Dokumen
              </a>
            </div>
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
