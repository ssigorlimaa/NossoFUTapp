"use client";

import { useEffect, useState } from "react";
import { CircleDot, Clock3, Star, Trophy } from "lucide-react";
import type { MatchWithRelations } from "@/types/database";

function formatKickoff(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function MatchCard({ match }: { match: MatchWithRelations }) {
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
    side,
    failed,
    onLogoError
  }: {
    name: string;
    shortName: string | null;
    logo: string | null;
    side: "home" | "away";
    failed: boolean;
    onLogoError: () => void;
  }) {
    const displayName = shortName || name;

    return (
      <div
        className={[
          "min-w-0 flex-1",
          side === "home" ? "items-center text-center" : "items-center text-center"
        ].join(" ")}
      >
        <div className="mx-auto grid size-[58px] place-items-center rounded-[18px] border border-white/10 bg-white shadow-[0_8px_22px_rgba(0,0,0,.2)]">
          {logo && !failed ? (
            <img
              src={logo}
              alt={`Escudo do ${name}`}
              className="size-[46px] object-contain"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={onLogoError}
            />
          ) : (
            <span className="text-[11px] font-black text-slate-800">
              {(name.slice(0, 3) || "TIM").toUpperCase()}
            </span>
          )}
        </div>

        <p className="mt-2 line-clamp-2 min-h-[32px] px-1 text-[12px] font-extrabold leading-4 text-white">
          {displayName}
        </p>
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,#0c172b,#081121)] shadow-[0_14px_40px_rgba(0,0,0,.25)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {match.league.logo_url ? (
            <div className="grid size-6 shrink-0 place-items-center rounded-lg bg-white/95">
              <img
                src={match.league.logo_url}
                alt=""
                className="size-4 object-contain"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <Trophy className="size-4 shrink-0 text-[#f5b91b]" />
          )}
          <span className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            {match.league.name}
          </span>
        </div>

        <div
          className={[
            "flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-black",
            live
              ? "bg-red-500/10 text-red-400"
              : paused
                ? "bg-amber-400/10 text-amber-300"
                : "bg-white/[0.04] text-slate-400"
          ].join(" ")}
        >
          {live ? (
            <CircleDot className="size-3 animate-pulse" />
          ) : (
            <Clock3 className="size-3" />
          )}
          {status}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 px-4 py-5">
        <Team
          name={match.home_team.name}
          shortName={match.home_team.short_name}
          logo={match.home_team.logo_url}
          side="home"
          failed={homeLogoError}
          onLogoError={() => setHomeLogoError(true)}
        />

        <div className="flex min-w-[82px] flex-col items-center pt-5">
          <div className="flex items-center gap-2 text-[30px] font-black leading-none tabular-nums">
            <span className={live ? "text-[#f5b91b]" : "text-white"}>
              {match.home_score}
            </span>
            <span className="text-[20px] text-slate-600">×</span>
            <span className={live ? "text-[#f5b91b]" : "text-white"}>
              {match.away_score}
            </span>
          </div>

          <span
            className={[
              "mt-2 text-[9px] font-black uppercase tracking-[0.16em]",
              live ? "text-red-400" : paused ? "text-amber-300" : "text-slate-600"
            ].join(" ")}
          >
            {live ? "ao vivo" : paused ? "intervalo" : match.status === "FINISHED" ? "encerrado" : "início"}
          </span>
        </div>

        <Team
          name={match.away_team.name}
          shortName={match.away_team.short_name}
          logo={match.away_team.logo_url}
          side="away"
          failed={awayLogoError}
          onLogoError={() => setAwayLogoError(true)}
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
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
          onClick={toggleFavorite}
          aria-label={favorite ? "Remover dos favoritos" : "Favoritar partida"}
          className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-white/5 hover:text-[#f5b91b]"
        >
          <Star
            className={[
              "size-[17px]",
              favorite ? "fill-[#f5b91b] text-[#f5b91b]" : ""
            ].join(" ")}
          />
        </button>
      </div>
    </article>
  );
}
