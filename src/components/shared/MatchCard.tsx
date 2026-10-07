"use client";

import { useEffect, useState } from "react";
import { CircleDot, Clock3, Star, Trophy } from "lucide-react";
import type { MatchWithRelations } from "@/types/database";

export default function MatchCard({ match }: { match: MatchWithRelations }) {
  const [favorite, setFavorite] = useState(false);
  const [homeLogoError, setHomeLogoError] = useState(false);
  const [awayLogoError, setAwayLogoError] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(window.localStorage.getItem("nossofut:favorites") ?? "[]") as string[];
    setFavorite(saved.includes(match.id));
  }, [match.id]);

  function toggleFavorite() {
    const saved = JSON.parse(window.localStorage.getItem("nossofut:favorites") ?? "[]") as string[];
    const next = saved.includes(match.id) ? saved.filter((id) => id !== match.id) : [...saved, match.id];
    window.localStorage.setItem("nossofut:favorites", JSON.stringify(next));
    setFavorite(next.includes(match.id));
  }

  const live = match.status === "IN_PLAY";
  const paused = match.status === "PAUSED";
  const status = live && match.current_minute != null ? `${match.current_minute}'` : paused ? "INT" : match.status === "FINISHED" ? "FIM" : new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(match.match_time));

  function Badge({ name, shortName, logo, failed }: { name: string; shortName: string | null; logo: string | null; failed: boolean }) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95 ring-1 ring-white/10">
          {logo && !failed ? <img src={logo} alt="" className="size-7 object-contain" onError={() => { if (name === match.home_team.name) setHomeLogoError(true); else setAwayLogoError(true); }} /> : <span className="text-[10px] font-black text-slate-800">{(shortName ?? name.slice(0, 3)).slice(0, 3).toUpperCase()}</span>}
        </div>
        <span className="truncate text-[13px] font-extrabold text-white">{shortName ?? name}</span>
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#0b1426] shadow-[0_12px_40px_rgba(0,0,0,.22)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {match.league.logo_url ? <img src={match.league.logo_url} alt="" className="size-4 object-contain" /> : <Trophy className="size-3.5 text-[#f5b91b]" />}
          <span className="truncate">{match.league.name}</span>
        </div>
        <div className={["flex shrink-0 items-center gap-1.5 text-[11px] font-black", live ? "text-red-400" : paused ? "text-amber-300" : "text-slate-400"].join(" ")}>
          {live ? <CircleDot className="size-3.5 animate-pulse" /> : <Clock3 className="size-3.5" />}{status}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3.5 py-4">
        <Badge name={match.home_team.name} shortName={match.home_team.short_name} logo={match.home_team.logo_url} failed={homeLogoError} />
        <div className="flex items-center gap-1.5 text-2xl font-black tabular-nums"><span className={live ? "text-[#f5b91b]" : "text-white"}>{match.home_score}</span><span className="text-slate-600">×</span><span className={live ? "text-[#f5b91b]" : "text-white"}>{match.away_score}</span></div>
        <div className="flex justify-end"><Badge name={match.away_team.name} shortName={match.away_team.short_name} logo={match.away_team.logo_url} failed={awayLogoError} /></div>
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-3.5 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{live ? "Em andamento" : paused ? "Intervalo" : match.status === "FINISHED" ? "Encerrada" : "Partida"}</span>
        <button type="button" onClick={toggleFavorite} aria-label={favorite ? "Remover dos favoritos" : "Favoritar partida"} className="flex size-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/5 hover:text-[#f5b91b]">
          <Star className={["size-4", favorite ? "fill-[#f5b91b] text-[#f5b91b]" : ""].join(" ")} />
        </button>
      </div>
    </article>
  );
}
