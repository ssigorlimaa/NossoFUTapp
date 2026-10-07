"use client";

import Link from "next/link";
import { ChevronRight, Heart, Info, Bell, Settings2, Trophy } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import AppHeader from "@/components/shared/AppHeader";

const items=[{href:"#notificacoes",label:"Notificações",icon:Bell,desc:"Configurações e alertas"},{href:"#favoritos",label:"Favoritos",icon:Heart,desc:"Partidas que você marcou"},{href:"#campeonatos",label:"Principais campeonatos",icon:Trophy,desc:"Brasil e os grandes torneios do mundo"},{href:"#sobre",label:"Sobre o NossoFUT",icon:Info,desc:"Aplicativo de futebol em tempo real"},{href:"#configuracoes",label:"Configurações",icon:Settings2,desc:"Preferências do aplicativo"}];

export default function MorePage(){return <div className="min-h-screen bg-[#020817] pb-24 text-white"><AppHeader/><main className="mx-auto max-w-xl px-4 py-5">
<h1 className="text-2xl font-black">Mais</h1><p className="mt-1 text-sm text-slate-500">Acesso rápido às funções do NossoFUT.</p>
<div className="mt-6 space-y-2">{items.map(({href,label,icon:Icon,desc})=><Link key={href} href={href} className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"><span className="grid size-10 place-items-center rounded-xl bg-[#f5b91b]/10 text-[#f5b91b]"><Icon className="size-5"/></span><span className="min-w-0 flex-1"><strong className="block text-sm font-black">{label}</strong><small className="text-xs text-slate-500">{desc}</small></span><ChevronRight className="size-5 text-slate-600"/></Link>)}</div>
<div id="notificacoes" className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0b1426] p-4"><h2 className="font-black">Notificações</h2><p className="mt-1 text-xs leading-5 text-slate-500">A base visual está pronta. Alertas por partida serão conectados na próxima etapa.</p></div>
<div id="favoritos" className="mt-3 rounded-2xl border border-white/[0.07] bg-[#0b1426] p-4"><h2 className="font-black">Favoritos</h2><p className="mt-1 text-xs leading-5 text-slate-500">Toque na estrela de qualquer partida para salvar localmente neste aparelho.</p></div>
<div id="campeonatos" className="mt-3 rounded-2xl border border-white/[0.07] bg-[#0b1426] p-4"><h2 className="font-black">Principais campeonatos</h2><p className="mt-2 text-xs leading-5 text-slate-500">O NossoFUT prioriza os principais campeonatos do Brasil e os grandes torneios nacionais e internacionais. Competições menores ficam fora dos filtros principais.</p></div>
<div id="sobre" className="mt-3 rounded-2xl border border-white/[0.07] bg-[#0b1426] p-4"><h2 className="font-black">NossoFUT</h2><p className="mt-1 text-xs leading-5 text-slate-500">Placares, calendário e futebol em tempo real.</p></div>
</main><BottomNav active="more"/></div>}
