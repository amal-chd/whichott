import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { getTrending } from '@/lib/api/tmdb';
import { SearchBar } from '@/components/search/SearchBar';
import { MarqueeBackground } from '@/components/home/MarqueeBackground';
import { SportsMarqueeBackground } from '@/components/home/SportsMarqueeBackground';
import { useMode } from '@/context/ModeContext';
import { SportsDashboard } from '@/components/sports/SportsDashboard';
import { cn } from '@/lib/utils';

export function HomePage() {
  const navigate = useNavigate();
  const { mode, setMode } = useMode();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const isSports = mode === 'sports';

  // Fetch trending movies for the Entertainment mode
  const { data: trendingData } = useQuery({
    queryKey: ['trending-searches'],
    queryFn: () => getTrending('all', 'day'),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !isSports, // Only fetch in Entertainment mode
  });

  // Default fallbacks in case API is loading or fails
  const sampleSearches = [
    { title: "Interstellar", type: "movie", id: 157336 },
    { title: "Breaking Bad", type: "tv", id: 1396 },
    { title: "Attack on Titan", type: "tv", id: 1429 },
    { title: "The Office", type: "tv", id: 2316 }
  ];

  // Pick top 4 trending items with valid titles/names
  const dynamicSearches = trendingData?.results
    ? trendingData.results
        .filter(item => ('title' in item ? item.title : item.name))
        .slice(0, 4)
        .map(item => ({
          title: 'title' in item ? item.title : item.name,
          type: item.media_type,
          id: item.id
        }))
    : sampleSearches;

  return (
    <div 
      className={cn(
        "relative flex flex-col items-center w-full min-h-screen bg-black overflow-x-hidden py-16 transition-all duration-500",
        !isSports ? "justify-center" : "pt-28"
      )}
    >
      <Helmet>
        <title>
          {isSports 
            ? 'WhichSports — Live Scores, Standings & Sports Tracking' 
            : 'WhichOTT — Find Where to Watch Anything'}
        </title>
      </Helmet>

      {/* Background Marquee depending on Mode */}
      {isSports ? <SportsMarqueeBackground /> : <MarqueeBackground />}

      <div 
        className={cn(
          "relative z-10 w-full flex flex-col items-center text-center px-4 md:px-8",
          !isSports ? "mt-[-5vh] max-w-4xl" : "max-w-6xl"
        )}
      >
        
        {/* Logo and Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-6"
        >
          <div className="relative">
            {/* Dynamic Glow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className={`absolute -inset-6 blur-[100px] rounded-full -z-10 ${
                  isSports ? 'bg-blue-600/20' : 'bg-primary/20'
                }`}
              />
            </AnimatePresence>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white pb-2 drop-shadow-2xl">
              Which<span className={`bg-clip-text text-transparent bg-gradient-to-r transition-all duration-500 ${
                isSports ? 'from-blue-500 to-cyan-400' : 'from-primary to-secondary'
              }`}>{isSports ? 'Sports' : 'OTT'}</span>
            </h1>
          </div>
          <p className="mt-3 text-base md:text-lg text-text-muted font-medium tracking-wide max-w-md leading-relaxed">
            {isSports 
              ? 'Track live scores, standings, and matches across all sports.' 
              : 'Find where to stream, rent, or buy any movie or TV show.'}
          </p>
        </motion.div>

        {/* Mode Toggle (Apple Segmented Style for Simplicity) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative flex items-center bg-white/5 border border-white/10 p-1 rounded-full w-72 md:w-80 mb-8 shadow-lg backdrop-blur-md"
        >
          {/* Subtle sliding glass pill background */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full z-0 bg-white/10 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            animate={{
              left: isSports ? 'calc(50% + 2px)' : '4px',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{ width: 'calc(50% - 6px)' }}
          />
          
          <button
            onClick={() => setMode('entertainment')}
            className={`relative z-10 flex-1 py-2 text-xs md:text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 duration-300 ${
              !isSports ? 'text-white' : 'text-white/40 hover:text-white/80'
            }`}
          >
            🎬 Entertainment
          </button>
          
          <button
            onClick={() => setMode('sports')}
            className={`relative z-10 flex-1 py-2 text-xs md:text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 duration-300 ${
              isSports ? 'text-white' : 'text-white/40 hover:text-white/80'
            }`}
          >
            🏆 Sports
          </button>
        </motion.div>

        {/* Search Bar Container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl"
        >
          <SearchBar variant="hero" onSearch={handleSearch} autoFocus />
        </motion.div>

        {/* Dynamic bottom views */}
        <AnimatePresence mode="wait">
          {isSports ? (
            /* Sports Dashboard View */
            <motion.div
              key="sports-dashboard"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="w-full mt-12"
            >
              <SportsDashboard />
            </motion.div>
          ) : (
            /* Entertainment Trending Today View */
            <motion.div
              key="trending-today"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-xs text-text-muted/60 font-semibold uppercase tracking-wider mr-1">Trending Today:</span>
              {dynamicSearches.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => navigate(`/title/${sample.type}/${sample.id}`)}
                  className="text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:border-primary/50 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-[0_0_15px_rgba(192,38,211,0.3)] hover:-translate-y-0.5"
                >
                  {sample.title}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
