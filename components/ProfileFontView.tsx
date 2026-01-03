import React from 'react';
import { UserProfile } from '../types';
import { SubHeader } from './SubHeader';

interface ProfileFontViewProps {
  state: UserProfile;
  onUpdateState: (updated: UserProfile) => void;
  onBack: () => void;
}

export const ProfileFontView: React.FC<ProfileFontViewProps> = ({ 
  state, 
  onUpdateState, 
  onBack 
}) => {
  const fonts: UserProfile['font'][] = ['inter', 'modern', 'serif', 'mono'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-400">
      <SubHeader title="Tipografi" onBack={onBack} />
      <div className="space-y-12">
        <div className="grid grid-cols-2 gap-4">
          {fonts.map(f => (
            <button 
              key={f}
              onClick={() => onUpdateState({ ...state, font: f })}
              className={`p-8 border rounded-3xl text-left flex justify-between items-center transition-all ${state.font === f ? 'border-current bg-current/5' : 'border-current/10 opacity-40 hover:opacity-100'}`}
            >
              <span className={`text-base font-bold font-${f}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </span>
              {state.font === f && <div className="w-3 h-3 bg-current rounded-full" />}
            </button>
          ))}
        </div>

        <div className="pt-10 border-t border-current/10 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Ukuran Teks</h4>
              <p className="text-xs opacity-50">Sesuaikan kenyamanan membaca sistem</p>
            </div>
            <span className="text-2xl font-black">{state.fontSize}px</span>
          </div>
          <div className="relative flex items-center group">
            <input 
              type="range"
              min="12"
              max="24"
              step="1"
              value={state.fontSize}
              onChange={(e) => onUpdateState({ ...state, fontSize: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-current/10 rounded-full appearance-none cursor-pointer accent-current"
            />
          </div>
          <div className="flex justify-between px-1">
            <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">Kecil</span>
            <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">Standar</span>
            <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">Besar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
