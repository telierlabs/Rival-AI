
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
  onClearData: () => void;
}

type SubPage = 'menu' | 'ai' | 'style' | 'font' | 'user' | 'security';

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onUpdateProfile, onBack, onClearData }) => {
  const [view, setView] = useState<SubPage>('menu');
  const [state, setState] = useState<UserProfile>(profile);
  const userFileRef = useRef<HTMLInputElement>(null);
  const aiFileRef = useRef<HTMLInputElement>(null);

  const handleSave = (updated: UserProfile) => {
    onUpdateProfile(updated);
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>, target: 'user' | 'ai') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newState = { ...state, [target === 'user' ? 'avatar' : 'aiAvatar']: base64 };
        setState(newState);
        handleSave(newState);
      };
      reader.readAsDataURL(file);
    }
  };

  const themes: UserProfile['theme'][] = ['white', 'black', 'cream', 'slate'];
  const fonts: UserProfile['font'][] = ['inter', 'modern', 'serif', 'mono'];

  const renderMenu = () => (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-400">
      <div className="flex items-center gap-6 py-10 mb-6 border-b border-current/10">
        <img src={state.avatar} className="w-20 h-20 rounded-3xl object-cover bg-current/5 shadow-xl border border-current/10" />
        <div className="flex-1 min-w-0">
          <p className="text-xl font-black truncate tracking-tight">{state.name}</p>
          <p className="text-xs font-bold opacity-40 uppercase tracking-widest truncate">{state.email}</p>
        </div>
      </div>
      
      <MenuBtn title="Identitas Rival" subtitle="Instruksi & Persona Sistem" onClick={() => setView('ai')} />
      <MenuBtn title="Tema & Visual" subtitle="Warna Antarmuka Monochrome" onClick={() => setView('style')} />
      <MenuBtn title="Tipografi" subtitle="Jenis & Ukuran Font Sistem" onClick={() => setView('font')} />
      <MenuBtn title="Profil Pengguna" subtitle="Informasi & Avatar Anda" onClick={() => setView('user')} />
      <MenuBtn title="Keamanan & Privasi" subtitle="Enkripsi & Manajemen Data" onClick={() => setView('security')} />
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Keamanan & Privasi" onBack={() => setView('menu')} />
      
      <div className="space-y-10">
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Pengaturan Sesi</h4>
          
          <ToggleItem 
            title="Enkripsi End-to-End" 
            subtitle="Amankan semua percakapan dengan kunci privat" 
            active={state.security.encryptSessions}
            onToggle={() => {
              const n = { ...state, security: { ...state.security, encryptSessions: !state.security.encryptSessions } };
              setState(n); handleSave(n);
            }}
          />
          
          <ToggleItem 
            title="Otentikasi Dua Faktor" 
            subtitle="Verifikasi identitas saat masuk ke sistem" 
            active={state.security.twoFactor}
            onToggle={() => {
              const n = { ...state, security: { ...state.security, twoFactor: !state.security.twoFactor } };
              setState(n); handleSave(n);
            }}
          />
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Penyimpanan Data</h4>
          
          <div className="p-6 rounded-3xl border border-current/10 bg-current/[0.02] flex justify-between items-center">
            <div>
              <p className="text-sm font-black uppercase mb-1">Hapus Otomatis</p>
              <p className="text-xs opacity-50">Tentukan durasi penyimpanan riwayat</p>
            </div>
            <select 
              value={state.security.autoDelete}
              onChange={(e) => {
                const n = { ...state, security: { ...state.security, autoDelete: e.target.value as any } };
                setState(n); handleSave(n);
              }}
              className="bg-inherit border-b border-current/20 py-1 text-xs font-bold focus:outline-none"
            >
              <option value="never">Selamanya</option>
              <option value="24h">24 Jam</option>
              <option value="30d">30 Hari</option>
            </select>
          </div>
        </div>

        <div className="pt-10 border-t border-current/10">
          <button 
            onClick={() => {
              if (confirm('Anda yakin ingin menghapus semua riwayat percakapan? Tindakan ini tidak dapat dibatalkan.')) {
                onClearData();
                alert('Semua data telah dibersihkan.');
              }
            }}
            className="w-full py-5 rounded-3xl border border-red-500/30 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            Hapus Semua Riwayat Percakapan
          </button>
        </div>
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Identitas Rival" onBack={() => setView('menu')} />
      <div className="space-y-10">
        <div className="flex flex-col gap-5">
          <img src={state.aiAvatar} className="w-32 h-32 rounded-[2.5rem] object-cover border border-current/10 shadow-2xl" />
          <button onClick={() => aiFileRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-left opacity-40 hover:opacity-100 transition-opacity">Unggah Foto Rival Baru</button>
        </div>
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Nama Sistem</label>
            <input 
              type="text" 
              value={state.aiName}
              onChange={(e) => { const n = { ...state, aiName: e.target.value }; setState(n); handleSave(n); }}
              className="w-full bg-current/[0.03] border-b border-current/10 py-3 focus:outline-none text-base font-black" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Persona & Instruksi</label>
            <textarea 
              rows={8}
              value={state.aiPersona}
              onChange={(e) => { const n = { ...state, aiPersona: e.target.value }; setState(n); handleSave(n); }}
              className="w-full bg-current/[0.03] p-6 rounded-3xl border border-current/10 focus:outline-none text-sm font-medium leading-relaxed" 
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStyle = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Tema & Visual" onBack={() => setView('menu')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map(t => (
          <button 
            key={t}
            onClick={() => { const n = { ...state, theme: t }; setState(n); handleSave(n); }}
            className={`p-10 border rounded-[2.5rem] text-left transition-all ${state.theme === t ? 'border-current bg-current/5 ring-1 ring-current' : 'border-current/10 opacity-40 hover:opacity-100'}`}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-1">{t}</p>
            <p className="text-[10px] opacity-40 uppercase tracking-widest">{t === 'black' ? 'Pure Monochrome' : 'Visual Balanced'}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderFont = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Tipografi" onBack={() => setView('menu')} />
      <div className="grid grid-cols-2 gap-4">
        {fonts.map(f => (
          <button 
            key={f}
            onClick={() => { const n = { ...state, font: f }; setState(n); handleSave(n); }}
            className={`p-8 border rounded-3xl text-left flex justify-between items-center transition-all ${state.font === f ? 'border-current bg-current/5' : 'border-current/10 opacity-40 hover:opacity-100'}`}
          >
            <span className={`text-base font-bold font-${f}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</span>
            {state.font === f && <div className="w-3 h-3 bg-current rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  );

  const renderUser = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Profil Pengguna" onBack={() => setView('menu')} />
      <div className="space-y-10">
        <div className="flex flex-col gap-5">
          <img src={state.avatar} className="w-32 h-32 rounded-[2.5rem] object-cover border border-current/10 shadow-2xl" />
          <button onClick={() => userFileRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-left opacity-40 hover:opacity-100 transition-opacity">Ganti Avatar</button>
        </div>
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Nama Lengkap</label>
            <input 
              type="text" 
              value={state.name}
              onChange={(e) => { const n = { ...state, name: e.target.value }; setState(n); handleSave(n); }}
              className="w-full bg-current/[0.03] border-b border-current/10 py-3 focus:outline-none text-base font-black" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Bio Singkat</label>
            <input 
              type="text" 
              value={state.bio}
              onChange={(e) => { const n = { ...state, bio: e.target.value }; setState(n); handleSave(n); }}
              className="w-full bg-current/[0.03] border-b border-current/10 py-3 focus:outline-none text-sm font-medium" 
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-inherit">
      <input type="file" ref={userFileRef} className="hidden" accept="image/*" onChange={(e) => handleAvatar(e, 'user')} />
      <input type="file" ref={aiFileRef} className="hidden" accept="image/*" onChange={(e) => handleAvatar(e, 'ai')} />
      
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

        {view === 'menu' && renderMenu()}
        {view === 'ai' && renderAI()}
        {view === 'style' && renderStyle()}
        {view === 'font' && renderFont()}
        {view === 'user' && renderUser()}
        {view === 'security' && renderSecurity()}
      </div>
    </div>
  );
};

const MenuBtn: React.FC<{ title: string; subtitle: string; onClick: () => void }> = ({ title, subtitle, onClick }) => (
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

const SubHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
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

const ToggleItem: React.FC<{ title: string; subtitle: string; active: boolean; onToggle: () => void }> = ({ title, subtitle, active, onToggle }) => (
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
