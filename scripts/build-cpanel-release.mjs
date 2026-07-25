import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const releaseDir = join(root, "release-cpanel");

console.log("Building production bundle...");
execSync("npm run build", { stdio: "inherit", cwd: root });

if (!existsSync(join(standaloneDir, "server.js"))) {
  console.error("Standalone build not found. Check next.config.ts output setting.");
  process.exit(1);
}

console.log("Preparing cPanel release folder...");
rmSync(releaseDir, { recursive: true, force: true });
mkdirSync(releaseDir, { recursive: true });

cpSync(standaloneDir, releaseDir, { recursive: true });
cpSync(join(root, ".next", "static"), join(releaseDir, ".next", "static"), {
  recursive: true,
});
cpSync(join(root, "public"), join(releaseDir, "public"), { recursive: true });
cpSync(join(root, "data"), join(releaseDir, "data"), { recursive: true });
cpSync(join(root, ".env.example"), join(releaseDir, ".env.example"));

writeFileSync(
  join(releaseDir, "README-UPLOAD.txt"),
  `Sabrina website — cPanel upload package
=====================================

Upload ALL files from this folder into: /iisshha.com

Startup file for Node.js app: server.js

Required env vars (cPanel → Node.js → Environment):
  AUTH_SECRET=<random 32+ chars>
  ADMIN_LOGIN=admin
  ADMIN_PASSWORD=<strong password>
  SITE_URL=https://iisshha.com
  NODE_ENV=production

Full guide: deploy/CPANEL.md
`
);

console.log("\nDone!");
console.log(`Upload folder: ${releaseDir}`);
console.log("Zip it and upload to cPanel → iisshha.com → File Manager");
console.log("Then follow deploy/CPANEL.md\n");
