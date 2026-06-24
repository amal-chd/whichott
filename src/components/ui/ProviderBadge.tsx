import React from 'react';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from './ImageWithFallback';

interface ProviderBadgeProps {
  name: string;
  logoPath: string | null;
  type?: 'stream' | 'rent' | 'buy' | 'ads';
  className?: string;
}

export function ProviderBadge({ name, logoPath, type, className }: ProviderBadgeProps) {
  const logoUrl = logoPath ? `https://image.tmdb.org/t/p/w92${logoPath}` : null;

  return (
    <div className={cn("flex flex-col items-center gap-1.5 w-16", className)}>
      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105 border border-white/10">
        <ImageWithFallback
          src={logoUrl || ''}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-[10px] text-center font-medium text-text leading-tight line-clamp-2">
        {name}
      </span>
      {type && (
        <span className="text-[9px] uppercase tracking-wider text-text-muted font-semibold bg-white/5 px-1.5 py-0.5 rounded">
          {type}
        </span>
      )}
    </div>
  );
}
