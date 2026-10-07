"use client";

import { useQuery } from "@tanstack/react-query";
import { Radio, RefreshCw } from "lucide-react";
import { getHomeDataClient } from "@/lib/supabase/client-queries";
import { useMatchesRealtime } from "@/hooks/useMatchesRealtime";
import MatchCard from "@/components/shared/MatchCard";
import AppHeader from "@/components/shared/AppHeader";
import BottomNav from "@/components/navigation/BottomNav";
import { saoPauloDateKey } from "@/lib/date";
import { featuredMatches } from "@/lib/featured-leagues";

export default function LivePage() {
  const date = saoPauloDateKey();

  const query = useQuery({
    queryKey: ["live-page", date],
    queryFn: () => getHomeDataClient(date),
    staleTime: 10_000,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
  });

  useMatchesRealtime();

  const matches = featuredMatches(query.data?.matches ?? []).filter(
    (m) => m.status === "IN_PLAY" || m.status === "PAUSED"
  );

  return (
    <div className="min-h-screen bg-[#020817] pb-24 text-white">
      <AppHeader
        onRefresh={() => void query.refetch()}
        refreshing={query.isFetching}
      />

      <main className="mx-auto max-w-xl px-4 py-4">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-2.5 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,.9)]" />
              <h1 className="text-2xl font-black tracking-tight">Ao vivo</h1>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Placar e minuto atualizados em tempo real.
            </p>
          </div>
          <div className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-red-300">
            {matches.length} {matches.length === 1 ? "jogo" : "jogos"}
          </div>
        </div>

        {matches.length ? (
          <div className="space-y-3">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] px-5 py-12 text-center">
            <Radio className="mx-auto size-9 text-slate-600" />
            <p className="mt-3 font-bold text-slate-400">
              Nenhuma partida ao vivo agora.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              A tela verifica novas partidas a cada 15 segundos.
            </p>
          </div>
        )}
      </main>

      <BottomNav active="live" />
    </div>
  );
}
