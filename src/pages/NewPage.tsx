import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { discoverMovie, discoverTV } from '@/lib/api/tmdb';
import type { ContentType } from '@/lib/api/types';
import { useCountry } from '@/context/CountryContext';
import { useProviders } from '@/context/ProviderContext';
import { MediaCard } from '@/components/ui/MediaCard';
import { ProviderBar } from '@/components/ui/ProviderBar';
import { CalendarDays, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

function useNewReleases(mediaType: ContentType) {
  const { country } = useCountry();
  const { selectedProviders } = useProviders();

  return useQuery({
    queryKey: ['new-releases', mediaType, country, selectedProviders],
    queryFn: async () => {
      // Get today's date formatted as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      const filters = {
        page: 1,
        watch_region: country,
        with_watch_providers: selectedProviders.length > 0 ? selectedProviders.join('|') : undefined,
        // Require at least some votes to filter out junk/obscure entries
        'vote_count.gte': 5,
      };

      if (mediaType === 'movie') {
        return discoverMovie({
          ...filters,
          sort_by: 'primary_release_date.desc',
          'primary_release_date.lte': today,
        });
      } else {
        return discoverTV({
          ...filters,
          sort_by: 'first_air_date.desc',
          'first_air_date.lte': today,
        });
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function NewPage() {
  const [mediaType, setMediaType] = useState<ContentType>('movie');
  const { selectedProviders } = useProviders();
  const { data, isLoading } = useNewReleases(mediaType);

  const groupedResults = data?.results.reduce((acc, item) => {
    const dateStr = 'release_date' in item ? item.release_date : item.first_air_date;
    let label = 'Previously Added';
    if (dateStr) {
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        label = 'Added Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = 'Added Yesterday';
      } else {
        label = `Added ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    }
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <>
      <Helmet>
        <title>New on Streaming | WhichOTT</title>
        <meta name="description" content="See what was recently added to your streaming services today." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-12 flex flex-col">
        {/* Header Section */}
        <div className="container mx-auto px-4 md:px-8 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">New Releases</h1>
            <p className="text-text-muted">Fresh content recently released on your selected services.</p>
          </div>
          
          <div className="flex bg-surface-light border border-white/10 rounded-full p-1 w-fit">
            <button
              onClick={() => setMediaType('movie')}
              className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all", mediaType === 'movie' ? "bg-white text-black" : "text-text-muted hover:text-white")}
            >
              Movies
            </button>
            <button
              onClick={() => setMediaType('tv')}
              className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all", mediaType === 'tv' ? "bg-white text-black" : "text-text-muted hover:text-white")}
            >
              TV Shows
            </button>
          </div>
        </div>

        {/* Global Provider Bar */}
        <ProviderBar />

        <div className="container mx-auto px-4 md:px-8 flex-1">
          {selectedProviders.length === 0 && (
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-8 flex items-start gap-3">
              <Filter className="text-primary mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-white text-sm">Select Your Services</h4>
                <p className="text-sm text-text-muted mt-1">Select the streaming services you use from the bar above to only see new releases available to you.</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-shimmer" />
              ))}
            </div>
          ) : data?.results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-text-muted">
                <CalendarDays size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No new releases found</h3>
              <p className="text-text-muted max-w-sm">There don't seem to be any recent releases for the selected services.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedResults).map(([dateLabel, items]) => (
                <div key={dateLabel}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
                    <h2 className="text-xl font-bold text-white">{dateLabel}</h2>
                    <div className="flex-1 h-[1px] bg-white/10" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {items.map((item) => (
                      <MediaCard
                        key={item.id}
                        id={item.id}
                        mediaType={mediaType}
                        title={'title' in item ? item.title : item.name}
                        posterPath={item.poster_path}
                        year={'release_date' in item ? item.release_date : item.first_air_date}
                        rating={item.vote_average}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
