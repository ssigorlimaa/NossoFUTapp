"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

export default function AppStartup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = "nossofut:startup-seen";
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error Safari iOS standalone flag
      window.navigator.standalone === true;

    if (sessionStorage.getItem(key) === "1") return;

    setVisible(true);
    sessionStorage.setItem(key, "1");

    const timer = window.setTimeout(() => setVisible(false), standalone ? 900 : 1200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-[#020817] px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(245,185,27,.16),transparent_30%),radial-gradient(circle_at_50%_75%,rgba(15,43,78,.42),transparent_48%)]" />
      <div className="relative flex flex-col items-center">
        <div className="relative grid size-24 place-items-center rounded-[30px] border border-white/20 bg-[linear-gradient(145deg,#172b49,#07111f)] shadow-[0_24px_70px_rgba(0,0,0,.55),inset_1px_1px_0_rgba(255,255,255,.12)]">
          <div className="absolute inset-2 rounded-[23px] border border-[#f5b91b]/20" />
          <Trophy className="size-11 text-[#f5b91b] drop-shadow-[0_5px_14px_rgba(245,185,27,.35)]" strokeWidth={1.8} />
        </div>
        <h1 className="mt-6 text-[28px] font-black tracking-[-0.04em] text-white">
          Nosso<span className="text-[#f5b91b]">FUT</span>
        </h1>
        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
          futebol em tempo real
        </p>
        <div className="mt-8 h-1 w-16 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-[startup-progress_1.1s_ease-in-out_infinite] rounded-full bg-[#f5b91b]" />
        </div>
      </div>
    </div>
  );
}
