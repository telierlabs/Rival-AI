import React from 'react';
import { UserProfile } from '../types';
import { SubHeader } from './SubHeader';

interface ProfileStyleViewProps {
  state: UserProfile;
  onUpdateState: (updated: UserProfile) => void;
  onBack: () => void;
}

export const ProfileStyleView: React.FC<ProfileStyleViewProps> = ({ 
  state, 
  onUpdateState, 
  onBack 
}) => {
  const themes: UserProfile['theme'][] = ['white', 'black', 'cream', 'slate'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Tema & Visual" onBack={onBack} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map(t => (
          <button 
            key={t}
            onClick={() => onUpdateState({ ...state, theme: t })}
            className={`p-10 border rounded-[2.5rem] text-left transition-all ${state.theme === t ? 'border-current bg-current/5 ring-1 ring-current' : 'border-current/10 opacity-40 hover:opacity-100'}`}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-1">{t}</p>
            <p className="text-[10px] opacity-40 uppercase tracking-widest">
              {t === 'black' ? 'Pure Monochrome' : 'Visual Balanced'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
