#!/usr/bin/env node
/**
 * tests/smoke-test.js
 * Automated End-to-End Smoke Test for REA Music Web Server and API Router
 */
import http from 'node:http';

// Set VERCEL env before importing server.js to prevent duplicate auto-listen
process.env.VERCEL = '1';

const { default: handler } = await import('../server.js');

const TEST_PORT = 4599;
let server;

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${TEST_PORT}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🧪 [REA Smoke Tests] Starting local server test suite...\n');

  server = http.createServer(handler);
  await new Promise(resolve => server.listen(TEST_PORT, '127.0.0.1', resolve));
  console.log(`📡 Test server running on http://127.0.0.1:${TEST_PORT}\n`);

  let passed = 0;
  let failed = 0;

  async function testCase(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAILED: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // Test 1: Single Page Application entrypoint
  await testCase('GET / returns 200 OK and HTML content', async () => {
    const res = await request('/');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (!res.headers['content-type']?.includes('text/html')) throw new Error('Not text/html');
    if (!res.body.includes('REA Music')) throw new Error('Body missing "REA Music"');
  });

  // Test 2: Static asset serving
  await testCase('GET /assets/logo.jpg returns 200 OK and image/jpeg', async () => {
    const res = await request('/assets/logo.jpg');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (!res.headers['content-type']?.includes('image/jpeg')) throw new Error('Not image/jpeg');
  });

  // Test 3: API Router /api/trending
  await testCase('GET /api/trending returns 200 OK with valid schema', async () => {
    const res = await request('/api/trending');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.quickPicks && !json.songs && !Array.isArray(json)) {
      throw new Error('Unexpected JSON schema for trending');
    }
  });

  // Test 4: API Router /api/search (Unified Search with topResult, artists, albums, songs)
  await testCase('GET /api/search?q=Arijit returns unified results with songs, artists, albums, topResult', async () => {
    const res = await request('/api/search?q=Arijit');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.results || !Array.isArray(json.results)) throw new Error('Missing results array');
    if (!json.artists || !Array.isArray(json.artists)) throw new Error('Missing artists array');
    if (!json.albums || !Array.isArray(json.albums)) throw new Error('Missing albums array');
    if (!json.topResult) throw new Error('Missing topResult object');
  });

  // Test 5: API Router /api/song
  await testCase('GET /api/song?id=KGfDrbWe returns track details and related songs', async () => {
    const res = await request('/api/song?id=KGfDrbWe');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.track || !json.track.id || !json.track.title) throw new Error('Invalid track object in /api/song');
    if (!json.related || !Array.isArray(json.related)) throw new Error('Missing related array in /api/song');
  });

  // Test 6: API Router /api/album
  await testCase('GET /api/album?id=38682222 returns album details and tracklist', async () => {
    const res = await request('/api/album?id=38682222');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.id || !json.title || !json.songs) throw new Error('Invalid album object in /api/album');
    if (!Array.isArray(json.songs) || json.songs.length === 0) throw new Error('Album songs array empty');
  });

  // Test 7: API Router /api/artist
  await testCase('GET /api/artist?id=459320&name=Arijit+Singh returns artist profile and topSongs', async () => {
    const res = await request('/api/artist?id=459320&name=Arijit+Singh');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.name || !json.topSongs) throw new Error('Invalid artist object in /api/artist');
    if (!Array.isArray(json.topSongs)) throw new Error('Missing topSongs array');
  });

  // Test 8: SPA Route Fallback for detail pages
  await testCase('Direct detail routes (/search, /artist/459320, /song/KGfDrbWe, /album/38682222) serve SPA HTML', async () => {
    const routes = ['/search?q=Arijit', '/artist/459320', '/song/KGfDrbWe', '/album/38682222'];
    for (const route of routes) {
      const res = await request(route);
      if (res.statusCode !== 200) throw new Error(`Route ${route} returned status ${res.statusCode}`);
      if (!res.headers['content-type']?.includes('text/html')) throw new Error(`Route ${route} not text/html`);
      if (!res.body.includes('viewSearch') || !res.body.includes('viewArtist')) throw new Error(`Route ${route} missing detail views in HTML`);
    }
  });

  // Test 9: Recommendations Engine API
  await testCase('GET /api/recommendations returns 200 OK with recommendations array', async () => {
    const res = await request('/api/recommendations?artist=Arijit+Singh&trackId=KGfDrbWe');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.recommendations || !Array.isArray(json.recommendations)) throw new Error('Missing recommendations array');
    if (json.recommendations.length === 0) throw new Error('Recommendations array is empty');
    if (!json.trendingSearches || !Array.isArray(json.trendingSearches)) throw new Error('Missing trendingSearches array');
  });

  // Test 10: 3-Tier Queue Architecture and Autoplay Toggle Elements
  await testCase('HTML contains 3-tier queue sections (Now Playing, Manual, Recommended) and Autoplay toggles', async () => {
    const res = await request('/');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const body = res.body;
    if (!body.includes('queueNowPlayingCard')) throw new Error('Missing queueNowPlayingCard');
    if (!body.includes('queueManualList')) throw new Error('Missing queueManualList');
    if (!body.includes('queueRecommendedList')) throw new Error('Missing queueRecommendedList');
    if (!body.includes('barAutoplayBtn')) throw new Error('Missing barAutoplayBtn in player bar');
    if (!body.includes('queueAutoplayToggle')) throw new Error('Missing queueAutoplayToggle');
    if (!body.includes('songAddToQueueBtn')) throw new Error('Missing songAddToQueueBtn in song view hero');
    if (!body.includes('maxQueuePane')) throw new Error('Missing maxQueuePane in maximized player');
  });

  // Test 11: Play/Pause and Audio Engine Controls Integrity
  await testCase('js/app.js defines functional playback controls (togglePlayPause, engine.play, spacebar shortcut)', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const appJs = fs.readFileSync(path.resolve('./js/app.js'), 'utf8');

    if (!/togglePlayPause\s*\([^)]*\)\s*\{/.test(appJs)) {
      throw new Error('togglePlayPause() method is missing from REAMusicApp in js/app.js');
    }
    if (!/play\s*\([^)]*\)\s*\{[\s\S]*?return\s+this\.resume\(\);?[\s\S]*?\}/.test(appJs)) {
      throw new Error('play() method alias is missing from HybridAudioEngine in js/app.js');
    }
    if (!appJs.includes('this.playPauseBtn.addEventListener')) {
      throw new Error('playPauseBtn listener is missing in js/app.js');
    }
    if (!appJs.includes('this.maxPlayPauseBtn.addEventListener')) {
      throw new Error('maxPlayPauseBtn listener is missing in js/app.js');
    }
  });

  // Test 12: Full-Screen Queue Scrolling Layout and Hierarchy Integrity
  await testCase('Full-Screen Player contains scrollable maxQueueContent and recommended-track-list layout', async () => {
    const res = await request('/');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    const body = res.body;
    if (!body.includes('id="maxQueueContent"')) throw new Error('Missing maxQueueContent in HTML');
    if (!body.includes('queue-panel-content')) throw new Error('Missing queue-panel-content class');
    if (!body.includes('recommended-track-list')) throw new Error('Missing recommended-track-list class');
    if (!body.includes('.max-queue-content')) throw new Error('Missing .max-queue-content CSS rules');
    if (!body.includes('overscroll-behavior-y: contain')) throw new Error('Missing overscroll-behavior-y containment');
  });

  // Test 13: Search Results Play Button and Playback Integration Integrity
  await testCase('js/app.js & css/index.css define functional search result play button and playback flow', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const appJs = fs.readFileSync(path.resolve('./js/app.js'), 'utf8');
    const css = fs.readFileSync(path.resolve('./css/index.css'), 'utf8');

    // 1. playSearchTrack method defined
    if (!/playSearchTrack\s*\([^)]*\)\s*\{/.test(appJs)) {
      throw new Error('playSearchTrack() method is missing from REAMusicApp in js/app.js');
    }
    // 2. No invalid playTrackAtIndex calls anywhere
    if (appJs.includes('playTrackAtIndex')) {
      throw new Error('Invalid playTrackAtIndex call found in js/app.js');
    }
    // 3. Search play button delegates properly
    if (!appJs.includes('.search-item-play-btn')) {
      throw new Error('search-item-play-btn reference missing in js/app.js');
    }
    if (!appJs.includes('playSearchTrack(track')) {
      throw new Error('playSearchTrack invocation missing in search item click handling');
    }
    // 4. Play/Pause UI synchronization for search items
    if (!appJs.includes('.search-item-play-btn[data-track-id]')) {
      throw new Error('Search item play button state synchronization missing in updatePlayPauseUI()');
    }
    // 5. CSS styles for search actions and playing states
    if (!css.includes('.search-item-play-btn') || !css.includes('.search-item-play-btn.is-playing')) {
      throw new Error('Search play button CSS styles missing in css/index.css');
    }
  });

  // Close server
  await new Promise(resolve => server.close(resolve));
  console.log('\n=======================================');
  console.log(`Results: ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All smoke tests passed successfully!');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  if (server) server.close();
  process.exit(1);
});
