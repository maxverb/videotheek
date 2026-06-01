import Link from "next/link";
import { notFound } from "next/navigation";
import { getAflevering } from "@/lib/queries";
import { wijzigAflevering } from "@/lib/actions";
import { AfleveringForm } from "@/components/forms/AfleveringForm";

export const dynamic = "force-dynamic";

export default async function BewerkAfleveringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const afl = getAflevering(Number(id));
  if (!afl) notFound();

  const action = wijzigAflevering.bind(null, afl.id);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href={`/afleveringen/${afl.id}`} className="text-sm text-muted hover:text-cream">← Terug</Link>
      <h1 className="text-2xl">Aflevering bewerken</h1>
      <AfleveringForm action={action} seizoenId={afl.seizoen_id} aflevering={afl} terug={`/afleveringen/${afl.id}`} />
    </div>
  );
}
