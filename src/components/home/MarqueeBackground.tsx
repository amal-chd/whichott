import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrending } from '@/lib/api/tmdb';
import { getPosterUrl } from '@/lib/api/tmdb';

export function MarqueeBackground() {
  const { data, isLoading } = useQuery({
    queryKey: ['marquee-posters'],
    queryFn: () => getTrending('all', 'week'),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  if (isLoading || !data?.results) {
    return <div className="absolute inset-0 bg-black z-0" />;
  }

  // Duplicate results to ensure seamless infinite scrolling
  const posters = [...data.results, ...data.results, ...data.results]
    .map(item => item.poster_path)
    .filter(Boolean) as string[];

  // Split into three rows for a varied scrolling effect
  const row1 = posters.slice(0, 20);
  const row2 = posters.slice(20, 40);
  const row3 = posters.slice(40, 60);

  return (
    <div className="absolute inset-0 overflow-hidden z-0 bg-black pointer-events-none opacity-40 select-none">
      <div className="absolute inset-0 flex flex-col justify-center gap-4 md:gap-8 -rotate-12 scale-[1.3] transform-origin-center">
        
        {/* Row 1: Scroll Left */}
        <div className="flex gap-4 md:gap-8 animate-marquee">
          {row1.map((path, i) => (
            <img 
              key={`r1-${i}`}
              src={getPosterUrl(path, 'w342')}
              alt=""
              className="w-32 md:w-48 lg:w-56 aspect-[2/3] object-cover rounded-xl shadow-2xl shrink-0"
              loading="lazy"
            />
          ))}
        </div>

        {/* Row 2: Scroll Right */}
        <div className="flex gap-4 md:gap-8 animate-marquee-reverse">
          {row2.map((path, i) => (
            <img 
              key={`r2-${i}`}
              src={getPosterUrl(path, 'w342')}
              alt=""
              className="w-32 md:w-48 lg:w-56 aspect-[2/3] object-cover rounded-xl shadow-2xl shrink-0"
              loading="lazy"
            />
          ))}
        </div>

        {/* Row 3: Scroll Left */}
        <div className="flex gap-4 md:gap-8 animate-marquee">
          {row3.map((path, i) => (
            <img 
              key={`r3-${i}`}
              src={getPosterUrl(path, 'w342')}
              alt=""
              className="w-32 md:w-48 lg:w-56 aspect-[2/3] object-cover rounded-xl shadow-2xl shrink-0"
              loading="lazy"
            />
          ))}
        </div>

      </div>
      
      {/* Gradients to fade out the edges and center */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black" />
    </div>
  );
}
