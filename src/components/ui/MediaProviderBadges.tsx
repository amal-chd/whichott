import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getItemWatchProviders } from '@/lib/api/tmdb';
import type { ContentType } from '@/lib/api/types';
import { useCountry } from '@/context/CountryContext';
import { useProviders } from '@/context/ProviderContext';

interface MediaProviderBadgesProps {
  mediaType: ContentType;
  id: number;
}

export function MediaProviderBadges({ mediaType, id }: MediaProviderBadgesProps) {
  const { country } = useCountry();
  const { selectedProviders } = useProviders();

  const { data } = useQuery({
    queryKey: ['watchProviders', mediaType, id],
    queryFn: () => getItemWatchProviders(mediaType, id),
    staleTime: 1000 * 60 * 60, // 1 hour (rarely changes)
  });

  if (!data || !data.results || !data.results[country]) {
    return null;
  }

  const countryData = data.results[country];
  
  // Collect all unique providers available in this country for this title
  const availableProviders = new Map<number, string>();
  
  const addProviders = (providers?: any[]) => {
    if (!providers) return;
    providers.forEach(p => {
      if (!availableProviders.has(p.provider_id)) {
        availableProviders.set(p.provider_id, p.logo_path);
      }
    });
  };

  addProviders(countryData.flatrate);
  addProviders(countryData.free);
  addProviders(countryData.ads);
  addProviders(countryData.rent);
  addProviders(countryData.buy);

  let logosToShow: string[] = [];

  // If user has selected specific providers globally, filter by those
  if (selectedProviders.length > 0) {
    const userMatchedProviders = selectedProviders
      .filter(id => availableProviders.has(id))
      .map(id => availableProviders.get(id) as string);
    logosToShow = userMatchedProviders;
  } else {
    // Otherwise, just show the first 3 available providers
    logosToShow = Array.from(availableProviders.values());
  }

  // Limit to 3 tiny logos
  logosToShow = logosToShow.slice(0, 3);

  if (logosToShow.length === 0) return null;

  return (
    <div className="flex gap-1">
      {logosToShow.map((logoPath, index) => (
        <img 
          key={`${id}-${index}`}
          src={`https://image.tmdb.org/t/p/w45${logoPath}`}
          alt="Provider Logo"
          className="w-5 h-5 rounded shadow-sm border border-white/20"
          loading="lazy"
        />
      ))}
    </div>
  );
}
