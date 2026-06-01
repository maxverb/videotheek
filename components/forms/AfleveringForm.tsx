"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/lib/actions";
import type { Aflevering } from "@/lib/types";
import { Veld, Tekst, Tekstvlak, SubmitKnop, FormFout } from "@/components/fields";

export function AfleveringForm({
  action,
  seizoenId,
  aflevering,
  terug,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  seizoenId: number;
  aflevering?: Aflevering;
  terug: string;
}) {
  const [state, formAction] = useActionState(action, { ok: false } as FormState);
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="card space-y-4 p-6">
      <FormFout message={state.message} />
      <input type="hidden" name="seizoen_id" value={seizoenId} />

      <div className="grid grid-cols-2 gap-4">
        <Veld label="Afleveringsnummer *" name="aflevering_nummer" fout={e.aflevering_nummer}>
          <Tekst id="aflevering_nummer" name="aflevering_nummer" inputMode="numeric" defaultValue={aflevering?.aflevering_nummer ?? ""} autoFocus />
        </Veld>
        <Veld label="Duur (minuten)" name="duur_minuten" fout={e.duur_minuten}>
          <Tekst id="duur_minuten" name="duur_minuten" inputMode="numeric" defaultValue={aflevering?.duur_minuten ?? ""} />
        </Veld>
      </div>

      <Veld label="Titel" name="titel" fout={e.titel}>
        <Tekst id="titel" name="titel" defaultValue={aflevering?.titel ?? ""} />
      </Veld>

      <Veld label="Uitzenddatum" name="uitzenddatum" fout={e.uitzenddatum} hint="Formaat JJJJ-MM-DD">
        <Tekst id="uitzenddatum" name="uitzenddatum" type="date" defaultValue={aflevering?.uitzenddatum ?? ""} />
      </Veld>

      <Veld label="Synopsis" name="synopsis" fout={e.synopsis}>
        <Tekstvlak id="synopsis" name="synopsis" defaultValue={aflevering?.synopsis ?? ""} />
      </Veld>

      <Veld label="Still-pad" name="still_pad" fout={e.still_pad}>
        <Tekst id="still_pad" name="still_pad" defaultValue={aflevering?.still_pad ?? ""} className="font-mono text-xs" />
      </Veld>

      <div className="flex gap-2">
        <SubmitKnop />
        <Link href={terug} className="btn">Annuleren</Link>
      </div>
    </form>
  );
}
