import React from 'react';
import type { TMDBKeyword, TMDBGenre } from '@/lib/api/types';
import { GenrePill } from '../ui/GenrePill';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OverviewProps {
  overview: string;
  tagline?: string;
  status: string;
  language: string;
  country?: string;
  budget?: number;
  revenue?: number;
  genres?: TMDBGenre[];
  keywords?: TMDBKeyword[];
  releaseDate?: string;
}

export function Overview({ 
  overview, 
  tagline, 
  status, 
  language, 
  country, 
  budget, 
  revenue, 
  genres, 
  keywords,
  releaseDate
}: OverviewProps) {
  return (
    <div className="container mx-auto px-4 md:px-8 mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* Left Col: Overview & Tagline */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white">Storyline</h2>
          
          {tagline && (
            <p className="text-xl italic font-light text-text-muted border-l-2 border-primary/50 pl-4">
              "{tagline}"
            </p>
          )}
          
          <p className="text-lg leading-relaxed text-white/80">
            {overview || "No overview available."}
          </p>

          {/* Genres */}
          {genres && genres.length > 0 && (
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <GenrePill key={genre.id} name={genre.name} />
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {keywords && keywords.length > 0 && (
            <div className="pt-4 border-t border-white/10 mt-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {keywords.slice(0, 15).map(keyword => (
                  <Badge key={keyword.id} variant="outline" className="text-text-muted border-white/10">
                    {keyword.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Metadata Grid */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-fit">
          <h3 className="text-lg font-bold text-white mb-6">Details</h3>
          
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {status && (
              <div>
                <dt className="text-sm font-semibold text-text-muted uppercase tracking-wider">Status</dt>
                <dd className="mt-1 text-base text-white font-medium">{status}</dd>
              </div>
            )}
            
            {releaseDate && (
              <div>
                <dt className="text-sm font-semibold text-text-muted uppercase tracking-wider">Release Date</dt>
                <dd className="mt-1 text-base text-white font-medium">{formatDate(releaseDate)}</dd>
              </div>
            )}
            
            {language && (
              <div>
                <dt className="text-sm font-semibold text-text-muted uppercase tracking-wider">Original Language</dt>
                <dd className="mt-1 text-base text-white font-medium uppercase">{language}</dd>
              </div>
            )}
            
            {country && (
              <div>
                <dt className="text-sm font-semibold text-text-muted uppercase tracking-wider">Country</dt>
                <dd className="mt-1 text-base text-white font-medium">{country}</dd>
              </div>
            )}
            
            {budget !== undefined && budget > 0 && (
              <div>
                <dt className="text-sm font-semibold text-text-muted uppercase tracking-wider">Budget</dt>
                <dd className="mt-1 text-base text-white font-medium">{formatCurrency(budget)}</dd>
              </div>
            )}
            
            {revenue !== undefined && revenue > 0 && (
              <div>
                <dt className="text-sm font-semibold text-text-muted uppercase tracking-wider">Revenue</dt>
                <dd className="mt-1 text-base text-white font-medium">{formatCurrency(revenue)}</dd>
              </div>
            )}
          </dl>
        </div>

      </div>
    </div>
  );
}
