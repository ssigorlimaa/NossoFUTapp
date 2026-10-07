export const matchSelect = `
  id,
  home_team_id,
  away_team_id,
  league_id,
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
  league:leagues!matches_league_id_fkey (
    id,
    name,
    country,
    external_id,
    logo_url,
    created_at
  )
`;
