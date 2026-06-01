// Rij-types die exact overeenkomen met de tabellen uit db/schema.sql.

export type Status = "lopend" | "afgelopen";
export type CastTier = "main" | "side" | "one-off" | "gast";
export type CrewRol =
  | "schrijver"
  | "scenario"
  | "regisseur"
  | "producent"
  | "montage"
  | "muziek"
  | "overig";
export type MediaType = "iso" | "mp4" | "upscale" | "snippet" | "extra";

export const CAST_TIERS: CastTier[] = ["main", "side", "one-off", "gast"];
export const CREW_ROLLEN: CrewRol[] = [
  "schrijver",
  "scenario",
  "regisseur",
  "producent",
  "montage",
  "muziek",
  "overig",
];
export const MEDIA_TYPES: MediaType[] = ["iso", "mp4", "upscale", "snippet", "extra"];
export const STATUSSEN: Status[] = ["lopend", "afgelopen"];

// Labels voor nette weergave in de UI.
export const CAST_TIER_LABEL: Record<CastTier, string> = {
  main: "Hoofdcast",
  side: "Bijrol",
  "one-off": "Eenmalig",
  gast: "Gastrol",
};
export const NIVEAU_LABEL = { serie: "Serie", seizoen: "Seizoen", aflevering: "Aflevering" } as const;

export interface Serie {
  id: number;
  titel: string;
  jaar_start: number | null;
  jaar_eind: number | null;
  zender: string | null;
  synopsis: string | null;
  poster_pad: string | null;
  status: Status;
  notities: string | null;
  aangemaakt_op: string;
  gewijzigd_op: string;
}

export interface Seizoen {
  id: number;
  serie_id: number;
  seizoen_nummer: number;
  titel: string | null;
  jaar: number | null;
  poster_pad: string | null;
}

export interface Aflevering {
  id: number;
  seizoen_id: number;
  aflevering_nummer: number;
  titel: string | null;
  uitzenddatum: string | null;
  duur_minuten: number | null;
  synopsis: string | null;
  still_pad: string | null;
}

export interface Persoon {
  id: number;
  naam: string;
  geboortejaar: number | null;
  foto_pad: string | null;
  bio: string | null;
  notities: string | null;
}

export interface CastCredit {
  id: number;
  persoon_id: number;
  personage_naam: string | null;
  cast_tier: CastTier;
  serie_id: number | null;
  seizoen_id: number | null;
  aflevering_id: number | null;
}

export interface CrewCredit {
  id: number;
  persoon_id: number;
  rol: CrewRol;
  serie_id: number | null;
  seizoen_id: number | null;
  aflevering_id: number | null;
}

export interface MediaAsset {
  id: number;
  type: MediaType;
  bestandspad: string;
  label: string | null;
  resolutie: string | null;
  duur_seconden: number | null;
  codec: string | null;
  bestandsgrootte: number | null;
  serie_id: number | null;
  seizoen_id: number | null;
  aflevering_id: number | null;
}

export interface Afbeelding {
  id: number;
  pad: string;
  bijschrift: string | null;
  serie_id: number | null;
  seizoen_id: number | null;
  aflevering_id: number | null;
}

export interface Genre {
  id: number;
  naam: string;
}

// Samengestelde types voor weergave -----------------------------------------

export interface CastCreditMetPersoon extends CastCredit {
  persoon_naam: string;
}
export interface CrewCreditMetPersoon extends CrewCredit {
  persoon_naam: string;
}

// Een credit gezien vanuit een persoon, met context-labels.
export interface PersoonCastCredit extends CastCredit {
  serie_titel: string | null;
  serie_id_ctx: number | null;
  seizoen_nummer: number | null;
  aflevering_nummer: number | null;
  aflevering_titel: string | null;
}
export interface PersoonCrewCredit extends CrewCredit {
  serie_titel: string | null;
  serie_id_ctx: number | null;
  seizoen_nummer: number | null;
  aflevering_nummer: number | null;
  aflevering_titel: string | null;
}
