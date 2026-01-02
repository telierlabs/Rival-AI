import React from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className={`flex h-screen items-center justify-center theme-white font-inter bg-white`}>
      <div className="max-w-md w-full p-12 text-center animate-in fade-in zoom-in duration-700">
         <div className="flex items-center justify-center gap-3 mb-6">
           <h1 className="text-6xl font-black tracking-tighter text-black">RIVAL</h1>
           <span className="bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mt-2">BETA</span>
         </div>
         
         <p className="text-[11px] font-black uppercase tracking-[0.5em] text-black/40 mb-10">Neural Intelligence Assistant</p>
         
         <div className="mb-14 space-y-4 text-left border-l-2 border-black/5 pl-8">
           <div className="flex items-start gap-4">
             <span className="text-lg">✨</span>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-black">Generative Visuals</p>
               <p className="text-[11px] text-black/40 font-medium leading-relaxed">Hasilkan gambar berkualitas tinggi secara instan.</p>
             </div>
           </div>
           <div className="flex items-start gap-4">
             <span className="text-lg">💻</span>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-black">Code Artifacts</p>
               <p className="text-[11px] text-black/40 font-medium leading-relaxed">Bangun aplikasi web langsung dari dalam chat.</p>
             </div>
           </div>
           <div className="flex items-start gap-4">
             <span className="text-lg">🧠</span>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-black">Advanced Reasoning</p>
               <p className="text-[11px] text-black/40 font-medium leading-relaxed">Percakapan natural dengan model AI tercanggih.</p>
             </div>
           </div>
         </div>
         
         <button 
           onClick={onLogin}
           className="w-full py-5 rounded-[2rem] bg-black text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20"
         >
           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12.48 10.92v3.28h7.84c-.24 1.84-1.92 5.36-7.84 5.36-5.12 0-9.28-4.24-9.28-9.52s4.16-9.52 9.28-9.52c2.92 0 4.88 1.24 6 2.32l2.6-2.6C19.12 1.12 16 0 12.48 0 5.56 0 0 5.56 0 12.5s5.56 12.5 12.48 12.5c7.24 0 12.04-5.12 12.04-12.28 0-.84-.08-1.48-.2-2.12h-11.84z"/>
           </svg>
           Masuk dengan Google
         </button>
         
         <div className="mt-12 space-y-2">
           <p className="text-[9px] opacity-20 uppercase font-black tracking-widest">Powered by Rival Neural Engine v1.0</p>
           <p className="text-[8px] opacity-10 uppercase font-bold tracking-[0.2em]">© 2025 RIVAL STUDIO. SEMUA HAK DILINDUNGI.</p>
         </div>
      </div>
    </div>
  );
};
