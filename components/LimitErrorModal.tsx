import React from 'react';

interface LimitErrorModalProps {
  isDark: boolean;
  borderColor: string;
  onClose: () => void;
}

export const LimitErrorModal: React.FC<LimitErrorModalProps> = ({
  isDark,
  borderColor,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className={`max-w-sm w-full p-10 rounded-[2.5rem] border ${borderColor} ${isDark ? 'bg-zinc-950' : 'bg-white'} text-center shadow-2xl`}>
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-black uppercase tracking-tight mb-4">Quota Tercapai</h3>
        <p className="text-xs opacity-60 font-medium leading-relaxed mb-8">
          Anda telah mencapai batas harian gambar. Mohon tingkatkan ke Rival Premium untuk akses tak terbatas.
        </p>
        <div className="space-y-3">
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-current text-white invert font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all"
          >
            Lihat Paket Premium
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl border border-current/10 font-black uppercase text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
