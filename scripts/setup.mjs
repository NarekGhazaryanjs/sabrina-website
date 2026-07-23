import { cpSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const root = process.cwd();
const dataDir = join(root, "data");
const seedDir = join(root, "seed");
const uploadsDir = join(root, "public", "uploads");
const uploadFolders = ["videos", "photos", "audio", "news"];

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function seedData() {
  if (!existsSync(seedDir)) {
    console.error("seed/ folder not found");
    process.exit(1);
  }

  ensureDir(dataDir);

  const seedFiles = readdirSync(seedDir).filter((f) => f.endsWith(".json"));
  let created = 0;

  for (const file of seedFiles) {
    const dest = join(dataDir, file);
    if (!existsSync(dest)) {
      cpSync(join(seedDir, file), dest);
      console.log(`  + data/${file}`);
      created++;
    }
  }

  ensureDir(uploadsDir);
  for (const folder of uploadFolders) {
    ensureDir(join(uploadsDir, folder));
  }

  console.log(
    created > 0
      ? `Setup: created ${created} data file(s).`
      : "Setup: data/ already exists, nothing to seed."
  );
}

seedData();
