import React from 'react';
import { Message } from '../types';

interface MessageActionsProps {
  message: Message;
  isDark: boolean;
  copyFeedback: string | null;
  cleanTextFromCode: (text: string) => string;
  onCopy: (text: string, id: string) => void;
  onToggleSave: (id: string) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  message,
  isDark,
  copyFeedback,
  cleanTextFromCode,
  onCopy,
  onToggleSave
}) => {
  return (
    <div className="mt-6 flex items-center gap-4">
      <button 
        onClick={() => onCopy(message.role === 'assistant' ? cleanTextFromCode(message.content) : message.content, message.id)}
        className={`p-2 rounded-xl transition-all flex items-center gap-2 ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-widest">
          {copyFeedback === message.id ? 'Copied' : 'Salin'}
        </span>
      </button>

      {(message.imageUrl || message.codeSnippet) && (
        <button 
          onClick={() => onToggleSave(message.id)}
          className={`p-2 rounded-xl transition-all flex items-center gap-2 ${message.isSaved ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : (isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black')}`}
        >
          <svg className="w-4 h-4" fill={message.isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {message.isSaved ? 'Tersimpan' : 'Simpan Gallery'}
          </span>
        </button>
      )}
    </div>
  );
};
