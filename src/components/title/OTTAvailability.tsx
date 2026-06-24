import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MonitorPlay } from 'lucide-react';
import type { WatchProviderResult } from '@/lib/api/types';
import { useWatchProviders } from '@/hooks/useWatchProviders';
import { useCountry } from '@/context/CountryContext';
import { ProviderBadge } from '../ui/ProviderBadge';
import { GlowCard } from '../ui/GlowCard';
import { CountrySelector } from '../search/CountrySelector';
import { cn } from '@/lib/utils';

interface OTTAvailabilityProps {
  watchProviders?: WatchProviderResult;
  title: string;
}

export function OTTAvailability({ watchProviders, title }: OTTAvailabilityProps) {
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 -mt-6 relative z-20">
      <GlowCard className="p-6 md:p-8" glowColor="#C026D3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-xl text-primary">
              <MonitorPlay size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Where to Watch</h2>
              <p className="text-text-muted text-sm mt-1">Streaming availability for {title}</p>
            </div>
          </div>
          
          <div className="self-start md:self-auto">
            <CountrySelector />
          </div>
        </div>

        {!hasProviders ? (
          <div className="py-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-text-muted text-lg">Not available in your selected country.</p>
            <p className="text-text-muted/60 text-sm mt-2">Try changing the country to see availability elsewhere.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
              {hasStream && (
                <button 
                  onClick={() => setActiveTab('stream')}
                  className={cn("px-4 py-2 font-semibold text-sm rounded-lg transition-colors", activeTab === 'stream' ? "bg-primary text-white" : "text-text-muted hover:bg-white/5")}
                >
                  Stream
                </button>
              )}
              {hasRent && (
                <button 
                  onClick={() => setActiveTab('rent')}
                  className={cn("px-4 py-2 font-semibold text-sm rounded-lg transition-colors", activeTab === 'rent' ? "bg-primary text-white" : "text-text-muted hover:bg-white/5")}
                >
                  Rent
                </button>
              )}
              {hasBuy && (
                <button 
                  onClick={() => setActiveTab('buy')}
                  className={cn("px-4 py-2 font-semibold text-sm rounded-lg transition-colors", activeTab === 'buy' ? "bg-primary text-white" : "text-text-muted hover:bg-white/5")}
                >
                  Buy
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                variants={container}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="flex flex-col gap-8"
              >
                {activeTab === 'stream' && (
                  <>
                    {stream.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Subscription</h3>
                        <div className="flex flex-wrap gap-4 md:gap-6">
                          {stream.map(provider => (
                            <motion.div key={`stream-${provider.provider_id}`} variants={item}>
                              <ProviderBadge 
                                name={provider.provider_name} 
                                logoPath={provider.logo_path} 
                                type="stream"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    {ads.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">With Ads / Free</h3>
                        <div className="flex flex-wrap gap-4 md:gap-6">
                          {ads.map(provider => (
                            <motion.div key={`ads-${provider.provider_id}`} variants={item}>
                              <ProviderBadge 
                                name={provider.provider_name} 
                                logoPath={provider.logo_path} 
                                type="ads"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'rent' && rent.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Rent</h3>
                    <div className="flex flex-wrap gap-4 md:gap-6">
                      {rent.map(provider => (
                        <motion.div key={`rent-${provider.provider_id}`} variants={item}>
                          <ProviderBadge 
                            name={provider.provider_name} 
                            logoPath={provider.logo_path} 
                            type="rent"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'buy' && buy.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Buy</h3>
                    <div className="flex flex-wrap gap-4 md:gap-6">
                      {buy.map(provider => (
                        <motion.div key={`buy-${provider.provider_id}`} variants={item}>
                          <ProviderBadge 
                            name={provider.provider_name} 
                            logoPath={provider.logo_path} 
                            type="buy"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </GlowCard>
    </div>
  );
}
