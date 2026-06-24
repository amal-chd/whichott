import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePersonDetails } from '@/hooks/usePersonDetails';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { MediaCard } from '@/components/ui/MediaCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import type { ContentType } from '@/lib/api/types';

export function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const parsedId = parseInt(id || '0', 10);
  
  const { person, isLoading, error } = usePersonDetails(parsedId);
  const [showFullBio, setShowFullBio] = useState(false);

  if (isLoading) return <PersonPageSkeleton />;

  if (error || !person) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Person Not Found</h2>
        <p className="text-text-muted">We couldn't find the requested person. They may have been removed or the ID is invalid.</p>
      </div>
    );
  }

  // Sort credits by popularity
  const knownFor = [...(person.combined_credits?.cast || []), ...(person.combined_credits?.crew || [])]
    .sort((a, b) => b.popularity - a.popularity)
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) // Deduplicate
    .slice(0, 18);

  const profileUrl = person.profile_path ? `https://image.tmdb.org/t/p/h632${person.profile_path}` : '';
  const biography = person.biography || "We don't have a biography for this person.";

  const maxBioLength = 500;
  const isLongBio = biography.length > maxBioLength;
  const displayBio = showFullBio || !isLongBio ? biography : `${biography.substring(0, maxBioLength)}...`;

  return (
    <div className="flex-1 pb-16 pt-24">
      <Helmet>
        <title>{person.name} — WhichOTT</title>
        <meta name="description" content={`Biography and known for list of ${person.name}.`} />
      </Helmet>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Profile Image & Personal Info */}
          <aside className="md:w-64 lg:w-80 shrink-0">
            <div className="w-48 md:w-full max-w-sm mx-auto aspect-[2/3] rounded-2xl overflow-hidden bg-surface-light border border-white/10 shadow-2xl mb-8">
              {profileUrl ? (
                <ImageWithFallback src={profileUrl} alt={person.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <User size={80} />
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <h3 className="text-lg font-bold text-white mb-4">Personal Info</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white/60">Known For</h4>
                  <p className="text-white">{person.known_for_department}</p>
                </div>
                {person.birthday && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/60">Born</h4>
                    <p className="text-white">{new Date(person.birthday).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                )}
                {person.place_of_birth && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/60">Place of Birth</h4>
                    <p className="text-white">{person.place_of_birth}</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Column: Bio & Known For */}
          <main className="flex-1">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">{person.name}</h1>
            
            <div className="mb-10">
              <h2 className="text-xl font-bold text-white mb-3">Biography</h2>
              <div className="text-text-muted text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {displayBio}
              </div>
              {isLongBio && (
                <button 
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="mt-2 text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-1"
                >
                  {showFullBio ? (
                    <>Read Less <ChevronUp size={16} /></>
                  ) : (
                    <>Read More <ChevronDown size={16} /></>
                  )}
                </button>
              )}
            </div>

            {knownFor.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Known For</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {knownFor.map((item) => (
                    <MediaCard
                      key={`${item.media_type}-${item.id}`}
                      id={item.id}
                      mediaType={(item.media_type as ContentType) || 'movie'}
                      title={'title' in item ? item.title || '' : item.name || ''}
                      posterPath={item.poster_path ?? null}
                      year={'release_date' in item ? item.release_date : item.first_air_date}
                      rating={item.vote_average}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function PersonPageSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-16 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <aside className="md:w-64 lg:w-80 shrink-0">
          <Skeleton className="w-48 md:w-full aspect-[2/3] rounded-2xl bg-white/5 mx-auto mb-8" />
          <div className="hidden md:block space-y-4">
            <Skeleton className="h-6 w-32 bg-white/5" />
            <Skeleton className="h-4 w-24 bg-white/5" />
            <Skeleton className="h-4 w-28 bg-white/5" />
          </div>
        </aside>
        <main className="flex-1 space-y-6">
          <Skeleton className="h-12 w-64 bg-white/5" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-3/4 bg-white/5" />
          </div>
          <Skeleton className="h-8 w-40 bg-white/5 mt-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full rounded-2xl bg-white/5" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
