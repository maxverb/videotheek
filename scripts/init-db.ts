/**
 * Maakt het SQLite-bestand aan (indien nog niet aanwezig) en voert het schema
 * uit. Idempotent: meermaals draaien kan geen kwaad.
 *
 *   npm run db:init
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH =
  process.env.VIDEOTHEEK_DB ?? path.join(process.cwd(), "data", "videotheek.db");
const SCHEMA_PATH = path.join(process.cwd(), "db", "schema.sql");

function main() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
  const db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");
  db.exec(schema);
  db.close();

  console.log(`✓ Database klaar: ${DB_PATH}`);
  console.log("  (Voer 'npm run db:seed' uit voor twee voorbeeldseries.)");
}

main();
