// REA Music Engine v2.4.1
if (window.__REA_INITIALIZED__) {
  console.log('[REA] App already initialized');
} else {
  window.__REA_INITIALIZED__ = true;
  const FALLBACK_COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231c1c1e'/%3E%3Cstop offset='100%25' stop-color='%232c2c2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23g)'/%3E%3Ccircle cx='150' cy='150' r='60' fill='%230071e3' opacity='0.85'/%3E%3Cpath d='M150 115v45.5c-2.4-1.4-5.2-2.3-8.2-2.3-9.1 0-16.5 7.4-16.5 16.5s7.4 16.5 16.5 16.5 16.5-7.4 16.5-16.5V131h16.5v-16H150z' fill='%23ffffff'/%3E%3C/svg%3E";
  /**
 * REA MUSIC - Application Engine
 * High-fidelity YouTube Music experience with:
 * - Real 320kbps Lossless Indian Music Streaming (JioSaavn CDN integration)
 * - Full SPA Navigation (Home, Explore, Library)
 * - Explore View: Latest Indian Releases, Top 20 Ranked Charts, Moods & Genres
 * - Library View: Liked Music, Custom Playlists with Modal, Listening History
 * - LocalStorage Persistence for Likes, History, and Custom Playlists
 * - Live synchronized karaoke lyrics with click-to-seek (LRCLIB integration)
 * - Real-time Web Audio API frequency spectrum analyzer
 * - Live Indian music search for millions of songs, movies & artists
 */

// =============================================================================
// 1. Initial Fallback Indian Tracks
// =============================================================================
const FALLBACK_TRACKS = [
  {
    id: 'track-kesariya',
    title: 'Kesariya (From "Brahmastra")',
    artist: 'Arijit Singh, Pritam, Amitabh Bhattacharya',
    album: 'Brahmastra',
    cover: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
    duration: 268,
    audioUrl: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4',
    language: 'hindi',
    lyrics: [
      { time: 9.4, text: 'मुझको इतना बताए कोई' },
      { time: 19.0, text: 'कैसे तुझसे दिल ना लगाए कोई?' },
      { time: 29.9, text: 'रब्बा ने तुझको बनाने में कर दी हैं हुस्न की खाली तिजोरियाँ' },
      { time: 41.2, text: 'काजल की सियाही से लिखी है तूने जाने कितनों की लव स्टोरियाँ' },
      { time: 52.8, text: 'केसरिया तेरा इश्क़ है पिया' },
      { time: 59.4, text: 'रंग जाऊँ जो मैं हाथ लगाऊँ' },
      { time: 64.9, text: 'दिन बीते सारा तेरी फ़िक्र में' },
      { time: 71.3, text: 'रैन सारी तेरी ख़ैर मनाऊँ' },
      { time: 76.8, text: 'केसरिया तेरा इश्क़ है पिया' }
    ]
  },
  {
    id: 'track-apna-bana-le',
    title: 'Apna Bana Le (From "Bhediya")',
    artist: 'Arijit Singh, Sachin-Jigar, Amitabh Bhattacharya',
    album: 'Bhediya',
    cover: 'https://c.saavncdn.com/815/Bhediya-Hindi-2022-20221208151046-500x500.jpg',
    duration: 261,
    audioUrl: 'https://aac.saavncdn.com/675/1456dc2903d0fb4465d2d2904008803b_320.mp4',
    language: 'hindi',
    lyrics: [
      { time: 14.5, text: 'तू मेरा कोई ना हो के भी कुछ लागे' },
      { time: 24.2, text: 'तू मेरा कोई ना हो के भी कुछ लागे' },
      { time: 34.0, text: 'किया रे जो भी तूने कैसे किया रे?' },
      { time: 42.1, text: 'जिया को मेरे बांध ऐसे लिया रे' },
      { time: 52.5, text: 'समझ के भी ना समझ मैं सकूँ' },
      { time: 61.8, text: 'सवेरों का मेरे तू सूरज लागे' },
      { time: 71.0, text: 'अपना बना ले पिया, अपना बना ले पिया' }
    ]
  },
  {
    id: 'track-tauba-tauba',
    title: 'Tauba Tauba (From "Bad Newz")',
    artist: 'Karan Aujla',
    album: 'Bad Newz',
    cover: 'https://c.saavncdn.com/657/Tauba-Tauba-From-Bad-Newz-Hindi-2024-20240702124503-500x500.jpg',
    duration: 207,
    audioUrl: 'https://aac.saavncdn.com/657/Tauba-Tauba-From-Bad-Newz-Hindi-2024-20240702124503_320.mp4',
    language: 'punjabi',
    lyrics: [
      { time: 10.2, text: 'Husn tera tauba tauba, nakhra tera tauba tauba' },
      { time: 20.5, text: 'Ishq mera tauba tauba, jado nikle tu kudiye saare karde tauba tauba' },
      { time: 35.8, text: 'Karan Aujla on the beat!' }
    ]
  }
];

// =============================================================================
// Offline Storage (IndexedDB for Persistent Lossless Audio & Offline Vault)
// =============================================================================
class OfflineStorage {
  constructor() {
    this.dbName = 'reamusic_offline_v1';
    this.storeName = 'downloaded_tracks';
    this.db = null;
    this.isReady = false;
    this.readyPromise = this.init();
  }

  init() {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('[OfflineStorage] IndexedDB not available');
        resolve(null);
        return;
      }
      try {
        const req = window.indexedDB.open(this.dbName, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
            store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
          }
        };
        req.onsuccess = (e) => {
          this.db = e.target.result;
          this.isReady = true;
          resolve(this.db);
        };
        req.onerror = (e) => {
          console.warn('[OfflineStorage] IndexedDB open failed:', e);
          resolve(null);
        };
      } catch (err) {
        console.warn('[OfflineStorage] IndexedDB initialization error:', err);
        resolve(null);
      }
    });
  }

  async getAllTracks() {
    await this.readyPromise;
    if (!this.db) return [];
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (err) {
        resolve([]);
      }
    });
  }

  async saveTrack(trackData) {
    await this.readyPromise;
    if (!this.db) return false;
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.put(trackData);
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteTrack(id) {
    await this.readyPromise;
    if (!this.db) return false;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  }

  async clearAll() {
    await this.readyPromise;
    if (!this.db) return false;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  }
}

// =============================================================================
// 2. Hybrid Audio Engine (HTML5 Media Element + Web Audio Analyser)
// =============================================================================
class HybridAudioEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.preload = 'auto';

    this.ctx = null;
    this.analyser = null;
    this.gainNode = null;
    this.sourceNode = null;
    this.volume = 0.75;
    this.isPlaying = false;
    this.currentTrack = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.sourceNode = this.ctx.createMediaElementSource(this.audio);
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio init notice:', e);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audio.volume = this.volume;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  playTrack(track) {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.currentTrack = track;
    const audioSource = track.localBlobUrl || track.audioUrl;
    if (audioSource) {
      if (this.audio.src !== audioSource) {
        this.audio.src = audioSource;
      }
      this.audio.play().catch(e => {
        console.warn('Audio play notice:', e);
      });
      this.isPlaying = true;
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.audio.src) {
      this.audio.play().catch(e => console.warn('Resume notice:', e));
      this.isPlaying = true;
    }
  }

  seek(timeInSeconds) {
    if (this.audio.duration && !isNaN(this.audio.duration)) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, timeInSeconds));
    }
  }
}

// =============================================================================
// 3. Main REA Music UI & Application Controller
// =============================================================================
class REAMusicApp {
  constructor() {
    this.engine = new HybridAudioEngine();

    // Data State
    this.quickPicks = [...FALLBACK_TRACKS];
    this.trendingHits = [];
    this.punjabiHits = [];
    this.romanticHits = [];
    this.exploreReleases = [];
    this.exploreCharts = [];
    this.queue = [...FALLBACK_TRACKS];
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.previousVolume = 0.75;
    this.repeatMode = 'all';
    this.isShuffle = false;
    this.activeTab = 'up-next';
    this.activeFilter = 'all';
    this.currentView = 'home'; // 'home', 'explore', 'library', 'downloads'
    this.currentLibTab = 'all'; // 'all', 'liked', 'downloads', 'playlists', 'history'

    // Offline Storage & Downloads Vault
    this.offlineStorage = new OfflineStorage();
    this.downloadedTracks = [];
    this.downloadedTrackIds = new Set();
    this.activeDownloads = new Map();
    this.downloadsFilter = '';

    // Persistent User Data from LocalStorage
    this.likedTracks = this.loadLocalStorage('rea_liked_tracks', FALLBACK_TRACKS.slice(0, 2));
    this.history = this.loadLocalStorage('rea_history', []);
    this.customPlaylists = this.loadLocalStorage('rea_custom_playlists', [
      {
        id: 'pl-bollywood-romance',
        title: 'Bollywood Romance Favorites',
        desc: 'Soulful melodies and romantic hits',
        cover: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
        tracks: [FALLBACK_TRACKS[0], FALLBACK_TRACKS[1]]
      }
    ]);

    this.likedTrackIds = new Set(this.likedTracks.map(t => t.id));
    this.searchDebounceTimer = null;
    this.currentTheme = 'white';

    // Search History & Recommendation State
    this.searchHistory = this.loadLocalStorage('rea_search_history', [
      'Arijit Singh',
      'Tauba Tauba',
      'Kesariya',
      'Diljit Dosanjh',
      'Bollywood Romance'
    ]);
    this.recommendations = [];
    this.trendingSearches = [
      'Arijit Singh',
      'Diljit Dosanjh',
      'Tauba Tauba',
      'Kesariya',
      'Bollywood Romance',
      'Sid Sriram',
      'Anirudh',
      'Punjabi Hits',
      'Shreya Ghoshal',
      'Karan Aujla',
      'Lofi Hindi'
    ];

    this.initDOMElements();
    this.initTheme();
    this.initOfflineStorage();
    this.bindEvents();
    this.startVisualizer();
    this.renderAll();
    this.loadIndianMusicCatalog();
    this.loadRecommendations();
  }

