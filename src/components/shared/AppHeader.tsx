import Link from "next/link";
import { Bell, RefreshCw, Search } from "lucide-react";

export default function AppHeader({ onRefresh, refreshing = false }: { onRefresh?: () => void; refreshing?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#020817]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#f5b91b] to-[#ff7a00] text-[#06101d] shadow-[0_8px_25px_rgba(245,185,27,.2)]">
            <span className="text-xl">⚽</span>
          </div>
          <div>
            <div className="text-[21px] font-black tracking-tight">Nosso<span className="text-[#f5b91b]">FUT</span></div>
            <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-slate-500">futebol em tempo real</p>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          {onRefresh ? (
            <button onClick={onRefresh} disabled={refreshing} aria-label="Atualizar" className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-400">
              <RefreshCw className={["size-4", refreshing ? "animate-spin" : ""].join(" ")} />
            </button>
          ) : null}
          <Link href="/buscar" aria-label="Pesquisar" className="grid size-10 place-items-center rounded-full text-slate-300"><Search className="size-5" /></Link>
          <Link href="/mais#notificacoes" aria-label="Notificações" className="relative grid size-10 place-items-center rounded-full text-slate-300">
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-[#020817]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
