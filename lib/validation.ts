import { z } from "zod";
import { CAST_TIERS, CREW_ROLLEN, MEDIA_TYPES, STATUSSEN } from "./types";

// Helpers: lege strings uit formulieren omzetten naar null / number.
const leegNaarNull = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => {
    if (v == null) return null;
    const t = v.trim();
    return t === "" ? null : t;
  });

const optNummer = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v == null || v === "") return null;
    const n = typeof v === "number" ? v : Number(String(v).trim());
    return Number.isFinite(n) ? n : null;
  })
  .refine((v) => v === null || Number.isFinite(v), { message: "Moet een getal zijn" });

const verplichtNummer = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "number" ? v : Number(String(v).trim())))
  .refine((v) => Number.isFinite(v), { message: "Verplicht getal" });

// --- Serie ------------------------------------------------------------------
export const serieSchema = z.object({
  titel: z.string().trim().min(1, "Titel is verplicht"),
  jaar_start: optNummer,
  jaar_eind: optNummer,
  zender: leegNaarNull,
  synopsis: leegNaarNull,
  poster_pad: leegNaarNull,
  status: z.enum(STATUSSEN as [string, ...string[]]),
  notities: leegNaarNull,
  // genres als komma-gescheiden tekst uit het formulier
  genres: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean)
    ),
});
export type SerieInput = z.infer<typeof serieSchema>;

// --- Seizoen ----------------------------------------------------------------
export const seizoenSchema = z.object({
  serie_id: verplichtNummer,
  seizoen_nummer: verplichtNummer,
  titel: leegNaarNull,
  jaar: optNummer,
  poster_pad: leegNaarNull,
});
export type SeizoenInput = z.infer<typeof seizoenSchema>;

// --- Aflevering -------------------------------------------------------------
export const afleveringSchema = z.object({
  seizoen_id: verplichtNummer,
  aflevering_nummer: verplichtNummer,
  titel: leegNaarNull,
  uitzenddatum: leegNaarNull,
  duur_minuten: optNummer,
  synopsis: leegNaarNull,
  still_pad: leegNaarNull,
});
export type AfleveringInput = z.infer<typeof afleveringSchema>;

// --- Persoon ----------------------------------------------------------------
export const persoonSchema = z.object({
  naam: z.string().trim().min(1, "Naam is verplicht"),
  geboortejaar: optNummer,
  foto_pad: leegNaarNull,
  bio: leegNaarNull,
  notities: leegNaarNull,
});
export type PersoonInput = z.infer<typeof persoonSchema>;

// --- Niveau (precies één van serie/seizoen/aflevering) ----------------------
const niveauSchema = z
  .object({
    niveau: z.enum(["serie", "seizoen", "aflevering"]),
    niveau_id: verplichtNummer,
  });

// --- Cast-credit ------------------------------------------------------------
// Persoon kan bestaand zijn (persoon_id) of nieuw (persoon_naam).
export const castSchema = niveauSchema.and(
  z.object({
    persoon_id: optNummer,
    persoon_naam: leegNaarNull,
    personage_naam: leegNaarNull,
    cast_tier: z.enum(CAST_TIERS as [string, ...string[]]),
  })
).refine((d) => d.persoon_id != null || (d.persoon_naam && d.persoon_naam.length > 0), {
  message: "Kies een bestaande persoon of vul een nieuwe naam in",
  path: ["persoon_naam"],
});
export type CastInput = z.infer<typeof castSchema>;

// --- Crew-credit ------------------------------------------------------------
export const crewSchema = niveauSchema.and(
  z.object({
    persoon_id: optNummer,
    persoon_naam: leegNaarNull,
    rol: z.enum(CREW_ROLLEN as [string, ...string[]]),
  })
).refine((d) => d.persoon_id != null || (d.persoon_naam && d.persoon_naam.length > 0), {
  message: "Kies een bestaande persoon of vul een nieuwe naam in",
  path: ["persoon_naam"],
});
export type CrewInput = z.infer<typeof crewSchema>;

// --- Media-asset ------------------------------------------------------------
export const mediaSchema = niveauSchema.and(
  z.object({
    type: z.enum(MEDIA_TYPES as [string, ...string[]]),
    bestandspad: z.string().trim().min(1, "Bestandspad is verplicht"),
    label: leegNaarNull,
    resolutie: leegNaarNull,
    duur_seconden: optNummer,
    codec: leegNaarNull,
    bestandsgrootte: optNummer,
  })
);
export type MediaInput = z.infer<typeof mediaSchema>;

// --- Afbeelding -------------------------------------------------------------
export const afbeeldingSchema = niveauSchema.and(
  z.object({
    pad: z.string().trim().min(1, "Pad is verplicht"),
    bijschrift: leegNaarNull,
  })
);
export type AfbeeldingInput = z.infer<typeof afbeeldingSchema>;

// Zet een ZodError om naar een simpel { veld: melding }-object voor formulieren.
export function veldFouten(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
