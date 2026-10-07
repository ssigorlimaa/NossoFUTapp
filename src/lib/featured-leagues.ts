export const FEATURED_LEAGUES = [
  "UEFA Champions League",
  "UEFA Europa League",
  "UEFA Conference League",
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Eredivisie",
  "Primeira Liga",
  "CONMEBOL Libertadores",
  "CONMEBOL Sudamericana",
  "Liga Profesional Argentina",
  "MLS",
  "Liga MX",
  "Saudi Pro League",
  "World Cup",
  "UEFA Euro",
  "Copa America",
  "FIFA Club World Cup"
] as const;

const NORMALIZED = new Set(FEATURED_LEAGUES.map(normalize));

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(conmebol|uefa|fifa)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isFeaturedLeague(name: string, country?: string) {
  if (country?.trim().toLowerCase() === "brazil") return true;

  const normalized = normalize(name);
  return (
    NORMALIZED.has(normalized) ||
    FEATURED_LEAGUES.some((league) => normalized.includes(normalize(league)))
  );
}

export function featuredLeagues<T extends { name: string; country?: string | null }>(
  leagues: T[]
) {
  return leagues.filter((league) => isFeaturedLeague(league.name, league.country ?? undefined));
}

export function featuredMatches<
  T extends { league: { name: string; country?: string | null } }
>(matches: T[]) {
  return matches.filter((match) =>
    isFeaturedLeague(match.league.name, match.league.country ?? undefined)
  );
}
