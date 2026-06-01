import Link from "next/link";
import type { CastCreditMetPersoon, CrewCreditMetPersoon, CastTier } from "@/lib/types";
import { CAST_TIER_LABEL, CAST_TIERS } from "@/lib/types";

// Cast gegroepeerd op tier (Hoofdcast, Bijrol, Gastrol, Eenmalig).
export function CastGroepen({ cast }: { cast: CastCreditMetPersoon[] }) {
  if (cast.length === 0) return <p className="text-sm text-muted">Geen cast vastgelegd op dit niveau.</p>;

  const perTier = new Map<CastTier, CastCreditMetPersoon[]>();
  for (const c of cast) {
    const arr = perTier.get(c.cast_tier) ?? [];
    arr.push(c);
    perTier.set(c.cast_tier, arr);
  }

  return (
    <div className="space-y-4">
      {CAST_TIERS.filter((t) => perTier.has(t)).map((tier) => (
        <div key={tier}>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {CAST_TIER_LABEL[tier]}
          </h4>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {perTier.get(tier)!.map((c) => (
              <li key={c.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-edge bg-panel2/40 px-3 py-2">
                <Link href={`/personen/${c.persoon_id}`} className="link font-medium">
                  {c.persoon_naam}
                </Link>
                {c.personage_naam && <span className="text-sm text-muted">als {c.personage_naam}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Crew, gegroepeerd op rol.
export function CrewLijst({ crew }: { crew: CrewCreditMetPersoon[] }) {
  if (crew.length === 0) return <p className="text-sm text-muted">Geen crew vastgelegd op dit niveau.</p>;

  const perRol = new Map<string, CrewCreditMetPersoon[]>();
  for (const c of crew) {
    const arr = perRol.get(c.rol) ?? [];
    arr.push(c);
    perRol.set(c.rol, arr);
  }

  return (
    <ul className="space-y-2">
      {[...perRol.entries()].map(([rol, leden]) => (
        <li key={rol} className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{rol}:</span>
          {leden.map((c, i) => (
            <span key={c.id}>
              <Link href={`/personen/${c.persoon_id}`} className="link">{c.persoon_naam}</Link>
              {i < leden.length - 1 ? "," : ""}
            </span>
          ))}
        </li>
      ))}
    </ul>
  );
}
