import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { join, sep } from "path";
import { execSync } from "child_process";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const releaseDir = join(root, "release-cpanel");

function shouldSkipStandalonePath(src) {
  const normalized = src.split(sep).join("/");
  return (
    normalized.includes("/node_modules/") ||
    normalized.endsWith("/node_modules")
  );
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

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));
const productionPackage = {
  name: pkg.name,
  version: pkg.version,
  private: true,
  scripts: {
    start: "node server.js",
  },
  dependencies: pkg.dependencies,
  engines: {
    node: ">=20",
  },
};

writeFileSync(
  join(releaseDir, "package.json"),
  JSON.stringify(productionPackage, null, 2)
);

// Do NOT ship package-lock.json — Windows lock breaks Linux npm install on cPanel
writeFileSync(
  join(releaseDir, ".npmrc"),
  "omit=dev\nlegacy-peer-deps=true\nfund=false\naudit=false\n"
);

writeFileSync(
  join(releaseDir, "cpanel-npm-install.sh"),
  `#!/bin/bash
# Run in cPanel Terminal if "Run NPM Install" fails in the UI
set -e
cd "$(dirname "$0")"
echo "Installing production dependencies for Linux..."
npm install --omit=dev --no-audit --no-fund --legacy-peer-deps
echo "Done. Restart the Node.js app in cPanel."
`
);

writeFileSync(
  join(releaseDir, "README-UPLOAD.txt"),
  `Sabrina — CloudLinux / cPanel upload
====================================

IMPORTANT: Do NOT upload node_modules!
CloudLinux installs dependencies into nodevenv and creates a symlink.

Steps:
1. Upload all files to /iisshha.com (except node_modules)
2. cPanel → Setup Node.js App → Create
   - Application root: iisshha.com
   - Application URL: iisshha.com
   - Startup file: server.js
   - Node.js: 20+
3. Click "Run NPM Install" (creates node_modules symlink)
4. Add environment variables (see .env.example)
5. Restart app
6. Enable HTTPS for iisshha.com

If you see "node modules must be stored in .../nodevenv/...":
  That path is CORRECT — click Run NPM Install, do not upload node_modules.

Guide: deploy/CPANEL.md
`
);

console.log("\nDone!");
console.log(`Upload folder: ${releaseDir}`);
console.log("node_modules EXCLUDED — CloudLinux will install via Run NPM Install");
console.log("Zip and upload to cPanel → iisshha.com\n");
