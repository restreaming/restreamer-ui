import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { drizzle } from "drizzle-orm/better-sqlite3";

const databaseUrl = resolve(
  process.cwd(),
  process.env.DATABASE_URL ?? "./data/restreamer.db",
);
mkdirSync(dirname(databaseUrl), { recursive: true });

const sqlite = new Database(databaseUrl);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle({ client: sqlite });
export { sqlite };
