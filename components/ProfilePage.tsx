import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { ProfileMenuView } from './ProfileMenuView';
import { ProfileUserView } from './ProfileUserView';
import { ProfileAIView } from './ProfileAIView';
import { ProfileStyleView } from './ProfileStyleView';
import { ProfileFontView } from './ProfileFontView';
import { ProfileSecurityView } from './ProfileSecurityView';
import { ProfileSubscriptionView } from './ProfileSubscriptionView';

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
  onClearData: () => void;
  onLogout: () => void;
}

type SubPage = 'menu' | 'ai' | 'style' | 'font' | 'user' | 'security' | 'subscription';

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  profile, 
  onUpdateProfile, 
  onBack, 
  onClearData, 
  onLogout 
}) => {
  const [view, setView] = useState<SubPage>('menu');
  const [state, setState] = useState<UserProfile>(profile);
  const userFileRef = useRef<HTMLInputElement>(null);
  const aiFileRef = useRef<HTMLInputElement>(null);

  const handleSave = (updated: UserProfile) => {
    setState(updated);
    onUpdateProfile(updated);
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>, target: 'user' | 'ai') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newState = { ...state, [target === 'user' ? 'avatar' : 'aiAvatar']: base64 };
        handleSave(newState);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-inherit">
      <input 
        type="file" 
        ref={userFileRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => handleAvatar(e, 'user')} 
      />
      <input 
        type="file" 
        ref={aiFileRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => handleAvatar(e, 'ai')} 
      />
      
      <div className="max-w-3xl mx-auto px-8 py-16 md:py-24">
        <header className="mb-12 flex items-center gap-6">
          {view === 'menu' && (
            <button 
              onClick={onBack}
              className="p-3 -ml-3 hover:bg-current/5 rounded-full transition-all"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mb-1">Architecture</p>
            <h2 className="text-sm font-black uppercase tracking-[0.3em]">Pengaturan Rival</h2>
          </div>
        </header>

        {view === 'menu' && (
          <ProfileMenuView 
            state={state} 
            onNavigate={(v) => setView(v as SubPage)} 
            onLogout={onLogout} 
          />
        )}
        
        {view === 'user' && (
          <ProfileUserView 
            state={state} 
            onUpdateState={handleSave} 
            onBack={() => setView('menu')}
            onAvatarClick={() => userFileRef.current?.click()}
          />
        )}
        
        {view === 'ai' && (
          <ProfileAIView 
            state={state} 
            onUpdateState={handleSave} 
            onBack={() => setView('menu')}
            onAvatarClick={() => aiFileRef.current?.click()}
          />
        )}
        
        {view === 'style' && (
          <ProfileStyleView 
            state={state} 
            onUpdateState={handleSave} 
            onBack={() => setView('menu')}
          />
        )}
        
        {view === 'font' && (
          <ProfileFontView 
            state={state} 
            onUpdateState={handleSave} 
            onBack={() => setView('menu')}
          />
        )}
        
        {view === 'security' && (
          <ProfileSecurityView 
            state={state} 
            onUpdateState={handleSave} 
            onBack={() => setView('menu')}
            onClearData={onClearData}
          />
        )}
        
        {view === 'subscription' && (
          <ProfileSubscriptionView 
            state={state} 
            onBack={() => setView('menu')}
          />
        )}
      </div>
    </div>
  );
};
