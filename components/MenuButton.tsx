import React from 'react';

interface MenuButtonProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ title, subtitle, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full text-left py-10 px-6 hover:bg-current/[0.02] border-b border-current/5 transition-all flex justify-between items-center group"
  >
    <div>
      <p className="text-base font-black tracking-tight uppercase mb-1.5">{title}</p>
      <p className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">{subtitle}</p>
    </div>
    <svg className="w-6 h-6 opacity-10 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);
