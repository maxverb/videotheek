import Link from "next/link";
import { maakPersoon } from "@/lib/actions";
import { PersoonForm } from "@/components/forms/PersoonForm";

export default function NieuwePersoonPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/personen" className="text-sm text-muted hover:text-cream">← Terug naar personen</Link>
      <h1 className="text-2xl">Nieuwe persoon</h1>
      <PersoonForm action={maakPersoon} terug="/personen" />
    </div>
  );
}
