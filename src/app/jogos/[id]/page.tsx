"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BarChart3, CircleDot, Clock3, Goal, ShieldAlert, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { matchSelect } from "@/lib/supabase/selects";
import { useMatchesRealtime } from "@/hooks/useMatchesRealtime";
import type { MatchEvent, MatchStatistics, MatchWithRelations } from "@/types/database";

function imageProxy(url: string | null) {
  return url ? `/api/football-logo?url=${encodeURIComponent(url)}` : null;
}

function value(v: number | null) {
  return v == null ? "—" : String(v);
}

function statLabel(key: keyof MatchStatistics) {
  const labels: Partial<Record<keyof MatchStatistics, string>> = {
    possession: "Posse de bola",
    shots_total: "Finalizações",
    shots_on_target: "No alvo",
    shots_off_target: "Fora do alvo",
    shots_blocked: "Bloqueadas",
    corners: "Escanteios",
    fouls: "Faltas",
    offsides: "Impedimentos",
    passes_total: "Passes",
    passes_accurate: "Passes certos",
    pass_accuracy: "Precisão de passe",
    goalkeeper_saves: "Defesas",
    yellow_cards: "Amarelos",
    red_cards: "Vermelhos",
    expected_goals: "xG",
  };
  return labels[key] ?? key;
}

