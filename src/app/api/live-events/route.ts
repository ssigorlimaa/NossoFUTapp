import { NextRequest, NextResponse } from "next/server";

const FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-live-events`;

export async function POST(request: NextRequest) {
  const fixtures = request.nextUrl.searchParams.get("fixtures") ?? "";
  const ids = [...new Set(fixtures.split(",").map((value) => value.trim()).filter((value) => /^\d+$/.test(value)))].slice(0, 20);

  if (!ids.length) {
    return NextResponse.json({ error: "fixtures inválido." }, { status: 400 });
  }

  try {
    const response = await fetch(`${FUNCTION_URL}?fixtures=${ids.join(",")}`, {
      method: "GET",
      cache: "no-store",
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível sincronizar os eventos ao vivo." },
      { status: 502 }
    );
  }
}
