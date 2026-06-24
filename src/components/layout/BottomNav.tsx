import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Bookmark, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/discover', icon: Compass, label: 'Discover' },
    { to: '/watchlist', icon: Bookmark, label: 'Watchlist', requiresAuth: true },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            
            if (item.requiresAuth && !user) {
              return (
                <button
                  key={item.label}
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex flex-col items-center justify-center p-2 min-w-[64px] min-h-[44px] gap-1 text-text-muted hover:text-white transition-colors"
                >
                  <item.icon size={20} className={isActive ? "text-primary" : ""} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: linkActive }) => cn(
                  "flex flex-col items-center justify-center p-2 min-w-[64px] min-h-[44px] gap-1 transition-colors",
                  linkActive ? "text-primary" : "text-text-muted hover:text-white"
                )}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}

          {/* Profile / Auth Button */}
          {!user ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex flex-col items-center justify-center p-2 min-w-[64px] min-h-[44px] gap-1 text-text-muted hover:text-white transition-colors"
            >
              <User size={20} />
              <span className="text-[10px] font-medium">Sign In</span>
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 min-w-[64px] min-h-[44px] gap-1 text-primary cursor-pointer" onClick={() => setIsAuthModalOpen(true)}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-5 h-5 rounded-full" />
              ) : (
                <User size={20} />
              )}
              <span className="text-[10px] font-medium">Profile</span>
            </div>
          )}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
