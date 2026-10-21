import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const projectRoot = 'c:/Users/harsh/OneDrive/Desktop/rea/rea-music';

console.log('🚀 [REA Redesign] Applying Final Precision Polish...');

// =============================================================================
// STEP 1: Update index.html
// =============================================================================
let html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

// Strip embedded styles/scripts
html = html.replace(/<style id="rea-embedded-styles">[\s\S]*?<\/style>/g, '');
html = html.replace(/<script id="rea-embedded-script">[\s\S]*?<\/script>/g, '');

// Body class
html = html.replace(/<body[^>]*>/, '<body class="theme-spatial">');

// Player thumbnail with local fallback & referrerpolicy
const playerThumbImgRegex = /<img src="[^"]*" alt="Casa Tupka Anthem" class="player-thumb-img" id="playerThumbImg">/;
const playerThumbImgHtml = `<img src="assets/casa_tupka.jpg" alt="Casa Tupka Anthem" class="player-thumb-img" id="playerThumbImg" referrerpolicy="no-referrer" onerror="this.src='assets/casa_tupka.jpg';">`;
if (playerThumbImgRegex.test(html)) {
  html = html.replace(playerThumbImgRegex, playerThumbImgHtml);
} else {
  // If not matched, replace standard playerThumbImg
  html = html.replace(/<img [^>]*id="playerThumbImg"[^>]*>/, playerThumbImgHtml);
}

fs.writeFileSync(path.join(projectRoot, 'index.html'), html, 'utf8');
console.log('✅ index.html updated with local image fallback.');

// =============================================================================
// STEP 2: Update css/index.css with exact 3x3 grid & spaced viewport
// =============================================================================
let css = fs.readFileSync(path.join(projectRoot, 'css', 'index.css'), 'utf8');

const marker = '/* =============================================================================\n   REA MUSIC — COMPLETE SPATIAL UI TRANSFORMATION ENGINE';
const idx = css.indexOf(marker);
if (idx !== -1) {
  css = css.substring(0, idx).trimEnd() + '\n';
}

