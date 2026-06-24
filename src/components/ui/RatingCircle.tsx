import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn, getRatingColor } from '@/lib/utils';

interface RatingCircleProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function RatingCircle({ rating, size = 'md', label, className }: RatingCircleProps) {
  const [progress, setProgress] = useState(0);
  
  // Calculate percentage (0-100)
  const percentage = Math.round(rating * 10);
  
  // Dimensions based on size
  const dimensions = {
    sm: { size: 36, strokeWidth: 3, textSize: 'text-[10px]' },
    md: { size: 48, strokeWidth: 4, textSize: 'text-xs' },
    lg: { size: 64, strokeWidth: 5, textSize: 'text-base' },
  };
  
  const d = dimensions[size];
  const radius = (d.size - d.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const colorClass = getRatingColor(rating);

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div 
        className="relative flex items-center justify-center bg-black rounded-full"
        style={{ width: d.size, height: d.size }}
      >
        <svg
          className="absolute inset-0 transform -rotate-90"
          width={d.size}
          height={d.size}
        >
          {/* Background circle */}
          <circle
            className="text-white/10"
            strokeWidth={d.strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={d.size / 2}
            cy={d.size / 2}
          />
          {/* Progress circle */}
          <motion.circle
            className={colorClass}
            strokeWidth={d.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={d.size / 2}
            cy={d.size / 2}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <span className={cn("font-bold text-white", d.textSize)}>
          {rating > 0 ? rating.toFixed(1) : 'NR'}
        </span>
      </div>
      {label && <span className="text-xs font-medium text-text-muted">{label}</span>}
    </div>
  );
}
