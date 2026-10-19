/**
 * tests/test-queue-scroll.mjs
 * Automated Layout, Hierarchy, and Scrolling Verification Test for REA Music Full-Screen Player
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 [REA Test] Starting Full-Screen Queue Scrolling Layout Verification...\n');

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

// 1. Inspect HTML Structure in index.html, public/index.html, dist/index.html
const htmlFiles = [
  path.join(rootDir, 'index.html'),
  path.join(rootDir, 'public', 'index.html'),
  path.join(rootDir, 'dist', 'index.html')
];

for (const file of htmlFiles) {
  const relName = path.relative(rootDir, file);
  const content = fs.readFileSync(file, 'utf8');

  assert(
    content.includes('id="maxQueuePane"') && !content.includes('class="max-panel-pane max-queue-pane queue-panel'),
    `${relName} defines maxQueuePane without leaking drawer queue-panel class`
  );

  assert(
    content.includes('id="maxQueueContent"') && content.includes('queue-panel-content'),
    `${relName} defines maxQueueContent with queue-panel-content class`
  );

  assert(
    content.includes('id="maxQueueRecommendedList"') && content.includes('recommended-track-list'),
    `${relName} defines maxQueueRecommendedList with recommended-track-list class`
  );

  // Check hierarchy order: max-pane-header -> maxQueueContent -> (NowPlaying, Manual, Recommended)
  const headerIdx = content.indexOf('class="max-pane-header"');
  const contentIdx = content.indexOf('id="maxQueueContent"');
  const nowPlayingIdx = content.indexOf('id="maxQueueNowPlayingCard"');
  const manualListIdx = content.indexOf('id="maxQueueManualList"');
  const recoListIdx = content.indexOf('id="maxQueueRecommendedList"');

  assert(
    headerIdx > 0 && contentIdx > headerIdx,
    `${relName}: header stays at the top before maxQueueContent scroll container`
  );

  assert(
    contentIdx < nowPlayingIdx && nowPlayingIdx < manualListIdx && manualListIdx < recoListIdx,
    `${relName}: all 3 queue sections are nested inside maxQueueContent in order`
  );
}

// 2. Inspect CSS in css/index.css
const cssContent = fs.readFileSync(path.join(rootDir, 'css', 'index.css'), 'utf8');

assert(
  cssContent.includes('.max-queue-pane') &&
  cssContent.includes('min-height: 0') &&
  cssContent.includes('flex-direction: column'),
  'css/index.css defines vertical flex layout for .max-queue-pane with min-height: 0'
);

assert(
  cssContent.includes('.max-queue-content') &&
  cssContent.includes('overflow-y: auto') &&
  cssContent.includes('overscroll-behavior-y: contain') &&
  cssContent.includes('-webkit-overflow-scrolling: touch'),
  'css/index.css defines .max-queue-content with native overflow-y: auto and overscroll containment'
);

assert(
  cssContent.includes('.recommended-track-list') &&
  cssContent.includes('min-height: min-content'),
  'css/index.css defines .recommended-track-list with min-height: min-content'
);

assert(
  cssContent.includes('.queue-section') &&
  cssContent.includes('flex-shrink: 0'),
  'css/index.css guarantees .queue-section does not shrink'
);

assert(
  cssContent.includes('.max-queue-content::-webkit-scrollbar'),
  'css/index.css styles the native scrollbar for .max-queue-content'
);

// 3. Inspect JS in js/app.js
const jsContent = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');

assert(
  jsContent.includes("this.maxQueueContent = document.getElementById('maxQueueContent')"),
  'js/app.js binds maxQueueContent element'
);

assert(
  jsContent.includes("maxQueueHeader.addEventListener('wheel'"),
  'js/app.js adds mouse-wheel event listener on max-pane-header to scroll maxQueueContent'
);

assert(
  jsContent.includes("this.maxQueuePane = document.getElementById('maxQueuePane')") &&
  jsContent.includes("[this.queuePanel, this.maxQueuePane].forEach"),
  'js/app.js preserves unified queue click event delegation'
);

console.log('\n=======================================');
console.log(`Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 Full-Screen Queue Scrolling Verification Suite Passed Successfully!\n');
  process.exit(0);
}
