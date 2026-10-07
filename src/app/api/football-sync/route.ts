import { NextRequest } from "next/server";

const FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-football`;

export async function POST(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "date must use YYYY-MM-DD." }, { status: 400 });
  }

  try {
    const response = await fetch(`${FUNCTION_URL}?date=${date}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store"
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  } catch {
    return Response.json({ error: "Unable to sync football data." }, { status: 502 });
  }
}
