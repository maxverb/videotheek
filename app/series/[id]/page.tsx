import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSerie,
  getSerieGenres,
  getSeizoenenVanSerie,
  getCastVoor,
  getCrewVoor,
  getMediaVoor,
  getAfbeeldingenVoor,
  getPersonen,
} from "@/lib/queries";
import {
  verwijderSerie,
  verwijderSeizoen,
  verwijderCast,
  verwijderCrew,
  verwijderMedia,
  verwijderAfbeelding,
} from "@/lib/actions";
import { Poster } from "@/components/Poster";
import { CastGroepen, CrewLijst } from "@/components/Credits";
import { MediaLijst } from "@/components/MediaLijst";
import { Galerij } from "@/components/Galerij";
import { DeleteButton } from "@/components/DeleteButton";
import { CastForm, CrewForm } from "@/components/forms/CreditForms";
import { MediaForm, AfbeeldingForm } from "@/components/forms/MediaForm";
import { jaarBereik } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SerieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const serieId = Number(id);
  const serie = getSerie(serieId);
  if (!serie) notFound();

  const genres = getSerieGenres(serieId);
  const seizoenen = getSeizoenenVanSerie(serieId);
  const cast = getCastVoor("serie", serieId);
  const crew = getCrewVoor("serie", serieId);
  const media = getMediaVoor("serie", serieId);
  const afbeeldingen = getAfbeeldingenVoor("serie", serieId);
  const personen = getPersonen();
  const terug = `/series/${serieId}`;

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm text-muted hover:text-cream">← Overzicht</Link>

      {/* Kop */}
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <Poster pad={serie.poster_pad} titel={serie.titel} />
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl">{serie.titel}</h1>
              <p className="text-muted">
                {jaarBereik(serie.jaar_start, serie.jaar_eind, serie.status)}
                {serie.zender ? ` · ${serie.zender}` : ""}
                {" · "}
                <span className={serie.status === "lopend" ? "text-amber" : ""}>{serie.status}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/series/${serieId}/edit`} className="btn">Bewerken</Link>
              <DeleteButton
                action={verwijderSerie}
                velden={{ id: serieId }}
                bevestiging={`Serie "${serie.titel}" en alles eronder (seizoenen, afleveringen, credits, media) verwijderen?`}
              />
            </div>
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <span key={g.id} className="chip">{g.naam}</span>
              ))}
            </div>
          )}
          {serie.synopsis && <p className="max-w-2xl text-cream/90">{serie.synopsis}</p>}
          {serie.notities && (
            <p className="max-w-2xl text-sm text-muted">
              <span className="font-medium">Notities:</span> {serie.notities}
            </p>
          )}
        </div>
      </div>

      {/* Seizoenen */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Seizoenen</h2>
          <Link href={`/seizoenen/new?serie_id=${serieId}`} className="btn">+ Seizoen</Link>
        </div>
        {seizoenen.length === 0 ? (
          <p className="text-sm text-muted">Nog geen seizoenen.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {seizoenen.map((z) => (
              <li key={z.id} className="card flex items-center justify-between gap-3 p-3">
                <Link href={`/seizoenen/${z.id}`} className="min-w-0 flex-1">
                  <span className="font-medium text-cream hover:text-amber">
                    Seizoen {z.seizoen_nummer}{z.titel ? ` — ${z.titel}` : ""}
                  </span>
                  <span className="block text-xs text-muted">
                    {z.jaar ? `${z.jaar} · ` : ""}{z.aflevering_aantal} afl.
                  </span>
                </Link>
                <DeleteButton
                  action={verwijderSeizoen}
                  velden={{ id: z.id, serie_id: serieId }}
                  label="✕"
                  klein
                  bevestiging={`Seizoen ${z.seizoen_nummer} verwijderen?`}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Cast & Crew op serieniveau */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-xl">Vaste cast (serieniveau)</h2>
          <CastGroepen cast={cast} />
          {cast.map((c) => (
            <DeleteButtonInline key={c.id} id={c.id} naam={c.persoon_naam} terug={terug} soort="cast" />
          ))}
          <CastForm personen={personen} niveau="serie" niveauId={serieId} />
        </section>

        <section className="space-y-3">
          <h2 className="text-xl">Crew (serieniveau)</h2>
          <CrewLijst crew={crew} />
          {crew.map((c) => (
            <DeleteButtonInline key={c.id} id={c.id} naam={`${c.persoon_naam} (${c.rol})`} terug={terug} soort="crew" />
          ))}
          <CrewForm personen={personen} niveau="serie" niveauId={serieId} />
        </section>
      </div>

      {/* Media */}
      <section className="space-y-3">
        <h2 className="text-xl">Gekoppelde media (serieniveau)</h2>
        <MediaLijst media={media} />
        {media.map((m) => (
          <DeleteButtonInline key={m.id} id={m.id} naam={m.label || m.bestandspad} terug={terug} soort="media" />
        ))}
        <MediaForm niveau="serie" niveauId={serieId} />
      </section>

      {/* Galerij */}
      <section className="space-y-3">
        <h2 className="text-xl">Galerij</h2>
        <Galerij afbeeldingen={afbeeldingen} />
        {afbeeldingen.map((a) => (
          <DeleteButtonInline key={a.id} id={a.id} naam={a.bijschrift || a.pad} terug={terug} soort="afbeelding" />
        ))}
        <AfbeeldingForm niveau="serie" niveauId={serieId} />
      </section>
    </div>
  );
}

// Kleine helper-knop voor het verwijderen van losse credits/media/afbeeldingen.
function DeleteButtonInline({
  id,
  naam,
  terug,
  soort,
}: {
  id: number;
  naam: string;
  terug: string;
  soort: "cast" | "crew" | "media" | "afbeelding";
}) {
  const action =
    soort === "cast" ? verwijderCast : soort === "crew" ? verwijderCrew : soort === "media" ? verwijderMedia : verwijderAfbeelding;
  return (
    <div className="text-right">
      <DeleteButton action={action} velden={{ id, terug }} label={`✕ ${naam}`} klein bevestiging={`"${naam}" verwijderen?`} />
    </div>
  );
}
