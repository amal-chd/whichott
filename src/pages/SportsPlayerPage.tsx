import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getSportsPlayer } from '@/lib/api/sportsMock';
import { ChevronLeft, Award, Activity, Heart } from 'lucide-react';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';

export function SportsPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const player = getSportsPlayer(id || '');

  if (!player) {
    return (
      <div className="py-32 text-center text-white">
        <h2 className="text-2xl font-bold">Player Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-600 rounded-full text-sm">
          Go Home
        </button>
      </div>
    );
  }

  const isEmoji = (str: string) => {
    if (!str) return false;
    return str.length <= 4 && !str.startsWith('/') && !str.startsWith('http');
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-24 flex-1 max-w-5xl space-y-8">
      <Helmet>
        <title>{`${player.name} Biography & Stats - WhichSports`}</title>
      </Helmet>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors text-sm font-semibold mb-2"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Player Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -z-10" />

        {/* Player Avatar */}
        <div className="w-32 h-32 rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center text-6xl shadow-inner shrink-0 overflow-hidden hover:scale-105 transition-transform p-1">
          {isEmoji(player.photo) ? (
            player.photo
          ) : (
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
          )}
        </div>

        {/* Info panel */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 tracking-wider">
                {player.position}
              </span>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded bg-white/10 text-white tracking-wider">
                {player.nationality}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{player.name}</h1>
            <p className="text-sm text-text-muted">
              Plays for:{' '}
              <span 
                onClick={() => navigate(`/sports/team/${player.teamId}`)}
                className="text-white hover:text-blue-400 hover:underline font-bold cursor-pointer transition-colors"
              >
                {player.teamName}
              </span>
            </p>
          </div>

          <div className="text-sm text-white/80 leading-relaxed border-t border-white/10 pt-4">
            {player.bio}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
          {player.injuries ? (
            <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {player.injuries}
            </div>
          ) : (
            <div className="bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Fully Fit
            </div>
          )}

          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] uppercase font-bold text-text-muted mr-1.5 tracking-wider">Form:</span>
            {player.form.map((f, i) => (
              <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                f === 'W' ? 'bg-green-500 text-white' : f === 'L' ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
              }`}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Season Stats */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
            📊 Current Season Stats
          </h3>
          
          <div className="space-y-4">
            {Object.entries(player.seasonStats).map(([key, val], i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
                <span className="text-text-muted font-medium">{key}</span>
                <span className="font-extrabold text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Career Stats */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
            🏆 Career Stats Overview
          </h3>
          
          <div className="space-y-4">
            {Object.entries(player.careerStats).map(([key, val], i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
                <span className="text-text-muted font-medium">{key}</span>
                <span className="font-extrabold text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ad placement */}
      <AdPlaceholder />
    </div>
  );
}
