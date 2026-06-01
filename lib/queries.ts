import "server-only";
import { db } from "./db";
import type {
  Serie,
  Seizoen,
  Aflevering,
  Persoon,
  MediaAsset,
  Afbeelding,
  Genre,
  CastCreditMetPersoon,
  CrewCreditMetPersoon,
  PersoonCastCredit,
  PersoonCrewCredit,
} from "./types";

// ---------------------------------------------------------------------------
// Series
// ---------------------------------------------------------------------------

export interface SerieOverzicht extends Serie {
  genres: string;       // komma-gescheiden genrenamen (voor weergave)
  seizoen_aantal: number;
}

export interface SerieFilter {
  zoek?: string;
  genre?: string;
  zender?: string;
  status?: string;
}

export function getSeries(filter: SerieFilter = {}): SerieOverzicht[] {
  const where: string[] = [];
  const params: Record<string, unknown> = {};

  if (filter.zoek) {
    where.push("(s.titel LIKE @zoek OR s.synopsis LIKE @zoek)");
    params.zoek = `%${filter.zoek}%`;
  }
  if (filter.zender) {
    where.push("s.zender = @zender");
    params.zender = filter.zender;
  }
  if (filter.status) {
    where.push("s.status = @status");
    params.status = filter.status;
  }
  if (filter.genre) {
    where.push(
      "s.id IN (SELECT sg.serie_id FROM serie_genres sg JOIN genres g ON g.id = sg.genre_id WHERE g.naam = @genre)"
    );
    params.genre = filter.genre;
  }

  const sql = `
    SELECT s.*,
      COALESCE((SELECT GROUP_CONCAT(g.naam, ', ')
                FROM serie_genres sg JOIN genres g ON g.id = sg.genre_id
                WHERE sg.serie_id = s.id), '') AS genres,
      (SELECT COUNT(*) FROM seizoenen z WHERE z.serie_id = s.id) AS seizoen_aantal
    FROM series s
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY s.titel COLLATE NOCASE`;
  return db.prepare(sql).all(params) as SerieOverzicht[];
}

export function getSerie(id: number): Serie | undefined {
  return db.prepare("SELECT * FROM series WHERE id = ?").get(id) as Serie | undefined;
}

export function getSerieGenres(serieId: number): Genre[] {
  return db
    .prepare(
      `SELECT g.* FROM genres g JOIN serie_genres sg ON sg.genre_id = g.id
       WHERE sg.serie_id = ? ORDER BY g.naam COLLATE NOCASE`
    )
    .all(serieId) as Genre[];
}

export function getAlleGenres(): Genre[] {
  return db.prepare("SELECT * FROM genres ORDER BY naam COLLATE NOCASE").all() as Genre[];
}

export function getAlleZenders(): string[] {
  const rows = db
    .prepare("SELECT DISTINCT zender FROM series WHERE zender IS NOT NULL AND zender <> '' ORDER BY zender COLLATE NOCASE")
    .all() as { zender: string }[];
  return rows.map((r) => r.zender);
}

// ---------------------------------------------------------------------------
// Seizoenen
// ---------------------------------------------------------------------------

export function getSeizoenenVanSerie(serieId: number): (Seizoen & { aflevering_aantal: number })[] {
  return db
    .prepare(
      `SELECT z.*, (SELECT COUNT(*) FROM afleveringen a WHERE a.seizoen_id = z.id) AS aflevering_aantal
       FROM seizoenen z WHERE z.serie_id = ? ORDER BY z.seizoen_nummer`
    )
    .all(serieId) as (Seizoen & { aflevering_aantal: number })[];
}

export function getSeizoen(id: number): (Seizoen & { serie_titel: string }) | undefined {
  return db
    .prepare(
      `SELECT z.*, s.titel AS serie_titel FROM seizoenen z JOIN series s ON s.id = z.serie_id WHERE z.id = ?`
    )
    .get(id) as (Seizoen & { serie_titel: string }) | undefined;
}

// ---------------------------------------------------------------------------
// Afleveringen
// ---------------------------------------------------------------------------

export function getAfleveringenVanSeizoen(seizoenId: number): Aflevering[] {
  return db
    .prepare("SELECT * FROM afleveringen WHERE seizoen_id = ? ORDER BY aflevering_nummer")
    .all(seizoenId) as Aflevering[];
}

export interface AfleveringContext extends Aflevering {
  seizoen_nummer: number;
  serie_id: number;
  serie_titel: string;
}

export function getAflevering(id: number): AfleveringContext | undefined {
  return db
    .prepare(
      `SELECT a.*, z.seizoen_nummer, z.serie_id, s.titel AS serie_titel
       FROM afleveringen a
       JOIN seizoenen z ON z.id = a.seizoen_id
       JOIN series s ON s.id = z.serie_id
       WHERE a.id = ?`
    )
    .get(id) as AfleveringContext | undefined;
}

// ---------------------------------------------------------------------------
// Personen
// ---------------------------------------------------------------------------

export function getPersonen(zoek?: string): Persoon[] {
  if (zoek) {
    return db
      .prepare("SELECT * FROM personen WHERE naam LIKE ? ORDER BY naam COLLATE NOCASE")
      .all(`%${zoek}%`) as Persoon[];
  }
  return db.prepare("SELECT * FROM personen ORDER BY naam COLLATE NOCASE").all() as Persoon[];
}

