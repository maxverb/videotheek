// Toont een lokale poster/still via /api/image, of een nette placeholder met
// de titel-initialen als er geen (geldig) pad is.

function initialen(titel: string): string {
  return titel
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Poster({
  pad,
  titel,
  className = "",
  aspect = "aspect-[2/3]",
}: {
  pad: string | null;
  titel: string;
  className?: string;
  aspect?: string;
}) {
  if (pad) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/api/image?path=${encodeURIComponent(pad)}`}
        alt={titel}
        className={`${aspect} w-full rounded-lg object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`${aspect} flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-panel2 to-ink ${className}`}
    >
      <span className="select-none text-3xl font-semibold text-edge">{initialen(titel)}</span>
    </div>
  );
}
