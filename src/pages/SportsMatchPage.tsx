import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSportsLive } from '@/hooks/useSportsLive';
import { getSportsMatch, getSportsLeague } from '@/lib/api/sportsMock';
import type { MatchEvent } from '@/lib/api/sportsMock';
import { motion } from 'framer-motion';
import { Bell, BellOff, Award, ChevronLeft, Tv, User, Heart, Share2 } from 'lucide-react';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';

type ActiveTab = 'timeline' | 'stats' | 'lineups';

export function SportsMatchPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use our live hook to get synchronized, ticking match data
  const { match: liveMatch } = useSportsLive(id);
  const staticMatch = getSportsMatch(id || '');
  const match = liveMatch || staticMatch;
  const league = match ? getSportsLeague(match.leagueId) : undefined;

  const isEmoji = (str: string) => {
    if (!str) return false;
    return str.length <= 4 && !str.startsWith('/') && !str.startsWith('http');
  };

  const renderLogo = (logo: string, sizeClass: string = "text-6xl md:text-7xl") => {
    if (isEmoji(logo)) {
      return <span className={`${sizeClass} hover:scale-110 transition-transform`}>{logo}</span>;
    }
    return (
      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl p-1.5 flex items-center justify-center overflow-hidden border border-white/10 hover:scale-110 transition-transform shadow-inner">
        <img src={logo} alt="logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
      </div>
    );
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');
  const [followedTeams, setFollowedTeams] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('followed_teams');
      if (saved) setFollowedTeams(JSON.parse(saved));
    } catch (e) {}
  }, []);

  if (!match) {
    return (
      <div className="py-32 text-center text-white">
        <h2 className="text-2xl font-bold">Match Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-600 rounded-full text-sm">
          Go Home
        </button>
      </div>
    );
  }

  const isLive = match.status === 'LIVE' || match.status === 'HALF TIME' || match.status === 'RAIN DELAY';
  const isFollowingHome = followedTeams.includes(match.homeTeam.id);
  const isFollowingAway = followedTeams.includes(match.awayTeam.id);

  const toggleFollowTeam = (teamId: string) => {
    let newFollows = [...followedTeams];
    if (newFollows.includes(teamId)) {
      newFollows = newFollows.filter(t => t !== teamId);
    } else {
      newFollows.push(teamId);
    }
    setFollowedTeams(newFollows);
    try {
      localStorage.setItem('followed_teams', JSON.stringify(newFollows));
    } catch (e) {}
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-24 flex-1 max-w-5xl space-y-8">
      <Helmet>
        <title>{`${match.homeTeam.name} vs ${match.awayTeam.name} Live Score - WhichSports`}</title>
      </Helmet>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors text-sm font-semibold mb-2"
      >
        <ChevronLeft size={16} /> Back to dashboard
      </button>

      {/* 1. SCOREBOARD (Visual Hero Element) */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        {/* League and status header */}
        <div className="flex items-center justify-between text-xs text-text-muted mb-6">
          <span className="font-black uppercase tracking-wider flex items-center gap-2">
            {league?.logo && !isEmoji(league.logo) ? (
              <img src={league.logo} alt="" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />
            ) : (
              <span>🏆</span>
            )}
            {match.leagueName}
          </span>
          <div className="flex items-center gap-3">
            {isLive && (
              <span className="flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-2.5 py-0.5 rounded-full text-[10px] animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                {match.timeElapsed}
              </span>
            )}
            <span className="bg-white/10 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
              {match.status}
            </span>
          </div>
        </div>

        {/* Scores & Team Details Grid */}
        <div className="grid grid-cols-3 items-center justify-center text-center py-4">
          
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2">
            <div 
              className="cursor-pointer"
              onClick={() => navigate(`/sports/team/${match.homeTeam.id}`)}
            >
              {renderLogo(match.homeTeam.logo, "text-6xl md:text-7xl")}
            </div>
            <h2 
              className="font-bold text-white text-base md:text-xl hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => navigate(`/sports/team/${match.homeTeam.id}`)}
            >
              {match.homeTeam.name}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
              <span>Rank #{match.homeTeam.ranking}</span>
              <span>•</span>
              <span className="flex gap-0.5">
                {match.homeTeam.form.map((f, i) => (
                  <span key={i} className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[8px] ${
                    f === 'W' ? 'bg-green-500 text-white' : f === 'L' ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                  }`}>{f}</span>
                ))}
              </span>
            </div>
            <button
              onClick={() => toggleFollowTeam(match.homeTeam.id)}
              className={`mt-2 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                isFollowingHome 
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400 hover:bg-blue-600/30' 
                  : 'bg-white/5 border-white/10 text-text-muted hover:text-white hover:bg-white/10'
              }`}
            >
              {isFollowingHome ? <BellOff size={11} /> : <Bell size={11} />}
              {isFollowingHome ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Score Counter */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl md:text-6xl font-black text-white tracking-widest flex items-center gap-2 md:gap-4 drop-shadow-lg">
              <span>{match.score.home}</span>
              <span className="text-white/20">:</span>
              <span>{match.score.away}</span>
            </div>

            {/* Cricket Details / Quarter Scores */}
            {match.sport === 'cricket' && (match.score.homeDetail || match.score.awayDetail) && (
              <div className="text-xs text-text-muted text-center mt-3 font-semibold space-y-0.5">
                <div>{match.score.homeDetail}</div>
                <div>{match.score.awayDetail}</div>
              </div>
            )}
            
            {match.sport === 'basketball' && match.score.quarterScores && (
              <div className="text-[10px] text-text-muted mt-3">
                <table className="mx-auto">
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="pr-2 font-bold">BOS</td>
                      {match.score.quarterScores.home.map((q, idx) => (
                        <td key={idx} className="px-1 text-white">{q}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="pr-2 font-bold">LAL</td>
                      {match.score.quarterScores.away.map((q, idx) => (
                        <td key={idx} className="px-1 text-white">{q}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Live Odds */}
            {match.liveOdds && (
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-text-muted bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <span>ODDS:</span>
                <span className="text-green-400">1: {match.liveOdds.home}</span>
                {match.liveOdds.draw && <span className="text-white/40">X: {match.liveOdds.draw}</span>}
                <span className="text-green-400">2: {match.liveOdds.away}</span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2">
            <div 
              className="cursor-pointer"
              onClick={() => navigate(`/sports/team/${match.awayTeam.id}`)}
            >
              {renderLogo(match.awayTeam.logo, "text-6xl md:text-7xl")}
            </div>
            <h2 
              className="font-bold text-white text-base md:text-xl hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => navigate(`/sports/team/${match.awayTeam.id}`)}
            >
              {match.awayTeam.name}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
              <span>Rank #{match.awayTeam.ranking}</span>
              <span>•</span>
              <span className="flex gap-0.5">
                {match.awayTeam.form.map((f, i) => (
                  <span key={i} className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[8px] ${
                    f === 'W' ? 'bg-green-500 text-white' : f === 'L' ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                  }`}>{f}</span>
                ))}
              </span>
            </div>
            <button
              onClick={() => toggleFollowTeam(match.awayTeam.id)}
              className={`mt-2 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                isFollowingAway 
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400 hover:bg-blue-600/30' 
                  : 'bg-white/5 border-white/10 text-text-muted hover:text-white hover:bg-white/10'
              }`}
            >
              {isFollowingAway ? <BellOff size={11} /> : <Bell size={11} />}
              {isFollowingAway ? 'Following' : 'Follow'}
            </button>
          </div>

        </div>
      </div>

      {/* 2. LIVE STREAMING CHANNELS / AVAILABILITY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Tv className="text-blue-500" size={20} />
          <div>
            <h4 className="text-sm font-bold text-white leading-none">Where to Watch Live</h4>
            <p className="text-[11px] text-text-muted mt-1">Available broadcasting channels in your country</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {match.availability.map((stream, idx) => (
            <a
              key={idx}
              href={stream.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm"
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isEmoji(stream.logo) ? (
                  <span className="text-lg leading-none">{stream.logo}</span>
                ) : (
                  <img src={stream.logo} alt={stream.provider} className="w-full h-full object-contain rounded-sm" referrerPolicy="no-referrer" />
                )}
              </div>
              <span>Watch on {stream.provider}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 3. TABS SELECTOR */}
      <div className="flex border-b border-white/10 pb-px">
        <div className="flex gap-6">
          {(['timeline', 'stats', 'lineups'] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-sm font-bold capitalize transition-colors ${
                activeTab === tab ? 'text-white' : 'text-text-muted hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  layoutId="activeMatchTab"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. TAB CONTENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {activeTab === 'timeline' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white mb-2">Match Events Timeline</h3>
              
              {match.timeline.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-6">The match has not started yet. Stay tuned!</p>
              ) : (
                <div className="relative border-l border-white/10 pl-6 ml-3 space-y-6">
                  {match.timeline.slice().reverse().map((event, idx) => {
                    let icon = '⏱️';
                    let bg = 'bg-white/10';
                    let text = 'text-white';

                    if (event.type === 'goal') {
                      icon = '⚽';
                      bg = 'bg-green-500/20';
                      text = 'text-green-400';
                    } else if (event.type === 'card_yellow') {
                      icon = '🟨';
                      bg = 'bg-yellow-500/20';
                      text = 'text-yellow-400';
                    } else if (event.type === 'card_red') {
                      icon = '🟥';
                      bg = 'bg-red-500/20';
                      text = 'text-red-400';
                    } else if (event.type === 'substitution') {
                      icon = '🔄';
                      bg = 'bg-blue-500/20';
                      text = 'text-blue-400';
                    } else if (event.type === 'var') {
                      icon = '🖥️';
                      bg = 'bg-purple-500/20';
                      text = 'text-purple-400';
                    } else if (event.type === 'wicket') {
                      icon = '🏏';
                      bg = 'bg-red-500/20';
                      text = 'text-red-400';
                    } else if (event.type === 'six') {
                      icon = '💥';
                      bg = 'bg-amber-500/20';
                      text = 'text-amber-400';
                    } else if (event.type === 'four') {
                      icon = '⚡';
                      bg = 'bg-blue-500/20';
                      text = 'text-blue-400';
                    }

                    return (
                      <div key={idx} className="relative group">
                        {/* Bullet Icon */}
                        <div className={`absolute -left-[37px] top-0.5 w-6 h-6 rounded-full ${bg} flex items-center justify-center text-xs border border-white/10 group-hover:scale-110 transition-transform`}>
                          {icon}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-text-muted bg-white/5 px-2 py-0.5 rounded">
                              {event.time}
                            </span>
                            {event.player && (
                              <span 
                                onClick={() => navigate(`/sports/player/${event.player?.toLowerCase()}`)}
                                className="text-xs font-bold text-blue-400 hover:underline cursor-pointer"
                              >
                                {event.player}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mt-1 font-medium ${text}`}>{event.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white mb-2">Match Statistics</h3>
              
              <div className="space-y-4">
                {match.stats.labels.map((label, idx) => {
                  const valHome = match.stats.home[idx];
                  const valAway = match.stats.away[idx];
                  
                  // Calculate percentages for bars
                  const numHome = typeof valHome === 'number' ? valHome : parseFloat(valHome.toString()) || 0;
                  const numAway = typeof valAway === 'number' ? valAway : parseFloat(valAway.toString()) || 0;
                  const total = numHome + numAway;
                  const homePercent = total > 0 ? (numHome / total) * 100 : 50;
                  const awayPercent = total > 0 ? (numAway / total) * 100 : 50;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>{valHome}</span>
                        <span className="text-text-muted uppercase tracking-wider text-[10px]">{label}</span>
                        <span>{valAway}</span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="h-2 rounded-full overflow-hidden bg-white/15 flex">
                        <div 
                          className="bg-blue-500 h-full rounded-l-full transition-all duration-500" 
                          style={{ width: `${homePercent}%` }}
                        />
                        <div 
                          className="bg-purple-500 h-full rounded-r-full transition-all duration-500 ml-auto" 
                          style={{ width: `${awayPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'lineups' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-8">
              {!match.lineups ? (
                <p className="text-sm text-text-muted text-center py-6">Rosters will be announced shortly.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Home Team */}
                  <div>
                    <h4 className="font-bold text-white border-b border-white/10 pb-2 mb-4 flex justify-between items-center text-sm">
                      <span>{match.homeTeam.name}</span>
                      <span className="text-xs text-text-muted">{match.lineups.home.formation || ''}</span>
                    </h4>
                    
                    <ul className="space-y-3">
                      {match.lineups.home.starting.map((p, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xs font-medium text-white/90">
                          <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">{p.number}</span>
                          <span className="font-bold text-[10px] text-text-muted uppercase w-6">{p.position}</span>
                          <span 
                            onClick={() => navigate(`/sports/player/${p.name.toLowerCase().split(' ')[0]}`)}
                            className="hover:text-blue-400 hover:underline cursor-pointer"
                          >
                            {p.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <h5 className="font-bold text-text-muted text-xs uppercase mt-6 mb-2">Substitutes</h5>
                    <p className="text-[11px] text-text-muted leading-relaxed">{match.lineups.home.subs.join(', ')}</p>
                  </div>

                  {/* Away Team */}
                  <div>
                    <h4 className="font-bold text-white border-b border-white/10 pb-2 mb-4 flex justify-between items-center text-sm">
                      <span>{match.awayTeam.name}</span>
                      <span className="text-xs text-text-muted">{match.lineups.away.formation || ''}</span>
                    </h4>
                    
                    <ul className="space-y-3">
                      {match.lineups.away.starting.map((p, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xs font-medium text-white/90">
                          <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">{p.number}</span>
                          <span className="font-bold text-[10px] text-text-muted uppercase w-6">{p.position}</span>
                          <span 
                            onClick={() => navigate(`/sports/player/${p.name.toLowerCase().split(' ')[0]}`)}
                            className="hover:text-blue-400 hover:underline cursor-pointer"
                          >
                            {p.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <h5 className="font-bold text-text-muted text-xs uppercase mt-6 mb-2">Substitutes</h5>
                    <p className="text-[11px] text-text-muted leading-relaxed">{match.lineups.away.subs.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar ads and insights */}
        <div className="space-y-6">
          {/* Fantasy Insight Card */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
              PREMIUM
            </div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              💡 Fantasy Insights
            </h4>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              Verstappen and Mbappe have high conversion stats for today. Subscribing to premium unlocks player-level Expected Goals profiles, batting matchups, and wickets predictions.
            </p>
            <button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase text-[10px] tracking-wider py-2.5 rounded-xl transition-colors">
              Unlock Fantasy Insights
            </button>
          </div>

          {/* AdSense Mock Banner */}
          <AdPlaceholder />
        </div>
      </div>
    </div>
  );
}
