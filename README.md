# Sabrina — Official Website

Next.js 16 bilingual website (EN/RU) with admin panel for managing videos, photos, audio, news, pages, and contact messages.

**Stack:** Next.js · TypeScript · Tailwind CSS v4 · next-intl · JSON file storage

---

## Quick start (development)

```bash
npm install
cp .env.example .env.local
# Edit .env.local — set AUTH_SECRET, ADMIN_LOGIN, ADMIN_PASSWORD
npm run setup
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

---

## Production deploy

See **[DEPLOY.md](./DEPLOY.md)** — full guide for your friend (VPS, Docker, PM2, Nginx, SSL).

### Fastest path (Docker)

```bash
cp .env.example .env
# Fill in .env (see DEPLOY.md)
npm run generate-secret   # paste into AUTH_SECRET
docker compose up -d --build
```

Site runs on port **3000**. Data persists in Docker volumes.

### VPS without Docker

```bash
npm install
cp .env.example .env
npm run setup
npm run check-env
npm run build
npm run start
# Or with PM2: pm2 start ecosystem.config.cjs
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | JWT secret, min 32 chars. Generate: `npm run generate-secret` |
| `ADMIN_LOGIN` | Yes | Admin username |
| `ADMIN_PASSWORD` | Yes | Admin password (min 8 chars) |
| `SITE_URL` | Recommended | Public URL, e.g. `https://sabrina.com` (sitemap, OG tags) |
| `PORT` | No | Default `3000` |

---

## Admin panel

| Section | Path |
|---------|------|
| Dashboard | `/admin` |
| Videos / Photos / Audio / News | CRUD + file upload |
| Messages | Contact form submissions |
| Pages | Home, About, Contact, Donate (EN/RU) |
| Settings | Email + social links |

**Before going live:** change default password, add real content, update social links and donate info.

---

## Data & uploads

| Path | Contents |
|------|----------|
| `data/*.json` | All site content (not in git) |
| `public/uploads/` | Uploaded media files (not in git) |
| `seed/` | Default data copied on first `npm run setup` |

**Backup regularly:**
```bash
npm run backup
# Saves to backups/YYYY-MM-DD/
```

When moving to a new server, copy `data/` and `public/uploads/` to the new machine.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs setup first) |
| `npm run start` | Start production server |
| `npm run setup` | Create `data/` from `seed/` if missing |
| `npm run check-env` | Validate environment variables |
| `npm run generate-secret` | Generate AUTH_SECRET |
| `npm run backup` | Backup data + uploads |

---

## Hosting requirements

- **Node.js 20+** (22 recommended)
- **Persistent disk** — this app stores files locally (`data/`, `uploads/`)
- **Not suitable** for pure serverless (Vercel) without external storage migration
- **Recommended:** VPS (Hetzner, DigitalOcean, Timeweb…) or Docker with volumes

Minimum: **512 MB RAM**, **1 GB disk** (+ space for uploads)

---

## API endpoints

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/health` | No | Health check |
| `POST /api/contact` | No | Contact form (rate limited) |
| `POST /api/auth/login` | No | Admin login (rate limited) |
| `/api/admin/*` | Yes | Admin CRUD |

---

## Project structure

```
src/app/[locale]/     Public pages (EN/RU)
src/app/admin/        Admin panel
src/app/api/          API routes
src/components/       UI components
src/lib/data/         JSON storage layer
data/                 Runtime content (gitignored)
seed/                 Initial data template
public/uploads/       Uploaded files (gitignored)
scripts/              Setup, backup, env check
```

---

## License

Private project.
