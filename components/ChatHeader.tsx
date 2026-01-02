import React from 'react';

interface ChatHeaderProps {
  sessionTitle: string;
  isDark: boolean;
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  sessionTitle, 
  isDark, 
  onToggleSidebar, 
  onNewChat 
}) => {
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-100';

  return (
    <header className={`h-16 border-b ${borderColor} flex items-center justify-between px-4 md:px-8 gap-4 sticky top-0 bg-inherit/95 backdrop-blur-xl z-20`}>
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <button 
          onClick={onToggleSidebar} 
          className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className="flex items-center gap-4 min-w-0">
          <h2 className={`text-sm font-black truncate uppercase ${isDark ? 'text-white' : 'text-black'}`}>
            {sessionTitle}
          </h2>
        </div>
      </div>
      <button 
        onClick={onNewChat} 
        className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </header>
  );
};
