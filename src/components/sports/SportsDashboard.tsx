import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSportsLive } from '@/hooks/useSportsLive';
import type { MatchDetails } from '@/lib/api/sportsMock';
import { Activity, Calendar, Award, Zap } from 'lucide-react';

export function SportsDashboard() {
  const navigate = useNavigate();
  const { matches } = useSportsLive();

  // Filter matches by status
  const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'HALF TIME' || m.status === 'RAIN DELAY');
  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING');
  const trendingMatches = matches.slice(0, 4); // Use top 4 as trending

  const competitions = [
    { id: 'ucl', name: 'UEFA Champions League', sport: 'Football', logo: 'https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2021.svg', icon: '⚽', color: 'from-blue-600/20 to-indigo-800/10 border-blue-500/20' },
    { id: 'ipl', name: 'Indian Premier League', sport: 'Cricket', logo: 'https://upload.wikimedia.org/wikipedia/en/8/84/Indian_Premier_League_Official_Logo.svg', icon: '🏏', color: 'from-amber-500/20 to-orange-700/10 border-amber-500/20' },
    { id: 'nba', name: 'NBA Basketball', sport: 'Basketball', logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg', icon: '🏀', color: 'from-orange-500/20 to-red-600/10 border-orange-500/20' },
    { id: 'wimbledon', name: 'Wimbledon Tennis', sport: 'Tennis', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Wimbledon_Logo.svg', icon: '🎾', color: 'from-green-500/20 to-emerald-800/10 border-green-500/20' },
    { id: 'f1', name: 'Formula 1 Racing', sport: 'Formula 1', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg', icon: '🏎️', color: 'from-red-500/20 to-rose-800/10 border-red-500/20' },
  ];

  const handleMatchClick = (id: string) => {
    navigate(`/sports/match/${id}`);
  };

  const handleCompetitionClick = (id: string) => {
    navigate(`/sports/league/${id}`);
  };

  const isEmoji = (str: string) => {
    if (!str) return false;
    return str.length <= 4 && !str.startsWith('/') && !str.startsWith('http');
  };

  const renderLogo = (logo: string, sizeClass: string = "w-12 h-12 flex items-center justify-center") => {
    if (isEmoji(logo)) {
      return <span className={sizeClass}>{logo}</span>;
    }
    const isSmall = sizeClass.includes('text-2xl') || sizeClass.includes('w-6') || sizeClass.includes('h-6');
    const imgSize = isSmall ? "w-6 h-6" : "w-12 h-12";
    return (
      <div className={`${imgSize} flex items-center justify-center shrink-0 bg-white/5 rounded-lg p-0.5 overflow-hidden border border-white/5`}>
        <img src={logo} alt="logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* 1. Live Now Section */}
      {liveMatches.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Activity className="text-red-500 animate-pulse" size={20} />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Live Now</h2>
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
              {liveMatches.length} ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <motion.div
                key={match.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleMatchClick(match.id)}
                className="cursor-pointer relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)] group"
              >
                {/* Glow Background */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full" />
                
                <div className="flex items-center justify-between text-xs text-text-muted mb-4">
                  <span className="font-semibold uppercase tracking-wider">{match.leagueName}</span>
                  <span className="flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    {match.timeElapsed}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mt-2">
                  <div className="flex flex-col items-center flex-1 text-center gap-2">
                    {renderLogo(match.homeTeam.logo, "text-4xl")}
                    <span className="text-sm font-semibold text-white truncate max-w-[100px]">{match.homeTeam.name}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-1 px-4">
                    <div className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
                      <span>{match.score.home}</span>
                      <span className="text-white/30">:</span>
                      <span>{match.score.away}</span>
                    </div>
                    {match.score.homeDetail && (
                      <div className="text-[10px] text-text-muted text-center whitespace-nowrap mt-1">
                        <div>{match.score.homeDetail}</div>
                        <div>{match.score.awayDetail}</div>
                      </div>
                    )}
                    <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded mt-2 uppercase font-bold tracking-wider">
                      {match.status}
                    </span>
                  </div>

                  <div className="flex flex-col items-center flex-1 text-center gap-2">
                    {renderLogo(match.awayTeam.logo, "text-4xl")}
                    <span className="text-sm font-semibold text-white truncate max-w-[100px]">{match.awayTeam.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Upcoming Matches */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Calendar className="text-blue-500" size={20} />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Upcoming Matches (24h)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => handleMatchClick(match.id)}
              className="cursor-pointer flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all"
            >
              <div className="flex items-center gap-3">
                {renderLogo(match.homeTeam.logo, "text-2xl w-6 h-6")}
                <span className="text-sm font-bold text-white">{match.homeTeam.name}</span>
                <span className="text-xs text-text-muted">vs</span>
                {renderLogo(match.awayTeam.logo, "text-2xl w-6 h-6")}
                <span className="text-sm font-bold text-white">{match.awayTeam.name}</span>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{match.leagueName}</div>
                <div className="text-[11px] text-text-muted">Starts in 3 hours</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Top Competitions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Award className="text-purple-500" size={20} />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Top Competitions</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {competitions.map((comp) => (
            <motion.div
              key={comp.id}
              whileHover={{ y: -5 }}
              onClick={() => handleCompetitionClick(comp.id)}
              className={`cursor-pointer overflow-hidden rounded-xl border ${comp.color} bg-gradient-to-br p-4 flex flex-col items-center text-center justify-center min-h-[120px] shadow-lg backdrop-blur-md transition-all`}
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl p-1.5 flex items-center justify-center overflow-hidden mb-2 border border-white/10 shrink-0">
                {comp.logo ? (
                  <img src={comp.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-3xl">{comp.icon}</span>
                )}
              </div>
              <span className="text-xs font-black uppercase text-white/50 tracking-wider mb-1">{comp.sport}</span>
              <span className="text-sm font-bold text-white leading-tight">{comp.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Trending Matches */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Zap className="text-yellow-500" size={20} />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Trending Today</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => handleMatchClick(match.id)}
              className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col justify-between h-[110px] transition-all"
            >
              <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{match.leagueName}</div>
              <div className="flex items-center justify-between my-2">
                <span className="text-sm font-medium text-white truncate max-w-[80px]">{match.homeTeam.name}</span>
                <span className="text-xs font-bold text-white px-2 py-0.5 bg-white/10 rounded">
                  {match.status === 'LIVE' ? `${match.score.home}-${match.score.away}` : 'VS'}
                </span>
                <span className="text-sm font-medium text-white truncate max-w-[80px]">{match.awayTeam.name}</span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-text-muted font-bold">
                <span>{match.sport.toUpperCase()}</span>
                {match.status === 'LIVE' && <span className="text-red-400 animate-pulse">LIVE</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
