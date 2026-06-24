// Sports Mock Database and API Client for WhichOTT X Sports

export interface MatchEvent {
  time: string;
  type: 'goal' | 'card_yellow' | 'card_red' | 'substitution' | 'penalty' | 'var' | 'wicket' | 'four' | 'six' | 'over' | 'timeout' | 'point';
  detail: string;
  team: 'home' | 'away' | 'none';
  player?: string;
}

export interface PlayerStats {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  position: string;
  teamId: string;
  teamName: string;
  bio: string;
  form: string[];
  injuries: string | null;
  seasonStats: Record<string, string | number>;
  careerStats: Record<string, string | number>;
}

export interface TeamStats {
  id: string;
  name: string;
  logo: string;
  sport: string;
  leagueId: string;
  leagueName: string;
  coach: string;
  position: number;
  form: ('W' | 'D' | 'L')[];
  fixtures: { id: string; opponent: string; date: string; home: boolean }[];
  results: { id: string; opponent: string; score: string; date: string; result: 'W' | 'D' | 'L' }[];
  stats: Record<string, string | number>;
  squad: { id: string; name: string; position: string; number: number }[];
}

export interface MatchDetails {
  id: string;
  sport: 'football' | 'cricket' | 'basketball' | 'tennis' | 'formula1' | 'nfl' | 'mlb' | 'ufc';
  leagueId: string;
  leagueName: string;
  homeTeam: { id: string; name: string; logo: string; ranking: number; form: string[] };
  awayTeam: { id: string; name: string; logo: string; ranking: number; form: string[] };
  status: 'LIVE' | 'HALF TIME' | 'FULL TIME' | 'RAIN DELAY' | 'UPCOMING';
  score: {
    home: number | string;
    away: number | string;
    homeDetail?: string; // e.g. "182/5 (20)" for cricket
    awayDetail?: string;
    quarterScores?: { home: number[]; away: number[] };
    setScores?: string[]; // Tennis sets
  };
  timeElapsed?: string; // e.g. "72'", "14.2 overs"
  liveOdds?: { home: string; draw?: string; away: string };
  availability: { provider: string; logo: string; link: string }[];
  timeline: MatchEvent[];
  stats: {
    labels: string[];
    home: (number | string)[];
    away: (number | string)[];
  };
  lineups?: {
    home: { formation?: string; starting: { name: string; number: number; position: string }[]; subs: string[] };
    away: { formation?: string; starting: { name: string; number: number; position: string }[]; subs: string[] };
  };
}

export interface LeagueDetails {
  id: string;
  name: string;
  sport: string;
  logo?: string;
  standings: {
    position: number;
    teamId: string;
    teamName: string;
    teamLogo: string;
    played: number;
    won: number;
    drawn?: number;
    lost: number;
    points: number;
    goalsDiff?: string;
  }[];
  topPerformers: {
    scorers: { name: string; team: string; value: number }[];
    assists?: { name: string; team: string; value: number }[];
    wickets?: { name: string; team: string; value: number }[];
  };
}

// ==========================================
// Mock Database Definitions
// ==========================================

