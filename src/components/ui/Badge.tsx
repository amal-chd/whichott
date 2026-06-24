import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ children, className, variant = 'default', size = 'md', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors",
        size === 'sm' && "text-[10px] px-2 py-0.5",
        size === 'md' && "text-xs px-2.5 py-0.5",
        variant === 'default' && "bg-white/10 text-white hover:bg-white/20",
        variant === 'primary' && "bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-600/30",
        variant === 'secondary' && "bg-blue-600/20 text-blue-400 border border-blue-600/30",
        variant === 'outline' && "border border-white/20 text-white hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
