import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const supabaseDir = fileURLToPath(new URL("../supabase", import.meta.url));
const migrations = readdirSync(join(supabaseDir, "migrations"))
  .filter((name) => name.endsWith(".sql"))
  .sort();

const parts = [
  ...migrations.map((name) => readFileSync(join(supabaseDir, "migrations", name), "utf8")),
  readFileSync(join(supabaseDir, "seed.sql"), "utf8"),
];

writeFileSync(join(supabaseDir, "setup.sql"), parts.join("\n"));
console.log(`setup.sql written from ${migrations.length} migration(s) + seed.sql`);
