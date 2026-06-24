import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTrending } from '@/hooks/useTrending';
import { usePopular } from '@/hooks/usePopular';
import { useTopRated } from '@/hooks/useTopRated';
import { HorizontalScroll } from '@/components/ui/HorizontalScroll';
import { MediaCard } from '@/components/ui/MediaCard';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Skeleton } from '@/components/ui/Skeleton';

export function TrendingPage() {
  const { data: trendingToday, isLoading: loadToday } = useTrending('all', 'day');
  const { data: trendingWeek, isLoading: loadWeek } = useTrending('all', 'week');
  const { data: popularMovies, isLoading: loadPopMovies } = usePopular('movie');
  const { data: popularShows, isLoading: loadPopShows } = usePopular('tv');
  const { data: topMovies, isLoading: loadTopMovies } = useTopRated('movie');
  const { data: topShows, isLoading: loadTopShows } = useTopRated('tv');

  const heroItem = trendingToday?.results?.[0];

  return (
    <div className="flex-1 pb-24">
      <Helmet>
        <title>Trending & Popular — WhichOTT</title>
      </Helmet>

      {/* Hero Section */}
      {loadToday ? (
        <div className="w-full h-[60vh] bg-surface-light relative animate-pulse" />
      ) : heroItem ? (
        <div className="relative w-full h-[60vh] flex flex-col justify-end pt-24 pb-12 mb-12">
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src={`https://image.tmdb.org/t/p/original${heroItem.backdrop_path}`}
              alt={(heroItem as any).title || (heroItem as any).name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 backdrop-gradient" />
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl flex flex-col gap-4"
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full w-fit backdrop-blur-md border border-primary/30">
                <span className="text-sm font-bold uppercase tracking-wider">#1 Trending Today</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
                {(heroItem as any).title || (heroItem as any).name}
              </h1>
              
              <p className="text-lg text-white/80 line-clamp-3 mt-2">
                {heroItem.overview}
              </p>

              <div className="mt-4">
                <Link 
                  to={`/title/${heroItem.media_type}/${heroItem.id}`}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}

      <div className="space-y-16 mt-12">
        <Section title="🔥 Trending Today" data={trendingToday?.results?.slice(1)} isLoading={loadToday} />
        <Section title="📈 Trending This Week" data={trendingWeek?.results} isLoading={loadWeek} />
        <Section title="🎬 Popular Movies" data={popularMovies?.results} isLoading={loadPopMovies} mediaType="movie" />
        <Section title="📺 Popular TV Shows" data={popularShows?.results} isLoading={loadPopShows} mediaType="tv" />
        <Section title="⭐ Top Rated Movies" data={topMovies?.results} isLoading={loadTopMovies} mediaType="movie" />
        <Section title="⭐ Top Rated TV Shows" data={topShows?.results} isLoading={loadTopShows} mediaType="tv" />
      </div>
    </div>
  );
}

function Section({ title, data, isLoading, mediaType }: { title: string, data?: any[], isLoading: boolean, mediaType?: 'movie' | 'tv' }) {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-32 md:w-40 lg:w-48 aspect-[2/3] rounded-xl shrink-0 bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <HorizontalScroll title={title}>
      {data.map(item => (
        <MediaCard
          key={`${item.media_type || mediaType}-${item.id}`}
          id={item.id}
          title={(item as any).title || (item as any).name || ''}
          posterPath={item.poster_path}
          mediaType={item.media_type || mediaType || 'movie'}
          year={(item as any).release_date ? new Date((item as any).release_date).getFullYear().toString() : (item as any).first_air_date ? new Date((item as any).first_air_date).getFullYear().toString() : undefined}
          rating={item.vote_average}
        />
      ))}
    </HorizontalScroll>
  );
}
