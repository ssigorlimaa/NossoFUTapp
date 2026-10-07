import { NextRequest, NextResponse } from "next/server";

const FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-match-players`;

export async function POST(request: NextRequest) {
  const fixture = request.nextUrl.searchParams.get("fixture");
  if (!fixture || !/^\d+$/.test(fixture)) {
    return NextResponse.json({ error: "fixture inválido." }, { status: 400 });
  }
  try {
    const response = await fetch(`${FUNCTION_URL}?fixture=${fixture}`, { cache: "no-store" });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ error: "Falha ao sincronizar jogadores." }, { status: 502 });
  }
}
