import React from 'react';

interface ImageDisplayProps {
  imageUrl: string;
  borderColor: string;
  onView: () => void;
  onDownload: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  borderColor,
  onView,
  onDownload
}) => {
  return (
    <div className="mt-8 group relative flex flex-col gap-4">
      <div className="cursor-zoom-in" onClick={onView}>
        <img 
          src={imageUrl} 
          className="rounded-3xl border border-current/10 shadow-2xl w-full object-contain bg-black/5" 
          alt="Visual" 
        />
      </div>
      <button 
        onClick={onDownload}
        className={`self-start flex items-center gap-2 px-6 py-3 rounded-2xl border ${borderColor} transition-all hover:bg-current/5`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-widest">Download Gambar</span>
      </button>
    </div>
  );
};
