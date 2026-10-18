# 🎵 REA Music

> **High-Fidelity Apple Music Style Web Streaming Application**  
> Stream lossless 320kbps Indian music, synchronized karaoke lyrics, real-time Web Audio API frequency spectrum analyzer, and dual liquid glass themes (**Glass White** & **Simple Black**).

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20with-Vercel-black?logo=vercel)](https://reamusic.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Audio: 320kbps](https://img.shields.io/badge/Audio-320kbps%20Ultra--HD-red)](#features)

Live Website: **[https://reamusic.vercel.app/](https://reamusic.vercel.app/)**

---

## ✨ Features

- 🎧 **Lossless 320kbps Indian Music Streaming**: Direct high-speed CDN audio streaming powered by JioSaavn CDN with pure JS DES URL decryption.
- 🍏 **Apple Liquid Glass Aesthetics**: Precision frosted glassmorphism, dynamic ambient lighting, and curated themes (**Glass White** & **Simple Black**).
- 🎤 **Synchronized Karaoke Lyrics**: Real-time line-by-line synchronized lyrics powered by the LRCLIB API with instant click-to-seek playback.
- 📊 **Real-time Web Audio API Spectrum Analyser**: Live dynamic frequency visualizer rendered in the player dock and theater mode.
- 💾 **Offline Vault (IndexedDB)**: Full 320kbps offline song storage with persistent playback even without internet connection.
- ⚡ **Sub-100ms Debounced Search**: Live search across songs, albums, and artist cards with dedicated category filters.
- ☁️ **Vercel Edge-Optimized**: Deployed on low-latency Mumbai edge (`bom1`) with intelligent caching headers.
- ⚡ **Zero-Dependency Core**: Pure Vanilla HTML5, modern CSS3 variables, and vanilla JavaScript without heavy frontend frameworks.

---

## 📁 Project Architecture

```
REA-MUSIC/
│
├── README.md                          # Primary project documentation & quickstart
├── .gitignore                         # Excluded build artifacts, environments & caches
├── .env.example                       # Root template for environment configuration
├── package.json                       # Project manifest with build and QA scripts
├── package-lock.json                  # Locked dependency graph
│
├── api/                               # Edge / Serverless Functions
│   ├── des.js                         # Pure JavaScript DES decipher for JioSaavn CDN audio URLs
│   └── index.js                       # Universal API router (/api/trending, /api/search, /api/lyrics, etc.)
│
├── assets/                            # Categorized Media & Static Assets
│   ├── branding/                      # Showcase banners, promo covers & app icon art
│   ├── icons/                         # Brand icons & logos
│   ├── images/                        # Album covers & curated playlist artwork
│   ├── screenshots/                   # Application screenshots & demos
│   ├── logo.jpg                       # Root-level runtime web asset
│   └── midnight_vibes.jpg             # Root-level runtime web asset
│
├── docs/                              # Project Documentation Suite
│   ├── PROJECT_STRUCTURE.md           # Detailed folder layout & file classification
│   ├── BUILD_GUIDE.md                 # Complete web compilation, bundling & development guide
│   ├── DEPLOYMENT.md                  # Vercel zero-config routing & edge deployment
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
├── css/                               # Design System & Styling
│   └── index.css                      # Apple liquid glass frosted glassmorphism & responsive CSS tokens
│
├── js/                                # Core Web Application Logic
│   └── app.js                         # SPA router, audio engine, queue manager, LRCLIB lyrics sync
│
├── public/                            # Static runtime assets served by server.js
├── dist/                              # Compiled distribution assets (bundled by build.js)
├── index.html                         # SPA Main HTML Template
├── server.js                          # Lightweight local Node.js development server & Vercel handler
├── build.js                           # Inliner & bundler script generating dist/ and public/
└── vercel.json                        # Vercel edge rewrite rules & caching headers
```

---

## 🚀 Quick Start (Local Development)

### 1. Start the Web App
```bash
# Start local Node.js server (port 4500):
npm start
# or
npm run dev
```
Open your browser at `http://localhost:4500`.

### 2. Run the Verification Suite & Smoke Tests
```bash
# Verify project integrity (verifies zero Android/APK artifacts):
npm run verify

# Run automated HTTP & API smoke tests:
npm test
```

### 3. Build Production Web Bundle
```bash
# Compile web distribution bundles (dist/ and public/):
npm run build
```

---

## ☁️ Deployment

REA Music is continuously deployed to Vercel at [https://reamusic.vercel.app/](https://reamusic.vercel.app/).  
For complete deployment architecture and instructions, see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## 📄 Documentation Hub

- [Project Structure & Architectural Manifesto](docs/PROJECT_STRUCTURE.md)
- [Complete Build & Development Guide](docs/BUILD_GUIDE.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
- [Official Release History & Changelog](docs/CHANGELOG.md)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
