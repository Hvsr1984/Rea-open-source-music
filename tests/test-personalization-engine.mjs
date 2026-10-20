import assert from 'node:assert/strict';
import http from 'node:http';

process.env.VERCEL = '1';

console.log('🎵 [REA Personalization Tests] Starting Verification Suite...\n');

// 1. Verify API Endpoints for Recommendations and Multi-Genre Cold Start Pools
const { default: handler } = await import('../server.js');
const server = http.createServer(handler);
const TEST_PORT = 4596;
await new Promise(r => server.listen(TEST_PORT, '127.0.0.1', r));

async function fetchJson(path) {
  const res = await fetch(`http://127.0.0.1:${TEST_PORT}${path}`);
  if (!res.ok) throw new Error(`Fetch failed ${path}: ${res.status}`);
  return res.json();
}

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASSED: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAILED: ${name} ->`, err.message);
    failed++;
  }
}

try {
  // Test 1: Cold start API returns diverse regional pools
  await test('API: /api/trending?category=all returns parallel cold-start pools (Haryanvi, Bollywood, Indie, Punjabi)', async () => {
    const data = await fetchJson('/api/trending?category=all');
    assert(Array.isArray(data.quickPicks) && data.quickPicks.length > 0, 'Missing quickPicks');
    assert(Array.isArray(data.trendingHits) && data.trendingHits.length > 0, 'Missing trendingHits');
    assert(Array.isArray(data.punjabiHits) && data.punjabiHits.length > 0, 'Missing punjabiHits');
    assert(Array.isArray(data.haryanviHits) && data.haryanviHits.length > 0, 'Missing haryanviHits');
    assert(Array.isArray(data.bollywoodHits) && data.bollywoodHits.length > 0, 'Missing bollywoodHits');
    assert(Array.isArray(data.indieHits) && data.indieHits.length > 0, 'Missing indieHits');
    console.log(`     (Found: ${data.haryanviHits.length} Haryanvi, ${data.bollywoodHits.length} Bollywood, ${data.indieHits.length} Indie)`);
  });

  // Test 2: Recommendations for Dhanda Nyoliwala returns actual catalogue songs
  await test('API: /api/recommendations?artist=Dhanda+Nyoliwala returns authentic catalogue songs', async () => {
    const data = await fetchJson('/api/recommendations?artist=Dhanda+Nyoliwala&limit=15');
    assert(Array.isArray(data.recommendations) && data.recommendations.length > 0, 'No recommendations returned');
    assert(data.recommendations.some(t => t.artist.toLowerCase().includes('dhanda nyoliwala')), 'Expected Dhanda Nyoliwala tracks in recommendations');
    console.log(`     (First recommendation: "${data.recommendations[0].title}" by ${data.recommendations[0].artist})`);
  });

  // Test 3: Recommendation Engine and Services logic simulation
  await test('Engine: Tag Detection correctly identifies Dhanda Nyoliwala as Haryanvi and Karan Aujla as Punjabi', async () => {
    // Import tag detection from a simulated context or read app.js
    const fs = await import('node:fs');
    const path = await import('node:path');
    const appJs = fs.readFileSync(path.resolve('./js/app.js'), 'utf8');

    // Extract tag detection function and classes using eval in isolated scope
    const sandbox = {
      localStorage: {
        _store: {},
        getItem(k) { return this._store[k] || null; },
        setItem(k, v) { this._store[k] = String(v); },
        removeItem(k) { delete this._store[k]; }
      },
      API_BASE_URL: `http://127.0.0.1:${TEST_PORT}`,
      FALLBACK_COVER: 'data:image/svg',
      console
    };

    const fn = new Function('sandbox', `
      with (sandbox) {
        ${appJs.substring(appJs.indexOf('const REGIONAL_ARTISTS = {'), appJs.indexOf('class REAMusicApp {'))}
        return {
          REGIONAL_ARTISTS,
          detectTrackTags,
          ListeningHistoryService,
          UserPreferenceService,
          ArtistAffinityService,
          TrackSimilarityService,
          RecommendationEngine
        };
      }
    `);

    const {
      detectTrackTags,
      ListeningHistoryService,
      UserPreferenceService,
      ArtistAffinityService,
      TrackSimilarityService,
      RecommendationEngine
    } = fn(sandbox);

    const dhandaTrack = { id: 'dhanda-1', title: 'Boom Shaka', artist: 'Dhanda Nyoliwala, KR$NA', album: 'Up To Date', duration: 190 };
    const dhandaTags = detectTrackTags(dhandaTrack);
    assert(dhandaTags.genres.includes('haryanvi'), 'Dhanda Nyoliwala should be tagged with genre: haryanvi');
    assert(dhandaTags.languages.includes('haryanvi'), 'Dhanda Nyoliwala should be tagged with language: haryanvi');

    const aujlaTrack = { id: 'aujla-1', title: 'Tauba Tauba', artist: 'Karan Aujla', album: 'Bad Newz', duration: 207 };
    const aujlaTags = detectTrackTags(aujlaTrack);
    assert(aujlaTags.genres.includes('punjabi'), 'Karan Aujla should be tagged with genre: punjabi');

    const arijitTrack = { id: 'arijit-1', title: 'Kesariya', artist: 'Arijit Singh, Pritam', album: 'Brahmastra', duration: 268 };
    const arijitTags = detectTrackTags(arijitTrack);
    assert(arijitTags.genres.includes('bollywood'), 'Arijit Singh should be tagged with genre: bollywood');
    assert(arijitTags.languages.includes('hindi'), 'Arijit Singh should be tagged with language: hindi');
  });

  // Test 4: Cold Start Confidence & Preference Evolution
  await test('Engine: Fresh user starts at 0% confidence, rises after playing Dhanda Nyoliwala', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const appJs = fs.readFileSync(path.resolve('./js/app.js'), 'utf8');

    const mockStorage = {
      _store: {},
      getItem(k) { return this._store[k] || null; },
      setItem(k, v) { this._store[k] = String(v); },
      removeItem(k) { delete this._store[k]; }
    };

    const sandbox = {
      localStorage: mockStorage,
      API_BASE_URL: `http://127.0.0.1:${TEST_PORT}`,
      FALLBACK_COVER: 'data:image/svg',
      console
    };

    const fn = new Function('sandbox', `
      with (sandbox) {
        ${appJs.substring(appJs.indexOf('const REGIONAL_ARTISTS = {'), appJs.indexOf('class REAMusicApp {'))}
        return {
          ListeningHistoryService,
          UserPreferenceService,
          ArtistAffinityService,
          TrackSimilarityService,
          RecommendationEngine
        };
      }
    `);

    const {
      ListeningHistoryService,
      UserPreferenceService,
      ArtistAffinityService,
      TrackSimilarityService,
      RecommendationEngine
    } = fn(sandbox);

    const prefService = new UserPreferenceService();
    const affService = new ArtistAffinityService(prefService);
    const simService = new TrackSimilarityService();
    const recoEngine = new RecommendationEngine(prefService, affService, simService);
    const historyService = new ListeningHistoryService(prefService);

    // Initial state: Confidence must be 0
    assert.equal(prefService.profile.confidence, 0, 'Cold start confidence must be 0');
    assert.equal(affService.getTopArtists().length, 0, 'No top artists initially');

    // Action 1: User plays Dhanda Nyoliwala
    const song = { id: 'dhanda-101', title: 'Up To Date', artist: 'Dhanda Nyoliwala', duration: 180 };
    historyService.onTrackStarted(song, { type: 'search' });

    assert(prefService.profile.totalPlays === 1, 'Total plays should increment to 1');
    assert(prefService.profile.confidence > 0, 'Confidence must increase after first play');
    assert(affService.getAffinity('Dhanda Nyoliwala') > 0, 'Dhanda Nyoliwala affinity must be recorded');
    console.log(`     (Confidence after 1 play: ${prefService.profile.confidence * 100}%)`);

    // Action 2: User completes track and likes it
    historyService.onTrackCompleted(song);
    historyService.onTrackLiked(song, true);
    assert(prefService.profile.confidence >= 0.20, 'Confidence should reach light listener threshold');

    const topArtists = affService.getTopArtists();
    assert.equal(topArtists[0].artist, 'dhanda nyoliwala', 'Top artist must be dhanda nyoliwala');

    // Action 3: Candidate ranking prioritizes Dhanda Nyoliwala and related Haryanvi tracks
    const candidates = [
      { id: 'rel-1', title: '50 Kg Girl', artist: 'Masoom Sharma', album: '50 Kg', duration: 180 },
      { id: 'rel-2', title: 'Boom Shaka', artist: 'Dhanda Nyoliwala', album: 'Boom', duration: 190 },
      { id: 'rel-3', title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', duration: 240 },
      { id: 'rel-4', title: 'Tauba Tauba', artist: 'Karan Aujla', album: 'Bad Newz', duration: 200 }
    ];

    const ranked = recoEngine.rankTracks(candidates, [song], 3);
    assert.equal(ranked[0].id, 'rel-2', 'Dhanda Nyoliwala track must rank #1');
    assert.equal(ranked[1].id, 'rel-1', 'Related Haryanvi track (Masoom Sharma) must rank #2');
    console.log(`     (Ranked top 2: "${ranked[0].title}" by ${ranked[0].artist}, "${ranked[1].title}" by ${ranked[1].artist})`);

    // Action 4: User marks track "Not interested"
    historyService.onExplicitDislike(ranked[0]);
    const afterDislikeRanked = recoEngine.rankTracks(candidates, [song], 3);
    assert(!afterDislikeRanked.some(t => t.id === 'rel-2'), 'Disliked track must be excluded from recommendations');

    // Action 5: User clears history & resets preferences
    prefService.resetPreferences();
    historyService.clearHistory();
    assert.equal(prefService.profile.confidence, 0, 'Reset must restore confidence to 0%');
    assert.equal(prefService.profile.totalPlays, 0, 'Reset must restore plays to 0');
  });

  // Test 5: Verify Home Shelves and Contextual Menu in Bundled HTML
  await test('HTML/DOM: index.html contains all 9 cold-start sections and options modal', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const html = fs.readFileSync(path.resolve('./index.html'), 'utf8');

    assert(html.includes('id="personalizedShelf"'), 'Missing #personalizedShelf');
    assert(html.includes('id="jumpBackInShelf"'), 'Missing #jumpBackInShelf');
    assert(html.includes('id="homeReleasesShelf"'), 'Missing #homeReleasesShelf (New Releases)');
    assert(html.includes('id="homeChartsShelf"'), 'Missing #homeChartsShelf (Official Rankings)');
    assert(html.includes('id="quickPicksShelf"'), 'Missing #quickPicksShelf (India Superhits)');
    assert(html.includes('id="trendingShelf"'), 'Missing #trendingShelf (Trending in India)');
    assert(html.includes('id="moodsShelf"'), 'Missing #moodsShelf (Moods & Genres)');
    assert(html.includes('id="focusShelf"'), 'Missing #focusShelf (Punjabi Hits)');
    assert(html.includes('id="haryanviShelf"'), 'Missing #haryanviShelf (Haryanvi Hits)');
    assert(html.includes('id="bollywoodShelf"'), 'Missing #bollywoodShelf (Bollywood Essentials)');
    assert(html.includes('id="indieShelf"'), 'Missing #indieShelf (Independent Artists)');
    assert(html.includes('id="discoverArtistsShelf"'), 'Missing #discoverArtistsShelf (Discover Artists)');

    assert(html.includes('id="trackOptionsBackdrop"'), 'Missing #trackOptionsBackdrop modal');
    assert(html.includes('id="optPlayNext"'), 'Missing #optPlayNext');
    assert(html.includes('id="optAddQueue"'), 'Missing #optAddQueue');
    assert(html.includes('id="optMoreLikeThis"'), 'Missing #optMoreLikeThis');
    assert(html.includes('id="optNotInterested"'), 'Missing #optNotInterested');
    assert(html.includes('id="optShowLessArtist"'), 'Missing #optShowLessArtist');

    assert(html.includes('id="tasteProfileCard"'), 'Missing #tasteProfileCard');
    assert(html.includes('class="taste-confidence-bar"'), 'Missing .taste-confidence-bar');
    assert(html.includes('id="tasteConfidenceFill"'), 'Missing #tasteConfidenceFill');
    assert(html.includes('id="clearListeningHistoryBtn"'), 'Missing #clearListeningHistoryBtn');
    assert(html.includes('id="resetRecommendationsBtn"'), 'Missing #resetRecommendationsBtn');
  });

} finally {
  server.close();
}

console.log('\n=======================================');
console.log(`Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Personalization & Recommendation Engine tests passed successfully!');
  process.exit(0);
}
