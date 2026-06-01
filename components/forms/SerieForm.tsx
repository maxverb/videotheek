"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/lib/actions";
import type { Serie } from "@/lib/types";
import { Veld, Tekst, Tekstvlak, Keuze, SubmitKnop, FormFout } from "@/components/fields";

export function SerieForm({
  action,
  serie,
  genres,
  terug,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  serie?: Serie;
  genres?: string;
  terug: string;
}) {
  const [state, formAction] = useActionState(action, { ok: false } as FormState);
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="card space-y-4 p-6">
      <FormFout message={state.message} />

      <Veld label="Titel *" name="titel" fout={e.titel}>
        <Tekst id="titel" name="titel" defaultValue={serie?.titel ?? ""} autoFocus />
      </Veld>

      <div className="grid grid-cols-2 gap-4">
        <Veld label="Jaar (start)" name="jaar_start" fout={e.jaar_start}>
          <Tekst id="jaar_start" name="jaar_start" inputMode="numeric" defaultValue={serie?.jaar_start ?? ""} />
        </Veld>
        <Veld label="Jaar (eind)" name="jaar_eind" fout={e.jaar_eind} hint="Leeg laten als de serie nog loopt">
          <Tekst id="jaar_eind" name="jaar_eind" inputMode="numeric" defaultValue={serie?.jaar_eind ?? ""} />
        </Veld>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Veld label="Zender / omroep" name="zender" fout={e.zender}>
          <Tekst id="zender" name="zender" defaultValue={serie?.zender ?? ""} />
        </Veld>
        <Veld label="Status" name="status" fout={e.status}>
          <Keuze id="status" name="status" defaultValue={serie?.status ?? "afgelopen"}>
            <option value="lopend">Lopend</option>
            <option value="afgelopen">Afgelopen</option>
          </Keuze>
        </Veld>
      </div>

      <Veld label="Genres" name="genres" fout={e.genres} hint="Komma-gescheiden, bv. 'Drama, Komedie'">
        <Tekst id="genres" name="genres" defaultValue={genres ?? ""} />
      </Veld>

      <Veld label="Posterpad" name="poster_pad" fout={e.poster_pad} hint="Absoluut pad naar een afbeelding op je schijf">
        <Tekst id="poster_pad" name="poster_pad" defaultValue={serie?.poster_pad ?? ""} className="font-mono text-xs" />
      </Veld>

      <Veld label="Synopsis" name="synopsis" fout={e.synopsis}>
        <Tekstvlak id="synopsis" name="synopsis" defaultValue={serie?.synopsis ?? ""} />
      </Veld>

      <Veld label="Notities" name="notities" fout={e.notities}>
        <Tekstvlak id="notities" name="notities" defaultValue={serie?.notities ?? ""} rows={3} />
      </Veld>

      <div className="flex gap-2">
        <SubmitKnop />
        <Link href={terug} className="btn">Annuleren</Link>
      </div>
    </form>
  );
}
