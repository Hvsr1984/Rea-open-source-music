# 📝 REA Music — Official Changelog & Release History

All notable changes to the **REA Music** web ecosystem are documented in this file.

---

## [2.7.0] - 2026-10-20

### 🔮 Intelligent Personalization & Adaptive Home Recommendation Engine
- **Balanced Cold Start Discovery (New User)**:
  - Fresh users launch into a balanced discovery home screen featuring 9 distinct sections: **Trending in India**, **Latest Releases**, **India Superhits Top 50**, **Punjabi Superhits & Desi Bass**, **Haryanvi Hits & Regional Rap**, **Bollywood Melodies & Romance**, **Popular Independent Artists & Pop**, **Mood Categories**, and **Discover Indian Artists**.
  - Strict cold-start invariant: Bottom player bar initializes in an empty state (`.is-empty`, "Nothing playing") without auto-assigning or auto-playing default songs.
  - Browsing tracks or navigating views does not inflate or pollute music preferences until intentional playback occurs.
- **Event-Driven Listening Behaviour Tracking (`ListeningHistoryService`)**:
  - Tracks rich playback events: `song_started`, `song_completed` (>=85% listen or >=150s), `song_skipped` (quick skips <25s penalize without permanently banning), `song_replayed` (+3.0 affinity), `song_favourited` (+3.5 affinity), `playlist_added` (+2.5 affinity), `artist_opened` (+1.2 affinity), and explicit negative feedback (`song_not_interested`, `show_less_artist`).
  - Stores rich playback context: `trackId`, `title`, `artist`, `album`, `genres`, `languages`, `moods`, `durationListened`, and `completionPct` in bounded localStorage (`rea_listening_events_v2`).
- **Dynamic Preference Profile & Recency Decay (`UserPreferenceService`)**:
  - Tracks decaying artist affinities, genre weights, language preferences, and mood weights.
  - Implements exponential recency decay with a 7-day half-life ($W \times 2^{-\Delta t / 7\text{ days}}$), allowing user taste to shift organically (e.g. from Haryanvi rap to Bollywood romance) without permanent genre lock-in.
  - Real-time Taste Profile Confidence Score ($0\% - 100\%$) derived from session completions, diversity of artists explored, and explicit likes.
- **Modular Multi-Signal Recommendation Ranking (`RecommendationEngine`)**:
  - Scores eligible catalogue candidates across 6 configurable dimensions:
    - 30% User listening & artist affinity
    - 25% Similarity to recently enjoyed tracks (multi-attribute similarity: artist, genre, mood tags, era)
    - 15% Genre and language preference
    - 10% Mood and musical metadata similarity
    - 10% Personal replay, completion, and favourite signals
    - 10% Freshness, discovery, and contextual relevance
  - Excludes unplayable/disliked tracks (`dislikedTrackIds`, `dislikedArtists`).
  - Penalizes recent playback repetitions (-50% score for tracks played in last 15 songs) to prevent repetitive feeds.
  - Strict artist diversity dampener: maximum 3 songs per artist in any recommendation shelf.
- **Dynamic Adaptive Home Screen (`HomeFeedService`)**:
  - Dynamically activates `#personalizedShelf` ("Because you listened to [Artist]" / "Your [Genre] Favourites") and `#jumpBackInShelf` ("Jump Back In") as confidence builds.
  - Elevates high-confidence users with high-affinity badges while preserving trending and new release sections for broad exploration.
- **Contextual Song Options & Privacy Controls**:
  - Contextual 3-dots and right-click song options modal (`#trackOptionsBackdrop`) with **Play next**, **Add to queue**, **More like this**, **Add/Remove Favorites**, **Not interested**, **Show less from this artist**, and **View artist profile**.
  - Settings Modal Taste Profile Card (`#tasteProfileCard`) with live confidence meter, listen stats, and 1-click **Clear History** and **Reset Taste Profile** operations.

---

## [2.6.0] - 2026-10-18

### 🧠 Smart Autoplay, Intelligent Next Song & Recommendation Engine
- **Centralized Playback Controller**: Unified track transitions into a single controller (`advanceTrack`), handling manual Next clicks, the browser's native `ended` audio event, previous track, repeat modes (`off`, `one`, `all`), shuffle, and playback error recovery.
- **3-Tier Real Play Queue**: Completely redesigned the Up Next drawer and Maximized Player queue with three distinct, interactive sections:
  - **Section A: Currently Playing**: Live track card with cover art, singer, title, duration, and animated audio equalizer bars (`@keyframes eqBounce`).
  - **Section B: Next in Queue (Manual Queue)**: High-priority user-curated queue with position numbers (`#1`, `#2`), Move Up/Down reordering, single-click removal, and bulk queue clear.
  - **Section C: Recommended Next (Autoplay Queue)**: Intelligently predicted upcoming discovery tracks with dynamic reason badges (`✦ More from [Artist]`, `✦ Because you like [Artist]`, `✦ Similar vibe`, `✦ From your Liked Songs`), immediate Play Now, Add to Queue (`+ Queue`), and Dismiss (`✕ Not interested`).
- **Normalized Client Recommendation Engine**: Developed a multi-signal scoring algorithm scoring candidate tracks across artist affinity (+35 pts), language cohesion (+20 pts), liked songs affinity (+30 pts), recent listening history recency penalties (-70 pts within last 5 tracks), and an artist diversity dampener (maximum 2 tracks per artist in upcoming queue).
- **Context-Aware Playback Sequences**: Dynamic listening flows adapting to playback entry points: single song discovery, album sequential listening, playlist ordering, artist radio, search track playback, and recommendation continuation.
- **Playback Reliability & Error Recovery**: Bounded retry handler (`handlePlaybackError`, max 3 attempts) catching expired CDN URLs and stream dropouts without freezing or entering infinite retry loops.
- **Persistent Autoplay Controls**: Real Autoplay toggle switch added to the bottom player bar (`#barAutoplayBtn`), right drawer panel (`#queueAutoplayToggle`), and theater maximized player (`#maxAutoplayToggle`) with `localStorage` persistence.
- **Restored Play/Pause & Engine Controls**: Restored missing `togglePlayPause()` method on `REAMusicApp`, added `engine.play()` alias on `HybridAudioEngine`, enabled Spacebar keyboard playback toggling, and added contextual row play/pause support.
- **Butter-Smooth Device Performance & Instant Hydration**:
  - **Instant 0ms Cache Hydration**: Hydrates catalog directly from `localStorage` on load, eliminating skeleton flashes and initial network layout shifts.
  - **On-Demand Audio Visualizer**: Stopped continuous 60–120 FPS requestAnimationFrame canvas loops during idle/pause states, slashing CPU and battery usage.
  - **Async Lazy Image Pipeline**: Applied `loading="lazy"` and `decoding="async"` across all catalog and queue album art images, preventing network saturation and thread blocking.
  - **DocumentFragment DOM Batching**: Eliminated layout thrashing by batching shelf DOM insertions into single reflows.
  - **CSS Rendering Acceleration**: Replaced excess `will-change` layer allocation with `content-visibility: auto`, tuned mobile glass blur for GPU fill-rate efficiency, and added JioSaavn CDN preconnect/DNS prefetch links.
  - **Edge & HTTP Asset Caching**: Added immutable cache headers (`max-age=31536000`) for media assets and edge cache rules in `vercel.json` and `server.js`.

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
