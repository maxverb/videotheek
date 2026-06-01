import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";

// Serveert een lokale afbeelding (poster/still/foto) vanaf een absoluut pad,
// zodat de browser hem kan tonen. Alleen afbeeldingstypes worden toegestaan.
const TOEGESTAAN: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
};

export async function GET(req: NextRequest) {
  const pad = req.nextUrl.searchParams.get("path");
  if (!pad) return new Response("Geen pad opgegeven", { status: 400 });

  const ext = path.extname(pad).toLowerCase();
  const mime = TOEGESTAAN[ext];
  if (!mime) return new Response("Geen ondersteund afbeeldingstype", { status: 415 });

  try {
    const stat = fs.statSync(pad);
    if (!stat.isFile()) return new Response("Geen bestand", { status: 404 });
    const data = fs.readFileSync(pad);
    return new Response(data, {
      headers: { "Content-Type": mime, "Cache-Control": "no-store" },
    });
  } catch {
    return new Response("Bestand niet gevonden", { status: 404 });
  }
}
