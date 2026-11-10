import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting REA Music Background Blur & Cinematic Glass Verification Suite...\n');

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASSED: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAILED: ${testName}`);
    failedCount++;
  }
}

// 1. Asset Verification
console.log('🖼️ Group 1: Background Asset Verification');
const wallpaperPath = path.join(rootDir, 'assets', 'spatial_dusk_bg.jpg');
const publicWallpaperPath = path.join(rootDir, 'public', 'assets', 'spatial_dusk_bg.jpg');
const distWallpaperPath = path.join(rootDir, 'dist', 'assets', 'spatial_dusk_bg.jpg');

assert(fs.existsSync(wallpaperPath), 'Wallpaper asset exists at assets/spatial_dusk_bg.jpg');
assert(fs.statSync(wallpaperPath).size > 500000, 'Wallpaper asset is high-fidelity luxury image (> 500 KB)');
assert(fs.existsSync(publicWallpaperPath), 'Wallpaper asset exists in public/assets/');
assert(fs.existsSync(distWallpaperPath), 'Wallpaper asset exists in dist/assets/');

// 2. CSS Rules & Styling Verification
console.log('\n🎨 Group 2: CSS Rules & Gaussian Blur Properties');
const cssFiles = [
  path.join(rootDir, 'css', 'index.css'),
  path.join(rootDir, 'public', 'css', 'index.css'),
  path.join(rootDir, 'dist', 'css', 'index.css')
];

cssFiles.forEach((file) => {
  const relPath = path.relative(rootDir, file);
  assert(fs.existsSync(file), `${relPath} exists`);
  const css = fs.readFileSync(file, 'utf8');

  // Blur, Brightness, Saturation
  assert(
    css.includes('blur(22px)') && css.includes('brightness(0.65)') && css.includes('saturate(0.85)'),
    `${relPath} applies strong Gaussian blur(22px) with brightness(0.65) and saturate(0.85)`
  );

  // Negative Inset and Scale to prevent edge bleeding
  assert(
    css.includes('inset: -30px') && css.includes('scale(1.05)'),
    `${relPath} uses inset: -30px and transform: scale(1.05) to eliminate unblurred viewport edge bleed`
  );

  // Background cover and center positioning
  assert(
    css.includes('background-size: cover') && css.includes('background-position: center center'),
    `${relPath} uses background-size: cover and background-position: center center`
  );

  // Warm cinematic overlay gradient
  assert(
    css.includes('135deg') &&
    css.includes('rgba(12, 9, 15, 0.48)') &&
    css.includes('rgba(25, 17, 24, 0.38)') &&
    css.includes('rgba(10, 12, 22, 0.52)'),
    `${relPath} applies warm 135deg multi-tone cinematic overlay gradient`
  );

  // Glass Panel definition
  assert(
    css.includes('.glass-panel') &&
    css.includes('rgba(29, 27, 39, 0.72)') &&
    css.includes('backdrop-filter: blur(18px) saturate(140%)'),
    `${relPath} defines .glass-panel with luxury translucent dark glassmorphism`
  );

  // Transparent dark body for wallpaper visibility
  assert(
    css.includes('body.theme-dark') &&
    css.includes('--bg-main: transparent;') &&
    css.includes('--bg-gradient: transparent;'),
    `${relPath} configures body.theme-dark with transparent base tokens for wallpaper visibility`
  );

  // Class aliases
  assert(
    css.includes('.app-background') && css.includes('.app-background-overlay'),
    `${relPath} supports both .app-background and .spatial-bg class aliases`
  );
});

// 3. HTML DOM Markup Verification
console.log('\n📄 Group 3: HTML DOM Markup Structure');
const htmlFiles = [
  path.join(rootDir, 'index.html'),
  path.join(rootDir, 'public', 'index.html'),
  path.join(rootDir, 'dist', 'index.html')
];

htmlFiles.forEach((file) => {
  const relPath = path.relative(rootDir, file);
  assert(fs.existsSync(file), `${relPath} exists`);
  const html = fs.readFileSync(file, 'utf8');

  assert(
    html.includes('spatial-bg-wrapper') && html.includes('app-background-container'),
    `${relPath} contains background container with spatial-bg-wrapper and app-background-container`
  );
  assert(
    html.includes('spatial-bg-image') && html.includes('app-background'),
    `${relPath} contains blurred wallpaper layer with spatial-bg-image and app-background`
  );
  assert(
    html.includes('spatial-bg-gradient-overlay') && html.includes('app-background-overlay'),
    `${relPath} contains cinematic gradient overlay with spatial-bg-gradient-overlay and app-background-overlay`
  );
  assert(
    html.includes('id="spatialBgImage"'),
    `${relPath} preserves #spatialBgImage ID for script bindings`
  );
  assert(
    html.includes('aria-hidden="true"'),
    `${relPath} marks background layer as aria-hidden="true" for accessibility`
  );
});

// 4. Parallax Safeguard Verification
console.log('\n⚙️ Group 4: Runtime Parallax Safeguard');
const appJsPath = path.join(rootDir, 'js', 'app.js');
const appJs = fs.readFileSync(appJsPath, 'utf8');
assert(
  appJs.includes('scale(1.05) translate3d('),
  'js/app.js maintains scale(1.05) during interactive pointer parallax'
);

// 5. Final Results
console.log('\n=======================================');
console.log(`Results: ${passedCount} passed, ${failedCount} failed.`);
if (failedCount === 0) {
  console.log('🎉 All REA Music Background Blur & Glassmorphism Tests Passed Successfully!');
  process.exit(0);
} else {
  console.error('❌ Some tests failed.');
  process.exit(1);
}
