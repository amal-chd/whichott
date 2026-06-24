import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWatchProviders } from '@/lib/api/tmdb';
import { useCountry } from '@/context/CountryContext';
import { useProviders } from '@/context/ProviderContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function ProviderBar() {
  const { country } = useCountry();
  const { selectedProviders, toggleProvider } = useProviders();

  // Fetch providers for both movies and TV, then merge them uniquely
  const { data: movieProviders } = useQuery({
    queryKey: ['providers', 'movie', country],
    queryFn: () => getWatchProviders('movie', country),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const { data: tvProviders } = useQuery({
    queryKey: ['providers', 'tv', country],
    queryFn: () => getWatchProviders('tv', country),
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Extract results and merge
  const providersMap = new Map<number, any>();
  
  if (movieProviders?.results) {
    movieProviders.results.forEach((p: any) => providersMap.set(p.provider_id, p));
  }
  if (tvProviders?.results) {
    tvProviders.results.forEach((p: any) => providersMap.set(p.provider_id, p));
  }

  const allProviders = Array.from(providersMap.values())
    .sort((a, b) => a.display_priority - b.display_priority)
    .slice(0, 20); // Only show top 20 providers

  if (allProviders.length === 0) return null;

  return (
    <div className="w-full bg-surface-dark border-y border-white/10 py-4 mb-8 hide-scrollbar overflow-x-auto">
      <div className="container mx-auto px-4 md:px-8 flex items-center gap-4">
        <span className="text-sm font-semibold text-white whitespace-nowrap hidden md:block">
          My Services:
        </span>
        <div className="flex items-center gap-3">
          {allProviders.map(provider => {
            const isSelected = selectedProviders.includes(provider.provider_id);
            return (
              <button
                key={provider.provider_id}
                onClick={() => toggleProvider(provider.provider_id)}
                className={cn(
                  "relative group w-10 h-10 md:w-12 md:h-12 rounded-xl flex-shrink-0 transition-all duration-200",
                  isSelected 
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-110" 
                    : "opacity-50 hover:opacity-100 hover:scale-105"
                )}
                title={provider.provider_name}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
