import React from 'react';
import { cn } from '@/lib/utils';

interface GenrePillProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export function GenrePill({ name, className, ...props }: GenrePillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:border-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]",
        className
      )}
      {...props}
    >
      {name}
    </span>
  );
}
