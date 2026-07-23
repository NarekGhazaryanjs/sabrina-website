import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(join(process.cwd(), ".env"));
loadEnvFile(join(process.cwd(), ".env.local"));
loadEnvFile(join(process.cwd(), ".env.production"));

const required = ["AUTH_SECRET", "ADMIN_LOGIN", "ADMIN_PASSWORD"];
const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error("\nMissing required environment variables:");
  for (const key of missing) console.error(`  - ${key}`);
  console.error("\nCopy .env.example to .env and fill in the values.\n");
  process.exit(1);
}

const weakSecrets = ["your-secret-key", "change-me", "secret", "admin123"];
const secret = process.env.AUTH_SECRET.trim();
const password = process.env.ADMIN_PASSWORD.trim();

if (weakSecrets.includes(secret.toLowerCase()) || secret.length < 32) {
  console.warn(
    "Warning: AUTH_SECRET should be at least 32 random characters."
  );
  console.warn(`  Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`);
}

if (password === "admin123" || password.length < 8) {
  console.warn("Warning: ADMIN_PASSWORD is weak. Use at least 8 characters.");
}

if (process.argv.includes("--generate-secret")) {
  console.log(randomBytes(32).toString("hex"));
}

console.log("Environment OK.");
