"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/lib/actions";
import type { Persoon } from "@/lib/types";
import { Veld, Tekst, Tekstvlak, SubmitKnop, FormFout } from "@/components/fields";

export function PersoonForm({
  action,
  persoon,
  terug,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  persoon?: Persoon;
  terug: string;
}) {
  const [state, formAction] = useActionState(action, { ok: false } as FormState);
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="card space-y-4 p-6">
      <FormFout message={state.message} />

      <div className="grid grid-cols-2 gap-4">
        <Veld label="Naam *" name="naam" fout={e.naam}>
          <Tekst id="naam" name="naam" defaultValue={persoon?.naam ?? ""} autoFocus />
        </Veld>
        <Veld label="Geboortejaar" name="geboortejaar" fout={e.geboortejaar}>
          <Tekst id="geboortejaar" name="geboortejaar" inputMode="numeric" defaultValue={persoon?.geboortejaar ?? ""} />
        </Veld>
      </div>

      <Veld label="Fotopad" name="foto_pad" fout={e.foto_pad}>
        <Tekst id="foto_pad" name="foto_pad" defaultValue={persoon?.foto_pad ?? ""} className="font-mono text-xs" />
      </Veld>

      <Veld label="Bio" name="bio" fout={e.bio}>
        <Tekstvlak id="bio" name="bio" defaultValue={persoon?.bio ?? ""} />
      </Veld>

      <Veld label="Notities" name="notities" fout={e.notities}>
        <Tekstvlak id="notities" name="notities" defaultValue={persoon?.notities ?? ""} rows={3} />
      </Veld>

      <div className="flex gap-2">
        <SubmitKnop />
        <Link href={terug} className="btn">Annuleren</Link>
      </div>
    </form>
  );
}
