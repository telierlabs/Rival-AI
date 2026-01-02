import React, { useState } from 'react';

interface ArtifactModalProps {
  code: string;
  onClose: () => void;
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({ code, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const prepareIframeContent = (code: string) => {
    if (code.includes('<html')) return code;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 20px; font-family: sans-serif; }
          </style>
        </head>
        <body>
          ${code}
        </body>
      </html>
    `;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300">
      <header className="h-20 flex items-center justify-between px-8 border-b border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex bg-white/5 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('code')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'code' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Code
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'preview' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Preview
            </button>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center">
          <h3 className="text-sm text-white font-black uppercase tracking-tight">Rival Web Studio</h3>
          <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Live Execution Engine</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-3 text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? (
          <div className="w-full h-full p-4 md:p-10">
            <div className="w-full h-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
              <iframe 
                title="Artifact Preview"
                srcDoc={prepareIframeContent(code)}
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-4 md:p-10 flex flex-col">
            <div className="flex-1 bg-[#1e1e1e] rounded-[2rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
              <div className="h-12 bg-black/40 px-8 flex items-center justify-between border-b border-white/5">
                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Source Logic</span>
                <button 
                  className="text-[10px] text-white/60 hover:text-white font-black uppercase tracking-widest" 
                  onClick={() => { navigator.clipboard.writeText(code); alert("Copied!"); }}
                >
                  Copy to Clipboard
                </button>
              </div>
              <pre className="flex-1 overflow-auto p-10 text-sm font-mono text-zinc-300 leading-relaxed no-scrollbar">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
