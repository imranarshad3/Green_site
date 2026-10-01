import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const serverDir = fileURLToPath(new URL("..", import.meta.url));
const imagesDir = join(serverDir, "supabase/storage/product-images");
const BUCKET = "product-images";
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

const env = Object.fromEntries(
  readFileSync(join(serverDir, ".env"), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    })
);

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env first.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const { error: bucketError } = await supabase.storage.getBucket(BUCKET);

if (bucketError) {
  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "10MB",
    allowedMimeTypes: Object.values(MIME),
  });

  if (createError) {
    console.error(`Could not create bucket "${BUCKET}": ${createError.message}`);
    process.exit(1);
  }

  console.log(`Created public bucket "${BUCKET}".`);
}

let failed = 0;

for (const file of walk(imagesDir)) {
  const key = relative(imagesDir, file).split("\\").join("/");
  const { error } = await supabase.storage.from(BUCKET).upload(key, readFileSync(file), {
    contentType: MIME[extname(file).toLowerCase()] ?? "application/octet-stream",
    upsert: true,
  });

  if (error) {
    failed += 1;
    console.error(`✗ ${key}: ${error.message}`);
  } else {
    console.log(`✓ ${key}`);
  }
}

if (failed > 0) {
  console.error(`${failed} upload(s) failed.`);
  process.exit(1);
}

console.log("All product images uploaded.");
