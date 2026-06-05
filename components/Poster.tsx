import type { ReactNode } from "react";
import { IconFilm } from "@/components/icons";

// Toont een lokale poster/still via /api/image. Ontbreekt de poster, dan een
// strakke placeholder: een dun lijn-icoon + de titel in 'muted' (zie DESIGN.md).
// Met overlayTitle verschijnt bij hover (op een 'group'-ouder) een titelbalk.
export function Poster({
  pad,
  titel,
  className = "",
  aspect = "aspect-[2/3]",
  icon,
  overlayTitle,
  overlaySubtitle,
}: {
  pad: string | null;
  titel: string;
  className?: string;
  aspect?: string;
  icon?: ReactNode;
  overlayTitle?: string;
  overlaySubtitle?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded border border-edge bg-panel2 ${aspect} ${className}`}>
      {pad ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/image?path=${encodeURIComponent(pad)}`}
          alt={titel}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-2 text-center">
          <span className="text-muted">{icon ?? <IconFilm size={28} />}</span>
          <span className="line-clamp-2 text-[12px] leading-tight text-muted">{titel}</span>
        </div>
      )}

      {overlayTitle && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(15,18,22,0.85)] to-transparent p-2 pt-8 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <p className="truncate text-[13px] font-medium text-white" title={overlayTitle}>
            {overlayTitle}
          </p>
          {overlaySubtitle && <p className="truncate text-[11px] text-white/80">{overlaySubtitle}</p>}
        </div>
      )}
    </div>
  );
}
