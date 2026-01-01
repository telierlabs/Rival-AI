
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ChatSession, Message, UserProfile, ConversationMode } from '../types';
import { gemini } from '../geminiService';

interface ChatInterfaceProps {
  session: ChatSession | null;
  profile: UserProfile;
  onUpdateMessages: (messages: Message[]) => void;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  checkImageLimit: () => boolean;
  incrementImageUsage: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  session, 
  profile,
  onUpdateMessages,
  onToggleSidebar,
  onNewChat,
  checkImageLimit,
  incrementImageUsage
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<ConversationMode>(session?.activeMode || 'general');
  const [showSparklesMenu, setShowSparklesMenu] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [limitError, setLimitError] = useState(false);
  
  // Artifact States
  const [artifactCode, setArtifactCode] = useState<string | null>(null);
  const [activeArtifactTab, setActiveArtifactTab] = useState<'preview' | 'code'>('preview');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [session?.messages, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sparklesRef.current && !sparklesRef.current.contains(event.target as Node)) {
        setShowSparklesMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const extractCode = (text: string): string | null => {
    const codeBlockRegex = /```(?:[a-zA-Z]+)?\n([\s\S]*?)\n```/;
    const match = text.match(codeBlockRegex);
    return match ? match[1] : null;
  };

  const cleanTextFromCode = (text: string): string => {
    return text.replace(/```(?:[a-zA-Z]+)?\n[\s\S]*?\n```/g, '').trim();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleToggleSave = (id: string) => {
    if (!session) return;
    const newMessages = session.messages.map(m => 
      m.id === id ? { ...m, isSaved: !m.isSaved } : m
    );
    onUpdateMessages(newMessages);
  };

  const handleDownloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `rival-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading || !session) return;

    if (activeMode === 'image' || selectedImage) {
      if (!checkImageLimit()) {
        setLimitError(true);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      imageUrl: selectedImage || undefined,
      isImageEditing: !!selectedImage
    };

    const newMessages = [...session.messages, userMessage];
    onUpdateMessages(newMessages);
    const currentInput = input;
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let aiResponseText = "";
      let aiImageUrl: string | undefined = undefined;

      let modeInstruction = profile.aiPersona;
      if (activeMode === 'coding') {
        modeInstruction = "You are a Senior Fullstack Architect. When creating web components, provide a complete, self-contained HTML/CSS/JS block inside triple backticks. Focus on clean code. IMPORTANT: Never use double asterisks (**) for bolding.";
      }

      if (currentImage) {
        const result = await gemini.editImage(currentInput || "Optimize this image", currentImage);
        aiResponseText = result.textResponse || `Visual processed.`;
        aiImageUrl = result.editedImageUrl || undefined;
        if (aiImageUrl) incrementImageUsage();
      } else {
        const history = session.messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));
        
        const response = await gemini.chat(currentInput, history, modeInstruction);
        
        if (response.functionCalls && response.functionCalls.length > 0) {
          const call = response.functionCalls[0];
          if (call.name === 'generate_visual') {
            if (!checkImageLimit()) {
               aiResponseText = "Sistem: Batas harian visualisasi tercapai. Mohon langganan Rival Premium untuk akses tak terbatas.";
            } else {
              const promptForImage = (call.args as any).prompt || currentInput;
              const imageResult = await gemini.generateImage(promptForImage);
              aiImageUrl = imageResult.generatedImageUrl || undefined;
              aiResponseText = imageResult.textResponse || `Generated visual for: "${promptForImage}"`;
              if (aiImageUrl) incrementImageUsage();
            }
          }
        } else {
          aiResponseText = response.text || "I couldn't process that.";
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
        imageUrl: aiImageUrl,
        codeSnippet: extractCode(aiResponseText) || undefined
      };

      onUpdateMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error(error);
      onUpdateMessages([...newMessages, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Error in Rival system.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = profile.theme === 'black' || profile.theme === 'slate';
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const assistantRowBg = profile.theme === 'black' ? 'bg-zinc-900/40' : 
                        profile.theme === 'slate' ? 'bg-zinc-800/40' : 
                        profile.theme === 'cream' ? 'bg-[#f5f1e8]' : 'bg-gray-50';

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

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-inherit">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Initializing Rival System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <header className={`h-16 border-b ${borderColor} flex items-center justify-between px-4 md:px-8 gap-4 sticky top-0 bg-inherit/95 backdrop-blur-xl z-20`}>
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <button onClick={onToggleSidebar} className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
          <div className="flex items-center gap-4 min-w-0">
            <h2 className={`text-sm font-black truncate uppercase ${isDark ? 'text-white' : 'text-black'}`}>{session.title}</h2>
          </div>
        </div>
        <button onClick={onNewChat} className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pt-2 pb-60">
        {session.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
             <div className="mb-12"><img src={profile.aiAvatar} className={`w-24 h-24 rounded-[2rem] shadow-2xl ${borderColor} border-2 object-cover p-1.5`} alt="AI" /></div>
             <h1 className={`text-4xl md:text-6xl font-black tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Ready.</h1>
             <p className="text-[11px] opacity-40 uppercase tracking-[0.6em] font-black">RIVAL {activeMode.toUpperCase()} ENGINE</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {session.messages.map((msg) => (
              <div key={msg.id} className={`w-full flex justify-center py-10 md:py-16 border-b ${borderColor} ${msg.role === 'assistant' ? assistantRowBg : 'bg-transparent'}`}>
                <div className="w-full max-w-4xl flex gap-6 md:gap-10 px-6">
                  <div className="flex-shrink-0"><img src={msg.role === 'assistant' ? profile.aiAvatar : profile.avatar} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-sm ${borderColor} border`} alt={msg.role} /></div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="mb-3 flex items-center gap-4">
                      <span className={`text-xs font-black uppercase tracking-[0.2em] opacity-60`}>{msg.role === 'assistant' ? profile.aiName : 'Anda'}</span>
                      <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                        {format(msg.timestamp, 'eeee, dd MMM yyyy · HH:mm')}
                      </span>
                    </div>
                    
                    <div className={`text-base md:text-lg leading-[1.8] font-medium whitespace-pre-wrap ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                      {msg.role === 'assistant' ? cleanTextFromCode(msg.content) : msg.content}
                    </div>
                    
                    {/* Artifact Card */}
                    {msg.role === 'assistant' && msg.codeSnippet && (
                      <div className="mt-8 max-w-xl">
                        <div className={`p-6 rounded-3xl border ${borderColor} ${isDark ? 'bg-zinc-950/50' : 'bg-white shadow-xl shadow-black/5'} overflow-hidden`}>
                          <div className="flex items-center gap-5 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-current/5 flex items-center justify-center border border-current/10">
                              <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                            </div>
                            <div>
                              <h3 className="text-base font-black uppercase tracking-tight">Web Artifact</h3>
                              <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-0.5">Application v1.0 • {format(msg.timestamp, 'HH:mm')}</p>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setArtifactCode(msg.codeSnippet!);
                              setActiveArtifactTab('preview');
                            }}
                            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest group shadow-lg ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            Preview
                          </button>
                        </div>
                      </div>
                    )}

                    {msg.imageUrl && (
                      <div className="mt-8 group relative flex flex-col gap-4">
                        <div className="cursor-zoom-in" onClick={() => setViewingImage(msg.imageUrl!)}>
                          <img src={msg.imageUrl} className="rounded-3xl border border-current/10 shadow-2xl w-full object-contain bg-black/5" alt="Visual" />
                        </div>
                        <button 
                          onClick={() => handleDownloadImage(msg.imageUrl!)}
                          className={`self-start flex items-center gap-2 px-6 py-3 rounded-2xl border ${borderColor} transition-all hover:bg-current/5`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span className="text-[10px] font-black uppercase tracking-widest">Download Gambar</span>
                        </button>
                      </div>
                    )}

                    {/* Message Actions */}
                    <div className="mt-6 flex items-center gap-4">
                      <button 
                        onClick={() => handleCopy(msg.role === 'assistant' ? cleanTextFromCode(msg.content) : msg.content, msg.id)}
                        className={`p-2 rounded-xl transition-all flex items-center gap-2 ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">{copyFeedback === msg.id ? 'Copied' : 'Salin'}</span>
                      </button>

                      {(msg.imageUrl || msg.codeSnippet) && (
                        <button 
                          onClick={() => handleToggleSave(msg.id)}
                          className={`p-2 rounded-xl transition-all flex items-center gap-2 ${msg.isSaved ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : (isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black')}`}
                        >
                          <svg className="w-4 h-4" fill={msg.isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          <span className="text-[10px] font-black uppercase tracking-widest">{msg.isSaved ? 'Tersimpan' : 'Simpan Gallery'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`w-full flex justify-center py-12 md:py-20 animate-pulse ${assistantRowBg}`}>
                <div className="w-full max-w-4xl flex gap-8 md:gap-12 px-6">
                  <div className="w-12 h-12 rounded-xl bg-current/5" /><div className="flex-1 space-y-4"><div className="h-3 w-24 bg-current/10 rounded" /><div className="h-5 w-full bg-current/5 rounded" /></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-inherit via-inherit/95 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          {selectedImage && (
            <div className="mb-3 animate-in fade-in slide-in-from-bottom-2">
               <div className="relative inline-block">
                 <img src={selectedImage} className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-2xl border-2 shadow-xl" alt="Preview" />
                 <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
               </div>
            </div>
          )}

          <div className={`relative flex items-end gap-2 p-2.5 rounded-[32px] border-2 ${isDark ? 'bg-zinc-950 border-zinc-800 shadow-black' : 'bg-white border-zinc-200'} shadow-2xl transition-all`}>
            <div className="flex items-center gap-1">
               <button onClick={() => fileInputRef.current?.click()} className={`p-3.5 rounded-2xl transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}>
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
               </button>

               <div className="relative" ref={sparklesRef}>
                 <button 
                   onClick={() => setShowSparklesMenu(!showSparklesMenu)}
                   className={`p-3.5 rounded-2xl transition-all ${showSparklesMenu ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black')}`}
                 >
                   <span className="text-lg">✨</span>
                 </button>
                 
                 {showSparklesMenu && (
                   <div className={`absolute bottom-full left-0 mb-4 w-64 rounded-3xl border ${borderColor} ${isDark ? 'bg-zinc-950 shadow-black shadow-2xl' : 'bg-white shadow-xl'} overflow-hidden p-2 z-50 animate-in fade-in slide-in-from-bottom-4`}>
                     <ModeOption icon="💻" title="Programmer Pro" desc="Koding & Arsitektur" active={activeMode === 'coding'} onClick={() => { setActiveMode('coding'); setShowSparklesMenu(false); }} isDark={isDark} />
                     <ModeOption icon="🎨" title="Visualizer" desc="Kreasi Gambar" active={activeMode === 'image'} onClick={() => { setActiveMode('image'); setShowSparklesMenu(false); }} isDark={isDark} />
                     <div className="h-px bg-current/5 my-1" />
                     <ModeOption icon="💬" title="General Chat" desc="Percakapan Normal" active={activeMode === 'general'} onClick={() => { setActiveMode('general'); setShowSparklesMenu(false); }} isDark={isDark} />
                   </div>
                 )}
               </div>
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => setSelectedImage(event.target?.result as string);
                reader.readAsDataURL(file);
              }
              e.target.value = '';
            }} />
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ketik pesan..."
              className={`flex-1 bg-transparent py-4 px-2 focus:outline-none text-base font-medium max-h-60 min-h-[52px] overflow-y-auto no-scrollbar resize-none ${isDark ? 'text-white' : 'text-black'}`}
              rows={1}
            />

            <button onClick={handleSend} disabled={isLoading || (!input.trim() && !selectedImage)} className={`p-4 rounded-[20px] transition-all ${input.trim() || selectedImage ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : 'opacity-10'}`}>
              {isLoading ? <div className="w-6 h-6 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>}
            </button>
          </div>
        </div>
      </div>

      {/* Limit Error Overlay */}
      {limitError && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className={`max-w-sm w-full p-10 rounded-[2.5rem] border ${borderColor} ${isDark ? 'bg-zinc-950' : 'bg-white'} text-center shadow-2xl`}>
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-base font-black uppercase tracking-tight mb-4">Quota Tercapai</h3>
              <p className="text-xs opacity-60 font-medium leading-relaxed mb-8">
                Anda telah mencapai batas harian gambar. Mohon tingkatkan ke Rival Premium untuk akses tak terbatas.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => setLimitError(false)}
                  className="w-full py-4 rounded-2xl bg-current text-white invert font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all"
                >
                  Lihat Paket Premium
                </button>
                <button 
                  onClick={() => setLimitError(false)}
                  className="w-full py-4 rounded-2xl border border-current/10 font-black uppercase text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-all"
                >
                  Tutup
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Unified Artifact Modal */}
      {artifactCode && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300">
           <header className="h-20 flex items-center justify-between px-8 border-b border-white/10">
              <div className="flex items-center gap-6">
                <div className="flex bg-white/5 p-1 rounded-2xl">
                  <button 
                    onClick={() => setActiveArtifactTab('code')}
                    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeArtifactTab === 'code' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    Code
                  </button>
                  <button 
                    onClick={() => setActiveArtifactTab('preview')}
                    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeArtifactTab === 'preview' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
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
                onClick={() => setArtifactCode(null)} 
                className="p-3 text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </header>
           
           <div className="flex-1 overflow-hidden">
              {activeArtifactTab === 'preview' ? (
                <div className="w-full h-full p-4 md:p-10">
                  <div className="w-full h-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
                    <iframe 
                      title="Artifact Preview"
                      srcDoc={prepareIframeContent(artifactCode)}
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
                        onClick={() => { navigator.clipboard.writeText(artifactCode); alert("Copied!"); }}
                      >
                        Copy to Clipboard
                      </button>
                    </div>
                    <pre className="flex-1 overflow-auto p-10 text-sm font-mono text-zinc-300 leading-relaxed no-scrollbar">
                      <code>{artifactCode}</code>
                    </pre>
                  </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Image Viewer Overlay */}
      {viewingImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300">
          <header className="h-20 flex items-center justify-end px-8 gap-4 border-b border-white/10">
            <button 
              onClick={() => handleDownloadImage(viewingImage)}
              className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl transition-all flex items-center gap-2"
              title="Unduh Gambar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Download</span>
            </button>

            <button 
              onClick={() => setViewingImage(null)} 
              className="p-3 text-white/40 hover:text-white transition-colors"
              title="Tutup"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>
          <div className="flex-1 flex items-center justify-center p-8 md:p-16 overflow-hidden">
            <img src={viewingImage} className="max-w-full max-h-full object-contain rounded-[2rem] shadow-2xl" alt="Full" />
          </div>
        </div>
      )}
    </div>
  );
};

const ModeOption: React.FC<{ icon: string; title: string; desc: string; active: boolean; onClick: () => void; isDark: boolean }> = ({ icon, title, desc, active, onClick, isDark }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? (isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black') : 'hover:bg-current/5 opacity-60'}`}
  >
    <span className="text-2xl">{icon}</span>
    <div className="text-left">
      <p className="text-xs font-black uppercase tracking-tight">{title}</p>
      <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">{desc}</p>
    </div>
  </button>
);
