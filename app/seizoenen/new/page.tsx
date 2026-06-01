import Link from "next/link";
import { notFound } from "next/navigation";
import { getSerie } from "@/lib/queries";
import { maakSeizoen } from "@/lib/actions";
import { SeizoenForm } from "@/components/forms/SeizoenForm";

export const dynamic = "force-dynamic";

export default async function NieuwSeizoenPage({
  searchParams,
}: {
  searchParams: Promise<{ serie_id?: string }>;
}) {
  const { serie_id } = await searchParams;
  const serieId = Number(serie_id);
  const serie = getSerie(serieId);
  if (!serie) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href={`/series/${serieId}`} className="text-sm text-muted hover:text-cream">← Terug naar {serie.titel}</Link>
      <h1 className="text-2xl">Nieuw seizoen — {serie.titel}</h1>
      <SeizoenForm action={maakSeizoen} serieId={serieId} terug={`/series/${serieId}`} />
    </div>
  );
}
