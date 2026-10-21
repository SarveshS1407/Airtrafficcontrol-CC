import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Navigation, Plane } from 'lucide-react';
import {
  searchLocation,
  GeocodedLocationResult,
  GLOBAL_AVIATION_WAYPOINTS,
} from '../../services/googleMapsLoader';

interface LocationSearchControlProps {
  onSelectLocation: (loc: GeocodedLocationResult) => void;
  className?: string;
  placeholder?: string;
}

export const LocationSearchControl: React.FC<LocationSearchControlProps> = ({
  onSelectLocation,
  className = '',
  placeholder = 'Search airport, city, or sector...',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeocodedLocationResult[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    const trimmed = query.trim();
    if (!trimmed) {
      // Show top 6 major global aviation hubs by default when opened
      setResults(GLOBAL_AVIATION_WAYPOINTS.slice(0, 6));
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = window.setTimeout(async () => {
      try {
        const matches = await searchLocation(trimmed);
        setResults(matches);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setHighlightedIndex(0);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const handleSelect = (item: GeocodedLocationResult) => {
    setQuery(item.name);
    setIsOpen(false);
    onSelectLocation(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlightedIndex]) {
        handleSelect(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const popularHubs = [
    { code: 'LHR', name: 'London Heathrow' },
    { code: 'JFK', name: 'New York JFK' },
    { code: 'HND', name: 'Tokyo Haneda' },
    { code: 'DXB', name: 'Dubai Intl' },
    { code: 'SIN', name: 'Singapore Changi' },
    { code: 'DEL', name: 'Delhi IGI' },
  ];

  return (
    <div ref={containerRef} className={`relative font-mono text-xs ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center bg-slate-950/90 border border-slate-700/80 hover:border-cyan-500/70 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-500/40 rounded-xl shadow-xl backdrop-blur-md transition">
        <div className="pl-3 pr-2 text-slate-400 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-cyan-400" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full py-2 bg-transparent text-slate-100 placeholder-slate-500 text-xs focus:outline-none pr-8"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults(GLOBAL_AVIATION_WAYPOINTS.slice(0, 6));
            }}
            className="pr-3 text-slate-400 hover:text-white transition"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 bg-slate-950/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden divide-y divide-slate-800 animate-fadeIn">
          {/* Popular Hub Quick Links if query is empty */}
          {!query && (
            <div className="p-2.5 bg-slate-900/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1.5 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-cyan-400" />
                Featured Global Hubs
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularHubs.map((hub) => (
                  <button
                    key={hub.code}
                    onClick={() => {
                      const match = GLOBAL_AVIATION_WAYPOINTS.find((w) =>
                        w.name.includes(hub.code)
                      );
                      if (match) {
                        handleSelect(match);
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-300 text-[10px] transition font-bold"
                  >
                    {hub.code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-900">
            {results.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs">
                No aviation sectors found matching &quot;{query}&quot;. Try an IATA code (e.g. LHR, JFK) or city.
              </div>
            ) : (
              results.map((loc, idx) => (
                <button
                  key={`${loc.name}-${loc.lat}-${loc.lng}-${idx}`}
                  onClick={() => handleSelect(loc)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full px-3 py-2 text-left flex items-start gap-2.5 transition ${
                    highlightedIndex === idx
                      ? 'bg-cyan-950/70 text-cyan-200'
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <Plane className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    highlightedIndex === idx ? 'text-cyan-400' : 'text-slate-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between font-bold text-xs truncate">
                      <span className="truncate">{loc.name}</span>
                      <span className="text-[10px] font-normal text-slate-500 shrink-0 ml-2">
                        {loc.lat.toFixed(2)}°, {loc.lng.toFixed(2)}°
                      </span>
                    </div>
                    {loc.formattedAddress && (
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {loc.formattedAddress}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
