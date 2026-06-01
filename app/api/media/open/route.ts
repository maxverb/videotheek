import { NextRequest, NextResponse } from "next/server";
import { execFile } from "node:child_process";
import fs from "node:fs";

// Opent een lokaal bestand in de standaardspeler van het besturingssysteem.
// Een browser mag zelf geen willekeurige lokale bestanden openen; daarom deze
// lokale API-route die via het OS de juiste applicatie start.
//
//   Windows : start "" "<pad>"   (via cmd /c)
//   macOS   : open "<pad>"
//   Linux   : xdg-open "<pad>"   (handig voor ontwikkelen/testen)
export async function POST(req: NextRequest) {
  let pad: string | undefined;
  try {
    ({ pad } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, fout: "Ongeldige aanvraag" }, { status: 400 });
  }
  if (!pad || typeof pad !== "string") {
    return NextResponse.json({ ok: false, fout: "Geen pad opgegeven" }, { status: 400 });
  }

  // Padscheidingstekens normaliseren komt het OS zelf wel aan; we checken alleen
  // of het bestand bestaat zodat we een nette foutmelding kunnen geven.
  if (!fs.existsSync(pad)) {
    return NextResponse.json(
      { ok: false, fout: `Bestand niet gevonden: ${pad}` },
      { status: 404 }
    );
  }

  const platform = process.platform;
  return await new Promise<NextResponse>((resolve) => {
    const klaar = (err: Error | null) =>
      resolve(
        err
          ? NextResponse.json({ ok: false, fout: err.message }, { status: 500 })
          : NextResponse.json({ ok: true })
      );

    if (platform === "win32") {
      // 'start' is een ingebouwd cmd-commando; eerste "" is de venstertitel.
      execFile("cmd", ["/c", "start", "", pad], klaar);
    } else if (platform === "darwin") {
      execFile("open", [pad], klaar);
    } else {
      // Linux en overige: xdg-open
      execFile("xdg-open", [pad], klaar);
    }
  });
}
