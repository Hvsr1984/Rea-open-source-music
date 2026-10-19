import fs from 'node:fs';

let css = fs.readFileSync('css/index.css', 'utf8');

// Strip previous appended spatial section if exists
const marker = '/* =============================================================================\n   REA MUSIC — COMPLETE SPATIAL UI TRANSFORMATION ENGINE';
const idx = css.indexOf(marker);
if (idx !== -1) {
  css = css.substring(0, idx).trimEnd() + '\n';
}

const spatialCss = `
/* =============================================================================
   REA MUSIC — COMPLETE SPATIAL UI TRANSFORMATION ENGINE
   Cinematic Layered Depth, Translucent Glassmorphism, Responsive Mobile & Desktop
   ============================================================================= */

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
  background-image: url("../assets/spatial_dusk_bg.jpg"), url("../assets/images/spatial_dusk_bg.jpg"), url("assets/spatial_dusk_bg.jpg");
  background-size: cover;
  background-position: center 30%;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  transition: transform 0.15s ease-out;
}

.spatial-bg-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(8, 10, 18, 0.45) 0%, rgba(10, 12, 22, 0.35) 45%, rgba(6, 8, 14, 0.78) 100%);
}

.spatial-bg-ambient-light {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 75% 20%, rgba(255, 49, 84, 0.16) 0%, transparent 55%),
    radial-gradient(circle at 25% 75%, rgba(255, 120, 60, 0.12) 0%, transparent 50%);
  mix-blend-mode: screen;
}

.spatial-bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.55) 100%);
}

/* 2. Desktop Spatial Layout (min-width: 769px) */
@media (min-width: 769px) {
  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
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
    max-width: 540px;
    margin: 0 auto;
    pointer-events: auto;
  }

  .search-container {
    height: 48px;
    border-radius: 26px;
    background: rgba(18, 20, 32, 0.55) !important;
    border: 1px solid rgba(255, 255, 255, 0.20) !important;
    backdrop-filter: blur(24px) saturate(190%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(190%) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25) !important;
    transition: all 0.25s ease;
  }

  .search-container input {
    height: 100%;
    color: #F7F7FA;
    font-size: 14px;
    padding: 0 42px 0 44px;
  }

  .search-container input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .search-container:focus-within {
    border-color: rgba(255, 49, 84, 0.7) !important;
    box-shadow: 0 0 24px rgba(255, 49, 84, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35) !important;
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
    width: 44px !important;
    height: 44px !important;
    border-radius: 50% !important;
    background: rgba(18, 20, 32, 0.55) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    color: #F7F7FA !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
    transition: all 0.2s ease;
  }

  .cast-btn:hover,
  .settings-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.32) !important;
    transform: translateY(-2px);
  }

  .user-avatar {
    width: 44px !important;
    height: 44px !important;
    border-radius: 50% !important;
    background: linear-gradient(135deg, #FF3154, #FF5570) !important;
    color: #FFF !important;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px rgba(255, 49, 84, 0.45) !important;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .user-avatar:hover {
    transform: scale(1.06);
  }

  /* 3. Floating Spatial Sidebar */
  .app-layout {
    height: 100vh;
    margin-top: 0;
    padding-top: 76px;
    background: transparent !important;
  }

  .sidebar {
    width: 275px !important;
    height: calc(100vh - 104px) !important;
    margin: 10px 0 24px 24px !important;
    border-radius: 28px !important;
    background: rgba(18, 20, 30, 0.55) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    backdrop-filter: blur(28px) saturate(190%) !important;
    -webkit-backdrop-filter: blur(28px) saturate(190%) !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.25) !important;
    padding: 18px 16px !important;
    overflow-y: auto;
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
    padding: 6px 8px 18px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 14px;
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    user-select: none;
  }

  .brand-badge-pill {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 12px rgba(255, 49, 84, 0.35);
  }

  .sidebar-logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sidebar-brand .brand-name {
    font-size: 19px;
    font-weight: 700;
    color: #FFF;
    letter-spacing: -0.3px;
  }

  .sidebar-brand .brand-accent {
    color: #FF3154;
  }

  .sidebar-brand .badge-free {
    background: linear-gradient(135deg, #FF3154, #FF5570);
    color: #FFF;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 10px;
    letter-spacing: 0.5px;
  }

  .sidebar-nav {
    gap: 4px;
  }

  .nav-item {
    gap: 14px;
    padding: 11px 16px !important;
    border-radius: 16px !important;
    color: rgba(255, 255, 255, 0.72) !important;
    font-weight: 500;
    font-size: 14.5px;
    transition: all 0.2s ease;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #FFF !important;
    transform: translateX(2px);
  }

  .nav-item.active {
    background: linear-gradient(135deg, rgba(255, 49, 84, 0.28) 0%, rgba(255, 85, 112, 0.16) 100%) !important;
    border: 1px solid rgba(255, 49, 84, 0.45) !important;
    color: #FFFFFF !important;
    box-shadow: 0 6px 20px rgba(255, 49, 84, 0.22) !important;
  }

  .nav-item.active svg {
    color: #FF3154 !important;
    filter: drop-shadow(0 0 6px rgba(255, 49, 84, 0.4));
  }

  .new-playlist-btn {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    border-radius: 16px !important;
    padding: 10px 16px !important;
    margin: 12px 0 16px 0 !important;
    color: #FFF !important;
    font-weight: 600;
    font-size: 13.5px;
    backdrop-filter: blur(12px);
    transition: all 0.2s ease;
  }

  .new-playlist-btn:hover {
    background: rgba(255, 255, 255, 0.14) !important;
    border-color: rgba(255, 255, 255, 0.25) !important;
    transform: translateY(-1px);
  }

  .playlist-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px !important;
    border-radius: 14px !important;
    margin-bottom: 4px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .playlist-item:hover {
    background: rgba(255, 255, 255, 0.08) !important;
  }

  .playlist-icon {
    width: 36px !important;
    height: 36px !important;
    border-radius: 10px !important;
    background: rgba(255, 255, 255, 0.10) !important;
    color: rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .playlist-icon.heart-icon {
    background: linear-gradient(135deg, #FF3154, #FF5570) !important;
    box-shadow: 0 4px 14px rgba(255, 49, 84, 0.4) !important;
    color: #FFF !important;
  }

  .playlist-title {
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #FFF !important;
    line-height: 1.3;
  }

  .playlist-meta {
    font-size: 11.5px !important;
    color: rgba(255, 255, 255, 0.5) !important;
  }

  /* 4. Main Scrollable Discovery Content */
  .main-content {
    padding: 10px 36px 140px 36px !important;
    background: transparent !important;
  }

  /* Carousel Navigation Arrows */
  .carousel-arrows .arrow-btn {
    width: 38px !important;
    height: 38px !important;
    border-radius: 50% !important;
    background: rgba(18, 20, 32, 0.55) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    backdrop-filter: blur(16px) !important;
    color: #FFF !important;
    font-size: 13px !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3) !important;
    transition: all 0.2s ease !important;
  }

  .carousel-arrows .arrow-btn:hover {
    background: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: scale(1.08);
  }

  /* 5. Latest Indian Releases (Spatial 3D Album Carousel) */
  .spatial-hero-shelf {
    margin-bottom: 30px !important;
  }

  .spatial-section-title {
    font-family: var(--font-family-display) !important;
    font-size: 23px !important;
    font-weight: 700 !important;
    color: #FFF !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    letter-spacing: -0.2px;
  }

  .shelf-title-arrow {
    color: rgba(255, 255, 255, 0.45);
    font-weight: 400;
  }

  .spatial-releases-carousel {
    display: flex;
    gap: 18px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 6px 2px 18px 2px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .spatial-releases-carousel::-webkit-scrollbar {
    display: none;
  }

  .spatial-album-card {
    flex: 0 0 185px !important;
    width: 185px !important;
    border-radius: 20px !important;
    background: rgba(18, 20, 32, 0.52) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    padding: 12px !important;
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.28s ease, border-color 0.28s ease !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
    cursor: pointer;
    scroll-snap-align: start;
  }

  .spatial-album-card:hover {
    transform: translateY(-8px) scale(1.02) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.35) !important;
  }

  .spatial-album-card .music-card-thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 12px;
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
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, transparent 40%, rgba(0, 0, 0, 0.35) 100%);
    pointer-events: none;
  }

  .spatial-album-card .music-card-play {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.88);
    color: #111;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.85);
    transition: all 0.22s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    border: none;
    cursor: pointer;
  }

  .spatial-album-card:hover .music-card-play {
    opacity: 1;
    transform: scale(1);
  }

  .spatial-album-card .music-card-play:hover {
    background: #FF3154;
    color: #FFF;
    transform: scale(1.1);
  }

  .spatial-album-card .music-card-title {
    font-size: 15px !important;
    font-weight: 700 !important;
    color: #FFF !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
  }

  .spatial-album-card .music-card-sub {
    font-size: 12px !important;
    color: rgba(255, 255, 255, 0.6) !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 6. Official Rankings: Top 20 Songs: India (Floating Glass Sheet) */
  .official-rankings-panel {
    background: rgba(18, 20, 32, 0.52) !important;
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 26px !important;
    backdrop-filter: blur(28px) saturate(190%) !important;
    -webkit-backdrop-filter: blur(28px) saturate(190%) !important;
    padding: 22px 26px !important;
    margin-bottom: 34px !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.22) !important;
  }

  .official-rankings-panel .shelf-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px !important;
  }

  .spatial-play-all-btn {
    display: inline-flex !important;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 20px !important;
    padding: 8px 18px !important;
    color: #FFF !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
    backdrop-filter: blur(12px) !important;
    transition: all 0.2s ease !important;
    cursor: pointer;
  }

  .spatial-play-all-btn:hover {
    background: #FF3154 !important;
    border-color: #FF3154 !important;
    box-shadow: 0 4px 16px rgba(255, 49, 84, 0.45) !important;
    transform: translateY(-1px);
  }

  .spatial-rankings-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 10px 18px !important;
  }

  @media (max-width: 1250px) {
    .spatial-rankings-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  .ranked-track-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px !important;
    border-radius: 14px !important;
    background: rgba(255, 255, 255, 0.04) !important;
    border: 1px solid transparent !important;
    transition: all 0.18s ease;
    cursor: pointer;
  }

  .ranked-track-card:hover {
    background: rgba(255, 255, 255, 0.10) !important;
    border-color: rgba(255, 255, 255, 0.16) !important;
    transform: translateX(3px);
  }

  .ranked-track-card .rank-number {
    font-size: 15px !important;
    font-weight: 700 !important;
    width: 20px !important;
    text-align: center;
    color: rgba(255, 255, 255, 0.7) !important;
  }

  .ranked-track-card .rank-number.top-three {
    color: #FF3154 !important;
    text-shadow: 0 0 10px rgba(255, 49, 84, 0.5);
  }

  .ranked-track-card .rank-badge {
    min-width: 34px !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    text-align: center;
  }

  .ranked-track-card .rank-badge.badge-up {
    color: #22C55E !important;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .ranked-track-card .rank-badge.badge-down {
    color: #FF4D6D !important;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .ranked-track-card .rank-badge.badge-same {
    color: rgba(255, 255, 255, 0.35) !important;
    font-size: 13px !important;
  }

  .ranked-track-card .rank-badge.badge-new {
    background: rgba(6, 182, 212, 0.25) !important;
    border: 1px solid rgba(6, 182, 212, 0.6) !important;
    color: #22D3EE !important;
    font-size: 9.5px !important;
    font-weight: 800 !important;
    padding: 2px 6px !important;
    border-radius: 6px !important;
  }

  .ranked-track-card .track-thumb-img {
    width: 44px !important;
    height: 44px !important;
    border-radius: 8px !important;
    object-fit: cover !important;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .ranked-track-card .track-row-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .ranked-track-card .track-row-title {
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #FFF !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ranked-track-card .track-row-artist {
    font-size: 11.5px !important;
    color: rgba(255, 255, 255, 0.58) !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ranked-track-card .track-row-duration {
    font-size: 12px !important;
    color: rgba(255, 255, 255, 0.45) !important;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }

  .track-more-menu-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.55);
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  .track-more-menu-btn:hover {
    color: #FFF;
    background: rgba(255, 255, 255, 0.12);
  }

  /* 7. Persistent Floating Spatial Bottom Music Player */
  .player-bar {
    position: fixed !important;
    bottom: 20px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: min(1160px, calc(100% - 64px)) !important;
    height: 82px !important;
    border-radius: 42px !important;
    background: rgba(18, 20, 32, 0.65) !important;
    border: 1px solid rgba(255, 255, 255, 0.22) !important;
    backdrop-filter: blur(32px) saturate(200%) !important;
    -webkit-backdrop-filter: blur(32px) saturate(200%) !important;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.35) !important;
    padding: 0 28px !important;
    z-index: 100 !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.25s ease;
  }

  .player-bar .progress-container {
    position: absolute !important;
    top: -2px !important;
    left: 40px !important;
    right: 40px !important;
    height: 10px !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    z-index: 10;
  }

  .player-bar .progress-bar-bg {
    width: 100%;
    height: 3px;
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 0.18) !important;
    position: relative;
    transition: height 120ms ease;
  }

  .player-bar .progress-container:hover .progress-bar-bg {
    height: 6px;
  }

  .player-bar .progress-bar-fill {
    height: 100%;
    border-radius: 9999px;
    background: linear-gradient(90deg, #FF3154, #FF5570) !important;
    box-shadow: 0 0 10px rgba(255, 49, 84, 0.5) !important;
  }

  .player-bar .progress-thumb {
    width: 14px !important;
    height: 14px !important;
    border-radius: 50% !important;
    background-color: #FF3154 !important;
    box-shadow: 0 0 12px rgba(255, 49, 84, 0.8) !important;
  }

  .player-bar .player-thumb-img {
    width: 52px !important;
    height: 52px !important;
    border-radius: 12px !important;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  }

  .player-bar .play-pause-btn {
    width: 48px !important;
    height: 48px !important;
    border-radius: 50% !important;
    background: linear-gradient(135deg, #FF3154, #FF5570) !important;
    color: #FFF !important;
    box-shadow: 0 8px 24px rgba(255, 49, 84, 0.48), inset 0 1px 1px rgba(255, 255, 255, 0.6) !important;
    transition: all 0.2s ease !important;
  }

  .player-bar .play-pause-btn:hover {
    transform: scale(1.06) !important;
    box-shadow: 0 10px 28px rgba(255, 49, 84, 0.65) !important;
  }

  .player-bar .volume-fill {
    background: #FF3154 !important;
  }

  #audioVisualizer {
    background: transparent !important;
    border-radius: 6px;
  }
}

/* 8. Mobile Touch-First Spatial Design (max-width: 768px) */
@media (max-width: 768px) {
  .sidebar-brand-header {
    display: none !important;
  }

  .spatial-rankings-grid {
    grid-template-columns: 1fr !important;
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

  /* Floating mini-player smoothly sitting above bottom tabs */
  .player-bar {
    position: fixed !important;
    bottom: calc(var(--mobile-tab-height, 56px) + 10px + env(safe-area-inset-bottom, 0px)) !important;
    left: 10px !important;
    right: 10px !important;
    width: auto !important;
    transform: none !important;
    height: 58px !important;
    border-radius: 18px !important;
    background: rgba(18, 20, 32, 0.82) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    backdrop-filter: blur(24px) !important;
    -webkit-backdrop-filter: blur(24px) !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.25) !important;
    padding: 0 14px !important;
    z-index: 100 !important;
  }

  .mobile-tab-bar {
    background: rgba(16, 18, 28, 0.85) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
    backdrop-filter: blur(24px) !important;
    -webkit-backdrop-filter: blur(24px) !important;
  }

  .mobile-tab-btn.active {
    color: #FF3154 !important;
  }
}
`;

css = css + spatialCss;
fs.writeFileSync('css/index.css', css, 'utf8');
console.log('Successfully written updated Spatial CSS to css/index.css');
