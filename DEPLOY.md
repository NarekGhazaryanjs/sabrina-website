# Deploy Guide — Sabrina Website

Step-by-step guide for deploying to a server. Works on any Linux VPS or Docker host.

---

## Before deploy checklist

- [ ] Domain purchased (optional but recommended)
- [ ] Server with Ubuntu 22.04+ or similar
- [ ] SSH access to server
- [ ] Node.js 20+ **or** Docker installed

---

## Step 1 — Prepare environment file

On your computer or server:

```bash
cp .env.example .env
```

Edit `.env`:

```env
AUTH_SECRET=<run: npm run generate-secret>
ADMIN_LOGIN=your_admin_name
ADMIN_PASSWORD=your_strong_password_here
SITE_URL=https://yourdomain.com
```

**Important:** Never use default `admin123` or short secrets in production.

---

## Step 2 — Choose deploy method

### Option A: Docker (recommended, easiest)

Requirements: Docker + Docker Compose

```bash
# Upload project to server (git clone or scp)
git clone <repo-url> sabrina && cd sabrina

# Create .env (see Step 1)
cp .env.example .env
nano .env

# Build and run
docker compose up -d --build

# Check logs
docker compose logs -f web
```

Site available at `http://SERVER_IP:3000`

Data is stored in Docker volumes (`sabrina-data`, `sabrina-uploads`) — survives container restarts.

**Update after code changes:**
```bash
git pull
docker compose up -d --build
```

---

### Option B: VPS with Node.js + PM2

Requirements: Node.js 22, npm, PM2 (`npm i -g pm2`)

```bash
git clone <repo-url> sabrina && cd sabrina

cp .env.example .env
nano .env

npm install
npm run setup      # creates data/ from seed/
npm run check-env
npm run build

# Start with PM2 (auto-restart on reboot)
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup        # follow the printed command
```

---

## Step 3 — Nginx reverse proxy + HTTPS

Install Nginx and Certbot:

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

Copy and edit config:

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/sabrina
sudo nano /etc/nginx/sites-available/sabrina
# Replace yourdomain.com with real domain

sudo ln -s /etc/nginx/sites-available/sabrina /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Get free SSL certificate:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot auto-renews. Site now at `https://yourdomain.com`.

---

## Step 4 — DNS

Point domain to server IP:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_SERVER_IP |
| A | www | YOUR_SERVER_IP |

Wait 5–30 minutes for propagation.

---

## Step 5 — Migrate existing content

If you already have content on your local machine:

```bash
# From local machine — copy to server
scp -r data/ user@SERVER:/path/to/sabrina/
scp -r public/uploads/ user@SERVER:/path/to/sabrina/public/
```

For Docker:
```bash
# Copy into running container volume, or mount host paths in docker-compose.yml
```

---

## Step 6 — Verify after deploy

| Check | URL |
|-------|-----|
| Home page | `https://yourdomain.com/en` |
| Russian | `https://yourdomain.com/ru` |
| Admin login | `https://yourdomain.com/admin/login` |
| Health | `https://yourdomain.com/api/health` |

Test:
1. Login to admin
2. Upload a photo
3. Submit contact form
4. Check message appears in Admin → Messages

---

## Backup

Run weekly on server:

```bash
cd /path/to/sabrina
npm run backup
```

Or cron:
```cron
0 3 * * 0 cd /path/to/sabrina && npm run backup
```

Backup includes `data/` and `public/uploads/`.

---

## Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Do **not** expose port 3000 publicly if using Nginx — only 80/443 needed.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `AUTH_SECRET is not set` | Create `.env` with all required vars |
| Admin login fails | Check ADMIN_LOGIN/PASSWORD in `.env`, restart app |
| Upload fails | Check disk space, `client_max_body_size` in nginx (100M in example) |
| Empty site after deploy | Run `npm run setup`, or copy `data/` folder |
| 502 Bad Gateway | App not running — check `pm2 status` or `docker compose ps` |

---

## Server specs (minimum)

| Resource | Minimum |
|----------|---------|
| RAM | 512 MB |
| CPU | 1 vCPU |
| Disk | 5 GB (+ uploads) |
| OS | Ubuntu 22.04 LTS |

---

## Files reference

| File | Purpose |
|------|---------|
| `Dockerfile` | Docker image build |
| `docker-compose.yml` | One-command deploy |
| `ecosystem.config.cjs` | PM2 process manager |
| `nginx.conf.example` | Reverse proxy template |
| `.env.example` | Environment template |
| `seed/` | Default site data |
| `scripts/setup.mjs` | Initialize data folder |
| `scripts/backup.mjs` | Backup script |

---

## Contact for developer

After deploy, Sabrina can manage all content via `/admin` — no code changes needed for day-to-day updates.
