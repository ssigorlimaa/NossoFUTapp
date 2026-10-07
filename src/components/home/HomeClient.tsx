 "use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  Ellipsis,
  Home,
  Newspaper,
  Radio,
  Search,
  Star,
  Trophy,
  ListFilter,
  ArrowRight,
  Sparkles
} from "lucide-react";
import type { League, MatchWithRelations } from "@/types/database";
import { getHomeDataClient } from "@/lib/supabase/client-queries";
import { useMatchesRealtime } from "@/hooks/useMatchesRealtime";

interface Props {
  initialDate: string;
  initialMatches: MatchWithRelations[];
  initialLeagues: League[];
}

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(dateKey: string, amount: number) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return localDateKey(date);
}

function formatDate(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short"
  })
    .format(date)
    .replace(".", "")
    .toUpperCase();
}

function weekday(dateKey: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short"
  })
    .format(new Date(`${dateKey}T12:00:00`))
    .replace(".", "")
    .slice(0, 3)
    .toUpperCase();
}

function isToday(dateKey: string) {
  return dateKey === localDateKey(new Date());
}

function matchTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function TeamBadge({
  name,
  shortName,
  logo
}: {
  name: string;
  shortName: string | null;
  logo: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95 ring-1 ring-white/10">
        {logo ? (
          <img src={logo} alt="" className="size-7 object-contain" />
        ) : (
          <span className="text-[10px] font-black text-slate-800">
            {(shortName ?? name.slice(0, 3)).slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>
      <span className="truncate text-[13px] font-extrabold text-white">
        {shortName ?? name}
      </span>
    </div>
  );
}

function MatchCard({ match }: { match: MatchWithRelations }) {
  const live = match.status === "IN_PLAY";
  const paused = match.status === "PAUSED";
  const status =
    live && match.current_minute != null
      ? `${match.current_minute}'`
      : paused
        ? "INT"
        : match.status === "FINISHED"
          ? "FIM"
          : matchTime(match.match_time);

  return (
    <article className="group overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#0b1426] shadow-[0_12px_40px_rgba(0,0,0,.22)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {match.league.logo_url ? (
            <img src={match.league.logo_url} alt="" className="size-4 object-contain" />
          ) : (
            <Trophy className="size-3.5 text-[#f5b91b]" />
          )}
          <span className="truncate">{match.league.name}</span>
        </div>
        <div
          className={[
            "flex shrink-0 items-center gap-1.5 text-[11px] font-black",
            live ? "text-red-400" : paused ? "text-amber-300" : "text-slate-400"
          ].join(" ")}
        >
          {live ? <CircleDot className="size-3.5 animate-pulse" /> : <Clock3 className="size-3.5" />}
          {status}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3.5 py-4">
        <TeamBadge name={match.home_team.name} shortName={match.home_team.short_name} logo={match.home_team.logo_url} />
        <div className="flex items-center gap-1.5 text-2xl font-black tabular-nums">
          <span className={live ? "text-[#f5b91b]" : "text-white"}>{match.home_score}</span>
          <span className="text-slate-600">×</span>
          <span className={live ? "text-[#f5b91b]" : "text-white"}>{match.away_score}</span>
        </div>
        <div className="flex justify-end">
          <TeamBadge name={match.away_team.name} shortName={match.away_team.short_name} logo={match.away_team.logo_url} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] px-3.5 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {live ? "Em andamento" : paused ? "Intervalo" : "Partida"}
        </span>
        <button
          type="button"
          aria-label="Favoritar partida"
          className="flex size-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/5 hover:text-[#f5b91b]"
        >
          <Star className="size-4" />
        </button>
      </div>
    </article>
  );
}

