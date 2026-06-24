import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { NotificationToast } from '../ui/NotificationToast';

export function RootLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      <Header transparent={isHomePage} />
      <NotificationToast />
      
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
      
      {!isHomePage && <Footer />}
    </div>
  );
}
