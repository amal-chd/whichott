import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Code, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-surface-dark overflow-hidden mt-auto">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-2xl font-extrabold tracking-tighter text-white">
              Which<span className="gradient-text">OTT</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Your ultimate guide to the streaming universe. Instantly discover where to watch your favorite movies and TV shows across all OTT platforms.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <SocialLink href="#" icon={<Globe size={18} />} />
              <SocialLink href="#" icon={<MessageCircle size={18} />} />
              <SocialLink href="#" icon={<Code size={18} />} />
              <SocialLink href="mailto:contact@whichott.com" icon={<Mail size={18} />} />
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-bold mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><FooterLink to="/trending">Trending Now</FooterLink></li>
              <li><FooterLink to="/search?q=movies">Popular Movies</FooterLink></li>
              <li><FooterLink to="/search?q=tv">Top TV Shows</FooterLink></li>
              <li><FooterLink to="/watchlist">My Watchlist</FooterLink></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><FooterLink to="#">Terms of Service</FooterLink></li>
              <li><FooterLink to="#">Privacy Policy</FooterLink></li>
              <li><FooterLink to="#">Cookie Policy</FooterLink></li>
              <li><FooterLink to="#">Contact Us</FooterLink></li>
            </ul>
          </div>

          {/* Attributions */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold">Data Providers</h3>
            
            <div className="flex flex-col gap-2">
              <span className="text-xs text-text-muted">Movie & TV Data</span>
              <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity w-fit">
                <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" className="h-4" />
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-text-muted">Streaming Availability</span>
              <a href="https://www.justwatch.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity w-fit">
                <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1">
                  Just<span className="bg-[#FBC500] text-black px-1 rounded-sm ml-0.5">Watch</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} WhichOTT. All rights reserved.</p>
          <p>Designed for cinema lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-sm text-text-muted hover:text-white transition-colors">
      {children}
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all"
    >
      {icon}
    </a>
  );
}
