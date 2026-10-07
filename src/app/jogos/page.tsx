"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  Filter,
  Flame,
  Search,
  Trophy,
  Zap
} from "lucide-react";
import { getHomeDataClient } from "@/lib/supabase/client-queries";
import MatchCard from "@/components/shared/MatchCard";
import AppHeader from "@/components/shared/AppHeader";
import BottomNav from "@/components/navigation/BottomNav";
import { saoPauloDateKey } from "@/lib/date";
import { featuredMatches, featuredLeagues } from "@/lib/featured-leagues";
import type { MatchWithRelations } from "@/types/database";

const COMPETITIONS = [
  ["all", "Todos"],
  ["71", "Brasileirão A"],
  ["72", "Brasileirão B"],
  ["73", "Copa do Brasil"],
  ["2", "Champions"],
  ["3", "Europa League"],
  ["848", "Conference"],
  ["39", "Premier League"],
  ["140", "La Liga"],
  ["135", "Serie A italiana"],
  ["78", "Bundesliga"],
  ["61", "Ligue 1"],
  ["13", "Libertadores"],
  ["11", "Sul-Americana"],
  ["1", "Copa do Mundo"],
  ["4", "Eurocopa"],
  ["9", "Copa América"],
  ["15", "Mundial de Clubes"]
] as const;

function shift(dateKey: string, amount: number) {
  const d = new Date(`${dateKey}T12:00:00`);
  d.setDate(d.getDate() + amount);
  return d.toISOString().slice(0, 10);
}

function dayShort(dateKey: string) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
    .format(new Date(`${dateKey}T12:00:00`))
    .replace(".", "")
    .slice(0, 3)
    .toUpperCase();
}

function monthShort(dateKey: string) {
  return new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(new Date(`${dateKey}T12:00:00`))
    .replace(".", "")
    .toUpperCase();
}

function fullDate(dateKey: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(new Date(`${dateKey}T12:00:00`));
}

function isToday(dateKey: string) {
  return dateKey === saoPauloDateKey();
}

type Mode = "all" | "live" | "scheduled" | "finished";

