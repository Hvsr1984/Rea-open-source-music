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

## 🔍 External Artifacts Flagged for User Review

The following companion items exist on the desktop outside the `rea-music` repository:

| Item | Location | Size | Recommendation |
| :--- | :--- | :--- | :--- |
| **`rea-music-apk/`** | `c:\Users\harsh\OneDrive\Desktop\rea\rea-music-apk\` | ~25 MB | External folder containing duplicate APK builds. Safe to delete or move to cold storage. |
| **`rea-music-production.zip`** | `c:\Users\harsh\OneDrive\Desktop\rea\rea-music-production.zip` | 6.15 MB | Legacy pre-Android zip snapshot. Safe to delete. |
