# ☁️ REA Music — Vercel & Production Deployment Guide

REA Music is configured for continuous production deployment on **Vercel** at:
**[https://reamusic.vercel.app/](https://reamusic.vercel.app/)**

---

## 🔒 Safety & Deployment Policy

> [!IMPORTANT]
> **Strict Non-Interference Policy**:
> Do NOT push commits to `main`, trigger Vercel CLI deployments (`vercel --prod`), or modify live DNS/Vercel settings without explicit user authorization.

---

## ⚙️ Vercel Architecture & Zero-Config Setup

REA Music operates on Vercel as a hybrid Node.js Serverless Function and Edge-optimized Single Page Application.

### Configuration (`vercel.json`):
```json
{
  "version": 2,
  "regions": ["bom1"],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js?path=$1"
    },
    {
      "source": "/api",
      "destination": "/api/index.js"
    },
    {
      "source": "/((?!api).*)",
      "destination": "/server.js"
    }
  ]
}
```

### Key Deployment Characteristics:
1. **Target Region (`bom1` — Mumbai, India)**:
   - Configured specifically for ultra-low latency (<25ms) across the Indian subcontinent where the primary JioSaavn CDN nodes and user base are situated.
2. **Universal Request Router (`server.js`)**:
   - Handles static assets from `public/` and falls back gracefully to `index.html` for client-side SPA routing.
3. **Serverless API Proxy (`api/index.js`)**:
   - Decrypts 320kbps audio stream URLs on the edge using `api/des.js`.
   - Caches trending charts and queries using `s-maxage=3600, stale-while-revalidate=86400` headers.

---

## 🔑 Environment Variables

The project does not require secret database credentials to run basic streaming, as all public search and catalog indexing proxies through public JioSaavn edge endpoints.

| Variable | Required | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `VERCEL_OIDC_TOKEN` | Optional | None | Vercel internal OIDC authentication token |
| `PORT` | Optional | `4500` | Port for local Node.js server execution |

See [`config/.env.example`](../config/.env.example) for placeholder definitions.

---

## 🚀 How to Deploy (Authorized Workflow)

### Method 1: Git-Based Auto-Deployment (Recommended)
1. Commit code to the repository:
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```
2. Push to GitHub `main` branch:
   ```bash
   git push origin main
   ```
3. Vercel automatically detects the push, executes the serverless build, and updates [https://reamusic.vercel.app/](https://reamusic.vercel.app/) without downtime.

### Method 2: Vercel CLI
```bash
# Link project:
npx vercel link

# Preview deployment:
npx vercel

# Production release:
npx vercel --prod
```
