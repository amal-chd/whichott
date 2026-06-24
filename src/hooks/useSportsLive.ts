import { useState, useEffect } from 'react';
import { MOCK_MATCHES } from '@/lib/api/sportsMock';
import type { MatchDetails, MatchEvent } from '@/lib/api/sportsMock';

// Clone mock matches to create a globally synchronized mutable list
let globalMatches: MatchDetails[] = JSON.parse(JSON.stringify(MOCK_MATCHES));
let listeners: Array<(matches: MatchDetails[]) => void> = [];

// Initialize local storage notifications
const getFollowedTeams = (): string[] => {
  try {
    const saved = localStorage.getItem('followed_teams');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

// Dispatch custom event for notifications
function triggerNotification(title: string, body: string) {
  const event = new CustomEvent('sports-notification', {
    detail: { title, body }
  });
  window.dispatchEvent(event);
}

// Simulation Runner
function tickSimulation() {
  let updated = false;

  globalMatches = globalMatches.map(match => {
    if (match.status !== 'LIVE') return match;

    updated = true;
    const followedTeams = getFollowedTeams();
    const isHomeFollowed = followedTeams.includes(match.homeTeam.id);
    const isAwayFollowed = followedTeams.includes(match.awayTeam.id);
    const isAnyFollowed = isHomeFollowed || isAwayFollowed;

    // Clone match to mutate safely
    const m = { ...match };

    if (m.sport === 'football') {
      // Parse current minute
      let min = parseInt(m.timeElapsed || '0');
      if (isNaN(min)) min = 72;

      if (min >= 90) {
        m.status = 'FULL TIME';
        m.timeElapsed = 'FT';
        if (isAnyFollowed) {
          triggerNotification(
            'Match Finished ⚽',
            `${m.homeTeam.name} ${m.score.home} - ${m.score.away} ${m.awayTeam.name}`
          );
        }
      } else {
        min += 1;
        m.timeElapsed = `${min}'`;

        // Check for Goal (3% chance)
        const rand = Math.random();
        if (rand < 0.04) {
          const scoringTeam = Math.random() > 0.5 ? 'home' : 'away';
          const scorer = scoringTeam === 'home' 
            ? (m.lineups?.home.starting[Math.floor(Math.random() * 11)].name || 'Striker')
            : (m.lineups?.away.starting[Math.floor(Math.random() * 11)].name || 'Striker');
          
          if (scoringTeam === 'home') {
            m.score.home = (m.score.home as number) + 1;
          } else {
            m.score.away = (m.score.away as number) + 1;
          }

          const eventText = `${scorer} scores! (${scoringTeam === 'home' ? m.homeTeam.name : m.awayTeam.name})`;
          m.timeline = [
            ...m.timeline,
            { time: `${min}'`, type: 'goal', detail: eventText, team: scoringTeam, player: scorer }
          ];

          // Trigger goal notification
          const teamName = scoringTeam === 'home' ? m.homeTeam.name : m.awayTeam.name;
          if (followedTeams.includes(scoringTeam === 'home' ? m.homeTeam.id : m.awayTeam.id)) {
            triggerNotification(
              `GOAL! for ${teamName} ⚽`,
              `${m.homeTeam.name} ${m.score.home} - ${m.score.away} ${m.awayTeam.name} (${scorer} ${min}')`
            );
          }
        }
        // Check for yellow card (2% chance)
        else if (rand < 0.07) {
          const cardTeam = Math.random() > 0.5 ? 'home' : 'away';
          const player = cardTeam === 'home'
            ? (m.lineups?.home.starting[Math.floor(Math.random() * 11)].name || 'Defender')
            : (m.lineups?.away.starting[Math.floor(Math.random() * 11)].name || 'Defender');

          m.timeline = [
            ...m.timeline,
            { time: `${min}'`, type: 'card_yellow', detail: `Yellow Card: ${player}`, team: cardTeam, player }
          ];
        }
      }
    } 
    else if (m.sport === 'cricket') {
      // Parse overs: e.g. "15.2 overs" -> 15 overs, 2 balls
      const overStr = m.timeElapsed || '15.2 overs';
      const parts = overStr.split(' ');
      const overParts = parts[0].split('.');
      let overs = parseInt(overParts[0]);
      let balls = parseInt(overParts[1] || '0');

      balls += 1;
      if (balls >= 6) {
        balls = 0;
        overs += 1;
      }

      m.timeElapsed = `${overs}.${balls} overs`;

      // Parse score: e.g. "132/4" -> runs: 132, wickets: 4
      const scoreStr = m.score.away.toString();
      const scoreParts = scoreStr.split('/');
      let runs = parseInt(scoreParts[0]);
      let wickets = parseInt(scoreParts[1]);

      const rand = Math.random();
      let eventText = '';
      let eventType: MatchEvent['type'] = 'point';

      if (rand < 0.06) {
        // Wicket!
        wickets += 1;
        eventType = 'wicket';
        const batsman = wickets === 5 ? 'Shivam Dube' : wickets === 6 ? 'Ravindra Jadeja' : 'Dhoni';
        eventText = `WICKET! ${batsman} out. CSK ${runs}/${wickets}`;
        
        m.timeline = [
          ...m.timeline,
          { time: `${overs}.${balls}`, type: 'wicket', detail: eventText, team: 'away', player: batsman }
        ];

        if (followedTeams.includes(m.awayTeam.id)) {
          triggerNotification('WICKET! 🏏', eventText);
        }
      } else if (rand < 0.12) {
        // Six
        runs += 6;
        eventType = 'six';
        eventText = `SIX! Batsman smashes it over boundary. CSK ${runs}/${wickets}`;
        m.timeline = [
          ...m.timeline,
          { time: `${overs}.${balls}`, type: 'six', detail: eventText, team: 'away' }
        ];
      } else if (rand < 0.25) {
        // Four
        runs += 4;
        eventType = 'four';
        eventText = `FOUR! Beautiful drive to the fence. CSK ${runs}/${wickets}`;
        m.timeline = [
          ...m.timeline,
          { time: `${overs}.${balls}`, type: 'four', detail: eventText, team: 'away' }
        ];
      } else {
        // Singles/Dot balls
        const addedRuns = Math.random() > 0.4 ? 1 : Math.random() > 0.5 ? 2 : 0;
        runs += addedRuns;
      }

      m.score.away = `${runs}/${wickets}`;
      m.score.awayDetail = `${runs}/${wickets} (${overs}.${balls} overs)`;

      // Target check
      const target = 182;
      if (runs > target) {
        m.status = 'FULL TIME';
        m.timeElapsed = 'CSK won by 5 wickets';
        if (isAnyFollowed) {
          triggerNotification('Match Finished 🏏', `CSK (${runs}/${wickets}) defeated RCB (182/5)`);
        }
      } else if (overs >= 20) {
        m.status = 'FULL TIME';
        m.timeElapsed = `RCB won by ${target - runs} runs`;
        if (isAnyFollowed) {
          triggerNotification('Match Finished 🏏', `RCB defeated CSK by ${target - runs} runs`);
        }
      }
    } 
    else if (m.sport === 'basketball') {
      // Score increments
      const homeScore = m.score.home as number;
      const awayScore = m.score.away as number;

      // Progress Q4 time
      const timeStr = m.timeElapsed || 'Q4 4:32';
      const timeParts = timeStr.split(' ');
      const q = timeParts[0];
      const minSec = timeParts[1].split(':');
      let min = parseInt(minSec[0]);
      let sec = parseInt(minSec[1]);

      sec -= 24; // Decrement by shot clock
      if (sec < 0) {
        sec = 60 + sec;
        min -= 1;
      }

      if (min < 0) {
        m.status = 'FULL TIME';
        m.timeElapsed = 'FT';
        if (isAnyFollowed) {
          triggerNotification('Match Finished 🏀', `Celtics ${homeScore} - ${awayScore} Lakers`);
        }
      } else {
        const secStr = sec < 10 ? `0${sec}` : `${sec}`;
        m.timeElapsed = `${q} ${min}:${secStr}`;

        // Points
        const pointsHome = Math.random() > 0.4 ? (Math.random() > 0.3 ? 2 : 3) : 0;
        const pointsAway = Math.random() > 0.4 ? (Math.random() > 0.3 ? 2 : 3) : 0;

        m.score.home = homeScore + pointsHome;
        m.score.away = awayScore + pointsAway;

        if (pointsHome > 0) {
          m.timeline = [
            ...m.timeline,
            { time: `${min}:${secStr}`, type: 'point', detail: `Celtics score +${pointsHome} points`, team: 'home' }
          ];
        }
        if (pointsAway > 0) {
          m.timeline = [
            ...m.timeline,
            { time: `${min}:${secStr}`, type: 'point', detail: `Lakers score +${pointsAway} points`, team: 'away' }
          ];
        }
      }
    }
    else if (m.sport === 'tennis') {
      // SetScores e.g. ['6-4', '3-6', '7-6(5)', '4-3']
      if (m.score.setScores) {
        const sets = [...m.score.setScores];
        const lastSet = sets[sets.length - 1]; // e.g. "4-3"
        const parts = lastSet.split('-');
        let homeGames = parseInt(parts[0]);
        let awayGames = parseInt(parts[1]);

        const rand = Math.random();
        if (rand < 0.15) {
          // A game has finished!
          const homeWinsGame = Math.random() > 0.55;
          if (homeWinsGame) {
            homeGames += 1;
          } else {
            awayGames += 1;
          }
          
          sets[sets.length - 1] = `${homeGames}-${awayGames}`;
          m.score.setScores = sets;

          const winnerName = homeWinsGame ? m.homeTeam.name : m.awayTeam.name;
          m.timeline = [
            ...m.timeline,
            { time: `Set ${sets.length}`, type: 'point', detail: `${winnerName} wins service game: ${homeGames}-${awayGames}`, team: homeWinsGame ? 'home' : 'away' }
          ];

          // Check if set is won
          if (homeGames >= 6 && homeGames - awayGames >= 2) {
            // Home wins Set!
            m.score.home = (m.score.home as number) + 1;
            m.timeline = [
              ...m.timeline,
              { time: `Set ${sets.length}`, type: 'point', detail: `${m.homeTeam.name} wins set ${sets.length}!`, team: 'home' }
            ];
            
            // Check if home wins match (best of 5, needs 3 sets)
            if (m.score.home === 3) {
              m.status = 'FULL TIME';
              m.timeElapsed = `${m.homeTeam.name} won 3-1`;
              if (isAnyFollowed) {
                triggerNotification('Match Finished 🎾', `${m.homeTeam.name} defeated ${m.awayTeam.name} 3-1`);
              }
            } else {
              // Start next set
              m.score.setScores.push('0-0');
              m.timeElapsed = `Set ${sets.length + 1}, Game 1`;
            }
          } else if (awayGames >= 6 && awayGames - homeGames >= 2) {
            // Away wins Set!
            m.score.away = (m.score.away as number) + 1;
            m.timeline = [
              ...m.timeline,
              { time: `Set ${sets.length}`, type: 'point', detail: `${m.awayTeam.name} wins set ${sets.length}!`, team: 'away' }
            ];

            // Start next set
            m.score.setScores.push('0-0');
            m.timeElapsed = `Set ${sets.length + 1}, Game 1`;
          } else {
            m.timeElapsed = `Set ${sets.length}, Game ${homeGames + awayGames + 1}`;
          }
        }
      }
    }
    else if (m.sport === 'formula1') {
      // Lap 52/78
      const lapStr = m.timeElapsed || 'Lap 52/78';
      const lapParts = lapStr.replace('Lap ', '').split('/');
      let currentLap = parseInt(lapParts[0]);
      const totalLaps = parseInt(lapParts[1] || '78');

      if (currentLap < totalLaps) {
        currentLap += 1;
        m.timeElapsed = `Lap ${currentLap}/${totalLaps}`;

        // Swap places (overtake simulation, 8% chance)
        if (Math.random() < 0.08) {
          const currentLeader = m.score.home;
          m.score.home = m.score.away;
          m.score.away = currentLeader;

          const newLeaderName = m.score.home === '1st' ? m.homeTeam.name : m.awayTeam.name;
          m.timeline = [
            ...m.timeline,
            { time: `Lap ${currentLap}`, type: 'point', detail: `${newLeaderName} overtakes for the lead!`, team: m.score.home === '1st' ? 'home' : 'away' }
          ];

          if (isAnyFollowed) {
            triggerNotification('F1 Lead Change 🏎️', `${newLeaderName} has taken the lead on Lap ${currentLap}!`);
          }
        }

        // Random pit stop or event (4% chance)
        if (Math.random() < 0.04) {
          const pitTeam = Math.random() > 0.5 ? 'home' : 'away';
          const driverName = pitTeam === 'home' ? m.homeTeam.name : m.awayTeam.name;
          m.timeline = [
            ...m.timeline,
            { time: `Lap ${currentLap}`, type: 'substitution', detail: `${driverName} enters pit lane for new tyres (2.4s)`, team: pitTeam }
          ];
        }
      } else {
        m.status = 'FULL TIME';
        m.timeElapsed = 'Race Finished';
        const winner = m.score.home === '1st' ? m.homeTeam.name : m.awayTeam.name;
        m.timeline = [
          ...m.timeline,
          { time: 'FT', type: 'point', detail: `${winner} wins the Grand Prix!`, team: m.score.home === '1st' ? 'home' : 'away' }
        ];
        if (isAnyFollowed) {
          triggerNotification('Race Finished 🏎️', `${winner} has won the Grand Prix!`);
        }
      }
    }
    else if (m.sport === 'nfl') {
      // Q4 2:15
      const timeStr = m.timeElapsed || 'Q4 2:15';
      const timeParts = timeStr.split(' ');
      const q = timeParts[0];
      const minSec = timeParts[1].split(':');
      let min = parseInt(minSec[0]);
      let sec = parseInt(minSec[1]);

      sec -= Math.floor(Math.random() * 15) + 5; // Decrement by 5-20 seconds
      if (sec < 0) {
        sec = 60 + sec;
        min -= 1;
      }

      if (min < 0) {
        m.status = 'FULL TIME';
        m.timeElapsed = 'FT';
        if (isAnyFollowed) {
          triggerNotification('Match Finished 🏈', `Chiefs ${m.score.home} - ${m.score.away} 49ers`);
        }
      } else {
        const secStr = sec < 10 ? `0${sec}` : `${sec}`;
        m.timeElapsed = `${q} ${min}:${secStr}`;

        // Check for score (6% chance)
        if (Math.random() < 0.06) {
          const scoringTeam = Math.random() > 0.5 ? 'home' : 'away';
          const scoreType = Math.random() > 0.3 ? 'TD' : 'FG';
          const points = scoreType === 'TD' ? 7 : 3;

          if (scoringTeam === 'home') {
            m.score.home = (m.score.home as number) + points;
          } else {
            m.score.away = (m.score.away as number) + points;
          }

          const teamName = scoringTeam === 'home' ? m.homeTeam.name : m.awayTeam.name;
          const detail = scoreType === 'TD' 
            ? `${teamName} Touchdown! (+7 pts)` 
            : `${teamName} kicks a Field Goal! (+3 pts)`;

          m.timeline = [
            ...m.timeline,
            { time: `${min}:${secStr}`, type: 'point', detail, team: scoringTeam }
          ];

          if (followedTeams.includes(scoringTeam === 'home' ? m.homeTeam.id : m.awayTeam.id)) {
            triggerNotification(`SCORE! for ${teamName} 🏈`, `${m.homeTeam.name} ${m.score.home} - ${m.score.away} ${m.awayTeam.name}`);
          }
        }
      }
    }

    return m;
  });

  if (updated) {
    listeners.forEach(l => l(globalMatches));
  }
}

// Start simulation interval globally
if (typeof window !== 'undefined') {
  setInterval(tickSimulation, 6000);
}

export function useSportsLive(matchId?: string) {
  const [matches, setMatches] = useState<MatchDetails[]>(globalMatches);

  useEffect(() => {
    listeners.push(setMatches);
    return () => {
      listeners = listeners.filter(l => l !== setMatches);
    };
  }, []);

  const match = matchId ? matches.find(m => m.id === matchId) : undefined;

  return {
    matches,
    match,
    isLive: match?.status === 'LIVE'
  };
}
