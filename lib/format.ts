// Kleine weergave-helpers (geen 'server-only': ook in client-componenten bruikbaar).

export function jaarBereik(start: number | null, eind: number | null, status?: string): string {
  if (!start && !eind) return "";
  if (start && !eind) return status === "lopend" ? `${start}–heden` : `${start}–…`;
  if (!start && eind) return `…–${eind}`;
  if (start === eind) return `${start}`;
  return `${start}–${eind}`;
}

export function duurMin(min: number | null): string {
  if (!min && min !== 0) return "";
  return `${min} min`;
}

export function duurSec(sec: number | null): string {
  if (sec == null) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}u ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function bestandsgrootte(bytes: number | null): string {
  if (bytes == null) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export function datumNL(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });
}
