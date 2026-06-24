import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider } from '@/context/QueryProvider';
import { CountryProvider } from '@/context/CountryContext';
import { ProviderProvider } from '@/context/ProviderContext';
import { AuthProvider } from '@/context/AuthContext';
import { ModeProvider } from '@/context/ModeContext';
import { RootLayout } from '@/components/layout/RootLayout';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AnimatePresence } from 'framer-motion';

// Lazy loaded pages
const HomePage = React.lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
const SearchResultsPage = React.lazy(() => import('@/pages/SearchResultsPage').then(module => ({ default: module.SearchResultsPage })));
const TitlePage = React.lazy(() => import('@/pages/TitlePage').then(module => ({ default: module.TitlePage })));
const TrendingPage = React.lazy(() => import('@/pages/TrendingPage').then(module => ({ default: module.TrendingPage })));
const WatchlistPage = React.lazy(() => import('@/pages/WatchlistPage').then(module => ({ default: module.WatchlistPage })));
const DiscoverPage = React.lazy(() => import('@/pages/DiscoverPage').then(module => ({ default: module.DiscoverPage })));
const NewPage = React.lazy(() => import('@/pages/NewPage').then(module => ({ default: module.NewPage })));
const PersonPage = React.lazy(() => import('@/pages/PersonPage').then(module => ({ default: module.PersonPage })));
const SportsMatchPage = React.lazy(() => import('@/pages/SportsMatchPage').then(module => ({ default: module.SportsMatchPage })));
const SportsTeamPage = React.lazy(() => import('@/pages/SportsTeamPage').then(module => ({ default: module.SportsTeamPage })));
const SportsPlayerPage = React.lazy(() => import('@/pages/SportsPlayerPage').then(module => ({ default: module.SportsPlayerPage })));
const SportsLeaguePage = React.lazy(() => import('@/pages/SportsLeaguePage').then(module => ({ default: module.SportsLeaguePage })));

function FullPageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-black">
      <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary animate-spin" />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ModeProvider>
        <AuthProvider>
          <QueryProvider>
          <CountryProvider>
            <ProviderProvider>
              <BrowserRouter>
              <ScrollToTop />
              <AnimatePresence mode="wait">
                <Suspense fallback={<FullPageLoader />}>
                  <Routes>
                    <Route element={<RootLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/search" element={<SearchResultsPage />} />
                      <Route path="/title/:mediaType/:id" element={<TitlePage />} />
                      <Route path="/person/:id" element={<PersonPage />} />
                      <Route path="/trending" element={<TrendingPage />} />
                      <Route path="/popular" element={<DiscoverPage />} />
                      <Route path="/new" element={<NewPage />} />
                      <Route path="/watchlist" element={<WatchlistPage />} />
                      <Route path="/sports/match/:id" element={<SportsMatchPage />} />
                      <Route path="/sports/team/:id" element={<SportsTeamPage />} />
                      <Route path="/sports/player/:id" element={<SportsPlayerPage />} />
                      <Route path="/sports/league/:id" element={<SportsLeaguePage />} />
                      
                      {/* Fallback route */}
                      <Route path="*" element={
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center">
                          <h2 className="text-3xl font-bold text-white mb-4">404 - Page Not Found</h2>
                          <p className="text-text-muted mb-8">The page you are looking for doesn't exist.</p>
                          <a href="/" className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors">
                            Go Home
                          </a>
                        </div>
                      } />
                    </Route>
                  </Routes>
                </Suspense>
              </AnimatePresence>
              </BrowserRouter>
          </ProviderProvider>
        </CountryProvider>
      </QueryProvider>
    </AuthProvider>
      </ModeProvider>
    </HelmetProvider>
  );
}

export default App;
