-- De Videotheek — SQLite-schema
-- Wordt uitgevoerd door scripts/init-db.ts. Alles is idempotent (IF NOT EXISTS),
-- dus dit script meermaals draaien kan geen kwaad.

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Kern-hiërarchie: series > seizoenen > afleveringen
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS series (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  titel         TEXT    NOT NULL,
  jaar_start    INTEGER,
  jaar_eind     INTEGER,
  zender        TEXT,                                  -- omroep/zender, bv. 'VARA', 'NPO 3'
  synopsis      TEXT,
  poster_pad    TEXT,
  status        TEXT    NOT NULL DEFAULT 'afgelopen'
                  CHECK (status IN ('lopend', 'afgelopen')),
  notities      TEXT,
  aangemaakt_op TEXT    NOT NULL DEFAULT (datetime('now')),
  gewijzigd_op  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS seizoenen (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  serie_id        INTEGER NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  seizoen_nummer  INTEGER NOT NULL,
  titel           TEXT,
  jaar            INTEGER,
  poster_pad      TEXT,
  UNIQUE (serie_id, seizoen_nummer)
);

CREATE TABLE IF NOT EXISTS afleveringen (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  seizoen_id         INTEGER NOT NULL REFERENCES seizoenen(id) ON DELETE CASCADE,
  aflevering_nummer  INTEGER NOT NULL,
  titel              TEXT,
  uitzenddatum       TEXT,                             -- ISO 'YYYY-MM-DD'
  duur_minuten       INTEGER,
  synopsis           TEXT,
  still_pad          TEXT,
  UNIQUE (seizoen_id, aflevering_nummer)
);

-- ---------------------------------------------------------------------------
-- Genres (echt relationeel via een koppeltabel)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS genres (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  naam  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS serie_genres (
  serie_id  INTEGER NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  genre_id  INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (serie_id, genre_id)
);

-- ---------------------------------------------------------------------------
-- Personen & credits (het flexibele hart)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS personen (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  naam         TEXT    NOT NULL,
  geboortejaar INTEGER,
  foto_pad     TEXT,
  bio          TEXT,
  notities     TEXT
);

-- cast: persoon speelt een personage. Het 'niveau' bepaalt of het een vaste
-- serierol is, een seizoensrol, of een eenmalige rol in één aflevering.
-- Precies één van serie_id/seizoen_id/aflevering_id is gevuld (CHECK).
CREATE TABLE IF NOT EXISTS cast_credits (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  persoon_id     INTEGER NOT NULL REFERENCES personen(id) ON DELETE CASCADE,
  personage_naam TEXT,
  cast_tier      TEXT NOT NULL
                   CHECK (cast_tier IN ('main', 'side', 'one-off', 'gast')),
  serie_id       INTEGER REFERENCES series(id)       ON DELETE CASCADE,
  seizoen_id     INTEGER REFERENCES seizoenen(id)    ON DELETE CASCADE,
  aflevering_id  INTEGER REFERENCES afleveringen(id) ON DELETE CASCADE,
  CHECK ((serie_id IS NOT NULL) + (seizoen_id IS NOT NULL) + (aflevering_id IS NOT NULL) = 1)
);

-- crew: persoon vervult een functie (schrijver, regisseur, ...). Zelfde
-- niveau-aanpak; scenarioschrijvers zitten vaak op afleveringsniveau.
CREATE TABLE IF NOT EXISTS crew_credits (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  persoon_id     INTEGER NOT NULL REFERENCES personen(id) ON DELETE CASCADE,
  rol            TEXT NOT NULL
                   CHECK (rol IN ('schrijver', 'scenario', 'regisseur', 'producent', 'montage', 'muziek', 'overig')),
  serie_id       INTEGER REFERENCES series(id)       ON DELETE CASCADE,
  seizoen_id     INTEGER REFERENCES seizoenen(id)    ON DELETE CASCADE,
  aflevering_id  INTEGER REFERENCES afleveringen(id) ON DELETE CASCADE,
  CHECK ((serie_id IS NOT NULL) + (seizoen_id IS NOT NULL) + (aflevering_id IS NOT NULL) = 1)
);

-- ---------------------------------------------------------------------------
-- Media (breed: koppelbaar op serie-, seizoen- of afleveringsniveau)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS media_assets (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  type            TEXT NOT NULL
                    CHECK (type IN ('iso', 'mp4', 'upscale', 'snippet', 'extra')),
  bestandspad     TEXT NOT NULL,                       -- absoluut pad op schijf
  label           TEXT,
  resolutie       TEXT,                                -- bv. '1920x1080'
  duur_seconden   INTEGER,
  codec           TEXT,
  bestandsgrootte INTEGER,                             -- in bytes
  serie_id        INTEGER REFERENCES series(id)       ON DELETE CASCADE,
  seizoen_id      INTEGER REFERENCES seizoenen(id)    ON DELETE CASCADE,
  aflevering_id   INTEGER REFERENCES afleveringen(id) ON DELETE CASCADE,
  CHECK ((serie_id IS NOT NULL) + (seizoen_id IS NOT NULL) + (aflevering_id IS NOT NULL) = 1)
);

-- Optionele galerij, náást de losse poster_pad/still_pad/foto_pad-velden.
CREATE TABLE IF NOT EXISTS afbeeldingen (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  pad           TEXT NOT NULL,
  bijschrift    TEXT,
  serie_id      INTEGER REFERENCES series(id)       ON DELETE CASCADE,
  seizoen_id    INTEGER REFERENCES seizoenen(id)    ON DELETE CASCADE,
  aflevering_id INTEGER REFERENCES afleveringen(id) ON DELETE CASCADE,
  CHECK ((serie_id IS NOT NULL) + (seizoen_id IS NOT NULL) + (aflevering_id IS NOT NULL) = 1)
);

-- ---------------------------------------------------------------------------
-- Indexes op alle FK-kolommen (+ veelgebruikte filterkolommen)
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_seizoenen_serie      ON seizoenen(serie_id);
CREATE INDEX IF NOT EXISTS idx_afleveringen_seizoen ON afleveringen(seizoen_id);
CREATE INDEX IF NOT EXISTS idx_serie_genres_serie   ON serie_genres(serie_id);
CREATE INDEX IF NOT EXISTS idx_serie_genres_genre   ON serie_genres(genre_id);

CREATE INDEX IF NOT EXISTS idx_cast_persoon ON cast_credits(persoon_id);
CREATE INDEX IF NOT EXISTS idx_cast_serie   ON cast_credits(serie_id);
CREATE INDEX IF NOT EXISTS idx_cast_seizoen ON cast_credits(seizoen_id);
CREATE INDEX IF NOT EXISTS idx_cast_aflev   ON cast_credits(aflevering_id);
CREATE INDEX IF NOT EXISTS idx_cast_tier    ON cast_credits(cast_tier);

CREATE INDEX IF NOT EXISTS idx_crew_persoon ON crew_credits(persoon_id);
CREATE INDEX IF NOT EXISTS idx_crew_serie   ON crew_credits(serie_id);
CREATE INDEX IF NOT EXISTS idx_crew_seizoen ON crew_credits(seizoen_id);
CREATE INDEX IF NOT EXISTS idx_crew_aflev   ON crew_credits(aflevering_id);
CREATE INDEX IF NOT EXISTS idx_crew_rol     ON crew_credits(rol);

CREATE INDEX IF NOT EXISTS idx_media_serie   ON media_assets(serie_id);
CREATE INDEX IF NOT EXISTS idx_media_seizoen ON media_assets(seizoen_id);
CREATE INDEX IF NOT EXISTS idx_media_aflev   ON media_assets(aflevering_id);
CREATE INDEX IF NOT EXISTS idx_media_type    ON media_assets(type);

CREATE INDEX IF NOT EXISTS idx_afb_serie   ON afbeeldingen(serie_id);
CREATE INDEX IF NOT EXISTS idx_afb_seizoen ON afbeeldingen(seizoen_id);
CREATE INDEX IF NOT EXISTS idx_afb_aflev   ON afbeeldingen(aflevering_id);
