import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountry } from '@/context/CountryContext';
import { COUNTRIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CountrySelectorProps {
  compact?: boolean;
}

export function CountrySelector({ compact = false }: CountrySelectorProps) {
  const { country, setCountry } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountryInfo = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/10",
          compact ? "px-3 py-1.5 text-sm" : "px-4 py-2"
        )}
      >
        <span className="text-xl" aria-hidden="true">{selectedCountryInfo.flag}</span>
        <span className="font-medium text-white">{selectedCountryInfo.code}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-xl border border-white/10 bg-surface-hover/90 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-2 border-b border-white/10">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
              {filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-sm text-text-muted">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCountry(c.code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm transition-colors",
                      country === c.code 
                        ? "bg-primary/20 text-white font-medium" 
                        : "text-text-muted hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.flag}</span>
                      <span>{c.name}</span>
                    </div>
                    {country === c.code && <Check size={16} className="text-primary" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
