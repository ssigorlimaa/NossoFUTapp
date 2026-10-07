import { NextRequest, NextResponse } from "next/server";

const FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-match-details`;

export async function POST(request: NextRequest) {
  const fixture = request.nextUrl.searchParams.get("fixture");

  if (!fixture || !/^\d+$/.test(fixture)) {
    return NextResponse.json({ error: "fixture inválido." }, { status: 400 });
  }

  try {
    const response = await fetch(`${FUNCTION_URL}?fixture=${fixture}`, {
      method: "GET",
      cache: "no-store",
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível sincronizar os detalhes da partida." },
      { status: 502 }
    );
  }
}
