# Для друга — деплой сайта Sabrina

## Вариант A — cPanel (iisshha.com)

Если есть cPanel с **Node.js App** → смотри **[deploy/CPANEL.md](./deploy/CPANEL.md)**

Кратко:
1. `npm run build:cpanel` на ПК
2. Zip `release-cpanel/` → загрузить в `/iisshha.com`
3. cPanel → Node.js App → startup `server.js`
4. Включить HTTPS для домена

---

## Вариант B — VPS (1 команда)

Подключись к **Linux-серверу** (Ubuntu/Debian) по SSH и выполни:

```bash
curl -fsSL https://raw.githubusercontent.com/NarekGhazaryanjs/sabrina-website/main/deploy/install.sh | bash
```

С доменом (опционально):

```bash
curl -fsSL https://raw.githubusercontent.com/NarekGhazaryanjs/sabrina-website/main/deploy/install.sh | bash -s -- sabrina.com
```

## Что произойдёт автоматически

1. Установится Docker (если нет)
2. Скачается код с GitHub
3. Создастся `.env` с паролем admin
4. Запустится сайт на порту **3000**

## После установки

- Сайт: `http://IP_СЕРВЕРА:3000/ru`
- Админка: `http://IP_СЕРВЕРА:3000/admin/login`
- Логин и пароль — в файле `/opt/sabrina-website/ADMIN_LOGIN.txt` на сервере

## HTTPS + домен

Смотри `DEPLOY.md` → Step 3 (Nginx + Certbot).

## Обновление сайта

```bash
cd /opt/sabrina-website && git pull && docker compose up -d --build
```

---

**Сабрине ничего делать не нужно** — весь код и контент уже в GitHub.
