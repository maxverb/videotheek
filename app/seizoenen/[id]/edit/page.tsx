import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeizoen } from "@/lib/queries";
import { wijzigSeizoen } from "@/lib/actions";
import { SeizoenForm } from "@/components/forms/SeizoenForm";

export const dynamic = "force-dynamic";

export default async function BewerkSeizoenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seizoen = getSeizoen(Number(id));
  if (!seizoen) notFound();

  const action = wijzigSeizoen.bind(null, seizoen.id);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href={`/seizoenen/${seizoen.id}`} className="text-sm text-muted hover:text-cream">← Terug</Link>
      <h1 className="text-2xl">Seizoen bewerken</h1>
      <SeizoenForm action={action} serieId={seizoen.serie_id} seizoen={seizoen} terug={`/seizoenen/${seizoen.id}`} />
    </div>
  );
}
