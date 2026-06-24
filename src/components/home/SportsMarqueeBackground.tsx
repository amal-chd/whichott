import React from 'react';

const SPORTS_POSTERS = [
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=342&h=513&fit=crop&auto=format&q=80', // Football
  'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=342&h=513&fit=crop&auto=format&q=80', // Football Stadium
  'https://images.unsplash.com/photo-1431324155629-1a6edd1d141d?w=342&h=513&fit=crop&auto=format&q=80', // Football Match
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=342&h=513&fit=crop&auto=format&q=80', // Soccer ball
  'https://images.unsplash.com/photo-1531415080290-bc9852fcc9e5?w=342&h=513&fit=crop&auto=format&q=80', // Cricket
  'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=342&h=513&fit=crop&auto=format&q=80', // Cricket Stadium
  'https://images.unsplash.com/photo-1624526261182-ab3dfc8502f1?w=342&h=513&fit=crop&auto=format&q=80', // Cricket Match
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=342&h=513&fit=crop&auto=format&q=80', // Basketball
  'https://images.unsplash.com/photo-1505666287802-931dc83948e9?w=342&h=513&fit=crop&auto=format&q=80', // Basketball Hoop
  'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=342&h=513&fit=crop&auto=format&q=80', // Basketball game
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=342&h=513&fit=crop&auto=format&q=80', // Tennis
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=342&h=513&fit=crop&auto=format&q=80', // Tennis player
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=342&h=513&fit=crop&auto=format&q=80', // F1
  'https://images.unsplash.com/photo-1610969623696-6e93246ebcf5?w=342&h=513&fit=crop&auto=format&q=80', // Race car
  'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=342&h=513&fit=crop&auto=format&q=80', // NFL
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=342&h=513&fit=crop&auto=format&q=80', // American Football
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=342&h=513&fit=crop&auto=format&q=80', // UFC / MMA
  'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=342&h=513&fit=crop&auto=format&q=80', // Boxing
  'https://images.unsplash.com/photo-1471295268309-0927d9e2722e?w=342&h=513&fit=crop&auto=format&q=80', // Baseball
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=342&h=513&fit=crop&auto=format&q=80', // Golf
];

export function SportsMarqueeBackground() {
  // Duplicate array to ensure seamless infinite scrolling
  const posters = [...SPORTS_POSTERS, ...SPORTS_POSTERS, ...SPORTS_POSTERS];

  // Split into three rows for a varied scrolling effect
  const row1 = posters.slice(0, 20);
  const row2 = posters.slice(20, 40);
  const row3 = posters.slice(40, 60);

  return (
    <div className="absolute inset-0 overflow-hidden z-0 bg-black pointer-events-none opacity-45 select-none">
      <div className="absolute inset-0 flex flex-col justify-center gap-4 md:gap-8 -rotate-12 scale-[1.3] transform-origin-center">
        
        {/* Row 1: Scroll Left */}
        <div className="flex gap-4 md:gap-8 animate-marquee">
          {row1.map((url, i) => (
            <img 
              key={`sr1-${i}`}
              src={url}
              alt=""
              className="w-32 md:w-48 lg:w-56 aspect-[2/3] object-cover rounded-xl shadow-2xl shrink-0"
              loading="lazy"
            />
          ))}
        </div>

        {/* Row 2: Scroll Right */}
        <div className="flex gap-4 md:gap-8 animate-marquee-reverse">
          {row2.map((url, i) => (
            <img 
              key={`sr2-${i}`}
              src={url}
              alt=""
              className="w-32 md:w-48 lg:w-56 aspect-[2/3] object-cover rounded-xl shadow-2xl shrink-0"
              loading="lazy"
            />
          ))}
        </div>

        {/* Row 3: Scroll Left */}
        <div className="flex gap-4 md:gap-8 animate-marquee">
          {row3.map((url, i) => (
            <img 
              key={`sr3-${i}`}
              src={url}
              alt=""
              className="w-32 md:w-48 lg:w-56 aspect-[2/3] object-cover rounded-xl shadow-2xl shrink-0"
              loading="lazy"
            />
          ))}
        </div>

      </div>
      
      {/* Gradients to fade out the edges and center */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black" />
    </div>
  );
}
