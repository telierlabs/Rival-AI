import React, { useRef } from 'react';
import { ConversationMode } from '../types';
import { ModeSelector } from './ModeSelector';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  selectedImage: string | null;
  setSelectedImage: (value: string | null) => void;
  activeMode: ConversationMode;
  setActiveMode: (mode: ConversationMode) => void;
  isDark: boolean;
  onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  selectedImage,
  setSelectedImage,
  activeMode,
  setActiveMode,
  isDark,
  onSend
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setSelectedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-inherit via-inherit/95 to-transparent pointer-events-none">
      <div className="max-w-3xl mx-auto w-full pointer-events-auto">
        {selectedImage && (
          <div className="mb-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="relative inline-block">
              <img 
                src={selectedImage} 
                className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-2xl border-2 shadow-xl" 
                alt="Preview" 
              />
              <button 
                onClick={() => setSelectedImage(null)} 
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className={`relative flex items-end gap-2 p-2.5 rounded-[32px] border-2 ${isDark ? 'bg-zinc-950 border-zinc-800 shadow-black' : 'bg-white border-zinc-200'} shadow-2xl transition-all`}>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className={`p-3.5 rounded-2xl transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            <ModeSelector 
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              isDark={isDark}
            />
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { 
              if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault(); 
                onSend(); 
              } 
            }}
            placeholder="Ketik pesan..."
            className={`flex-1 bg-transparent py-4 px-2 focus:outline-none text-base font-medium max-h-60 min-h-[52px] overflow-y-auto no-scrollbar resize-none ${isDark ? 'text-white' : 'text-black'}`}
            rows={1}
          />

          <button 
            onClick={onSend} 
            disabled={isLoading || (!input.trim() && !selectedImage)} 
            className={`p-4 rounded-[20px] transition-all ${input.trim() || selectedImage ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : 'opacity-10'}`}
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
  );
};
