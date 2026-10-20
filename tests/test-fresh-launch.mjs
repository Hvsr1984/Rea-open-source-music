/**
 * tests/test-fresh-launch.mjs
 * Verification test for REA Music — Fix Default Song on Fresh App Launch
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 [REA Test] Starting Fresh App Launch Empty Player Verification Suite...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failed++;
  }
}

// 1. Static HTML Inspection across index.html, public/index.html, dist/index.html
const htmlFiles = [
  path.join(rootDir, 'index.html'),
  path.join(rootDir, 'public', 'index.html'),
  path.join(rootDir, 'dist', 'index.html')
];

for (const file of htmlFiles) {
  const relName = path.relative(rootDir, file);
  const content = fs.readFileSync(file, 'utf8');

  // Must have player-bar is-empty
  assert(
    content.includes('class="player-bar is-empty" id="playerBar"') ||
    content.includes('id="playerBar" class="player-bar is-empty"'),
    `${relName} initializes bottom player bar with .is-empty class`
  );

  // Must have playerEmptyContainer with clean music icon, "Nothing playing", and subtitle hint
  assert(
    content.includes('id="playerEmptyContainer"') &&
    content.includes('Nothing playing') &&
    content.includes('Choose a song to start listening'),
    `${relName} contains playerEmptyContainer with "Nothing playing" and hint text`
  );

  // Must NOT have hardcoded Casa Tupka in the bottom player bar initial HTML
  const playerBarHtml = content.substring(content.indexOf('id="playerBar"'), content.indexOf('</footer>', content.indexOf('id="playerBar"')));
  assert(
    !playerBarHtml.includes('Casa Tupka Anthem'),
    `${relName} bottom player bar HTML does not leak "Casa Tupka Anthem"`
  );
  assert(
    !playerBarHtml.includes('Yo Yo Honey Singh'),
    `${relName} bottom player bar HTML does not leak "Yo Yo Honey Singh"`
  );

  // Player thumb container, meta, actions must start hidden
  assert(
    playerBarHtml.includes('id="playerThumbContainer" style="display:none;"') ||
    playerBarHtml.includes('id="playerThumbContainer" style="display: none;"'),
    `${relName} playerThumbContainer is hidden on fresh launch`
  );
  assert(
    playerBarHtml.includes('id="playerMeta" style="display:none;"') ||
    playerBarHtml.includes('id="playerMeta" style="display: none;"'),
    `${relName} playerMeta is hidden on fresh launch`
  );
  assert(
    playerBarHtml.includes('id="playerActions" style="display:none;"') ||
    playerBarHtml.includes('id="playerActions" style="display: none;"'),
    `${relName} playerActions is hidden on fresh launch`
  );

  // Scrubber must start at 0% and 0:00
  assert(
    playerBarHtml.includes('id="progressFill" style="width: 0%;"') ||
    playerBarHtml.includes('id="progressFill" style="width:0%;"'),
    `${relName} progressFill width starts at 0%`
  );
  assert(
    playerBarHtml.includes('id="timeTotal">0:00</span>'),
    `${relName} timeTotal starts at 0:00`
  );

  // Maximized player artwork must not leak Casa Tupka
  const maxArtHtml = content.substring(content.indexOf('id="maxAlbumArt"'), content.indexOf('>', content.indexOf('id="maxAlbumArt"')));
  assert(
    !maxArtHtml.includes('casa_tupka.jpg'),
    `${relName} maxAlbumArt does not point to hardcoded casa_tupka.jpg`
  );
}

// 2. JS State and Logic Inspection (js/app.js)
const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');

assert(
  appJs.includes('this.currentTrack = null;') &&
  appJs.includes('this.queue = [];') &&
  appJs.includes('this.currentTrackIndex = -1;') &&
  appJs.includes('this.isPlaying = false;'),
  'js/app.js initializes currentTrack as null, queue as empty, and currentTrackIndex as -1'
);

// Verify no hardcoded track assignment in constructor
assert(
  !/this\.currentTrack\s*=\s*\{\s*id:\s*['"]chart-1['"]/.test(appJs),
  'js/app.js constructor does not assign hardcoded chart-1 track to currentTrack'
);

// Verify rank-active is not hardcoded to track.rank === 1
assert(
  !appJs.includes("track.rank === 1 ? ' rank-active' : ''"),
  'js/app.js renderExplore does not unconditionally assign rank-active to track.rank === 1'
);

// Verify guard in advanceTrack
assert(
  appJs.includes('if (!this.currentTrack && (!this.manualQueue || this.manualQueue.length === 0)'),
  'js/app.js advanceTrack safely guards empty track state'
);

// Verify guard in updateProgressBar
assert(
  appJs.includes('updateProgressBar(cur, dur) {\n    if (!this.currentTrack) {'),
  'js/app.js updateProgressBar resets displays to 0:00 when !this.currentTrack'
);

// Verify guard in maximizePlayer
assert(
  appJs.includes('maximizePlayer() {\n    if (!this.currentTrack) return;'),
  'js/app.js maximizePlayer does not open empty theater when !this.currentTrack'
);

// 3. CSS Inspection (css/index.css)
const css = fs.readFileSync(path.join(rootDir, 'css', 'index.css'), 'utf8');

assert(
  css.includes('.player-bar.is-empty') &&
  css.includes('.player-empty-container') &&
  css.includes('.player-empty-icon') &&
  css.includes('.player-empty-title') &&
  css.includes('.player-empty-hint'),
  'css/index.css defines complete styling for player-empty-container and its elements'
);

assert(
  css.includes('.player-bar.is-empty .progress-bar-fill') &&
  css.includes('width: 0% !important;'),
  'css/index.css guarantees progress fill remains 0% in empty player'
);

assert(
  css.includes('.player-bar.is-empty .progress-container') &&
  css.includes('pointer-events: none;'),
  'css/index.css disables progress bar pointer events in empty state'
);

// 4. Server Route and HTTP Content Test
process.env.VERCEL = '1';
const { default: handler } = await import('../server.js');
const TEST_PORT = 4788;
const server = http.createServer(handler);

await new Promise(resolve => server.listen(TEST_PORT, '127.0.0.1', resolve));

try {
  const html = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${TEST_PORT}/`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });

  assert(
    html.includes('class="player-bar is-empty" id="playerBar"') ||
    html.includes('id="playerBar" class="player-bar is-empty"'),
    'HTTP GET / serves index.html with .player-bar.is-empty'
  );

  assert(
    html.includes('Nothing playing') && html.includes('Choose a song to start listening'),
    'HTTP GET / serves empty player with "Nothing playing" hint'
  );

  const playerBarInServedHtml = html.substring(html.indexOf('id="playerBar"'), html.indexOf('</footer>', html.indexOf('id="playerBar"')));
  assert(
    !playerBarInServedHtml.includes('Casa Tupka Anthem'),
    'HTTP GET / player bar HTML does not leak "Casa Tupka Anthem"'
  );
} finally {
  await new Promise(resolve => server.close(resolve));
}

console.log('\n=======================================');
console.log(`Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Fresh App Launch Empty Player Tests Passed Successfully!');
  process.exit(0);
}
