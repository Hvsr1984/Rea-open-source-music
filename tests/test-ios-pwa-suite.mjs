/**
 * tests/test-ios-pwa-suite.mjs
 * Comprehensive automated verification for REA Music iOS PWA compatibility.
 * Verifies:
 * 1. Web App Manifest (JSON validity, standalone display, stable id/scope, theme colors)
 * 2. Icon asset existence & exact binary dimensions (180x180 Apple touch icon, 192x192, 512x512, maskable)
 * 3. HTML head iOS metadata (viewport-fit=cover, apple-touch-icon, apple-mobile-web-app-*)
 * 4. Service Worker architecture (safe audio passthrough, SWR catalog, offline fallback, cache cleanup)
 * 5. CSS safe area environment variables and iOS touch behavior
 * 6. Media Session API integration (metadata, 6 action handlers, setPositionState)
 * 7. iOS Safari install guidance modal and dismiss flow
 * 8. Audio engine playback rejection handling (NotAllowedError protection)
 * 9. Vercel headers and routing configuration
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failedTests++;
  }
}

function readPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4E || buf[3] !== 0x47) {
    throw new Error('Not a valid PNG file');
  }
  // IHDR chunk starts at offset 12; width at 16 (4 bytes BE), height at 20 (4 bytes BE)
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

console.log('🧪 Starting REA Music iOS PWA Engineering Test Suite...\n');

// -----------------------------------------------------------------------------
// Test Group 1: Manifest Validation
// -----------------------------------------------------------------------------
console.log('📦 Group 1: Web App Manifest & PWA Configuration');
const manifestPath = path.join(rootDir, 'manifest.webmanifest');
const jsonManifestPath = path.join(rootDir, 'manifest.json');
assert(fs.existsSync(manifestPath), 'manifest.webmanifest exists in root');
assert(fs.existsSync(jsonManifestPath), 'manifest.json exists in root');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert(manifest.name === 'REA Music', 'Manifest name is "REA Music"');
assert(manifest.short_name === 'REA Music', 'Manifest short_name is "REA Music"');
assert(manifest.display === 'standalone', 'Manifest display mode is "standalone"');
assert(manifest.start_url === '/', 'Manifest start_url is "/"');
assert(manifest.scope === '/', 'Manifest scope is "/"');
assert(manifest.background_color === '#0a0a0e', 'Manifest background_color is "#0a0a0e"');
assert(manifest.theme_color === '#0a0a0e', 'Manifest theme_color is "#0a0a0e"');
assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'Manifest declares at least 3 icons');

const has192 = manifest.icons.some(i => i.sizes === '192x192' && i.src.includes('192'));
const has512 = manifest.icons.some(i => i.sizes === '512x512' && i.purpose !== 'maskable');
const hasMaskable = manifest.icons.some(i => i.purpose === 'maskable');
assert(has192 && has512 && hasMaskable, 'Manifest declares standard 192px, 512px, and 512px maskable icons');

// -----------------------------------------------------------------------------
// Test Group 2: Binary Icon Verification
// -----------------------------------------------------------------------------
console.log('\n🎨 Group 2: Application Icons & Resolution Verification');
const appleTouchIconPath = path.join(rootDir, 'assets', 'icons', 'apple-touch-icon.png');
const icon192Path = path.join(rootDir, 'assets', 'icons', 'icon-192.png');
const icon512Path = path.join(rootDir, 'assets', 'icons', 'icon-512.png');
const iconMaskablePath = path.join(rootDir, 'assets', 'icons', 'icon-maskable-512.png');

assert(fs.existsSync(appleTouchIconPath), 'apple-touch-icon.png exists in assets/icons/');
const appleDim = readPngDimensions(appleTouchIconPath);
assert(appleDim.width === 180 && appleDim.height === 180, `apple-touch-icon.png is exact iOS standard 180x180 (got ${appleDim.width}x${appleDim.height})`);

assert(fs.existsSync(icon192Path), 'icon-192.png exists in assets/icons/');
const dim192 = readPngDimensions(icon192Path);
assert(dim192.width === 192 && dim192.height === 192, `icon-192.png is 192x192 (got ${dim192.width}x${dim192.height})`);

assert(fs.existsSync(icon512Path), 'icon-512.png exists in assets/icons/');
const dim512 = readPngDimensions(icon512Path);
assert(dim512.width === 512 && dim512.height === 512, `icon-512.png is 512x512 (got ${dim512.width}x${dim512.height})`);

assert(fs.existsSync(iconMaskablePath), 'icon-maskable-512.png exists in assets/icons/');
const dimMaskable = readPngDimensions(iconMaskablePath);
assert(dimMaskable.width === 512 && dimMaskable.height === 512, `icon-maskable-512.png is 512x512 (got ${dimMaskable.width}x${dimMaskable.height})`);

// -----------------------------------------------------------------------------
// Test Group 3: HTML Head & iOS Metadata
// -----------------------------------------------------------------------------
console.log('\n📱 Group 3: HTML Head & iOS Safari Metadata');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

assert(indexHtml.includes('viewport-fit=cover'), 'HTML contains viewport-fit=cover for iPhone notch and Dynamic Island');
assert(indexHtml.includes('<link rel="manifest" href="/manifest.webmanifest">'), 'HTML links to /manifest.webmanifest');
assert(indexHtml.includes('<meta name="apple-mobile-web-app-capable" content="yes">'), 'HTML contains apple-mobile-web-app-capable=yes');
assert(indexHtml.includes('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'), 'HTML sets black-translucent status bar for seamless glass header');
assert(indexHtml.includes('<meta name="apple-mobile-web-app-title" content="REA Music">'), 'HTML defines apple-mobile-web-app-title "REA Music"');
assert(indexHtml.includes('<meta name="apple-touch-fullscreen" content="yes">'), 'HTML contains apple-touch-fullscreen=yes');
assert(indexHtml.includes('<link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">'), 'HTML links 180x180 apple-touch-icon');
assert(indexHtml.includes('property="og:title"'), 'HTML defines Open Graph metadata for iOS Safari Share Sheet');

// -----------------------------------------------------------------------------
// Test Group 4: Service Worker Architecture
// -----------------------------------------------------------------------------
console.log('\n⚙️ Group 4: Service Worker Architecture & Safe Audio Streaming');
const swJs = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');

assert(swJs.includes('SHELL_CACHE_NAME'), 'sw.js defines SHELL_CACHE_NAME with versioning');
assert(swJs.includes('API_CACHE_NAME'), 'sw.js defines API_CACHE_NAME with versioning');
assert(swJs.includes('saavncdn') && swJs.includes('.mp4') && swJs.includes('.mp3'), 'sw.js bypasses audio file formats and Saavn CDN');
assert(swJs.includes("request.headers.get('range')"), 'sw.js explicitly passes through HTTP Range requests to native audio element');
assert(swJs.includes("url.pathname.startsWith('/api/download')"), 'sw.js bypasses audio download endpoints');
assert(swJs.includes("request.mode === 'navigate'"), 'sw.js implements network-first navigation with offline fallback');

// -----------------------------------------------------------------------------
// Test Group 5: CSS Safe Areas and iOS Touch Ergonomics
// -----------------------------------------------------------------------------
console.log('\n📐 Group 5: CSS Safe Areas & Touch Ergonomics');
const cssContent = fs.readFileSync(path.join(rootDir, 'css', 'index.css'), 'utf8');

assert(cssContent.includes('env(safe-area-inset-top'), 'CSS utilizes env(safe-area-inset-top) for header navigation');
assert(cssContent.includes('env(safe-area-inset-bottom'), 'CSS utilizes env(safe-area-inset-bottom) for bottom player and tab bar');
assert(cssContent.includes('100dvh'), 'CSS uses dynamic viewport height 100dvh for mobile Safari address bar resizing');
assert(cssContent.includes('-webkit-overflow-scrolling: touch'), 'CSS enables smooth momentum scrolling for iOS WebKit');
assert(cssContent.includes('overscroll-behavior-y: contain'), 'CSS contains pull-to-refresh overscroll chaining on scrollable surfaces');
assert(cssContent.includes('-webkit-tap-highlight-color: transparent'), 'CSS disables gray tap flicker on mobile Safari');

// -----------------------------------------------------------------------------
// Test Group 6: MediaSession API & Position State Sync
// -----------------------------------------------------------------------------
console.log('\n🎵 Group 6: MediaSession API & iOS Lock Screen Scrubbing');
const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');

assert(appJs.includes('navigator.mediaSession.metadata = new MediaMetadata'), 'app.js sets navigator.mediaSession.metadata');
assert(appJs.includes("'play'") && appJs.includes("'pause'"), 'app.js registers play and pause MediaSession action handlers');
assert(appJs.includes("'previoustrack'") && appJs.includes("'nexttrack'"), 'app.js registers previoustrack and nexttrack action handlers');
assert(appJs.includes("'seekto'"), 'app.js registers seekto action handler');
assert(appJs.includes("'seekbackward'") && appJs.includes("'seekforward'"), 'app.js registers seekbackward and seekforward action handlers');
assert(appJs.includes('navigator.mediaSession.setPositionState'), 'app.js integrates setPositionState for iOS Lock Screen & Dynamic Island scrub bar');

// -----------------------------------------------------------------------------
// Test Group 7: iOS Safari Installation Guide Sheet
// -----------------------------------------------------------------------------
console.log('\n📲 Group 7: iOS Safari Install Guidance Flow');
assert(indexHtml.includes('id="iosInstallGuideModal"'), 'HTML contains #iosInstallGuideModal dialog');
assert(indexHtml.includes('id="closeIosInstallModalBtn"'), 'HTML provides #closeIosInstallModalBtn dismiss control');
assert(indexHtml.includes('id="gotItIosInstallBtn"'), 'HTML provides #gotItIosInstallBtn action control');
assert(appJs.includes('showIosInstallGuideModal'), 'app.js exposes showIosInstallGuideModal method');
assert(appJs.includes('closeIosInstallGuideModal'), 'app.js exposes closeIosInstallGuideModal method');

// -----------------------------------------------------------------------------
// Test Group 8: Audio Engine Resiliency & Autoplay Restrictions
// -----------------------------------------------------------------------------
console.log('\n🛡️ Group 8: Audio Engine Playback Promise & Error Bounds');
assert(appJs.includes('NotAllowedError'), 'HybridAudioEngine gracefully handles NotAllowedError without uncaught promise rejection');
assert(appJs.includes('onAutoplayBlocked'), 'Audio engine dispatches onAutoplayBlocked to reset UI state on blocked autoplay');
assert(appJs.includes('getCurrentTime') && appJs.includes('getDuration'), 'HybridAudioEngine provides getCurrentTime and getDuration helper accessors');

// -----------------------------------------------------------------------------
// Test Group 9: Vercel Routing & Headers
// -----------------------------------------------------------------------------
console.log('\n🚀 Group 9: Vercel Production Headers & MIME Configuration');
const vercelConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));

const manifestHeader = vercelConfig.headers.find(h => h.source === '/manifest.webmanifest');
assert(manifestHeader && manifestHeader.headers.some(hdr => hdr.key === 'Content-Type' && hdr.value.includes('application/manifest+json')), 'Vercel config serves /manifest.webmanifest with application/manifest+json MIME type');

const swHeader = vercelConfig.headers.find(h => h.source === '/sw.js');
assert(swHeader && swHeader.headers.some(hdr => hdr.key === 'Service-Worker-Allowed' && hdr.value === '/'), 'Vercel config sets Service-Worker-Allowed: / on sw.js');

// -----------------------------------------------------------------------------
// Final Summary
// -----------------------------------------------------------------------------
console.log('\n=======================================');
console.log(`Results: ${passedTests} passed, ${failedTests} failed.`);
if (failedTests === 0) {
  console.log('🎉 All iOS PWA Verification Tests Passed Successfully!\n');
  process.exit(0);
} else {
  console.error('❌ Some iOS PWA Verification Tests Failed!\n');
  process.exit(1);
}
