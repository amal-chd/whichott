import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useSearch';
import { useMode } from '@/context/ModeContext';
import { CountrySelector } from './CountrySelector';
import { SearchSuggestions } from './SearchSuggestions';

interface SearchBarProps {
  autoFocus?: boolean;
  variant?: 'hero' | 'compact';
  onSearch?: (query: string) => void;
}

export function SearchBar({ autoFocus = false, variant = 'hero', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { mode } = useMode();
  
  const { data, isLoading } = useSearch(debouncedQuery, debouncedQuery.length >= 2);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const isHero = variant === 'hero';
  const isSports = mode === 'sports';

  const placeholder = isSports
    ? "Search teams, leagues, players, matches..."
    : "Search movies, series, actors...";

  return (
    <div className="relative w-full z-40" ref={searchContainerRef}>
      <motion.form 
        onSubmit={handleSubmit}
        animate={{ 
          scale: isFocused && isHero ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative flex items-center w-full transition-all duration-300",
          "bg-white/5 backdrop-blur-xl border border-white/10 rounded-full",
          isFocused 
            ? isSports
              ? "bg-white/10 border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.3)] border-blue-500"
              : "bg-white/10 border-white/20 shadow-[0_0_30px_rgba(192,38,211,0.2)]" 
            : "hover:bg-white/[0.07] hover:border-white/20",
          isHero ? "h-14 md:h-16 max-w-2xl mx-auto" : "h-10 max-w-md",
          isFocused && isHero ? (isSports ? "glow-secondary" : "glow-primary") : ""
        )}
      >
        <div className={cn("flex items-center justify-center text-text-muted", isHero ? "w-14" : "w-10")}>
          <Search size={isHero ? 24 : 18} className={isFocused ? (isSports ? "text-blue-400" : "text-primary") + " transition-colors" : ""} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-white placeholder:text-text-muted/70",
            isHero ? "text-lg md:text-xl" : "text-sm"
          )}
        />
        
        <div className="flex items-center gap-2 pr-2">
          {isHero && (
            <button type="button" className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-not-allowed" title="Voice search coming soon">
              <Mic size={20} />
            </button>
          )}
          <CountrySelector compact={!isHero} />
        </div>
      </motion.form>

      <SearchSuggestions 
        query={debouncedQuery}
        isVisible={isFocused && debouncedQuery.length >= 2}
        results={data?.results}
        isLoading={isLoading}
        onSelect={() => setIsFocused(false)}
      />
    </div>
  );
}
