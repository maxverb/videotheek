"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "./db";
import {
  serieSchema,
  seizoenSchema,
  afleveringSchema,
  persoonSchema,
  castSchema,
  crewSchema,
  mediaSchema,
  afbeeldingSchema,
  veldFouten,
} from "./validation";
import { z } from "zod";

export interface FormState {
  ok: boolean;
  errors?: Record<string, string>;
  message?: string;
}

const OK: FormState = { ok: true };

function fail(error: unknown): FormState {
  if (error instanceof z.ZodError) return { ok: false, errors: veldFouten(error) };
  return { ok: false, message: (error as Error).message ?? "Onbekende fout" };
}

// Zet niveau ('serie'|'seizoen'|'aflevering') + id om naar kolomwaarden.
function niveauKolommen(niveau: string, id: number) {
  return {
    serie_id: niveau === "serie" ? id : null,
    seizoen_id: niveau === "seizoen" ? id : null,
    aflevering_id: niveau === "aflevering" ? id : null,
  };
}

// Pad om naar het juiste serie-detail terug te navigeren na een credit-/media-actie.
function serieIdVoorNiveau(niveau: string, id: number): number | null {
  if (niveau === "serie") return id;
  if (niveau === "seizoen") {
    const r = db.prepare("SELECT serie_id FROM seizoenen WHERE id = ?").get(id) as { serie_id: number } | undefined;
    return r?.serie_id ?? null;
  }
  const r = db
    .prepare("SELECT z.serie_id AS serie_id FROM afleveringen a JOIN seizoenen z ON z.id = a.seizoen_id WHERE a.id = ?")
    .get(id) as { serie_id: number } | undefined;
  return r?.serie_id ?? null;
}

// ===========================================================================
// SERIES
// ===========================================================================

function zetSerieGenres(serieId: number, genres: string[]) {
  db.prepare("DELETE FROM serie_genres WHERE serie_id = ?").run(serieId);
  const insGenre = db.prepare("INSERT OR IGNORE INTO genres (naam) VALUES (?)");
  const getGenre = db.prepare("SELECT id FROM genres WHERE naam = ?");
  const link = db.prepare("INSERT OR IGNORE INTO serie_genres (serie_id, genre_id) VALUES (?, ?)");
  for (const naam of genres) {
    insGenre.run(naam);
    const g = getGenre.get(naam) as { id: number };
    link.run(serieId, g.id);
  }
}