function DateStrip({
  selectedDate,
  onChange
}: {
  selectedDate: string;
  onChange: (date: string) => void;
}) {
  const days = [-2, -1, 0, 1, 2].map((offset) => shiftDate(selectedDate, offset));

  return (
    <section className="px-4 pt-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange(shiftDate(selectedDate, -1))}
          className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-400"
          aria-label="Dia anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {isToday(selectedDate) ? "Hoje" : "Jogos"}
          </p>
          <p className="mt-0.5 text-sm font-black capitalize text-white">
            {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(
              new Date(`${selectedDate}T12:00:00`)
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange(shiftDate(selectedDate, 1))}
          className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-400"
          aria-label="Próximo dia"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {days.map((day) => {
          const active = day === selectedDate;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onChange(day)}
              className={[
                "rounded-2xl border px-2 py-2.5 text-center transition",
                active
                  ? "border-[#f5b91b] bg-[#f5b91b] text-[#07111f] shadow-[0_8px_25px_rgba(245,185,27,.18)]"
                  : "border-white/[0.07] bg-white/[0.035] text-slate-400"
              ].join(" ")}
            >
              <span className="block text-[9px] font-black">{weekday(day)}</span>
              <span className="mt-0.5 block text-lg font-black">{day.slice(-2)}</span>
              <span className="block text-[8px] font-bold opacity-70">{formatDate(day).split(" ")[1]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function HomeClient({
  initialDate,
  initialMatches,
  initialLeagues
}: Props) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [leagueId, setLeagueId] = useState("all");

  const query = useQuery({
    queryKey: ["home-data", selectedDate],
    queryFn: () => getHomeDataClient(selectedDate),
    initialData:
      selectedDate === initialDate
        ? { matches: initialMatches, leagues: initialLeagues }
        : undefined,
    placeholderData: (previous) => previous
  });

  useMatchesRealtime();

  const matches = query.data?.matches ?? [];
  const leagues = query.data?.leagues ?? [];

  const filtered = useMemo(
    () => leagueId === "all" ? matches : matches.filter((m) => m.league_id === leagueId),
    [matches, leagueId]
  );

  const live = filtered.filter((m) => m.status === "IN_PLAY" || m.status === "PAUSED");
  const upcoming = filtered.filter((m) => m.status === "SCHEDULED").slice(0, 8);
  const liveCount = matches.filter((m) => m.status === "IN_PLAY").length;

  return (
    <div className="min-h-screen bg-[#020817] pb-24 text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#020817]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#f5b91b] to-[#ff7a00] text-[#06101d] shadow-[0_8px_25px_rgba(245,185,27,.2)]">
              <span className="text-xl">⚽</span>
            </div>
            <div>
              <h1 className="text-[21px] font-black tracking-tight">
                Nosso<span className="text-[#f5b91b]">FUT</span>
              </h1>
              <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-slate-500">futebol em tempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Pesquisar" className="grid size-10 place-items-center rounded-full text-slate-300">
              <Search className="size-5" />
            </button>
            <button type="button" aria-label="Notificações" className="relative grid size-10 place-items-center rounded-full text-slate-300">
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-[#020817]" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl">
        <section className="px-4 pt-4">
          <div className="relative overflow-hidden rounded-[28px] border border-[#f5b91b]/50 bg-[radial-gradient(circle_at_75%_15%,rgba(245,185,27,.18),transparent_32%),linear-gradient(135deg,#07152a,#030812_72%)] p-5 shadow-[0_18px_50px_rgba(0,0,0,.3)]">
            <div className="absolute -right-14 -top-14 size-40 rounded-full border border-[#f5b91b]/20" />
            <div className="absolute -right-4 -bottom-16 size-36 rounded-full border border-orange-500/10" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-400 ring-1 ring-red-500/20">
                <span className="size-2 animate-pulse rounded-full bg-red-500" />
                ao vivo agora
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <div className="text-5xl font-black leading-none text-white">{liveCount}</div>
                  <div className="mt-1 text-sm font-black uppercase tracking-wide text-white">partidas</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-widest text-[#f5b91b]">em tempo real</div>
                </div>
                <div className="hidden text-right sm:block">
                  <Sparkles className="ml-auto size-7 text-[#f5b91b]" />
                  <p className="mt-2 max-w-[150px] text-xs font-semibold leading-5 text-slate-400">
                    Placares, minutos e eventos atualizados automaticamente.
                  </p>
                </div>
              </div>
              <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5b91b] px-4 py-2.5 text-xs font-black uppercase text-[#06101d]">
                acompanhar ao vivo
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </section>

        <DateStrip selectedDate={selectedDate} onChange={(date) => { setSelectedDate(date); setLeagueId("all"); }} />

        <section className="mt-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setLeagueId("all")}
              className={[
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-black uppercase",
                leagueId === "all" ? "border-[#f5b91b] bg-[#f5b91b] text-[#06101d]" : "border-white/[0.08] bg-white/[0.035] text-slate-300"
              ].join(" ")}
            >
              <Trophy className="size-4" /> todos
            </button>
            {leagues.map((league) => (
              <button
                key={league.id}
                type="button"
                onClick={() => setLeagueId(league.id)}
                className={[
                  "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-black uppercase",
                  leagueId === league.id ? "border-[#f5b91b] bg-[#f5b91b] text-[#06101d]" : "border-white/[0.08] bg-white/[0.035] text-slate-300"
                ].join(" ")}
              >
                {league.logo_url ? <img src={league.logo_url} alt="" className="size-4 object-contain" /> : <ListFilter className="size-4" />}
                {league.name}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7 px-4">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="size-5 text-red-500" />
                <h2 className="text-xl font-black">Ao vivo</h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">O jogo acontecendo agora</p>
            </div>
            <button type="button" className="text-[11px] font-black uppercase text-[#f5b91b]">ver todos →</button>
          </div>

          {live.length > 0 ? (
            <div className="space-y-3">
              {live.map((match) => <MatchCard key={match.id} match={match} />)}
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.025] px-5 py-9 text-center">
              <Radio className="mx-auto size-8 text-slate-600" />
              <p className="mt-3 text-sm font-bold text-slate-400">Nenhuma partida ao vivo agora.</p>
              <p className="mt-1 text-xs text-slate-600">Quando começar, aparece aqui automaticamente.</p>
            </div>
          )}
        </section>

        <section className="mt-8 px-4">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Clock3 className="size-5 text-[#f5b91b]" />
                <h2 className="text-xl font-black">Próximos jogos</h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">Fique de olho no que vem aí</p>
            </div>
            <button type="button" className="text-[11px] font-black uppercase text-[#f5b91b]">calendário →</button>
          </div>

          <div className="space-y-3">
            {upcoming.map((match) => <MatchCard key={match.id} match={match} />)}
          </div>

          {upcoming.length === 0 && (
            <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.025] px-5 py-8 text-center text-sm font-semibold text-slate-500">
              Nenhum jogo programado para este dia.
            </div>
          )}
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-[#020817]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-xl items-center justify-around px-2">
          {[
            { label: "Início", icon: Home, active: true },
            { label: "Ao vivo", icon: Radio, active: false },
            { label: "Jogos", icon: CalendarDays, active: false },
            { label: "Notícias", icon: Newspaper, active: false },
            { label: "Mais", icon: Ellipsis, active: false }
          ].map(({ label, icon: Icon, active }) => (
            <button key={label} type="button" className={["flex min-w-[58px] flex-col items-center gap-1 rounded-2xl px-3 py-2", active ? "text-[#f5b91b]" : "text-slate-500"].join(" ")}>
              <Icon className="size-5" strokeWidth={active ? 2.7 : 2} />
              <span className="text-[9px] font-black uppercase tracking-wide">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {query.isFetching && (
        <div className="pointer-events-none fixed right-3 top-[76px] z-50 rounded-full bg-[#f5b91b] px-3 py-1 text-[9px] font-black uppercase text-[#06101d] shadow-lg">
          atualizando…
        </div>
      )}
    </div>
  );
}
