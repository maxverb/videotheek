import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAflevering,
  getCastVoor,
  getCrewVoor,
  getMediaVoor,
  getPersonen,
} from "@/lib/queries";
import {
  verwijderAflevering,
  verwijderCast,
  verwijderCrew,
  verwijderMedia,
} from "@/lib/actions";
import { Poster } from "@/components/Poster";
import { CastGroepen, CrewLijst } from "@/components/Credits";
import { MediaLijst } from "@/components/MediaLijst";
import { DeleteButton } from "@/components/DeleteButton";
import { CastForm, CrewForm } from "@/components/forms/CreditForms";
import { MediaForm } from "@/components/forms/MediaForm";
import { duurMin, datumNL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AfleveringDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const aflId = Number(id);
  const afl = getAflevering(aflId);
  if (!afl) notFound();

  const cast = getCastVoor("aflevering", aflId);
  const crew = getCrewVoor("aflevering", aflId);
  const media = getMediaVoor("aflevering", aflId);
  const personen = getPersonen();
  const terug = `/afleveringen/${aflId}`;

  return (
    <div className="space-y-8">
      <Link href={`/seizoenen/${afl.seizoen_id}`} className="text-sm text-muted hover:text-cream">
        ← {afl.serie_titel} · Seizoen {afl.seizoen_nummer}
      </Link>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <Poster pad={afl.still_pad} titel={afl.titel || `Afl. ${afl.aflevering_nummer}`} aspect="aspect-video" />
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl">
                {afl.aflevering_nummer}. {afl.titel || "(zonder titel)"}
              </h1>
              <p className="text-muted">
                {afl.serie_titel} · S{afl.seizoen_nummer}
                {[datumNL(afl.uitzenddatum), duurMin(afl.duur_minuten)].filter(Boolean).map((x) => ` · ${x}`).join("")}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/afleveringen/${aflId}/edit`} className="btn">Bewerken</Link>
              <DeleteButton
                action={verwijderAflevering}
                velden={{ id: aflId, seizoen_id: afl.seizoen_id }}
                bevestiging={`Aflevering ${afl.aflevering_nummer} verwijderen?`}
              />
            </div>
          </div>
          {afl.synopsis && <p className="max-w-2xl text-cream/90">{afl.synopsis}</p>}
        </div>
      </div>

      {/* Media met afspeelknop */}
      <section className="space-y-3">
        <h2 className="text-xl">Media</h2>
        <MediaLijst media={media} />
        <div className="flex flex-wrap gap-1">
          {media.map((m) => (
            <DeleteButton key={m.id} action={verwijderMedia} velden={{ id: m.id, terug }} label={m.label || m.bestandspad} variant="subtle" bevestiging="Media verwijderen?" />
          ))}
        </div>
        <MediaForm niveau="aflevering" niveauId={aflId} />
      </section>

      {/* Gastcast & crew op afleveringsniveau */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-xl">Gastcast (afleveringsniveau)</h2>
          <CastGroepen cast={cast} />
          <div className="flex flex-wrap gap-1">
            {cast.map((c) => (
              <DeleteButton key={c.id} action={verwijderCast} velden={{ id: c.id, terug }} label={c.persoon_naam} variant="subtle" bevestiging={`"${c.persoon_naam}" verwijderen?`} />
            ))}
          </div>
          <CastForm personen={personen} niveau="aflevering" niveauId={aflId} />
        </section>

        <section className="space-y-3">
          <h2 className="text-xl">Schrijver(s) / regisseur (afleveringsniveau)</h2>
          <CrewLijst crew={crew} />
          <div className="flex flex-wrap gap-1">
            {crew.map((c) => (
              <DeleteButton key={c.id} action={verwijderCrew} velden={{ id: c.id, terug }} label={`${c.persoon_naam} (${c.rol})`} variant="subtle" bevestiging={`"${c.persoon_naam}" verwijderen?`} />
            ))}
          </div>
          <CrewForm personen={personen} niveau="aflevering" niveauId={aflId} />
        </section>
      </div>
    </div>
  );
}
