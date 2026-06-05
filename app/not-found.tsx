import Link from "next/link";
import { IconFilm } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md p-10 text-center">
      <IconFilm size={44} className="mx-auto text-muted" />
      <h1 className="mt-4 text-2xl">Niet gevonden</h1>
      <p className="mt-2 text-muted">Deze pagina of dit item bestaat niet (meer).</p>
      <Link href="/" className="btn-primary mt-6">Terug naar overzicht</Link>
    </div>
  );
}
