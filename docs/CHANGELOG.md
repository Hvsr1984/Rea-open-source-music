# 📝 REA Music — Official Changelog & Release History

All notable changes to the **REA Music** web ecosystem are documented in this file.

---

## [2.5.0-web] - 2026-10-18

### 🧹 Transition to Pure Web-Only Project
- **Removed All Android Infrastructure**: Completely purged `android/` directory (Gradle wrappers, Java foreground services, drawables, Android manifests).
- **Purged All APK Binaries**: Deleted all `.apk` files (`rea-music-debug.apk`, `rea-music-v2.5.0.apk`, `rea-music.apk`, and `releases/` directory).
- **Uninstalled Capacitor Dependencies**: Removed `@capacitor/android`, `@capacitor/app`, `@capacitor/cli`, `@capacitor/core`, `@capacitor/splash-screen`, and `@capacitor/status-bar` from `package.json` and pruned `node_modules` (101 unused packages removed).
- **Web-Only Script Optimization**: Retained exclusively web-relevant npm scripts (`start`, `dev`, `build`, `build:web`, `verify`, `test`).
- **Zero-Downtime Guarantee**: Maintained all Vercel root entrypoints (`server.js`, `api/index.js`, `vercel.json`) ensuring continuous operation of [https://reamusic.vercel.app/](https://reamusic.vercel.app/).
- **Automated Verification**: Updated `scripts/verify-project.js` to strictly enforce the complete absence of Android and APK components.

---

## [2.5.0] - 2026-10-18

### 🌟 Performance & Features
- **Sub-100ms Search Debounce**: Replaced high-latency requests with 100ms debounce and instant client-side in-memory caching.
- **Artist Cards & Discovery**: Added singers/artists catalog browsing with dedicated category filters (All, Bollywood, Punjabi, South Indian, Lo-Fi, Pop).
- **Offline Vault**: Added 320kbps offline track storage using client-side IndexedDB persistence.
- **Edge Deployment**: Configured Vercel `bom1` (Mumbai) region routing with edge caching headers (`s-maxage=3600, stale-while-revalidate=86400`).

---

## [2.0.0] - 2026-09-15

### 🚀 Major Enhancements
- **Lossless 320kbps CDN Proxy**: Implemented pure JavaScript DES decryption engine (`api/des.js`) resolving direct CDN URLs without third-party API dependencies.
- **LRCLIB Real-time Karaoke Lyrics**: Added synchronized line-by-line lyrics with active timestamp scrolling and click-to-seek playback.
- **Apple Liquid Glass Aesthetic**: Overhauled UI with frosted glassmorphism tokens, dynamic ambient color extraction from album artwork, and dual themes (**Glass White** & **Simple Black**).
- **Web Audio API Spectrum Visualizer**: Added live real-time frequency audio analyzer rendered in the bottom player dock and expanded theater view.

---

## [1.0.0] - 2026-08-01

### 🎉 Initial Release
- Initial release of REA Music streaming web player.
- Vanilla HTML5/CSS3/JavaScript SPA architecture.
- JioSaavn music catalog streaming integration.
- Responsive mobile and desktop layout.
