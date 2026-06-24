import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HorizontalScrollProps {
  title?: string;
  children: React.ReactNode;
  showArrows?: boolean;
  className?: string;
}

export function HorizontalScroll({ title, children, showArrows = true, className }: HorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    // Use a small threshold (1px) due to subpixel precision issues
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    
    container.scrollTo({
      left: container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
      behavior: 'smooth'
    });
  };

  return (
    <div className={cn("relative flex flex-col gap-4", className)}>
      {title && (
        <h2 className="text-xl md:text-2xl font-bold text-white px-4 md:px-8">
          {title}
        </h2>
      )}
      
      <div className="relative group">
        {/* Left Arrow */}
        {showArrows && showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-full w-12 items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <div className="rounded-full bg-black/50 p-2 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 hover:scale-110 transition-all">
              <ChevronLeft size={24} />
            </div>
          </button>
        )}

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto scrollbar-hide gap-4 px-4 md:px-8 pb-4 snap-x"
        >
          {React.Children.map(children, (child) => (
            <div className="snap-start shrink-0">
              {child}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showArrows && showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-full w-12 items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <div className="rounded-full bg-black/50 p-2 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 hover:scale-110 transition-all">
              <ChevronRight size={24} />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
