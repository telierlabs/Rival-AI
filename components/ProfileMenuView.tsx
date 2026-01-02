import React from 'react';
import { UserProfile } from '../types';
import { MenuButton } from './MenuButton';

interface ProfileMenuViewProps {
  state: UserProfile;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const ProfileMenuView: React.FC<ProfileMenuViewProps> = ({ 
  state, 
  onNavigate, 
  onLogout 
}) => {
  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-400">
      <div className="flex items-center gap-6 py-10 mb-6 border-b border-current/10">
        <img 
          src={state.avatar} 
          className="w-20 h-20 rounded-3xl object-cover bg-current/5 shadow-xl border border-current/10" 
          alt="User" 
        />
        <div className="flex-1 min-w-0">
          <p className="text-xl font-black truncate tracking-tight">{state.name}</p>
          <p className="text-xs font-bold opacity-40 uppercase tracking-widest truncate">{state.email}</p>
        </div>
      </div>
      
      <MenuButton 
        title="Layanan Rival" 
        subtitle={state.isSubscribed ? "Status: Premium" : "Status: Gratis"} 
        onClick={() => onNavigate('subscription')} 
      />
      <MenuButton 
        title="Identitas Rival" 
        subtitle="Instruksi & Persona Sistem" 
        onClick={() => onNavigate('ai')} 
      />
      <MenuButton 
        title="Tema & Visual" 
        subtitle="Warna Antarmuka Monochrome" 
        onClick={() => onNavigate('style')} 
      />
      <MenuButton 
        title="Tipografi" 
        subtitle="Jenis & Ukuran Font Sistem" 
        onClick={() => onNavigate('font')} 
      />
      <MenuButton 
        title="Profil Pengguna" 
        subtitle="Informasi & Avatar Anda" 
        onClick={() => onNavigate('user')} 
      />
      <MenuButton 
        title="Keamanan & Privasi" 
        subtitle="Enkripsi & Manajemen Data" 
        onClick={() => onNavigate('security')} 
      />
      
      <div className="pt-8">
        <button 
          onClick={onLogout}
          className="w-full text-left py-6 px-6 text-red-500 opacity-60 hover:opacity-100 transition-opacity font-black uppercase text-[10px] tracking-[0.3em]"
        >
          Keluar dari Sesi
        </button>
      </div>
    </div>
  );
};
