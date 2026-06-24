import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TMDBSeason } from '@/lib/api/types';
import { useTVSeason } from '@/hooks/useTVSeason';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { EpisodeList } from './EpisodeList';

interface SeasonsListProps {
  seasons: TMDBSeason[];
  tvId: number;
}

export function SeasonsList({ seasons, tvId }: SeasonsListProps) {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);

  // Exclude specials (season_number = 0) by default unless it's the only season
  const regularSeasons = seasons.filter(s => s.season_number > 0);
  const displaySeasons = regularSeasons.length > 0 ? regularSeasons : seasons;

  if (!displaySeasons || displaySeasons.length === 0) return null;

  return (
    <div className="container mx-auto px-4 md:px-8 mt-16">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Seasons</h2>
      
      <div className="flex flex-col gap-4">
        {displaySeasons.map(season => (
          <SeasonRow 
            key={season.id} 
            season={season} 
            tvId={tvId}
            isExpanded={expandedSeason === season.season_number}
            onToggle={() => setExpandedSeason(
              expandedSeason === season.season_number ? null : season.season_number
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface SeasonRowProps {
  season: TMDBSeason;
  tvId: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function SeasonRow({ season, tvId, isExpanded, onToggle }: SeasonRowProps) {
  const { season: seasonData, isLoading } = useTVSeason(tvId, season.season_number, isExpanded);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-16 rounded overflow-hidden shrink-0 bg-surface-light hidden sm:block">
            <ImageWithFallback
              src={season.poster_path ? `https://image.tmdb.org/t/p/w92${season.poster_path}` : ''}
              alt={season.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {season.name}
            </h3>
            <p className="text-sm text-text-muted mt-1">
              {season.episode_count} Episodes 
              {season.air_date && ` • ${new Date(season.air_date).getFullYear()}`}
            </p>
          </div>
        </div>
        <div className="p-2 rounded-full bg-white/5 text-white/70">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="p-4 bg-black/20">
              <EpisodeList 
                episodes={seasonData?.episodes || []} 
                isLoading={isLoading} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
