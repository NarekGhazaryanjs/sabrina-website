# Deploy on cPanel — iisshha.com

Guide for shared hosting with cPanel (like your screenshot: domain `iisshha.com`, folder `/iisshha.com`).

> **Important:** cPanel must have **「Setup Node.js App」** (Приложение Node.js).  
> If you don't see it — this hosting cannot run Next.js. Use VPS + `deploy/install.sh` instead.

---

## Step 1 — Build upload package (on your PC)

Someone with the project runs once:

```bash
git clone https://github.com/NarekGhazaryanjs/sabrina-website.git
cd sabrina-website
npm install
npm run build:cpanel
```

This creates folder **`release-cpanel/`** — zip it → `sabrina.zip`.

---

## Step 2 — Upload to cPanel

1. Login to cPanel
2. **Диспетчер файлов** (File Manager)
3. Open folder **`iisshha.com`**
4. Delete old files inside (if any test site)
5. Upload **`sabrina.zip`**
6. Extract zip → all files must be directly in `/iisshha.com`:
   - `server.js`
   - `.next/`
   - `node_modules/`
   - `public/`
   - `data/`

---

## Step 3 — Create Node.js app

1. cPanel → **Setup Node.js App** / **Приложение Node.js**
2. Click **Create Application** / **Создать приложение**
3. Settings:

| Field | Value |
|-------|-------|
| Node.js version | **20** or **22** (latest available) |
| Application mode | **Production** |
| Application root | `iisshha.com` |
| Application URL | `iisshha.com` |
| Application startup file | `server.js` |

4. **Environment variables** — add:

```
AUTH_SECRET=<generate: npm run generate-secret>
ADMIN_LOGIN=admin
ADMIN_PASSWORD=<strong password>
SITE_URL=https://iisshha.com
NODE_ENV=production
```

5. Click **Create** → then **Run NPM Install** (if button exists) → **Restart**

---

## Step 4 — HTTPS

In cPanel → **Domains** → `iisshha.com`:

- Enable **Force HTTPS redirect** (Принудительное перенаправление на HTTPS)
- Or use **SSL/TLS Status** → AutoSSL for free certificate

---

## Step 5 — Check

| Page | URL |
|------|-----|
| Home (RU) | https://iisshha.com/ru |
| Home (EN) | https://iisshha.com/en |
| Admin | https://iisshha.com/admin/login |
| Health | https://iisshha.com/api/health |

---

## Update site later

1. Run `npm run build:cpanel` on PC again
2. Upload new `release-cpanel/` contents to `/iisshha.com` (overwrite)
3. cPanel → Node.js App → **Restart**

Content changes (videos, photos, text) — via **admin panel**, no re-upload needed.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 503 / blank page | Node.js app not running → Restart in cPanel |
| 500 error | Check env vars (AUTH_SECRET required) |
| Uploads fail | Folder `public/uploads` must be writable (755/775) |
| No Node.js in cPanel | Hosting doesn't support Node — use VPS |

---

## SSH shortcut (if Terminal available in cPanel)

```bash
cd ~/iisshha.com
git clone https://github.com/NarekGhazaryanjs/sabrina-website.git tmp
cd tmp && npm install && npm run build:cpanel
cp -r release-cpanel/* ~/iisshha.com/
# then configure Node.js app in cPanel UI
```