export async function maakSerie(_prev: FormState, fd: FormData): Promise<FormState> {
  let id: number;
  try {
    const d = serieSchema.parse(Object.fromEntries(fd));
    const tx = db.transaction(() => {
      const info = db
        .prepare(
          `INSERT INTO series (titel, jaar_start, jaar_eind, zender, synopsis, poster_pad, status, notities)
           VALUES (@titel, @jaar_start, @jaar_eind, @zender, @synopsis, @poster_pad, @status, @notities)`
        )
        .run(d);
      const newId = Number(info.lastInsertRowid);
      zetSerieGenres(newId, d.genres);
      return newId;
    });
    id = tx();
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/");
  redirect(`/series/${id}`);
}

export async function wijzigSerie(serieId: number, _prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const d = serieSchema.parse(Object.fromEntries(fd));
    const tx = db.transaction(() => {
      db.prepare(
        `UPDATE series SET titel=@titel, jaar_start=@jaar_start, jaar_eind=@jaar_eind, zender=@zender,
           synopsis=@synopsis, poster_pad=@poster_pad, status=@status, notities=@notities,
           gewijzigd_op=datetime('now') WHERE id=@id`
      ).run({ ...d, id: serieId });
      zetSerieGenres(serieId, d.genres);
    });
    tx();
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/");
  revalidatePath(`/series/${serieId}`);
  redirect(`/series/${serieId}`);
}

export async function verwijderSerie(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  db.prepare("DELETE FROM series WHERE id = ?").run(id);
  revalidatePath("/");
  redirect("/");
}

// ===========================================================================
// SEIZOENEN
// ===========================================================================

export async function maakSeizoen(_prev: FormState, fd: FormData): Promise<FormState> {
  let serieId: number;
  try {
    const d = seizoenSchema.parse(Object.fromEntries(fd));
    serieId = d.serie_id;
    db.prepare(
      `INSERT INTO seizoenen (serie_id, seizoen_nummer, titel, jaar, poster_pad)
       VALUES (@serie_id, @seizoen_nummer, @titel, @jaar, @poster_pad)`
    ).run(d);
  } catch (e) {
    return fail(e);
  }
  revalidatePath(`/series/${serieId}`);
  redirect(`/series/${serieId}`);
}

export async function wijzigSeizoen(seizoenId: number, _prev: FormState, fd: FormData): Promise<FormState> {
  let serieId: number;
  try {
    const d = seizoenSchema.parse(Object.fromEntries(fd));
    serieId = d.serie_id;
    db.prepare(
      `UPDATE seizoenen SET seizoen_nummer=@seizoen_nummer, titel=@titel, jaar=@jaar, poster_pad=@poster_pad
       WHERE id=@id`
    ).run({ ...d, id: seizoenId });
  } catch (e) {
    return fail(e);
  }
  revalidatePath(`/series/${serieId}`);
  revalidatePath(`/seizoenen/${seizoenId}`);
  redirect(`/seizoenen/${seizoenId}`);
}

export async function verwijderSeizoen(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  const serieId = Number(fd.get("serie_id"));
  db.prepare("DELETE FROM seizoenen WHERE id = ?").run(id);
  revalidatePath(`/series/${serieId}`);
  redirect(`/series/${serieId}`);
}

// ===========================================================================
// AFLEVERINGEN
// ===========================================================================

export async function maakAflevering(_prev: FormState, fd: FormData): Promise<FormState> {
  let seizoenId: number;
  try {
    const d = afleveringSchema.parse(Object.fromEntries(fd));
    seizoenId = d.seizoen_id;
    db.prepare(
      `INSERT INTO afleveringen (seizoen_id, aflevering_nummer, titel, uitzenddatum, duur_minuten, synopsis, still_pad)
       VALUES (@seizoen_id, @aflevering_nummer, @titel, @uitzenddatum, @duur_minuten, @synopsis, @still_pad)`
    ).run(d);
  } catch (e) {
    return fail(e);
  }
  revalidatePath(`/seizoenen/${seizoenId}`);
  redirect(`/seizoenen/${seizoenId}`);
}

export async function wijzigAflevering(afleveringId: number, _prev: FormState, fd: FormData): Promise<FormState> {
  let seizoenId: number;
  try {
    const d = afleveringSchema.parse(Object.fromEntries(fd));
    seizoenId = d.seizoen_id;
    db.prepare(
      `UPDATE afleveringen SET aflevering_nummer=@aflevering_nummer, titel=@titel, uitzenddatum=@uitzenddatum,
         duur_minuten=@duur_minuten, synopsis=@synopsis, still_pad=@still_pad WHERE id=@id`
    ).run({ ...d, id: afleveringId });
  } catch (e) {
    return fail(e);
  }
  revalidatePath(`/seizoenen/${seizoenId}`);
  revalidatePath(`/afleveringen/${afleveringId}`);
  redirect(`/afleveringen/${afleveringId}`);
}

export async function verwijderAflevering(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  const seizoenId = Number(fd.get("seizoen_id"));
  db.prepare("DELETE FROM afleveringen WHERE id = ?").run(id);
  revalidatePath(`/seizoenen/${seizoenId}`);
  redirect(`/seizoenen/${seizoenId}`);
}

// ===========================================================================
// PERSONEN
// ===========================================================================

export async function maakPersoon(_prev: FormState, fd: FormData): Promise<FormState> {
  let id: number;
  try {
    const d = persoonSchema.parse(Object.fromEntries(fd));
    const info = db
      .prepare(
        `INSERT INTO personen (naam, geboortejaar, foto_pad, bio, notities)
         VALUES (@naam, @geboortejaar, @foto_pad, @bio, @notities)`
      )
      .run(d);
    id = Number(info.lastInsertRowid);
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/personen");
  redirect(`/personen/${id}`);
}

export async function wijzigPersoon(persoonId: number, _prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const d = persoonSchema.parse(Object.fromEntries(fd));
    db.prepare(
      `UPDATE personen SET naam=@naam, geboortejaar=@geboortejaar, foto_pad=@foto_pad, bio=@bio, notities=@notities
       WHERE id=@id`
    ).run({ ...d, id: persoonId });
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/personen");
  revalidatePath(`/personen/${persoonId}`);
  redirect(`/personen/${persoonId}`);
}

export async function verwijderPersoon(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  db.prepare("DELETE FROM personen WHERE id = ?").run(id);
  revalidatePath("/personen");
  redirect("/personen");
}

// ===========================================================================
// CAST / CREW CREDITS
// ===========================================================================

// Zorgt voor een persoon-id: gebruikt bestaande, of maakt nieuwe aan.
function zorgVoorPersoon(persoonId: number | null, persoonNaam: string | null): number {
  if (persoonId != null) return persoonId;
  const info = db.prepare("INSERT INTO personen (naam) VALUES (?)").run(persoonNaam);
  return Number(info.lastInsertRowid);
}

export async function maakCast(_prev: FormState, fd: FormData): Promise<FormState> {
  let serieId: number | null;
  try {
    const d = castSchema.parse(Object.fromEntries(fd));
    const pid = zorgVoorPersoon(d.persoon_id, d.persoon_naam);
    db.prepare(
      `INSERT INTO cast_credits (persoon_id, personage_naam, cast_tier, serie_id, seizoen_id, aflevering_id)
       VALUES (@persoon_id, @personage_naam, @cast_tier, @serie_id, @seizoen_id, @aflevering_id)`
    ).run({
      persoon_id: pid,
      personage_naam: d.personage_naam,
      cast_tier: d.cast_tier,
      ...niveauKolommen(d.niveau, d.niveau_id),
    });
    serieId = serieIdVoorNiveau(d.niveau, d.niveau_id);
  } catch (e) {
    return fail(e);
  }
  if (serieId) revalidatePath(`/series/${serieId}`);
  return OK;
}

export async function maakCrew(_prev: FormState, fd: FormData): Promise<FormState> {
  let serieId: number | null;
  try {
    const d = crewSchema.parse(Object.fromEntries(fd));
    const pid = zorgVoorPersoon(d.persoon_id, d.persoon_naam);
    db.prepare(
      `INSERT INTO crew_credits (persoon_id, rol, serie_id, seizoen_id, aflevering_id)
       VALUES (@persoon_id, @rol, @serie_id, @seizoen_id, @aflevering_id)`
    ).run({ persoon_id: pid, rol: d.rol, ...niveauKolommen(d.niveau, d.niveau_id) });
    serieId = serieIdVoorNiveau(d.niveau, d.niveau_id);
  } catch (e) {
    return fail(e);
  }
  if (serieId) revalidatePath(`/series/${serieId}`);
  return OK;
}

export async function verwijderCast(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  const terug = String(fd.get("terug") || "/");
  db.prepare("DELETE FROM cast_credits WHERE id = ?").run(id);
  revalidatePath(terug);
  redirect(terug);
}

export async function verwijderCrew(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  const terug = String(fd.get("terug") || "/");
  db.prepare("DELETE FROM crew_credits WHERE id = ?").run(id);
  revalidatePath(terug);
  redirect(terug);
}

// ===========================================================================
// MEDIA
// ===========================================================================

export async function maakMedia(_prev: FormState, fd: FormData): Promise<FormState> {
  let serieId: number | null;
  try {
    const d = mediaSchema.parse(Object.fromEntries(fd));
    db.prepare(
      `INSERT INTO media_assets (type, bestandspad, label, resolutie, duur_seconden, codec, bestandsgrootte, serie_id, seizoen_id, aflevering_id)
       VALUES (@type, @bestandspad, @label, @resolutie, @duur_seconden, @codec, @bestandsgrootte, @serie_id, @seizoen_id, @aflevering_id)`
    ).run({
      type: d.type,
      bestandspad: d.bestandspad,
      label: d.label,
      resolutie: d.resolutie,
      duur_seconden: d.duur_seconden,
      codec: d.codec,
      bestandsgrootte: d.bestandsgrootte,
      ...niveauKolommen(d.niveau, d.niveau_id),
    });
    serieId = serieIdVoorNiveau(d.niveau, d.niveau_id);
  } catch (e) {
    return fail(e);
  }
  if (serieId) revalidatePath(`/series/${serieId}`);
  return OK;
}

export async function verwijderMedia(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  const terug = String(fd.get("terug") || "/");
  db.prepare("DELETE FROM media_assets WHERE id = ?").run(id);
  revalidatePath(terug);
  redirect(terug);
}

// ===========================================================================
// AFBEELDINGEN
// ===========================================================================

export async function maakAfbeelding(_prev: FormState, fd: FormData): Promise<FormState> {
  let serieId: number | null;
  try {
    const d = afbeeldingSchema.parse(Object.fromEntries(fd));
    db.prepare(
      `INSERT INTO afbeeldingen (pad, bijschrift, serie_id, seizoen_id, aflevering_id)
       VALUES (@pad, @bijschrift, @serie_id, @seizoen_id, @aflevering_id)`
    ).run({ pad: d.pad, bijschrift: d.bijschrift, ...niveauKolommen(d.niveau, d.niveau_id) });
    serieId = serieIdVoorNiveau(d.niveau, d.niveau_id);
  } catch (e) {
    return fail(e);
  }
  if (serieId) revalidatePath(`/series/${serieId}`);
  return OK;
}

export async function verwijderAfbeelding(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  const terug = String(fd.get("terug") || "/");
  db.prepare("DELETE FROM afbeeldingen WHERE id = ?").run(id);
  revalidatePath(terug);
  redirect(terug);
}
