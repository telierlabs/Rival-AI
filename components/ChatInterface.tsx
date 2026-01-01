
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ChatSession, Message, UserProfile } from '../types';
import { gemini } from '../geminiService';

interface ChatInterfaceProps {
  session: ChatSession | null;
  profile: UserProfile;
  onUpdateMessages: (messages: Message[]) => void;
  onToggleSidebar: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  session, 
  profile,
  onUpdateMessages,
  onToggleSidebar
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [session?.messages, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading || !session) return;

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

      if (currentImage) {
        const result = await gemini.editImage(currentInput || "Tolong tingkatkan gambar ini", currentImage);
        aiResponseText = result.textResponse || `Pemrosesan visual selesai oleh ${profile.aiName}.`;
        aiImageUrl = result.editedImageUrl || undefined;
      } else {
        const history = session.messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));
        
        const response = await gemini.chat(currentInput, history, profile.aiPersona);
        
        if (response.functionCalls && response.functionCalls.length > 0) {
          const call = response.functionCalls[0];
          if (call.name === 'generate_visual') {
            const promptForImage = (call.args as any).prompt || currentInput;
            const imageResult = await gemini.generateImage(promptForImage);
            aiImageUrl = imageResult.generatedImageUrl || undefined;
            aiResponseText = imageResult.textResponse || `Berikut adalah hasil visualisasi untuk: "${promptForImage}"`;
          }
        } else {
          aiResponseText = response.text || "Maaf, saya tidak dapat memproses permintaan tersebut.";
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
        imageUrl: aiImageUrl
      };

      onUpdateMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Maaf, terjadi gangguan pada sistem Rival. Koneksi sedang tidak stabil.",
        timestamp: new Date()
      };
      onUpdateMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `rival-generation-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!session) return null;

  const isDark = profile.theme === 'black' || profile.theme === 'slate';
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const assistantRowBg = profile.theme === 'black' ? 'bg-zinc-900/40' : 
                        profile.theme === 'slate' ? 'bg-zinc-800/40' : 
                        profile.theme === 'cream' ? 'bg-[#f5f1e8]' : 'bg-gray-50';

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <header className={`h-16 border-b ${borderColor} flex items-center px-4 md:px-8 gap-4 sticky top-0 bg-inherit/95 backdrop-blur-xl z-20`}>
        <button 
          onClick={onToggleSidebar}
          className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className="flex items-center gap-4 min-w-0">
          <h2 className={`text-sm md:text-base font-black truncate tracking-tight uppercase ${isDark ? 'text-white' : 'text-black'}`}>
            {session.title}
          </h2>
          <span className={`w-1.5 h-1.5 ${isDark ? 'bg-white/30' : 'bg-black/20'} rounded-full`}></span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-black/30'}`}>
            {format(session.updatedAt, 'HH:mm')}
          </span>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar pt-2 pb-60"
      >
        {session.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
            <div className="max-w-3xl w-full">
              <div className="mb-12 flex items-center justify-center">
                <img src={profile.aiAvatar} className={`w-24 h-24 rounded-[2rem] shadow-2xl ${borderColor} border-2 object-cover p-1.5 bg-inherit`} alt="AI" />
              </div>
              <h1 className={`text-4xl md:text-6xl font-black tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                Selamat datang, {profile.name.split(' ')[0]}.
              </h1>
              <p className={`text-[11px] ${isDark ? 'text-white/30' : 'text-black/30'} uppercase tracking-[0.6em] font-black mb-20`}>Integrated Intelligence • {profile.aiName}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                <MinimalExampleCard isDark={isDark} title="Visual" text="Buat gambar logo modern minimalis" onClick={() => setInput("Buatkan saya sebuah gambar logo modern minimalis yang elegan.")} />
                <MinimalExampleCard isDark={isDark} title="Analisis" text="Jelaskan masa depan teknologi AI" onClick={() => setInput("Bagaimana prediksi Anda mengenai masa depan teknologi AI dalam 10 tahun ke depan?")} />
                <MinimalExampleCard isDark={isDark} title="Kreativitas" text="Ide lukisan futuristik di Mars" onClick={() => setInput("Berikan deskripsi konsep lukisan futuristik tentang kehidupan di Mars.")} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {session.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`w-full flex justify-center py-10 md:py-16 transition-colors border-b ${borderColor} ${
                  msg.role === 'assistant' ? assistantRowBg : 'bg-transparent'
                }`}
              >
                <div className="w-full max-w-4xl flex gap-6 md:gap-10 px-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={msg.role === 'assistant' ? profile.aiAvatar : profile.avatar} 
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-sm ${borderColor} border`} 
                      alt={msg.role}
                    />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="mb-3 flex items-center gap-4">
                      <span className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                        {msg.role === 'assistant' ? profile.aiName : 'Anda'}
                      </span>
                    </div>
                    <div className={`text-base md:text-lg leading-[1.8] font-medium whitespace-pre-wrap ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                      {msg.content}
                    </div>
                    {msg.imageUrl && (
                      <div className="mt-8 group relative max-w-4xl cursor-zoom-in" onClick={() => setViewingImage(msg.imageUrl!)}>
                        <img src={msg.imageUrl} className="rounded-3xl border border-current/10 shadow-2xl w-full object-contain bg-black/5" alt="Visual" />
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                          <p className="text-[10px] text-white font-black uppercase tracking-widest">Click to expand</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`w-full flex justify-center py-12 md:py-20 animate-pulse ${assistantRowBg}`}>
                <div className="w-full max-w-4xl flex gap-8 md:gap-12 px-6">
                  <div className="w-12 h-12 rounded-xl bg-current/5" />
                  <div className="flex-1 space-y-4">
                    <div className="h-3 w-24 bg-current/10 rounded" />
                    <div className="h-5 w-full bg-current/5 rounded" />
                    <div className="h-5 w-5/6 bg-current/5 rounded" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-inherit via-inherit/95 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          {selectedImage && (
            <div className="mb-6 p-4 bg-current/5 backdrop-blur-3xl border border-current/10 rounded-3xl flex items-center gap-5 animate-in slide-in-from-bottom-6 duration-400">
              <div className="relative">
                <img src={selectedImage} className="w-20 h-20 rounded-2xl object-cover border border-current/20 shadow-xl" alt="Preview" />
                <button 
                  onClick={clearImage}
                  className="absolute -top-3 -right-3 bg-red-600 text-white p-1.5 rounded-full shadow-2xl hover:scale-110 transition-transform"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Visual context active</p>
                <p className="text-sm font-bold truncate max-w-[250px]">Ready for generation with {profile.aiName}...</p>
              </div>
            </div>
          )}
          
          <div className={`relative group flex items-end gap-3 p-3 rounded-[32px] border-2 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'} shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] transition-all chat-input-focus`}>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-[20px] transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}
              title="Lampirkan Gambar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Ketik pesan untuk ${profile.aiName}...`}
              className={`flex-1 bg-transparent py-4 px-2 focus:outline-none text-base font-medium max-h-60 min-h-[52px] overflow-y-auto no-scrollbar resize-none ${isDark ? 'text-white placeholder:text-zinc-700' : 'text-black placeholder:text-zinc-400'}`}
              rows={1}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className={`p-4 rounded-[20px] transition-all ${
                input.trim() || selectedImage 
                  ? (isDark ? 'bg-white text-black' : 'bg-black text-white') 
                  : 'opacity-10 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Image Viewer Overlay */}
      {viewingImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300">
          <header className="h-20 flex items-center justify-between px-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black">R</div>
              <div>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mb-0.5">Visual Asset</p>
                <p className="text-sm text-white font-black uppercase tracking-tight">Rival Laboratory Output</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleDownloadImage(viewingImage)}
                className="flex items-center gap-3 bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PNG
              </button>
              <button 
                onClick={() => setViewingImage(null)}
                className="p-3 text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-hidden p-8 md:p-16 flex items-center justify-center">
            <img 
              src={viewingImage} 
              className="max-w-full max-h-full object-contain rounded-[2rem] shadow-[0_64px_128px_-24px_rgba(0,0,0,1)] border border-white/5 bg-black" 
              alt="Preview Full" 
            />
          </div>
          <footer className="h-20 border-t border-white/10 flex items-center justify-center">
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.8em]">End-to-End Secure Processing • Neural Vision Engine v3.1</p>
          </footer>
        </div>
      )}
    </div>
  );
};

const MinimalExampleCard: React.FC<{ title: string, text: string, onClick: () => void, isDark: boolean }> = ({ title, text, onClick, isDark }) => (
  <button 
    onClick={onClick}
    className={`p-6 md:p-8 rounded-3xl border transition-all text-left group flex flex-col gap-3 ${
      isDark ? 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 hover:border-zinc-600' : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300'
    }`}
  >
    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{title}</p>
    <p className={`text-sm md:text-base font-bold leading-relaxed ${isDark ? 'text-white' : 'text-black'}`}>{text}</p>
  </button>
);
