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
    if (track.audioUrl) {
      if (this.audio.src !== track.audioUrl) {
        this.audio.src = track.audioUrl;
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
    this.currentView = 'home'; // 'home', 'explore', 'library'
    this.currentLibTab = 'all'; // 'all', 'liked', 'playlists', 'history'

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

    this.initDOMElements();
    this.initTheme();
    this.bindEvents();
    this.startVisualizer();
    this.renderAll();
    this.loadIndianMusicCatalog();
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

    // Views
    this.viewHome = document.getElementById('viewHome');
    this.viewExplore = document.getElementById('viewExplore');
    this.viewLibrary = document.getElementById('viewLibrary');

    // Header
    this.searchInput = document.getElementById('searchInput');
    this.searchClearBtn = document.getElementById('searchClearBtn');
    this.searchDropdown = document.getElementById('searchDropdown');
    this.searchResultsList = document.getElementById('searchResultsList');

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

    // 7. Search input with live API
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchDebounceTimer);
        const query = e.target.value;
        if (!query.trim()) {
          if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
          if (this.searchDropdown) this.searchDropdown.classList.add('hidden');
          return;
        }
        if (this.searchClearBtn) this.searchClearBtn.classList.remove('hidden');
        if (this.searchDropdown) this.searchDropdown.classList.remove('hidden');
        if (this.searchResultsList) {
          this.searchResultsList.innerHTML = `<div style="padding:16px;color:#aaa;text-align:center;">Searching Indian hits for "${query}"...</div>`;
        }

        this.searchDebounceTimer = setTimeout(() => {
          this.performLiveSearch(query);
        }, 250);
      });
    }

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener('click', () => {
        if (this.searchInput) this.searchInput.value = '';
        this.searchClearBtn.classList.add('hidden');
        if (this.searchDropdown) this.searchDropdown.classList.add('hidden');
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

    // Scroll main content to top
    const mainContent = document.getElementById('mainContent');
    if (mainContent) mainContent.scrollTop = 0;

    if (viewName === 'explore') {
      this.loadExploreCatalog();
    } else if (viewName === 'library') {
      this.renderLibrary();
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
            <img src="${album.cover}" alt="${album.title}" onerror="this.onerror=null;this.src='assets/midnight_vibes.jpg'">
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
        const card = document.createElement('div');
        card.className = 'ranked-track-card';
        card.innerHTML = `
          <div class="rank-number ${track.rank <= 3 ? 'top-three' : ''}">${track.rank}</div>
          <div class="rank-badge ${track.rankChange === 'NEW' ? 'badge-new' : ''}">${track.rankChange || '#1'}</div>
          <img src="${track.cover}" alt="${track.title}" class="track-thumb-img" onerror="this.onerror=null;this.src='assets/logo.jpg'" style="width:46px;height:46px;border-radius:4px;object-fit:cover;">
          <div class="track-row-info">
            <div class="track-row-title">${track.title}</div>
            <div class="track-row-artist">${track.artist}</div>
          </div>
          <div class="track-row-duration">${this.formatTime(track.duration)}</div>
        `;
        card.addEventListener('click', () => {
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
    this.renderLibraryPlaylists();
    this.renderLibraryHistory();
  }

  filterLibraryTab(tab) {
    this.currentLibTab = tab;
    this.libChips.forEach(c => c.classList.toggle('active', c.dataset.libTab === tab));

    if (this.libLikedHero) this.libLikedHero.classList.toggle('hidden', tab !== 'all' && tab !== 'liked');
    if (this.libLikedSongsShelf) this.libLikedSongsShelf.classList.toggle('hidden', tab !== 'all' && tab !== 'liked');
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
      const row = document.createElement('div');
      row.className = 'lib-track-row';
      row.innerHTML = `
        <span class="lib-track-index">${idx + 1}</span>
        <img src="${track.cover}" alt="${track.title}" class="lib-track-thumb" onerror="this.onerror=null;this.src='assets/logo.jpg'">
        <div class="lib-track-info">
          <div class="lib-track-title">${track.title}</div>
          <div class="lib-track-artist">${track.artist}</div>
        </div>
        <div class="lib-track-album">${track.album || ''}</div>
        <div class="lib-track-actions">
          <button class="lib-unlike-btn" title="Remove from Liked Music">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <span class="track-row-duration">${this.formatTime(track.duration)}</span>
        </div>
      `;
      row.addEventListener('click', (e) => {
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
        const row = document.createElement('div');
        row.className = 'search-item';
        row.innerHTML = `
          <img src="${track.cover}" alt="${track.title}">
          <div class="search-item-info">
            <div class="search-item-title">${track.title}</div>
            <div class="search-item-meta">${track.artist} • ${track.album}</div>
          </div>
        `;
        row.addEventListener('click', () => {
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
    this.renderPlayerInfo();
    this.renderQueue();
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
          <div class="track-row-duration">${this.formatTime(track.duration)}</div>
        `;
        card.addEventListener('click', () => {
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
      const isCurrent = idx === this.currentTrackIndex;
      const item = document.createElement('div');
      item.className = `queue-item ${isCurrent ? 'active-queue-item' : ''}`;
      item.innerHTML = `
        <img src="${track.cover}" alt="${track.title}" class="queue-item-thumb">
        <div class="queue-item-info">
          <div class="queue-item-title">${track.title}</div>
          <div class="queue-item-artist">${track.artist}</div>
        </div>
        <div class="queue-item-duration">${this.formatTime(track.duration)}</div>
      `;
      item.addEventListener('click', () => this.playTrack(idx));
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
      const item = document.createElement('div');
      item.className = `max-queue-item ${isCurrent ? 'active' : ''}`;
      item.innerHTML = `
        <img src="${track.cover}" alt="${track.title}" class="max-queue-thumb" onerror="this.onerror=null;this.src='assets/logo.jpg'">
        <div class="max-queue-info">
          <div class="max-queue-title">${track.title}</div>
          <div class="max-queue-artist">${track.artist}</div>
        </div>
        <div class="max-queue-dur">${this.formatTime(track.duration)}</div>
      `;
      item.addEventListener('click', () => {
        this.playTrack(idx);
      });
      this.maxQueueList.appendChild(item);
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
