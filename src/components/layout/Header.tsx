import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SearchBar } from '../search/SearchBar';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { useMode } from '@/context/ModeContext';

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const { mode } = useMode();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isSports = mode === 'sports';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldBeTransparent = transparent && !isScrolled;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled 
            ? isSports
              ? "bg-black/50 backdrop-blur-2xl py-3 border-b border-blue-500/20 shadow-[0_4px_30px_rgba(59,130,246,0.15)]"
              : "bg-black/40 backdrop-blur-2xl py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0"
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <h1 className="text-2xl font-extrabold tracking-tight transition-all drop-shadow-md">
              <span className="text-white">Which</span>
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                isSports ? 'from-blue-500 to-cyan-400' : 'from-primary to-secondary'
              }`}>
                {isSports ? 'Sports' : 'OTT'}
              </span>
            </h1>
          </Link>

          {/* Search Bar - hidden on homepage */}
          {!isHomePage && (
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <SearchBar variant="compact" />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Link to="/search" className="p-2 text-text-muted hover:text-white transition-colors md:hidden">
              <Search size={20} />
            </Link>
            
            <button 
              className="md:hidden p-2 text-white hover:text-primary transition-colors z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-6 mr-4">
                  <Link to="/new" className="text-sm font-medium text-text-muted hover:text-white transition-colors">
                    New
                  </Link>
                  <Link to="/popular" className="text-sm font-medium text-text-muted hover:text-white transition-colors">
                    Popular
                  </Link>
                  <Link to="/watchlist" className="text-sm font-medium text-text-muted hover:text-white transition-colors">
                    Watchlist
                  </Link>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-sm font-medium text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/20 transition-all">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <User size={16} className="m-1" />
                        )}
                      </div>
                      <span className="max-w-[100px] truncate">{user.displayName?.split(' ')[0] || 'User'}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-surface-dark border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <Link to="/watchlist" className="block px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5">Watchlist</Link>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5">Profile</Link>
                      <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors">Sign Out</button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors shadow-[0_0_15px_rgba(192,38,211,0.4)]"
              >
                Sign In
              </button>
            )}

          </div>
        </div>
        
        {/* Mobile Search Bar - below header */}
        {!isHomePage && (
          <div className="md:hidden px-4 pb-4 pt-2">
            <SearchBar variant="compact" />
          </div>
        )}

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface-dark border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                <Link to="/new" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-primary transition-colors">New</Link>
                <Link to="/popular" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-primary transition-colors">Popular</Link>
                <Link to="/watchlist" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-primary transition-colors">Watchlist</Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-primary transition-colors">Profile</Link>
                
                <div className="h-px bg-white/10 my-2" />
                
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} className="m-2 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.displayName || 'User'}</p>
                        <p className="text-sm text-text-muted">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }} 
                      className="w-full py-3 bg-red-500/10 text-red-500 font-medium rounded-xl hover:bg-red-500/20 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.header>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
