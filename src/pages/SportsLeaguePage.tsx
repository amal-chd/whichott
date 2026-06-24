import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getSportsLeague } from '@/lib/api/sportsMock';
import { ChevronLeft, BarChart2, Star, RefreshCw } from 'lucide-react';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';

export function SportsLeaguePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const league = getSportsLeague(id || '');

  const isEmoji = (str: string) => {
    if (!str) return false;
    return str.length <= 4 && !str.startsWith('/') && !str.startsWith('http');
  };

  if (!league) {
    return (
      <div className="py-32 text-center text-white">
        <h2 className="text-2xl font-bold">Competition Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-600 rounded-full text-sm">
          Go Home
        </button>
      </div>
    );
  }

  const isCricket = league.sport === 'cricket';

  return (
    <div className="container mx-auto px-4 md:px-8 py-24 flex-1 max-w-5xl space-y-8">
      <Helmet>
        <title>{`${league.name} Standings & Statistics - WhichSports`}</title>
      </Helmet>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors text-sm font-semibold mb-2"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-8 shadow-2xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner overflow-hidden p-2 border border-white/10 shrink-0">
          {league.logo && !isEmoji(league.logo) ? (
            <img src={league.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-4xl">{league.logo || '🏆'}</span>
          )}
        </div>
        <div>
          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 tracking-wider">
            {league.sport}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">{league.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. STANDINGS TABLE */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg w-full overflow-x-auto custom-scrollbar">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-400" /> League Standings
            </h3>
            
            <table className="w-full min-w-[max-content] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-text-muted font-bold uppercase tracking-wider text-[9px] pb-2">
                  <th className="py-2 px-1 text-center w-8">Pos</th>
                  <th className="py-2 px-2">Team</th>
                  <th className="py-2 px-2 text-center w-12">P</th>
                  <th className="py-2 px-2 text-center w-12">W</th>
                  {!isCricket && <th className="py-2 px-2 text-center w-12">D</th>}
                  <th className="py-2 px-2 text-center w-12">L</th>
                  {!isCricket && <th className="py-2 px-2 text-center w-12">GD</th>}
                  <th className="py-2 px-2 text-center w-12 font-black text-white">PTS</th>
                </tr>
              </thead>
              <tbody>
                {league.standings.map((team, idx) => (
                  <tr 
                    key={team.teamId} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/sports/team/${team.teamId}`)}
                  >
                    <td className="py-3 px-1 text-center font-bold text-text-muted">{team.position}</td>
                    <td className="py-3 px-2 font-bold text-white flex items-center gap-2">
                      <span className="text-lg w-6 h-6 flex items-center justify-center shrink-0">
                        {isEmoji(team.teamLogo) ? (
                          team.teamLogo
                        ) : (
                          <img src={team.teamLogo} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        )}
                      </span>
                      <span className="hover:text-blue-400 transition-colors truncate max-w-[150px]">
                        {team.teamName}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-white/80">{team.played}</td>
                    <td className="py-3 px-2 text-center text-green-400 font-semibold">{team.won}</td>
                    {!isCricket && <td className="py-3 px-2 text-center text-white/55">{team.drawn}</td>}
                    <td className="py-3 px-2 text-center text-red-400 font-semibold">{team.lost}</td>
                    {!isCricket && (
                      <td className={`py-3 px-2 text-center font-semibold ${
                        team.goalsDiff?.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>{team.goalsDiff}</td>
                    )}
                    <td className="py-3 px-2 text-center font-black text-white bg-white/5">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. TOP PERFORMERS SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star size={18} className="text-yellow-400 animate-pulse" /> Top Performers
            </h3>

            {/* Top Scorers */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-black text-text-muted tracking-wider">
                {isCricket ? 'Orange Cap (Most Runs)' : 'Top Scorers'}
              </h4>
              <div className="space-y-2">
                {league.topPerformers.scorers.map((player, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5 text-xs">
                    <div>
                      <div className="font-bold text-white">{player.name}</div>
                      <div className="text-[10px] text-text-muted">{player.team}</div>
                    </div>
                    <span className="font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded">
                      {player.value} {isCricket ? 'runs' : 'goals'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Assists / Wickets */}
            {((!isCricket && league.topPerformers.assists) || (isCricket && league.topPerformers.wickets)) && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-xs uppercase font-black text-text-muted tracking-wider">
                  {isCricket ? 'Purple Cap (Most Wickets)' : 'Top Assists'}
                </h4>
                <div className="space-y-2">
                  {isCricket
                    ? league.topPerformers.wickets?.map((player, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5 text-xs">
                          <div>
                            <div className="font-bold text-white">{player.name}</div>
                            <div className="text-[10px] text-text-muted">{player.team}</div>
                          </div>
                          <span className="font-black text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded">
                            {player.value} wickets
                          </span>
                        </div>
                      ))
                    : league.topPerformers.assists?.map((player, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5 text-xs">
                          <div>
                            <div className="font-bold text-white">{player.name}</div>
                            <div className="text-[10px] text-text-muted">{player.team}</div>
                          </div>
                          <span className="font-black text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded">
                            {player.value} assists
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            )}

          </div>

          <AdPlaceholder />
        </div>
      </div>
    </div>
  );
}
