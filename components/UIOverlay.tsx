import React, { useEffect, useState } from 'react';
import { CelestialBody, GeminiInfo } from '../types';
import { Search, Info, X, Crosshair, RotateCcw } from 'lucide-react';
import { fetchCelestialInfo } from '../services/geminiService';
import { FAMOUS_STARS, PLANETS } from '../constants';

interface UIOverlayProps {
  selectedBody: CelestialBody | null;
  onCloseInfo: () => void;
  onSearch: (name: string) => void;
  onToggleConstellations: () => void;
  showConstellations: boolean;
  onResetCamera: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  selectedBody,
  onCloseInfo,
  onSearch,
  onToggleConstellations,
  showConstellations,
  onResetCamera
}) => {
  const [aiInfo, setAiInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Fetch AI info when selection changes
  useEffect(() => {
    if (selectedBody) {
      setLoading(true);
      setAiInfo(null);
      fetchCelestialInfo(selectedBody)
        .then((text) => setAiInfo(text))
        .finally(() => setLoading(false));
    }
  }, [selectedBody]);

  // Search handling
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 1) {
      const allNames = [...PLANETS, ...FAMOUS_STARS].map(b => b.name);
      const filtered = allNames.filter(n => n.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const submitSearch = (name: string) => {
    onSearch(name);
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Bar: Search & Title */}
      <div className="flex justify-between items-start pointer-events-auto w-full">
        <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              COSMIC ATLAS
            </h1>
            <span className="text-xs text-blue-200 opacity-70 uppercase tracking-widest">Interactive Stellar Map</span>
        </div>

        <div className="relative">
          <div className="flex items-center bg-gray-900/80 border border-gray-700 rounded-full px-4 py-2 w-48 sm:w-64 backdrop-blur-md">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Find star or planet..."
              className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-500"
              value={searchQuery}
              onChange={handleSearchInput}
              onKeyDown={(e) => e.key === 'Enter' && suggestions[0] && submitSearch(suggestions[0])}
            />
          </div>
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl z-50">
              {suggestions.map((s) => (
                <div 
                  key={s} 
                  className="px-4 py-2 text-sm text-gray-300 hover:bg-blue-900/50 cursor-pointer transition-colors"
                  onClick={() => submitSearch(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Controls (Bottom Left) */}
      <div className="pointer-events-auto flex flex-col space-y-2">
         <button 
            onClick={onToggleConstellations}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${showConstellations ? 'bg-blue-600/40 border-blue-400 text-white' : 'bg-black/50 border-gray-700 text-gray-400 hover:bg-gray-800'}`}
         >
             <Crosshair size={18} />
             <span className="text-sm font-medium">Constellations</span>
         </button>
         <button 
            onClick={onResetCamera}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border bg-black/50 border-gray-700 text-gray-400 hover:bg-gray-800 transition-all"
         >
             <RotateCcw size={18} />
             <span className="text-sm font-medium">Reset View</span>
         </button>
      </div>

      {/* Info Panel (Bottom Right / Center on Mobile) */}
      {selectedBody && (
        <div className="pointer-events-auto absolute bottom-6 right-6 w-full sm:w-96 bg-black/80 backdrop-blur-xl border border-gray-700 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header with Color Bar */}
          <div className="relative h-24 w-full overflow-hidden">
             <div 
               className="absolute inset-0 opacity-30" 
               style={{ background: `linear-gradient(to right, ${selectedBody.color}, transparent)` }} 
             />
             <button onClick={onCloseInfo} className="absolute top-3 right-3 text-white/70 hover:text-white">
               <X size={20} />
             </button>
             <div className="absolute bottom-3 left-4">
               <h2 className="text-3xl font-bold text-white">{selectedBody.name}</h2>
               <p className="text-sm text-gray-300 font-light">{selectedBody.cnName}</p>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="p-4 grid grid-cols-2 gap-4 border-b border-gray-800">
             <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Type</label>
                <p className="text-sm text-white font-medium">{selectedBody.type}</p>
             </div>
             <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Distance</label>
                <p className="text-sm text-white font-medium">{selectedBody.distance ? `${selectedBody.distance} ly` : 'N/A'}</p>
             </div>
             {selectedBody.magnitude !== undefined && (
                 <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Magnitude</label>
                    <p className="text-sm text-white font-medium">{selectedBody.magnitude}</p>
                 </div>
             )}
             {selectedBody.constellation && (
                 <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Constellation</label>
                    <p className="text-sm text-white font-medium">{selectedBody.constellation}</p>
                 </div>
             )}
          </div>

          {/* AI Content */}
          <div className="p-4 bg-gray-900/50">
             <div className="flex items-center space-x-2 mb-2">
               <Info size={14} className="text-blue-400" />
               <span className="text-xs font-bold text-blue-400 uppercase">Gemini Intelligence</span>
             </div>
             
             {loading ? (
               <div className="flex space-x-1 items-center py-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             ) : (
               <p className="text-sm text-gray-300 leading-relaxed">
                 {aiInfo || selectedBody.description || "No data available."}
               </p>
             )}
          </div>
        </div>
      )}

    </div>
  );
};