const spatialCss = `
/* =============================================================================
   REA MUSIC — COMPLETE SPATIAL UI TRANSFORMATION ENGINE
   Cinematic Layered Depth, Translucent Glassmorphism, Responsive Mobile & Desktop
   Primary Visual Source of Truth: Reference Sunset Penthouse Glass Mockup
   ============================================================================= */

:root {
  --accent: #ff3157;
  --accent-hover: #ff5474;
  --accent-soft: rgba(255, 49, 87, 0.22);
  --accent-glow: 0 0 24px rgba(255, 49, 87, 0.55);

  --glass-main: rgba(38, 30, 42, 0.48);
  --glass-card: rgba(255, 255, 255, 0.08);
  --glass-hover: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.20);
  --glass-border-subtle: rgba(255, 255, 255, 0.12);

  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.74);
  --text-muted: rgba(255, 255, 255, 0.52);

  --blur-panel: 28px;
  --blur-floating: 32px;
  --blur-card: 22px;

  --radius-panel: 26px;
  --radius-card: 20px;
  --radius-control: 999px;

  --ease-premium: cubic-bezier(0.22, 1, 0.36, 1);
}

/* 1. Atmospheric Cinematic Background System */
.spatial-bg-wrapper {
  position: fixed;
  inset: 0;
  z-index: -10;
  overflow: hidden;
  pointer-events: none;
}

body.theme-white .spatial-bg-wrapper {
  display: none;
}

.spatial-bg-image {
  position: absolute;
  top: -24px;
  left: -24px;
  width: calc(100% + 48px);
  height: calc(100% + 48px);
  background-image: url("../assets/spatial_dusk_bg.jpg"), url("assets/spatial_dusk_bg.jpg");
  background-size: cover;
  background-position: center 30%;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.spatial-bg-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(16, 12, 18, 0.18) 0%, rgba(14, 10, 16, 0.10) 45%, rgba(12, 8, 14, 0.32) 100%);
}

.spatial-bg-ambient-light {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 75% 20%, rgba(255, 60, 90, 0.12) 0%, transparent 55%),
    radial-gradient(circle at 25% 75%, rgba(255, 130, 70, 0.08) 0%, transparent 50%);
  mix-blend-mode: screen;
}

.spatial-bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.40) 100%);
}

/* 2. Desktop Spatial Layout (min-width: 769px) */
@media (min-width: 769px) {
  body.theme-spatial {
    background-color: #0c0a10 !important;
    color: #ffffff;
    overflow: hidden;
  }

  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: transparent !important;
    border-bottom: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: none !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    z-index: 95;
    pointer-events: none;
  }

  .nav-left {
    display: none !important;
  }

  .nav-center {
    flex: 1;
    max-width: 500px;
    margin: 0 auto;
    pointer-events: auto;
  }

  .search-container {
    height: 42px;
    border-radius: 999px;
    background: rgba(36, 28, 40, 0.50) !important;
    border: 1px solid rgba(255, 255, 255, 0.20) !important;
    backdrop-filter: blur(24px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.28) !important;
    transition: all 0.25s var(--ease-premium);
  }

  .search-container input {
    height: 100%;
    color: #ffffff;
    font-size: 13.5px;
    padding: 0 42px 0 44px;
    font-family: inherit;
  }

  .search-container input::placeholder {
    color: rgba(255, 255, 255, 0.52);
  }

  .search-container:focus-within {
    border-color: rgba(255, 49, 87, 0.65) !important;
    box-shadow: 0 0 24px rgba(255, 49, 87, 0.30), inset 0 1px 1px rgba(255, 255, 255, 0.35) !important;
    background: rgba(36, 28, 40, 0.70) !important;
  }

  .search-icon-btn {
    color: rgba(255, 255, 255, 0.65);
    left: 14px;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
    pointer-events: auto;
  }

  .cast-btn,
  .settings-btn {
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    background: rgba(36, 28, 40, 0.50) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    color: #ffffff !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.22) !important;
    transition: all 0.2s ease;
  }

  .cast-btn:hover,
  .settings-btn:hover {
    background: rgba(255, 255, 255, 0.16) !important;
    border-color: rgba(255, 255, 255, 0.32) !important;
    transform: translateY(-2px);
  }

  .user-avatar {
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    background: #ff3157 !important;
    color: #ffffff !important;
    font-weight: 700;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(255, 49, 87, 0.45) !important;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .user-avatar:hover {
    transform: scale(1.08);
  }

  /* 3. Floating Spatial Glass Sidebar */
  .app-layout {
    height: 100vh;
    margin-top: 0;
    padding-top: 60px;
    background: transparent !important;
    display: flex;
    overflow: hidden;
  }

  .sidebar {
    width: 268px !important;
    height: calc(100vh - 160px) !important;
    margin: 4px 0 0 24px !important;
    border-radius: 26px !important;
    background: rgba(38, 30, 42, 0.48) !important;
    border: 1px solid rgba(255, 255, 255, 0.20) !important;
    backdrop-filter: blur(28px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(28px) saturate(160%) !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.30) !important;
    padding: 16px 14px !important;
    overflow-y: auto;
    z-index: 90;
    flex-shrink: 0;
  }

  .sidebar::-webkit-scrollbar {
    width: 4px;
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }

  .sidebar-brand-header {
    display: block !important;
    padding: 2px 6px 14px 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 10px;
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    user-select: none;
  }

  .brand-badge-pill {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #0a0a0c;
    border: 1.5px solid #ff3157;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(255, 49, 87, 0.45);
    flex-shrink: 0;
  }

  .brand-badge-txt {
    font-size: 8.5px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.5px;
  }

  .sidebar-brand .brand-name {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.2px;
    font-family: Outfit, sans-serif;
  }

  .sidebar-brand .brand-accent {
    color: #ff3157;
  }

  .sidebar-brand .badge-free {
    background: #ff3157;
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
    letter-spacing: 0.5px;
    margin-left: 2px;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 14px !important;
    border-radius: 14px !important;
    color: rgba(255, 255, 255, 0.72) !important;
    font-weight: 500;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #ffffff !important;
    transform: translateX(2px);
  }

  .nav-item.active {
    background: linear-gradient(90deg, rgba(255, 49, 87, 0.32) 0%, rgba(255, 49, 87, 0.12) 100%) !important;
    border: 1px solid rgba(255, 49, 87, 0.45) !important;
    color: #ffffff !important;
    box-shadow: 0 4px 16px rgba(255, 49, 87, 0.22) !important;
  }

  .nav-item.active svg {
    color: #ff3157 !important;
    filter: drop-shadow(0 0 6px rgba(255, 49, 87, 0.45));
  }

  .sidebar-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 8px 0;
  }

  .new-playlist-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.07) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    border-radius: 999px !important;
    padding: 8px 16px !important;
    margin: 4px 0 10px 0 !important;
    color: #ffffff !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    backdrop-filter: blur(12px);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .new-playlist-btn:hover {
    background: rgba(255, 255, 255, 0.14) !important;
    border-color: rgba(255, 255, 255, 0.28) !important;
    transform: translateY(-1px);
  }

  .playlist-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px !important;
    border-radius: 12px !important;
    margin-bottom: 2px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .playlist-item:hover {
    background: rgba(255, 255, 255, 0.08) !important;
  }

  .playlist-icon {
    width: 32px !important;
    height: 32px !important;
    border-radius: 9px !important;
    background: rgba(255, 255, 255, 0.09) !important;
    color: rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .playlist-icon.heart-icon {
    background: linear-gradient(135deg, #ff3157, #ff5474) !important;
    box-shadow: 0 3px 12px rgba(255, 49, 87, 0.45) !important;
    color: #ffffff !important;
  }

  .playlist-title {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .playlist-meta {
    font-size: 11px !important;
    color: rgba(255, 255, 255, 0.52) !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 1px;
  }

  .sidebar-footer {
    display: none !important;
  }

  /* 4. Main Scrollable Discovery Content */
  .main-content {
    flex: 1;
    padding: 6px 32px 140px 24px !important;
    background: transparent !important;
    overflow-y: auto;
    height: calc(100vh - 64px);
  }

  /* 5. Latest Indian Releases (Spatial 3D Album Carousel) */
  .spatial-hero-shelf {
    margin-bottom: 16px !important;
    position: relative;
  }

  .spatial-section-title {
    font-family: Outfit, Inter, sans-serif !important;
    font-size: 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    letter-spacing: -0.2px;
  }

  .shelf-title-arrow {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
  }

  .spatial-carousel-wrapper {
    position: relative;
    width: 100%;
  }

  .spatial-releases-carousel {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 2px 2px 10px 2px;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .spatial-releases-carousel::-webkit-scrollbar {
    display: none;
  }

  .spatial-carousel-right-arrow {
    position: absolute;
    right: -10px;
    top: calc(50% - 6px);
    transform: translateY(-50%);
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(38, 30, 42, 0.68);
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3);
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s ease;
  }

  .spatial-carousel-right-arrow:hover {
    background: rgba(255, 255, 255, 0.20);
    border-color: rgba(255, 255, 255, 0.40);
    transform: translateY(-50%) scale(1.08);
  }

  .spatial-album-card {
    flex: 0 0 166px !important;
    width: 166px !important;
    border-radius: 18px !important;
    background: rgba(38, 30, 42, 0.48) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    backdrop-filter: blur(24px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.32), inset 0 1px 1px rgba(255, 255, 255, 0.24) !important;
    padding: 9px !important;
    cursor: pointer;
    scroll-snap-align: start;
    transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease !important;
  }

  .spatial-album-card:hover {
    transform: translateY(-6px) scale(1.02) !important;
    border-color: rgba(255, 255, 255, 0.32) !important;
    box-shadow: 0 20px 42px rgba(0, 0, 0, 0.48), inset 0 1px 1px rgba(255, 255, 255, 0.32) !important;
  }

  .spatial-album-card .music-card-thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .spatial-album-card .music-card-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .album-sheen-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, transparent 40%, rgba(0, 0, 0, 0.25) 100%);
    pointer-events: none;
  }

  .spatial-album-card .music-card-play {
    position: absolute;
    right: 7px;
    bottom: 7px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.28) !important;
    color: #ffffff !important;
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255, 255, 255, 0.35) !important;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    opacity: 1 !important;
    transform: scale(1) !important;
    transition: all 0.2s ease;
  }

  .spatial-album-card .music-card-play:hover {
    background: #ff3157 !important;
    border-color: #ff3157 !important;
    transform: scale(1.12) !important;
    box-shadow: 0 4px 16px rgba(255, 49, 87, 0.6) !important;
  }

  .spatial-album-card .music-card-title {
    font-size: 13px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }

  .spatial-album-card .music-card-sub {
    font-size: 10.5px !important;
    color: rgba(255, 255, 255, 0.60) !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 6. Official Rankings: Top 20 Songs: India (Floating Glass Sheet) */
  .official-rankings-panel {
    background: rgba(38, 30, 42, 0.48) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    border-radius: 24px !important;
    backdrop-filter: blur(28px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(28px) saturate(160%) !important;
    padding: 16px 22px !important;
    margin-bottom: 280px !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.28) !important;
  }

  .official-rankings-panel .shelf-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px !important;
  }

  .shelf-eyebrow {
    font-size: 10px !important;
    letter-spacing: 1.2px !important;
    font-weight: 700 !important;
    color: rgba(255, 255, 255, 0.58) !important;
    text-transform: uppercase;
    margin-bottom: 2px;
    display: block;
  }

  .spatial-play-all-btn {
    display: inline-flex !important;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    border-radius: 999px !important;
    padding: 6px 16px !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    font-size: 12.5px !important;
    backdrop-filter: blur(12px) !important;
    transition: all 0.2s ease !important;
    cursor: pointer;
  }

  .spatial-play-all-btn:hover {
    background: #ff3157 !important;
    border-color: #ff3157 !important;
    box-shadow: 0 4px 16px rgba(255, 49, 87, 0.5) !important;
    transform: translateY(-1px);
  }

  /* 3-Column Ranked Grid (Exact 3 Columns x 3 Rows) */
  .spatial-rankings-grid {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    grid-template-rows: repeat(3, auto) !important;
    grid-auto-flow: column !important;
    gap: 8px 16px !important;
  }

  .ranked-track-card {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px !important;
    border-radius: 12px !important;
    background: rgba(255, 255, 255, 0.04) !important;
    border: 1px solid transparent !important;
    transition: all 0.18s ease;
    cursor: pointer;
    position: relative;
  }

  .ranked-track-card:hover {
    background: rgba(255, 255, 255, 0.10) !important;
    border-color: rgba(255, 255, 255, 0.14) !important;
    transform: translateX(2px);
  }

  .ranked-track-card.rank-active::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 2px;
    background: #ff3157;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(255, 49, 87, 0.85);
  }

  .ranked-track-card .rank-number {
    font-size: 14px !important;
    font-weight: 700 !important;
    width: 16px !important;
    text-align: center;
    color: rgba(255, 255, 255, 0.75) !important;
    flex-shrink: 0;
  }

  .ranked-track-card .rank-number.top-rank {
    color: #ff3157 !important;
    text-shadow: 0 0 8px rgba(255, 49, 87, 0.45);
  }

  .rank-badge {
    font-size: 10.5px !important;
    font-weight: 700 !important;
    min-width: 26px !important;
    flex-shrink: 0;
    text-align: center;
  }

  .rank-badge.badge-up {
    color: #22c55e !important;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .rank-badge.badge-down {
    color: #ff4d6d !important;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .rank-badge.badge-same {
    color: rgba(255, 255, 255, 0.35) !important;
    font-size: 12px !important;
  }

  .rank-badge.badge-new {
    background: rgba(34, 197, 94, 0.18) !important;
    border: 1px solid rgba(34, 197, 94, 0.55) !important;
    color: #22c55e !important;
    font-size: 8.5px !important;
    font-weight: 800 !important;
    padding: 1px 4px !important;
    border-radius: 4px !important;
    letter-spacing: 0.3px;
  }

  .ranked-track-card .track-thumb-img {
    width: 38px !important;
    height: 38px !important;
    border-radius: 8px !important;
    object-fit: cover !important;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35);
    flex-shrink: 0;
  }

  .ranked-track-card .track-row-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .ranked-track-card .track-row-title {
    font-size: 12.5px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ranked-track-card .track-row-artist {
    font-size: 10.5px !important;
    color: rgba(255, 255, 255, 0.58) !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 1px;
  }

  .ranked-track-card .track-row-duration {
    font-size: 11px !important;
    color: rgba(255, 255, 255, 0.48) !important;
    font-variant-numeric: tabular-nums;
    margin-left: auto;
    flex-shrink: 0;
  }

  .ranked-track-card .track-more-menu-btn {
    width: 20px;
    height: 20px;
    color: rgba(255, 255, 255, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
    border-radius: 4px;
    transition: all 0.15s ease;
  }

  .ranked-track-card .track-more-menu-btn:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
  }

  .ranked-track-card .track-inline-dl-btn {
    display: none !important;
  }

  /* 7. Persistent Floating Spatial Bottom Music Player */
  .player-bar {
    position: fixed !important;
    bottom: 16px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: min(1140px, calc(100% - 64px)) !important;
    height: 70px !important;
    border-radius: 999px !important;
    background: rgba(36, 28, 40, 0.68) !important;
    border: 1px solid rgba(255, 255, 255, 0.22) !important;
    backdrop-filter: blur(32px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(32px) saturate(180%) !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.32) !important;
    padding: 0 24px !important;
    z-index: 100 !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    transition: all 0.25s ease;
  }

  .player-left {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    flex: 0 1 350px !important;
    max-width: 360px !important;
    min-width: 220px !important;
  }

  .player-thumb-img {
    width: 44px !important;
    height: 44px !important;
    border-radius: 10px !important;
    object-fit: cover !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    flex-shrink: 0;
  }

  .player-meta {
    display: flex !important;
    flex-direction: column !important;
    min-width: 0 !important;
    overflow: hidden !important;
    flex: 1 !important;
  }

  .player-title {
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .player-artist-row {
    font-size: 11px !important;
    color: rgba(255, 255, 255, 0.60) !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    margin-top: 1px !important;
    display: flex !important;
    align-items: center !important;
    gap: 5px !important;
  }

  .player-actions {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    margin-left: 6px !important;
    flex-shrink: 0 !important;
  }

  .player-actions .icon-btn {
    width: 28px !important;
    height: 28px !important;
    border-radius: 50% !important;
    color: rgba(255, 255, 255, 0.70) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
  }

  .player-actions .icon-btn:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.10) !important;
  }

  #dislikeBtn,
  #playerDownloadBtn {
    display: none !important;
  }

  /* Center Controls & Horizontal Inline Scrubber */
  .player-center {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 16px !important;
    flex: 1 !important;
    max-width: 520px !important;
    justify-content: center !important;
    margin: 0 16px !important;
  }

  .controls-row {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
  }

  .controls-row .control-btn {
    width: 30px !important;
    height: 30px !important;
    border-radius: 50% !important;
    color: rgba(255, 255, 255, 0.75) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
  }

  .controls-row .control-btn:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.10) !important;
    transform: scale(1.06) !important;
  }

  .play-pause-btn {
    width: 42px !important;
    height: 42px !important;
    border-radius: 50% !important;
    background: linear-gradient(135deg, #ff3157, #ff5474) !important;
    color: #ffffff !important;
    border: none !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 0 22px rgba(255, 49, 87, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.5) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
  }

  .play-pause-btn:hover {
    transform: scale(1.08) !important;
    box-shadow: 0 0 28px rgba(255, 49, 87, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.6) !important;
  }

  .player-scrubber-row {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    flex: 1 !important;
    max-width: 260px !important;
  }

  .player-scrubber-row .time-text {
    font-size: 11px !important;
    font-variant-numeric: tabular-nums !important;
    color: rgba(255, 255, 255, 0.65) !important;
    min-width: 28px !important;
    text-align: center !important;
  }

  .inline-progress {
    flex: 1 !important;
    height: 16px !important;
    display: flex !important;
    align-items: center !important;
    position: relative !important;
    cursor: pointer !important;
  }

  .inline-progress .progress-bar-bg {
    width: 100% !important;
    height: 3.5px !important;
    border-radius: 999px !important;
    background: rgba(255, 255, 255, 0.20) !important;
    position: relative !important;
    overflow: visible !important;
  }

  .inline-progress .progress-bar-fill {
    height: 100% !important;
    border-radius: 999px !important;
    background: #ff3157 !important;
    box-shadow: 0 0 8px rgba(255, 49, 87, 0.6) !important;
    position: relative !important;
  }

  .inline-progress .progress-thumb {
    width: 10px !important;
    height: 10px !important;
    border-radius: 50% !important;
    background: #ffffff !important;
    box-shadow: 0 0 10px rgba(255, 49, 87, 0.9) !important;
    position: absolute !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    pointer-events: none !important;
  }

  /* Right Section Controls */
  .player-right {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    flex: 0 0 auto !important;
    min-width: 170px !important;
    justify-content: flex-end !important;
  }

  .volume-container {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }

  .volume-btn {
    width: 28px !important;
    height: 28px !important;
    color: rgba(255, 255, 255, 0.70) !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .volume-slider-track {
    width: 64px !important;
    height: 3.5px !important;
    border-radius: 999px !important;
    background: rgba(255, 255, 255, 0.20) !important;
    position: relative !important;
    cursor: pointer !important;
  }

  .volume-fill {
    height: 100% !important;
    border-radius: 999px !important;
    background: #ff3157 !important;
  }

  .drawer-toggle-btn,
  .fullscreen-btn {
    width: 30px !important;
    height: 30px !important;
    border-radius: 50% !important;
    color: rgba(255, 255, 255, 0.70) !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.15s ease !important;
  }

  .drawer-toggle-btn:hover,
  .fullscreen-btn:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.10) !important;
  }

  #audioVisualizer,
  #barAutoplayBtn,
  #toggleLyricsBtn {
    display: none !important;
  }

  /* Secondary Shelves Below Fold */
  .chips-container {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 14px 0 18px 0;
    scrollbar-width: none;
    margin-top: 40px;
  }

  .chips-container::-webkit-scrollbar {
    display: none;
  }

  .filter-chip {
    padding: 7px 18px;
    border-radius: 999px;
    background: rgba(38, 30, 42, 0.50);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(16px);
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .filter-chip:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.30);
  }

  .filter-chip.active {
    background: #ff3157;
    border-color: #ff3157;
    color: #ffffff;
    box-shadow: 0 4px 16px rgba(255, 49, 87, 0.45);
  }
}

/* Tablet Responsiveness (769px to 1100px) */
@media (min-width: 769px) and (max-width: 1100px) {
  .spatial-rankings-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    grid-template-rows: auto !important;
    grid-auto-flow: row !important;
  }

  .player-bar {
    width: calc(100% - 32px) !important;
  }
}

/* Mobile Responsiveness (max-width: 768px) */
@media (max-width: 768px) {
  .sidebar-brand-header {
    display: none !important;
  }

  .spatial-rankings-grid {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
    grid-auto-flow: row !important;
  }

  .spatial-album-card {
    flex: 0 0 155px !important;
    width: 155px !important;
  }

  .spatial-releases-carousel {
    gap: 12px !important;
  }

  .official-rankings-panel {
    padding: 16px 14px !important;
    border-radius: 20px !important;
  }

  .player-bar {
    position: fixed !important;
    bottom: calc(var(--mobile-tab-height, 56px) + 10px + env(safe-area-inset-bottom, 0px)) !important;
    left: 10px !important;
    right: 10px !important;
    width: auto !important;
    transform: none !important;
    height: 58px !important;
    border-radius: 18px !important;
    background: rgba(36, 28, 40, 0.85) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    backdrop-filter: blur(24px) !important;
    -webkit-backdrop-filter: blur(24px) !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.25) !important;
    padding: 0 14px !important;
    z-index: 100 !important;
  }

  .player-scrubber-row {
    display: none !important;
  }

  .mobile-tab-bar {
    background: rgba(24, 18, 28, 0.88) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
    backdrop-filter: blur(24px) !important;
    -webkit-backdrop-filter: blur(24px) !important;
  }

  .mobile-tab-btn.active {
    color: #ff3157 !important;
  }
}
`;

