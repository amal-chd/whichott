import React from 'react';

export function AdPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md p-4 text-center select-none">
      <div className="text-[9px] font-black uppercase text-text-muted/40 tracking-wider mb-2">
        Advertisement
      </div>
      <div className="border border-dashed border-white/10 rounded-xl py-8 flex flex-col items-center justify-center bg-black/25">
        <span className="text-lg mb-1">📢</span>
        <span className="text-xs font-bold text-white/50">Google AdSense</span>
        <span className="text-[10px] text-text-muted/40 mt-1">Premium OTT & Live Alerts</span>
      </div>
    </div>
  );
}
