import Link from "next/link";
import { maakSerie } from "@/lib/actions";
import { SerieForm } from "@/components/forms/SerieForm";

export default function NieuweSeriePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/" className="text-sm text-muted hover:text-cream">← Terug naar overzicht</Link>
      <h1 className="text-2xl">Nieuwe serie</h1>
      <SerieForm action={maakSerie} terug="/" />
    </div>
  );
}
