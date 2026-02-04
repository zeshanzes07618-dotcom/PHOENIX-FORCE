
export interface Player {
  id: string;
  name: string;
  kills: number;
  matchesPlayed: number;
  avatar: string;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  opponent: string;
  tournament: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  tournament: string;
  opponent: string;
  result: 'VICTORY' | 'DEFEAT';
  score: string;
  mvp: string;
}

export interface AppState {
  clanName: string;
  players: Player[];
  matches: Match[];
  history: HistoryEntry[];
}
