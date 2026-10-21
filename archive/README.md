# 🗄️ REA Music — Legacy & Archive Documentation

This document records obsolete files, redundancies, duplicate detection results, and historical records for REA Music.

---

## 🧹 Removal of Android Infrastructure (Web-Only Project Decision)

Per project architecture decisions, REA Music has transitioned to a **100% web-only** project to streamline maintainability, minimize repository footprint, and focus strictly on [https://reamusic.vercel.app/](https://reamusic.vercel.app/).

### Summary of Android Components Purged:
1. **`android/`**: Complete native Android Studio Gradle project, Java foreground audio services (`MusicForegroundService.java`, `MusicServicePlugin.java`), drawables, and manifests removed.
2. **`releases/`**: Centralized mobile release binaries (`releases/android/`) removed.
3. **`capacitor.config.json`**: Capacitor Android configuration removed.
4. **`@capacitor/*` Dependencies**: Pruned all 6 Capacitor npm packages from `package.json` (101 unused packages removed from `node_modules`).
5. **Android Scripts & Guides**: Deleted `scripts/build-android.bat`, `scripts/locate-apks.js`, and `docs/ANDROID_GUIDE.md`.

---

## 📜 Archived Migration Scripts

The following obsolete migration and prototyping scripts have been safely moved to `archive/scripts/`:

1. **`archive/scripts/append-spatial-css.mjs`**: Initial migration script used to append the spatial CSS block into `css/index.css`.
2. **`archive/scripts/complete-spatial-redesign.mjs`**: Prototype script used during the initial spatial UI redesign.
3. **`archive/scripts/test-spatial-experience.mjs`**: Prototype testing script requiring an active Chrome CDP debugger on port 9333.
