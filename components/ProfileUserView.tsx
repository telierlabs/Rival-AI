import React from 'react';
import { UserProfile } from '../types';
import { SubHeader } from './SubHeader';

interface ProfileUserViewProps {
  state: UserProfile;
  onUpdateState: (updated: UserProfile) => void;
  onBack: () => void;
  onAvatarClick: () => void;
}

export const ProfileUserView: React.FC<ProfileUserViewProps> = ({ 
  state, 
  onUpdateState, 
  onBack,
  onAvatarClick
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Profil Pengguna" onBack={onBack} />
      <div className="space-y-10">
        <div className="flex flex-col gap-5">
          <img 
            src={state.avatar} 
            className="w-32 h-32 rounded-[2.5rem] object-cover border border-current/10 shadow-2xl" 
            alt="User" 
          />
          <button 
            onClick={onAvatarClick} 
            className="text-[10px] font-black uppercase tracking-widest text-left opacity-40 hover:opacity-100 transition-opacity"
          >
            Ganti Avatar
          </button>
        </div>
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Nama Lengkap</label>
            <input 
              type="text" 
              value={state.name}
              onChange={(e) => onUpdateState({ ...state, name: e.target.value })}
              className="w-full bg-current/[0.03] border-b border-current/10 py-3 focus:outline-none text-base font-black" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Bio Singkat</label>
            <input 
              type="text" 
              value={state.bio}
              onChange={(e) => onUpdateState({ ...state, bio: e.target.value })}
              className="w-full bg-current/[0.03] border-b border-current/10 py-3 focus:outline-none text-sm font-medium" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
