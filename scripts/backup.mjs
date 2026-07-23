import { cpSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const root = process.cwd();
const stamp = new Date().toISOString().slice(0, 10);
const backupRoot = join(root, "backups", stamp);

const dirs = [
  { src: join(root, "data"), dest: join(backupRoot, "data") },
  { src: join(root, "public", "uploads"), dest: join(backupRoot, "uploads") },
];

mkdirSync(backupRoot, { recursive: true });

for (const { src, dest } of dirs) {
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
    console.log(`Backed up ${src} → ${dest}`);
  }
}

console.log(`\nBackup saved to backups/${stamp}/`);
