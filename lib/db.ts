import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// Eén SQLite-bestand bevat de hele verzameling. Pad is overschrijfbaar met de
// env-var VIDEOTHEEK_DB, anders staat het in ./data/videotheek.db.
export const DB_PATH =
  process.env.VIDEOTHEEK_DB ?? path.join(process.cwd(), "data", "videotheek.db");

// In dev herlaadt Next.js modules vaak; we cachen de connectie op globalThis
// zodat we niet bij elke hot-reload een nieuwe verbinding openen.
declare global {
  // eslint-disable-next-line no-var
  var __videotheekDb: Database.Database | undefined;
}

function openDb(): Database.Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL"); // betere concurrency, robuuster
  db.pragma("foreign_keys = ON"); // FK's afdwingen (staat per-connectie uit)
  return db;
}

export const db: Database.Database = globalThis.__videotheekDb ?? openDb();
if (process.env.NODE_ENV !== "production") {
  globalThis.__videotheekDb = db;
}
