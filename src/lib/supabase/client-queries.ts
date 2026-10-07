"use client";
import { createClient } from "./client";
import { matchSelect } from "./selects";
import type { League, MatchWithRelations } from "@/types/database";

function dayBounds(date: string) {
  const start = new Date(`${date}T00:00:00-03:00`);
  const end = new Date(`${date}T23:59:59.999-03:00`);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function getHomeDataClient(date: string): Promise<{
  matches: MatchWithRelations[];
  leagues: League[];
}> {
  const supabase = createClient();
  const { start, end } = dayBounds(date);

  const [matchesResult, leaguesResult] = await Promise.all([
    supabase.from("matches").select(matchSelect).gte("match_time", start).lte("match_time", end).order("match_time", { ascending: true }).limit(100),
    supabase.from("leagues").select("id, name, country, external_id, logo_url, created_at").order("name", { ascending: true }).limit(100),
  ]);

  if (matchesResult.error) throw matchesResult.error;
  if (leaguesResult.error) throw leaguesResult.error;

  return { matches: (matchesResult.data ?? []) as unknown as MatchWithRelations[], leagues: (leaguesResult.data ?? []) as League[] };
}
