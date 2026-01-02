import React from 'react';

interface BenefitItemProps {
  text: string;
}

export const BenefitItem: React.FC<BenefitItemProps> = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-current/5 flex items-center justify-center">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{text}</span>
  </div>
);
