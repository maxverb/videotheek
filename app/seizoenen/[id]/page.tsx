import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSeizoen,
  getAfleveringenVanSeizoen,
  getCastVoor,
  getCrewVoor,
  getMediaVoor,
  getPersonen,
} from "@/lib/queries";
import {
  verwijderSeizoen,
  verwijderAflevering,
  verwijderCast,
  verwijderCrew,
  verwijderMedia,
} from "@/lib/actions";
import { CastGroepen, CrewLijst } from "@/components/Credits";
import { MediaLijst } from "@/components/MediaLijst";
import { DeleteButton } from "@/components/DeleteButton";
import { CastForm, CrewForm } from "@/components/forms/CreditForms";
import { MediaForm } from "@/components/forms/MediaForm";
import { duurMin, datumNL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SeizoenDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seizoenId = Number(id);
  const seizoen = getSeizoen(seizoenId);
  if (!seizoen) notFound();

  const afleveringen = getAfleveringenVanSeizoen(seizoenId);
  const cast = getCastVoor("seizoen", seizoenId);
  const crew = getCrewVoor("seizoen", seizoenId);
  const media = getMediaVoor("seizoen", seizoenId);
  const personen = getPersonen();
  const terug = `/seizoenen/${seizoenId}`;

  return (
    <div className="space-y-8">
      <Link href={`/series/${seizoen.serie_id}`} className="text-sm text-muted hover:text-cream">
        ← {seizoen.serie_titel}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl">
            Seizoen {seizoen.seizoen_nummer}{seizoen.titel ? ` — ${seizoen.titel}` : ""}
          </h1>
          <p className="text-muted">{seizoen.serie_titel}{seizoen.jaar ? ` · ${seizoen.jaar}` : ""}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/seizoenen/${seizoenId}/edit`} className="btn">Bewerken</Link>
          <DeleteButton
            action={verwijderSeizoen}
            velden={{ id: seizoenId, serie_id: seizoen.serie_id }}
            bevestiging={`Seizoen ${seizoen.seizoen_nummer} en alle afleveringen verwijderen?`}
          />
        </div>
      </div>

      {/* Afleveringen */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Afleveringen</h2>
          <Link href={`/afleveringen/new?seizoen_id=${seizoenId}`} className="btn">+ Aflevering</Link>
        </div>
        {afleveringen.length === 0 ? (
          <p className="text-sm text-muted">Nog geen afleveringen.</p>
        ) : (
          <ul className="divide-y divide-edge overflow-hidden rounded-xl border border-edge">
            {afleveringen.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 bg-panel px-4 py-3">
                <Link href={`/afleveringen/${a.id}`} className="min-w-0 flex-1">
                  <span className="font-medium text-cream hover:text-amber">
                    {a.aflevering_nummer}. {a.titel || "(zonder titel)"}
                  </span>
                  <span className="block text-xs text-muted">
                    {[datumNL(a.uitzenddatum), duurMin(a.duur_minuten)].filter(Boolean).join(" · ")}
                  </span>
                </Link>
                <DeleteButton
                  action={verwijderAflevering}
                  velden={{ id: a.id, seizoen_id: seizoenId }}
                  label="✕"
                  klein
                  bevestiging={`Aflevering ${a.aflevering_nummer} verwijderen?`}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Credits op seizoensniveau */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-xl">Cast (seizoensniveau)</h2>
          <CastGroepen cast={cast} />
          {cast.map((c) => (
            <div key={c.id} className="text-right">
              <DeleteButton action={verwijderCast} velden={{ id: c.id, terug }} label={`✕ ${c.persoon_naam}`} klein bevestiging={`"${c.persoon_naam}" verwijderen?`} />
            </div>
          ))}
          <CastForm personen={personen} niveau="seizoen" niveauId={seizoenId} />
        </section>

        <section className="space-y-3">
          <h2 className="text-xl">Crew (seizoensniveau)</h2>
          <CrewLijst crew={crew} />
          {crew.map((c) => (
            <div key={c.id} className="text-right">
              <DeleteButton action={verwijderCrew} velden={{ id: c.id, terug }} label={`✕ ${c.persoon_naam} (${c.rol})`} klein bevestiging={`"${c.persoon_naam}" verwijderen?`} />
            </div>
          ))}
          <CrewForm personen={personen} niveau="seizoen" niveauId={seizoenId} />
        </section>
      </div>

      {/* Media */}
      <section className="space-y-3">
        <h2 className="text-xl">Gekoppelde media (seizoensniveau)</h2>
        <MediaLijst media={media} />
        {media.map((m) => (
          <div key={m.id} className="text-right">
            <DeleteButton action={verwijderMedia} velden={{ id: m.id, terug }} label={`✕ ${m.label || m.bestandspad}`} klein bevestiging="Media verwijderen?" />
          </div>
        ))}
        <MediaForm niveau="seizoen" niveauId={seizoenId} />
      </section>
    </div>
  );
}
