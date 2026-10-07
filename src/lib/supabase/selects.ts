export const matchSelect = `
  id,
  home_team_id,
  away_team_id,
  league_id,
  external_id,
  home_score,
  away_score,
  status,
  match_time,
  current_minute,
  created_at,
  updated_at,
  home_team:teams!matches_home_team_id_fkey (
    id,
    name,
    short_name,
    external_id,
    logo_url,
    league_id,
    created_at
  ),
  away_team:teams!matches_away_team_id_fkey (
    id,
    name,
    short_name,
    external_id,
    logo_url,
    league_id,
    created_at
  ),
  match_events:match_events!match_events_match_id_fkey (
    id,
    external_id,
    match_id,
    team_id,
    player_name,
    minute,
    extra_minute,
    event_type,
    detail,
    assist_player_name,
    created_at
  ),
  league:leagues!matches_league_id_fkey (
    id,
    name,
    country,
    external_id,
    logo_url,
    created_at
  )
`;
