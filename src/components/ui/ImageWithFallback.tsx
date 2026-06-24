import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function ImageWithFallback({ src, alt, fallback, className, ...props }: ImageWithFallbackProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-white/5", className)}>
      {!isLoaded && !error && (
        <Skeleton className="absolute inset-0 z-0" />
      )}
      <img
        src={error ? (fallback || 'https://via.placeholder.com/500x750?text=No+Image') : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError(true);
          setIsLoaded(true);
        }}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
}
