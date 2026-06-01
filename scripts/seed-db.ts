/**
 * Vult de database met 1–2 voorbeeldseries zodat er meteen iets te zien is.
 * Seedt ALLEEN als de database nog leeg is (om je eigen data niet te wissen).
 * Forceer opnieuw seeden met:  npm run db:seed -- --force
 *
 *   npm run db:seed
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH =
  process.env.VIDEOTHEEK_DB ?? path.join(process.cwd(), "data", "videotheek.db");
const SCHEMA_PATH = path.join(process.cwd(), "db", "schema.sql");
const FORCE = process.argv.includes("--force");

function main() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");

  // Zorg dat het schema bestaat (handig als db:init nog niet liep).
  db.exec(fs.readFileSync(SCHEMA_PATH, "utf8"));

  const count = db.prepare("SELECT COUNT(*) AS n FROM series").get() as { n: number };
  if (count.n > 0 && !FORCE) {
    console.log("• Database bevat al series — seed overgeslagen.");
    console.log("  Gebruik 'npm run db:seed -- --force' om voorbeelddata opnieuw toe te voegen.");
    db.close();
    return;
  }

  if (FORCE) {
    // Alle tabellen leegmaken (FK-cascade ruimt de rest op).
    db.exec(`
      DELETE FROM afbeeldingen; DELETE FROM media_assets;
      DELETE FROM cast_credits; DELETE FROM crew_credits;
      DELETE FROM afleveringen; DELETE FROM seizoenen;
      DELETE FROM serie_genres; DELETE FROM genres; DELETE FROM personen;
      DELETE FROM series;
    `);
  }

  const seed = db.transaction(() => {
    // --- helpers -----------------------------------------------------------
    const insSerie = db.prepare(
      `INSERT INTO series (titel, jaar_start, jaar_eind, zender, synopsis, poster_pad, status, notities)
       VALUES (@titel, @jaar_start, @jaar_eind, @zender, @synopsis, @poster_pad, @status, @notities)`
    );
    const insSeizoen = db.prepare(
      `INSERT INTO seizoenen (serie_id, seizoen_nummer, titel, jaar, poster_pad)
       VALUES (@serie_id, @seizoen_nummer, @titel, @jaar, @poster_pad)`
    );
    const insAflev = db.prepare(
      `INSERT INTO afleveringen (seizoen_id, aflevering_nummer, titel, uitzenddatum, duur_minuten, synopsis, still_pad)
       VALUES (@seizoen_id, @aflevering_nummer, @titel, @uitzenddatum, @duur_minuten, @synopsis, @still_pad)`
    );
    const insPersoon = db.prepare(
      `INSERT INTO personen (naam, geboortejaar, foto_pad, bio, notities)
       VALUES (@naam, @geboortejaar, @foto_pad, @bio, @notities)`
    );
    const insGenre = db.prepare(`INSERT OR IGNORE INTO genres (naam) VALUES (?)`);
    const genreId = db.prepare(`SELECT id FROM genres WHERE naam = ?`);
    const linkGenre = db.prepare(
      `INSERT OR IGNORE INTO serie_genres (serie_id, genre_id) VALUES (?, ?)`
    );
    const insCast = db.prepare(
      `INSERT INTO cast_credits (persoon_id, personage_naam, cast_tier, serie_id, seizoen_id, aflevering_id)
       VALUES (@persoon_id, @personage_naam, @cast_tier, @serie_id, @seizoen_id, @aflevering_id)`
    );
    const insCrew = db.prepare(
      `INSERT INTO crew_credits (persoon_id, rol, serie_id, seizoen_id, aflevering_id)
       VALUES (@persoon_id, @rol, @serie_id, @seizoen_id, @aflevering_id)`
    );
    const insMedia = db.prepare(
      `INSERT INTO media_assets (type, bestandspad, label, resolutie, duur_seconden, codec, bestandsgrootte, serie_id, seizoen_id, aflevering_id)
       VALUES (@type, @bestandspad, @label, @resolutie, @duur_seconden, @codec, @bestandsgrootte, @serie_id, @seizoen_id, @aflevering_id)`
    );

    const genre = (naam: string): number => {
      insGenre.run(naam);
      return (genreId.get(naam) as { id: number }).id;
    };

    // --- personen ----------------------------------------------------------
    const joop = insPersoon.run({ naam: "Joop Verhoef", geboortejaar: 1955, foto_pad: null, bio: "Geliefd hoofdrolspeler uit de jaren '90.", notities: null }).lastInsertRowid as number;
    const marga = insPersoon.run({ naam: "Marga de Boer", geboortejaar: 1962, foto_pad: null, bio: "Bekend van vele dramaseries.", notities: null }).lastInsertRowid as number;
    const henk = insPersoon.run({ naam: "Henk Bakker", geboortejaar: 1948, foto_pad: null, bio: "Regisseur en scenarist.", notities: null }).lastInsertRowid as number;
    const sanne = insPersoon.run({ naam: "Sanne Willems", geboortejaar: 1980, foto_pad: null, bio: "Scenarioschrijver.", notities: null }).lastInsertRowid as number;
    const gastacteur = insPersoon.run({ naam: "Theo van Dijk", geboortejaar: 1970, foto_pad: null, bio: "Karakteracteur, vaak in gastrollen.", notities: null }).lastInsertRowid as number;

    // ======================================================================
    // SERIE 1 — Het Pension (DVD-box, afgelopen)
    // ======================================================================
    const serie1 = insSerie.run({
      titel: "Het Pension",
      jaar_start: 1992,
      jaar_eind: 1996,
      zender: "VARA",
      synopsis: "Komische dramaserie over een familie die een pension runt aan de Hollandse kust.",
      poster_pad: null,
      status: "afgelopen",
      notities: "Complete DVD-box, 4 seizoenen.",
    }).lastInsertRowid as number;

    for (const g of ["Komedie", "Drama", "Familie"]) linkGenre.run(serie1, genre(g));

    // Vaste hoofdcast op SERIENIVEAU
    insCast.run({ persoon_id: joop, personage_naam: "Cor de Wit", cast_tier: "main", serie_id: serie1, seizoen_id: null, aflevering_id: null });
    insCast.run({ persoon_id: marga, personage_naam: "Annie de Wit", cast_tier: "main", serie_id: serie1, seizoen_id: null, aflevering_id: null });
    // Crew op serieniveau
    insCrew.run({ persoon_id: henk, rol: "regisseur", serie_id: serie1, seizoen_id: null, aflevering_id: null });
    // Media op serieniveau
    insMedia.run({ type: "iso", bestandspad: "D:\\Series\\Het Pension\\HetPension_S01.iso", label: "DVD-box seizoen 1 (ISO)", resolutie: "720x576", duur_seconden: null, codec: "MPEG-2", bestandsgrootte: 4700000000, serie_id: serie1, seizoen_id: null, aflevering_id: null });

    const s1s1 = insSeizoen.run({ serie_id: serie1, seizoen_nummer: 1, titel: null, jaar: 1992, poster_pad: null }).lastInsertRowid as number;
    const s1s2 = insSeizoen.run({ serie_id: serie1, seizoen_nummer: 2, titel: null, jaar: 1993, poster_pad: null }).lastInsertRowid as number;

    const s1s1a1 = insAflev.run({ seizoen_id: s1s1, aflevering_nummer: 1, titel: "De nieuwe gasten", uitzenddatum: "1992-09-07", duur_minuten: 48, synopsis: "Het pension opent en de eerste gasten arriveren.", still_pad: null }).lastInsertRowid as number;
    const s1s1a2 = insAflev.run({ seizoen_id: s1s1, aflevering_nummer: 2, titel: "Hoogseizoen", uitzenddatum: "1992-09-14", duur_minuten: 47, synopsis: "Het is druk en chaos in het pension.", still_pad: null }).lastInsertRowid as number;
    insAflev.run({ seizoen_id: s1s2, aflevering_nummer: 1, titel: "Een nieuw begin", uitzenddatum: "1993-09-06", duur_minuten: 49, synopsis: "Een nieuw seizoen, nieuwe perikelen.", still_pad: null });

    // Eenmalige GASTROL op AFLEVERINGSNIVEAU
    insCast.run({ persoon_id: gastacteur, personage_naam: "Inspecteur Jansen", cast_tier: "one-off", serie_id: null, seizoen_id: null, aflevering_id: s1s1a2 });
    // Scenarioschrijver op AFLEVERINGSNIVEAU
    insCrew.run({ persoon_id: sanne, rol: "scenario", serie_id: null, seizoen_id: null, aflevering_id: s1s1a2 });
    insCrew.run({ persoon_id: sanne, rol: "schrijver", serie_id: null, seizoen_id: null, aflevering_id: s1s1a1 });

    // mp4 op afleveringsniveau
    insMedia.run({ type: "mp4", bestandspad: "D:\\Series\\Het Pension\\S01E01.mp4", label: "S01E01 (rip)", resolutie: "720x576", duur_seconden: 2880, codec: "h264", bestandsgrootte: 850000000, serie_id: null, seizoen_id: null, aflevering_id: s1s1a1 });
    insMedia.run({ type: "upscale", bestandspad: "D:\\Series\\Het Pension\\S01E01_4k.mp4", label: "S01E01 (upscaled 4K)", resolutie: "3840x2160", duur_seconden: 2880, codec: "hevc", bestandsgrootte: 5200000000, serie_id: null, seizoen_id: null, aflevering_id: s1s1a1 });

    // ======================================================================
    // SERIE 2 — Stad aan Zee (downloads, lopend)
    // ======================================================================
    const serie2 = insSerie.run({
      titel: "Stad aan Zee",
      jaar_start: 2019,
      jaar_eind: null,
      zender: "NPO 1",
      synopsis: "Politiedrama in een fictieve havenstad.",
      poster_pad: null,
      status: "lopend",
      notities: "Downloads, losse mp4's per aflevering.",
    }).lastInsertRowid as number;

    for (const g of ["Misdaad", "Drama"]) linkGenre.run(serie2, genre(g));

    insCast.run({ persoon_id: marga, personage_naam: "Hoofdinspecteur Vos", cast_tier: "main", serie_id: serie2, seizoen_id: null, aflevering_id: null });
    insCast.run({ persoon_id: gastacteur, personage_naam: "Rechercheur Smit", cast_tier: "side", serie_id: serie2, seizoen_id: null, aflevering_id: null });
    insCrew.run({ persoon_id: henk, rol: "producent", serie_id: serie2, seizoen_id: null, aflevering_id: null });

    const s2s1 = insSeizoen.run({ serie_id: serie2, seizoen_nummer: 1, titel: "De zaak Halberstad", jaar: 2019, poster_pad: null }).lastInsertRowid as number;
    const s2s1a1 = insAflev.run({ seizoen_id: s2s1, aflevering_nummer: 1, titel: "Aangespoeld", uitzenddatum: "2019-01-10", duur_minuten: 52, synopsis: "Een lichaam spoelt aan in de haven.", still_pad: null }).lastInsertRowid as number;
    insCrew.run({ persoon_id: sanne, rol: "scenario", serie_id: null, seizoen_id: s2s1, aflevering_id: null });
    insMedia.run({ type: "mp4", bestandspad: "/Users/ik/Series/StadAanZee/S01E01.mp4", label: "S01E01", resolutie: "1920x1080", duur_seconden: 3120, codec: "h264", bestandsgrootte: 1400000000, serie_id: null, seizoen_id: null, aflevering_id: s2s1a1 });
    insMedia.run({ type: "snippet", bestandspad: "/Users/ik/Series/StadAanZee/teaser.mp4", label: "Teaser", resolutie: "1920x1080", duur_seconden: 45, codec: "h264", bestandsgrootte: 18000000, serie_id: serie2, seizoen_id: null, aflevering_id: null });
  });

  seed();
  db.close();
  console.log("✓ Voorbeelddata toegevoegd: 'Het Pension' en 'Stad aan Zee'.");
}

main();
