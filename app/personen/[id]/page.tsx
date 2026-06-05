import Link from "next/link";
import { notFound } from "next/navigation";
import { getPersoon, getCastCreditsVanPersoon, getCrewCreditsVanPersoon } from "@/lib/queries";
import { verwijderPersoon } from "@/lib/actions";
import { Poster } from "@/components/Poster";
import { IconPerson } from "@/components/icons";
import { DeleteButton } from "@/components/DeleteButton";
import { CAST_TIER_LABEL } from "@/lib/types";
import type { PersoonCastCredit, PersoonCrewCredit } from "@/lib/types";

export const dynamic = "force-dynamic";

// Bepaalt waar een credit naartoe linkt en welk label getoond wordt, op basis
// van het niveau (serie / seizoen / aflevering).
function creditLink(c: PersoonCastCredit | PersoonCrewCredit): { href: string; label: string } {
  if (c.aflevering_id) {
    const t = c.aflevering_titel ? ` — ${c.aflevering_titel}` : "";
    return {
      href: `/afleveringen/${c.aflevering_id}`,
      label: `${c.serie_titel ?? "?"} · S${c.seizoen_nummer}E${c.aflevering_nummer}${t}`,
    };
  }
  if (c.seizoen_id) {
    return {
      href: `/seizoenen/${c.seizoen_id}`,
      label: `${c.serie_titel ?? "?"} · Seizoen ${c.seizoen_nummer}`,
    };
  }
  return { href: `/series/${c.serie_id}`, label: c.serie_titel ?? "?" };
}

export default async function PersoonDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const persoon = getPersoon(Number(id));
  if (!persoon) notFound();

  const cast = getCastCreditsVanPersoon(persoon.id);
  const crew = getCrewCreditsVanPersoon(persoon.id);

  return (
    <div className="space-y-8">
      <Link href="/personen" className="text-sm text-muted hover:text-cream">← Personen</Link>

      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <Poster pad={persoon.foto_pad} titel={persoon.naam} aspect="aspect-square" icon={<IconPerson size={28} />} />
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl">{persoon.naam}</h1>
              {persoon.geboortejaar && <p className="text-muted">Geboren {persoon.geboortejaar}</p>}
            </div>
            <div className="flex gap-2">
              <Link href={`/personen/${persoon.id}/edit`} className="btn">Bewerken</Link>
              <DeleteButton
                action={verwijderPersoon}
                velden={{ id: persoon.id }}
                bevestiging={`"${persoon.naam}" verwijderen? Alle credits van deze persoon verdwijnen mee.`}
              />
            </div>
          </div>
          {persoon.bio && <p className="max-w-2xl text-cream/90">{persoon.bio}</p>}
          {persoon.notities && (
            <p className="max-w-2xl text-sm text-muted">
              <span className="font-medium">Notities:</span> {persoon.notities}
            </p>
          )}
        </div>
      </div>

      {/* Cast-credits */}
      <section className="space-y-3">
        <h2 className="text-xl">Als acteur ({cast.length})</h2>
        {cast.length === 0 ? (
          <p className="text-sm text-muted">Geen cast-credits.</p>
        ) : (
          <ul className="divide-y divide-edge overflow-hidden rounded-xl border border-edge">
            {cast.map((c) => {
              const { href, label } = creditLink(c);
              return (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 bg-panel px-4 py-3">
                  <Link href={href} className="link font-medium">{label}</Link>
                  <span className="text-sm text-muted">
                    {c.personage_naam ? `als ${c.personage_naam} · ` : ""}
                    <span className="chip">{CAST_TIER_LABEL[c.cast_tier]}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Crew-credits */}
      <section className="space-y-3">
        <h2 className="text-xl">Als crew ({crew.length})</h2>
        {crew.length === 0 ? (
          <p className="text-sm text-muted">Geen crew-credits.</p>
        ) : (
          <ul className="divide-y divide-edge overflow-hidden rounded-xl border border-edge">
            {crew.map((c) => {
              const { href, label } = creditLink(c);
              return (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 bg-panel px-4 py-3">
                  <Link href={href} className="link font-medium">{label}</Link>
                  <span className="chip">{c.rol}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