export const MOCK_LEAGUES: Record<string, LeagueDetails> = {
  'ucl': {
    id: 'ucl',
    name: 'UEFA Champions League',
    sport: 'football',
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2021.svg',
    standings: [
      { position: 1, teamId: 'real-madrid', teamName: 'Real Madrid', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', played: 6, won: 5, drawn: 1, lost: 0, points: 16, goalsDiff: '+12' },
      { position: 2, teamId: 'manchester-city', teamName: 'Manchester City', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', played: 6, won: 4, drawn: 2, lost: 0, points: 14, goalsDiff: '+10' },
      { position: 3, teamId: 'bayern-munich', teamName: 'Bayern Munich', teamLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg', played: 6, won: 4, drawn: 1, lost: 1, points: 13, goalsDiff: '+8' },
      { position: 4, teamId: 'arsenal', teamName: 'Arsenal', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', played: 6, won: 4, drawn: 0, lost: 2, points: 12, goalsDiff: '+6' },
      { position: 5, teamId: 'barcelona', teamName: 'Barcelona', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg', played: 6, won: 3, drawn: 1, lost: 2, points: 10, goalsDiff: '+2' },
    ],
    topPerformers: {
      scorers: [
        { name: 'Kylian Mbappé', team: 'Real Madrid', value: 8 },
        { name: 'Erling Haaland', team: 'Manchester City', value: 7 },
        { name: 'Harry Kane', team: 'Bayern Munich', value: 6 }
      ],
      assists: [
        { name: 'Kevin De Bruyne', team: 'Manchester City', value: 5 },
        { name: 'Jude Bellingham', team: 'Real Madrid', value: 4 }
      ]
    }
  },
  'ipl': {
    id: 'ipl',
    name: 'Indian Premier League',
    sport: 'cricket',
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/84/Indian_Premier_League_Official_Logo.svg',
    standings: [
      { position: 1, teamId: 'rr', teamName: 'Rajasthan Royals', teamLogo: 'https://assets.ccbp.in/frontend/react-js/rr-logo-img.png', played: 14, won: 10, lost: 4, points: 20 },
      { position: 2, teamId: 'csk', teamName: 'Chennai Super Kings', teamLogo: 'https://assets.ccbp.in/frontend/react-js/csk-logo-img.png', played: 14, won: 9, lost: 5, points: 18 },
      { position: 3, teamId: 'kkr', teamName: 'Kolkata Knight Riders', teamLogo: 'https://assets.ccbp.in/frontend/react-js/kkr-logo-img.png', played: 14, won: 9, lost: 5, points: 18 },
      { position: 4, teamId: 'rcb', teamName: 'Royal Challengers Bengaluru', teamLogo: 'https://assets.ccbp.in/frontend/react-js/rcb-logo-img.png', played: 14, won: 8, lost: 6, points: 16 },
      { position: 5, teamId: 'mi', teamName: 'Mumbai Indians', teamLogo: 'https://assets.ccbp.in/frontend/react-js/mi-logo-img.png', played: 14, won: 6, lost: 8, points: 12 }
    ],
    topPerformers: {
      scorers: [
        { name: 'Virat Kohli', team: 'RCB', value: 741 },
        { name: 'Ruturaj Gaikwad', team: 'CSK', value: 583 },
        { name: 'Travis Head', team: 'SRH', value: 567 }
      ],
      wickets: [
        { name: 'Harshal Patel', team: 'PBKS', value: 24 },
        { name: 'Jasprit Bumrah', team: 'MI', value: 20 },
        { name: 'Varun Chakravarthy', team: 'KKR', value: 21 }
      ]
    }
  },
  'nba': {
    id: 'nba',
    name: 'NBA Finals',
    sport: 'basketball',
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg',
    standings: [
      { position: 1, teamId: 'boston-celtics', teamName: 'Boston Celtics', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg', played: 82, won: 64, lost: 18, points: 64 },
      { position: 2, teamId: 'okc-thunder', teamName: 'OKC Thunder', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Oklahoma_City_Thunder.svg', played: 82, won: 57, lost: 25, points: 57 },
      { position: 3, teamId: 'denver-nuggets', teamName: 'Denver Nuggets', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg', played: 82, won: 57, lost: 25, points: 57 },
      { position: 4, teamId: 'la-lakers', teamName: 'LA Lakers', teamLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg', played: 82, won: 47, lost: 35, points: 47 }
    ],
    topPerformers: {
      scorers: [
        { name: 'Luka Dončić', team: 'Dallas Mavericks', value: 33.9 },
        { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', value: 30.4 },
        { name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', value: 30.1 }
      ]
    }
  },
  'wimbledon': {
    id: 'wimbledon',
    name: 'Wimbledon Men\'s Singles',
    sport: 'tennis',
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Wimbledon_Logo.svg',
    standings: [
      { position: 1, teamId: 'carlos-alcaraz', teamName: 'Carlos Alcaraz', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg', played: 7, won: 7, lost: 0, points: 2000 },
      { position: 2, teamId: 'novak-djokovic', teamName: 'Novak Djokovic', teamLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Serbia.svg', played: 7, won: 6, lost: 1, points: 1200 },
      { position: 3, teamId: 'jannik-sinner', teamName: 'Jannik Sinner', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg', played: 6, won: 5, lost: 1, points: 720 },
      { position: 4, teamId: 'daniil-medvedev', teamName: 'Daniil Medvedev', teamLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Tennis_pictogram.svg', played: 6, won: 5, lost: 1, points: 720 }
    ],
    topPerformers: {
      scorers: [
        { name: 'Carlos Alcaraz', team: 'Spain', value: 7 },
        { name: 'Novak Djokovic', team: 'Serbia', value: 6 },
        { name: 'Jannik Sinner', team: 'Italy', value: 5 }
      ]
    }
  },
  'f1': {
    id: 'f1',
    name: 'Formula 1 Championship',
    sport: 'formula1',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg',
    standings: [
      { position: 1, teamId: 'red-bull', teamName: 'Max Verstappen (RBR)', teamLogo: 'https://logo.clearbit.com/redbull.com', played: 14, won: 7, lost: 7, points: 258 },
      { position: 2, teamId: 'mclaren', teamName: 'Lando Norris (MCL)', teamLogo: 'https://logo.clearbit.com/mclaren.com', played: 14, won: 2, lost: 12, points: 195 },
      { position: 3, teamId: 'ferrari', teamName: 'Charles Leclerc (FER)', teamLogo: 'https://logo.clearbit.com/ferrari.com', played: 14, won: 1, lost: 13, points: 177 },
      { position: 4, teamId: 'mclaren', teamName: 'Oscar Piastri (MCL)', teamLogo: 'https://logo.clearbit.com/mclaren.com', played: 14, won: 1, lost: 13, points: 167 },
      { position: 5, teamId: 'ferrari', teamName: 'Carlos Sainz (FER)', teamLogo: 'https://logo.clearbit.com/ferrari.com', played: 14, won: 1, lost: 13, points: 144 }
    ],
    topPerformers: {
      scorers: [
        { name: 'Max Verstappen', team: 'Red Bull Racing', value: 7 },
        { name: 'Lando Norris', team: 'McLaren', value: 2 },
        { name: 'Lewis Hamilton', team: 'Mercedes', value: 2 }
      ]
    }
  }
};

export const MOCK_PLAYERS: Record<string, PlayerStats> = {
  'messi': {
    id: 'messi',
    name: 'Lionel Messi',
    photo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80',
    nationality: 'Argentina',
    position: 'Forward',
    teamId: 'inter-miami',
    teamName: 'Inter Miami CF',
    bio: 'Lionel Andrés Messi is an Argentine professional footballer who plays as a forward for and captains both Major League Soccer club Inter Miami and the Argentina national team.',
    form: ['W', 'W', 'W', 'D', 'W'],
    injuries: null,
    seasonStats: { Goals: 18, Assists: 12, Matches: 19, 'Shots PG': 4.2 },
    careerStats: { Goals: 840, Assists: 362, Appearances: 1060, 'Ballon d\'Ors': 8 }
  },
  'mbappe': {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    photo: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=300&auto=format&fit=crop&q=80',
    nationality: 'France',
    position: 'Forward',
    teamId: 'real-madrid',
    teamName: 'Real Madrid',
    bio: 'Kylian Mbappé Lottin is a French professional footballer who plays as a forward for La Liga club Real Madrid and captains the France national team.',
    form: ['W', 'W', 'L', 'W', 'W'],
    injuries: null,
    seasonStats: { Goals: 24, Assists: 8, Matches: 28, 'Speed Max': '36.1 km/h' },
    careerStats: { Goals: 310, Assists: 120, Appearances: 390, 'World Cups': 1 }
  },
  'kohli': {
    id: 'kohli',
    name: 'Virat Kohli',
    photo: 'https://images.unsplash.com/photo-1624526261182-ab3dfc8502f1?w=300&auto=format&fit=crop&q=80',
    nationality: 'India',
    position: 'Batsman',
    teamId: 'rcb',
    teamName: 'Royal Challengers Bengaluru',
    bio: 'Virat Kohli is an Indian international cricketer and the former captain of the Indian national cricket team. He is widely regarded as one of the greatest batsmen in the history of the sport.',
    form: ['W', 'W', 'W', 'W', 'L'],
    injuries: null,
    seasonStats: { Runs: 741, Average: 61.75, 'Strike Rate': 154.7, '100s': 1, '50s': 5 },
    careerStats: { Runs: 26900, Average: 53.5, '100s': 80, '50s': 138 }
  },
  'lebron': {
    id: 'lebron',
    name: 'LeBron James',
    photo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&auto=format&fit=crop&q=80',
    nationality: 'United States',
    position: 'Forward',
    teamId: 'la-lakers',
    teamName: 'LA Lakers',
    bio: 'LeBron Raymone James Sr. is an American professional basketball player for the Los Angeles Lakers of the National Basketball Association. Nicknamed "King James", he is widely considered one of the greatest players in NBA history.',
    form: ['W', 'L', 'W', 'W', 'L'],
    injuries: 'Ankle soreness (Probable)',
    seasonStats: { PPG: 25.7, RPG: 7.3, APG: 8.3, 'FG%': '54.0%', '3P%': '41.0%' },
    careerStats: { PPG: 27.1, RPG: 7.5, APG: 7.4, 'Total Points': 40474, 'MVP Awards': 4 }
  }
};

export const MOCK_TEAMS: Record<string, TeamStats> = {
  'real-madrid': {
    id: 'real-madrid',
    name: 'Real Madrid',
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    sport: 'Football',
    leagueId: 'ucl',
    leagueName: 'La Liga / UCL',
    coach: 'Carlo Ancelotti',
    position: 1,
    form: ['W', 'W', 'D', 'W', 'W'],
    fixtures: [
      { id: 'm1', opponent: 'Barcelona', date: 'LIVE', home: true },
      { id: 'f-ucl-1', opponent: 'AC Milan', date: 'Tomorrow', home: false },
      { id: 'f-ll-2', opponent: 'Atletico Madrid', date: 'June 28', home: true }
    ],
    results: [
      { id: 'r1', opponent: 'Borussia Dortmund', score: '5 - 2', date: 'Oct 22', result: 'W' },
      { id: 'r2', opponent: 'Bayern Munich', score: '2 - 1', date: 'May 8', result: 'W' }
    ],
    stats: { 'Goals Scored': 68, 'Clean Sheets': 15, Possession: '58.5%', 'Yellow Cards': 42 },
    squad: [
      { id: 'mbappe', name: 'Kylian Mbappé', position: 'Forward', number: 9 },
      { id: 'bellingham', name: 'Jude Bellingham', position: 'Midfielder', number: 5 },
      { id: 'vinicius', name: 'Vinícius Júnior', position: 'Forward', number: 7 },
      { id: 'modric', name: 'Luka Modrić', position: 'Midfielder', number: 10 }
    ]
  },
  'rcb': {
    id: 'rcb',
    name: 'Royal Challengers Bengaluru',
    logo: 'https://assets.ccbp.in/frontend/react-js/rcb-logo-img.png',
    sport: 'Cricket',
    leagueId: 'ipl',
    leagueName: 'IPL',
    coach: 'Andy Flower',
    position: 4,
    form: ['W', 'W', 'W', 'W', 'L'],
    fixtures: [
      { id: 'm2', opponent: 'Chennai Super Kings', date: 'LIVE', home: true },
      { id: 'c-ipl-2', opponent: 'Mumbai Indians', date: 'June 26', home: false }
    ],
    results: [
      { id: 'cr1', opponent: 'Rajasthan Royals', score: '172/6 vs 174/4', date: 'May 22', result: 'L' },
      { id: 'cr2', opponent: 'Chennai Super Kings', score: '218/5 vs 191/7', date: 'May 18', result: 'W' }
    ],
    stats: { 'Highest Score': '263/5', 'Lowest Score': '49/10', 'Playoff Runs': 9, 'IPL Titles': 0 },
    squad: [
      { id: 'kohli', name: 'Virat Kohli', position: 'Batsman', number: 18 },
      { id: 'duplessis', name: 'Faf du Plessis', position: 'Batsman', number: 13 },
      { id: 'maxwell', name: 'Glenn Maxwell', position: 'All-rounder', number: 32 },
      { id: 'siraj', name: 'Mohammed Siraj', position: 'Bowler', number: 73 }
    ]
  }
};

export const MOCK_MATCHES: MatchDetails[] = [
  {
    id: 'm1',
    sport: 'football',
    leagueId: 'ucl',
    leagueName: 'UEFA Champions League',
    homeTeam: { id: 'real-madrid', name: 'Real Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', ranking: 1, form: ['W', 'W', 'W', 'D', 'W'] },
    awayTeam: { id: 'barcelona', name: 'Barcelona', logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg', ranking: 5, form: ['W', 'W', 'L', 'W', 'W'] },
    status: 'LIVE',
    score: { home: 2, away: 1 },
    timeElapsed: "72'",
    liveOdds: { home: '1.40', draw: '3.80', away: '5.50' },
    availability: [
      { provider: 'Paramount+', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount%2B_logo.svg', link: 'https://paramountplus.com' },
      { provider: 'Sony LIV', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Sony_LIV_logo.png', link: 'https://sonyliv.com' }
    ],
    timeline: [
      { time: "18'", type: 'goal', detail: 'Robert Lewandowski (Assist by Pedri)', team: 'away', player: 'Lewandowski' },
      { time: "34'", type: 'card_yellow', detail: 'Jude Bellingham', team: 'home', player: 'Bellingham' },
      { time: "42'", type: 'goal', detail: 'Kylian Mbappé (Assist by Vinicius Jr.)', team: 'home', player: 'Mbappé' },
      { time: "45+2'", type: 'var', detail: 'VAR Penalty Check: Overturned', team: 'none' },
      { time: "55'", type: 'goal', detail: 'Vinícius Júnior (Penalty)', team: 'home', player: 'Vinícius Júnior' },
      { time: "63'", type: 'substitution', detail: 'Luka Modric in, Jude Bellingham out', team: 'home', player: 'Modric' }
    ],
    stats: {
      labels: ['Possession %', 'Total Shots', 'Shots on Target', 'Expected Goals (xG)', 'Fouls', 'Corners', 'Yellow Cards'],
      home: [54, 14, 6, 1.85, 10, 5, 1],
      away: [46, 9, 3, 0.95, 12, 3, 0]
    },
    lineups: {
      home: {
        formation: '4-3-3',
        starting: [
          { name: 'Courtois', number: 1, position: 'GK' },
          { name: 'Carvajal', number: 2, position: 'DF' },
          { name: 'Militao', number: 3, position: 'DF' },
          { name: 'Rudiger', number: 22, position: 'DF' },
          { name: 'Mendy', number: 23, position: 'DF' },
          { name: 'Valverde', number: 8, position: 'MF' },
          { name: 'Tchouameni', number: 14, position: 'MF' },
          { name: 'Bellingham', number: 5, position: 'MF' },
          { name: 'Rodrygo', number: 11, position: 'FW' },
          { name: 'Mbappe', number: 9, position: 'FW' },
          { name: 'Vinicius Jr', number: 7, position: 'FW' }
        ],
        subs: ['Modric', 'Arda Guler', 'Endrick', 'Lucas Vazquez']
      },
      away: {
        formation: '4-2-3-1',
        starting: [
          { name: 'Ter Stegen', number: 1, position: 'GK' },
          { name: 'Kounde', number: 2, position: 'DF' },
          { name: 'Cubarsi', number: 2, position: 'DF' },
          { name: 'Martinez', number: 5, position: 'DF' },
          { name: 'Balde', number: 3, position: 'DF' },
          { name: 'Casado', number: 17, position: 'MF' },
          { name: 'Pedri', number: 8, position: 'MF' },
          { name: 'Yamal', number: 19, position: 'FW' },
          { name: 'Dani Olmo', number: 20, position: 'FW' },
          { name: 'Raphinha', number: 11, position: 'FW' },
          { name: 'Lewandowski', number: 9, position: 'FW' }
        ],
        subs: ['Gavi', 'Fermin Lopez', 'Ansu Fati', 'Frenkie De Jong']
      }
    }
  },
  {
    id: 'm2',
    sport: 'cricket',
    leagueId: 'ipl',
    leagueName: 'Indian Premier League',
    homeTeam: { id: 'rcb', name: 'RCB', logo: 'https://assets.ccbp.in/frontend/react-js/rcb-logo-img.png', ranking: 4, form: ['W', 'W', 'W', 'W', 'L'] },
    awayTeam: { id: 'csk', name: 'CSK', logo: 'https://assets.ccbp.in/frontend/react-js/csk-logo-img.png', ranking: 2, form: ['W', 'L', 'W', 'L', 'W'] },
    status: 'LIVE',
    score: {
      home: '182/5',
      away: '132/4',
      homeDetail: '182/5 (20 overs)',
      awayDetail: '132/4 (15.2 overs)'
    },
    timeElapsed: '15.2 overs',
    liveOdds: { home: '2.10', away: '1.72' },
    availability: [
      { provider: 'JioCinema', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/14/JioCinema_Logo.svg', link: 'https://jiocinema.com' },
      { provider: 'Disney+ Hotstar', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_Hotstar_logo.svg', link: 'https://hotstar.com' }
    ],
    timeline: [
      { time: '0.1', type: 'point', detail: 'Faf du Plessis hits 4 runs off Chahar', team: 'home', player: 'Faf du Plessis' },
      { time: '5.2', type: 'wicket', detail: 'Faf du Plessis c Dhoni b Deshpande 23(18)', team: 'away', player: 'du Plessis' },
      { time: '12.4', type: 'four', detail: 'Virat Kohli hits boundary off Jadeja', team: 'home', player: 'Virat Kohli' },
      { time: '14.2', type: 'six', detail: 'Virat Kohli hits 92m six off Pathirana', team: 'home', player: 'Virat Kohli' },
      { time: '17.5', type: 'wicket', detail: 'Virat Kohli b Pathirana 82(54) [Clean Bowled]', team: 'away', player: 'Virat Kohli' },
      { time: '19.6', type: 'point', detail: 'Dinesh Karthik finishes innings with a six. RCB 182/5.', team: 'home', player: 'Dinesh Karthik' },
      { time: '2.4', type: 'wicket', detail: 'Ruturaj Gaikwad c Siraj b Dayal 12(8)', team: 'home', player: 'Ruturaj Gaikwad' }
    ],
    stats: {
      labels: ['Current Run Rate (CRR)', 'Projected Score', 'Win Probability %', 'Sixes Hit', 'Fours Hit', 'Extras Given'],
      home: [9.1, 182, 35, 8, 14, 7],
      away: [8.6, 172, 65, 6, 10, 5]
    },
    lineups: {
      home: {
        starting: [
          { name: 'Virat Kohli', number: 18, position: 'Batter' },
          { name: 'Faf du Plessis (C)', number: 13, position: 'Batter' },
          { name: 'Rajat Patidar', number: 97, position: 'Batter' },
          { name: 'Glenn Maxwell', number: 32, position: 'All-rounder' },
          { name: 'Cameron Green', number: 44, position: 'All-rounder' },
          { name: 'Dinesh Karthik (WK)', number: 21, position: 'Wicket-keeper' },
          { name: 'Mahipal Lomror', number: 8, position: 'Batter' },
          { name: 'Karn Sharma', number: 12, position: 'Bowler' },
          { name: 'Mohammed Siraj', number: 73, position: 'Bowler' },
          { name: 'Yash Dayal', number: 33, position: 'Bowler' },
          { name: 'Lockie Ferguson', number: 28, position: 'Bowler' }
        ],
        subs: ['Swapnil Singh', 'Anuj Rawat', 'Suyash Prabhudessai']
      },
      away: {
        starting: [
          { name: 'Ruturaj Gaikwad (C)', number: 31, position: 'Batter' },
          { name: 'Rachin Ravindra', number: 8, position: 'Batter' },
          { name: 'Ajinkya Rahane', number: 27, position: 'Batter' },
          { name: 'Daryl Mitchell', number: 75, position: 'Batter' },
          { name: 'Shivam Dube', number: 25, position: 'All-rounder' },
          { name: 'Ravindra Jadeja', number: 8, position: 'All-rounder' },
          { name: 'MS Dhoni (WK)', number: 7, position: 'Wicket-keeper' },
          { name: 'Mitchell Santner', number: 74, position: 'All-rounder' },
          { name: 'Shardul Thakur', number: 54, position: 'Bowler' },
          { name: 'Tushar Deshpande', number: 24, position: 'Bowler' },
          { name: 'Matheesha Pathirana', number: 9, position: 'Bowler' }
        ],
        subs: ['Sameer Rizvi', 'Simarjeet Singh', 'Shaik Rasheed']
      }
    }
  },
  {
    id: 'm3',
    sport: 'basketball',
    leagueId: 'nba',
    leagueName: 'NBA Finals',
    homeTeam: { id: 'boston-celtics', name: 'Celtics', logo: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg', ranking: 1, form: ['W', 'W', 'W', 'W', 'L'] },
    awayTeam: { id: 'la-lakers', name: 'Lakers', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg', ranking: 4, form: ['W', 'L', 'W', 'W', 'L'] },
    status: 'LIVE',
    score: {
      home: 98,
      away: 95,
      quarterScores: {
        home: [26, 24, 28, 20],
        away: [22, 28, 24, 21]
      }
    },
    timeElapsed: 'Q4 4:32',
    liveOdds: { home: '1.50', away: '2.60' },
    availability: [
      { provider: 'NBA League Pass', logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg', link: 'https://nba.com' },
      { provider: 'ESPN+', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/ESPN%2B_Logo.svg', link: 'https://espn.com' }
    ],
    timeline: [
      { time: 'Q4 11:20', type: 'point', detail: 'LeBron James dunks on assist by Russell', team: 'away', player: 'LeBron James' },
      { time: 'Q4 9:45', type: 'point', detail: 'Jayson Tatum hits a stepback 3-pointer', team: 'home', player: 'Jayson Tatum' },
      { time: 'Q4 8:12', type: 'timeout', detail: 'Lakers Full Timeout', team: 'away' },
      { time: 'Q4 6:30', type: 'point', detail: 'Jaylen Brown drives, scores layup and foul', team: 'home', player: 'Jaylen Brown' },
      { time: 'Q4 4:50', type: 'point', detail: 'Anthony Davis blocks Tatum shot', team: 'away', player: 'Anthony Davis' }
    ],
    stats: {
      labels: ['Rebounds', 'Assists', 'Field Goal %', 'Three Point %', 'Turnovers', 'Steals', 'Blocks'],
      home: [42, 23, 46.5, 38.0, 11, 8, 4],
      away: [39, 21, 48.0, 34.5, 14, 6, 6]
    }
  },
  {
    id: 'm4',
    sport: 'tennis',
    leagueId: 'wimbledon',
    leagueName: 'Wimbledon Men\'s Singles',
    homeTeam: { id: 'carlos-alcaraz', name: 'C. Alcaraz', logo: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg', ranking: 2, form: ['W', 'W', 'W', 'W', 'W'] },
    awayTeam: { id: 'novak-djokovic', name: 'N. Djokovic', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Serbia.svg', ranking: 3, form: ['W', 'W', 'W', 'W', 'L'] },
    status: 'LIVE',
    score: {
      home: 2,
      away: 1,
      setScores: ['6-4', '3-6', '7-6(5)', '4-3']
    },
    timeElapsed: 'Set 4, Game 8',
    liveOdds: { home: '1.33', away: '3.25' },
    availability: [
      { provider: 'Hulu + Live TV', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg', link: 'https://hulu.com' },
      { provider: 'Hotstar', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_Hotstar_logo.svg', link: 'https://hotstar.com' }
    ],
    timeline: [
      { time: 'Set 1', type: 'point', detail: 'Alcaraz wins 1st set 6-4 with single break', team: 'home', player: 'Alcaraz' },
      { time: 'Set 2', type: 'point', detail: 'Djokovic breaks early, takes 2nd set 6-3', team: 'away', player: 'Djokovic' },
      { time: 'Set 3', type: 'point', detail: 'Alcaraz wins a tight tiebreaker 7-6(5)', team: 'home', player: 'Alcaraz' },
      { time: 'Set 4 Game 3', type: 'point', detail: 'Alcaraz breaks Djokovic service game', team: 'home', player: 'Alcaraz' }
    ],
    stats: {
      labels: ['Aces', 'Double Faults', '1st Serve %', 'Net Points Won', 'Break Points Converted', 'Winners', 'Unforced Errors'],
      home: [8, 2, 68, '18/25', '2/6', 42, 28],
      away: [5, 4, 62, '15/20', '2/4', 35, 30]
    }
  },
  {
    id: 'm5',
    sport: 'formula1',
    leagueId: 'f1',
    leagueName: 'Formula 1',
    homeTeam: { id: 'red-bull', name: 'Max Verstappen', logo: 'https://logo.clearbit.com/redbull.com', ranking: 1, form: ['1st', '2nd', '1st', 'DNF', '1st'] },
    awayTeam: { id: 'mclaren', name: 'Lando Norris', logo: 'https://logo.clearbit.com/mclaren.com', ranking: 2, form: ['2nd', '1st', '3rd', '2nd', '4th'] },
    status: 'LIVE',
    score: {
      home: '1st',
      away: '2nd'
    },
    timeElapsed: 'Lap 52/78',
    availability: [
      { provider: 'F1 TV Pro', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg', link: 'https://f1tv.formula1.com' }
    ],
    timeline: [
      { time: 'Lap 1', type: 'point', detail: 'Verstappen defends pole position from Norris', team: 'home' },
      { time: 'Lap 18', type: 'substitution', detail: 'Hamilton pit stop (Medium to Hard, 2.4s)', team: 'none' },
      { time: 'Lap 32', type: 'card_yellow', detail: 'Yellow flag in Sector 2: Sargeant spins', team: 'none' },
      { time: 'Lap 45', type: 'point', detail: 'Norris sets new fastest lap: 1:14.282', team: 'away' }
    ],
    stats: {
      labels: ['Interval', 'Pit Stops', 'Starting Position', 'Points Earned', 'Tyre Age (Laps)'],
      home: ['- Lead', 1, 1, 25, 22],
      away: ['+ 1.842s', 1, 2, 18, 21]
    }
  },
  // Upcoming Match Football
  {
    id: 'm_upcoming_1',
    sport: 'football',
    leagueId: 'ucl',
    leagueName: 'UEFA Champions League',
    homeTeam: { id: 'manchester-city', name: 'Man City', logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', ranking: 2, form: ['W', 'D', 'W', 'W', 'W'] },
    awayTeam: { id: 'bayern-munich', name: 'Bayern Munich', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg', ranking: 3, form: ['W', 'L', 'W', 'W', 'W'] },
    status: 'UPCOMING',
    score: { home: 0, away: 0 },
    liveOdds: { home: '1.80', draw: '3.40', away: '4.20' },
    availability: [
      { provider: 'Paramount+', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount%2B_logo.svg', link: 'https://paramountplus.com' }
    ],
    timeline: [],
    stats: { labels: ['H2H Wins', 'Draws', 'Scored Last 5 matches'], home: [3, 2, 12], away: [2, 2, 10] }
  },
  // Upcoming Match Cricket
  {
    id: 'm_upcoming_2',
    sport: 'cricket',
    leagueId: 't20-worldcup',
    leagueName: 'ICC T20 World Cup',
    homeTeam: { id: 'ind', name: 'India', logo: 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg', ranking: 1, form: ['W', 'W', 'W', 'W', 'W'] },
    awayTeam: { id: 'aus', name: 'Australia', logo: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Cricket_Australia_logo.svg', ranking: 3, form: ['W', 'W', 'W', 'L', 'W'] },
    status: 'UPCOMING',
    score: { home: 0, away: 0 },
    liveOdds: { home: '1.61', away: '2.20' },
    availability: [
      { provider: 'Disney+ Hotstar', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_Hotstar_logo.svg', link: 'https://hotstar.com' },
      { provider: 'ESPN+', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/ESPN%2B_Logo.svg', link: 'https://espn.com' }
    ],
    timeline: [],
    stats: { labels: ['H2H Wins (T20)', 'Average Score', 'Powerplay Run Rate'], home: [18, 172.5, 8.8], away: [14, 168.2, 8.5] }
  },
  // NFL Match
  {
    id: 'm_nfl_1',
    sport: 'nfl',
    leagueId: 'nfl',
    leagueName: 'NFL Regular Season',
    homeTeam: { id: 'chiefs', name: 'KC Chiefs', logo: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Kansas_City_Chiefs_logo.svg', ranking: 1, form: ['W', 'W', 'W', 'W', 'W'] },
    awayTeam: { id: 'niners', name: 'SF 49ers', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/San_Francisco_49ers_logo.svg', ranking: 2, form: ['W', 'W', 'L', 'W', 'W'] },
    status: 'LIVE',
    score: {
      home: 24,
      away: 21,
      quarterScores: { home: [7, 7, 3, 7], away: [0, 14, 7, 0] }
    },
    timeElapsed: 'Q4 2:15',
    availability: [{ provider: 'Peacock', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Peacock_Logo.svg', link: 'https://peacocktv.com' }],
    timeline: [
      { time: 'Q1', type: 'point', detail: 'Mahomes 12-yd pass to Kelce for TD', team: 'home' },
      { time: 'Q2', type: 'point', detail: 'Purdy 45-yd pass to Aiyuk for TD', team: 'away' },
      { time: 'Q3', type: 'point', detail: 'McCaffrey 4-yd run for TD', team: 'away' }
    ],
    stats: {
      labels: ['1st Downs', 'Total Yards', 'Pass Yards', 'Rush Yards', 'Turnovers', 'Time of Possession'],
      home: [22, 385, 290, 95, 0, '32:15'],
      away: [19, 342, 210, 132, 1, '27:45']
    }
  }
];

// F1 Standings Mock
export const MOCK_F1_DRIVERS = [
  { pos: 1, name: 'Max Verstappen', team: 'Red Bull Racing', points: 258, logo: 'https://logo.clearbit.com/redbull.com' },
  { pos: 2, name: 'Lando Norris', team: 'McLaren', points: 195, logo: 'https://logo.clearbit.com/mclaren.com' },
  { pos: 3, name: 'Charles Leclerc', team: 'Ferrari', points: 177, logo: 'https://logo.clearbit.com/ferrari.com' },
  { pos: 4, name: 'Oscar Piastri', team: 'McLaren', points: 167, logo: 'https://logo.clearbit.com/mclaren.com' },
  { pos: 5, name: 'Carlos Sainz', team: 'Ferrari', points: 144, logo: 'https://logo.clearbit.com/ferrari.com' }
];

export const MOCK_F1_CONSTRUCTORS = [
  { pos: 1, name: 'Red Bull Racing', points: 373, logo: 'https://logo.clearbit.com/redbull.com' },
  { pos: 2, name: 'McLaren', points: 362, logo: 'https://logo.clearbit.com/mclaren.com' },
  { pos: 3, name: 'Ferrari', points: 321, logo: 'https://logo.clearbit.com/ferrari.com' },
  { pos: 4, name: 'Mercedes', points: 266, logo: 'https://logo.clearbit.com/mercedesamgf1.com' }
];

// UFC rankings mock
export const MOCK_UFC_RANKINGS = [
  { division: 'Lightweight', champion: 'Islam Makhachev', contenders: ['Arman Tsarukyan', 'Charles Oliveira', 'Justin Gaethje', 'Dustin Poirier'] },
  { division: 'Welterweight', champion: 'Belal Muhammad', contenders: ['Leon Edwards', 'Shavkat Rakhmonov', 'Kamaru Usman', 'Jack Della Maddalena'] },
  { division: 'Heavyweight', champion: 'Jon Jones', contenders: ['Tom Aspinall (Interim)', 'Ciryl Gane', 'Alexander Volkov', 'Sergei Pavlovich'] }
];

export const MOCK_UFC_EVENTS = [
  { id: 'ufc-310', title: 'UFC 310: Makhachev vs. Tsarukyan', date: 'Dec 14, 2026', venue: 'T-Mobile Arena, Las Vegas', mainCard: ['Islam Makhachev vs Arman Tsarukyan', 'Shavkat Rakhmonov vs Belal Muhammad', 'Ciryl Gane vs Alexander Volkov'] }
];

// ==========================================
// API Simulation Methods
// ==========================================

export function searchSports(query: string) {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];

  const results: any[] = [];

  // Search matches
  MOCK_MATCHES.forEach(match => {
    if (
      match.homeTeam.name.toLowerCase().includes(normalized) ||
      match.awayTeam.name.toLowerCase().includes(normalized) ||
      match.leagueName.toLowerCase().includes(normalized)
    ) {
      results.push({
        id: match.id,
        type: 'match',
        name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        subtitle: `${match.leagueName} (${match.status})`,
        sport: match.sport,
        image: match.homeTeam.logo
      });
    }
  });

  // Search teams
  Object.values(MOCK_TEAMS).forEach(team => {
    if (team.name.toLowerCase().includes(normalized) || team.sport.toLowerCase().includes(normalized)) {
      results.push({
        id: team.id,
        type: 'team',
        name: team.name,
        subtitle: `${team.sport} Team - ${team.leagueName}`,
        sport: team.sport.toLowerCase(),
        image: team.logo
      });
    }
  });

  // Search players
  Object.values(MOCK_PLAYERS).forEach(player => {
    if (player.name.toLowerCase().includes(normalized) || player.position.toLowerCase().includes(normalized) || player.nationality.toLowerCase().includes(normalized)) {
      results.push({
        id: player.id,
        type: 'player',
        name: player.name,
        subtitle: `${player.position} (${player.teamName})`,
        sport: player.teamId === 'rcb' ? 'cricket' : 'football',
        image: player.photo
      });
    }
  });

  // Search leagues
  Object.values(MOCK_LEAGUES).forEach(league => {
    if (league.name.toLowerCase().includes(normalized)) {
      results.push({
        id: league.id,
        type: 'league',
        name: league.name,
        subtitle: `${league.sport.toUpperCase()} Competition`,
        sport: league.sport,
        image: league.logo || '🏆'
      });
    }
  });

  return results.slice(0, 10);
}

export function getSportsMatch(id: string): MatchDetails | undefined {
  return MOCK_MATCHES.find(m => m.id === id);
}

export function getSportsTeam(id: string): TeamStats | undefined {
  return MOCK_TEAMS[id] || Object.values(MOCK_TEAMS).find(t => t.id === id);
}

export function getSportsPlayer(id: string): PlayerStats | undefined {
  return MOCK_PLAYERS[id] || Object.values(MOCK_PLAYERS).find(p => p.id === id);
}

export function getSportsLeague(id: string): LeagueDetails | undefined {
  return MOCK_LEAGUES[id] || Object.values(MOCK_LEAGUES).find(l => l.id === id);
}
