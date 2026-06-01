"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/lib/actions";
import type { Seizoen } from "@/lib/types";
import { Veld, Tekst, SubmitKnop, FormFout } from "@/components/fields";

export function SeizoenForm({
  action,
  serieId,
  seizoen,
  terug,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  serieId: number;
  seizoen?: Seizoen;
  terug: string;
}) {
  const [state, formAction] = useActionState(action, { ok: false } as FormState);
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="card space-y-4 p-6">
      <FormFout message={state.message} />
      <input type="hidden" name="serie_id" value={serieId} />

      <div className="grid grid-cols-2 gap-4">
        <Veld label="Seizoensnummer *" name="seizoen_nummer" fout={e.seizoen_nummer}>
          <Tekst id="seizoen_nummer" name="seizoen_nummer" inputMode="numeric" defaultValue={seizoen?.seizoen_nummer ?? ""} autoFocus />
        </Veld>
        <Veld label="Jaar" name="jaar" fout={e.jaar}>
          <Tekst id="jaar" name="jaar" inputMode="numeric" defaultValue={seizoen?.jaar ?? ""} />
        </Veld>
      </div>

      <Veld label="Titel (optioneel)" name="titel" fout={e.titel}>
        <Tekst id="titel" name="titel" defaultValue={seizoen?.titel ?? ""} />
      </Veld>

      <Veld label="Posterpad" name="poster_pad" fout={e.poster_pad}>
        <Tekst id="poster_pad" name="poster_pad" defaultValue={seizoen?.poster_pad ?? ""} className="font-mono text-xs" />
      </Veld>

      <div className="flex gap-2">
        <SubmitKnop />
        <Link href={terug} className="btn">Annuleren</Link>
      </div>
    </form>
  );
}
