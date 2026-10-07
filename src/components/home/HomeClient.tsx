"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bell, ChevronLeft, ChevronRight, Clock3, ListFilter, RefreshCw, Search, Sparkles, Trophy } from "lucide-react";
import type { League, MatchWithRelations } from "@/types/database";
import { getHomeDataClient } from "@/lib/supabase/client-queries";
import { useMatchesRealtime } from "@/hooks/useMatchesRealtime";
import BottomNav from "@/components/navigation/BottomNav";
import MatchCard from "@/components/shared/MatchCard";

interface Props { initialDate: string; initialMatches: MatchWithRelations[]; initialLeagues: League[]; }

function shiftDate(dateKey:string, amount:number){
  const date=new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate()+amount);
  return date.toISOString().slice(0,10);
}
function weekday(dateKey:string){return new Intl.DateTimeFormat("pt-BR",{weekday:"short"}).format(new Date(`${dateKey}T12:00:00`)).replace(".","").slice(0,3).toUpperCase();}
function month(dateKey:string){return new Intl.DateTimeFormat("pt-BR",{month:"short"}).format(new Date(`${dateKey}T12:00:00`)).replace(".","").toUpperCase();}
function isToday(dateKey:string){return dateKey===new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo"}).format(new Date());}

export default function HomeClient({initialDate,initialMatches,initialLeagues}:Props){
  const [selectedDate,setSelectedDate]=useState(initialDate);
  const [leagueId,setLeagueId]=useState("all");
  const query=useQuery({
    queryKey:["home-data",selectedDate],
    queryFn:()=>getHomeDataClient(selectedDate),
    initialData:selectedDate===initialDate?{matches:initialMatches,leagues:initialLeagues}:undefined,
    placeholderData:previous=>previous,
    refetchInterval:60_000,
    refetchOnReconnect:true
  });
  useMatchesRealtime();

  const matches=query.data?.matches??[];
  const leagues=query.data?.leagues??[];
  const filtered=useMemo(()=>leagueId==="all"?matches:matches.filter(m=>m.league_id===leagueId),[matches,leagueId]);
  const live=filtered.filter(m=>m.status==="IN_PLAY"||m.status==="PAUSED");
  const upcoming=filtered.filter(m=>m.status==="SCHEDULED").slice(0,8);
  const liveCount=matches.filter(m=>m.status==="IN_PLAY").length;
  const days=[-2,-1,0,1,2].map(n=>shiftDate(selectedDate,n));

  return <div className="min-h-screen bg-[#020817] pb-24 text-white">
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#020817]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2"><div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#f5b91b] to-[#ff7a00] text-[#06101d] shadow-[0_8px_25px_rgba(245,185,27,.2)]">⚽</div><div><h1 className="text-[21px] font-black tracking-tight">Nosso<span className="text-[#f5b91b]">FUT</span></h1><p className="text-[8px] font-bold uppercase tracking-[0.25em] text-slate-500">futebol em tempo real</p></div></Link>
        <div className="flex items-center gap-1"><button onClick={()=>void query.refetch()} disabled={query.isFetching} aria-label="Atualizar" className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-400"><RefreshCw className={`size-4 ${query.isFetching?"animate-spin":""}`}/></button><Link href="/buscar" aria-label="Pesquisar" className="grid size-10 place-items-center rounded-full text-slate-300"><Search className="size-5"/></Link><Link href="/mais#notificacoes" aria-label="Notificações" className="relative grid size-10 place-items-center rounded-full text-slate-300"><Bell className="size-5"/><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-[#020817]"/></Link></div>
      </div>
    </header>

    <main className="mx-auto max-w-xl">
      <section className="px-4 pt-4"><div className="relative overflow-hidden rounded-[28px] border border-[#f5b91b]/50 bg-[radial-gradient(circle_at_75%_15%,rgba(245,185,27,.18),transparent_32%),linear-gradient(135deg,#07152a,#030812_72%)] p-5 shadow-[0_18px_50px_rgba(0,0,0,.3)]"><div className="absolute -right-14 -top-14 size-40 rounded-full border border-[#f5b91b]/20"/><div className="relative"><div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-400 ring-1 ring-red-500/20"><span className="size-2 animate-pulse rounded-full bg-red-500"/>ao vivo agora</div><div className="mt-4 flex items-end justify-between"><div><div className="text-5xl font-black leading-none">{liveCount}</div><div className="mt-1 text-sm font-black uppercase">partidas</div><div className="mt-1 text-xs font-bold uppercase tracking-widest text-[#f5b91b]">em tempo real</div></div><div className="hidden text-right sm:block"><Sparkles className="ml-auto size-7 text-[#f5b91b]"/><p className="mt-2 max-w-[150px] text-xs font-semibold leading-5 text-slate-400">Placares e minutos atualizados automaticamente.</p></div></div><Link href="/ao-vivo" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5b91b] px-4 py-2.5 text-xs font-black uppercase text-[#06101d]">acompanhar ao vivo<ArrowRight className="size-4"/></Link></div></div></section>

      <section className="px-4 pt-4"><div className="flex items-center justify-between"><button onClick={()=>setSelectedDate(shiftDate(selectedDate,-1))} aria-label="Dia anterior" className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-400"><ChevronLeft className="size-4"/></button><div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{isToday(selectedDate)?"Hoje":"Jogos"}</p><p className="mt-0.5 text-sm font-black capitalize">{new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"long"}).format(new Date(`${selectedDate}T12:00:00`))}</p></div><button onClick={()=>setSelectedDate(shiftDate(selectedDate,1))} aria-label="Próximo dia" className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-400"><ChevronRight className="size-4"/></button></div><div className="mt-3 grid grid-cols-5 gap-2">{days.map(day=><button key={day} onClick={()=>setSelectedDate(day)} className={[`rounded-2xl border px-2 py-2.5 text-center`,day===selectedDate?"border-[#f5b91b] bg-[#f5b91b] text-[#07111f]":"border-white/[0.07] bg-white/[0.035] text-slate-400"].join(" ")}><span className="block text-[9px] font-black">{weekday(day)}</span><span className="mt-0.5 block text-lg font-black">{day.slice(-2)}</span><span className="block text-[8px] font-bold opacity-70">{month(day)}</span></button>)}</div></section>

      <section className="mt-4 px-4"><div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><button onClick={()=>setLeagueId("all")} className={["flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-black uppercase",leagueId==="all"?"border-[#f5b91b] bg-[#f5b91b] text-[#06101d]":"border-white/[0.08] bg-white/[0.035] text-slate-300"].join(" ")}><Trophy className="size-4"/>todos</button>{leagues.slice(0,20).map(l=><button key={l.id} onClick={()=>setLeagueId(l.id)} className={["flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-black uppercase",leagueId===l.id?"border-[#f5b91b] bg-[#f5b91b] text-[#06101d]":"border-white/[0.08] bg-white/[0.035] text-slate-300"].join(" ")}>{l.logo_url?<img src={l.logo_url} alt="" className="size-4 object-contain"/>:<ListFilter className="size-4"/>}{l.name}</button>)}</div></section>

      <section className="mt-7 px-4"><div className="mb-3 flex items-end justify-between"><div><div className="flex items-center gap-2"><span className="size-2 animate-pulse rounded-full bg-red-500"/><h2 className="text-xl font-black">Ao vivo</h2></div><p className="mt-0.5 text-xs text-slate-500">O jogo acontecendo agora</p></div><Link href="/ao-vivo" className="text-[11px] font-black uppercase text-[#f5b91b]">ver todos →</Link></div>{live.length?<div className="space-y-3">{live.slice(0,4).map(m=><MatchCard key={m.id} match={m}/>)}</div>:<div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.025] px-5 py-9 text-center"><Clock3 className="mx-auto size-8 text-slate-600"/><p className="mt-3 text-sm font-bold text-slate-400">Nenhuma partida ao vivo agora.</p></div>}</section>

      <section className="mt-8 px-4"><div className="mb-3 flex items-end justify-between"><div><div className="flex items-center gap-2"><Clock3 className="size-5 text-[#f5b91b]"/><h2 className="text-xl font-black">Próximos jogos</h2></div><p className="mt-0.5 text-xs text-slate-500">Fique de olho no que vem aí</p></div><Link href="/jogos" className="text-[11px] font-black uppercase text-[#f5b91b]">calendário →</Link></div><div className="space-y-3">{upcoming.map(m=><MatchCard key={m.id} match={m}/>)}</div>{!upcoming.length&&<div className="rounded-[22px] border border-white/[0.07] bg-white/[0.025] px-5 py-8 text-center text-sm text-slate-500">Nenhum jogo programado para este dia.</div>}</section>
    </main>
    <BottomNav active="home"/>
    {query.isFetching?<div className="pointer-events-none fixed right-3 top-[76px] z-50 rounded-full bg-[#f5b91b] px-3 py-1 text-[9px] font-black uppercase text-[#06101d]">atualizando…</div>:null}
  </div>;
}
