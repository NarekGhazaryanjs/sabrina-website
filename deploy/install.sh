#!/usr/bin/env bash
# Sabrina website — one-command server install
# Run on a fresh Ubuntu/Debian VPS as root or with sudo:
#   curl -fsSL https://raw.githubusercontent.com/NarekGhazaryanjs/sabrina-website/main/deploy/install.sh | bash
#
# Or with custom domain (sets SITE_URL):
#   curl -fsSL .../install.sh | bash -s -- yourdomain.com

set -euo pipefail

REPO="https://github.com/NarekGhazaryanjs/sabrina-website.git"
APP_DIR="/opt/sabrina-website"
DOMAIN="${1:-}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}▸${NC} $*"; }
warn()  { echo -e "${YELLOW}▸${NC} $*"; }
error() { echo -e "${RED}✗${NC} $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || error "Run as root: sudo bash install.sh"

info "Sabrina website installer"

# ── Docker ──
if ! command -v docker &>/dev/null; then
  info "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
else
  info "Docker already installed"
fi

if ! docker compose version &>/dev/null 2>&1; then
  info "Installing Docker Compose plugin..."
  apt-get update -qq
  apt-get install -y -qq docker-compose-plugin
fi

# ── Clone / update ──
if [[ -d "$APP_DIR/.git" ]]; then
  info "Updating existing installation..."
  git -C "$APP_DIR" pull --ff-only
else
  info "Cloning repository..."
  git clone "$REPO" "$APP_DIR"
fi

cd "$APP_DIR"

# ── .env (auto-generated once) ──
if [[ ! -f .env ]]; then
  SECRET=$(openssl rand -hex 32)
  PASS=$(openssl rand -base64 16 | tr -d '/+=' | head -c 16)
  IP=$(curl -sf --max-time 3 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

  if [[ -n "$DOMAIN" ]]; then
    SITE="https://${DOMAIN}"
  else
    SITE="http://${IP}:3000"
  fi

  cat > .env <<EOF
AUTH_SECRET=${SECRET}
ADMIN_LOGIN=admin
ADMIN_PASSWORD=${PASS}
SITE_URL=${SITE}
NODE_ENV=production
EOF

  cat > ADMIN_LOGIN.txt <<EOF
Sabrina website — admin credentials
====================================
URL:      ${SITE}/admin/login
Login:    admin
Password: ${PASS}

Keep this file safe. Change password in .env and restart if needed.
EOF
  chmod 600 .env ADMIN_LOGIN.txt
  info "Admin credentials saved to ${APP_DIR}/ADMIN_LOGIN.txt"
else
  warn ".env already exists — keeping current settings"
fi

# ── Build & run ──
info "Building and starting (may take 2–5 minutes on first run)..."
docker compose up -d --build

# ── Wait for health ──
info "Waiting for site to start..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000/api/health &>/dev/null; then
    break
  fi
  sleep 2
done

IP=$(curl -sf --max-time 3 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  Sabrina website is running!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "  Site (EN):  http://${IP}:3000/en"
echo "  Site (RU):  http://${IP}:3000/ru"
echo "  Admin:      http://${IP}:3000/admin/login"
echo ""
if [[ -f ADMIN_LOGIN.txt ]]; then
  echo "  Login details: ${APP_DIR}/ADMIN_LOGIN.txt"
  cat ADMIN_LOGIN.txt
fi
echo ""
warn "Open port 3000 in firewall if needed: ufw allow 3000"
warn "For domain + HTTPS see DEPLOY.md (nginx + certbot)"
echo ""
