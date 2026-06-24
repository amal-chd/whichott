import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDiscover } from '@/hooks/useDiscover';
import { useGenres } from '@/hooks/useGenres';
import type { ContentType } from '@/lib/api/types';
import { MediaCard } from '@/components/ui/MediaCard';
import { ProviderBar } from '@/components/ui/ProviderBar';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

export function DiscoverPage() {
  const [mediaType, setMediaType] = useState<ContentType>('movie');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filters
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [monetization, setMonetization] = useState<string>('');
  const [certification, setCertification] = useState<string>('');

  const { ref, inView } = useInView({ rootMargin: '400px' });
  const { data: genresData } = useGenres(mediaType);

  const filters = {
    sort_by: sortBy,
    with_genres: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined,
    'vote_average.gte': minRating > 0 ? minRating : undefined,
    'primary_release_date.gte': yearFrom ? `${yearFrom}-01-01` : undefined,
    'primary_release_date.lte': yearTo ? `${yearTo}-12-31` : undefined,
    'first_air_date.gte': yearFrom ? `${yearFrom}-01-01` : undefined,
    'first_air_date.lte': yearTo ? `${yearTo}-12-31` : undefined,
    with_watch_monetization_types: monetization || undefined,
    certification_country: certification ? 'US' : undefined,
    certification: certification || undefined,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useDiscover(mediaType, filters);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleGenre = (id: number) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setMinRating(0);
    setYearFrom('');
    setYearTo('');
    setMonetization('');
    setCertification('');
    setSortBy('popularity.desc');
  };

  return (
    <>
      <Helmet>
        <title>Popular & Discover | WhichOTT</title>
        <meta name="description" content="Discover popular movies and TV shows. Filter by genre, rating, release year, and your streaming services." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-12 flex flex-col">
        {/* Header Section */}
        <div className="container mx-auto px-4 md:px-8 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">Popular</h1>
            <p className="text-text-muted">Discover the most popular content across your services.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface-light border border-white/10 rounded-full text-sm font-medium hover:bg-white/5 transition-colors"
            >
              <Filter size={16} /> Filters
            </button>
            <div className="flex bg-surface-light border border-white/10 rounded-full p-1">
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
        </div>

        {/* Global Provider Bar */}
        <ProviderBar />

        <div className="container mx-auto px-4 md:px-8 flex-1 flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={cn(
            "lg:w-72 flex-shrink-0 space-y-8",
            isSidebarOpen ? "block" : "hidden lg:block"
          )}>
            <div className="glass border border-white/10 rounded-3xl p-6 sticky top-28 shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2"><SlidersHorizontal size={18} /> Filters</h2>
                <button onClick={clearFilters} className="text-xs text-primary hover:text-primary-dark transition-colors font-medium">Reset</button>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">Sort By</h3>
                <div className="relative">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="popularity.desc">Popularity Descending</option>
                    <option value="popularity.asc">Popularity Ascending</option>
                    <option value="vote_average.desc">Rating Descending</option>
                    <option value="primary_release_date.desc">Release Date Descending</option>
                    <option value="revenue.desc">Revenue Descending</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" />
                </div>
              </div>

              {/* Genres */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">Genres</h3>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2 pb-2">
                  {genresData?.map(genre => {
                    const isActive = selectedGenres.includes(genre.id);
                    return (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-300",
                          isActive
                            ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(192,38,211,0.2)]"
                            : "bg-white/5 border-white/10 text-text-muted hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {genre.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Min Rating</h3>
                  <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded">{minRating > 0 ? `${minRating}+` : 'Any'}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="9" step="1" 
                  value={minRating}
                  onChange={(e) => setMinRating(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-text-muted mt-1 px-1">
                  <span>0</span><span>5</span><span>9</span>
                </div>
              </div>

              {/* Price / Monetization */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">Price Model</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['flatrate', 'free', 'ads', 'rent', 'buy'].map(type => {
                    const isActive = monetization === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setMonetization(isActive ? '' : type)}
                        className={cn(
                          "relative px-3 py-2 rounded-xl text-xs font-semibold capitalize overflow-hidden transition-all duration-300",
                          isActive
                            ? "text-white shadow-[0_0_15px_rgba(192,38,211,0.3)] border border-primary/50"
                            : "bg-white/5 border border-white/10 text-text-muted hover:bg-white/10 hover:text-white",
                          type === 'flatrate' && "col-span-2"
                        )}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent pointer-events-none" />
                        )}
                        <span className="relative z-10">{type === 'flatrate' ? 'Stream (Subscription)' : type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Age Rating (Movies Only for now) */}
              {mediaType === 'movie' && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">Age Rating</h3>
                  <div className="relative">
                    <select 
                      value={certification} 
                      onChange={(e) => setCertification(e.target.value)}
                      className="w-full appearance-none bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Any</option>
                      <option value="G">G (All Ages)</option>
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                      <option value="NC-17">NC-17</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" />
                  </div>
                </div>
              )}

              {/* Release Year Range */}
              <div>
                <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">Release Year</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="From"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/20"
                  />
                  <span className="text-text-muted">-</span>
                  <input 
                    type="number" 
                    placeholder="To"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/20"
                  />
                </div>
              </div>

            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-shimmer" />
                ))}
              </div>
            ) : data?.pages[0]?.results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-text-muted">
                  <Filter size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                <p className="text-text-muted max-w-sm">Try adjusting your filters, genres, or selecting more streaming providers.</p>
                <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {data?.pages.map((page, pageIndex) => (
                  <React.Fragment key={pageIndex}>
                    {page.results.map((item) => (
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
                  </React.Fragment>
                ))}
              </div>
            )}
            
            {/* Infinite Scroll Loader */}
            <div ref={ref} className="h-20 flex items-center justify-center mt-8">
              {isFetchingNextPage && (
                <div className="w-8 h-8 rounded-full border-4 border-white/10 border-t-primary animate-spin" />
              )}
            </div>
          </main>

        </div>
      </div>
    </>
  );
}
