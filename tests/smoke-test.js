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
