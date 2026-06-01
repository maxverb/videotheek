import Link from "next/link";
import { notFound } from "next/navigation";
import { getSerie, getSerieGenres } from "@/lib/queries";
import { wijzigSerie } from "@/lib/actions";
import { SerieForm } from "@/components/forms/SerieForm";

export const dynamic = "force-dynamic";

export default async function BewerkSeriePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const serie = getSerie(Number(id));
  if (!serie) notFound();

  const genres = getSerieGenres(serie.id).map((g) => g.naam).join(", ");
  const action = wijzigSerie.bind(null, serie.id);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href={`/series/${serie.id}`} className="text-sm text-muted hover:text-cream">← Terug naar serie</Link>
      <h1 className="text-2xl">Serie bewerken</h1>
      <SerieForm action={action} serie={serie} genres={genres} terug={`/series/${serie.id}`} />
    </div>
  );
}
