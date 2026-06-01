"use client";

import { useState } from "react";
import type { Persoon } from "@/lib/types";
import { Veld, Tekst, Keuze } from "@/components/fields";

// Laat de gebruiker een bestaande persoon kiezen óf — zonder de flow te
// verlaten — een nieuwe persoon aanmaken door een naam te typen.
export function PersoonKiezer({
  personen,
  fout,
}: {
  personen: Persoon[];
  fout?: string;
}) {
  const [nieuw, setNieuw] = useState(false);

  return (
    <div className="space-y-2">
      {!nieuw ? (
        <Veld label="Persoon *" name="persoon_id" fout={fout}>
          <div className="flex gap-2">
            <Keuze id="persoon_id" name="persoon_id" defaultValue="" className="flex-1">
              <option value="">— Kies een persoon —</option>
              {personen.map((p) => (
                <option key={p.id} value={p.id}>{p.naam}</option>
              ))}
            </Keuze>
            <button type="button" className="btn whitespace-nowrap" onClick={() => setNieuw(true)}>
              + Nieuwe persoon
            </button>
          </div>
        </Veld>
      ) : (
        <Veld label="Nieuwe persoon (naam) *" name="persoon_naam" fout={fout}>
          <div className="flex gap-2">
            <Tekst id="persoon_naam" name="persoon_naam" placeholder="Volledige naam" className="flex-1" autoFocus />
            <button type="button" className="btn whitespace-nowrap" onClick={() => setNieuw(false)}>
              Bestaande kiezen
            </button>
          </div>
        </Veld>
      )}
    </div>
  );
}
