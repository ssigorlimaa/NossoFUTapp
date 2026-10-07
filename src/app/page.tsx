import HomeClient from "@/components/home/HomeClient";
import { getHomeData } from "@/lib/supabase/server-queries";

export const revalidate = 30;

function serverDateKey() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export default async function HomePage() {
  const initialDate = serverDateKey();
  const { matches, leagues } = await getHomeData(initialDate);

  return (
    <HomeClient
      initialDate={initialDate}
      initialMatches={matches}
      initialLeagues={leagues}
    />
  );
}
