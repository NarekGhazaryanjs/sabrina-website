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
5. Files must be directly in `/iisshha.com`:
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - `.next/`
   - `public/`
   - `data/`

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
| `node_modules` is a folder, not symlink | Delete folder → Run NPM Install |
| 503 Service Unavailable | App not started → Start/Restart in Node.js Selector |
| 500 error | Missing AUTH_SECRET → add env vars → Restart |
| Module not found | Run NPM Install again, then Restart |
| Upload fails | chmod 755 on `public/uploads` |

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
