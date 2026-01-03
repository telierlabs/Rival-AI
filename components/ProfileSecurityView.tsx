import React from 'react';
import { UserProfile } from '../types';
import { SubHeader } from './SubHeader';
import { ToggleItem } from './ToggleItem';

interface ProfileSecurityViewProps {
  state: UserProfile;
  onUpdateState: (updated: UserProfile) => void;
  onBack: () => void;
  onClearData: () => void;
}

export const ProfileSecurityView: React.FC<ProfileSecurityViewProps> = ({ 
  state, 
  onUpdateState, 
  onBack,
  onClearData
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Keamanan & Privasi" onBack={onBack} />
      
      <div className="space-y-10">
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Pengaturan Sesi</h4>
          
          <ToggleItem 
            title="Enkripsi End-to-End" 
            subtitle="Amankan semua percakapan dengan kunci privat" 
            active={state.security.encryptSessions}
            onToggle={() => {
              onUpdateState({ 
                ...state, 
                security: { 
                  ...state.security, 
                  encryptSessions: !state.security.encryptSessions 
                } 
              });
            }}
          />
          
          <ToggleItem 
            title="Otentikasi Dua Faktor" 
            subtitle="Verifikasi identitas saat masuk ke sistem" 
            active={state.security.twoFactor}
            onToggle={() => {
              onUpdateState({ 
                ...state, 
                security: { 
                  ...state.security, 
                  twoFactor: !state.security.twoFactor 
                } 
              });
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
                onUpdateState({ 
                  ...state, 
                  security: { 
                    ...state.security, 
                    autoDelete: e.target.value as any 
                  } 
                });
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
};
