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
  external_id: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  short_name: string | null;
  external_id: string | null;
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


export interface MatchEvent {
  id: string;
  external_id: string | null;
  match_id: string;
  team_id: string;
  player_name: string | null;
  minute: number;
  extra_minute: number | null;
  event_type: MatchEventType;
  detail: string | null;
  assist_player_name: string | null;
  created_at: string;
}

export interface MatchStatistics {
  id: string;
  match_id: string;
  team_id: string;
  possession: number | null;
  shots_total: number | null;
  shots_on_target: number | null;
  shots_off_target: number | null;
  shots_blocked: number | null;
  shots_inside_box: number | null;
  shots_outside_box: number | null;
  fouls: number | null;
  corners: number | null;
  offsides: number | null;
  yellow_cards: number | null;
  red_cards: number | null;
  goalkeeper_saves: number | null;
  passes_total: number | null;
  passes_accurate: number | null;
  pass_accuracy: number | null;
  expected_goals: number | null;
  updated_at: string;
}
