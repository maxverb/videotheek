import { NextRequest, NextResponse } from "next/server";
import { execFile } from "node:child_process";
import fs from "node:fs";

// Draait (indien aanwezig) ffprobe over een mediabestand en geeft resolutie,
// duur en codec terug. Faalt netjes als ffprobe niet geïnstalleerd is.
export async function POST(req: NextRequest) {
  let pad: string | undefined;
  try {
    ({ pad } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, fout: "Ongeldige aanvraag" }, { status: 400 });
  }
  if (!pad || !fs.existsSync(pad)) {
    return NextResponse.json({ ok: false, fout: "Bestand niet gevonden" }, { status: 404 });
  }

  const args = [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,codec_name:format=duration,size",
    "-of", "json",
    pad,
  ];

  return await new Promise<NextResponse>((resolve) => {
    execFile("ffprobe", args, (err, stdout) => {
      if (err) {
        // ENOENT = ffprobe staat niet in PATH
        const ontbreekt = (err as NodeJS.ErrnoException).code === "ENOENT";
        resolve(
          NextResponse.json(
            {
              ok: false,
              fout: ontbreekt
                ? "ffprobe is niet gevonden op dit systeem. Installeer FFmpeg om deze functie te gebruiken."
                : `ffprobe-fout: ${err.message}`,
            },
            { status: ontbreekt ? 501 : 500 }
          )
        );
        return;
      }
      try {
        const data = JSON.parse(stdout);
        const stream = data.streams?.[0] ?? {};
        const format = data.format ?? {};
        const resolutie = stream.width && stream.height ? `${stream.width}x${stream.height}` : null;
        const duur_seconden = format.duration ? Math.round(parseFloat(format.duration)) : null;
        const codec = stream.codec_name ?? null;
        const bestandsgrootte = format.size ? parseInt(format.size, 10) : null;
        resolve(NextResponse.json({ ok: true, resolutie, duur_seconden, codec, bestandsgrootte }));
      } catch {
        resolve(NextResponse.json({ ok: false, fout: "Kon ffprobe-uitvoer niet lezen" }, { status: 500 }));
      }
    });
  });
}
