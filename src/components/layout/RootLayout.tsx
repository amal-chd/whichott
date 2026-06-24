import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { NotificationToast } from '../ui/NotificationToast';

export function RootLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-background text-text pb-[calc(env(safe-area-inset-bottom)+4.5rem)] md:pb-0">
      <Header transparent={isHomePage} />
      <NotificationToast />
      
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
      
      {!isHomePage && <Footer />}
      <BottomNav />
    </div>
  );
}
