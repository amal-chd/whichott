import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WatchProviderResult } from '@/lib/api/types';
import { useWatchProviders } from '@/hooks/useWatchProviders';
import { useCountry } from '@/context/CountryContext';
import { ProviderBadge } from '../ui/ProviderBadge';
import { CountrySelector } from '../search/CountrySelector';
import { cn } from '@/lib/utils';

interface OTTAvailabilityProps {
  watchProviders?: WatchProviderResult;
  title: string;
  compact?: boolean;
}

export function OTTAvailability({ watchProviders, title, compact = false }: OTTAvailabilityProps) {
  const { country } = useCountry();
  const { stream, rent, buy, ads } = useWatchProviders(watchProviders, country);
  
  const hasStream = stream.length > 0 || ads.length > 0;
  const hasRent = rent.length > 0;
  const hasBuy = buy.length > 0;
  const hasProviders = hasStream || hasRent || hasBuy;

  const [activeTab, setActiveTab] = useState<'stream' | 'rent' | 'buy'>(
    hasStream ? 'stream' : hasRent ? 'rent' : hasBuy ? 'buy' : 'stream'
  );

  useEffect(() => {
    if (activeTab === 'stream' && !hasStream) setActiveTab(hasRent ? 'rent' : 'buy');
    if (activeTab === 'rent' && !hasRent) setActiveTab(hasStream ? 'stream' : 'buy');
    if (activeTab === 'buy' && !hasBuy) setActiveTab(hasStream ? 'stream' : 'rent');
  }, [hasStream, hasRent, hasBuy, activeTab]);

  if (!hasProviders) {
    return (
      <div className="flex items-center gap-4 py-4 mt-2">
        <p className="text-sm font-medium text-text-muted">Not available to watch in</p>
        <div className="scale-90 origin-left">
          <CountrySelector />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Tabs and Country Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-2">
        <div className="flex gap-2">
          {hasStream && (
            <button 
              onClick={() => setActiveTab('stream')}
              className={cn("px-3 py-1.5 font-semibold text-xs uppercase tracking-wider rounded-md transition-colors", activeTab === 'stream' ? "bg-white/20 text-white" : "text-text-muted hover:text-white hover:bg-white/5")}
            >
              Stream
            </button>
          )}
          {hasRent && (
            <button 
              onClick={() => setActiveTab('rent')}
              className={cn("px-3 py-1.5 font-semibold text-xs uppercase tracking-wider rounded-md transition-colors", activeTab === 'rent' ? "bg-white/20 text-white" : "text-text-muted hover:text-white hover:bg-white/5")}
            >
              Rent
            </button>
          )}
          {hasBuy && (
            <button 
              onClick={() => setActiveTab('buy')}
              className={cn("px-3 py-1.5 font-semibold text-xs uppercase tracking-wider rounded-md transition-colors", activeTab === 'buy' ? "bg-white/20 text-white" : "text-text-muted hover:text-white hover:bg-white/5")}
            >
              Buy
            </button>
          )}
        </div>
        <div className="scale-90 origin-right">
          <CountrySelector />
        </div>
      </div>

      {/* Provider Icons */}
      <div className="min-h-[60px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            {activeTab === 'stream' && (
              <>
                {stream.map(provider => (
                  <ProviderBadge key={`stream-${provider.provider_id}`} name={provider.provider_name} logoPath={provider.logo_path} type="stream" />
                ))}
                {ads.map(provider => (
                  <ProviderBadge key={`ads-${provider.provider_id}`} name={provider.provider_name} logoPath={provider.logo_path} type="ads" />
                ))}
              </>
            )}
            {activeTab === 'rent' && rent.map(provider => (
              <ProviderBadge key={`rent-${provider.provider_id}`} name={provider.provider_name} logoPath={provider.logo_path} type="rent" />
            ))}
            {activeTab === 'buy' && buy.map(provider => (
              <ProviderBadge key={`buy-${provider.provider_id}`} name={provider.provider_name} logoPath={provider.logo_path} type="buy" />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
