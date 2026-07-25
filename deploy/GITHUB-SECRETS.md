# GitHub Secrets — CI/CD deploy to reg.am

**Never commit passwords to git.** Add these in GitHub:

**Repository → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|-------|
| `CPANEL_FTP_HOST` | `server2.reg.am` (or `ftp.iisshha.com`) |
| `CPANEL_USERNAME` | `wmflggzahnbx` |
| `CPANEL_PASSWORD` | your cPanel password |
| `SABRINA_AUTH_SECRET` | random 32+ chars (keep same across deploys) |
| `SABRINA_ADMIN_PASSWORD` | admin panel password (keep same) |

> **Note:** reg.am shared hosting blocks external SSH (port 22). Deploy uses **FTPS** (port 21). After upload, click **Restart** in cPanel Node.js App (and **Run NPM Install** if `package.json` changed).

Generate secret:
```bash
npm run generate-secret
```

## One-time cPanel setup

Before first CI/CD deploy:

1. File Manager → create folder `iisshha-site` (empty)
2. **Setup Node.js App** → Create:
   - root: `iisshha-site`
   - URL: `iisshha.com`
   - startup: `server.js`
   - Node.js: 20
3. **Run NPM Install** once (creates nodevenv symlink)
4. Add GitHub secrets above

## Deploy

Automatic on every push to `main`, or manually:

**Actions → Deploy to reg.am cPanel → Run workflow**

## Security

If password was shared in chat, **change cPanel password** after adding GitHub secret.
