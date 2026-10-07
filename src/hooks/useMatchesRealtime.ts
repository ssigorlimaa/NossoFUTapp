"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useMatchesRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const invalidateMatches = () => {
      void queryClient.invalidateQueries({ queryKey: ["home-data"] });
      void queryClient.invalidateQueries({ queryKey: ["live-data"] });
      void queryClient.invalidateQueries({ queryKey: ["games-page"] });
    };

    const channel = supabase
      .channel("nossofut-matches-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        invalidateMatches
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "match_events" },
        invalidateMatches
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Supabase Realtime: erro no canal de partidas.");
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
