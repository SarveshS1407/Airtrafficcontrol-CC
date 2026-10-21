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
  placeholder = 'Search a city, airport, or place...',
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
    <div ref={containerRef} className={`relative font-sans text-xs ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center bg-[#FCFAF5]/95 border border-[#D6E0E7] hover:border-[#8DB7D5] focus-within:border-[#20394D] focus-within:ring-2 focus-within:ring-[#8DB7D5]/30 rounded-xl shadow-md backdrop-blur-md transition">
        <div className="pl-3 pr-2 text-[#20394D] flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 text-[#D87C43] animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-[#20394D]" />
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
          className="w-full py-2.5 bg-transparent text-[#172D40] placeholder-[#82909B] text-xs focus:outline-none pr-8 font-medium"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults(GLOBAL_AVIATION_WAYPOINTS.slice(0, 6));
            }}
            className="pr-3 text-[#82909B] hover:text-[#172D40] transition"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl shadow-xl backdrop-blur-xl z-50 overflow-hidden divide-y divide-[#D6E0E7] animate-fadeIn">
          {/* Popular Hub Quick Links if query is empty */}
          {!query && (
            <div className="p-3 bg-[#F4F0E7]">
              <span className="text-[10px] text-[#82909B] uppercase tracking-wider font-bold block mb-2 flex items-center gap-1.5 tech-stamp">
                <Navigation className="w-3 h-3 text-[#20394D]" />
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
                    className="px-2.5 py-1 rounded-md bg-[#FCFAF5] hover:bg-[#EBF3FA] border border-[#D6E0E7] hover:border-[#8DB7D5] text-[#172D40] text-[11px] transition font-mono font-bold shadow-2xs"
                  >
                    {hub.code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-[#D6E0E7]/60">
            {results.length === 0 ? (
              <div className="p-4 text-center text-[#82909B] text-xs">
                No aviation sectors found matching &quot;{query}&quot;. Try an airport code or city name.
              </div>
            ) : (
              results.map((loc, idx) => (
                <button
                  key={`${loc.name}-${loc.lat}-${loc.lng}-${idx}`}
                  onClick={() => handleSelect(loc)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full px-3 py-2.5 text-left flex items-start gap-2.5 transition ${
                    highlightedIndex === idx
                      ? 'bg-[#EBF3FA] text-[#172D40] border-l-2 border-[#D87C43]'
                      : 'hover:bg-[#F4F0E7] text-[#172D40]'
                  }`}
                >
                  <Plane className={`w-4 h-4 mt-0.5 shrink-0 ${
                    highlightedIndex === idx ? 'text-[#D87C43]' : 'text-[#82909B]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between font-semibold text-xs truncate">
                      <span className="truncate text-[#172D40]">{loc.name}</span>
                      <span className="text-[10px] text-[#82909B] font-mono shrink-0 ml-2">
                        {loc.lat.toFixed(2)}°, {loc.lng.toFixed(2)}°
                      </span>
                    </div>
                    {loc.formattedAddress && (
                      <p className="text-[11px] text-[#82909B] truncate mt-0.5">
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
