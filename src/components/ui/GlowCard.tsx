import React from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
}

export function GlowCard({ children, className, glowColor = '#C026D3', ...props }: GlowCardProps) {
  // Convert hex to rgb for rgba usage if needed, or just use the raw color in a subtle way.
  // We'll apply the color directly as a very faint background gradient on hover.
  
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/10 transition-all duration-500 hover:border-white/20",
        className
      )}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%)`
      }}
      {...props}
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at 50% 0%, ${glowColor}15, transparent 70%)`
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
