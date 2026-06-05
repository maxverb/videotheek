"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { maakCast, maakCrew, type FormState } from "@/lib/actions";
import type { Persoon } from "@/lib/types";
import { CAST_TIERS, CAST_TIER_LABEL, CREW_ROLLEN } from "@/lib/types";
import { Veld, Tekst, Keuze, SubmitKnop, FormFout } from "@/components/fields";
import { IconPlus, IconMinus } from "@/components/icons";
import { PersoonKiezer } from "./PersoonKiezer";

type Niveau = "serie" | "seizoen" | "aflevering";

// Inklapbaar blok zodat de detailpagina rustig blijft.
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

export function CastForm({ personen, niveau, niveauId }: { personen: Persoon[]; niveau: Niveau; niveauId: number }) {
  const [state, formAction] = useActionState(maakCast, { ok: false } as FormState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);
  const e = state.errors ?? {};

  return (
    <Blok titel="Cast toevoegen">
      <form ref={ref} action={formAction} className="card space-y-3 p-4">
        <FormFout message={state.message} />
        <input type="hidden" name="niveau" value={niveau} />
        <input type="hidden" name="niveau_id" value={niveauId} />
        <PersoonKiezer personen={personen} fout={e.persoon_naam || e.persoon_id} />
        <div className="grid grid-cols-2 gap-3">
          <Veld label="Personage" name="personage_naam" fout={e.personage_naam}>
            <Tekst id="personage_naam" name="personage_naam" />
          </Veld>
          <Veld label="Tier" name="cast_tier" fout={e.cast_tier}>
            <Keuze id="cast_tier" name="cast_tier" defaultValue="main">
              {CAST_TIERS.map((t) => (
                <option key={t} value={t}>{CAST_TIER_LABEL[t]}</option>
              ))}
            </Keuze>
          </Veld>
        </div>
        <SubmitKnop label="Cast toevoegen" />
      </form>
    </Blok>
  );
}

export function CrewForm({ personen, niveau, niveauId }: { personen: Persoon[]; niveau: Niveau; niveauId: number }) {
  const [state, formAction] = useActionState(maakCrew, { ok: false } as FormState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);
  const e = state.errors ?? {};

  return (
    <Blok titel="Crew toevoegen">
      <form ref={ref} action={formAction} className="card space-y-3 p-4">
        <FormFout message={state.message} />
        <input type="hidden" name="niveau" value={niveau} />
        <input type="hidden" name="niveau_id" value={niveauId} />
        <PersoonKiezer personen={personen} fout={e.persoon_naam || e.persoon_id} />
        <Veld label="Rol" name="rol" fout={e.rol}>
          <Keuze id="rol" name="rol" defaultValue="regisseur">
            {CREW_ROLLEN.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Keuze>
        </Veld>
        <SubmitKnop label="Crew toevoegen" />
      </form>
    </Blok>
  );
}
