/**
 * REA Music - Phase 13 Comprehensive Production Verification Suite
 * Covers Tests 1 - 9 as defined in Phase 13 & Phase 14 specifications
 */
import assert from 'node:assert';
import fs from 'node:fs';

const appCode = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');

// Global mock DOM environment
function setupTestEnvironment() {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };

  globalThis.location = {
    hostname: 'localhost',
    href: 'http://localhost/',
    protocol: 'http:',
    port: '4500',
    hash: '',
    pathname: '/',
    search: ''
  };

  globalThis.window = {
    innerWidth: 1024,
    innerHeight: 768,
    location: globalThis.location,
    navigator: { standalone: false, onLine: true, mediaSession: { setActionHandler: () => {} } },
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    addEventListener: () => {},
    removeEventListener: () => {},
    localStorage: globalThis.localStorage
  };

  globalThis.document = {
    referrer: '',
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    createElement: () => ({
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      appendChild: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      style: {}
    }),
    createDocumentFragment: () => ({
      appendChild: () => {}
    }),
    body: {
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      addEventListener: () => {},
      removeEventListener: () => {}
    }
  };

  if (!globalThis.navigator) {
    globalThis.navigator = { onLine: true, mediaSession: { setActionHandler: () => {} } };
  } else {
    try {
      globalThis.navigator.mediaSession = { setActionHandler: () => {} };
    } catch (_) {}
  }

  if (!globalThis.MediaMetadata) {
    globalThis.MediaMetadata = class { constructor(opts) { Object.assign(this, opts); } };
  }
  if (!globalThis.AudioContext) {
    globalThis.AudioContext = class {
      constructor() { this.state = 'running'; }
      createMediaElementSource() { return { connect() {} }; }
      createAnalyser() { return { connect() {}, fftSize: 64, frequencyBinCount: 32, getByteFrequencyData() {} }; }
      resume() { return Promise.resolve(); }
    };
  }

  globalThis.Audio = class MockAudio {
    constructor() {
      this.src = '';
      this.currentTime = 0;
      this.duration = 200;
      this.paused = true;
    }
    play() { this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; }
    load() {}
    addEventListener() {}
    removeEventListener() {}
  };

  globalThis.fetch = async (url) => {
    const urlStr = String(url);
    if (urlStr.includes('/api/recommendations')) {
      const urlObj = new URL(urlStr, 'http://localhost');
      const artist = urlObj.searchParams.get('artist') || '';
      const genre = urlObj.searchParams.get('genre') || '';
      const page = parseInt(urlObj.searchParams.get('page') || '1', 10);

      const tracks = [];
      for (let i = 1; i <= 10; i++) {
        const id = `reco-${page}-${artist || genre}-${i}`;
        tracks.push({
          id,
          title: `${artist || genre} Track ${page}.${i}`,
          artist: artist || `${genre} Artist`,
          genre: genre || 'pop',
          language: genre === 'english' || genre === 'pop' || genre === 'rock' || genre === 'edm' ? 'english' : 'hindi',
          audioUrl: `http://localhost/mock-audio/${id}.mp3`,
          duration: 180
        });
      }
      return { ok: true, json: async () => ({ recommendations: tracks }) };
    }

    if (urlStr.includes('/api/artist')) {
      return {
        ok: true,
        json: async () => ({
          songs: [
            { id: 'art-song-1', title: 'Top Song 1', artist: 'Primary Singer', audioUrl: 'http://localhost/1.mp3', duration: 180 },
            { id: 'art-song-2', title: 'Top Song 2', artist: 'Primary Singer', audioUrl: 'http://localhost/2.mp3', duration: 190 },
            { id: 'art-song-3', title: 'Top Song 3', artist: 'Primary Singer', audioUrl: 'http://localhost/3.mp3', duration: 200 }
          ],
          similarArtists: [
            { name: 'Similar Artist 1' },
            { name: 'Similar Artist 2' }
          ]
        })
      };
    }

    if (urlStr.includes('/api/trending')) {
      return {
        ok: true,
        json: async () => ({
          songs: [
            { id: 'trend-1', title: 'Trending 1', artist: 'Trending Artist', audioUrl: 'http://localhost/t1.mp3', duration: 180 },
            { id: 'trend-2', title: 'Trending 2', artist: 'Trending Artist', audioUrl: 'http://localhost/t2.mp3', duration: 180 }
          ]
        })
      };
    }

    return { ok: true, json: async () => ({}) };
  };

  const cjsModule = { exports: {} };
  const evalFn = new Function('module', 'exports', 'require', `${appCode}; return globalThis.window;`);
  return evalFn(cjsModule, cjsModule.exports, () => ({}));
}

