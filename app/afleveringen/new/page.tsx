import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeizoen } from "@/lib/queries";
import { maakAflevering } from "@/lib/actions";
import { AfleveringForm } from "@/components/forms/AfleveringForm";

export const dynamic = "force-dynamic";

export default async function NieuweAfleveringPage({
  searchParams,
}: {
  searchParams: Promise<{ seizoen_id?: string }>;
}) {
  const { seizoen_id } = await searchParams;
  const seizoenId = Number(seizoen_id);
  const seizoen = getSeizoen(seizoenId);
  if (!seizoen) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href={`/seizoenen/${seizoenId}`} className="text-sm text-muted hover:text-cream">← Terug</Link>
      <h1 className="text-2xl">
        Nieuwe aflevering — {seizoen.serie_titel} S{seizoen.seizoen_nummer}
      </h1>
      <AfleveringForm action={maakAflevering} seizoenId={seizoenId} terug={`/seizoenen/${seizoenId}`} />
    </div>
  );
}
