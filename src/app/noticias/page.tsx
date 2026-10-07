import { Newspaper } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import AppHeader from "@/components/shared/AppHeader";
import { createClient } from "@/lib/supabase/server";

export default async function NewsPage(){
  const supabase=await createClient();
  const {data}=await supabase.from("news").select("id,title,summary,image_url,source_url,published_at,created_at").order("published_at",{ascending:false}).order("created_at",{ascending:false}).limit(30);
  return <div className="min-h-screen bg-[#020817] pb-24 text-white"><AppHeader/><main className="mx-auto max-w-xl px-4 py-5">
    <div className="mb-5 flex items-center gap-2"><Newspaper className="size-6 text-[#f5b91b]"/><div><h1 className="text-2xl font-black">Notícias</h1><p className="text-xs text-slate-500">Informação do mundo do futebol.</p></div></div>
    {data?.length ? <div className="space-y-3">{data.map(n=><article key={n.id} className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#0b1426]">{n.image_url?<img src={n.image_url} alt="" className="h-44 w-full object-cover"/>:null}<div className="p-4"><h2 className="font-black">{n.title}</h2>{n.summary?<p className="mt-2 text-sm leading-6 text-slate-400">{n.summary}</p>:null}{n.source_url?<a href={n.source_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-black uppercase text-[#f5b91b]">ler notícia →</a>:null}</div></article>)}</div>:
    <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.025] px-5 py-12 text-center"><Newspaper className="mx-auto size-9 text-slate-600"/><p className="mt-3 font-bold text-slate-400">As notícias estão sendo preparadas.</p><p className="mt-1 text-xs text-slate-600">A estrutura já está pronta para receber o conteúdo.</p></div>}
  </main><BottomNav active="news"/></div>;
}
