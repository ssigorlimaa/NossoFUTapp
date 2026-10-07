"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useMatchesRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("nossofut-matches-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["home-data"]
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "match_events" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["home-data"]
          });
        }
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