  async initOfflineStorage() {
    try {
      const records = await this.offlineStorage.getAllTracks();
      if (records && records.length > 0) {
        records.sort((a, b) => (b.downloadedAt || 0) - (a.downloadedAt || 0));
        records.forEach(r => {
          let localBlobUrl = null;
          if (r.audioBlob) {
            try {
              localBlobUrl = URL.createObjectURL(r.audioBlob);
            } catch (e) {
              console.warn('Object URL creation warning:', r.title, e);
            }
          }
          this.downloadedTracks.push({
            ...r,
            localBlobUrl
          });
          this.downloadedTrackIds.add(r.id);
        });
      }
      this.updateDownloadsStats();
      this.renderPlayerInfo();
      this.renderShelves();
      if (this.currentView === 'downloads') {
        this.renderDownloads();
      }
      if (this.currentView === 'library') {
        this.renderLibrary();
      }
    } catch (err) {
      console.warn('[OfflineStorage] Error loading offline tracks:', err);
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('rea_theme');
    const validTheme = savedTheme === 'dark' ? 'dark' : 'white';
    this.setTheme(validTheme, false);
  }

  setTheme(themeName, showToastFeedback = true) {
    const targetTheme = themeName === 'dark' ? 'dark' : 'white';
    this.currentTheme = targetTheme;
    document.body.classList.remove('theme-white', 'theme-dark', 'theme-lilac', 'theme-peach');
    document.body.classList.add(`theme-${targetTheme}`);

    if (this.themeOptionBtns) {
      this.themeOptionBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === targetTheme);
      });
    }

    if (this.themeChoiceCards) {
      this.themeChoiceCards.forEach(card => {
        card.classList.toggle('active', card.dataset.theme === targetTheme);
      });
    }

    try {
      localStorage.setItem('rea_theme', targetTheme);
    } catch (e) { }

    if (showToastFeedback) {
      const label = targetTheme === 'dark' ? 'Simple Black' : 'Glass White';
      this.showToast(`Switched to ${label}`);
    }
  }

  loadLocalStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  saveLocalStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  initDOMElements() {
    // Settings & Theme Switcher Elements
    this.settingsBtn = document.getElementById('settingsBtn');
    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
    this.themeChoiceCards = document.querySelectorAll('.theme-choice-card');
    this.themeOptionBtns = document.querySelectorAll('.theme-option-btn');
    this.settingVisualizerToggle = document.getElementById('settingVisualizerToggle');
    this.settingClearHistoryBtn = document.getElementById('settingClearHistoryBtn');

    // Navigation items
    this.navHome = document.getElementById('navHome');
    this.navExplore = document.getElementById('navExplore');
    this.navLibrary = document.getElementById('navLibrary');
    this.navDownloads = document.getElementById('navDownloads');
    this.sidebarDownloadsBadge = document.getElementById('sidebarDownloadsBadge');

    // Views
    this.viewHome = document.getElementById('viewHome');
    this.viewExplore = document.getElementById('viewExplore');
    this.viewLibrary = document.getElementById('viewLibrary');
    this.viewDownloads = document.getElementById('viewDownloads');

    // Downloads View Elements
    this.downloadsHeroCard = document.getElementById('downloadsHeroCard');
    this.downloadsCount = document.getElementById('downloadsCount');
    this.downloadsTotalSize = document.getElementById('downloadsTotalSize');
    this.playAllDownloadsBtn = document.getElementById('playAllDownloadsBtn');
    this.shuffleDownloadsBtn = document.getElementById('shuffleDownloadsBtn');
    this.downloadAllLikedBtn = document.getElementById('downloadAllLikedBtn');
    this.clearAllDownloadsBtn = document.getElementById('clearAllDownloadsBtn');
    this.storageStatsText = document.getElementById('storageStatsText');
    this.storageMeterFill = document.getElementById('storageMeterFill');
    this.downloadsSearchInput = document.getElementById('downloadsSearchInput');
    this.downloadsTracksList = document.getElementById('downloadsTracksList');

    // Library Downloads Shelf Elements
    this.libDownloadsShelf = document.getElementById('libDownloadsShelf');
    this.libDownloadsList = document.getElementById('libDownloadsList');
    this.viewAllDownloadsBtn = document.getElementById('viewAllDownloadsBtn');

    // Header & Search Hub
    this.searchInput = document.getElementById('searchInput');
    this.searchClearBtn = document.getElementById('searchClearBtn');
    this.searchDropdown = document.getElementById('searchDropdown');
    this.searchHubContent = document.getElementById('searchHubContent');
    this.searchRecentSection = document.getElementById('searchRecentSection');
    this.searchHistoryList = document.getElementById('searchHistoryList');
    this.searchClearHistoryBtn = document.getElementById('searchClearHistoryBtn');
    this.trendingTagsGrid = document.getElementById('trendingTagsGrid');
    this.searchRecoList = document.getElementById('searchRecoList');
    this.searchResultsList = document.getElementById('searchResultsList');

    // Home Recommended Shelf Elements
    this.recommendedShelf = document.getElementById('recommendedShelf');
    this.recommendedCarousel = document.getElementById('recommendedCarousel');
    this.recommendedPrevBtn = document.getElementById('recommendedPrevBtn');
    this.recommendedNextBtn = document.getElementById('recommendedNextBtn');

    // Drawer Related & Recommendations Pane
    this.relatedContainer = document.getElementById('relatedContainer');
    this.relatedArtistCard = document.getElementById('relatedArtistCard');
    this.relatedTracksList = document.getElementById('relatedTracksList');

    // Sidebar
    this.sidebar = document.getElementById('sidebar');
    this.menuToggleBtn = document.getElementById('menuToggleBtn');
    this.sidebarBackdrop = document.getElementById('sidebarBackdrop');
    this.likedCount = document.getElementById('likedCount');
    this.playlistsList = document.getElementById('playlistsList');
    this.newPlaylistBtn = document.getElementById('newPlaylistBtn');

    // Home View Elements
    this.chipsContainer = document.getElementById('chipsContainer');
    this.quickPicksGrid = document.getElementById('quickPicksGrid');
    this.trendingCarousel = document.getElementById('trendingCarousel');
    this.focusCarousel = document.getElementById('focusCarousel');
    this.moodsGrid = document.getElementById('moodsGrid');
    this.playAllQuickPicksBtn = document.getElementById('playAllQuickPicksBtn');
    this.trendingPrevBtn = document.getElementById('trendingPrevBtn');
    this.trendingNextBtn = document.getElementById('trendingNextBtn');

    // Explore View Elements
    this.exploreReleasesCarousel = document.getElementById('exploreReleasesCarousel');
    this.exploreChartsGrid = document.getElementById('exploreChartsGrid');
    this.exploreGenreGrid = document.getElementById('exploreGenreGrid');
    this.playAllChartsBtn = document.getElementById('playAllChartsBtn');
    this.exploreNavBtns = document.querySelectorAll('.explore-nav-btn');

    // Library View Elements
    this.libChips = document.querySelectorAll('.lib-chip');
    this.libLikedHero = document.getElementById('libLikedHero');
    this.libLikedTotalCount = document.getElementById('libLikedTotalCount');
    this.playAllLikedBtn = document.getElementById('playAllLikedBtn');
    this.shuffleLikedBtn = document.getElementById('shuffleLikedBtn');
    this.libLikedList = document.getElementById('libLikedList');
    this.libPlaylistsGrid = document.getElementById('libPlaylistsGrid');
    this.libHistoryList = document.getElementById('libHistoryList');
    this.createPlaylistLibBtn = document.getElementById('createPlaylistLibBtn');
    this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
    this.libLikedSongsShelf = document.getElementById('libLikedSongsShelf');
    this.libPlaylistsShelf = document.getElementById('libPlaylistsShelf');
    this.libHistoryShelf = document.getElementById('libHistoryShelf');

    // Player Bar & Mobile Tabs
    this.playerBar = document.getElementById('playerBar');
    this.mobileTabBar = document.getElementById('mobileTabBar');
    this.mobileTabBtns = document.querySelectorAll('.mobile-tab-btn');
    this.maxGrabHandle = document.getElementById('maxGrabHandle');
    this.playerThumbContainer = document.getElementById('playerThumbContainer');
    this.playerThumb = document.getElementById('playerThumbImg');
    this.playerTrackTitle = document.getElementById('playerTitle');
    this.playerArtist = document.getElementById('playerArtist');
    this.playerAlbum = document.getElementById('playerAlbum');
    this.likeBtn = document.getElementById('likeBtn');
    this.dislikeBtn = document.getElementById('dislikeBtn');
    this.playerDownloadBtn = document.getElementById('playerDownloadBtn');
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.playIcon = document.getElementById('playSvg');
    this.pauseIcon = document.getElementById('pauseSvg');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.shuffleBtn = document.getElementById('shuffleBtn');
    this.repeatBtn = document.getElementById('repeatBtn');
    this.currentTimeDisplay = document.getElementById('timeCurrent');
    this.totalDurationDisplay = document.getElementById('timeTotal');
    this.progressBarWrapper = document.getElementById('progressContainer');
    this.progressBarFill = document.getElementById('progressFill');
    this.scrubHandle = document.getElementById('progressThumb');
    this.scrubTooltip = document.getElementById('progressTooltip');
    this.volumeBtn = document.getElementById('volumeBtn');
    this.volHighSvg = document.getElementById('volHighSvg');
    this.volMuteSvg = document.getElementById('volMuteSvg');
    this.volumeTrack = document.getElementById('volumeTrack');
    this.volumeFill = document.getElementById('volumeFill');
    this.audioVisualizer = document.getElementById('audioVisualizer');
    this.toggleQueueBtn = document.getElementById('toggleQueueBtn');
    this.toggleLyricsBtn = document.getElementById('toggleLyricsBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');

    // Maximized Theater Player View Elements
    this.isPlayerMaximized = false;
    this.currentMaxTab = 'song';
    this.maximizedPlayer = document.getElementById('maximizedPlayer');
    this.minimizePlayerBtn = document.getElementById('minimizePlayerBtn');
    this.maxAmbientGlow = document.getElementById('maxAmbientGlow');
    this.maxTabsNav = document.getElementById('maxTabsNav');
    this.maxTabBtns = document.querySelectorAll('.max-tab-btn');
    this.maxFullscreenToggleBtn = document.getElementById('maxFullscreenToggleBtn');
    this.maxStageLeft = document.getElementById('maxStageLeft');
    this.maxStageRight = document.getElementById('maxStageRight');
    this.maxAlbumArt = document.getElementById('maxAlbumArt');
    this.maxTrackTitle = document.getElementById('maxTrackTitle');
    this.maxTrackArtist = document.getElementById('maxTrackArtist');
    this.maxTrackAlbum = document.getElementById('maxTrackAlbum');
    this.maxLikeBtn = document.getElementById('maxLikeBtn');
    this.maxDislikeBtn = document.getElementById('maxDislikeBtn');
    this.maxDownloadBtn = document.getElementById('maxDownloadBtn');
    this.maxLyricsPane = document.getElementById('maxLyricsPane');
    this.maxQueuePane = document.getElementById('maxQueuePane');
    this.maxLyricsScroll = document.getElementById('maxLyricsScroll');
    this.maxQueueList = document.getElementById('maxQueueList');
    this.maxQueueCount = document.getElementById('maxQueueCount');
    this.maxTimeCurrent = document.getElementById('maxTimeCurrent');
    this.maxTimeTotal = document.getElementById('maxTimeTotal');
    this.maxProgressTrack = document.getElementById('maxProgressTrack');
    this.maxProgressFill = document.getElementById('maxProgressFill');
    this.maxProgressThumb = document.getElementById('maxProgressThumb');
    this.maxShuffleBtn = document.getElementById('maxShuffleBtn');
    this.maxPrevBtn = document.getElementById('maxPrevBtn');
    this.maxPlayPauseBtn = document.getElementById('maxPlayPauseBtn');
    this.maxPlaySvg = document.getElementById('maxPlaySvg');
    this.maxPauseSvg = document.getElementById('maxPauseSvg');
    this.maxNextBtn = document.getElementById('maxNextBtn');
    this.maxRepeatBtn = document.getElementById('maxRepeatBtn');
    this.maxVolumeBtn = document.getElementById('maxVolumeBtn');
    this.maxVolHighSvg = document.getElementById('maxVolHighSvg');
    this.maxVolMuteSvg = document.getElementById('maxVolMuteSvg');
    this.maxVolumeTrack = document.getElementById('maxVolumeTrack');
    this.maxVolumeFill = document.getElementById('maxVolumeFill');

    // Right Drawer (Queue / Lyrics)
    this.queuePanel = document.getElementById('queuePanel');
    this.closeQueueBtn = document.getElementById('closeQueueBtn');
    this.queueTabs = document.querySelectorAll('.queue-tab');
    this.tabPanes = document.querySelectorAll('.tab-pane');
    this.queueList = document.getElementById('queueList');
    this.lyricsBody = document.getElementById('lyricsBody');
    this.clearQueueBtn = document.getElementById('clearQueueBtn');
    this.lyricsTrackTitle = document.getElementById('lyricsTrackTitle');
    this.lyricsArtistName = document.getElementById('lyricsArtistName');

    // Modal
    this.playlistModal = document.getElementById('playlistModal');
    this.closePlaylistModalBtn = document.getElementById('closePlaylistModalBtn');
    this.cancelPlaylistModalBtn = document.getElementById('cancelPlaylistModalBtn');
    this.confirmCreatePlaylistBtn = document.getElementById('confirmCreatePlaylistBtn');
    this.playlistTitleInput = document.getElementById('playlistTitleInput');
    this.playlistDescInput = document.getElementById('playlistDescInput');
    this.toast = document.getElementById('toast');
    this.toastMessage = document.getElementById('toastMessage');
  }

  openSettingsModal() {
    if (this.settingsModal) {
      this.settingsModal.classList.remove('hidden');
      this.settingsModal.style.display = 'flex';
      if (this.themeChoiceCards) {
        this.themeChoiceCards.forEach(card => {
          card.classList.toggle('active', card.dataset.theme === this.currentTheme);
        });
      }
    }
  }

  closeSettingsModal() {
    if (this.settingsModal) {
      this.settingsModal.classList.add('hidden');
      this.settingsModal.style.display = 'none';
    }
  }

  bindEvents() {
    // 0. Settings Modal & Theme Selection
    if (this.settingsBtn) {
      this.settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openSettingsModal();
      });
    }

    if (this.closeSettingsModalBtn) {
      this.closeSettingsModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeSettingsModal();
      });
    }

    if (this.settingsModal) {
      this.settingsModal.addEventListener('click', (e) => {
        if (e.target === this.settingsModal) {
          this.closeSettingsModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSettingsModal();
      }
    });

    if (this.themeChoiceCards) {
      this.themeChoiceCards.forEach(card => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          const theme = card.dataset.theme;
          if (theme) {
            this.setTheme(theme, true);
          }
        });
      });
    }

    if (this.settingVisualizerToggle) {
      this.settingVisualizerToggle.addEventListener('change', (e) => {
        if (this.audioVisualizer) {
          this.audioVisualizer.style.display = e.target.checked ? 'block' : 'none';
        }
        this.showToast(e.target.checked ? 'Visualizer enabled' : 'Visualizer hidden');
      });
    }

    if (this.settingClearHistoryBtn) {
      this.settingClearHistoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.history = [];
        this.saveLocalStorage('rea_history', []);
        this.renderHistory();
        this.showToast('Listening history cleared');
      });
    }

    if (this.themeOptionBtns) {
      this.themeOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const theme = btn.dataset.theme;
          if (theme) {
            this.setTheme(theme, true);
          }
        });
      });
    }

    // 1. Navigation Routing (Home, Explore, Library)
    if (this.navHome) {
      this.navHome.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('home');
      });
    }
    if (this.navExplore) {
      this.navExplore.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('explore');
      });
    }
    if (this.navLibrary) {
      this.navLibrary.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('library');
      });
    }
    if (this.navDownloads) {
      this.navDownloads.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('downloads');
      });
    }

    // Downloads View & Player Actions
    if (this.viewAllDownloadsBtn) {
      this.viewAllDownloadsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('downloads');
      });
    }

    if (this.playAllDownloadsBtn) {
      this.playAllDownloadsBtn.addEventListener('click', () => {
        if (this.downloadedTracks.length > 0) {
          this.queue = [...this.downloadedTracks];
          this.playTrack(0);
          this.showToast('Playing all downloaded tracks');
        } else {
          this.showToast('No downloaded tracks available');
        }
      });
    }

    if (this.shuffleDownloadsBtn) {
      this.shuffleDownloadsBtn.addEventListener('click', () => {
        if (this.downloadedTracks.length > 0) {
          const shuffled = [...this.downloadedTracks].sort(() => Math.random() - 0.5);
          this.queue = shuffled;
          this.playTrack(0);
          this.showToast('Shuffling downloaded tracks');
        } else {
          this.showToast('No downloaded tracks available');
        }
      });
    }

    if (this.downloadAllLikedBtn) {
      this.downloadAllLikedBtn.addEventListener('click', () => {
        this.downloadAllLikedSongs();
      });
    }

    if (this.clearAllDownloadsBtn) {
      this.clearAllDownloadsBtn.addEventListener('click', () => {
        this.clearAllDownloads();
      });
    }

    if (this.downloadsSearchInput) {
      this.downloadsSearchInput.addEventListener('input', (e) => {
        this.downloadsFilter = e.target.value;
        this.renderDownloads();
      });
    }

    if (this.playerDownloadBtn) {
      this.playerDownloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const track = this.queue[this.currentTrackIndex];
        if (track) this.handleDownloadButtonClick(track);
      });
    }

    if (this.maxDownloadBtn) {
      this.maxDownloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const track = this.queue[this.currentTrackIndex];
        if (track) this.handleDownloadButtonClick(track);
      });
    }

    // 1B. Mobile Bottom Tab Bar (Apple Music iOS Style)
    if (this.mobileTabBtns) {
      this.mobileTabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const view = btn.dataset.view;
          if (view) {
            this.switchView(view);
          } else if (btn.id === 'mobileTabSearch') {
            if (this.searchInput) {
              this.searchInput.focus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        });
      });
    }

    // 2. Playback controls
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevTrack());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextTrack());
    }

    if (this.repeatBtn) {
      this.repeatBtn.addEventListener('click', () => {
        this.repeatMode = this.repeatMode === 'all' ? 'one' : this.repeatMode === 'one' ? 'off' : 'all';
        this.repeatBtn.style.color = this.repeatMode === 'off' ? '#aaa' : '#fff';
        this.repeatBtn.title = `Repeat: ${this.repeatMode}`;
      });
    }

    if (this.shuffleBtn) {
      this.shuffleBtn.addEventListener('click', () => {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.style.color = this.isShuffle ? '#ff0033' : '#aaa';
      });
    }

    // 3. Audio element listeners
    this.engine.audio.addEventListener('timeupdate', () => {
      const cur = this.engine.audio.currentTime || 0;
      const dur = this.engine.audio.duration || this.queue[this.currentTrackIndex]?.duration || 1;
      this.updateProgressBar(cur, dur);
      this.updateSyncedLyrics(cur);
    });

    this.engine.audio.addEventListener('ended', () => {
      if (this.repeatMode === 'one') {
        this.engine.audio.currentTime = 0;
        this.engine.audio.play();
      } else {
        this.nextTrack();
      }
    });

    this.engine.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayPauseUI();
      this.renderShelves();
    });

    this.engine.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayPauseUI();
      this.renderShelves();
    });

    // 4. Progress bar seeking
    if (this.progressBarWrapper) {
      this.progressBarWrapper.addEventListener('click', (e) => {
        const rect = this.progressBarWrapper.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const dur = this.engine.audio.duration || this.queue[this.currentTrackIndex]?.duration || 0;
        this.engine.seek(pct * dur);
      });

      this.progressBarWrapper.addEventListener('mousemove', (e) => {
        const rect = this.progressBarWrapper.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const dur = this.engine.audio.duration || this.queue[this.currentTrackIndex]?.duration || 0;
        if (this.scrubTooltip) {
          this.scrubTooltip.style.display = 'block';
          this.scrubTooltip.style.left = `${pct * 100}%`;
          this.scrubTooltip.textContent = this.formatTime(pct * dur);
        }
      });

      this.progressBarWrapper.addEventListener('mouseleave', () => {
        if (this.scrubTooltip) {
          this.scrubTooltip.style.display = 'none';
        }
      });
    }

    // 5. Volume controls
    if (this.volumeTrack) {
      this.volumeTrack.addEventListener('click', (e) => {
        const rect = this.volumeTrack.getBoundingClientRect();
        const val = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.setVolume(val);
      });
    }

    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', () => {
        if (this.isMuted) {
          this.setVolume(this.previousVolume || 0.75);
          this.isMuted = false;
        } else {
          this.previousVolume = this.engine.volume || 0.75;
          this.setVolume(0);
          this.isMuted = true;
        }
      });
    }

    // 6. Like / Unlike (Persisted)
    if (this.likeBtn) {
      this.likeBtn.addEventListener('click', () => {
        const track = this.queue[this.currentTrackIndex];
        if (!track) return;
        this.toggleLikeTrack(track);
      });
    }

    // 7. Search input with History, Trending & Recommendations
    if (this.searchInput) {
      this.searchInput.addEventListener('focus', () => {
        if (this.searchDropdown) this.searchDropdown.classList.remove('hidden');
        if (!this.searchInput.value.trim()) {
          if (this.searchHubContent) this.searchHubContent.classList.remove('hidden');
          if (this.searchResultsList) this.searchResultsList.classList.add('hidden');
          this.renderSearchHub();
        }
      });

      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchDebounceTimer);
        const query = e.target.value;
        if (!query.trim()) {
          if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
          if (this.searchHubContent) this.searchHubContent.classList.remove('hidden');
          if (this.searchResultsList) this.searchResultsList.classList.add('hidden');
          this.renderSearchHub();
          return;
        }
        if (this.searchClearBtn) this.searchClearBtn.classList.remove('hidden');
        if (this.searchDropdown) this.searchDropdown.classList.remove('hidden');
        if (this.searchHubContent) this.searchHubContent.classList.add('hidden');
        if (this.searchResultsList) {
          this.searchResultsList.classList.remove('hidden');
          this.searchResultsList.innerHTML = `<div style="padding:16px;color:#aaa;text-align:center;">Searching Indian hits for "${query}"...</div>`;
        }

        this.searchDebounceTimer = setTimeout(() => {
          this.performLiveSearch(query);
        }, 250);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = this.searchInput.value.trim();
          if (query) {
            this.addSearchHistory(query);
            this.performLiveSearch(query);
          }
        }
      });
    }

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener('click', () => {
        if (this.searchInput) {
          this.searchInput.value = '';
          this.searchInput.focus();
        }
        this.searchClearBtn.classList.add('hidden');
        if (this.searchHubContent) this.searchHubContent.classList.remove('hidden');
        if (this.searchResultsList) this.searchResultsList.classList.add('hidden');
        this.renderSearchHub();
      });
    }

    if (this.searchClearHistoryBtn) {
      this.searchClearHistoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.clearSearchHistory();
      });
    }

    if (this.recommendedPrevBtn && this.recommendedCarousel) {
      this.recommendedPrevBtn.addEventListener('click', () => {
        this.recommendedCarousel.scrollBy({ left: -420, behavior: 'smooth' });
      });
    }
    if (this.recommendedNextBtn && this.recommendedCarousel) {
      this.recommendedNextBtn.addEventListener('click', () => {
        this.recommendedCarousel.scrollBy({ left: 420, behavior: 'smooth' });
      });
    }

    document.addEventListener('click', (e) => {
      if (this.searchInput && this.searchDropdown && !this.searchInput.contains(e.target) && !this.searchDropdown.contains(e.target)) {
        this.searchDropdown.classList.add('hidden');
      }
    });

    // 8. Right drawer toggle & tabs
    if (this.toggleQueueBtn) {
      this.toggleQueueBtn.addEventListener('click', () => {
        if (this.queuePanel) this.queuePanel.classList.toggle('hidden');
      });
    }
    if (this.toggleLyricsBtn) {
      this.toggleLyricsBtn.addEventListener('click', () => {
        if (this.queuePanel) {
          this.queuePanel.classList.remove('hidden');
          this.switchTab('lyrics');
        }
      });
    }
    if (this.closeQueueBtn) {
      this.closeQueueBtn.addEventListener('click', () => {
        if (this.queuePanel) this.queuePanel.classList.add('hidden');
      });
    }

    this.queueTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    if (this.clearQueueBtn) {
      this.clearQueueBtn.addEventListener('click', () => {
        const current = this.queue[this.currentTrackIndex];
        this.queue = current ? [current] : [];
        this.currentTrackIndex = 0;
        this.renderQueue();
      });
    }

    // 9. Filter chips in Home
    if (this.chipsContainer) {
      this.chipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        this.applyFilter(filter);
      });
    }

    // 10. Play All Buttons
    if (this.playAllQuickPicksBtn) {
      this.playAllQuickPicksBtn.addEventListener('click', () => {
        if (this.quickPicks.length > 0) {
          this.queue = [...this.quickPicks];
          this.playTrack(0);
        }
      });
    }
    if (this.playAllChartsBtn) {
      this.playAllChartsBtn.addEventListener('click', () => {
        if (this.exploreCharts.length > 0) {
          this.queue = [...this.exploreCharts];
          this.playTrack(0);
        }
      });
    }
    if (this.playAllLikedBtn) {
      this.playAllLikedBtn.addEventListener('click', () => {
        if (this.likedTracks.length > 0) {
          this.queue = [...this.likedTracks];
          this.playTrack(0);
        }
      });
    }
    if (this.shuffleLikedBtn) {
      this.shuffleLikedBtn.addEventListener('click', () => {
        if (this.likedTracks.length > 0) {
          const shuffled = [...this.likedTracks].sort(() => Math.random() - 0.5);
          this.queue = shuffled;
          this.playTrack(0);
        }
      });
    }

    // 11. Sidebar playlists click
    if (this.playlistsList) {
      this.playlistsList.addEventListener('click', (e) => {
        const item = e.target.closest('.playlist-item');
        if (!item) return;
        document.querySelectorAll('.playlist-item').forEach(i => i.classList.remove('active-playlist'));
        item.classList.add('active-playlist');
        const pl = item.dataset.playlist;

        if (pl === 'liked') {
          this.switchView('library');
          this.filterLibraryTab('liked');
        } else {
          this.loadCategoryPlaylist(pl);
        }
      });
    }

    // 12. Explore navigation buttons
    this.exploreNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.exploreScroll;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // 13. Explore genre tiles click
    if (this.exploreGenreGrid) {
      this.exploreGenreGrid.addEventListener('click', (e) => {
        const tile = e.target.closest('.genre-tile');
        if (!tile) return;
        const query = tile.dataset.searchGenre;
        if (query) {
          this.switchView('home');
          if (this.searchInput) {
            this.searchInput.value = query;
            this.performLiveSearch(query);
            this.searchDropdown.classList.remove('hidden');
          }
        }
      });
    }

    // 13b. Mood cards grid click in Home
    if (this.moodsGrid) {
      this.moodsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.mood-card');
        if (!card) return;
        const genre = card.dataset.genre;
        if (genre) {
          document.querySelectorAll('.filter-chip').forEach(c => {
            c.classList.toggle('active', c.dataset.filter === genre);
          });
          this.applyFilter(genre);
        }
      });
    }

    // 14. Library filter chips
    this.libChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const tab = chip.dataset.libTab;
        this.filterLibraryTab(tab);
      });
    });

    // 15. Create Playlist Modal
    const openModal = () => {
      if (this.playlistModal) {
        this.playlistModal.classList.remove('hidden');
        if (this.playlistTitleInput) {
          this.playlistTitleInput.value = '';
          this.playlistTitleInput.focus();
        }
        if (this.playlistDescInput) this.playlistDescInput.value = '';
      }
    };
    const closeModal = () => {
      if (this.playlistModal) this.playlistModal.classList.add('hidden');
    };

    if (this.newPlaylistBtn) this.newPlaylistBtn.addEventListener('click', openModal);
    if (this.createPlaylistLibBtn) this.createPlaylistLibBtn.addEventListener('click', openModal);
    if (this.closePlaylistModalBtn) this.closePlaylistModalBtn.addEventListener('click', closeModal);
    if (this.cancelPlaylistModalBtn) this.cancelPlaylistModalBtn.addEventListener('click', closeModal);

    if (this.confirmCreatePlaylistBtn) {
      this.confirmCreatePlaylistBtn.addEventListener('click', () => {
        const title = this.playlistTitleInput.value.trim();
        if (!title) return;
        const desc = this.playlistDescInput.value.trim();
        const newPl = {
          id: `pl-${Date.now()}`,
          title,
          desc: desc || 'Custom Playlist',
          cover: this.queue[this.currentTrackIndex]?.cover || 'assets/midnight_vibes.jpg',
          tracks: []
        };
        this.customPlaylists.push(newPl);
        this.saveLocalStorage('rea_custom_playlists', this.customPlaylists);
        closeModal();
        this.renderLibrary();
        this.showToast(`Playlist "${title}" created!`);
      });
    }

    // 16. Clear History
    if (this.clearHistoryBtn) {
      this.clearHistoryBtn.addEventListener('click', () => {
        this.history = [];
        this.saveLocalStorage('rea_history', []);
        this.renderLibraryHistory();
        this.showToast('Listening history cleared');
      });
    }

    // 17. Mobile Hamburger Menu & Slide-in Drawer Toggle
    const toggleMobileMenu = () => {
      if (!this.sidebar) return;
      const isOpen = this.sidebar.classList.toggle('mobile-open');
      if (this.sidebarBackdrop) {
        this.sidebarBackdrop.classList.toggle('hidden', !isOpen);
      }
    };

    const closeMobileMenu = () => {
      if (this.sidebar) this.sidebar.classList.remove('mobile-open');
      if (this.sidebarBackdrop) this.sidebarBackdrop.classList.add('hidden');
    };

    this.closeMobileMenu = closeMobileMenu;

    if (this.menuToggleBtn) {
      this.menuToggleBtn.addEventListener('click', toggleMobileMenu);
    }
    if (this.sidebarBackdrop) {
      this.sidebarBackdrop.addEventListener('click', closeMobileMenu);
    }

    // 18. Carousel arrows
    if (this.trendingPrevBtn && this.trendingCarousel) {
      this.trendingPrevBtn.addEventListener('click', () => {
        this.trendingCarousel.scrollBy({ left: -400, behavior: 'smooth' });
      });
    }
    if (this.trendingNextBtn && this.trendingCarousel) {
      this.trendingNextBtn.addEventListener('click', () => {
        this.trendingCarousel.scrollBy({ left: 400, behavior: 'smooth' });
      });
    }

    // 19. Maximized / Minimized Player Listeners
    // A. Maximize triggers: clicking mini-player bar, thumbnail container, song title, or fullscreen button
    if (this.playerBar) {
      this.playerBar.addEventListener('click', (e) => {
        // Do not maximize if clicking on playback buttons or progress bar
        if (e.target.closest('button') || e.target.closest('.progress-container')) return;
        this.maximizePlayer();
      });
    }
    if (this.playerThumbContainer) {
      this.playerThumbContainer.addEventListener('click', () => this.maximizePlayer());
    }
    if (this.playerTrackTitle) {
      this.playerTrackTitle.addEventListener('click', () => this.maximizePlayer());
    }
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.maximizePlayer());
    }

    // B. Minimize triggers: clicking down chevron button, iOS grab handle, or Escape key
    if (this.minimizePlayerBtn) {
      this.minimizePlayerBtn.addEventListener('click', () => this.minimizePlayer());
    }
    if (this.maxGrabHandle) {
      this.maxGrabHandle.addEventListener('click', () => this.minimizePlayer());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isPlayerMaximized) {
        this.minimizePlayer();
      }
    });

    // C. Maximized Tab switching
    this.maxTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.maxTab;
        this.switchMaxTab(tab);
      });
    });

    // D. Maximized Playback controls
    if (this.maxPlayPauseBtn) {
      this.maxPlayPauseBtn.addEventListener('click', () => this.togglePlayPause());
    }
    if (this.maxPrevBtn) {
      this.maxPrevBtn.addEventListener('click', () => this.prevTrack());
    }
    if (this.maxNextBtn) {
      this.maxNextBtn.addEventListener('click', () => this.nextTrack());
    }
    if (this.maxShuffleBtn) {
      this.maxShuffleBtn.addEventListener('click', () => {
        if (this.shuffleBtn) this.shuffleBtn.click();
        this.syncControlStates();
      });
    }
    if (this.maxRepeatBtn) {
      this.maxRepeatBtn.addEventListener('click', () => {
        if (this.repeatBtn) this.repeatBtn.click();
        this.syncControlStates();
      });
    }
    if (this.maxLikeBtn) {
      this.maxLikeBtn.addEventListener('click', () => {
        const track = this.queue[this.currentTrackIndex];
        if (track) this.toggleLikeTrack(track);
      });
    }
    if (this.maxDislikeBtn) {
      this.maxDislikeBtn.addEventListener('click', () => {
        this.showToast('We will tune your recommendations');
        this.nextTrack();
      });
    }
    if (this.maxFullscreenToggleBtn) {
      this.maxFullscreenToggleBtn.addEventListener('click', () => this.toggleFullscreenWindow());
    }

    // E. Maximized Scrubber scrubbing
    if (this.maxProgressTrack) {
      this.maxProgressTrack.addEventListener('click', (e) => {
        const rect = this.maxProgressTrack.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const dur = this.engine.audio.duration || this.queue[this.currentTrackIndex]?.duration || 0;
        this.engine.seek(pct * dur);
      });
    }

    // F. Maximized Volume slider & button
    if (this.maxVolumeTrack) {
      this.maxVolumeTrack.addEventListener('click', (e) => {
        const rect = this.maxVolumeTrack.getBoundingClientRect();
        const val = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.setVolume(val);
      });
    }
    if (this.maxVolumeBtn) {
      this.maxVolumeBtn.addEventListener('click', () => {
        if (this.volumeBtn) this.volumeBtn.click();
      });
    }
  }

  // ===========================================================================
  // SPA View Router (Home, Explore, Library)
  // ===========================================================================
  switchView(viewName) {
    this.currentView = viewName;
    if (this.closeMobileMenu) this.closeMobileMenu();

    // Update Sidebar Navigation state
    if (this.navHome) this.navHome.classList.toggle('active', viewName === 'home');
    if (this.navExplore) this.navExplore.classList.toggle('active', viewName === 'explore');
    if (this.navLibrary) this.navLibrary.classList.toggle('active', viewName === 'library');
    if (this.navDownloads) this.navDownloads.classList.toggle('active', viewName === 'downloads');

    // Update Apple Music Mobile Tab Bar state
    if (this.mobileTabBtns) {
      this.mobileTabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
      });
    }

    // Toggle View Panes
    if (this.viewHome) this.viewHome.classList.toggle('hidden', viewName !== 'home');
    if (this.viewExplore) this.viewExplore.classList.toggle('hidden', viewName !== 'explore');
    if (this.viewLibrary) this.viewLibrary.classList.toggle('hidden', viewName !== 'library');
    if (this.viewDownloads) this.viewDownloads.classList.toggle('hidden', viewName !== 'downloads');

    // Scroll main content to top
    const mainContent = document.getElementById('mainContent');
    if (mainContent) mainContent.scrollTop = 0;

    if (viewName === 'explore') {
      this.loadExploreCatalog();
    } else if (viewName === 'library') {
      this.renderLibrary();
    } else if (viewName === 'downloads') {
      this.renderDownloads();
    }
  }

  // ===========================================================================
  // Explore View Logic
  // ===========================================================================
  async loadExploreCatalog() {
    try {
      const res = await fetch('/api/explore');
      if (!res.ok) throw new Error('Explore API offline');
      const data = await res.json();

      if (data.newReleases) this.exploreReleases = data.newReleases;
      if (data.topCharts) this.exploreCharts = data.topCharts;

      this.renderExplore();
    } catch (e) {
      console.warn('Explore load notice:', e);
    }
  }

  renderExplore() {
    // 1. New Releases Carousel
    if (this.exploreReleasesCarousel) {
      this.exploreReleasesCarousel.innerHTML = '';
      this.exploreReleases.forEach(album => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.innerHTML = `
          <div class="music-card-thumb">
            <img src="${album.cover}" alt="${album.title}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231c1c1e'/%3E%3Cstop offset='100%25' stop-color='%232c2c2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23g)'/%3E%3Ccircle cx='150' cy='150' r='60' fill='%230071e3' opacity='0.85'/%3E%3Cpath d='M150 115v45.5c-2.4-1.4-5.2-2.3-8.2-2.3-9.1 0-16.5 7.4-16.5 16.5s7.4 16.5 16.5 16.5 16.5-7.4 16.5-16.5V131h16.5v-16H150z' fill='%23ffffff'/%3E%3C/svg%3E'">
            <button class="music-card-play" aria-label="Play ${album.title}">
              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <div class="music-card-title">${album.title}</div>
          <div class="music-card-sub">${album.artist} • ${album.year}</div>
        `;
        card.addEventListener('click', async () => {
          this.showToast(`Loading album "${album.title}"...`);
          try {
            const res = await fetch(`/api/album?id=${album.id}`);
            const data = await res.json();
            if (data.songs && data.songs.length > 0) {
              this.queue = data.songs;
              this.playTrack(0);
              this.showToast(`Playing "${album.title}"`);
            }
          } catch (e) {
            console.warn('Album load failed:', e);
          }
        });
        this.exploreReleasesCarousel.appendChild(card);
      });
    }

    // 2. Ranked Top Charts Grid (1 to 20)
    if (this.exploreChartsGrid) {
      this.exploreChartsGrid.innerHTML = '';
      this.exploreCharts.forEach(track => {
        const isDl = this.isDownloaded(track.id);
        const card = document.createElement('div');
        card.className = 'ranked-track-card';
        card.innerHTML = `
          <div class="rank-number ${track.rank <= 3 ? 'top-three' : ''}">${track.rank}</div>
          <div class="rank-badge ${track.rankChange === 'NEW' ? 'badge-new' : ''}">${track.rankChange || '#1'}</div>
          <img src="${track.cover}" alt="${track.title}" class="track-thumb-img" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\' viewBox=\'0 0 300 300\'%3E%3Cdefs%3E%3ClinearGradient id=\'g\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%231c1c1e\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%232c2c2e\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\'300\' height=\'300\' fill=\'url(%23g)\'/%3E%3Ccircle cx=\'150\' cy=\'150\' r=\'60\' fill=\'%230071e3\' opacity=\'0.85\'/%3E%3Cpath d=\'M150 115v45.5c-2.4-1.4-5.2-2.3-8.2-2.3-9.1 0-16.5 7.4-16.5 16.5s7.4 16.5 16.5 16.5 16.5-7.4 16.5-16.5V131h16.5v-16H150z\' fill=\'%23ffffff\'/%3E%3C/svg%3E'" style="width:46px;height:46px;border-radius:4px;object-fit:cover;">
          <div class="track-row-info">
            <div class="track-row-title">${track.title}</div>
            <div class="track-row-artist">${track.artist}</div>
          </div>
          <button class="track-inline-dl-btn ${isDl ? 'downloaded' : ''}" title="${isDl ? 'Downloaded (320kbps) - Click to export' : 'Download for offline playback'}">
            ${isDl 
              ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' 
              : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'}
          </button>
          <div class="track-row-duration">${this.formatTime(track.duration)}</div>
        `;
        card.addEventListener('click', (e) => {
          if (e.target.closest('.track-inline-dl-btn')) {
            e.stopPropagation();
            this.handleDownloadButtonClick(track);
            return;
          }
          this.queue.splice(this.currentTrackIndex + 1, 0, track);
          this.playTrack(this.currentTrackIndex + 1);
        });
        this.exploreChartsGrid.appendChild(card);
      });
    }
  }

  // ===========================================================================
  // Library View Logic
  // ===========================================================================
  renderLibrary() {
    this.renderLibraryLiked();
    this.renderLibraryDownloads();
    this.renderLibraryPlaylists();
    this.renderLibraryHistory();
  }

  filterLibraryTab(tab) {
    this.currentLibTab = tab;
    this.libChips.forEach(c => c.classList.toggle('active', c.dataset.libTab === tab));

    if (this.libLikedHero) this.libLikedHero.classList.toggle('hidden', tab !== 'all' && tab !== 'liked');
    if (this.libLikedSongsShelf) this.libLikedSongsShelf.classList.toggle('hidden', tab !== 'all' && tab !== 'liked');
    if (this.libDownloadsShelf) this.libDownloadsShelf.classList.toggle('hidden', tab !== 'all' && tab !== 'downloads');
    if (this.libPlaylistsShelf) this.libPlaylistsShelf.classList.toggle('hidden', tab !== 'all' && tab !== 'playlists');
    if (this.libHistoryShelf) this.libHistoryShelf.classList.toggle('hidden', tab !== 'all' && tab !== 'history');
  }

  renderLibraryLiked() {
    if (this.libLikedTotalCount) this.libLikedTotalCount.textContent = this.likedTracks.length;
    if (this.likedCount) this.likedCount.textContent = this.likedTracks.length;

    if (!this.libLikedList) return;
    this.libLikedList.innerHTML = '';

    if (this.likedTracks.length === 0) {
      this.libLikedList.innerHTML = `
        <div style="padding:32px;color:#888;text-align:center;">
          <p>No liked songs yet.</p>
          <p style="font-size:12px;margin-top:6px;">Click the heart icon on any song to save it here!</p>
        </div>
      `;
      return;
    }

    this.likedTracks.forEach((track, idx) => {
      const isDl = this.isDownloaded(track.id);
      const row = document.createElement('div');
      row.className = 'lib-track-row';
      row.innerHTML = `
        <span class="lib-track-index">${idx + 1}</span>
        <img src="${track.cover}" alt="${track.title}" class="lib-track-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
        <div class="lib-track-info">
          <div class="lib-track-title">${track.title}</div>
          <div class="lib-track-artist">${track.artist}</div>
        </div>
        <div class="lib-track-album">${track.album || ''}</div>
        <div class="lib-track-actions">
          <button class="track-inline-dl-btn ${isDl ? 'downloaded' : ''}" title="${isDl ? 'Downloaded (320kbps) - Click to export' : 'Download for offline playback'}">
            ${isDl 
              ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' 
              : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'}
          </button>
          <button class="lib-unlike-btn" title="Remove from Liked Music">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <span class="track-row-duration">${this.formatTime(track.duration)}</span>
        </div>
      `;
      row.addEventListener('click', (e) => {
        if (e.target.closest('.track-inline-dl-btn')) {
          e.stopPropagation();
          this.handleDownloadButtonClick(track);
          return;
        }
        if (e.target.closest('.lib-unlike-btn')) {
          this.toggleLikeTrack(track);
          this.renderLibraryLiked();
          return;
        }
        this.queue = [...this.likedTracks];
        this.playTrack(idx);
      });
      this.libLikedList.appendChild(row);
    });
  }

  renderLibraryDownloads() {
    if (!this.libDownloadsList) return;
    this.libDownloadsList.innerHTML = '';

    if (this.downloadedTracks.length === 0) {
      this.libDownloadsList.innerHTML = `
        <div style="padding: 24px; color: var(--text-secondary); text-align: center;">
          <p>No offline downloaded songs yet.</p>
          <button class="btn-action-glass" style="margin-top: 10px;" id="libDownloadLikedPromptBtn">Download Liked Songs</button>
        </div>
      `;
      const btn = document.getElementById('libDownloadLikedPromptBtn');
      if (btn) btn.addEventListener('click', () => this.downloadAllLikedSongs());
      return;
    }

    this.downloadedTracks.slice(0, 6).forEach((track, idx) => {
      const row = document.createElement('div');
      row.className = 'lib-track-row';
      row.innerHTML = `
        <span class="lib-track-index">${idx + 1}</span>
        <img src="${track.cover}" alt="${track.title}" class="lib-track-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
        <div class="lib-track-info">
          <div class="lib-track-title">${track.title}</div>
          <div class="lib-track-artist">${track.artist}</div>
        </div>
        <div class="lib-track-album">${track.sizeFormatted || '320kbps'}</div>
        <div class="lib-track-actions">
          <span class="dl-track-quality">OFFLINE</span>
          <button class="track-inline-dl-btn downloaded" title="Save file to device">
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          </button>
        </div>
      `;
      row.addEventListener('click', (e) => {
        if (e.target.closest('.track-inline-dl-btn')) {
          e.stopPropagation();
          this.exportTrackToFile(track);
          return;
        }
        this.queue = [...this.downloadedTracks];
        this.playTrack(idx);
      });
      this.libDownloadsList.appendChild(row);
    });
  }

  renderLibraryPlaylists() {
    if (!this.libPlaylistsGrid) return;
    this.libPlaylistsGrid.innerHTML = '';

    this.customPlaylists.forEach(pl => {
      const card = document.createElement('div');
      card.className = 'playlist-card';
      card.innerHTML = `
        <img src="${pl.cover}" alt="${pl.title}" class="playlist-card-cover">
        <div class="playlist-card-title">${pl.title}</div>
        <div class="playlist-card-meta">${pl.tracks?.length || 0} tracks • ${pl.desc}</div>
      `;
      card.addEventListener('click', () => {
        if (pl.tracks && pl.tracks.length > 0) {
          this.queue = [...pl.tracks];
          this.playTrack(0);
          this.showToast(`Playing playlist "${pl.title}"`);
        } else {
          this.showToast(`Playlist "${pl.title}" is empty`);
        }
      });
      this.libPlaylistsGrid.appendChild(card);
    });
  }

  renderLibraryHistory() {
    if (!this.libHistoryList) return;
    this.libHistoryList.innerHTML = '';

    if (this.history.length === 0) {
      this.libHistoryList.innerHTML = `
        <div style="padding:24px;color:#888;text-align:center;">No recent listening history yet.</div>
      `;
      return;
    }

    this.history.slice(0, 20).forEach((track, idx) => {
      const row = document.createElement('div');
      row.className = 'lib-track-row';
      row.innerHTML = `
        <span class="lib-track-index">${idx + 1}</span>
        <img src="${track.cover}" alt="${track.title}" class="lib-track-thumb">
        <div class="lib-track-info">
          <div class="lib-track-title">${track.title}</div>
          <div class="lib-track-artist">${track.artist}</div>
        </div>
        <div class="track-row-duration">${this.formatTime(track.duration)}</div>
      `;
      row.addEventListener('click', () => {
        this.queue.splice(this.currentTrackIndex + 1, 0, track);
        this.playTrack(this.currentTrackIndex + 1);
      });
      this.libHistoryList.appendChild(row);
    });
  }

  toggleLikeTrack(track) {
    if (this.likedTrackIds.has(track.id)) {
      this.likedTrackIds.delete(track.id);
      this.likedTracks = this.likedTracks.filter(t => t.id !== track.id);
      if (this.likeBtn) this.likeBtn.classList.remove('liked');
      if (this.maxLikeBtn) this.maxLikeBtn.classList.remove('active');
      this.showToast(`Removed from Liked Music`);
    } else {
      this.likedTrackIds.add(track.id);
      this.likedTracks.unshift(track);
      if (this.likeBtn) this.likeBtn.classList.add('liked');
      if (this.maxLikeBtn) this.maxLikeBtn.classList.add('active');
      this.showToast(`Saved to Liked Music`);
    }
    this.saveLocalStorage('rea_liked_tracks', this.likedTracks);
    if (this.likedCount) this.likedCount.textContent = this.likedTracks.length;
    if (this.libLikedTotalCount) this.libLikedTotalCount.textContent = this.likedTracks.length;
    this.renderLibraryLiked();
  }

  recordHistory(track) {
    this.history = this.history.filter(t => t.id !== track.id);
    this.history.unshift(track);
    if (this.history.length > 50) this.history.pop();
    this.saveLocalStorage('rea_history', this.history);
  }

  showToast(msg) {
    if (!this.toast || !this.toastMessage) return;
    this.toastMessage.textContent = msg;
    this.toast.classList.remove('hidden');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.add('hidden');
    }, 2400);
  }

  setVolume(val) {
    this.engine.setVolume(val);
    if (this.volumeFill) {
      this.volumeFill.style.width = `${val * 100}%`;
    }
    if (this.maxVolumeFill) {
      this.maxVolumeFill.style.width = `${val * 100}%`;
    }
    if (val === 0) {
      if (this.volHighSvg) this.volHighSvg.classList.add('hidden');
      if (this.volMuteSvg) this.volMuteSvg.classList.remove('hidden');
      if (this.maxVolHighSvg) this.maxVolHighSvg.classList.add('hidden');
      if (this.maxVolMuteSvg) this.maxVolMuteSvg.classList.remove('hidden');
    } else {
      if (this.volHighSvg) this.volHighSvg.classList.remove('hidden');
      if (this.volMuteSvg) this.volMuteSvg.classList.add('hidden');
      if (this.maxVolHighSvg) this.maxVolHighSvg.classList.remove('hidden');
      if (this.maxVolMuteSvg) this.maxVolMuteSvg.classList.add('hidden');
    }
  }

  switchTab(targetTab) {
    this.activeTab = targetTab;
    this.queueTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === targetTab));
    const paneMap = {
      'up-next': 'paneUpNext',
      'lyrics': 'paneLyrics',
      'related': 'paneRelated'
    };
    const activePaneId = paneMap[targetTab] || 'paneUpNext';
    this.tabPanes.forEach(p => p.classList.toggle('active', p.id === activePaneId));
    if (targetTab === 'lyrics') {
      this.renderLyrics();
    } else if (targetTab === 'related') {
      this.renderRelatedPane();
    }
  }

  // ===========================================================================
  // Live API Integration: JioSaavn & LRCLIB
  // ===========================================================================
  async loadIndianMusicCatalog() {
    try {
      const res = await fetch('/api/trending?category=all');
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();

      if (data.quickPicks && data.quickPicks.length > 0) {
        this.quickPicks = data.quickPicks;
        this.queue = [...this.quickPicks];
      }
      if (data.trendingHits) this.trendingHits = data.trendingHits;
      if (data.punjabiHits) this.punjabiHits = data.punjabiHits;
      if (data.romanticHits) this.romanticHits = data.romanticHits;

      this.renderShelves();
      this.renderPlayerInfo();
      this.renderQueue();

      if (this.queue[0]) {
        this.fetchTrackLyrics(this.queue[0]);
      }
    } catch (e) {
      console.warn('Using fallback catalog:', e);
      this.renderAll();
    }
  }

  async performLiveSearch(query) {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const results = data.results || [];

      if (!this.searchResultsList) return;
      this.searchResultsList.innerHTML = '';
      if (results.length === 0) {
        this.searchResultsList.innerHTML = `<div style="padding:16px;color:#aaa;text-align:center;">No songs found for "${query}"</div>`;
        return;
      }

      results.forEach(track => {
        const isDl = this.isDownloaded(track.id);
        const row = document.createElement('div');
        row.className = 'search-item';
        row.innerHTML = `
          <img src="${track.cover}" alt="${track.title}" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
          <div class="search-item-info">
            <div class="search-item-title">${track.title}</div>
            <div class="search-item-meta">${track.artist} • ${track.album}</div>
          </div>
          <button class="track-inline-dl-btn ${isDl ? 'downloaded' : ''}" title="${isDl ? 'Downloaded (320kbps) - Click to export' : 'Download for offline playback'}">
            ${isDl 
              ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' 
              : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'}
          </button>
        `;
        row.addEventListener('click', (e) => {
          if (e.target.closest('.track-inline-dl-btn')) {
            e.stopPropagation();
            this.handleDownloadButtonClick(track);
            return;
          }
          this.addSearchHistory(track.title);
          this.queue.splice(this.currentTrackIndex + 1, 0, track);
          this.playTrack(this.currentTrackIndex + 1);
          if (this.searchDropdown) this.searchDropdown.classList.add('hidden');
          if (this.searchInput) this.searchInput.value = '';
          if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
        });
        this.searchResultsList.appendChild(row);
      });
    } catch (e) {
      if (this.searchResultsList) {
        this.searchResultsList.innerHTML = `<div style="padding:16px;color:#f55;text-align:center;">Error searching songs</div>`;
      }
    }
  }

  async fetchTrackLyrics(track) {
    if (!track || track.lyricsLoaded) return;
    try {
      const res = await fetch(`/api/lyrics?track=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`);
      const data = await res.json();
      track.lyrics = data.lines || [];
      track.lyricsLoaded = true;
      if (this.queue[this.currentTrackIndex]?.id === track.id) {
        this.renderLyrics();
      }
    } catch (e) {
      track.lyricsLoaded = true;
    }
  }

  async applyFilter(filter) {
    this.activeFilter = filter;
    if (filter === 'all') {
      await this.loadIndianMusicCatalog();
      return;
    }

    try {
      const res = await fetch(`/api/trending?category=${filter}`);
      const data = await res.json();
      const songs = data.songs || [];
      if (songs.length > 0) {
        this.quickPicks = songs.slice(0, 16);
        // Update the shelves with the filtered songs WITHOUT starting playback
        this.renderShelves();

        // If nothing is currently playing, update player metadata preview and queue without starting playback
        if (!this.isPlaying) {
          this.queue = [...this.quickPicks];
          this.currentTrackIndex = 0;
          this.renderPlayerInfo();
          this.renderQueue();
        }
      }
    } catch (e) {
      console.warn('Filter fetch notice:', e);
    }
  }

  async loadCategoryPlaylist(category) {
    this.applyFilter(category);
  }

  // ===========================================================================
  // Playback Control
  // ===========================================================================
  playTrack(index) {
    if (index < 0 || index >= this.queue.length) return;
    this.currentTrackIndex = index;
    const track = this.queue[this.currentTrackIndex];

    this.engine.playTrack(track);
    this.isPlaying = true;
    this.renderPlayerInfo();
    this.updatePlayPauseUI();
    this.renderQueue();
    this.renderShelves();
    this.recordHistory(track);

    this.fetchTrackLyrics(track);
    this.renderRelatedPane();
    if (track.artist) {
      // Async refresh related recommendations in background
      this.loadRecommendations(track.artist);
    }
  }

  togglePlayPause() {
    if (!this.isPlaying) {
      if (!this.engine.currentTrack && this.queue.length > 0) {
        this.playTrack(this.currentTrackIndex);
      } else {
        this.engine.resume();
        this.isPlaying = true;
        this.updatePlayPauseUI();
      }
    } else {
      this.engine.pause();
      this.isPlaying = false;
      this.updatePlayPauseUI();
    }
    this.renderShelves();
  }

  prevTrack() {
    if (this.engine.audio.currentTime > 3) {
      this.engine.seek(0);
      return;
    }
    let prevIndex = this.currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = this.queue.length - 1;
    this.playTrack(prevIndex);
  }

  nextTrack() {
    if (this.isShuffle) {
      const randIdx = Math.floor(Math.random() * this.queue.length);
      this.playTrack(randIdx);
      return;
    }
    let nextIndex = this.currentTrackIndex + 1;
    if (nextIndex >= this.queue.length) {
      if (this.repeatMode === 'off') {
        this.engine.pause();
        this.isPlaying = false;
        this.updatePlayPauseUI();
        return;
      }
      nextIndex = 0;
    }
    this.playTrack(nextIndex);
  }

  updatePlayPauseUI() {
    if (this.isPlaying) {
      if (this.playIcon) this.playIcon.classList.add('hidden');
      if (this.pauseIcon) this.pauseIcon.classList.remove('hidden');
      if (this.maxPlaySvg) this.maxPlaySvg.classList.add('hidden');
      if (this.maxPauseSvg) this.maxPauseSvg.classList.remove('hidden');
    } else {
      if (this.playIcon) this.playIcon.classList.remove('hidden');
      if (this.pauseIcon) this.pauseIcon.classList.add('hidden');
      if (this.maxPlaySvg) this.maxPlaySvg.classList.remove('hidden');
      if (this.maxPauseSvg) this.maxPauseSvg.classList.add('hidden');
    }
  }

  updateProgressBar(cur, dur) {
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    if (this.progressBarFill) this.progressBarFill.style.width = `${pct}%`;
    if (this.scrubHandle) this.scrubHandle.style.left = `${pct}%`;
    if (this.currentTimeDisplay) this.currentTimeDisplay.textContent = this.formatTime(cur);
    if (this.totalDurationDisplay) this.totalDurationDisplay.textContent = this.formatTime(dur);

    // Synchronize Maximized Theater Scrubber
    if (this.maxProgressFill) this.maxProgressFill.style.width = `${pct}%`;
    if (this.maxProgressThumb) this.maxProgressThumb.style.left = `${pct}%`;
    if (this.maxTimeCurrent) this.maxTimeCurrent.textContent = this.formatTime(cur);
    if (this.maxTimeTotal) this.maxTimeTotal.textContent = this.formatTime(dur);
  }

  formatTime(secs) {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // ===========================================================================
  // Synced Lyrics Engine
  // ===========================================================================
  renderLyrics() {
    const track = this.queue[this.currentTrackIndex];
    if (this.lyricsBody) {
      this.lyricsBody.innerHTML = '';

      if (!track || !track.lyrics || track.lyrics.length === 0) {
        this.lyricsBody.innerHTML = `
          <div class="empty-lyrics">
            <p>Searching synchronized lyrics for</p>
            <p style="font-weight:600;font-size:1.1rem;color:#fff;margin:8px 0;">${track?.title || ''}</p>
            <p style="color:#888;font-size:0.85rem;">Enjoy high-fidelity 320kbps audio!</p>
          </div>
        `;
      } else {
        track.lyrics.forEach((line) => {
          const el = document.createElement('div');
          el.className = 'lyric-line';
          el.textContent = line.text;
          el.dataset.time = line.time;
          el.addEventListener('click', () => {
            this.engine.seek(line.time);
          });
          this.lyricsBody.appendChild(el);
        });
      }
    }

    this.renderMaxLyrics();
    this.updateSyncedLyrics(this.engine.audio.currentTime || 0);
  }

  updateSyncedLyrics(cur) {
    const track = this.queue[this.currentTrackIndex];
    if (!track || !track.lyrics) return;

    let activeIndex = -1;
    for (let i = 0; i < track.lyrics.length; i++) {
      if (cur >= track.lyrics[i].time) {
        activeIndex = i;
      }
    }

    // 1. Update Mini Drawer Lyrics
    if (this.lyricsBody) {
      const lines = this.lyricsBody.querySelectorAll('.lyric-line');
      lines.forEach((line, idx) => {
        const isActive = idx === activeIndex;
        line.classList.toggle('active', isActive);
        if (isActive && this.activeTab === 'lyrics') {
          line.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    // 2. Update Maximized Theater Lyrics
    if (this.maxLyricsScroll) {
      const maxLines = this.maxLyricsScroll.querySelectorAll('.max-lyric-line');
      maxLines.forEach((line, idx) => {
        const isActive = idx === activeIndex;
        line.classList.toggle('active-lyric', isActive);
        if (isActive && this.isPlayerMaximized && this.currentMaxTab !== 'queue') {
          line.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  }

  // ===========================================================================
  // Visualizer Spectrum Canvas
  // ===========================================================================
  startVisualizer() {
    if (!this.audioVisualizer) return;
    const canvas = this.audioVisualizer;
    const ctx = canvas.getContext('2d');
    const dataArray = new Uint8Array(32);

    const render = () => {
      requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!this.isPlaying || !this.engine.analyser) {
        ctx.fillStyle = this.currentTheme === 'dark'
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(0, 0, 0, 0.15)';
        for (let i = 0; i < 8; i++) {
          ctx.fillRect(i * 10 + 2, 20, 6, 2);
        }
        return;
      }

      this.engine.analyser.getByteFrequencyData(dataArray);
      const barWidth = 7;
      let x = 2;

      for (let i = 0; i < 8; i++) {
        const val = dataArray[i * 2] || 0;
        const barHeight = Math.max(3, (val / 255) * canvas.height);

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#FA2D48');
        gradient.addColorStop(1, '#FF375F');
        ctx.fillStyle = gradient;

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 3;
      }
    };
    render();
  }

  // ===========================================================================
  // UI Rendering: Shelves, Player, Queue
  // ===========================================================================
  renderAll() {
    this.renderShelves();
    this.renderRecommendedShelf();
    this.renderPlayerInfo();
    this.renderQueue();
    this.renderSearchHub();
  }

  renderPlayerInfo() {
    const track = this.queue[this.currentTrackIndex] || FALLBACK_TRACKS[0];
    if (this.playerThumb) this.playerThumb.src = track.cover;
    if (this.playerTrackTitle) this.playerTrackTitle.textContent = track.title;
    if (this.playerArtist) this.playerArtist.textContent = track.artist;
    if (this.playerAlbum) this.playerAlbum.textContent = track.album;
    if (this.lyricsTrackTitle) this.lyricsTrackTitle.textContent = track.title;
    if (this.lyricsArtistName) this.lyricsArtistName.textContent = track.artist;

    const isLiked = this.likedTrackIds.has(track.id);
    if (this.likeBtn) this.likeBtn.classList.toggle('liked', isLiked);
    if (this.maxLikeBtn) this.maxLikeBtn.classList.toggle('active', isLiked);

    // Update Download Button State in Player Bar and Maximized Player
    const isDl = this.isDownloaded(track.id);
    const isDownloading = this.activeDownloads.has(track.id);

    if (this.playerDownloadBtn) {
      const spinner = this.playerDownloadBtn.querySelector('.dl-spinner');
      const normalIcon = this.playerDownloadBtn.querySelector('.dl-icon-normal');
      const doneIcon = this.playerDownloadBtn.querySelector('.dl-icon-done');
      if (isDownloading) {
        if (spinner) spinner.classList.remove('hidden');
        if (normalIcon) normalIcon.classList.add('hidden');
        if (doneIcon) doneIcon.classList.add('hidden');
        this.playerDownloadBtn.title = 'Downloading (320kbps)...';
      } else if (isDl) {
        if (spinner) spinner.classList.add('hidden');
        if (normalIcon) normalIcon.classList.add('hidden');
        if (doneIcon) doneIcon.classList.remove('hidden');
        this.playerDownloadBtn.classList.add('downloaded');
        this.playerDownloadBtn.title = 'Downloaded (320kbps Lossless) • Click to save file to device';
      } else {
        if (spinner) spinner.classList.add('hidden');
        if (normalIcon) normalIcon.classList.remove('hidden');
        if (doneIcon) doneIcon.classList.add('hidden');
        this.playerDownloadBtn.classList.remove('downloaded');
        this.playerDownloadBtn.title = 'Download song (320kbps Lossless)';
      }
    }

    if (this.maxDownloadBtn) {
      const spinner = this.maxDownloadBtn.querySelector('.dl-spinner');
      const normalIcon = this.maxDownloadBtn.querySelector('.dl-icon-normal');
      const doneIcon = this.maxDownloadBtn.querySelector('.dl-icon-done');
      if (isDownloading) {
        if (spinner) spinner.classList.remove('hidden');
        if (normalIcon) normalIcon.classList.add('hidden');
        if (doneIcon) doneIcon.classList.add('hidden');
        this.maxDownloadBtn.title = 'Downloading (320kbps)...';
      } else if (isDl) {
        if (spinner) spinner.classList.add('hidden');
        if (normalIcon) normalIcon.classList.add('hidden');
        if (doneIcon) doneIcon.classList.remove('hidden');
        this.maxDownloadBtn.classList.add('downloaded');
        this.maxDownloadBtn.title = 'Downloaded (320kbps Lossless) • Click to save file to device';
      } else {
        if (spinner) spinner.classList.add('hidden');
        if (normalIcon) normalIcon.classList.remove('hidden');
        if (doneIcon) doneIcon.classList.add('hidden');
        this.maxDownloadBtn.classList.remove('downloaded');
        this.maxDownloadBtn.title = 'Download song (320kbps Lossless)';
      }
    }

    // Update Maximized Theater Player Information
    if (this.maxAlbumArt) this.maxAlbumArt.src = track.cover;
    if (this.maxAmbientGlow) this.maxAmbientGlow.style.backgroundImage = `url("${track.cover}")`;
    if (this.maxTrackTitle) this.maxTrackTitle.textContent = track.title;
    if (this.maxTrackArtist) this.maxTrackArtist.textContent = track.artist;
    if (this.maxTrackAlbum) this.maxTrackAlbum.textContent = track.album || '';

    this.renderMaxLyrics();
    this.renderMaxQueue();
    this.syncControlStates();
  }

  renderShelves() {
    const currentId = this.queue[this.currentTrackIndex]?.id;

    // 1. Quick Picks Grid (India Superhits Top 50)
    if (this.quickPicksGrid) {
      this.quickPicksGrid.innerHTML = '';
      this.quickPicks.forEach((track) => {
        const isDl = this.isDownloaded(track.id);
        const card = document.createElement('div');
        card.className = `track-row-card ${currentId === track.id ? 'active-track' : ''}`;
        card.innerHTML = `
          <div class="track-thumb-wrapper">
            <img src="${track.cover}" alt="${track.title}" class="track-thumb-img">
            <div class="track-play-overlay">
              ${currentId === track.id && this.isPlaying
            ? `<div class="equalizer-icon"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>`
            : `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M8 5v14l11-7z"/></svg>`
          }
            </div>
          </div>
          <div class="track-row-info">
            <div class="track-row-title">${track.title}</div>
            <div class="track-row-artist">${track.artist}</div>
          </div>
          <button class="track-inline-dl-btn ${isDl ? 'downloaded' : ''}" title="${isDl ? 'Downloaded (320kbps) - Click to export' : 'Download for offline playback'}">
            ${isDl 
              ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' 
              : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'}
          </button>
          <div class="track-row-duration">${this.formatTime(track.duration)}</div>
        `;
        card.addEventListener('click', (e) => {
          if (e.target.closest('.track-inline-dl-btn')) {
            e.stopPropagation();
            this.handleDownloadButtonClick(track);
            return;
          }
          const queueIdx = this.queue.findIndex(t => t.id === track.id);
          if (queueIdx !== -1) {
            this.playTrack(queueIdx);
          } else {
            this.queue.push(track);
            this.playTrack(this.queue.length - 1);
          }
        });
        this.quickPicksGrid.appendChild(card);
      });
    }

    // 2. Trending Carousel
    if (this.trendingCarousel) {
      const trendingSource = this.trendingHits.length > 0 ? this.trendingHits : this.quickPicks;
      this.trendingCarousel.innerHTML = '';
      trendingSource.forEach(track => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.innerHTML = `
          <div class="music-card-thumb">
            <img src="${track.cover}" alt="${track.title}">
            <button class="music-card-play" aria-label="Play ${track.title}">
              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <div class="music-card-title">${track.title}</div>
          <div class="music-card-sub">${track.artist}</div>
        `;
        card.addEventListener('click', () => {
          this.queue.splice(this.currentTrackIndex + 1, 0, track);
          this.playTrack(this.currentTrackIndex + 1);
        });
        this.trendingCarousel.appendChild(card);
      });
    }

    // 3. Punjabi & Desi Bass Shelf
    if (this.focusCarousel) {
      const focusSource = this.punjabiHits.length > 0 ? this.punjabiHits : this.quickPicks;
      this.focusCarousel.innerHTML = '';
      focusSource.forEach(track => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.innerHTML = `
          <div class="music-card-thumb">
            <img src="${track.cover}" alt="${track.title}">
            <button class="music-card-play" aria-label="Play ${track.title}">
              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <div class="music-card-title">${track.title}</div>
          <div class="music-card-sub">${track.artist}</div>
        `;
        card.addEventListener('click', () => {
          this.queue.splice(this.currentTrackIndex + 1, 0, track);
          this.playTrack(this.currentTrackIndex + 1);
        });
        this.focusCarousel.appendChild(card);
      });
    }
  }

  renderQueue() {
    if (!this.queueList) return;
    this.queueList.innerHTML = '';
    this.queue.forEach((track, idx) => {
      const isDl = this.isDownloaded(track.id);
      const isCurrent = idx === this.currentTrackIndex;
      const item = document.createElement('div');
      item.className = `queue-item ${isCurrent ? 'active-queue-item' : ''}`;
      item.innerHTML = `
        <img src="${track.cover}" alt="${track.title}" class="queue-item-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
        <div class="queue-item-info">
          <div class="queue-item-title">${track.title}</div>
          <div class="queue-item-artist">${track.artist}</div>
        </div>
        <button class="track-inline-dl-btn ${isDl ? 'downloaded' : ''}" title="${isDl ? 'Downloaded (320kbps) - Click to export' : 'Download for offline playback'}">
          ${isDl 
            ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' 
            : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'}
        </button>
        <div class="queue-item-duration">${this.formatTime(track.duration)}</div>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.track-inline-dl-btn')) {
          e.stopPropagation();
          this.handleDownloadButtonClick(track);
          return;
        }
        this.playTrack(idx);
      });
      this.queueList.appendChild(item);
    });
    this.renderMaxQueue();
  }

  // ===========================================================================
  // Maximized / Minimized Player Theater Controls
  // ===========================================================================
  maximizePlayer() {
    this.isPlayerMaximized = true;
    if (this.maximizedPlayer) {
      this.maximizedPlayer.classList.add('open');
      this.maximizedPlayer.setAttribute('aria-hidden', 'false');
    }
    this.renderPlayerInfo();
    const cur = this.engine.audio.currentTime || 0;
    const dur = this.engine.audio.duration || this.queue[this.currentTrackIndex]?.duration || 1;
    this.updateProgressBar(cur, dur);
    this.syncControlStates();
  }

  minimizePlayer() {
    this.isPlayerMaximized = false;
    if (this.maximizedPlayer) {
      this.maximizedPlayer.classList.remove('open');
      this.maximizedPlayer.setAttribute('aria-hidden', 'true');
    }
  }

  toggleFullscreenWindow() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  }

  switchMaxTab(tab) {
    this.currentMaxTab = tab;
    this.maxTabBtns.forEach(b => b.classList.toggle('active', b.dataset.maxTab === tab));

    if (tab === 'song') {
      if (this.maxStageLeft) this.maxStageLeft.style.display = '';
      if (this.maxStageRight) this.maxStageRight.style.display = '';
      if (this.maxLyricsPane) this.maxLyricsPane.classList.remove('hidden');
      if (this.maxQueuePane) this.maxQueuePane.classList.add('hidden');
    } else if (tab === 'lyrics') {
      if (this.maxLyricsPane) this.maxLyricsPane.classList.remove('hidden');
      if (this.maxQueuePane) this.maxQueuePane.classList.add('hidden');
    } else if (tab === 'queue') {
      if (this.maxLyricsPane) this.maxLyricsPane.classList.add('hidden');
      if (this.maxQueuePane) this.maxQueuePane.classList.remove('hidden');
      this.renderMaxQueue();
    }
  }

  syncControlStates() {
    this.updatePlayPauseUI();
    if (this.maxShuffleBtn) {
      this.maxShuffleBtn.style.color = this.isShuffle ? '#ff0033' : '#aaa';
    }
    if (this.maxRepeatBtn) {
      this.maxRepeatBtn.style.color = this.repeatMode === 'off' ? '#aaa' : '#fff';
      this.maxRepeatBtn.title = `Repeat: ${this.repeatMode}`;
    }
    const track = this.queue[this.currentTrackIndex];
    if (track && this.maxLikeBtn) {
      this.maxLikeBtn.classList.toggle('active', this.likedTrackIds.has(track.id));
    }
    if (this.maxVolumeFill) {
      this.maxVolumeFill.style.width = `${this.engine.volume * 100}%`;
    }
  }

  renderMaxLyrics() {
    const track = this.queue[this.currentTrackIndex];
    if (!this.maxLyricsScroll) return;
    this.maxLyricsScroll.innerHTML = '';

    if (!track || !track.lyrics || track.lyrics.length === 0) {
      this.maxLyricsScroll.innerHTML = `
        <div class="lyrics-empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" style="opacity:0.35;"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          <div style="font-weight:600;font-size:16px;color:#fff;">Lyrics not available for this song</div>
          <div style="font-size:13px;color:#888;">Enjoy lossless 320kbps Indian audio playback</div>
        </div>
      `;
      return;
    }

    track.lyrics.forEach((line) => {
      const el = document.createElement('div');
      el.className = 'max-lyric-line';
      el.textContent = line.text;
      el.dataset.time = line.time;
      el.addEventListener('click', () => {
        this.engine.seek(line.time);
      });
      this.maxLyricsScroll.appendChild(el);
    });

    this.updateSyncedLyrics(this.engine.audio.currentTime || 0);
  }

  renderMaxQueue() {
    if (!this.maxQueueList) return;
    this.maxQueueList.innerHTML = '';
    const upNext = this.queue.slice(this.currentTrackIndex + 1);
    if (this.maxQueueCount) {
      this.maxQueueCount.textContent = `${upNext.length} song${upNext.length === 1 ? '' : 's'}`;
    }

    this.queue.forEach((track, idx) => {
      const isCurrent = idx === this.currentTrackIndex;
      const isDl = this.isDownloaded(track.id);
      const item = document.createElement('div');
      item.className = `max-queue-item ${isCurrent ? 'active' : ''}`;
      item.innerHTML = `
        <img src="${track.cover}" alt="${track.title}" class="max-queue-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
        <div class="max-queue-info">
          <div class="max-queue-title">${track.title}</div>
          <div class="max-queue-artist">${track.artist}</div>
        </div>
        <button class="track-inline-dl-btn ${isDl ? 'downloaded' : ''}" title="${isDl ? 'Downloaded (320kbps) - Click to export' : 'Download for offline playback'}">
          ${isDl 
            ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' 
            : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'}
        </button>
        <div class="max-queue-dur">${this.formatTime(track.duration)}</div>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.track-inline-dl-btn')) {
          e.stopPropagation();
          this.handleDownloadButtonClick(track);
          return;
        }
        this.playTrack(idx);
      });
      this.maxQueueList.appendChild(item);
    });
  }

  // ===========================================================================
  // Offline Downloads & Storage Engine (Lossless 320kbps Vault)
  // ===========================================================================
  isDownloaded(trackId) {
    return this.downloadedTrackIds.has(trackId);
  }

  getDownloadedTrack(trackId) {
    return this.downloadedTracks.find(t => t.id === trackId);
  }

  handleDownloadButtonClick(track) {
    if (!track) return;
    if (this.isDownloaded(track.id)) {
      this.exportTrackToFile(track);
      return;
    }
    if (this.activeDownloads.has(track.id)) {
      this.showToast(`"${track.title}" is currently downloading...`);
      return;
    }
    this.downloadTrack(track, true);
  }

  async downloadTrack(track, showSuccessToast = true) {
    if (!track || !track.id) return;
    if (this.isDownloaded(track.id)) {
      if (showSuccessToast) this.showToast(`"${track.title}" is already saved offline`);
      return;
    }
    if (this.activeDownloads.has(track.id)) return;

    this.activeDownloads.set(track.id, { progress: 0 });
    this.showToast(`Downloading "${track.title}" in Lossless 320kbps...`);
    this.renderPlayerInfo();
    this.renderShelves();
    this.renderQueue();

    try {
      let response = null;
      if (track.audioUrl) {
        try {
          response = await fetch(track.audioUrl);
          if (!response.ok) response = null;
        } catch (fetchErr) {
          response = null;
        }
      }

      if (!response) {
        const proxyUrl = `/api/download?url=${encodeURIComponent(track.audioUrl || '')}&title=${encodeURIComponent(track.title || 'song')}`;
        response = await fetch(proxyUrl);
      }

      if (!response.ok) {
        throw new Error(`Download HTTP error ${response.status}`);
      }

      const audioBlob = await response.blob();
      const sizeBytes = audioBlob.size;
      const sizeFormatted = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';
      const localBlobUrl = URL.createObjectURL(audioBlob);

      const downloadedTrack = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album || '',
        cover: track.cover || FALLBACK_COVER,
        duration: track.duration || 0,
        language: track.language || 'hindi',
        lyrics: track.lyrics || [],
        audioUrl: track.audioUrl,
        audioBlob,
        localBlobUrl,
        sizeBytes,
        sizeFormatted,
        downloadedAt: Date.now()
      };

      // Persist into IndexedDB
      await this.offlineStorage.saveTrack({
        id: downloadedTrack.id,
        title: downloadedTrack.title,
        artist: downloadedTrack.artist,
        album: downloadedTrack.album,
        cover: downloadedTrack.cover,
        duration: downloadedTrack.duration,
        language: downloadedTrack.language,
        lyrics: downloadedTrack.lyrics,
        audioUrl: downloadedTrack.audioUrl,
        audioBlob: downloadedTrack.audioBlob,
        sizeBytes: downloadedTrack.sizeBytes,
        sizeFormatted: downloadedTrack.sizeFormatted,
        downloadedAt: downloadedTrack.downloadedAt
      });

      // Update in-memory collections
      this.downloadedTracks.unshift(downloadedTrack);
      this.downloadedTrackIds.add(track.id);

      // Link blob URL into currently active or queued track instance
      if (this.queue[this.currentTrackIndex]?.id === track.id) {
        this.queue[this.currentTrackIndex].localBlobUrl = localBlobUrl;
      }
      this.queue.forEach(t => {
        if (t.id === track.id) t.localBlobUrl = localBlobUrl;
      });

      this.activeDownloads.delete(track.id);
      this.updateDownloadsStats();
      this.renderPlayerInfo();
      this.renderShelves();
      this.renderQueue();

      if (this.currentView === 'downloads') {
        this.renderDownloads();
      }
      if (this.currentView === 'library') {
        this.renderLibraryDownloads();
      }

      if (showSuccessToast) {
        this.showToast(`Saved "${track.title}" offline (${sizeFormatted})`);
      }
    } catch (err) {
      console.error('[Download] Failed to download song:', err);
      this.activeDownloads.delete(track.id);
      this.renderPlayerInfo();
      this.renderShelves();
      this.renderQueue();
      this.showToast(`Failed to download "${track.title}". Check connection.`);
    }
  }

  exportTrackToFile(track) {
    if (!track) return;
    this.showToast(`Exporting "${track.title}" audio file...`);
    const cleanTitle = (track.title || 'song').replace(/[/\\?%*:|"<>]/g, '');
    const cleanArtist = (track.artist || 'artist').replace(/[/\\?%*:|"<>]/g, '');
    const fileName = `${cleanTitle} - ${cleanArtist}.m4a`;

    if (track.localBlobUrl) {
      const a = document.createElement('a');
      a.href = track.localBlobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.showToast(`Exported "${track.title}" to device`);
    } else {
      const dlUrl = `/api/download?url=${encodeURIComponent(track.audioUrl || '')}&title=${encodeURIComponent(cleanTitle)}`;
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  async deleteDownloadedTrack(trackId) {
    const track = this.downloadedTracks.find(t => t.id === trackId);
    if (!track) return;

    if (track.localBlobUrl) {
      try {
        URL.revokeObjectURL(track.localBlobUrl);
      } catch (e) { }
    }

    await this.offlineStorage.deleteTrack(trackId);
    this.downloadedTrackIds.delete(trackId);
    this.downloadedTracks = this.downloadedTracks.filter(t => t.id !== trackId);

    this.queue.forEach(t => {
      if (t.id === trackId) delete t.localBlobUrl;
    });

    this.updateDownloadsStats();
    this.renderPlayerInfo();
    this.renderShelves();
    this.renderQueue();
    this.renderDownloads();
    this.renderLibraryDownloads();

    this.showToast(`Removed "${track.title}" from offline downloads`);
  }

  async downloadAllLikedSongs() {
    const toDownload = this.likedTracks.filter(t => !this.isDownloaded(t.id));
    if (toDownload.length === 0) {
      this.showToast('All liked songs are already downloaded offline!');
      return;
    }

    this.showToast(`Downloading ${toDownload.length} liked songs in background...`);
    for (const track of toDownload) {
      await this.downloadTrack(track, false);
    }
    this.showToast(`All ${toDownload.length} liked songs downloaded offline!`);
  }

  async clearAllDownloads() {
    if (this.downloadedTracks.length === 0) {
      this.showToast('No downloaded tracks to clear');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete all ${this.downloadedTracks.length} offline downloaded songs?`);
    if (!confirmed) return;

    this.downloadedTracks.forEach(t => {
      if (t.localBlobUrl) {
        try {
          URL.revokeObjectURL(t.localBlobUrl);
        } catch (e) { }
      }
    });

    await this.offlineStorage.clearAll();
    this.downloadedTracks = [];
    this.downloadedTrackIds.clear();

    this.queue.forEach(t => delete t.localBlobUrl);

    this.updateDownloadsStats();
    this.renderPlayerInfo();
    this.renderShelves();
    this.renderQueue();
    this.renderDownloads();
    this.renderLibraryDownloads();

    this.showToast('All offline downloads removed');
  }

  updateDownloadsStats() {
    const count = this.downloadedTracks.length;
    let totalBytes = 0;
    this.downloadedTracks.forEach(t => {
      totalBytes += (t.sizeBytes || 0);
    });
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

    if (this.downloadsCount) this.downloadsCount.textContent = count;
    if (this.downloadsTotalSize) this.downloadsTotalSize.textContent = `${totalMB} MB`;

    if (this.sidebarDownloadsBadge) {
      if (count > 0) {
        this.sidebarDownloadsBadge.textContent = count;
        this.sidebarDownloadsBadge.classList.remove('hidden');
      } else {
        this.sidebarDownloadsBadge.classList.add('hidden');
      }
    }

    if (this.storageStatsText) {
      this.storageStatsText.textContent = `${totalMB} MB of 2.0 GB used (${count} song${count === 1 ? '' : 's'} offline)`;
    }

    if (this.storageMeterFill) {
      const pct = Math.min(100, (parseFloat(totalMB) / 2048) * 100);
      this.storageMeterFill.style.width = `${Math.max(2, pct)}%`;
    }
  }


  // ===========================================================================
  // Search History & Live Recommendations Engine
  // ===========================================================================
  addSearchHistory(query) {
    if (!query || typeof query !== 'string') return;
    const clean = query.trim();
    if (!clean) return;
    this.searchHistory = this.searchHistory.filter(q => q.toLowerCase() !== clean.toLowerCase());
    this.searchHistory.unshift(clean);
    if (this.searchHistory.length > 10) {
      this.searchHistory = this.searchHistory.slice(0, 10);
    }
    this.saveLocalStorage('rea_search_history', this.searchHistory);
    this.renderSearchHub();
  }

  removeSearchHistory(query) {
    if (!query) return;
    this.searchHistory = this.searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase());
    this.saveLocalStorage('rea_search_history', this.searchHistory);
    this.renderSearchHub();
  }

  clearSearchHistory() {
    this.searchHistory = [];
    this.saveLocalStorage('rea_search_history', []);
    this.renderSearchHub();
    this.showToast('Recent searches cleared');
  }

  async loadRecommendations(targetArtist) {
    try {
      const currentTrack = this.queue[this.currentTrackIndex];
      const artistParam = targetArtist || (currentTrack ? currentTrack.artist : 'Arijit Singh');
      const trackId = currentTrack ? currentTrack.id : '';
      const res = await fetch(`/api/recommendations?artist=${encodeURIComponent(artistParam)}&trackId=${encodeURIComponent(trackId)}`);
      if (!res.ok) throw new Error('Recommendations offline');
      const data = await res.json();
      if (data.recommendations && data.recommendations.length > 0) {
        this.recommendations = data.recommendations;
      } else if (this.quickPicks.length > 0) {
        this.recommendations = [...this.quickPicks];
      }
      if (data.trendingSearches && data.trendingSearches.length > 0) {
        this.trendingSearches = data.trendingSearches;
      }
      this.renderRecommendedShelf();
      this.renderSearchHub();
      this.renderRelatedPane();
    } catch (e) {
      console.warn('Recommendation load notice:', e);
      if (this.quickPicks.length > 0 && this.recommendations.length === 0) {
        this.recommendations = [...this.quickPicks];
      }
      this.renderRecommendedShelf();
      this.renderSearchHub();
      this.renderRelatedPane();
    }
  }

  renderSearchHub() {
    // 1. Render Recent Searches
    if (this.searchHistoryList) {
      this.searchHistoryList.innerHTML = '';
      if (this.searchHistory.length === 0) {
        this.searchHistoryList.innerHTML = `
          <div class="search-history-empty">No recent searches yet</div>
        `;
      } else {
        this.searchHistory.slice(0, 6).forEach(query => {
          const item = document.createElement('div');
          item.className = 'search-history-item';
          item.innerHTML = `
            <div class="search-history-left">
              <span class="search-history-icon">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
              </span>
              <span class="search-history-text">${query}</span>
            </div>
            <button class="search-history-remove-btn" title="Remove from history" aria-label="Remove">
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          `;
          item.addEventListener('click', (e) => {
            if (e.target.closest('.search-history-remove-btn')) {
              e.stopPropagation();
              this.removeSearchHistory(query);
              return;
            }
            if (this.searchInput) {
              this.searchInput.value = query;
              this.addSearchHistory(query);
              if (this.searchClearBtn) this.searchClearBtn.classList.remove('hidden');
              if (this.searchHubContent) this.searchHubContent.classList.add('hidden');
              if (this.searchResultsList) {
                this.searchResultsList.classList.remove('hidden');
                this.searchResultsList.innerHTML = `<div style="padding:16px;color:#aaa;text-align:center;">Searching for "${query}"...</div>`;
              }
              this.performLiveSearch(query);
            }
          });
          this.searchHistoryList.appendChild(item);
        });
      }
    }

    // 2. Render Trending Searches (Tags / Pills)
    if (this.trendingTagsGrid) {
      this.trendingTagsGrid.innerHTML = '';
      const tags = (this.trendingSearches && this.trendingSearches.length > 0)
        ? this.trendingSearches
        : ['Arijit Singh', 'Diljit Dosanjh', 'Tauba Tauba', 'Kesariya', 'Sid Sriram', 'Anirudh', 'Punjabi Hits'];

      tags.slice(0, 8).forEach(tag => {
        const pill = document.createElement('button');
        pill.className = 'trending-tag-pill';
        pill.innerHTML = `
          <span class="trending-tag-icon">🔥</span>
          <span>${tag}</span>
        `;
        pill.addEventListener('click', () => {
          if (this.searchInput) {
            this.searchInput.value = tag;
            this.addSearchHistory(tag);
            if (this.searchClearBtn) this.searchClearBtn.classList.remove('hidden');
            if (this.searchHubContent) this.searchHubContent.classList.add('hidden');
            if (this.searchResultsList) {
              this.searchResultsList.classList.remove('hidden');
              this.searchResultsList.innerHTML = `<div style="padding:16px;color:#aaa;text-align:center;">Searching for "${tag}"...</div>`;
            }
            this.performLiveSearch(tag);
          }
        });
        this.trendingTagsGrid.appendChild(pill);
      });
    }

    // 3. Render Recommended Songs in Search Dropdown
    if (this.searchRecoList) {
      this.searchRecoList.innerHTML = '';
      const recoTracks = this.recommendations.length > 0 ? this.recommendations.slice(0, 5) : this.quickPicks.slice(0, 5);
      recoTracks.forEach(track => {
        const isDl = this.isDownloaded(track.id);
        const item = document.createElement('div');
        item.className = 'search-reco-item';
        item.innerHTML = `
          <img src="${track.cover}" alt="${track.title}" class="search-reco-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
          <div class="search-reco-info">
            <div class="search-reco-title">${track.title}</div>
            <div class="search-reco-meta">
              <span>${track.artist}</span>
              <span class="search-reco-badge">Recommended</span>
            </div>
          </div>
          <button class="track-inline-dl-btn ${isDl ? 'downloaded' : ''}" title="${isDl ? 'Downloaded (320kbps)' : 'Download for offline'}">
            ${isDl 
              ? '<svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' 
              : '<svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'}
          </button>
        `;
        item.addEventListener('click', (e) => {
          if (e.target.closest('.track-inline-dl-btn')) {
            e.stopPropagation();
            this.handleDownloadButtonClick(track);
            return;
          }
          this.addSearchHistory(track.title);
          this.queue.splice(this.currentTrackIndex + 1, 0, track);
          this.playTrack(this.currentTrackIndex + 1);
          if (this.searchDropdown) this.searchDropdown.classList.add('hidden');
          if (this.searchInput) this.searchInput.value = '';
          if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
        });
        this.searchRecoList.appendChild(item);
      });
    }
  }

  renderRecommendedShelf() {
    if (!this.recommendedCarousel) return;
    this.recommendedCarousel.innerHTML = '';
    const recoTracks = this.recommendations.length > 0 ? this.recommendations.slice(0, 12) : this.quickPicks.slice(0, 12);
    recoTracks.forEach(track => {
      const card = document.createElement('div');
      card.className = 'music-card';
      card.innerHTML = `
        <div class="music-card-thumb">
          <img src="${track.cover}" alt="${track.title}" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
          <button class="music-card-play" aria-label="Play ${track.title}">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
        <div class="music-card-title">${track.title}</div>
        <div class="music-card-sub">${track.artist}</div>
        <div style="margin-top: 4px;">
          <span class="shelf-tag-badge">✦ Recommended</span>
        </div>
      `;
      card.addEventListener('click', () => {
        this.queue.splice(this.currentTrackIndex + 1, 0, track);
        this.playTrack(this.currentTrackIndex + 1);
      });
      this.recommendedCarousel.appendChild(card);
    });
  }

  renderRelatedPane() {
    const currentTrack = this.queue[this.currentTrackIndex] || FALLBACK_TRACKS[0];
    if (this.relatedArtistCard) {
      this.relatedArtistCard.innerHTML = `
        <img src="${currentTrack.cover}" alt="${currentTrack.artist}" class="related-artist-avatar" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
        <div class="related-artist-info">
          <div class="related-artist-title">${currentTrack.artist}</div>
          <div class="related-artist-subtitle">Recommendations based on "${currentTrack.title}"</div>
        </div>
      `;
    }

    if (this.relatedTracksList) {
      this.relatedTracksList.innerHTML = '';
      const pool = (this.recommendations.length > 0 ? this.recommendations : this.quickPicks)
        .filter(t => t.id !== currentTrack.id)
        .slice(0, 8);

      pool.forEach(track => {
        const isDl = this.isDownloaded(track.id);
        const row = document.createElement('div');
        row.className = 'related-track-row';
        row.innerHTML = `
          <img src="${track.cover}" alt="${track.title}" class="related-track-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
          <div class="related-track-info">
            <div class="related-track-title">${track.title}</div>
            <div class="related-track-artist">${track.artist}</div>
          </div>
          <button class="track-inline-dl-btn ${isDl ? 'downloaded' : ''}" title="${isDl ? 'Downloaded (320kbps)' : 'Download for offline'}">
            ${isDl 
              ? '<svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' 
              : '<svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'}
          </button>
        `;
        row.addEventListener('click', (e) => {
          if (e.target.closest('.track-inline-dl-btn')) {
            e.stopPropagation();
            this.handleDownloadButtonClick(track);
            return;
          }
          this.queue.splice(this.currentTrackIndex + 1, 0, track);
          this.playTrack(this.currentTrackIndex + 1);
        });
        this.relatedTracksList.appendChild(row);
      });
    }
  }

  renderDownloads() {
    if (!this.downloadsTracksList) return;
    this.downloadsTracksList.innerHTML = '';

    let tracks = [...this.downloadedTracks];
    if (this.downloadsFilter && this.downloadsFilter.trim()) {
      const q = this.downloadsFilter.toLowerCase().trim();
      tracks = tracks.filter(t =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.artist && t.artist.toLowerCase().includes(q)) ||
        (t.album && t.album.toLowerCase().includes(q))
      );
    }

    if (tracks.length === 0) {
      const isFiltered = Boolean(this.downloadsFilter && this.downloadsFilter.trim());
      this.downloadsTracksList.innerHTML = `
        <div class="downloads-empty-state">
          <div class="downloads-empty-icon">
            <svg viewBox="0 0 24 24" width="36" height="36"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
          </div>
          <h3 class="downloads-empty-title">${isFiltered ? 'No matching downloads found' : 'No offline songs downloaded yet'}</h3>
          <p class="downloads-empty-desc">${isFiltered ? 'Try searching for a different song or artist title.' : 'Download any song across REA Music in lossless 320kbps for offline playback anytime, anywhere.'}</p>
          <div class="downloads-empty-actions">
            ${isFiltered 
              ? `<button class="btn-action-glass" id="resetDlSearchBtn">Clear Search</button>`
              : `<button class="btn-action-primary" id="emptyDlLikedBtn">
                  <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  Download Liked Songs
                </button>
                <button class="btn-action-glass" id="emptyDlExploreBtn">Explore Top Hits</button>`
            }
          </div>
        </div>
      `;

      const resetBtn = document.getElementById('resetDlSearchBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.downloadsFilter = '';
          if (this.downloadsSearchInput) this.downloadsSearchInput.value = '';
          this.renderDownloads();
        });
      }

      const emptyLikedBtn = document.getElementById('emptyDlLikedBtn');
      if (emptyLikedBtn) {
        emptyLikedBtn.addEventListener('click', () => this.downloadAllLikedSongs());
      }

      const emptyExploreBtn = document.getElementById('emptyDlExploreBtn');
      if (emptyExploreBtn) {
        emptyExploreBtn.addEventListener('click', () => this.switchView('explore'));
      }
      return;
    }

    tracks.forEach((track, idx) => {
      const isCurrent = this.queue[this.currentTrackIndex]?.id === track.id && this.isPlaying;
      const row = document.createElement('div');
      row.className = `dl-track-row ${isCurrent ? 'active-dl-row' : ''}`;
      row.innerHTML = `
        <span class="dl-track-index">${idx + 1}</span>
        <img src="${track.cover}" alt="${track.title}" class="dl-track-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
        <div class="dl-track-info">
          <div class="dl-track-title">${track.title}</div>
          <div class="dl-track-artist">${track.artist}</div>
        </div>
        <div class="dl-track-album">${track.album || 'Lossless Single'}</div>
        <div class="dl-track-size">
          <span class="dl-track-badge">${track.sizeFormatted || '320kbps'}</span>
        </div>
        <div class="dl-track-actions">
          <button class="dl-btn-action dl-export-btn" title="Save .m4a file to device">
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          </button>
          <button class="dl-btn-action dl-delete-btn" title="Delete from offline storage">
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      `;

      row.addEventListener('click', (e) => {
        if (e.target.closest('.dl-export-btn')) {
          e.stopPropagation();
          this.exportTrackToFile(track);
          return;
        }
        if (e.target.closest('.dl-delete-btn')) {
          e.stopPropagation();
          this.deleteDownloadedTrack(track.id);
          return;
        }

        this.queue = [...this.downloadedTracks];
        const targetIdx = this.queue.findIndex(t => t.id === track.id);
        this.playTrack(targetIdx !== -1 ? targetIdx : 0);
      });

      this.downloadsTracksList.appendChild(row);
    });
  }
}

// =============================================================================
// Bootstrap on DOM Ready
// =============================================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.reamusic = new REAMusicApp();
  });
} else {
  window.reamusic = new REAMusicApp();
}

}
