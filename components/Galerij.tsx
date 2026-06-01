import type { Afbeelding } from "@/lib/types";

// Eenvoudige galerij die lokale afbeeldingen via /api/image toont.
export function Galerij({ afbeeldingen }: { afbeeldingen: Afbeelding[] }) {
  if (afbeeldingen.length === 0) return <p className="text-sm text-muted">Geen afbeeldingen.</p>;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {afbeeldingen.map((a) => (
        <li key={a.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/image?path=${encodeURIComponent(a.pad)}`}
            alt={a.bijschrift ?? ""}
            className="aspect-video w-full rounded-lg border border-edge object-cover"
          />
          {a.bijschrift && <p className="mt-1 text-xs text-muted">{a.bijschrift}</p>}
        </li>
      ))}
    </ul>
  );
}
