import Link from "next/link";
import { notFound } from "next/navigation";
import { getPersoon } from "@/lib/queries";
import { wijzigPersoon } from "@/lib/actions";
import { PersoonForm } from "@/components/forms/PersoonForm";

export const dynamic = "force-dynamic";

export default async function BewerkPersoonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const persoon = getPersoon(Number(id));
  if (!persoon) notFound();

  const action = wijzigPersoon.bind(null, persoon.id);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href={`/personen/${persoon.id}`} className="text-sm text-muted hover:text-cream">← Terug</Link>
      <h1 className="text-2xl">Persoon bewerken</h1>
      <PersoonForm action={action} persoon={persoon} terug={`/personen/${persoon.id}`} />
    </div>
  );
}
