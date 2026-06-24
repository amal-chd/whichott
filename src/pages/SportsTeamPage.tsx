import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getSportsTeam } from '@/lib/api/sportsMock';
import { ChevronLeft, Bell, BellOff, Calendar, Users, BarChart2 } from 'lucide-react';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';

type ActiveTab = 'squad' | 'fixtures' | 'stats';

export function SportsTeamPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const team = getSportsTeam(id || '');

  const isEmoji = (str: string) => {
    if (!str) return false;
    return str.length <= 4 && !str.startsWith('/') && !str.startsWith('http');
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>('squad');
  const [followedTeams, setFollowedTeams] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('followed_teams');
      if (saved) setFollowedTeams(JSON.parse(saved));
    } catch (e) {}
  }, []);

  if (!team) {
    return (
      <div className="py-32 text-center text-white">
        <h2 className="text-2xl font-bold">Team Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-600 rounded-full text-sm">
          Go Home
        </button>
      </div>
    );
  }

  const isFollowing = followedTeams.includes(team.id);

  const toggleFollow = () => {
    let newFollows = [...followedTeams];
    if (isFollowing) {
      newFollows = newFollows.filter(t => t !== team.id);
    } else {
      newFollows.push(team.id);
    }
    setFollowedTeams(newFollows);
    try {
      localStorage.setItem('followed_teams', JSON.stringify(newFollows));
    } catch (e) {}
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-24 flex-1 max-w-5xl space-y-8">
      <Helmet>
        <title>{`${team.name} Profile - WhichSports`}</title>
      </Helmet>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors text-sm font-semibold mb-2"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Team Header Panel */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner overflow-hidden p-2 border border-white/10">
            {isEmoji(team.logo) ? (
              <span className="text-6xl md:text-7xl">{team.logo}</span>
            ) : (
              <img src={team.logo} alt="team logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            )}
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 tracking-wider">
                {team.sport}
              </span>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded bg-white/10 text-white tracking-wider">
                Pos #{team.position} in {team.leagueName}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{team.name}</h1>
            <p className="text-sm text-text-muted">Coach: <span className="text-white font-semibold">{team.coach}</span></p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <button
            onClick={toggleFollow}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold border transition-colors shadow-md ${
              isFollowing 
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400 hover:bg-blue-600/30' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isFollowing ? <BellOff size={14} /> : <Bell size={14} />}
            {isFollowing ? 'Following Team' : 'Follow Team'}
          </button>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-text-muted mr-1.5 font-bold uppercase tracking-wider text-[10px]">Form:</span>
            {team.form.map((f, i) => (
              <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                f === 'W' ? 'bg-green-500 text-white' : f === 'L' ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
              }`}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-white/10 pb-px">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('squad')}
            className={`relative pb-3 text-sm font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'squad' ? 'text-white' : 'text-text-muted hover:text-white'
            }`}
          >
            <Users size={16} /> Squad Roster
            {activeTab === 'squad' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`relative pb-3 text-sm font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'fixtures' ? 'text-white' : 'text-text-muted hover:text-white'
            }`}
          >
            <Calendar size={16} /> Matches & Results
            {activeTab === 'fixtures' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`relative pb-3 text-sm font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'stats' ? 'text-white' : 'text-text-muted hover:text-white'
            }`}
          >
            <BarChart2 size={16} /> Statistics
            {activeTab === 'stats' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2">
          
          {activeTab === 'squad' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Team Squad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.squad.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => navigate(`/sports/player/${player.id}`)}
                    className="cursor-pointer group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                        {player.number}
                      </span>
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm">{player.name}</div>
                        <div className="text-[10px] text-text-muted uppercase font-bold">{player.position}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fixtures' && (
            <div className="space-y-6">
              {/* Fixtures */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Upcoming Fixtures</h3>
                <div className="space-y-3">
                  {team.fixtures.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-white">{team.name}</span>
                        <span className="mx-2 text-text-muted">vs</span>
                        <span className="text-white/80">{f.opponent}</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded-full">
                        {f.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Recent Results</h3>
                <div className="space-y-3">
                  {team.results.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-white">{team.name}</span>
                        <span className="text-text-muted font-bold mx-2">{r.score}</span>
                        <span className="text-white/80">{r.opponent}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-muted">{r.date}</span>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${
                          r.result === 'W' ? 'bg-green-500 text-white' : r.result === 'L' ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                        }`}>{r.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 space-y-4">
              <h3 className="text-base font-bold text-white mb-4">Season Stats Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(team.stats).map(([label, value], i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                    <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{label}</div>
                    <div className="text-2xl font-black text-white mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar ads and insights */}
        <div className="space-y-6">
          <AdPlaceholder />
        </div>
      </div>
    </div>
  );
}
