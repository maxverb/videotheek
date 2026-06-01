import Link from "next/link";
import { getSeries, getAlleGenres, getAlleZenders } from "@/lib/queries";
import { Poster } from "@/components/Poster";
import { jaarBereik } from "@/lib/format";

export const dynamic = "force-dynamic"; // altijd verse data uit SQLite

export default async function OverzichtPage({
  searchParams,
}: {
  searchParams: Promise<{ zoek?: string; genre?: string; zender?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const filter = {
    zoek: sp.zoek?.trim() || undefined,
    genre: sp.genre || undefined,
    zender: sp.zender || undefined,
    status: sp.status || undefined,
  };
  const series = getSeries(filter);
  const genres = getAlleGenres();
  const zenders = getAlleZenders();
  const heeftFilter = Boolean(filter.zoek || filter.genre || filter.zender || filter.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Series</h1>
          <p className="text-sm text-muted">
            {series.length} {series.length === 1 ? "serie" : "series"} in je verzameling
          </p>
        </div>
      </div>

      {/* Zoek- en filterbalk */}
      <form method="get" className="card flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[220px] flex-1">
          <label className="label" htmlFor="zoek">Zoeken</label>
          <input id="zoek" name="zoek" defaultValue={sp.zoek ?? ""} placeholder="Titel of synopsis…" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="genre">Genre</label>
          <select id="genre" name="genre" defaultValue={sp.genre ?? ""} className="input">
            <option value="">Alle</option>
            {genres.map((g) => (
              <option key={g.id} value={g.naam}>{g.naam}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="zender">Zender</label>
          <select id="zender" name="zender" defaultValue={sp.zender ?? ""} className="input">
            <option value="">Alle</option>
            {zenders.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={sp.status ?? ""} className="input">
            <option value="">Alle</option>
            <option value="lopend">Lopend</option>
            <option value="afgelopen">Afgelopen</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">Filter</button>
          {heeftFilter && <Link href="/" className="btn">Wissen</Link>}
        </div>
      </form>

      {/* Grid */}
      {series.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          {heeftFilter ? (
            <>Geen series gevonden met deze filters.</>
          ) : (
            <>
              Nog geen series. <Link href="/series/new" className="link">Voeg je eerste serie toe</Link> of draai
              <code className="mx-1 rounded bg-ink px-1.5 py-0.5 text-cream">npm run db:seed</code>.
            </>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {series.map((s) => (
            <li key={s.id}>
              <Link href={`/series/${s.id}`} className="group block">
                <Poster pad={s.poster_pad} titel={s.titel} className="transition group-hover:opacity-90" />
                <div className="mt-2">
                  <h3 className="truncate text-sm font-medium text-cream group-hover:text-amber" title={s.titel}>
                    {s.titel}
                  </h3>
                  <p className="text-xs text-muted">
                    {jaarBereik(s.jaar_start, s.jaar_eind, s.status)}
                    {s.zender ? ` · ${s.zender}` : ""}
                  </p>
                  {s.genres && <p className="mt-0.5 truncate text-xs text-muted/70">{s.genres}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