export default function GamesPage() {
  const today = saoPauloDateKey();
  const [date, setDate] = useState(today);
  const [competition, setCompetition] = useState("all");
  const [mode, setMode] = useState<Mode>("all");
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["games-page", date],
    queryFn: () => getHomeDataClient(date),
    refetchInterval: 60_000,
    refetchOnReconnect: true
  });

  const allMatches = featuredMatches(query.data?.matches ?? []);
  const leagues = featuredLeagues(query.data?.leagues ?? []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return allMatches.filter((match) => {
      const competitionOk =
        competition === "all" || match.league.external_id === competition;

      const modeOk =
        mode === "all" ||
        (mode === "live" && (match.status === "IN_PLAY" || match.status === "PAUSED")) ||
        (mode === "scheduled" && match.status === "SCHEDULED") ||
        (mode === "finished" && match.status === "FINISHED");

      const searchOk =
        !term ||
        match.home_team.name.toLowerCase().includes(term) ||
        match.away_team.name.toLowerCase().includes(term) ||
        match.league.name.toLowerCase().includes(term);

      return competitionOk && modeOk && searchOk;
    });
  }, [allMatches, competition, mode, search]);

  const liveCount = allMatches.filter(
    (m) => m.status === "IN_PLAY" || m.status === "PAUSED"
  ).length;
  const scheduledCount = allMatches.filter((m) => m.status === "SCHEDULED").length;
  const finishedCount = allMatches.filter((m) => m.status === "FINISHED").length;

  const days = [-2, -1, 0, 1, 2].map((n) => shift(date, n));

  const grouped = useMemo(() => {
    const map = new Map<string, { name: string; logo: string | null; matches: MatchWithRelations[] }>();

    filtered.forEach((match) => {
      const id = match.league.external_id ?? match.league_id;
      const current = map.get(id);

      if (current) {
        current.matches.push(match);
      } else {
        map.set(id, {
          name: match.league.name,
          logo: match.league.logo_url,
          matches: [match]
        });
      }
    });

    return [...map.values()];
  }, [filtered]);

  return (
    <div className="min-h-screen bg-[#020817] pb-28 text-white">
      <AppHeader
        onRefresh={() => void query.refetch()}
        refreshing={query.isFetching}
      />

      <main className="mx-auto max-w-xl">
        <section className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-5 pt-5">
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[#f5b91b]/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2 text-[#f5b91b]">
                  <CalendarDays className="size-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em]">Central de jogos</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight">Jogos</h1>
                <p className="mt-1 text-xs text-slate-500">Todos os grandes campeonatos em um só lugar.</p>
              </div>
              <div className="grid size-12 place-items-center rounded-2xl border border-[#f5b91b]/20 bg-[#f5b91b]/10 text-[#f5b91b] shadow-[0_0_30px_rgba(245,185,27,.08)]">
                <Trophy className="size-6" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.06] p-3">
                <div className="flex items-center gap-1.5 text-red-400"><CircleDot className="size-3.5" /><span className="text-[9px] font-black uppercase">Ao vivo</span></div>
                <strong className="mt-1 block text-xl font-black">{liveCount}</strong>
              </div>
              <div className="rounded-2xl border border-[#f5b91b]/10 bg-[#f5b91b]/[0.05] p-3">
                <div className="flex items-center gap-1.5 text-[#f5b91b]"><Clock3 className="size-3.5" /><span className="text-[9px] font-black uppercase">Próximos</span></div>
                <strong className="mt-1 block text-xl font-black">{scheduledCount}</strong>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                <div className="flex items-center gap-1.5 text-slate-400"><Zap className="size-3.5" /><span className="text-[9px] font-black uppercase">Finalizados</span></div>
                <strong className="mt-1 block text-xl font-black">{finishedCount}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pt-4">
          <div className="flex items-center justify-between rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-2">
            <button onClick={() => setDate(shift(date, -1))} aria-label="Dia anterior" className="grid size-11 place-items-center rounded-2xl bg-white/[0.045] text-slate-300 transition hover:bg-white/[0.08] active:scale-95">
              <ChevronLeft className="size-5" />
            </button>
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f5b91b]">{isToday(date) ? "Hoje" : "Data selecionada"}</p>
              <p className="mt-1 text-sm font-black capitalize">{fullDate(date)}</p>
            </div>
            <button onClick={() => setDate(shift(date, 1))} aria-label="Próximo dia" className="grid size-11 place-items-center rounded-2xl bg-white/[0.045] text-slate-300 transition hover:bg-white/[0.08] active:scale-95">
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setDate(day)}
                className={[
                  "rounded-[18px] border px-2 py-3 text-center transition active:scale-95",
                  day === date
                    ? "border-[#f5b91b] bg-[#f5b91b] text-[#06101d] shadow-[0_8px_25px_rgba(245,185,27,.18)]"
                    : "border-white/[0.07] bg-white/[0.03] text-slate-400 hover:bg-white/[0.06]"
                ].join(" ")}
              >
                <span className="block text-[8px] font-black">{dayShort(day)}</span>
                <span className="mt-1 block text-xl font-black">{day.slice(-2)}</span>
                <span className="mt-0.5 block text-[8px] font-bold opacity-70">{monthShort(day)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 pt-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar time ou campeonato..."
              className="h-12 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-[#f5b91b]/50 focus:bg-white/[0.05]"
            />
            <Filter className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#f5b91b]" />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(["all", "live", "scheduled", "finished"] as Mode[]).map((item) => {
              const labels: Record<Mode, string> = { all: "Todos", live: "Ao vivo", scheduled: "Próximos", finished: "Finalizados" };
              const selected = mode === item;
              return (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={[
                    "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[10px] font-black uppercase tracking-wide transition active:scale-95",
                    selected ? "border-[#f5b91b] bg-[#f5b91b] text-[#06101d]" : "border-white/[0.08] bg-white/[0.035] text-slate-400"
                  ].join(" ")}
                >
                  {item === "live" && <CircleDot className="size-3" />}
                  {item === "scheduled" && <Clock3 className="size-3" />}
                  {item === "finished" && <Zap className="size-3" />}
                  {labels[item]}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {COMPETITIONS.map(([id, name]) => (
              <button
                key={id}
                onClick={() => setCompetition(id)}
                className={[
                  "shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-black uppercase tracking-wide transition active:scale-95",
                  competition === id ? "border-[#f5b91b] bg-[#f5b91b] text-[#06101d]" : "border-white/[0.08] bg-white/[0.025] text-slate-400"
                ].join(" ")}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 pb-8 pt-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">{filtered.length} partidas encontradas</p>
              <h2 className="mt-1 text-xl font-black">Programação</h2>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-600">
              <Flame className="size-3.5 text-[#f5b91b]" /> em destaque
            </div>
          </div>

          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.name}>
                <div className="mb-2 flex items-center gap-2 px-1">
                  <div className="grid size-8 place-items-center rounded-xl border border-white/15 bg-[linear-gradient(145deg,#fff,#dbe3eb)] shadow-[inset_1px_1px_3px_white,inset_-2px_-2px_4px_rgba(15,23,42,.16),0_5px_12px_rgba(0,0,0,.22)]">
                    {group.logo ? <img src={group.logo} alt="" className="size-5 object-contain drop-shadow-[0_2px_2px_rgba(15,23,42,.3)]" /> : <Trophy className="size-4 text-slate-700" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-300">{group.name}</p>
                    <p className="text-[9px] text-slate-600">{group.matches.length} {group.matches.length === 1 ? "jogo" : "jogos"}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {group.matches.map((match) => <MatchCard key={match.id} match={match} />)}
                </div>
              </div>
            ))}

            {!grouped.length && (
              <div className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.025] px-5 py-12 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f5b91b]/10 text-[#f5b91b]"><CalendarDays className="size-7" /></div>
                <p className="mt-4 text-sm font-black text-slate-300">Nenhum jogo encontrado</p>
                <p className="mt-1 text-xs text-slate-600">Experimente outra data ou filtro.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav active="games" />
    </div>
  );
}
