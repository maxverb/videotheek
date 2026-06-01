import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";

// Streamt een lokaal mp4-bestand met ondersteuning voor HTTP range-requests,
// zodat een <video>-element ín de app kan spoelen/afspelen.
const MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
};

export async function GET(req: NextRequest) {
  const pad = req.nextUrl.searchParams.get("path");
  if (!pad) return new Response("Geen pad opgegeven", { status: 400 });

  let stat: fs.Stats;
  try {
    stat = fs.statSync(pad);
    if (!stat.isFile()) return new Response("Geen bestand", { status: 404 });
  } catch {
    return new Response("Bestand niet gevonden", { status: 404 });
  }

  const mime = MIME[path.extname(pad).toLowerCase()] ?? "application/octet-stream";
  const grootte = stat.size;
  const range = req.headers.get("range");

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m && m[1] ? parseInt(m[1], 10) : 0;
    const end = m && m[2] ? parseInt(m[2], 10) : grootte - 1;
    if (start >= grootte || end >= grootte) {
      return new Response("Range niet toegestaan", {
        status: 416,
        headers: { "Content-Range": `bytes */${grootte}` },
      });
    }
    const stream = fs.createReadStream(pad, { start, end });
    return new Response(stream as unknown as ReadableStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${grootte}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(end - start + 1),
        "Content-Type": mime,
      },
    });
  }

  const stream = fs.createReadStream(pad);
  return new Response(stream as unknown as ReadableStream, {
    status: 200,
    headers: {
      "Content-Length": String(grootte),
      "Accept-Ranges": "bytes",
      "Content-Type": mime,
    },
  });
}
