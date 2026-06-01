"use client";

import { useState } from "react";
import type { MediaAsset } from "@/lib/types";
import { bestandsgrootte as fmtGrootte, duurSec } from "@/lib/format";

const TYPE_LABEL: Record<string, string> = {
  iso: "ISO",
  mp4: "MP4",
  upscale: "Upscale",
  snippet: "Snippet",
  extra: "Extra",
};

const AFSPEELBAAR = new Set(["mp4", "upscale", "snippet"]);

export function MediaLijst({ media }: { media: MediaAsset[] }) {
  if (media.length === 0) {
    return <p className="text-sm text-muted">Geen gekoppelde media.</p>;
  }
  return (
    <ul className="space-y-3">
      {media.map((m) => (
        <MediaRij key={m.id} m={m} />
      ))}
    </ul>
  );
}

function MediaRij({ m }: { m: MediaAsset }) {
  const [melding, setMelding] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);
  const [speelAf, setSpeelAf] = useState(false);

  async function openInSpeler() {
    setBezig(true);
    setMelding(null);
    try {
      const res = await fetch("/api/media/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pad: m.bestandspad }),
      });
      const data = await res.json();
      setMelding(data.ok ? "Geopend in standaardspeler." : `Fout: ${data.fout}`);
    } catch {
      setMelding("Kon de speler niet aanroepen.");
    } finally {
      setBezig(false);
    }
  }

  async function kopieerPad() {
    try {
      await navigator.clipboard.writeText(m.bestandspad);
      setMelding("Pad gekopieerd naar klembord.");
    } catch {
      setMelding("Kopiëren niet gelukt (klembord geblokkeerd).");
    }
  }

  const details = [
    m.resolutie,
    duurSec(m.duur_seconden) || null,
    m.codec,
    fmtGrootte(m.bestandsgrootte) || null,
  ].filter(Boolean);

  return (
    <li className="card p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="chip border-amber/40 text-amber">{TYPE_LABEL[m.type] ?? m.type}</span>
            <span className="font-medium text-cream">{m.label || "(zonder label)"}</span>
          </div>
          <p className="mt-1 break-all font-mono text-xs text-muted">{m.bestandspad}</p>
          {details.length > 0 && (
            <p className="mt-1 text-xs text-muted/80">{details.join(" · ")}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openInSpeler} disabled={bezig} className="btn">
            ▶ Open in speler
          </button>
          <button onClick={kopieerPad} className="btn">⧉ Kopieer pad</button>
          {AFSPEELBAAR.has(m.type) && (
            <button onClick={() => setSpeelAf((v) => !v)} className="btn">
              {speelAf ? "Verberg" : "🎞 In app"}
            </button>
          )}
        </div>
      </div>

      {melding && <p className="mt-2 text-xs text-amber">{melding}</p>}

      {speelAf && AFSPEELBAAR.has(m.type) && (
        <video
          controls
          className="mt-3 w-full rounded-lg border border-edge"
          src={`/api/media/stream?path=${encodeURIComponent(m.bestandspad)}`}
        />
      )}
    </li>
  );
}
