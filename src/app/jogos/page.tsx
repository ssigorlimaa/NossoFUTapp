"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { getHomeDataClient } from "@/lib/supabase/client-queries";
import MatchCard from "@/components/shared/MatchCard";
import AppHeader from "@/components/shared/AppHeader";
import BottomNav from "@/components/navigation/BottomNav";
import { saoPauloDateKey } from "@/lib/date";

function shift(dateKey:string, amount:number){ const d=new Date(`${dateKey}T12:00:00`); d.setDate(d.getDate()+amount); return d.toISOString().slice(0,10); }
function label(dateKey:string){ return new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"2-digit",month:"long"}).format(new Date(`${dateKey}T12:00:00`)); }

export default function GamesPage(){
  const [date,setDate]=useState(saoPauloDateKey());
  const query=useQuery({queryKey:["games-page",date],queryFn:()=>getHomeDataClient(date),refetchInterval:60_000});
  const matches=featuredMatches(query.data?.matches??[]);
  return <div className="min-h-screen bg-[#020817] pb-24 text-white"><AppHeader onRefresh={()=>void query.refetch()} refreshing={query.isFetching}/><main className="mx-auto max-w-xl px-4 py-5">
    <div className="mb-4 flex items-center gap-2"><CalendarDays className="size-6 text-[#f5b91b]"/><div><h1 className="text-2xl font-black">Jogos</h1><p className="text-xs text-slate-500">Calendário completo por dia</p></div></div>
    <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] p-2"><button onClick={()=>setDate(shift(date,-1))} className="grid size-10 place-items-center rounded-xl bg-white/[0.04] text-slate-300"><ChevronLeft className="size-5"/></button><div className="text-center"><p className="text-[10px] font-black uppercase tracking-widest text-[#f5b91b]">data selecionada</p><p className="mt-1 text-sm font-bold capitalize">{label(date)}</p></div><button onClick={()=>setDate(shift(date,1))} className="grid size-10 place-items-center rounded-xl bg-white/[0.04] text-slate-300"><ChevronRight className="size-5"/></button></div>
    <div className="space-y-3">{matches.map(m=><MatchCard key={m.id} match={m}/>)}{!matches.length&&<div className="py-12 text-center text-sm text-slate-500">Nenhum jogo encontrado para este dia.</div>}</div>
  </main><BottomNav active="games"/></div>;
}
