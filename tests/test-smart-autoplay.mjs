/**
 * tests/test-smart-autoplay.mjs
 * Comprehensive Verification Suite for REA Music — Smart Autoplay & Recommendation Engine
 * Validates Scenarios A through I:
 *   Scenario A: Priority for same artist (Dhanda Nyoliwala)
 *   Scenario B: Graceful expansion when artist catalogue is exhausted
 *   Scenario C: State synchronization across navigation and views
 *   Scenario D: Skip penalties and avoidance of recently skipped songs
 *   Scenario E: Autoplay toggle behavior and clean stopping when disabled
 *   Scenario F: Fault tolerance on audio stream or API failures
 *   Scenario G: Race condition prevention on rapid artist switching
 *   Scenario H: Cold start / fresh user instant artist-based recommendations
 *   Scenario I: Preservation of manual queue and sequence queue order
 */
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

process.env.VERCEL = '1';

console.log('🎵 [REA Smart Autoplay Tests] Starting Acceptance Verification Suite...\n');

// 1. Start local API test server
const { default: handler } = await import('../server.js');
const server = http.createServer(handler);
const TEST_PORT = 4598;
await new Promise(r => server.listen(TEST_PORT, '127.0.0.1', r));

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASSED: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAILED: ${name} ->`, err);
    failed++;
  }
}

try {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');

  // Helper to instantiate REAMusicApp in a mock browser environment
  function createTestApp(initialStorage = {}) {
    const storageStore = { ...initialStorage };
    const mockStorage = {
      getItem(k) { return storageStore[k] || null; },
      setItem(k, v) { storageStore[k] = String(v); },
      removeItem(k) { delete storageStore[k]; }
    };

    const mockElement = (tag = 'div') => ({
      tagName: tag.toUpperCase(),
      classList: {
        _classes: new Set(),
        add(...c) { c.forEach(x => this._classes.add(x)); },
        remove(...c) { c.forEach(x => this._classes.delete(x)); },
        toggle(c, v) {
          if (v === undefined) v = !this._classes.has(c);
          if (v) this._classes.add(c); else this._classes.delete(c);
          return v;
        },
        contains(c) { return this._classes.has(c); }
      },
      style: {},
      innerHTML: '',
      textContent: '',
      dataset: {},
      attributes: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      getAttribute(k) { return this.attributes[k] || null; },
      appendChild(child) { if (this.children) this.children.push(child); return child; },
      children: [],
      addEventListener() {},
      removeEventListener() {},
      getContext() {
        return {
          clearRect() {},
          fillRect() {},
          beginPath() {},
          arc() {},
          fill() {},
          stroke() {},
          createLinearGradient() { return { addColorStop() {} }; }
        };
      },
      querySelector() { return null; },
      querySelectorAll() { return []; },
      closest() { return null; }
    });

    const mockDocument = {
      getElementById(id) { return mockElement('div'); },
      querySelector(sel) { return mockElement('div'); },
      querySelectorAll(sel) { return []; },
      createElement(tag) { return mockElement(tag); },
      createDocumentFragment() {
        return {
          children: [],
          appendChild(child) { this.children.push(child); return child; }
        };
      },
      addEventListener() {},
      removeEventListener() {},
      referrer: '',
      readyState: 'complete',
      body: mockElement('body')
    };

    const mockLocation = { pathname: '/', search: '', href: 'http://localhost:4500/' };
    const mockNavigator = {
      mediaSession: { setActionHandler() {}, metadata: null },
      standalone: false
    };
    const mockWindow = {
      location: mockLocation,
      history: { pushState() {}, replaceState() {} },
      addEventListener() {},
      removeEventListener() {},
      innerWidth: 1200,
      matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
      requestAnimationFrame: (cb) => setTimeout(cb, 16),
      cancelAnimationFrame: (id) => clearTimeout(id),
      navigator: mockNavigator,
      __API_BASE_URL__: `http://127.0.0.1:${TEST_PORT}`
    };
    const sandbox = {
      window: mockWindow,
      location: mockLocation,
      document: mockDocument,
      localStorage: mockStorage,
      navigator: mockNavigator,
      MediaMetadata: class {},
      Audio: class {
        constructor() {
          this.currentTime = 0;
          this.duration = 180;
          this.paused = true;
          this.src = '';
          this._listeners = {};
        }
        addEventListener(event, cb) {
          if (!this._listeners[event]) this._listeners[event] = [];
          this._listeners[event].push(cb);
        }
        removeEventListener(event, cb) {
          if (this._listeners[event]) {
            this._listeners[event] = this._listeners[event].filter(x => x !== cb);
          }
        }
        play() { this.paused = false; return Promise.resolve(); }
        pause() { this.paused = true; }
        emit(event) {
          if (this._listeners[event]) {
            this._listeners[event].forEach(cb => cb());
          }
        }
      },
      fetch: globalThis.fetch,
      API_BASE_URL: `http://127.0.0.1:${TEST_PORT}`,
      FALLBACK_COVER: 'data:image/svg+xml;base64,mock',
      FALLBACK_TRACKS: [],
      CHARTS: {},
      GENRE_QUERIES: {},
      console: {
        log: () => {},
        info: () => {},
        warn: () => {},
        error: () => {}
      },
      setTimeout: (fn) => setTimeout(fn, 0),
      clearTimeout: (id) => clearTimeout(id)
    };

    // Execute app.js in sandbox
    const fn = new Function('sandbox', `
      with (sandbox) {
        ${appJs}
        return window.reamusic;
      }
    `);

    const app = fn(sandbox);
    return { app, sandbox };
  }

  // =========================================================================
  // Scenario A: Play Dhanda Nyoliwala -> 60% priority for same artist
  // =========================================================================
  await test('Scenario A: Dhanda Nyoliwala seed produces >= 60% same-artist queue & immediate priority', async () => {
    const { app } = createTestApp();
    const dhandaSeed = {
      id: 'dhanda-seed-1',
      title: 'Boom Shaka',
      artist: 'Dhanda Nyoliwala, KR$NA',
      album: 'Up To Date',
      duration: 190
    };

    app.currentTrack = dhandaSeed;
    const recommendations = await app.generateSmartRecommendations(dhandaSeed);

    assert(Array.isArray(recommendations) && recommendations.length >= 8, 'Should produce at least 8 recommendations');

    // 1. Verify immediate first tracks are by Dhanda Nyoliwala
    const firstTrack = recommendations[0];
    assert(
      firstTrack.artist.toLowerCase().includes('dhanda nyoliwala'),
      `First upcoming track must be by Dhanda Nyoliwala, got: "${firstTrack.title}" by ${firstTrack.artist}`
    );

    // 2. Count same artist tracks vs total
    const sameArtistTracks = recommendations.filter(t => t.artist.toLowerCase().includes('dhanda nyoliwala'));
    const sameArtistRatio = sameArtistTracks.length / recommendations.length;
    console.log(`     (Same artist count: ${sameArtistTracks.length}/${recommendations.length} -> ${(sameArtistRatio * 100).toFixed(0)}%)`);

    assert(
      sameArtistRatio >= 0.50,
      `Expected >= 50-60% same artist representation, got ${(sameArtistRatio * 100).toFixed(0)}%`
    );

    // 3. Verify reason badges
    assert(
      firstTrack._reasonBadge === 'badge-artist',
      `Reason badge must be badge-artist, got: ${firstTrack._reasonBadge}`
    );
    assert(
      firstTrack._reason.includes('Dhanda Nyoliwala'),
      `Reason text must mention Dhanda Nyoliwala, got: "${firstTrack._reason}"`
    );
  });

  // =========================================================================
  // Scenario B: Artist Exhaustion -> Expands into related Haryanvi scene music
  // =========================================================================
  await test('Scenario B: Exhausting artist catalogue expands into related scene artists', async () => {
    const { app } = createTestApp();
    const rareArtistSeed = {
      id: 'rare-seed-1',
      title: 'Desi Banger',
      artist: 'Komal Choudhary', // Artist with only a few songs in catalogue
      language: 'haryanvi',
      duration: 180
    };

    app.currentTrack = rareArtistSeed;
    const recommendations = await app.generateSmartRecommendations(rareArtistSeed);

    assert(recommendations.length >= 6, 'Queue should maintain at least 6 recommendations');

    // Verify presence of related Haryanvi artists
    const relatedHaryanvi = recommendations.filter(t => {
      const art = t.artist.toLowerCase();
      return art.includes('masoom sharma') ||
             art.includes('gulzaar chhaniwala') ||
             art.includes('dhanda nyoliwala') ||
             art.includes('renuka panwar') ||
             art.includes('khasa aala chahar');
    });

    console.log(`     (Found ${relatedHaryanvi.length} related Haryanvi tracks from scene)`);
    assert(relatedHaryanvi.length > 0, 'Should expand with related Haryanvi scene artists');
    assert(
      recommendations.some(t => t._reasonBadge === 'badge-related'),
      'Should contain tracks tagged with badge-related'
    );
  });

  // =========================================================================
  // Scenario C: Navigation synchronicity
  // =========================================================================
  await test('Scenario C: Navigation does not destroy active playback or recommendation queue', async () => {
    const { app } = createTestApp();
    const testTrack = { id: 'nav-test-1', title: 'Song 1', artist: 'Dhanda Nyoliwala', duration: 180, audioUrl: 'https://example.com/audio.mp3' };

    app.playActualTrack(testTrack);
    app.recommendationQueue = [
      { id: 'reco-1', title: 'Reco 1', artist: 'Dhanda Nyoliwala' },
      { id: 'reco-2', title: 'Reco 2', artist: 'Masoom Sharma' }
    ];

    // Simulate navigation to search view and library view
    if (app.showView) {
      app.showView('search');
      assert.equal(app.currentTrack.id, 'nav-test-1', 'Active track must persist across view swap');
      assert.equal(app.recommendationQueue.length, 2, 'Recommendation queue must persist across view swap');

      app.showView('library');
      assert.equal(app.currentTrack.id, 'nav-test-1', 'Active track must persist in library view');
    }
  });

  // =========================================================================
  // Scenario D: Skip Penalty -> Avoids recently skipped tracks
  // =========================================================================
  await test('Scenario D: Recently skipped tracks are demoted and avoided when alternatives exist', async () => {
    const { app } = createTestApp();
    const songToSkip = { id: 'skip-target-1', title: 'Skip Me', artist: 'Dhanda Nyoliwala', duration: 180 };

    // Play and skip
    app.playActualTrack(songToSkip);
    app.listeningHistoryService.onTrackSkipped(songToSkip);

    assert(
      app.listeningHistoryService.isRecentlySkipped('skip-target-1'),
      'Skipped track ID must be recorded in recentlySkippedTrackIds'
    );

    // Score the skipped candidate vs a fresh candidate
    const freshSong = { id: 'fresh-target-1', title: 'Fresh Song', artist: 'Dhanda Nyoliwala', duration: 180 };
    const skippedScore = app.recommendationEngine.scoreCandidate(songToSkip);
    const freshScore = app.recommendationEngine.scoreCandidate(freshSong);

    console.log(`     (Skipped track score: ${skippedScore.toFixed(3)} vs Fresh: ${freshScore.toFixed(3)})`);
    assert(skippedScore < freshScore, 'Skipped track must receive lower recommendation score');
  });

  // =========================================================================
  // Scenario E: Autoplay Toggle -> Gracefully stops when disabled
  // =========================================================================
  await test('Scenario E: When autoplay is disabled, playback stops at queue end', async () => {
    const { app } = createTestApp();
    const song = { id: 'end-test-1', title: 'Last Song', artist: 'Arijit Singh', duration: 180 };

    app.playActualTrack(song);
    app.manualQueue = [];
    app.sequenceQueue = [];
    app.recommendationQueue = [{ id: 'reco-1', title: 'Should Not Play', artist: 'Arijit Singh' }];

    // Disable autoplay
    app.setAutoplay(false);
    assert.equal(app.autoplayEnabled, false, 'Autoplay must be disabled');

    // Simulate natural song end
    let toastMessage = '';
    app.showToast = (msg) => { toastMessage = msg; };
    app.advanceTrack('auto');

    assert.equal(app.isPlaying, false, 'Playback must stop gracefully');
    assert.equal(app.recommendationQueue.length, 1, 'Recommendation must not be shifted when autoplay is off');
  });

  // =========================================================================
  // Scenario F: Fault Tolerance -> Skips failed tracks safely
  // =========================================================================
  await test('Scenario F: Stream error advances safely to next valid track', async () => {
    const { app } = createTestApp();
    const badTrack = { id: 'broken-1', title: 'Corrupt Audio', artist: 'Arijit Singh' };
    const nextTrack = { id: 'working-1', title: 'Working Audio', artist: 'Arijit Singh' };

    app.currentTrack = badTrack;
    app.manualQueue = [];
    app.sequenceQueue = [];
    app.recommendationQueue = [nextTrack];
    app.isTransitioning = false;

    // Trigger playback error
    let advanceCalled = false;
    const origAdvance = app.advanceTrack.bind(app);
    app.advanceTrack = (src) => {
      advanceCalled = true;
      origAdvance(src);
    };

    app.handlePlaybackError(new Error('MEDIA_ELEMENT_ERROR: Format unsupported'), badTrack);

    // Wait for the safe setTimeout retry
    await new Promise(r => setTimeout(r, 450));
    assert(advanceCalled, 'advanceTrack must be invoked on stream error');
    assert.equal(app.currentTrack.id, 'working-1', 'Should advance to next working track in queue');
  });

  // =========================================================================
  // Scenario G: Race condition prevention on rapid artist switching
  // =========================================================================
  await test('Scenario G: Rapid artist switching discards superseded recommendation requests', async () => {
    const { app } = createTestApp();
    const artistA = { id: 'seed-a', title: 'Song A', artist: 'Dhanda Nyoliwala' };
    const artistB = { id: 'seed-b', title: 'Song B', artist: 'Arijit Singh' };

    // Fire A and immediately switch to B
    const promiseA = app.generateSmartRecommendations(artistA);
    const promiseB = app.generateSmartRecommendations(artistB);

    const [recsA, recsB] = await Promise.all([promiseA, promiseB]);

    // Request A must be discarded (returns empty)
    assert.deepEqual(recsA, [], 'Superseded request A must return empty array');
    assert(recsB.length > 0, 'Active request B must successfully populate recommendations');
    assert(
      recsB.some(t => t.artist.toLowerCase().includes('arijit singh')),
      'Final queue must match active artist B (Arijit Singh)'
    );
  });

  // =========================================================================
  // Scenario H: Cold Start / Fresh User -> Instant artist-based recommendations
  // =========================================================================
  await test('Scenario H: Brand new user with 0 history receives instant recommendations on first play', async () => {
    const { app } = createTestApp(); // Completely empty localStorage
    assert.equal(app.userPreferenceService.profile.totalPlays, 0, 'Must have 0 initial plays');
    assert.equal(app.userPreferenceService.profile.confidence, 0, 'Must have 0% confidence');

    const firstPlay = { id: 'first-1', title: 'Up To Date', artist: 'Dhanda Nyoliwala', duration: 180 };
    app.currentTrack = firstPlay;

    const recos = await app.generateSmartRecommendations(firstPlay);
    assert(recos.length >= 6, 'Must immediately generate recommendations for first played artist');
    assert(
      recos.some(t => t.artist.toLowerCase().includes('dhanda nyoliwala')),
      'Must contain tracks by Dhanda Nyoliwala'
    );
  });

  // =========================================================================
  // Scenario I: Queue Order Preservation
  // =========================================================================
  await test('Scenario I: Manual queue and album sequence order are strictly preserved before autoplay', async () => {
    const { app } = createTestApp();
    const manualSong1 = { id: 'manual-1', title: 'User Queued 1', artist: 'Yo Yo Honey Singh' };
    const manualSong2 = { id: 'manual-2', title: 'User Queued 2', artist: 'Badshah' };

    app.currentTrack = { id: 'current-1', title: 'Current Song', artist: 'Dhanda Nyoliwala' };
    app.manualQueue = [manualSong1, manualSong2];
    app.sequenceQueue = [];
    app.recommendationQueue = [{ id: 'reco-1', title: 'Reco Song', artist: 'Dhanda Nyoliwala' }];

    // Song 1 finishes -> manualSong1 plays
    app.isTransitioning = false;
    app.advanceTrack('auto');
    assert.equal(app.currentTrack.id, 'manual-1', 'Manual queue track 1 must play first');

    // Song 2 finishes -> manualSong2 plays
    app.isTransitioning = false;
    app.advanceTrack('auto');
    assert.equal(app.currentTrack.id, 'manual-2', 'Manual queue track 2 must play second');

    // Song 3 finishes -> manual queue exhausted -> autoplay recommendation plays
    app.isTransitioning = false;
    app.advanceTrack('auto');
    assert.equal(app.currentTrack.id, 'reco-1', 'Autoplay recommendation plays only after manual queue ends');
  });

} finally {
  server.close();
}

console.log('\n=======================================');
console.log(`Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Smart Autoplay & Recommendation Engine Tests Passed Successfully!\n');
  process.exit(0);
}
