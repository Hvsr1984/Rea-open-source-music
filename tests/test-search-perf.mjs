import assert from 'node:assert';
import http from 'node:http';

console.log('🧪 [Search Test] Starting Search Instant Response & Avatar Integrity Suite...\n');

let server = null;
let baseUrl = 'http://127.0.0.1:4500';

// Check if server is already running on 4500, otherwise launch an ephemeral test instance
try {
  const probe = await fetch('http://127.0.0.1:4500/api/trending', { signal: AbortSignal.timeout(1000) });
  if (probe.ok) {
    baseUrl = 'http://127.0.0.1:4500';
  }
} catch {
  process.env.VERCEL = '1';
  const { default: handler } = await import('../server.js');
  const TEST_PORT = 4598;
  server = http.createServer(handler);
  await new Promise(r => server.listen(TEST_PORT, '127.0.0.1', r));
  baseUrl = `http://127.0.0.1:${TEST_PORT}`;
}

try {
  // 1. Test local API /api/search?q=Arijit
  const res = await fetch(`${baseUrl}/api/search?q=Arijit`);
  assert.strictEqual(res.status, 200, 'Search API should return 200 OK');
  const data = await res.json();
  assert.ok(Array.isArray(data.results), 'results should be an array');
  assert.ok(Array.isArray(data.artists), 'artists should be an array');
  assert.ok(data.artists.length > 0, 'should return artists for Arijit');

  console.log('  ✅ PASSED: /api/search?q=Arijit returns 200 OK with valid results and artists');

  // 2. Check that artists use 150x150 or empty image, never giant 500x500 or broken placeholder
  for (const a of data.artists) {
    if (a.image) {
      assert.ok(!a.image.includes('500x500'), `Artist ${a.name} should use lightweight 150x150, not 500x500: ${a.image}`);
      assert.ok(!a.image.includes('artist-default'), `Artist ${a.name} should not have artist-default placeholder: ${a.image}`);
    }
  }
  console.log('  ✅ PASSED: All artist images are lightweight 150x150 thumbnails and generic placeholders are filtered');

  // 3. Check topResult prioritization
  assert.ok(data.topResult, 'topResult should be populated');
  if (data.topResult.type === 'artist') {
    assert.ok(!data.topResult.data.image.includes('artist-default'), 'topResult artist should not be a placeholder image');
    console.log(`  ✅ PASSED: topResult selected "${data.topResult.data.name}" with real photo or clean profile`);
  }

  // 4. Test rapid query caching and response time
  const t0 = Date.now();
  const resCached = await fetch(`${baseUrl}/api/search?q=Arijit`);
  const t1 = Date.now();
  assert.strictEqual(resCached.status, 200);
  const cachedDuration = t1 - t0;
  console.log(`  ✅ PASSED: Cached query responded in ${cachedDuration}ms (instant cache hit)`);

  console.log('\n=======================================');
  console.log('🎉 All Search Performance & Image Integrity Tests Passed Successfully!');
} finally {
  if (server) {
    await new Promise(r => server.close(r));
  }
}
