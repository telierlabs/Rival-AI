import React, { useState } from 'react';
import { EbookData } from '../types';

interface EbookViewerProps {
  ebookData: EbookData;
  isDark: boolean;
}

export const EbookViewer: React.FC<EbookViewerProps> = ({ ebookData, isDark }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleDownload = () => {
    const content = ebookData.pages.map(p => 
      `Page ${p.pageNumber}\n\n${p.content}\n\n---\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ebookData.title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const page = ebookData.pages[currentPage];

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className={`rounded-3xl overflow-hidden border ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'} shadow-2xl`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black uppercase">{ebookData.title}</h3>
              <p className="text-xs opacity-40 uppercase tracking-widest mt-1">
                Page {currentPage + 1} of {ebookData.pages.length}
              </p>
            </div>
            <button 
              onClick={handleDownload}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}
            >
              Download
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 min-h-[400px]">
          {page.imageUrl && (
            <img 
              src={page.imageUrl} 
              className="w-full h-48 object-cover rounded-2xl mb-6" 
              alt={`Page ${page.pageNumber}`} 
            />
          )}
          <div className="prose prose-sm md:prose-base max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">{page.content}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className={`p-6 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'} flex justify-between items-center`}>
          <button 
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${currentPage === 0 ? 'opacity-20 cursor-not-allowed' : (isDark ? 'hover:bg-white/10' : 'hover:bg-black/5')}`}
          >
            ← Previous
          </button>
          
          <div className="flex gap-2">
            {ebookData.pages.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentPage ? 'bg-current w-8' : 'bg-current/20'}`}
              />
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(Math.min(ebookData.pages.length - 1, currentPage + 1))}
            disabled={currentPage === ebookData.pages.length - 1}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${currentPage === ebookData.pages.length - 1 ? 'opacity-20 cursor-not-allowed' : (isDark ? 'hover:bg-white/10' : 'hover:bg-black/5')}`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
