import React from 'react';
import { MapData } from '../types';

interface MapDisplayProps {
  mapData: MapData;
  isDark: boolean;
}

export const MapDisplay: React.FC<MapDisplayProps> = ({ mapData, isDark }) => {
  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className={`rounded-3xl overflow-hidden border ${isDark ? 'border-zinc-800' : 'border-zinc-200'} shadow-2xl`}>
        {/* Google Maps Embed */}
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(mapData.placeName)}`}
          allowFullScreen
          title="Map Location"
          className="w-full"
        />
        
        <div className={`p-6 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
          <h3 className="text-base font-black uppercase mb-2">{mapData.placeName}</h3>
          <p className="text-sm opacity-60 mb-4">{mapData.address}</p>
          
          <div className="flex gap-3">
            <a 
              href={mapData.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex-1 py-3 px-4 rounded-2xl text-center font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}
            >
              Buka di Google Maps
            </a>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${mapData.placeName} - ${mapData.address}`);
                alert('Lokasi disalin!');
              }}
              className={`py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}
            >
              Salin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
