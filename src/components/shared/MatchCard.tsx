"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDot, Clock3, Star, Trophy } from "lucide-react";
import type { MatchWithRelations } from "@/types/database";

function formatKickoff(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function imageProxy(url: string | null) {
  return url ? `/api/football-logo?url=${encodeURIComponent(url)}` : null;
}

function leagueDisplayName(name: string, country: string, externalId: string | null) {
  const byId: Record<string, string> = {
    "71": "Brasileirão Série A",
    "72": "Brasileirão Série B",
    "73": "Copa do Brasil",
    "2": "Champions League",
    "3": "Europa League",
    "848": "Conference League",
    "39": "Premier League",
    "140": "La Liga",
    "135": "Serie A italiana",
    "78": "Bundesliga",
    "61": "Ligue 1",
    "13": "Libertadores",
    "11": "Sul-Americana",
    "1": "Copa do Mundo",
    "4": "Eurocopa",
    "9": "Copa América",
    "15": "Mundial de Clubes"
  };

  if (externalId && byId[externalId]) return byId[externalId];

  if (country.toLowerCase() === "brazil") {
    const replacements: Array<[RegExp, string]> = [
      [/^Serie A$/i, "Brasileirão Série A"],
      [/^Serie B$/i, "Brasileirão Série B"],
      [/^Copa do Brasil$/i, "Copa do Brasil"]
    ];

    for (const [pattern, label] of replacements) {
      if (pattern.test(name)) return label;
    }
  }

  return name;
}

export default function MatchCard({ match }: { match: MatchWithRelations }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);
  const [homeLogoError, setHomeLogoError] = useState(false);
  const [awayLogoError, setAwayLogoError] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(
      window.localStorage.getItem("nossofut:favorites") ?? "[]"
    ) as string[];
    setFavorite(saved.includes(match.id));
  }, [match.id]);

  function toggleFavorite() {
    const saved = JSON.parse(
      window.localStorage.getItem("nossofut:favorites") ?? "[]"
    ) as string[];
    const next = saved.includes(match.id)
      ? saved.filter((id) => id !== match.id)
      : [...saved, match.id];

    window.localStorage.setItem("nossofut:favorites", JSON.stringify(next));
    setFavorite(next.includes(match.id));
  }

  const live = match.status === "IN_PLAY";
  const paused = match.status === "PAUSED";
  const status =
    live && match.current_minute != null
      ? `${match.current_minute}'`
      : paused
        ? "INT"
        : match.status === "FINISHED"
          ? "FIM"
          : formatKickoff(match.match_time);

  function Team({
    name,
    shortName,
    logo,
    failed,
    onLogoError
  }: {
    name: string;
    shortName: string | null;
    logo: string | null;
    failed: boolean;
    onLogoError: () => void;
  }) {
    const displayName = shortName || name;
    const proxiedLogo = imageProxy(logo);

    return (
      <div className="min-w-0 flex-1 text-center">
        <div className="relative mx-auto grid size-[58px] place-items-center rounded-[18px] border border-white/20 bg-[linear-gradient(145deg,#ffffff,#dfe6ee)] shadow-[inset_2px_2px_4px_rgba(255,255,255,.95),inset_-4px_-5px_8px_rgba(15,23,42,.18),0_12px_24px_rgba(0,0,0,.28)] transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-95">
          {proxiedLogo && !failed ? (
            <img
              src={proxiedLogo}
              alt={`Escudo do ${name}`}
              className="relative z-10 size-[46px] object-contain drop-shadow-[0_5px_4px_rgba(15,23,42,.32)]"
              loading="lazy"
              onError={onLogoError}
            />
          ) : (
            <span className="relative z-10 text-[11px] font-black text-slate-800">
              {(name.slice(0, 3) || "TIM").toUpperCase()}
            </span>
          )}
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-[30px] px-1 text-[11px] font-extrabold leading-4 text-white">
          {displayName}
        </p>
      </div>
    );
  }

  const leagueName = leagueDisplayName(
    match.league.name,
    match.league.country,
    match.league.external_id
  );

  return (
    <article onClick={() => router.push(`/jogos/${match.id}`)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") router.push(`/jogos/${match.id}`); }} className="group cursor-pointer overflow-hidden rounded-[26px] border border-white/[0.09] bg-[radial-gradient(circle_at_50%_42%,rgba(245,185,27,.045),transparent_35%),linear-gradient(145deg,#101d34,#07101f)] shadow-[0_18px_45px_rgba(0,0,0,.34)] transition duration-200 hover:-translate-y-0.5 hover:border-[#f5b91b]/20 hover:shadow-[0_22px_55px_rgba(0,0,0,.42)] active:scale-[.995]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          {match.league.logo_url ? (
            <div className="grid size-7 shrink-0 place-items-center rounded-xl border border-white/60 bg-[linear-gradient(145deg,#fff,#d9e1ea)] shadow-[inset_1px_1px_3px_white,inset_-2px_-2px_4px_rgba(15,23,42,.18),0_4px_9px_rgba(0,0,0,.25)]">
              <img
                src={imageProxy(match.league.logo_url) ?? ""}
                alt=""
                className="size-[18px] object-contain drop-shadow-[0_2px_2px_rgba(15,23,42,.3)]"
                loading="lazy"
              />
            </div>
          ) : (
            <Trophy className="size-4 shrink-0 text-[#f5b91b]" />
          )}
          <span className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            {leagueName}
          </span>
        </div>

        <div className={[
          "flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-black",
          live ? "bg-red-500/10 text-red-400" :
          paused ? "bg-amber-400/10 text-amber-300" :
          "bg-white/[0.04] text-slate-400"
        ].join(" ")}>
          {live ? <CircleDot className="size-3 animate-pulse" /> : <Clock3 className="size-3" />}
          {status}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-3.5 py-3.5">
        <Team
          name={match.home_team.name}
          shortName={match.home_team.short_name}
          logo={match.home_team.logo_url}
          failed={homeLogoError}
          onLogoError={() => setHomeLogoError(true)}
        />

        <div className="flex min-w-[70px] flex-col items-center pt-3">
          <div className="flex items-center gap-2 text-[26px] font-black leading-none tabular-nums">
            <span className={live ? "text-[#f5b91b]" : "text-white"}>{match.home_score}</span>
            <span className="text-[17px] text-slate-600">×</span>
            <span className={live ? "text-[#f5b91b]" : "text-white"}>{match.away_score}</span>
          </div>
          <span className={[
            "mt-1.5 text-[9px] font-black uppercase tracking-[0.16em]",
            live ? "text-red-400" : paused ? "text-amber-300" : "text-slate-600"
          ].join(" ")}>
            {live ? "ao vivo" : paused ? "intervalo" : match.status === "FINISHED" ? "encerrado" : "início"}
          </span>
        </div>

        <Team
          name={match.away_team.name}
          shortName={match.away_team.short_name}
          logo={match.away_team.logo_url}
          failed={awayLogoError}
          onLogoError={() => setAwayLogoError(true)}
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] px-3.5 py-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">
          {match.status === "SCHEDULED"
            ? `Começa às ${formatKickoff(match.match_time)}`
            : live
              ? "Atualização em tempo real"
              : paused
                ? "Jogo no intervalo"
                : "Resultado final"}
        </span>
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); toggleFavorite(); }}
          aria-label={favorite ? "Remover dos favoritos" : "Favoritar partida"}
          className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-white/5 hover:text-[#f5b91b]"
        >
          <Star className={[
            "size-[17px]",
            favorite ? "fill-[#f5b91b] text-[#f5b91b]" : ""
          ].join(" ")} />
        </button>
      </div>
    </article>
  );
}
