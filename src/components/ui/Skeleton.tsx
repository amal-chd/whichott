import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer bg-white/10",
        variant === 'circular' && "rounded-full",
        variant === 'rectangular' && "rounded-md",
        variant === 'text' && "rounded h-4",
        className
      )}
      {...props}
    />
  );
}
