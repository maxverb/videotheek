import Link from "next/link";
import { getPersonen } from "@/lib/queries";
import { Poster } from "@/components/Poster";
import { IconPerson } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function PersonenPage({
  searchParams,
}: {
  searchParams: Promise<{ zoek?: string }>;
}) {
  const { zoek } = await searchParams;
  const personen = getPersonen(zoek?.trim() || undefined);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Personen</h1>
          <p className="text-sm text-muted">{personen.length} personen</p>
        </div>
        <Link href="/personen/new" className="btn-primary">+ Nieuwe persoon</Link>
      </div>

      <form method="get" className="card flex items-end gap-3 p-4">
        <div className="flex-1">
          <label className="label" htmlFor="zoek">Zoeken</label>
          <input id="zoek" name="zoek" defaultValue={zoek ?? ""} placeholder="Naam…" className="input" />
        </div>
        <button type="submit" className="btn-primary">Zoek</button>
        {zoek && <Link href="/personen" className="btn">Wissen</Link>}
      </form>

      {personen.length === 0 ? (
        <div className="card p-10 text-center text-muted">Geen personen gevonden.</div>
      ) : (
        <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {personen.map((p, i) => (
            <li key={p.id} className="animate-poster-in" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
              <Link href={`/personen/${p.id}`} className="group block">
                <Poster
                  pad={p.foto_pad}
                  titel={p.naam}
                  aspect="aspect-square"
                  icon={<IconPerson size={28} />}
                  className="transition group-hover:shadow-hover"
                />
                <h3 className="mt-2 truncate text-sm font-medium text-cream group-hover:text-amber" title={p.naam}>
                  {p.naam}
                </h3>
                {p.geboortejaar && <p className="text-xs text-muted">{p.geboortejaar}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
