import React from 'react';

interface ToggleItemProps {
  title: string;
  subtitle: string;
  active: boolean;
  onToggle: () => void;
}

export const ToggleItem: React.FC<ToggleItemProps> = ({ title, subtitle, active, onToggle }) => (
  <div className="flex items-center justify-between p-6 rounded-3xl border border-current/10 bg-current/[0.02]">
    <div className="flex-1 pr-10">
      <p className="text-sm font-black uppercase mb-1">{title}</p>
      <p className="text-xs opacity-50">{subtitle}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`relative w-14 h-8 rounded-full transition-colors ${active ? 'bg-current' : 'bg-current/10'}`}
    >
      <div className={`absolute top-1 w-6 h-6 rounded-full bg-inherit invert transition-all ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);
