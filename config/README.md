# ⚙️ REA Music — Configuration Guide & Environment Variables

This directory houses non-secret configuration templates and guidance for managing environments across REA Music.

---

## 🔒 Security Principles

> [!CAUTION]
> Never commit actual API tokens, secret keys, or passwords to Git. All `.env*` files are strictly excluded via `.gitignore`.

1. **Preserve Existing Names**: Do not alter environment variable names across the codebase (`VERCEL_OIDC_TOKEN`, `PORT`).
2. **Safe Placeholders Only**: Only placeholder definitions are stored in version control (`.env.example`).
3. **Fail-Safe Fallbacks**: If no `.env.local` is present, `server.js` defaults cleanly to port `4500` and public endpoints continue operating without credentials.

---

## 📄 Configuration Files

| File | Purpose | Committed to Git? |
| :--- | :--- | :--- |
| `config/.env.example` | Template for developers with placeholder values | ✅ Yes |
| `.env.example` | Root template mirror for convenience | ✅ Yes |
| `.env.local` | Local runtime secrets (e.g. `VERCEL_OIDC_TOKEN`) | ❌ **No (Git Ignored)** |
| `capacitor.config.json` | Mobile wrapper configuration (App ID, Scheme) | ✅ Yes |
| `vercel.json` | Edge serverless rewrites, headers & region | ✅ Yes |
