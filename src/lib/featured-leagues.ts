export const FEATURED_LEAGUES = [
  // Brasil
  "Brasileirão Série A",
  "Brasileirão Série B",
  "Copa do Brasil",
  "Paulista",
  "Carioca",
  "Mineiro",
  "Gaúcho",
  "Paranaense",
  // Europa
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
  // América do Sul
  "CONMEBOL Libertadores",
  "CONMEBOL Sudamericana",
  "Liga Profesional Argentina",
  // América do Norte
  "MLS",
  "Liga MX",
  // Ásia
  "Saudi Pro League",
  // Seleções / grandes torneios
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

export function isFeaturedLeague(name: string) {
  const normalized = normalize(name);
  return NORMALIZED.has(normalized) || FEATURED_LEAGUES.some((league) => normalized.includes(normalize(league)));
}

export function featuredLeagues<T extends { name: string }>(leagues: T[]) {
  return leagues.filter((league) => isFeaturedLeague(league.name));
}

export function featuredMatches<T extends { league: { name: string } }>(matches: T[]) {
  return matches.filter((match) => isFeaturedLeague(match.league.name));
}
