"use client";

import { useQuery } from "@tanstack/react-query";
import { Radio } from "lucide-react";
import { getHomeDataClient } from "@/lib/supabase/client-queries";
import { useMatchesRealtime } from "@/hooks/useMatchesRealtime";
import MatchCard from "@/components/shared/MatchCard";
import AppHeader from "@/components/shared/AppHeader";
import BottomNav from "@/components/navigation/BottomNav";
import { saoPauloDateKey } from "@/lib/date";

export default function LivePage() {
  const date = saoPauloDateKey();
  const query = useQuery({ queryKey: ["live-page", date], queryFn: () => getHomeDataClient(date), refetchInterval: 60_000 });
  useMatchesRealtime();
  const matches = featuredMatches(query.data?.matches ?? []).filter((m) => m.status === "IN_PLAY" || m.status === "PAUSED");
  return <div className="min-h-screen bg-[#020817] pb-24 text-white"><AppHeader onRefresh={() => void query.refetch()} refreshing={query.isFetching} /><main className="mx-auto max-w-xl px-4 py-5">
    <div className="mb-5"><div className="flex items-center gap-2"><Radio className="size-6 text-red-500"/><h1 className="text-2xl font-black">Ao vivo</h1></div><p className="mt-1 text-sm text-slate-500">Partidas acontecendo agora, com placar e minuto.</p></div>
    {matches.length ? <div className="space-y-3">{matches.map((m)=><MatchCard key={m.id} match={m}/>)}</div> : <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.025] px-5 py-12 text-center"><Radio className="mx-auto size-9 text-slate-600"/><p className="mt-3 font-bold text-slate-400">Nenhuma partida ao vivo agora.</p><p className="mt-1 text-xs text-slate-600">A tela será atualizada automaticamente.</p></div>}
  </main><BottomNav active="live"/></div>;
}
