import React from 'react';

interface EmptyStateProps {
  aiAvatar: string;
  activeMode: string;
  isDark: boolean;
  borderColor: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  aiAvatar, 
  activeMode, 
  isDark, 
  borderColor 
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
      <div className="mb-12">
        <img 
          src={aiAvatar} 
          className={`w-24 h-24 rounded-[2rem] shadow-2xl ${borderColor} border-2 object-cover p-1.5`} 
          alt="AI" 
        />
      </div>
      <h1 className={`text-4xl md:text-6xl font-black tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
        Ready.
      </h1>
      <p className="text-[11px] opacity-40 uppercase tracking-[0.6em] font-black">
        RIVAL {activeMode.toUpperCase()} ENGINE
      </p>
    </div>
  );
};
