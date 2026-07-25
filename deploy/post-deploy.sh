#!/usr/bin/env bash
# Post-deploy script on reg.am / CloudLinux cPanel (run via SSH)
set -euo pipefail

APP_ROOT="${CPANEL_APP_ROOT:-$HOME/iisshha-site}"
NODE_VERSION="${CPANEL_NODE_VERSION:-20}"
USER_NAME="${CPANEL_USER:-$(whoami)}"

echo "==> Deploy post-install in ${APP_ROOT}"

cd "${APP_ROOT}"

if [ -f "release.tar.gz" ]; then
  echo "==> Extracting release..."
  tar -xzf release.tar.gz
  rm -f release.tar.gz
fi

echo "==> Ensuring upload folders exist..."
mkdir -p data public/uploads/{videos,photos,audio,news}

VENV_ACTIVATE="${HOME}/nodevenv/$(basename "${APP_ROOT}")/${NODE_VERSION}/bin/activate"

if [ -f "${VENV_ACTIVATE}" ]; then
  echo "==> npm install (virtualenv)..."
  # shellcheck disable=SC1090
  source "${VENV_ACTIVATE}"
  npm install --omit=dev --no-audit --no-fund --legacy-peer-deps
else
  echo "WARN: virtualenv not found at ${VENV_ACTIVATE}"
  echo "      Run 'Run NPM Install' once in cPanel Node.js App."
fi

if command -v cloudlinux-selector >/dev/null 2>&1; then
  echo "==> Restarting Node.js app..."
  cloudlinux-selector restart \
    --json \
    --interpreter nodejs \
    --app-root "$(basename "${APP_ROOT}")" \
    --user "${USER_NAME}" 2>/dev/null || true
fi

echo "==> Done. Check https://iisshha.com/api/health"
