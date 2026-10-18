# 📁 REA Music — Web-Only Project Structure & Architectural Manifesto

This document outlines the professional directory layout, component ownership, file classifications, and architectural principles of the **REA Music** web repository.

---

## 🏛️ Executive Summary & Architectural Rationale

REA Music is a high-fidelity web streaming music ecosystem comprised of:
1. A **High-Fidelity Single Page Web Application** deployed at [https://reamusic.vercel.app/](https://reamusic.vercel.app/).
2. A **Universal Node.js Runtime Server** (`server.js`) providing local development execution and static file serving with client-side SPA routing fallback.
3. An **Edge API Proxy Engine** (`api/index.js`) communicating with JioSaavn CDN endpoints with pure JavaScript DES URL decryption (`api/des.js`).

All Android application-related infrastructure, APK binaries, and Capacitor wrappers have been completely removed. REA Music is maintained as a **100% web-only** project.

---

## 🌳 Comprehensive Project Tree

```
REA-MUSIC/
│
├── README.md                          # Primary project documentation, features & quickstart
├── .gitignore                         # Git exclusion rules for builds, secrets & OS artifacts
├── .env.example                       # Root template for environment configuration
├── package.json                       # Project manifest, dependencies, and lifecycle scripts
├── package-lock.json                  # Locked dependency graph
│
├── api/                               # Edge / Serverless Functions
│   ├── des.js                         # Pure JavaScript DES decipher for JioSaavn CDN audio URLs
│   └── index.js                       # Universal API router (/api/trending, /api/search, /api/lyrics, etc.)
│
├── assets/                            # Curated & Categorized Media Assets
│   ├── branding/                      # Showcase banners, promo art & app covers
│   │   └── rea-music-app-cover.jpg    # Ultra-HD 1024x1024 Squircle App Icon Cover Art
│   ├── icons/                         # Brand icons & logos
│   │   └── logo.jpg                   # Main brand logo icon
│   ├── images/                        # Album covers & curated playlist artwork
│   │   ├── acoustic_sun.jpg
│   │   ├── cyber_phonk.jpg
│   │   ├── electro_horizon.jpg
│   │   ├── lofi_piano.jpg
│   │   ├── lofi_rain.jpg
│   │   └── midnight_vibes.jpg
│   ├── screenshots/                   # Application screenshots & UI demos
│   │   └── .gitkeep
│   ├── logo.jpg                       # Root-level runtime web asset (preserved for zero-config routing)
│   └── midnight_vibes.jpg             # Root-level runtime web asset (preserved for zero-config routing)
│
├── docs/                              # Project Documentation Suite
│   ├── PROJECT_STRUCTURE.md           # This document
│   ├── BUILD_GUIDE.md                 # Complete web compilation, bundling & development guide
│   ├── DEPLOYMENT.md                  # Vercel deployment, edge routing & domain configuration
│   └── CHANGELOG.md                   # Comprehensive project release & evolution history
│
├── scripts/                           # Safe Automation & Maintenance Scripts
│   ├── build-web.js                   # Web bundle execution wrapper
│   └── verify-project.js              # Comprehensive project integrity & health verifier
│
├── tests/                             # Quality Assurance & Testing Suite
│   ├── smoke-test.js                  # Automated HTTP server & API endpoint smoke test
│   └── README.md                      # Test suite documentation & instructions
│
├── config/                            # Safe, Non-Secret Configuration Templates
│   ├── .env.example                   # Placeholder environment configuration template
│   └── README.md                      # Guide to environment variables & configuration tokens
│
├── archive/                           # Obsolete Files, Redundancies & Historical Records
│   └── README.md                      # Audit of legacy packages, duplicates & external assets
│
├── css/                               # Frontend Stylesheet System
│   └── index.css                      # Apple liquid glass frosted glassmorphism & CSS tokens
│
├── js/                                # Frontend Client Logic
│   └── app.js                         # SPA audio player, queue manager, search & LRCLIB lyrics sync
│
├── public/                            # Static Distribution Assets (served directly by server.js)
├── dist/                              # Compiled Distribution Assets (bundled by build.js)
├── index.html                         # SPA Main HTML Template
├── server.js                          # Lightweight local Node.js development server & Vercel handler
├── build.js                           # Inliner & bundler script generating dist/ and public/
└── vercel.json                        # Vercel edge rewrite rules & caching headers
```

---

## 🏷️ File Classification Inventory

| File / Directory | Category | Action Taken | Rationale |
| :--- | :--- | :--- | :--- |
| `api/` | **A. Required** | Preserved | Edge API proxy router and URL decryptor for streaming |
| `css/index.css` | **A. Required** | Preserved | Liquid glass frosted styling system |
| `js/app.js` | **A. Required** | Preserved | Core web application audio engine, lyrics sync, search logic |
| `index.html` | **A. Required** | Preserved | Main Single Page Application interface |
| `server.js` | **A. Required** | Preserved | Local development server & Vercel serverless request router |
| `build.js` | **A. Required** | Preserved | Production inliner and asset bundler |
| `vercel.json` | **A. Required** | Preserved | Vercel routing rules & Mumbai `bom1` region edge configuration |
| `assets/logo.jpg`, `assets/midnight_vibes.jpg` | **A. Required** | Preserved | Directly referenced in `index.html`, `build.js`, and `api/index.js` |
| `assets/branding/`, `assets/images/` | **A. Required** | Preserved | Curated media assets |
| `docs/*.md` | **A. Required** | Updated | Web-focused architecture and operational guides |
| `scripts/build-web.js`, `scripts/verify-project.js` | **A. Required** | Preserved | Automated web build and verification tools |
| `tests/smoke-test.js` | **A. Required** | Preserved | End-to-end API and server smoke test |
| `config/.env.example` | **A. Required** | Preserved | Safe placeholder configuration |
| `.env.local` | **E. Sensitive** | Protected & Excluded | Ignored by Git; contains local tokens |
| `android/` | **B. Removed** | Completely Deleted | Android native source, Gradle build, and binaries removed |
| `releases/` | **B. Removed** | Completely Deleted | APK binaries, bundles, and mobile release notes removed |
| `capacitor.config.json` | **B. Removed** | Completely Deleted | Capacitor mobile wrapper configuration removed |
| `apps/` | **B. Removed** | Completely Deleted | Hybrid apps folder removed; repository is single web app |
| `scripts/build-android.bat` | **B. Removed** | Completely Deleted | Android build script removed |
| `scripts/locate-apks.js` | **B. Removed** | Completely Deleted | APK scanning script removed |
| `docs/ANDROID_GUIDE.md` | **B. Removed** | Completely Deleted | Android documentation removed |
| `assets/rea-music-apk-cover.jpg` | **B. Removed** | Completely Deleted | Android APK banner removed |
