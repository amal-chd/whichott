import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMode } from '@/context/ModeContext';
import { useCountry } from '@/context/CountryContext';
import { Navigate } from 'react-router-dom';
import { User, LogOut, Settings, Tv, Trophy, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const { mode, setMode } = useMode();
  const { country, setCountry } = useCountry();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex-1 container mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-12 max-w-4xl">
      <Helmet>
        <title>Profile | WhichOTT</title>
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-dark border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl mb-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-surface-light flex items-center justify-center shrink-0">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-text-muted" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{user.displayName || 'User'}</h1>
            <p className="text-text-muted text-sm md:text-base">{user.email}</p>
          </div>

          <button 
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors font-semibold mt-4 md:mt-0"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-dark border border-white/10 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-white">App Preferences</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-3 flex items-center gap-2">
                Default Mode
              </label>
              <div className="flex bg-surface-light rounded-xl p-1">
                <button
                  onClick={() => setMode('entertainment')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'entertainment' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'
                  }`}
                >
                  <Tv size={18} /> Movies & TV
                </button>
                <button
                  onClick={() => setMode('sports')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'sports' ? 'bg-blue-600 text-white shadow-lg' : 'text-text-muted hover:text-white'
                  }`}
                >
                  <Trophy size={18} /> Live Sports
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-3 flex items-center gap-2">
                <Globe size={16} /> Region (OTT Availability)
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-surface-light border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-primary transition-colors"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="GB">🇬🇧 United Kingdom</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="AU">🇦🇺 Australia</option>
                <option value="IN">🇮🇳 India</option>
                <option value="JP">🇯🇵 Japan</option>
                <option value="KR">🇰🇷 South Korea</option>
                <option value="FR">🇫🇷 France</option>
                <option value="DE">🇩🇪 Germany</option>
                <option value="IT">🇮🇹 Italy</option>
                <option value="ES">🇪🇸 Spain</option>
                <option value="BR">🇧🇷 Brazil</option>
                <option value="MX">🇲🇽 Mexico</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
