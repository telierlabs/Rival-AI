import React from 'react';
import { UserProfile } from '../types';
import { SubHeader } from './SubHeader';

interface ProfileAIViewProps {
  state: UserProfile;
  onUpdateState: (updated: UserProfile) => void;
  onBack: () => void;
  onAvatarClick: () => void;
}

export const ProfileAIView: React.FC<ProfileAIViewProps> = ({ 
  state, 
  onUpdateState, 
  onBack,
  onAvatarClick
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Identitas Rival" onBack={onBack} />
      <div className="space-y-10">
        <div className="flex flex-col gap-5">
          <img 
            src={state.aiAvatar} 
            className="w-32 h-32 rounded-[2.5rem] object-cover border border-current/10 shadow-2xl" 
            alt="AI" 
          />
          <button 
            onClick={onAvatarClick} 
            className="text-[10px] font-black uppercase tracking-widest text-left opacity-40 hover:opacity-100 transition-opacity"
          >
            Unggah Foto Rival Baru
          </button>
        </div>
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Nama Sistem</label>
            <input 
              type="text" 
              value={state.aiName}
              onChange={(e) => onUpdateState({ ...state, aiName: e.target.value })}
              className="w-full bg-current/[0.03] border-b border-current/10 py-3 focus:outline-none text-base font-black" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Persona & Instruksi</label>
            <textarea 
              rows={8}
              value={state.aiPersona}
              onChange={(e) => onUpdateState({ ...state, aiPersona: e.target.value })}
              className="w-full bg-current/[0.03] p-6 rounded-3xl border border-current/10 focus:outline-none text-sm font-medium leading-relaxed" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
