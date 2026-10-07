"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHomeDataClient } from "@/lib/supabase/client-queries";
import { saoPauloDateKey } from "@/lib/date";
import MatchCard from "@/components/shared/MatchCard";
import AppHeader from "@/components/shared/AppHeader";
import BottomNav from "@/components/navigation/BottomNav";

export default function SearchPage(){
  const [term,setTerm]=useState("");
  const query=useQuery({queryKey:["search-page"],queryFn:()=>getHomeDataClient(saoPauloDateKey())});
  const results=useMemo(()=>{const q=term.trim().toLowerCase(); if(!q)return []; return featuredMatches(query.data?.matches??[]).filter(m=>[m.home_team.name,m.away_team.name,m.league.name].some(v=>v.toLowerCase().includes(q))).slice(0,30)},[term,query.data]);
  return <div className="min-h-screen bg-[#020817] pb-24 text-white"><AppHeader/><main className="mx-auto max-w-xl px-4 py-5">
    <h1 className="text-2xl font-black">Pesquisar</h1><p className="mt-1 text-sm text-slate-500">Encontre times, campeonatos e partidas de hoje.</p>
    <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4"><Search className="size-5 text-slate-500"/><input autoFocus value={term} onChange={e=>setTerm(e.target.value)} placeholder="Ex.: São Paulo, Champions..." className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"/>{term&&<button onClick={()=>setTerm("")}><X className="size-4 text-slate-500"/></button>}</div>
    <div className="mt-5 space-y-3">{results.map(m=><MatchCard key={m.id} match={m}/>)}{term&&!results.length&&<div className="py-12 text-center text-sm text-slate-500">Nenhuma partida encontrada.</div>}{!term&&<div className="py-12 text-center text-sm text-slate-600">Digite para pesquisar.</div>}</div>
  </main><BottomNav active="more"/></div>;
}
