import React from 'react';

interface SubHeaderProps {
  title: string;
  onBack: () => void;
}

export const SubHeader: React.FC<SubHeaderProps> = ({ title, onBack }) => (
  <div className="flex items-center gap-6 py-4 mb-12 border-b border-current/10">
    <button 
      onClick={onBack}
      className="p-3 -ml-3 hover:bg-current/5 rounded-full transition-all"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <h3 className="text-xs font-black uppercase tracking-[0.3em]">{title}</h3>
  </div>
);
