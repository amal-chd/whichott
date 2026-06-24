import React from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TMDBCredits } from '@/lib/api/types';
import { HorizontalScroll } from '../ui/HorizontalScroll';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface CastCrewProps {
  credits: TMDBCredits;
}

export function CastCrew({ credits }: CastCrewProps) {
  const cast = credits?.cast?.slice(0, 20) || [];
  
  // Filter key crew members
  const keyCrewRoles = ['Director', 'Producer', 'Screenplay', 'Writer', 'Original Music Composer', 'Director of Photography'];
  const crew = credits?.crew?.filter(member => keyCrewRoles.includes(member.job)) || [];
  
  // Deduplicate crew by ID, taking their most prominent job
  const uniqueCrew = Array.from(new Map(crew.map(item => [item.id, item])).values()).slice(0, 10);

  if (cast.length === 0 && uniqueCrew.length === 0) return null;

  return (
    <div className="container mx-auto mt-16 space-y-12">
      
      {/* Cast Section */}
      {cast.length > 0 && (
        <HorizontalScroll title="Top Cast">
          {cast.map(actor => (
            <Link 
              key={`${actor.id}-${actor.character}`} 
              to={`/person/${actor.id}`}
              className="flex flex-col items-center gap-3 w-28 md:w-32 group"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white/10 border-2 border-transparent group-hover:border-primary/50 transition-colors shadow-lg shrink-0">
                {actor.profile_path ? (
                  <ImageWithFallback
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 bg-surface-light">
                    <User size={40} />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-white leading-tight group-hover:text-primary transition-colors">
                  {actor.name}
                </h4>
                <p className="text-xs text-text-muted mt-1 leading-snug line-clamp-2">
                  {actor.character}
                </p>
              </div>
            </Link>
          ))}
        </HorizontalScroll>
      )}

      {/* Crew Section */}
      {uniqueCrew.length > 0 && (
        <div className="px-4 md:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Key Crew</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {uniqueCrew.map(member => (
              <Link 
                key={`${member.id}-${member.job}`}
                to={`/person/${member.id}`}
                className="flex items-center gap-4 group bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-light">
                  {member.profile_path ? (
                    <ImageWithFallback
                      src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <User size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs text-text-muted truncate">
                    {member.job}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}
