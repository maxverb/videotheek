"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { maakMedia, maakAfbeelding, type FormState } from "@/lib/actions";
import { MEDIA_TYPES } from "@/lib/types";
import { Veld, Tekst, Keuze, SubmitKnop, FormFout } from "@/components/fields";
import { IconPlus, IconMinus, IconSettings } from "@/components/icons";

type Niveau = "serie" | "seizoen" | "aflevering";

function Blok({ titel, children }: { titel: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="btn">
        {open ? <IconMinus /> : <IconPlus />}{titel}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function MediaForm({ niveau, niveauId }: { niveau: Niveau; niveauId: number }) {
  const [state, formAction] = useActionState(maakMedia, { ok: false } as FormState);
  const ref = useRef<HTMLFormElement>(null);
  const [probeMelding, setProbeMelding] = useState<string | null>(null);
  const [probeBezig, setProbeBezig] = useState(false);

  useEffect(() => {
    if (state.ok) {
      ref.current?.reset();
      setProbeMelding(null);
    }
  }, [state]);
  const e = state.errors ?? {};

  // Optioneel: ffprobe over het ingevulde pad draaien en velden auto-invullen.
  async function probe() {
    const form = ref.current;
    if (!form) return;
    const pad = (form.elements.namedItem("bestandspad") as HTMLInputElement)?.value;
    if (!pad) {
      setProbeMelding("Vul eerst een bestandspad in.");
      return;
    }
    setProbeBezig(true);
    setProbeMelding(null);
    try {
      const res = await fetch("/api/media/probe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pad }),
      });
      const data = await res.json();
      if (!data.ok) {
        setProbeMelding(data.fout);
        return;
      }
      const set = (naam: string, waarde: unknown) => {
        const el = form.elements.namedItem(naam) as HTMLInputElement | null;
        if (el && waarde != null) el.value = String(waarde);
      };
      set("resolutie", data.resolutie);
      set("duur_seconden", data.duur_seconden);
      set("codec", data.codec);
      set("bestandsgrootte", data.bestandsgrootte);
      setProbeMelding("Technische velden ingevuld via ffprobe.");
    } catch {
      setProbeMelding("Kon ffprobe-route niet aanroepen.");
    } finally {
      setProbeBezig(false);
    }
  }

  return (
    <Blok titel="Media koppelen">
      <form ref={ref} action={formAction} className="card space-y-3 p-4">
        <FormFout message={state.message} />
        <input type="hidden" name="niveau" value={niveau} />
        <input type="hidden" name="niveau_id" value={niveauId} />

        <div className="grid grid-cols-2 gap-3">
          <Veld label="Type" name="type" fout={e.type}>
            <Keuze id="type" name="type" defaultValue="mp4">
              {MEDIA_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Keuze>
          </Veld>
          <Veld label="Label" name="label" fout={e.label}>
            <Tekst id="label" name="label" placeholder="bv. S01E01 (upscaled)" />
          </Veld>
        </div>

        <Veld label="Bestandspad *" name="bestandspad" fout={e.bestandspad} hint="Absoluut pad op je schijf">
          <Tekst id="bestandspad" name="bestandspad" className="font-mono text-xs" />
        </Veld>

        <div className="flex items-center gap-2">
          <button type="button" onClick={probe} disabled={probeBezig} className="btn">
            <IconSettings /> {probeBezig ? "ffprobe…" : "Velden invullen via ffprobe"}
          </button>
          {probeMelding && <span className="text-xs text-amber">{probeMelding}</span>}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Veld label="Resolutie" name="resolutie" fout={e.resolutie}>
            <Tekst id="resolutie" name="resolutie" placeholder="1920x1080" />
          </Veld>
          <Veld label="Duur (sec)" name="duur_seconden" fout={e.duur_seconden}>
            <Tekst id="duur_seconden" name="duur_seconden" inputMode="numeric" />
          </Veld>
          <Veld label="Codec" name="codec" fout={e.codec}>
            <Tekst id="codec" name="codec" placeholder="h264" />
          </Veld>
          <Veld label="Grootte (bytes)" name="bestandsgrootte" fout={e.bestandsgrootte}>
            <Tekst id="bestandsgrootte" name="bestandsgrootte" inputMode="numeric" />
          </Veld>
        </div>

        <SubmitKnop label="Media koppelen" />
      </form>
    </Blok>
  );
}

export function AfbeeldingForm({ niveau, niveauId }: { niveau: Niveau; niveauId: number }) {
  const [state, formAction] = useActionState(maakAfbeelding, { ok: false } as FormState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);
  const e = state.errors ?? {};

  return (
    <Blok titel="Afbeelding toevoegen">
      <form ref={ref} action={formAction} className="card space-y-3 p-4">
        <FormFout message={state.message} />
        <input type="hidden" name="niveau" value={niveau} />
        <input type="hidden" name="niveau_id" value={niveauId} />
        <Veld label="Pad *" name="pad" fout={e.pad} hint="Absoluut pad naar een afbeelding op je schijf">
          <Tekst id="pad" name="pad" className="font-mono text-xs" />
        </Veld>
        <Veld label="Bijschrift" name="bijschrift" fout={e.bijschrift}>
          <Tekst id="bijschrift" name="bijschrift" />
        </Veld>
        <SubmitKnop label="Afbeelding toevoegen" />
      </form>
    </Blok>
  );
}
