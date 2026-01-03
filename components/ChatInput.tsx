import React, { useRef } from 'react';
import { ConversationMode } from '../types';
import { ModeSelector } from './ModeSelector';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  selectedImages: string[] | null;
  setSelectedImages: (value: string[] | null) => void;
  activeMode: ConversationMode;
  setActiveMode: (mode: ConversationMode) => void;
  isDark: boolean;
  onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  selectedImages,
  setSelectedImages,
  activeMode,
  setActiveMode,
  isDark,
  onSend
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(results => {
        setSelectedImages(results);
      });
    }
    e.target.value = '';
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImages([result]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-inherit via-inherit/95 to-transparent pointer-events-none">
      <div className="max-w-3xl mx-auto w-full pointer-events-auto">
        {selectedImages && selectedImages.length > 0 && (
          <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 flex gap-2 flex-wrap">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="relative inline-block">
                <img 
                  src={img} 
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl border-2 shadow-xl" 
                  alt={`Preview ${idx + 1}`} 
                />
                <button 
                  onClick={() => {
                    const newImages = selectedImages.filter((_, i) => i !== idx);
                    setSelectedImages(newImages.length > 0 ? newImages : null);
                  }} 
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={`relative flex items-end gap-2 p-2.5 rounded-[32px] border-2 ${isDark ? 'bg-zinc-950 border-zinc-800 shadow-black' : 'bg-white border-zinc-200'} shadow-2xl transition-all`}>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className={`p-3.5 rounded-2xl transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}
              title="Upload Images (max 10)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button 
              onClick={() => cameraInputRef.current?.click()} 
              className={`p-3.5 rounded-2xl transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}
              title="Take Photo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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
            multiple 
            onChange={handleFileChange} 
          />

          <input 
            type="file" 
            ref={cameraInputRef} 
            className="hidden" 
            accept="image/*" 
            capture="environment"
            onChange={handleCameraCapture} 
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
            disabled={isLoading || (!input.trim() && (!selectedImages || selectedImages.length === 0))} 
            className={`p-4 rounded-[20px] transition-all ${(input.trim() || (selectedImages && selectedImages.length > 0)) ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : 'opacity-10'}`}
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