css = css + spatialCss;
fs.writeFileSync(path.join(projectRoot, 'css', 'index.css'), css, 'utf8');
console.log('✅ css/index.css updated.');

// =============================================================================
// STEP 3: Update js/app.js to pick exactly 3 columns (ranks 1,2,3, 5,6,7, 9,10,11)
// =============================================================================
let js = fs.readFileSync(path.join(projectRoot, 'js', 'app.js'), 'utf8');

const targetRenderCharts = `      // Render exactly 3 columns matching reference:
      // Col 1: Ranks 1, 2, 3
      // Col 2: Ranks 5, 6, 7
      // Col 3: Ranks 9, 10, 11
      const isHome = container === this.homeChartsGrid;
      let chartItems;
      if (isHome) {
        const findRank = (r) => this.exploreCharts.find(t => t.rank === r);
        const targetRanks = [1, 2, 3, 5, 6, 7, 9, 10, 11];
        const picked = targetRanks.map(findRank).filter(Boolean);
        chartItems = picked.length >= 6 ? picked : this.exploreCharts.slice(0, 9);
      } else {
        chartItems = this.exploreCharts.slice(0, 20);
      }`;

const oldChartItemsRegex = /const isHome = container === this\.homeChartsGrid;\s*const chartItems = isHome \? this\.exploreCharts\.slice\(0, 9\) : this\.exploreCharts\.slice\(0, 20\);/;
if (oldChartItemsRegex.test(js)) {
  js = js.replace(oldChartItemsRegex, targetRenderCharts);
  console.log('✅ Updated chartItems selection for exact 3-column reference matching!');
}

fs.writeFileSync(path.join(projectRoot, 'js', 'app.js'), js, 'utf8');

// =============================================================================
// STEP 4: Build production bundle
// =============================================================================
console.log('📦 Executing build.js bundle...');
execSync('node build.js', { cwd: projectRoot, stdio: 'inherit' });
console.log('🎉 Final polish complete & bundled!');
