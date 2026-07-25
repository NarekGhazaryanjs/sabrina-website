# Deploy on cPanel + CloudLinux — iisshha.com

Guide for **CloudLinux Node.js Selector** (Setup Node.js App in cPanel).

Domain: **iisshha.com** → folder **`/iisshha.com`**

---

## ⚠️ CloudLinux node_modules rule

CloudLinux shows a path like:

```
/home/USERNAME/nodevenv/iisshha.com/20/lib/node_modules
```

**This is normal.** It means:

- ❌ Do **NOT** upload `node_modules` from your PC
- ❌ Do **NOT** create a real `node_modules` folder manually
- ✅ Click **「Run NPM Install」** in Node.js Selector
- ✅ cPanel creates a **symlink** `iisshha.com/node_modules` → `nodevenv/.../lib/node_modules`

If upload included `node_modules`, **delete it** in File Manager, then Run NPM Install again.

---

## Step 1 — Build zip (on PC)

```bash
git clone https://github.com/NarekGhazaryanjs/sabrina-website.git
cd sabrina-website
npm install
npm run build:cpanel
```

Zip folder **`release-cpanel/`** → `sabrina.zip`

**Verify:** zip must NOT contain `node_modules/`

---

## Step 2 — Upload

1. cPanel → **Диспетчер файлов** (File Manager)
2. Open **`iisshha.com`**
3. Delete old files (including `node_modules` folder if exists)
4. Upload `sabrina.zip` → **Extract**
5. Files must be directly in your app folder (e.g. `iisshha-site`):
   - `server.js`
   - `package.json`
   - `.npmrc`
   - `.next/`
   - `public/`
   - `data/`

**Do NOT upload:** `node_modules/`, `package-lock.json`

---

## Step 3 — Node.js App

cPanel → **Setup Node.js App** → **Create Application**

| Setting | Value |
|---------|-------|
| Node.js version | **20** or **22** |
| Application mode | **Production** |
| Application root | `iisshha.com` |
| Application URL | `iisshha.com` |
| Application startup file | `server.js` |

Click **Create**.

---

## Step 4 — Install dependencies

1. Open your app in Node.js Selector
2. Click **「Run NPM Install」** / **「Запустить NPM Install」**
3. Wait until finished — `node_modules` becomes a **symlink** to nodevenv
4. Click **Restart** / **Start App**

---

## Step 5 — Environment variables

In Node.js App → **Environment variables**, add:

```
AUTH_SECRET=<random 32+ chars>
ADMIN_LOGIN=admin
ADMIN_PASSWORD=<strong password>
SITE_URL=https://iisshha.com
NODE_ENV=production
```

Generate secret on PC: `npm run generate-secret`

Click **Save** → **Restart**

---

## Step 6 — HTTPS

cPanel → **Domains** → `iisshha.com` → enable **Force HTTPS**

Or: **SSL/TLS Status** → Run AutoSSL

---

## Check

| Page | URL |
|------|-----|
| Home RU | https://iisshha.com/ru |
| Admin | https://iisshha.com/admin/login |
| Health | https://iisshha.com/api/health |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "node modules must be stored in nodevenv..." | Normal — Run NPM Install, don't upload node_modules |
| **Can't delete `node_modules` in File Manager** | See **「Can't delete node_modules」** below |
| `node_modules` is a folder, not symlink | Delete folder → Run NPM Install |
| 503 Service Unavailable | App not started → Start/Restart in Node.js Selector |
| 500 error | Missing AUTH_SECRET → add env vars → Restart |
| Module not found | Run NPM Install again, then Restart |
| Upload fails | chmod 755 on `public/uploads` |
| **NPM Install failed** | See **「NPM Install error」** below |

---

## NPM Install error

`An error occurred during installation of modules...`

Usually caused by **Windows `package-lock.json` or `node_modules` uploaded to Linux server**.

**Fix:**

1. Use a **clean folder** (e.g. `iisshha-site`) — do not reuse folder with old `node_modules`
2. Upload **new zip** from PC (`npm run build:cpanel`) — it has **no** `package-lock.json`, **no** `node_modules`
3. Node.js App → **Stop** → **Run NPM Install** → **Restart**

**If UI install still fails — use Terminal:**

```bash
source /home/wmflggzahnbx/nodevenv/iisshha-site/20/bin/activate
cd ~/iisshha-site
npm install --omit=dev --no-audit --no-fund --legacy-peer-deps
```

(Replace `iisshha-site` and `20` with your app folder and Node version from cPanel.)

Or run the included script:

```bash
cd ~/iisshha-site
bash cpanel-npm-install.sh
```

Then **Restart** app in Node.js Selector.

**If out of memory:** ask reg.am to temporarily raise memory limit, or upgrade hosting plan.

---

## Can't delete `node_modules`

CloudLinux often blocks deleting `node_modules` in File Manager because the Node.js app is running or it is a system symlink.

**Try in this order:**

### 1. Stop the app first
1. cPanel → **Setup Node.js App**
2. Open your app → click **Stop App** / **Остановить**
3. Wait 10 seconds
4. File Manager → `iisshha.com` → delete `node_modules` again

### 2. Delete via cPanel Terminal (best)
1. cPanel → **Terminal** (Терминал)
2. Run (replace `USER` with your cPanel username if needed):

```bash
cd ~/iisshha.com
ls -la node_modules
```

If it shows `node_modules -> .../nodevenv/...` (symlink) — remove only the link:

```bash
rm node_modules
```

If it is a real folder:

```bash
rm -rf node_modules
```

Then in Node.js Selector → **Run NPM Install** → **Restart**

### 3. Destroy and recreate the Node.js app
1. Setup Node.js App → your app → **Destroy** / **Удалить**
2. File Manager → delete everything in `iisshha.com` (or delete `node_modules` only)
3. Upload zip again (without node_modules)
4. Create Node.js app from scratch (Step 3 above)
5. Run NPM Install → Restart

### 4. If Terminal is not available
- cPanel → **File Manager** → Settings → enable **「Show Hidden Files」**
- Right-click `node_modules` → **Delete**
- Or select all **inside** `node_modules` first, delete contents, then delete empty folder

### 5. Still blocked?
Ask hosting support: *"Please remove `/home/USER/iisshha.com/node_modules` — I need CloudLinux to recreate it as a symlink after NPM Install."*

**Do NOT delete the `nodevenv` folder** — only `iisshha.com/node_modules`.

---

## SSH (optional)

Activate virtualenv (path shown in Node.js Selector UI):

```bash
source /home/USER/nodevenv/iisshha.com/20/bin/activate
cd ~/iisshha.com
npm install --omit=dev
```

Then Restart app in cPanel.

---

## Update site

1. `npm run build:cpanel` on PC
2. Upload new files (overwrite, **no node_modules**)
3. Node.js Selector → Restart

Content edits — via admin panel, no re-upload needed.
