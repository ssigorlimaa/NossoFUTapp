import { NextRequest } from "next/server";

const ALLOWED_HOSTS = new Set([
  "media.api-sports.io",
  "r2.thesportsdb.com"
]);

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");

  if (!raw) {
    return new Response("Missing url", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    return new Response("Image host not allowed", { status: 403 });
  }

  try {
    const response = await fetch(target, {
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg,*/*",
        "User-Agent": "Mozilla/5.0 NossoFUTapp/1.0"
      },
      next: { revalidate: 86400 }
    });

    if (!response.ok) {
      return new Response("Upstream image unavailable", { status: 502 });
    }

    const contentType = response.headers.get("content-type") ?? "image/png";
    const body = await response.arrayBuffer();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400"
      }
    });
  } catch {
    return new Response("Unable to load image", { status: 502 });
  }
}
