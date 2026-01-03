import React, { useState, useRef, useEffect } from 'react';
import { ConversationMode } from '../types';

interface ModeSelectorProps {
  activeMode: ConversationMode;
  setActiveMode: (mode: ConversationMode) => void;
  isDark: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  activeMode,
  setActiveMode,
  isDark
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-100';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className={`p-3.5 rounded-2xl transition-all ${showMenu ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black')}`}
      >
        <span className="text-lg">✨</span>
      </button>
      
      {showMenu && (
        <div className={`absolute bottom-full left-0 mb-4 w-72 rounded-3xl border ${borderColor} ${isDark ? 'bg-zinc-950 shadow-black shadow-2xl' : 'bg-white shadow-xl'} overflow-hidden p-2 z-50 animate-in fade-in slide-in-from-bottom-4 max-h-96 overflow-y-auto`}>
          <ModeOption 
            icon="💻" 
            title="Programmer Pro" 
            desc="Koding Multi-Bahasa" 
            active={activeMode === 'coding'} 
            onClick={() => { setActiveMode('coding'); setShowMenu(false); }} 
            isDark={isDark} 
          />
          <ModeOption 
            icon="🎨" 
            title="Visualizer" 
            desc="Kreasi Gambar AI" 
            active={activeMode === 'image'} 
            onClick={() => { setActiveMode('image'); setShowMenu(false); }} 
            isDark={isDark} 
          />
          <ModeOption 
            icon="🌐" 
            title="Web Search" 
            desc="Cari Info Terbaru" 
            active={activeMode === 'websearch'} 
            onClick={() => { setActiveMode('websearch'); setShowMenu(false); }} 
            isDark={isDark} 
          />
          <ModeOption 
            icon="📹" 
            title="YouTube Summary" 
            desc="Ringkas Video YT" 
            active={activeMode === 'youtube'} 
            onClick={() => { setActiveMode('youtube'); setShowMenu(false); }} 
            isDark={isDark} 
          />
          <ModeOption 
            icon="📄" 
            title="Document Maker" 
            desc="Bikin PDF/DOC" 
            active={activeMode === 'document'} 
            onClick={() => { setActiveMode('document'); setShowMenu(false); }} 
            isDark={isDark} 
          />
          <div className="h-px bg-current/5 my-1" />
          <ModeOption 
            icon="💬" 
            title="General Chat" 
            desc="Percakapan Normal" 
            active={activeMode === 'general'} 
            onClick={() => { setActiveMode('general'); setShowMenu(false); }} 
            isDark={isDark} 
          />
        </div>
      )}
    </div>
  );
};

const ModeOption: React.FC<{ 
  icon: string; 
  title: string; 
  desc: string; 
  active: boolean; 
  onClick: () => void; 
  isDark: boolean 
}> = ({ icon, title, desc, active, onClick, isDark }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? (isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black') : 'hover:bg-current/5 opacity-60'}`}
  >
    <span className="text-2xl">{icon}</span>
    <div className="text-left flex-1">
      <p className="text-xs font-black uppercase tracking-tight">{title}</p>
      <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">{desc}</p>
    </div>
  </button>
);