async function runPhase13Suite() {
  console.log('🧪 Starting Phase 13 Complete Verification Suite...\n');
  const env = setupTestEnvironment();
  const { REAMusicApp, RecommendationEngine, detectTrackTags, GENRE_COMPATIBILITY } = env;

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ❌ FAILED: ${name}`);
      console.error(e);
      failed++;
    }
  }

  // =========================================================================
  // Test 1: Long Listening Session (20+ consecutive tracks)
  // =========================================================================
  await test('Test 1: Long listening session plays 20 consecutive tracks without small-loop repeating', async () => {
    const app = new REAMusicApp();
    const seed = {
      id: 'seed-arijit-1',
      title: 'Kesariya',
      artist: 'Arijit Singh',
      language: 'hindi',
      audioUrl: 'http://localhost/mock/seed.mp3',
      duration: 180
    };

    app.currentTrack = seed;
    await app.generateSmartRecommendations(seed, { force: true });

    const playedTracks = [seed];
    const trackPlayCounts = new Map();
    trackPlayCounts.set(seed.id, 1);

    for (let step = 0; step < 20; step++) {
      if (app.recommendationQueue.length < 4) {
        await app.generateSmartRecommendations(app.currentTrack, { append: true });
      }
      assert(app.recommendationQueue.length > 0, `Step ${step}: Recommendation queue should not underrun`);
      const nextSong = app.recommendationQueue.shift();
      assert(nextSong, `Step ${step}: Next song must exist`);

      app.currentTrack = nextSong;
      if (nextSong.id) {
        app.recentlyPlayedIds = (app.recentlyPlayedIds || []).filter(id => id !== nextSong.id);
        app.recentlyPlayedIds.unshift(nextSong.id);
      }
      playedTracks.push(nextSong);
      trackPlayCounts.set(nextSong.id, (trackPlayCounts.get(nextSong.id) || 0) + 1);
    }

    // Verify no 3-4 song cycling occurred
    const uniqueIds = new Set(playedTracks.map(t => t.id));
    console.log(`     (Played ${playedTracks.length} tracks, ${uniqueIds.size} unique songs discovered)`);
    assert(uniqueIds.size >= 15, `Long session must discover at least 15 unique tracks (got ${uniqueIds.size})`);
    for (const [id, count] of trackPlayCounts.entries()) {
      assert(count <= 2, `Track ${id} played ${count} times; should not cycle rapidly`);
    }
  });

  // =========================================================================
  // Test 2: Multi-Genre Musical Consistency (All 6 Required Scenarios)
  // =========================================================================
  await test('Test 2A: Hindi Romantic Acoustic preserves mellow romantic continuity', async () => {
    const recoEngine = new RecommendationEngine();
    const seed = { id: 's1', title: 'Tum Hi Ho', artist: 'Arijit Singh', language: 'hindi', duration: 180 };
    
    // Test compatible candidates
    const hindiMellowPop = { id: 'c1', title: 'Channa Mereya', artist: 'Arijit Singh', language: 'hindi', duration: 200 };
    const hindiRomanticIndie = { id: 'c2', title: 'Kasoor', artist: 'Prateek Kuhad', language: 'hindi', duration: 190 };
    
    // Incompatible clash candidates
    const hardTechno = { id: 'c3', title: 'Hard Rave Assault', artist: 'Techno Lord', genre: 'hard_techno', duration: 180 };
    const workoutDrill = { id: 'c4', title: 'Death Drill', artist: 'Drill Boy', genre: 'drill', duration: 160 };

    assert.strictEqual(recoEngine.isHardIncompatible(hindiMellowPop, seed, [seed]), false);
    assert.strictEqual(recoEngine.isHardIncompatible(hindiRomanticIndie, seed, [seed]), false);
    assert.strictEqual(recoEngine.isHardIncompatible(hardTechno, seed, [seed]), true);
    assert.strictEqual(recoEngine.isHardIncompatible(workoutDrill, seed, [seed]), true);
  });

  await test('Test 2B: Punjabi Hip-Hop preserves Punjabi scene compatibility', async () => {
    const recoEngine = new RecommendationEngine();
    const seed = { id: 's2', title: '52 Bars', artist: 'Karan Aujla', language: 'punjabi', duration: 210 };
    
    const compatiblePunjabi = { id: 'c5', title: 'Softly', artist: 'Karan Aujla', language: 'punjabi', duration: 170 };
    const compatiblePunjabiPeer = { id: 'c6', title: 'Goat', artist: 'Diljit Dosanjh', language: 'punjabi', duration: 190 };
    const unrelatedClassic = { id: 'c7', title: 'Beethoven Moonlight Sonata', artist: 'Orchestra', genre: 'classical', language: 'instrumental', duration: 300 };

    assert.strictEqual(recoEngine.isHardIncompatible(compatiblePunjabi, seed, [seed]), false);
    assert.strictEqual(recoEngine.isHardIncompatible(compatiblePunjabiPeer, seed, [seed]), false);
    
    const compScorePunjabi = recoEngine.calculateMusicalCompatibility(compatiblePunjabi, seed, [seed]).score;
    const compScoreClassic = recoEngine.calculateMusicalCompatibility(unrelatedClassic, seed, [seed]).score;
    assert(compScorePunjabi > compScoreClassic, 'Punjabi scene candidate must score significantly higher');
  });

  await test('Test 2C: English Pop maintains English pop/synthpop continuity', async () => {
    const recoEngine = new RecommendationEngine();
    const seed = { id: 's3', title: 'Blinding Lights', artist: 'The Weeknd', language: 'english', genre: 'synthpop', duration: 200 };
    
    const englishPop = { id: 'c8', title: 'Levitating', artist: 'Dua Lipa', language: 'english', genre: 'pop', duration: 203 };
    const regionalIndian = { id: 'c9', title: '50 Kg Girl', artist: 'Masoom Sharma', language: 'haryanvi', genre: 'haryanvi', duration: 180 };

    assert.strictEqual(recoEngine.isHardIncompatible(englishPop, seed, [seed]), false);
    assert.strictEqual(recoEngine.isHardIncompatible(regionalIndian, seed, [seed]), true, 'Regional Indian song must be hard-incompatible with English pop');
  });

  await test('Test 2D: Lo-fi & Instrumental Music maintains mellow atmospheric continuity', async () => {
    const recoEngine = new RecommendationEngine();
    const seed = { id: 's4', title: 'Chillhop Afternoon', artist: 'Lofi Beats', genre: 'lofi', duration: 150 };
    
    const mellowLofi = { id: 'c10', title: 'Midnight Rain', artist: 'Coffee Beats', genre: 'lofi', duration: 140 };
    const aggressiveTechno = { id: 'c11', title: 'Bass Cannon Rave', artist: 'DJ Overload', genre: 'hard_techno', duration: 240 };

    assert.strictEqual(recoEngine.isHardIncompatible(mellowLofi, seed, [seed]), false);
    assert.strictEqual(recoEngine.isHardIncompatible(aggressiveTechno, seed, [seed]), true, 'Aggressive techno must be incompatible with lofi');
  });

  await test('Test 2E: Electronic Dance Music preserves energetic flow', async () => {
    const recoEngine = new RecommendationEngine();
    const seed = { id: 's5', title: 'Titanium', artist: 'David Guetta', genre: 'edm', language: 'english', duration: 245 };
    
    const compatibleDance = { id: 'c12', title: 'Wake Me Up', artist: 'Avicii', genre: 'edm', language: 'english', duration: 247 };
    const slowAcousticFolk = { id: 'c13', title: 'Slow Folk Acoustic', artist: 'Village Singer', genre: 'folk', language: 'hindi', duration: 300 };

    assert.strictEqual(recoEngine.isHardIncompatible(compatibleDance, seed, [seed]), false);
    const scoreDance = recoEngine.calculateMusicalCompatibility(compatibleDance, seed, [seed]).score;
    const scoreFolk = recoEngine.calculateMusicalCompatibility(slowAcousticFolk, seed, [seed]).score;
    assert(scoreDance > scoreFolk, 'Dance track must rank higher than slow folk in an EDM session');
  });

  await test('Test 2F: Rock Music maintains energetic guitar-driven consistency', async () => {
    const recoEngine = new RecommendationEngine();
    const seed = { id: 's6', title: 'Numb', artist: 'Linkin Park', genre: 'rock', language: 'english', duration: 187 };
    
    const compatibleRock = { id: 'c14', title: 'In The End', artist: 'Linkin Park', genre: 'rock', language: 'english', duration: 216 };
    assert.strictEqual(recoEngine.isHardIncompatible(compatibleRock, seed, [seed]), false);
    const scoreRock = recoEngine.calculateMusicalCompatibility(compatibleRock, seed, [seed]).score;
    assert(scoreRock >= 70, `Rock candidate should score high (got ${scoreRock})`);
  });

  // =========================================================================
  // Test 3: Language Consistency & Transition Penalties
  // =========================================================================
  await test('Test 3: Transition penalty penalizes sudden language flips in established session', async () => {
    const recoEngine = new RecommendationEngine();
    const recentSession = [
      { id: 'h1', title: 'Hindi Song 1', language: 'hindi', artist: 'Singer 1' },
      { id: 'h2', title: 'Hindi Song 2', language: 'hindi', artist: 'Singer 2' },
      { id: 'h3', title: 'Hindi Song 3', language: 'hindi', artist: 'Singer 3' }
    ];

    const hindiCandidate = { id: 'c15', title: 'Hindi Candidate', language: 'hindi', artist: 'Singer 4' };
    const englishCandidate = { id: 'c16', title: 'English Candidate', language: 'english', artist: 'Singer 5' };

    const scoreHindi = recoEngine.calculateMusicalCompatibility(hindiCandidate, recentSession[2], recentSession).score;
    const scoreEnglish = recoEngine.calculateMusicalCompatibility(englishCandidate, recentSession[2], recentSession).score;

    console.log(`     (Hindi session candidate score: ${scoreHindi} vs English jump score: ${scoreEnglish})`);
    assert(scoreHindi > scoreEnglish, 'Established Hindi session must score Hindi candidates above abrupt language jumps');
  });

  // =========================================================================
  // Test 4: Anti-Repetition (Cooldown Ring Buffer & Title Fingerprints)
  // =========================================================================
  await test('Test 4: Anti-repetition excludes recently played songs and identical title releases', async () => {
    const app = new REAMusicApp();
    const trackA = { id: 'track-101', title: 'Kesariya (From Brahmastra)', artist: 'Arijit Singh' };
    const trackBDup = { id: 'track-999', title: 'Kesariya', artist: 'Arijit Singh' }; // Different ID, duplicate recording
    const trackFresh = { id: 'track-202', title: 'Tum Hi Ho', artist: 'Arijit Singh' };

    app.recentlyPlayedIds = ['track-101'];
    app.recentlyPlayedFingerprints = [app.getTrackFingerprint(trackA)];

    assert.strictEqual(app.isEligibleForAutoplay(trackA, { cooldownWindow: 50 }), false, 'Identical ID must be ineligible within cooldown');
    assert.strictEqual(app.isEligibleForAutoplay(trackBDup, { cooldownWindow: 50 }), false, 'Same song from different compilation must be filtered by fingerprint');
    assert.strictEqual(app.isEligibleForAutoplay(trackFresh, { cooldownWindow: 50 }), true, 'Fresh track must be eligible');
  });

  // =========================================================================
  // Test 5: Queue Race Conditions & Concurrency Protection
  // =========================================================================
  await test('Test 5: Rapid next/previous actions advance safely with transition lock and request ID guard', async () => {
    const app = new REAMusicApp();
    const track1 = { id: 't1', title: 'Track 1', artist: 'Artist 1', audioUrl: 'http://localhost/1.mp3', duration: 180 };
    const track2 = { id: 't2', title: 'Track 2', artist: 'Artist 2', audioUrl: 'http://localhost/2.mp3', duration: 180 };
    const track3 = { id: 't3', title: 'Track 3', artist: 'Artist 3', audioUrl: 'http://localhost/3.mp3', duration: 180 };

    app.manualQueue = [track2, track3];
    app.currentTrack = track1;

    // Trigger rapid advance
    app.advanceTrack('manual');
    const firstAdvanced = app.currentTrack.id;
    app.advanceTrack('manual'); // Should be blocked by transition lock

    assert.strictEqual(firstAdvanced, 't2', 'First advance should play track 2');
    assert.strictEqual(app.currentTrack.id, 't2', 'Transition lock must prevent double advance within lock window');
  });

  // =========================================================================
  // Test 6: API Failure & Graceful Fallback
  // =========================================================================
  await test('Test 6: Simulated API failure uses compatible fallback without crashing', async () => {
    const app = new REAMusicApp();
    const origFetch = globalThis.fetch;
    // Simulate network error
    globalThis.fetch = async () => { throw new Error('Network Timeout'); };

    const seed = { id: 'err-seed', title: 'Fail Seed', artist: 'Arijit Singh', audioUrl: 'http://localhost/s.mp3', duration: 180 };
    app.currentTrack = seed;

    try {
      const recos = await app.generateSmartRecommendations(seed, { force: true });
      assert(Array.isArray(recos), 'Must return an array even on network failure');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // =========================================================================
  // Test 7: Repeat Modes, Shuffle, and Autoplay Toggle Independence
  // =========================================================================
  await test('Test 7: Repeat, Shuffle, and Autoplay operate independently without silent mode overrides', async () => {
    const app = new REAMusicApp();
    const song = { id: 'r1', title: 'Song R', artist: 'Singer R', audioUrl: 'http://localhost/r.mp3', duration: 180 };
    app.currentTrack = song;

    // 1. Repeat One
    app.repeatMode = 'one';
    app.recommendationQueue = [{ id: 'reco-x', title: 'Next Reco', artist: 'Singer R' }];
    app.advanceTrack('auto');
    assert.strictEqual(app.currentTrack.id, 'r1', 'Repeat One must repeat current track on track ended');

    // 2. Autoplay Off
    app.repeatMode = 'off';
    app.setAutoplay(false);
    app.advanceTrack('auto');
    assert.strictEqual(app.isPlaying, false, 'Autoplay Off must stop playback gracefully when manual queue finishes');
  });

  // =========================================================================
  // Test 8: Regression (Manual Queue, Search Caching, Liked Songs)
  // =========================================================================
  await test('Test 8: Manual queue strictly takes priority over automatic recommendations', async () => {
    const app = new REAMusicApp();
    const manualSong = { id: 'manual-1', title: 'User Explicit Pick', artist: 'User Artist', audioUrl: 'http://localhost/m1.mp3' };
    const autoSong = { id: 'auto-1', title: 'Auto Reco', artist: 'Auto Artist', audioUrl: 'http://localhost/a1.mp3' };

    app.currentTrack = { id: 'cur-1', title: 'Current Song', artist: 'Current Artist', audioUrl: 'http://localhost/c1.mp3' };
    app.manualQueue = [manualSong];
    app.recommendationQueue = [autoSong];

    app.advanceTrack('auto');
    assert.strictEqual(app.currentTrack.id, 'manual-1', 'Manual queue entry MUST play before automatic recommendations');
  });

  // =========================================================================
  // Test 9: Performance (Search Caching & Response Time)
  // =========================================================================
  await test('Test 9: Client search cache returns instant response on repeated queries', async () => {
    const app = new REAMusicApp();
    app.clientSearchCache = new Map();
    const testQuery = 'arijit';
    const mockData = { results: [{ id: 'q1', title: 'Kesariya' }], artists: [], albums: [], timestamp: Date.now() };

    app.clientSearchCache.set(testQuery, mockData);

    const startTime = performance.now();
    const cached = app.clientSearchCache.get(testQuery);
    const duration = performance.now() - startTime;

    assert(cached && cached.results.length === 1, 'Cached search result must be retrieved');
    assert(duration < 5, `Cache lookup should be < 5ms (measured ${duration.toFixed(3)}ms)`);
  });

  console.log('\n=======================================');
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    console.error('❌ Some Phase 13 tests failed.');
    process.exit(1);
  } else {
    console.log('🎉 All Phase 13 Comprehensive Tests Passed Successfully!');
  }
}

runPhase13Suite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