export function getPersoon(id: number): Persoon | undefined {
  return db.prepare("SELECT * FROM personen WHERE id = ?").get(id) as Persoon | undefined;
}

// Alle cast-credits van een persoon, met context-labels en links.
export function getCastCreditsVanPersoon(persoonId: number): PersoonCastCredit[] {
  return db
    .prepare(
      `SELECT cc.*,
         COALESCE(s_serie.titel, s_seiz.titel, s_afl.titel) AS serie_titel,
         COALESCE(s_serie.id, s_seiz.id, s_afl.id)          AS serie_id_ctx,
         COALESCE(z_seiz.seizoen_nummer, z_afl.seizoen_nummer) AS seizoen_nummer,
         a.aflevering_nummer AS aflevering_nummer,
         a.titel AS aflevering_titel
       FROM cast_credits cc
       LEFT JOIN series s_serie ON s_serie.id = cc.serie_id
       LEFT JOIN seizoenen z_seiz ON z_seiz.id = cc.seizoen_id
       LEFT JOIN series s_seiz ON s_seiz.id = z_seiz.serie_id
       LEFT JOIN afleveringen a ON a.id = cc.aflevering_id
       LEFT JOIN seizoenen z_afl ON z_afl.id = a.seizoen_id
       LEFT JOIN series s_afl ON s_afl.id = z_afl.serie_id
       WHERE cc.persoon_id = ?
       ORDER BY serie_titel COLLATE NOCASE, seizoen_nummer, aflevering_nummer`
    )
    .all(persoonId) as PersoonCastCredit[];
}

export function getCrewCreditsVanPersoon(persoonId: number): PersoonCrewCredit[] {
  return db
    .prepare(
      `SELECT cc.*,
         COALESCE(s_serie.titel, s_seiz.titel, s_afl.titel) AS serie_titel,
         COALESCE(s_serie.id, s_seiz.id, s_afl.id)          AS serie_id_ctx,
         COALESCE(z_seiz.seizoen_nummer, z_afl.seizoen_nummer) AS seizoen_nummer,
         a.aflevering_nummer AS aflevering_nummer,
         a.titel AS aflevering_titel
       FROM crew_credits cc
       LEFT JOIN series s_serie ON s_serie.id = cc.serie_id
       LEFT JOIN seizoenen z_seiz ON z_seiz.id = cc.seizoen_id
       LEFT JOIN series s_seiz ON s_seiz.id = z_seiz.serie_id
       LEFT JOIN afleveringen a ON a.id = cc.aflevering_id
       LEFT JOIN seizoenen z_afl ON z_afl.id = a.seizoen_id
       LEFT JOIN series s_afl ON s_afl.id = z_afl.serie_id
       WHERE cc.persoon_id = ?
       ORDER BY serie_titel COLLATE NOCASE, seizoen_nummer, aflevering_nummer`
    )
    .all(persoonId) as PersoonCrewCredit[];
}

// ---------------------------------------------------------------------------
// Credits per niveau (voor serie-/seizoen-/aflevering-detail)
// ---------------------------------------------------------------------------

type Niveau = "serie" | "seizoen" | "aflevering";
const KOLOM: Record<Niveau, string> = {
  serie: "serie_id",
  seizoen: "seizoen_id",
  aflevering: "aflevering_id",
};

export function getCastVoor(niveau: Niveau, id: number): CastCreditMetPersoon[] {
  return db
    .prepare(
      `SELECT cc.*, p.naam AS persoon_naam
       FROM cast_credits cc JOIN personen p ON p.id = cc.persoon_id
       WHERE cc.${KOLOM[niveau]} = ?
       ORDER BY CASE cc.cast_tier WHEN 'main' THEN 0 WHEN 'side' THEN 1 WHEN 'gast' THEN 2 ELSE 3 END,
                p.naam COLLATE NOCASE`
    )
    .all(id) as CastCreditMetPersoon[];
}

export function getCrewVoor(niveau: Niveau, id: number): CrewCreditMetPersoon[] {
  return db
    .prepare(
      `SELECT cc.*, p.naam AS persoon_naam
       FROM crew_credits cc JOIN personen p ON p.id = cc.persoon_id
       WHERE cc.${KOLOM[niveau]} = ?
       ORDER BY cc.rol, p.naam COLLATE NOCASE`
    )
    .all(id) as CrewCreditMetPersoon[];
}

export function getMediaVoor(niveau: Niveau, id: number): MediaAsset[] {
  return db
    .prepare(`SELECT * FROM media_assets WHERE ${KOLOM[niveau]} = ? ORDER BY type, label COLLATE NOCASE`)
    .all(id) as MediaAsset[];
}

export function getAfbeeldingenVoor(niveau: Niveau, id: number): Afbeelding[] {
  return db
    .prepare(`SELECT * FROM afbeeldingen WHERE ${KOLOM[niveau]} = ? ORDER BY id`)
    .all(id) as Afbeelding[];
}

export function getMedia(id: number): MediaAsset | undefined {
  return db.prepare("SELECT * FROM media_assets WHERE id = ?").get(id) as MediaAsset | undefined;
}
