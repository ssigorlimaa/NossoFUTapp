const FEATURED_LEAGUE_IDS = new Set([
  "1", "2", "3", "4", "9", "11", "13", "15",
  "39", "61", "78", "88", "94", "128", "135", "140",
  "253", "262", "307", "848"
]);

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

export function isFeaturedLeague(
  name: string,
  country?: string | null,
  externalId?: string | null
) {
  if (country?.trim().toLowerCase() === "brazil") return true;
  if (externalId && FEATURED_LEAGUE_IDS.has(externalId)) return true;

  // Fallback is intentionally country-specific so "Premier League" from Uganda,
  // for example, can never be mistaken for England's Premier League.
  const normalized = normalize(name);
  const c = country?.trim().toLowerCase() ?? "";

  const allowedByCountry: Record<string, Set<string>> = {
    england: new Set(["premier league"]),
    spain: new Set(["la liga"]),
    italy: new Set(["serie a"]),
    germany: new Set(["bundesliga"]),
    france: new Set(["ligue 1"]),
    netherlands: new Set(["eredivisie"]),
    portugal: new Set(["primeira liga"]),
    argentina: new Set(["liga profesional argentina"]),
    usa: new Set(["mls"]),
    "united states": new Set(["mls"]),
    mexico: new Set(["liga mx"]),
    "saudi-arabia": new Set(["saudi pro league"]),
    "saudi arabia": new Set(["saudi pro league"]),
    world: new Set([
      "uefa champions league",
      "uefa europa league",
      "uefa conference league",
      "conmebol libertadores",
      "conmebol sudamericana",
      "world cup",
      "uefa euro",
      "copa america",
      "fifa club world cup"
    ])
  };

  const names = allowedByCountry[c];
  return !!names && (names.has(normalized) || [...names].some((n) => normalized.includes(n)));
}

export function featuredLeagues<T extends {
  name: string;
  country?: string | null;
  external_id?: string | null;
}>(leagues: T[]) {
  return leagues.filter((league) =>
    isFeaturedLeague(league.name, league.country, league.external_id)
  );
}

export function featuredMatches<T extends {
  league: {
    name: string;
    country?: string | null;
    external_id?: string | null;
  };
}>(matches: T[]) {
  return matches.filter((match) =>
    isFeaturedLeague(match.league.name, match.league.country, match.league.external_id)
  );
}
