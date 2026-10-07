export type MatchStatus =
  | "SCHEDULED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED";

export type MatchEventType =
  | "GOAL"
  | "YELLOW_CARD"
  | "RED_CARD"
  | "SUBSTITUTION";

export interface League {
  id: string;
  name: string;
  country: string;
  logo_url: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  short_name: string | null;
  logo_url: string | null;
  league_id: string;
  created_at: string;
}

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  league_id: string;
  home_score: number;
  away_score: number;
  status: MatchStatus;
  match_time: string;
  current_minute: number | null;
  created_at: string;
  updated_at: string;
}

export interface MatchWithRelations extends Match {
  home_team: Team;
  away_team: Team;
  league: League;
}