export default function MatchDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [syncing, setSyncing] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const query = useQuery({
    queryKey: ["match-detail", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const supabase = createClient();
      const [matchResult, eventsResult, statsResult] = await Promise.all([
        supabase.from("matches").select(matchSelect).eq("id", id).single(),
        supabase.from("match_events").select("id, external_id, match_id, team_id, player_name, minute, extra_minute, event_type, detail, assist_player_name, created_at").eq("match_id", id).order("minute", { ascending: true }),
        supabase.from("match_statistics").select("id, match_id, team_id, possession, shots_total, shots_on_target, shots_off_target, shots_blocked, shots_inside_box, shots_outside_box, fouls, corners, offsides, yellow_cards, red_cards, goalkeeper_saves, passes_total, passes_accurate, pass_accuracy, expected_goals, updated_at").eq("match_id", id),
      ]);
      if (matchResult.error) throw matchResult.error;
      if (eventsResult.error) throw eventsResult.error;
      if (statsResult.error) throw statsResult.error;
      return {
        match: matchResult.data as unknown as MatchWithRelations,
        events: (eventsResult.data ?? []) as MatchEvent[],
        statistics: (statsResult.data ?? []) as MatchStatistics[],
      };
    },
    staleTime: 15_000,
    refetchInterval: (q) => {
      const m = q.state.data?.match;
      return m?.status === "IN_PLAY" || m?.status === "PAUSED" ? 15_000 : false;
    },
  });

  useMatchesRealtime();

  useEffect(() => {
    const match = query.data?.match;
    if (!match?.external_id || attempted) return;
    if (query.isFetching) return;
    if (match.status === "SCHEDULED" && query.data.events.length === 0 && query.data.statistics.length === 0) {
      setAttempted(true);
      return;
    }
    if (query.data.events.length || query.data.statistics.length) {
      setAttempted(true);
      return;
    }
    setAttempted(true);
    setSyncing(true);
    fetch(`/api/match-details?fixture=${match.external_id}`, { method: "POST" })
      .then((r) => r.json())
      .then(() => void query.refetch())
      .catch(() => undefined)
      .finally(() => setSyncing(false));
  }, [attempted, query]);

  const data = query.data;
  const match = data?.match;
  const homeStats = data?.statistics.find((s) => s.team_id === match?.home_team_id);
  const awayStats = data?.statistics.find((s) => s.team_id === match?.away_team_id);
  const rows: (keyof MatchStatistics)[] = ["possession","shots_total","shots_on_target","corners","fouls","offsides","passes_total","pass_accuracy","goalkeeper_saves","yellow_cards","red_cards","expected_goals"];

  const title = useMemo(() => {
    if (!match) return "Detalhes da partida";
    return `${match.home_team.short_name || match.home_team.name} x ${match.away_team.short_name || match.away_team.name}`;
  }, [match]);

  if (query.isLoading || !match) {
    return <main className="min-h-screen bg-[#020817] p-6 text-white"><p className="text-sm text-slate-400">Carregando partida...</p></main>;
  }

  return (
    <main className="min-h-screen bg-[#020817] pb-10 text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#020817] px-4 pb-3 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-3 pt-3">
          <button onClick={() => history.back()} className="grid size-10 place-items-center rounded-full bg-white/[0.05]"><ArrowLeft className="size-5" /></button>
          <div className="min-w-0"><p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-[#f5b91b]">{match.league.name}</p><h1 className="truncate text-sm font-black">{title}</h1></div>
        </div>
      </header>

      <section className="mx-4 mt-4 overflow-hidden rounded-[28px] border border-white/[0.09] bg-[linear-gradient(145deg,#101d34,#07101f)] p-5 shadow-[0_20px_50px_rgba(0,0,0,.35)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-white shadow-[inset_2px_2px_5px_white,inset_-4px_-5px_8px_rgba(15,23,42,.18)]"><img src={imageProxy(match.home_team.logo_url) ?? ""} className="size-14 object-contain" alt="" /></div>
            <p className="mt-2 text-xs font-black">{match.home_team.name}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black tabular-nums">{match.home_score} <span className="text-xl text-slate-600">×</span> {match.away_score}</div>
            <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${match.status === "IN_PLAY" ? "bg-red-500/10 text-red-400" : "bg-white/[0.05] text-slate-400"}`}>
              {match.status === "IN_PLAY" ? <CircleDot className="size-3 animate-pulse" /> : <Clock3 className="size-3" />}
              {match.status === "IN_PLAY" ? `${match.current_minute ?? 0}'` : match.status === "PAUSED" ? "intervalo" : match.status === "FINISHED" ? "final" : "a iniciar"}
            </div>
          </div>
          <div className="text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-white shadow-[inset_2px_2px_5px_white,inset_-4px_-5px_8px_rgba(15,23,42,.18)]"><img src={imageProxy(match.away_team.logo_url) ?? ""} className="size-14 object-contain" alt="" /></div>
            <p className="mt-2 text-xs font-black">{match.away_team.name}</p>
          </div>
        </div>
      </section>

      <section className="mx-4 mt-4">
        <div className="mb-3 flex items-center gap-2"><BarChart3 className="size-5 text-[#f5b91b]" /><h2 className="text-lg font-black">Estatísticas</h2></div>
        {homeStats || awayStats ? (
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
            <div className="grid grid-cols-[1fr_80px_1fr] border-b border-white/[0.06] px-4 py-3 text-[9px] font-black uppercase text-slate-500"><span>{match.home_team.short_name || match.home_team.name}</span><span className="text-center">ESTAT.</span><span className="text-right">{match.away_team.short_name || match.away_team.name}</span></div>
            {rows.map((key) => {
              const hv = homeStats?.[key] as number | null | undefined;
              const av = awayStats?.[key] as number | null | undefined;
              return <div key={key} className="grid grid-cols-[1fr_80px_1fr] items-center border-b border-white/[0.045] px-4 py-2.5 last:border-0"><span className="text-sm font-black">{value(hv ?? null)}{key === "possession" || key === "pass_accuracy" ? "%" : ""}</span><span className="text-center text-[9px] font-bold uppercase text-slate-600">{statLabel(key)}</span><span className="text-right text-sm font-black">{value(av ?? null)}{key === "possession" || key === "pass_accuracy" ? "%" : ""}</span></div>;
            })}
          </div>
        ) : <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-center text-xs text-slate-500">{syncing ? "Buscando estatísticas..." : "Estatísticas ainda não disponíveis para esta partida."}</div>}
      </section>

      <section className="mx-4 mt-5">
        <div className="mb-3 flex items-center gap-2"><Zap className="size-5 text-[#f5b91b]" /><h2 className="text-lg font-black">Linha do tempo</h2></div>
        <div className="space-y-2">
          {data.events.map((event) => <div key={event.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f5b91b]/10 text-[#f5b91b]">{event.event_type === "GOAL" ? <Goal className="size-4" /> : event.event_type === "RED_CARD" ? <ShieldAlert className="size-4 text-red-400" /> : <CircleDot className="size-4" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-black">{event.player_name || event.event_type}</p><p className="text-[10px] text-slate-500">{event.detail || event.event_type}{event.assist_player_name ? ` • assistência: ${event.assist_player_name}` : ""}</p></div><span className="text-xs font-black text-[#f5b91b]">{event.minute}{event.extra_minute ? `+${event.extra_minute}` : ""}'</span></div>)}
          {!data.events.length && <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-center text-xs text-slate-500">Nenhum evento registrado ainda.</div>}
        </div>
      </section>
    </main>
  );
}
