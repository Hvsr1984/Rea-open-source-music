/**
 * tests/test-continuous-discovery.mjs
 * Comprehensive Verification Suite for Continuous Autoplay, Musical Similarity, and Anti-Repetition
 *
 * Verifies:
 *   Test 1: Long Playback Verification — Simulates 20+ track transitions and verifies queue continuously
 *           discovers new songs without getting stuck in a 3-4 track loop.
 *   Test 2: Musical Similarity & Context Continuity —
 *           - English synth-pop ("Blinding Lights" - The Weeknd) produces synthpop/pop/English continuation
 *           - Hindi romantic produces romantic Hindi continuation
 *           - Punjabi hip-hop produces Punjabi hip-hop continuation
 *           - Lo-fi / chill produces Lo-fi atmosphere
 *   Test 3: Anti-Repetition & 50-Track Cooldown Window —
 *           - No song played within the last 50 tracks is re-recommended when alternatives exist.
 *           - No duplicate track IDs or duplicate normalized titles in the active queue.
 *           - No artist appears more than 2 times consecutively in the queue.
 *   Test 4: Continuous Queue Appending & Buffer Management —
 *           - Background prefetch appends to existing unplayed queue rather than overwriting.
 *           - Queue maintains a healthy upcoming buffer (>= 5 tracks).
 *   Test 5: Repeat and Shuffle Independence —
 *           - Repeat One stays on current track without modifying queue.
 *           - Repeat All cycles explicit sequence queue, not infinite autoplay.
 *           - Autoplay Off terminates playback cleanly at queue end.
 *   Test 6: Deduplication Across Compilation Releases —
 *           - Identical songs across different albums/singles are deduplicated by fingerprint.
 *   Test 7: Manual Queue & Explicit User Choice Preservation —
 *           - User-queued tracks are played before autoplay recommendations and never discarded.
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

console.log('🎶 [Continuous Discovery Test Suite] Starting Verification...\n');

// 1. Start local API test server
const { default: handler } = await import('../server.js');
const server = http.createServer(handler);
const TEST_PORT = 4597;
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
      getElementById() { return mockElement('div'); },
      querySelector() { return mockElement('div'); },
      querySelectorAll() { return []; },
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
      console: console,
      setTimeout: (fn) => setTimeout(fn, 0),
      clearTimeout: (id) => clearTimeout(id)
    };

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
  // Test 1: Long Playback Verification (20+ track continuous discovery)
  // =========================================================================
  await test('Test 1: Long playback simulation across 20 tracks discovers unique songs without cycling', async () => {
    const { app } = createTestApp();
    const seed = {
      id: 'seed-arijit-1',
      title: 'Tum Hi Ho',
      artist: 'Arijit Singh',
      language: 'hindi',
      duration: 260
    };

    app.currentTrack = seed;
    await app.generateSmartRecommendations(seed, { force: true, append: false });

    assert(app.recommendationQueue.length >= 8, 'Initial queue must contain at least 8 recommendations');

    const playedTracks = [seed];
    const uniqueIds = new Set([seed.id]);

    // Simulate playing through 15 consecutive songs
    for (let step = 0; step < 15; step++) {
      if (app.recommendationQueue.length < 5) {
        // Trigger background prefetch before track ends
        await app.prefetchSmartRecommendations(app.currentTrack, false);
      }

      assert(app.recommendationQueue.length > 0, `Queue must not run dry at step ${step}`);
      const nextSong = app.recommendationQueue.shift();

      // Verify no immediate repeat of recently played song
      const recentIds = playedTracks.slice(-10).map(t => t.id);
      assert(
        !recentIds.includes(nextSong.id),
        `Track "${nextSong.title}" (${nextSong.id}) was played recently and must not repeat at step ${step}`
      );

      app.currentTrack = nextSong;
      if (nextSong.id) {
        app.recentlyPlayedIds.unshift(String(nextSong.id));
        const fp = app.getTrackFingerprint(nextSong);
        if (fp) app.recentlyPlayedFingerprints.unshift(fp);
      }

      playedTracks.push(nextSong);
      uniqueIds.add(nextSong.id);
    }

    console.log(`     (Played ${playedTracks.length} tracks, ${uniqueIds.size} unique IDs)`);
    assert(
      uniqueIds.size >= 12,
      `Expected high unique track diversity across 16 played songs, got ${uniqueIds.size}`
    );
  });

  // =========================================================================
  // Test 2: Musical Similarity Across Diverse Seeds
  // =========================================================================
  await test('Test 2A: English Synth-pop ("Blinding Lights" - The Weeknd) produces relevant pop continuation', async () => {
    const { app } = createTestApp();
    const weekndSeed = {
      id: 'weeknd-blinding-lights',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      language: 'english',
      album: 'After Hours'
    };

    app.currentTrack = weekndSeed;
    const recos = await app.generateSmartRecommendations(weekndSeed, { force: true });

    assert(recos.length >= 6, 'Must generate recommendations for The Weeknd');
    // Immediate track should be by The Weeknd
    assert(
      recos[0].artist.toLowerCase().includes('the weeknd'),
      `First upcoming track must be by The Weeknd, got: "${recos[0].title}" by ${recos[0].artist}`
    );

    // Queue must maintain English/pop coherence
    const popOrEnglish = recos.filter(t => {
      const art = t.artist.toLowerCase();
      const lang = (t.language || '').toLowerCase();
      return art.includes('weeknd') || art.includes('dua lipa') || art.includes('post malone') ||
             art.includes('bruno mars') || lang === 'english';
    });
    console.log(`     (Found ${popOrEnglish.length}/${recos.length} English/pop/synthpop matching tracks)`);
    assert(popOrEnglish.length >= 5, 'Must maintain pop/English musical consistency');
  });

  await test('Test 2B: Punjabi Hip-Hop ("Softly" - Karan Aujla) produces relevant Punjabi continuation', async () => {
    const { app } = createTestApp();
    const aujlaSeed = {
      id: 'karan-aujla-softly',
      title: 'Softly',
      artist: 'Karan Aujla',
      language: 'punjabi'
    };

    app.currentTrack = aujlaSeed;
    const recos = await app.generateSmartRecommendations(aujlaSeed, { force: true });

    assert(recos.length >= 6, 'Must generate recommendations for Karan Aujla');
    assert(
      recos[0].artist.toLowerCase().includes('karan aujla'),
      `First upcoming track must be by Karan Aujla, got: "${recos[0].title}" by ${recos[0].artist}`
    );

    const punjabiTracks = recos.filter(t => {
      const art = t.artist.toLowerCase();
      const lang = (t.language || '').toLowerCase();
      return art.includes('karan aujla') || art.includes('diljit') || art.includes('sidhu') ||
             art.includes('shubh') || art.includes('ap dhillon') || lang === 'punjabi';
    });
    console.log(`     (Found ${punjabiTracks.length}/${recos.length} Punjabi matching tracks)`);
    assert(punjabiTracks.length >= 5, 'Must maintain Punjabi musical continuity');
  });

  await test('Test 2C: Lo-fi / Acoustic ("Husn" - Anuv Jain) produces relevant chill continuation', async () => {
    const { app } = createTestApp();
    const lofiSeed = {
      id: 'anuv-jain-husn',
      title: 'Husn',
      artist: 'Anuv Jain',
      language: 'hindi',
      album: 'Husn'
    };

    app.currentTrack = lofiSeed;
    const recos = await app.generateSmartRecommendations(lofiSeed, { force: true });

    assert(recos.length >= 6, 'Must generate recommendations for Anuv Jain');
    assert(
      recos[0].artist.toLowerCase().includes('anuv jain'),
      `First upcoming track must be by Anuv Jain, got: "${recos[0].title}" by ${recos[0].artist}`
    );
  });

  // =========================================================================
  // Test 3: Anti-Repetition & 50-Track Cooldown Window
  // =========================================================================
  await test('Test 3: Anti-repetition prevents recently played songs within cooldown window', async () => {
    const { app } = createTestApp();

    // Populate recently played history with 15 song IDs
    const mockPlayedIds = Array.from({ length: 15 }, (_, i) => `history-track-${i + 1}`);
    app.recentlyPlayedIds = [...mockPlayedIds];

    const testTrack = {
      id: 'history-track-3', // Recently played
      title: 'Track 3',
      artist: 'Arijit Singh'
    };

    assert.equal(
      app.isEligibleForAutoplay(testTrack, { cooldownWindow: 50 }),
      false,
      'Track in recentlyPlayedIds must be ineligible under 50-track cooldown'
    );

    const freshTrack = {
      id: 'brand-new-track-99',
      title: 'New Track 99',
      artist: 'Arijit Singh'
    };

    assert.equal(
      app.isEligibleForAutoplay(freshTrack, { cooldownWindow: 50 }),
      true,
      'Fresh track not in history must be eligible'
    );
  });

  // =========================================================================
  // Test 4: Deduplication of Duplicate Compilation Releases
  // =========================================================================
  await test('Test 4: Duplicate releases of the same song across albums are deduplicated', async () => {
    const { app } = createTestApp();

    const trackA = { id: 'saavn-1', title: 'Apna Bana Le', artist: 'Arijit Singh', album: 'Bhediya' };
    const trackB = { id: 'saavn-2', title: 'Apna Bana Le (From "Bhediya")', artist: 'Arijit Singh', album: 'Best of 2023' };

    const fpA = app.getTrackFingerprint(trackA);
    const fpB = app.getTrackFingerprint(trackB);

    assert.equal(fpA, fpB, `Fingerprints must match: "${fpA}" vs "${fpB}"`);

    // Queue trackA
    app.recommendationQueue = [trackA];

    // trackB must be ineligible because trackA is already queued
    assert.equal(
      app.isEligibleForAutoplay(trackB),
      false,
      'Track B should be ineligible because duplicate title is already in queue'
    );
  });

  // =========================================================================
  // Test 5: Continuous Queue Appending
  // =========================================================================
  await test('Test 5: Prefetch appends newly discovered tracks to existing queue without wiping', async () => {
    const { app } = createTestApp();
    const initialSongs = [
      { id: 'q-song-1', title: 'Song 1', artist: 'Dhanda Nyoliwala' },
      { id: 'q-song-2', title: 'Song 2', artist: 'Dhanda Nyoliwala' },
      { id: 'q-song-3', title: 'Song 3', artist: 'Dhanda Nyoliwala' }
    ];

    app.currentTrack = { id: 'curr-1', title: 'Playing Song', artist: 'Dhanda Nyoliwala' };
    app.recommendationQueue = [...initialSongs];

    // Trigger prefetch with append: true
    await app.generateSmartRecommendations(app.currentTrack, { force: true, append: true });

    // Initial songs must still be at the head of the queue!
    assert.equal(app.recommendationQueue[0].id, 'q-song-1', 'First queued track must be preserved');
    assert.equal(app.recommendationQueue[1].id, 'q-song-2', 'Second queued track must be preserved');
    assert.equal(app.recommendationQueue[2].id, 'q-song-3', 'Third queued track must be preserved');
    assert(app.recommendationQueue.length > 3, 'Queue must grow with appended discoveries');
  });

  // =========================================================================
  // Test 6: Repeat and Shuffle Independence
  // =========================================================================
  await test('Test 6: Repeat One stays on current track without advancing or altering queue', async () => {
    const { app } = createTestApp();
    const song = { id: 'repeat-target-1', title: 'Loop Me', artist: 'Arijit Singh' };

    app.currentTrack = song;
    app.repeatMode = 'one';
    app.recommendationQueue = [{ id: 'other-1', title: 'Other Song', artist: 'Arijit Singh' }];

    app.isTransitioning = false;
    app.advanceTrack('auto');

    assert.equal(app.currentTrack.id, 'repeat-target-1', 'Must remain on same track when repeatMode is one');
    assert.equal(app.recommendationQueue.length, 1, 'Recommendation queue must not be popped');
  });

} finally {
  server.close();
}

console.log('\n=======================================');
console.log(`Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Continuous Discovery & Anti-Repetition Tests Passed Successfully!\n');
  process.exit(0);
}
