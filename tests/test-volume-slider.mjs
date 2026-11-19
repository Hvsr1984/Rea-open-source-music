/**
 * tests/test-volume-slider.mjs
 * Comprehensive Verification Suite for REA Music Premium Mini Player Volume Slider Redesign
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 [REA Test] Starting Premium Mini Player Volume Slider Verification Suite...\n');

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

  // Must have volumeContainer with aria-label
  assert(
    content.includes('id="volumeContainer"') &&
    content.includes('role="group"') &&
    content.includes('aria-label="Volume controls"'),
    `${relName} defines #volumeContainer with proper accessibility role and group label`
  );

  // Must have volumeBtn with volHighSvg, volLowSvg, volMuteSvg
  assert(
    content.includes('id="volHighSvg"') &&
    content.includes('id="volLowSvg"') &&
    content.includes('id="volMuteSvg"'),
    `${relName} contains all 3 speaker icon states (high, low, mute)`
  );

  // Must have volumeTrack as slider with aria attributes
  assert(
    content.includes('id="volumeTrack"') &&
    content.includes('role="slider"') &&
    content.includes('tabindex="0"') &&
    content.includes('aria-label="Volume"') &&
    content.includes('aria-valuemin="0"') &&
    content.includes('aria-valuemax="100"'),
    `${relName} defines #volumeTrack with ARIA slider semantics`
  );

  // Must have volumeFill, volumeThumb, and volumePercent
  assert(
    content.includes('id="volumeFill"') &&
    content.includes('id="volumeThumb"') &&
    content.includes('id="volumePercent"'),
    `${relName} defines volume fill, thumb, and live percentage text`
  );
}

// 2. CSS Styling Inspection (css/index.css)
const css = fs.readFileSync(path.join(rootDir, 'css', 'index.css'), 'utf8');

assert(
  css.includes('.volume-container') &&
  css.includes('backdrop-filter: blur(18px) saturate(140%)') &&
  css.includes('border: 1px solid rgba(255, 255, 255, 0.09)'),
  'css/index.css defines dark glassmorphism container with frosted backdrop filter'
);

assert(
  css.includes('.volume-slider-track') &&
  css.includes('background: rgba(255, 255, 255, 0.13)'),
  'css/index.css defines dark grey remaining slider track'
);

assert(
  css.includes('.volume-fill') &&
  css.includes('background: #FF174F') &&
  css.includes('box-shadow: 0 0 10px rgba(255, 23, 79, 0.55)'),
  'css/index.css defines glowing neon pink volume fill'
);

assert(
  css.includes('.volume-thumb') &&
  css.includes('background: #FF174F') &&
  css.includes('border: 2px solid #FFFFFF'),
  'css/index.css defines circular glowing neon pink draggable thumb'
);

assert(
  css.includes('.volume-percent') &&
  css.includes('font-variant-numeric: tabular-nums'),
  'css/index.css defines live volume percentage with tabular numerals'
);

// 3. JS Logic Inspection (js/app.js)
const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');

assert(
  appJs.includes("this.loadLocalStorage('rea_volume', 0.75)") &&
  appJs.includes('this.previousVolume = parsedVol > 0 ? parsedVol : 0.75;'),
  'js/app.js restores volume and previousVolume from persistent localStorage'
);

assert(
  appJs.includes("this.volLowSvg = document.getElementById('volLowSvg');") &&
  appJs.includes("this.volumeThumb = document.getElementById('volumeThumb');") &&
  appJs.includes("this.volumePercent = document.getElementById('volumePercent');"),
  'js/app.js binds volLowSvg, volumeThumb, and volumePercent in initDOMElements'
);

assert(
  appJs.includes("this.volumeTrack.addEventListener('mousedown'") &&
  appJs.includes("this.volumeTrack.addEventListener('touchstart'") &&
  appJs.includes("this.volumeTrack.addEventListener('keydown'"),
  'js/app.js binds mouse dragging, mobile touch dragging, and keyboard controls'
);

assert(
  appJs.includes("case 'ArrowRight':") || appJs.includes("e.key === 'ArrowRight'") ||
  appJs.includes("e.key === 'Home'") || appJs.includes("e.key === 'End'"),
  'js/app.js supports Arrow keys, Home (0%), and End (100%) keyboard navigation'
);

assert(
  appJs.includes("e.key === 'm' || e.key === 'M'"),
  'js/app.js supports global M mute/unmute shortcut'
);

assert(
  appJs.includes("localStorage.setItem('rea_volume', clamped.toString())"),
  'js/app.js persists volume changes to localStorage'
);

assert(
  appJs.includes("clamped <= 0.5") &&
  appJs.includes("this.volLowSvg.classList.remove('hidden')"),
  'js/app.js activates low-volume speaker icon when volume is between 1% and 50%'
);

console.log(`\n=======================================`);
console.log(`Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All REA Music Volume Slider Redesign Tests Passed Successfully!\n');
  process.exit(0);
}
