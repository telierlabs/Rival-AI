import React from 'react';
import { WebSource } from '../types';

interface WebSourcesDisplayProps {
  sources: WebSource[];
  isDark: boolean;
}

export const WebSourcesDisplay: React.FC<WebSourcesDisplayProps> = ({ sources, isDark }) => {
  return (
    <div className="mt-6 space-y-3">
      <p className="text-xs font-black uppercase tracking-widest opacity-40">Sumber:</p>
      {sources.map((source, idx) => (
        <a 
          key={idx}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block p-4 rounded-2xl border ${isDark ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-zinc-200 hover:bg-zinc-50'} transition-all group`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} flex items-center justify-center flex-shrink-0`}>
              <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold mb-1 group-hover:underline">{source.title}</p>
              <p className="text-xs opacity-50 line-clamp-2">{source.snippet}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
