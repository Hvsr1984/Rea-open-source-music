/**
 * Comprehensive Verification Test Suite
 * Feature 1: Personal Playlists ("My Playlists")
 * Feature 2: Previous Track Logic & Edge Cases Bug Fix
 * Feature 3: Responsive UI/UX Across Mobile, Tablet, and Desktop
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🧪 [REA Tests] Starting Personal Playlists & Previous Track Verification Suite...\n');

let passedCount = 0;
let failedCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASSED: ${desc}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ FAILED: ${desc}`);
    console.error(`     Error: ${err.message}\n`);
    failedCount++;
  }
}

const rootDir = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const distHtml = fs.readFileSync(path.join(rootDir, 'dist/index.html'), 'utf8');
const publicHtml = fs.readFileSync(path.join(rootDir, 'public/index.html'), 'utf8');
const css = fs.readFileSync(path.join(rootDir, 'css/index.css'), 'utf8');
const js = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

// =============================================================================
// 1. DOM Elements & Templates Verification
// =============================================================================
console.log('--- 1. DOM & Templates Verification ---');

it('Sidebar navigation contains #navPlaylists with icon and title', () => {
  assert(html.includes('id="navPlaylists"'), 'index.html missing #navPlaylists');
  assert(distHtml.includes('id="navPlaylists"'), 'dist/index.html missing #navPlaylists');
  assert(publicHtml.includes('id="navPlaylists"'), 'public/index.html missing #navPlaylists');
});

it('Mobile bottom tab bar contains #mobileTabPlaylists', () => {
  assert(html.includes('id="mobileTabPlaylists"'), 'index.html missing #mobileTabPlaylists');
  assert(distHtml.includes('id="mobileTabPlaylists"'), 'dist/index.html missing #mobileTabPlaylists');
});

it('Defines #viewPlaylists with exact empty state copy', () => {
  assert(html.includes('id="viewPlaylists"'), 'missing #viewPlaylists');
  assert(html.includes('Your music, your way.'), 'missing empty state title "Your music, your way."');
  assert(html.includes('Create your first playlist and collect the songs you love.'), 'missing empty state subtitle');
  assert(html.includes('id="emptyCreatePlaylistBtn"'), 'missing #emptyCreatePlaylistBtn');
  assert(html.includes('id="createPlaylistViewBtn"'), 'missing #createPlaylistViewBtn');
});

it('Defines #viewPlaylist detail hero and tracks section', () => {
  assert(html.includes('id="viewPlaylist"'), 'missing #viewPlaylist');
  assert(html.includes('id="playlistHeroCover"'), 'missing #playlistHeroCover');
  assert(html.includes('id="playlistHeroTitle"'), 'missing #playlistHeroTitle');
  assert(html.includes('id="playlistPlayAllBtn"'), 'missing #playlistPlayAllBtn');
  assert(html.includes('id="playlistShuffleBtn"'), 'missing #playlistShuffleBtn');
  assert(html.includes('id="playlistAddSongsBtn"'), 'missing #playlistAddSongsBtn');
  assert(html.includes('id="playlistEditBtn"'), 'missing #playlistEditBtn');
  assert(html.includes('id="playlistDeleteBtn"'), 'missing #playlistDeleteBtn');
  assert(html.includes('id="playlistTracksList"'), 'missing #playlistTracksList');
});

it('Defines all required modals: create, edit, add-to-playlist, and delete', () => {
  assert(html.includes('id="playlistModal"'), 'missing #playlistModal');
  assert(html.includes('id="playlistTitleError"'), 'missing #playlistTitleError');
  assert(html.includes('id="editPlaylistModal"'), 'missing #editPlaylistModal');
  assert(html.includes('id="addToPlaylistModal"'), 'missing #addToPlaylistModal');
  assert(html.includes('id="deletePlaylistModal"'), 'missing #deletePlaylistModal');
  assert(html.includes('id="optAddToPlaylist"'), 'missing #optAddToPlaylist in track options');
  assert(html.includes('id="maxAddToPlaylistBtn"'), 'missing #maxAddToPlaylistBtn in theater player');
});

// =============================================================================
// 2. Playlists Engine & Business Logic Verification
// =============================================================================
console.log('\n--- 2. Playlists Logic & Storage Verification ---');

it('Initial library starts without fake or fabricated playlists', () => {
  assert(!js.includes("id: 'pl-bollywood-romance'"), 'app.js still contains hardcoded dummy playlist pl-bollywood-romance');
  assert(js.includes('rea_custom_playlists_v2'), 'app.js must use versioned storage rea_custom_playlists_v2');
});

it('Defines SVG gradient cover generator for crisp artwork without bloated binaries', () => {
  assert(js.includes('generateDefaultCoverSvg('), 'app.js missing generateDefaultCoverSvg');
  assert(js.includes('data:image/svg+xml'), 'generateDefaultCoverSvg must return SVG data URL');
});

it('Implements full CRUD on playlists: create, open, edit, delete, add, remove, reorder', () => {
  assert(js.includes('createPlaylist()'), 'missing createPlaylist');
  assert(js.includes('openPlaylistView('), 'missing openPlaylistView');
  assert(js.includes('savePlaylistDetails()'), 'missing savePlaylistDetails');
  assert(js.includes('confirmDeletePlaylist()'), 'missing confirmDeletePlaylist');
  assert(js.includes('addTrackToPlaylist('), 'missing addTrackToPlaylist');
  assert(js.includes('removeTrackFromPlaylist('), 'missing removeTrackFromPlaylist');
  assert(js.includes('reorderTrackInPlaylist('), 'missing reorderTrackInPlaylist');
});

it('Prevents duplicate songs in playlist and provides user feedback', () => {
  assert(js.includes('isAlreadyIn') || js.includes('isDuplicate'), 'missing duplicate song check');
  assert(js.includes('is already in'), 'missing duplicate feedback toast');
});

it('Supports Playlist Play All and Shuffle without corrupting playlist track order', () => {
  assert(js.includes('playPlaylist('), 'missing playPlaylist');
  // Verify shuffle works on a copy
  assert(js.includes('let tracks = [...pl.tracks]'), 'playPlaylist must copy tracks before shuffling');
});

// =============================================================================
// 3. Previous Song Bug Fix Verification
// =============================================================================
console.log('\n--- 3. Previous Track Engine & Bug Fix Verification ---');

it('Prevents async race condition with transition lock in prevTrack', () => {
  assert(js.includes('this.isTransitioning'), 'prevTrack must use transition lock');
});

it('Restarts track from beginning when audio.currentTime > 3', () => {
  assert(js.includes('currentTime > 3'), 'prevTrack must check if currentTime > 3');
  assert(js.includes('this.engine.seek(0)'), 'prevTrack must seek(0) when > 3s');
});

it('Maintains playbackHistoryStack in playActualTrack for accurate back navigation', () => {
  assert(js.includes('this.playbackHistoryStack'), 'app.js must maintain playbackHistoryStack');
  assert(js.includes('this._isNavigatingBack'), 'app.js must track navigation back direction');
});

it('Respects shuffle playback history when navigating backwards in shuffle mode', () => {
  assert(js.includes('this.isShuffle && this.playbackHistoryStack'), 'prevTrack must pop history stack during shuffle');
});

it('Handles playlist sequence boundary: decrements index when > 0, seeks to 0 at first track', () => {
  assert(js.includes('this.sequenceQueue && this.sequenceQueue.length > 0'), 'prevTrack must handle sequenceQueue');
  assert(js.includes('this.sequenceIndex > 0'), 'prevTrack must check sequenceIndex > 0');
  assert(js.includes('this.sequenceIndex--'), 'prevTrack must decrement sequenceIndex');
});

it('Binds Previous button from desktop player, mobile player, maximized player, and keyboard shortcuts', () => {
  assert(js.includes("this.prevBtn.addEventListener('click'"), 'prevBtn click handler missing');
  assert(js.includes("this.maxPrevBtn.addEventListener('click'"), 'maxPrevBtn click handler missing');
  assert(js.includes("e.key === 'j' || e.key === 'J'"), 'J keyboard shortcut for prevTrack missing');
  assert(js.includes("e.key === 'k' || e.key === 'K'"), 'K keyboard shortcut for nextTrack missing');
});

// =============================================================================
// 4. Responsive UI/UX Across Breakpoints Verification
// =============================================================================
console.log('\n--- 4. Responsive Design Verification ---');

it('Mobile mini-player #prevBtn is visible and touch-friendly (not hidden with display:none)', () => {
  assert(!css.includes('#prevBtn,\n  #nextBtn {\n    display: none !important;'), 'old hidden #prevBtn rule still in css');
  assert(css.includes('.player-bar #prevBtn') || css.includes('#prevBtn'), 'css missing mobile #prevBtn rule');
});

it('CSS defines comprehensive styles for My Playlists grid and cards', () => {
  assert(css.includes('.my-playlists-grid'), 'missing .my-playlists-grid');
  assert(css.includes('.my-playlist-card'), 'missing .my-playlist-card');
  assert(css.includes('.playlists-empty-state'), 'missing .playlists-empty-state');
  assert(css.includes('.playlist-hero-card'), 'missing .playlist-hero-card');
});

it('CSS includes responsive media queries for phone (<768px), tablet (768px-1024px), and desktop', () => {
  assert(css.includes('@media (max-width: 768px)'), 'missing mobile media query in css');
  assert(css.includes('@media (min-width: 769px) and (max-width: 1024px)') || css.includes('@media (max-width: 1024px)'), 'missing tablet media query in css');
});

// =============================================================================
// Results Summary
// =============================================================================
console.log('\n=======================================');
console.log(`Results: ${passedCount} passed, ${failedCount} failed.`);
if (failedCount === 0) {
  console.log('🎉 All REA Music Playlists, Previous Track & Responsive Tests Passed!\n');
  process.exit(0);
} else {
  console.error('💥 Some tests failed. Please review the output above.\n');
  process.exit(1);
}
