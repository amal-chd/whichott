import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import { useTVDetails } from '@/hooks/useTVDetails';
import type { ContentType } from '@/lib/api/types';

import { HeroSection } from '@/components/title/HeroSection';
import { Overview } from '@/components/title/Overview';
import { CastCrew } from '@/components/title/CastCrew';
import { Trailers } from '@/components/title/Trailers';
import { SeasonsList } from '@/components/title/SeasonsList';
import { Recommendations } from '@/components/title/Recommendations';
import { ReviewsSection } from '@/components/title/ReviewsSection';
import { Skeleton } from '@/components/ui/Skeleton';

export function TitlePage() {
  const { mediaType, id } = useParams<{ mediaType: ContentType; id: string }>();
  const isMovie = mediaType === 'movie';
  const parsedId = parseInt(id || '0', 10);

  const movieData = useMovieDetails(isMovie ? parsedId : 0);
  const tvData = useTVDetails(!isMovie ? parsedId : 0);

  const { movie, ratings: omdbRatings, isLoading: isLoadingMovie, error: movieError } = movieData;
  const { show, isLoading: isLoadingTV, error: tvError } = tvData;

  const isLoading = isMovie ? isLoadingMovie : isLoadingTV;
  const error = isMovie ? movieError : tvError;
  const data = isMovie ? movie : show;

  if (isLoading) {
    return <TitlePageSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Title Not Found</h2>
        <p className="text-text-muted">We couldn't find the requested title. It may have been removed or the ID is invalid.</p>
      </div>
    );
  }

  const title = isMovie ? (data as any).title : (data as any).name;
  const description = data.overview || `Where to watch ${title} streaming online.`;
  const posterUrl = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '';

  return (
    <div className="flex-1 pb-8">
      <Helmet>
        <title>{title} — WhichOTT</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${title} — WhichOTT`} />
        <meta property="og:description" content={description} />
        {posterUrl && <meta property="og:image" content={posterUrl} />}
      </Helmet>

      <HeroSection 
        data={data} 
        mediaType={mediaType as ContentType} 
        omdbRatings={omdbRatings}
        watchProviders={data['watch/providers']}
      />
      
      <Overview 
        overview={data.overview}
        tagline={data.tagline}
        status={data.status}
        language={data.original_language}
        country={data.production_countries?.[0]?.name}
        budget={(data as any).budget}
        revenue={(data as any).revenue}
        keywords={(data as any).keywords?.keywords || (data as any).keywords?.results}
        releaseDate={isMovie ? (data as any).release_date : (data as any).first_air_date}
      />
      
      <CastCrew credits={data.credits!} />
      
      <Trailers videos={data.videos?.results || []} />
      
      {!isMovie && (data as any).seasons && (
        <SeasonsList seasons={(data as any).seasons} tvId={parsedId} />
      )}
      
      <Recommendations 
        recommendations={data.recommendations?.results} 
        similar={data.similar?.results} 
      />

      <ReviewsSection mediaId={parsedId} mediaType={isMovie ? 'movie' : 'tv'} />
    </div>
  );
}

function TitlePageSkeleton() {
  return (
    <div className="flex-1 animate-pulse">
      <div className="w-full h-[60vh] bg-surface-light relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="container mx-auto px-4 md:px-8 absolute bottom-0 translate-y-12">
          <div className="flex gap-8 items-end">
            <Skeleton className="w-48 md:w-64 aspect-[2/3] rounded-2xl shrink-0 bg-white/10" />
            <div className="flex-1 pb-4 space-y-4">
              <Skeleton className="h-12 w-3/4 max-w-lg bg-white/10" />
              <Skeleton className="h-6 w-1/2 max-w-md bg-white/10" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 bg-white/10 rounded-full" />
                <Skeleton className="h-6 w-20 bg-white/10 rounded-full" />
                <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-8 mt-24 space-y-16">
        <Skeleton className="h-48 w-full rounded-2xl bg-white/5" />
        <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-32 bg-white/5" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-3/4 bg-white/5" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
