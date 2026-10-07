"use client";

import Link from "next/link";
import { CalendarDays, Ellipsis, Home, Newspaper, Radio } from "lucide-react";

type Active = "home" | "live" | "games" | "news" | "more";

const items = [
  { label: "Início", href: "/", icon: Home, key: "home" as const },
  { label: "Ao vivo", href: "/ao-vivo", icon: Radio, key: "live" as const },
  { label: "Jogos", href: "/jogos", icon: CalendarDays, key: "games" as const },
  { label: "Notícias", href: "/noticias", icon: Newspaper, key: "news" as const },
  { label: "Mais", href: "/mais", icon: Ellipsis, key: "more" as const }
];

export default function BottomNav({ active }: { active: Active }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-[#020817]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-xl items-center justify-around px-2">
        {items.map(({ label, href, icon: Icon, key }) => {
          const selected = key === active;
          return (
            <Link
              key={key}
              href={href}
              className={["flex min-w-[58px] flex-col items-center gap-1 rounded-2xl px-3 py-2", selected ? "text-[#f5b91b]" : "text-slate-500"].join(" ")}
            >
              <Icon className="size-5" strokeWidth={selected ? 2.7 : 2} />
              <span className="text-[9px] font-black uppercase tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
