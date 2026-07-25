import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { randomBytes } from "crypto";
import { join, sep } from "path";
import { execSync } from "child_process";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const releaseDir = join(root, "release-cpanel");

const CPANEL_SERVER = String.raw`const fs = require("fs");
const path = require("path");

function loadEnvFile(fileName) {
  const envPath = path.join(__dirname, fileName);
  if (!fs.existsSync(envPath)) return false;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
  return true;
}

function logError(label, error) {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.stack || error.message
        : String(error);
  const line = "[" + new Date().toISOString() + "] " + label + "\n" + message + "\n\n";
  try {
    fs.appendFileSync(path.join(__dirname, "startup-error.log"), line);
  } catch (_) {}
  console.error(line);
}

function ensureWritableDirs() {
  for (const dir of [
    "data",
    "public/uploads/videos",
    "public/uploads/photos",
    "public/uploads/audio",
    "public/uploads/news",
  ]) {
    fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
  }
}

const loadedEnv =
  loadEnvFile("cpanel.env") || loadEnvFile(".env") || loadEnvFile("production.env");

ensureWritableDirs();

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
if (!process.env.HOSTNAME) process.env.HOSTNAME = "127.0.0.1";

if (!process.env.AUTH_SECRET) {
  logError(
    "CONFIG",
    "AUTH_SECRET is missing. Upload cpanel.env or add env vars in cPanel Node.js App."
  );
}

if (!loadedEnv) {
  logError("CONFIG", "No cpanel.env file found. cPanel often skips hidden .env files.");
}

process.on("uncaughtException", (err) => logError("uncaughtException", err));
process.on("unhandledRejection", (err) => logError("unhandledRejection", err));

try {
  require("./app-server.js");
} catch (error) {
  logError("STARTUP", error);
  process.exit(1);
}
`;

function shouldSkipStandalonePath(src) {
  const normalized = src.split(sep).join("/");
  return (
    normalized.includes("/node_modules/") ||
    normalized.endsWith("/node_modules")
  );
}

function patchAppServer(serverPath) {
  let code = readFileSync(serverPath, "utf8");
  code = code.replace(
    /"outputFileTracingRoot":"(?:\\.|[^"\\])*"/g,
    '"outputFileTracingRoot":"."'
  );
  code = code.replace(
    /"turbopack":\{"resolveAlias":\{[^}]+\},"root":"(?:\\.|[^"\\])*"/g,
    (match) => match.replace(/"root":"(?:\\.|[^"\\])*"/, '"root":"."')
  );
  writeFileSync(serverPath, code);
}

console.log("Building production bundle...");
execSync("npm run build", { stdio: "inherit", cwd: root });

if (!existsSync(join(standaloneDir, "server.js"))) {
  console.error("Standalone build not found. Check next.config.ts output setting.");
  process.exit(1);
}

console.log("Preparing CloudLinux-compatible cPanel release...");
rmSync(releaseDir, { recursive: true, force: true });
mkdirSync(releaseDir, { recursive: true });

cpSync(standaloneDir, releaseDir, {
  recursive: true,
  filter: (src) => !shouldSkipStandalonePath(src),
});
cpSync(join(root, ".next", "static"), join(releaseDir, ".next", "static"), {
  recursive: true,
});
cpSync(join(root, "public"), join(releaseDir, "public"), { recursive: true });
cpSync(join(root, "data"), join(releaseDir, "data"), { recursive: true });
cpSync(join(root, ".env.example"), join(releaseDir, ".env.example"));

const appServerPath = join(releaseDir, "app-server.js");
rmSync(join(releaseDir, "server.js"));
cpSync(join(standaloneDir, "server.js"), appServerPath);
patchAppServer(appServerPath);
writeFileSync(join(releaseDir, "server.js"), CPANEL_SERVER);

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));
writeFileSync(
  join(releaseDir, "package.json"),
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      private: true,
      scripts: { start: "node server.js" },
      dependencies: pkg.dependencies,
      engines: { node: ">=20" },
    },
    null,
    2
  )
);

writeFileSync(
  join(releaseDir, ".npmrc"),
  "omit=dev\nlegacy-peer-deps=true\nfund=false\naudit=false\n"
);

const authSecret = randomBytes(32).toString("hex");
const adminPassword = randomBytes(12).toString("base64url");

const envContent = `# Sabrina — production settings
AUTH_SECRET=${authSecret}
ADMIN_LOGIN=admin
ADMIN_PASSWORD=${adminPassword}
SITE_URL=https://iisshha.com
NODE_ENV=production
HOSTNAME=127.0.0.1
`;

writeFileSync(join(releaseDir, "cpanel.env"), envContent);
writeFileSync(join(releaseDir, ".env"), envContent);

writeFileSync(
  join(releaseDir, "ADMIN-PAROL.txt"),
  `# Admin login — keep private!
# URL: https://iisshha.com/admin/login

Login: admin
Password: ${adminPassword}

(Settings are in cpanel.env — cPanel sees this file, not .env)
`
);

writeFileSync(
  join(releaseDir, "README-UPLOAD.txt"),
  `Sabrina — cPanel upload
=======================

1. Upload ALL files to iisshha-site (NOT node_modules!)
2. IMPORTANT: cpanel.env must be present (visible file, not hidden)
3. Check ADMIN-PAROL.txt for admin password
4. cPanel → Node.js App:
   - root: iisshha-site
   - URL: iisshha.com
   - startup: server.js
5. Run NPM Install → Restart
6. Test: https://iisshha.com/api/health

If 500 error: open startup-error.log in File Manager
Also add env vars in cPanel Node.js App (backup)
`
);

console.log("\nDone!");
console.log(`Upload folder: ${releaseDir}`);
console.log("Files: cpanel.env + ADMIN-PAROL.txt + server.js\n");
