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

// Smart API Resolution:
// 1. Android Capacitor / Standalone APK -> https://reamusic.vercel.app
// 2. Local Node server (localhost:4500) -> '' (local /api)
// 3. Vercel deployment (reamusic.vercel.app) -> '' (same-origin /api)
const IS_CAPACITOR_APP = typeof window !== 'undefined' && Boolean(
  window.Capacitor ||
  location.protocol === 'file:' ||
  location.protocol === 'capacitor:' ||
  (location.hostname === 'localhost' && (!location.port || location.port === '80' || location.port === '443'))
);

const API_BASE_URL = (typeof window !== 'undefined' && window.__API_BASE_URL__) ? window.__API_BASE_URL__ : (IS_CAPACITOR_APP ? 'https://reamusic.vercel.app' : '');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
    this.audio.preload = 'auto';
    this.volume = 0.75;
    this.audio.volume = this.volume;
    this.isPlaying = false;
    this.currentTrack = null;
    this.ctx = null;
    this.analyser = null;
    this.onError = null;
    this.onAutoplayBlocked = null;

    // Listen for native playback errors (network failure, 403, decode error)
    this.audio.addEventListener('error', (e) => {
      const err = this.audio.error;
      console.warn('[REA Audio Engine] Native audio element error:', err ? { code: err.code, message: err.message } : e);
      if (typeof this.onError === 'function') {
        this.onError(err || e, this.currentTrack);
      }
    });
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
    } catch (e) {
      console.warn('Web Audio init notice:', e);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audio.volume = this.volume;
  }

  playTrack(track) {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.currentTrack = track;
    const audioSource = track.localBlobUrl || track.audioUrl;
    if (audioSource) {
      if (this.audio.src !== audioSource) {
        this.audio.src = audioSource;
      }
      this.audio.volume = this.volume;
      const promise = this.audio.play();
      if (promise !== undefined) {
        promise.then(() => {
          this.isPlaying = true;
        }).catch(e => {
          this.isPlaying = false;
          console.warn('[REA Audio Engine] Audio play rejected:', e);
          if (e && (e.name === 'NotAllowedError' || e.code === 20)) {
            if (typeof this.onAutoplayBlocked === 'function') {
              this.onAutoplayBlocked(e, track);
            }
            return;
          }
          if (typeof this.onError === 'function') {
            this.onError(e, track);
          }
        });
      }
      this.isPlaying = true;
    } else {
      console.warn('[REA Audio Engine] Track missing audio source URL:', track);
      if (typeof this.onError === 'function') {
        this.onError(new Error('Missing audio source URL'), track);
      }
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.audio.src) {
      this.audio.volume = this.volume;
      const promise = this.audio.play();
      if (promise !== undefined) {
        promise.catch(e => {
          this.isPlaying = false;
          console.warn('Resume notice:', e);
          if (e && (e.name === 'NotAllowedError' || e.code === 20)) {
            if (typeof this.onAutoplayBlocked === 'function') {
              this.onAutoplayBlocked(e, this.currentTrack);
            }
          }
        });
      }
      this.isPlaying = true;
    } else if (this.currentTrack) {
      this.playTrack(this.currentTrack);
    }
  }

  play() {
    return this.resume();
  }

  seek(timeInSeconds) {
    if (this.audio.duration && !isNaN(this.audio.duration)) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, timeInSeconds));
    }
  }
}

// =============================================================================
// Intelligent Personalization & Adaptive Recommendation Engine Services
// =============================================================================

const REGIONAL_ARTISTS = {
  haryanvi: [
    'dhanda nyoliwala', 'khasa aala chahar', 'gulzaar chhaniwala', 'masoom sharma',
    'amit saini rohtakiya', 'renuka panwar', 'raju punjabi', 'sapna choudhary',
    'pranjal dahiya', 'sumit goswami', 'bintu pabra', 'kd desirock', 'md', 'ajay hooda',
    'manisha sharma', 'vicky kajla', 'komal choudhary', 'aman jaji', 'ruchika jangid'
  ],
  punjabi: [
    'karan aujla', 'diljit dosanjh', 'sidhu moose wala', 'ap dhillon', 'shubh',
    'gurinder gill', 'amrit maan', 'jassi gill', 'jass manak', 'b praak', 'harrdy sandhu',
    'yo yo honey singh', 'badshah', 'raftaar', 'sukhe', 'mankirt aulakh', 'tarsem jassar',
    'kulwinder billa', 'parmish verma', 'jordan sandhu', 'guru randhawa'
  ],
  bollywood: [
    'arijit singh', 'pritam', 'sachin-jigar', 'amitabh bhattacharya', 'shreya ghoshal',
    'sonu nigam', 'jubin nautiyal', 'neha kakkar', 'armaan malik', 'darshan raval',
    'vishal-shekhar', 'atif aslam', 'mohit chauhan', 'kk', 'alka yagnik', 'kumar sanu',
    'udit narayan', 'kishore kumar', 'lata mangeshkar', 'mithoon', 'anupam aravind',
    'badshah', 'vishal mishra', 'jasleen royal', 'shankar-ehsaan-loy'
  ],
  indie: [
    'anuv jain', 'prateek kuhad', 'zaeden', 'ritviz', 'when chai met toast',
    'the local train', 'jasleen royal', 'taba chake', 'aditya a', 'sanah moidutty',
    'o shoot', 'achint', 'sai abhyankkar', 'seedhe maut', 'kr$na', 'divine'
  ]
};

function detectTrackTags(track) {
  if (!track) return { genres: [], languages: [], moods: [], artistTokens: [] };
  const title = (track.title || '').toLowerCase();
  const artist = (track.artist || '').toLowerCase();
  const album = (track.album || '').toLowerCase();
  const explicitLang = (track.language || '').toLowerCase();

  const artistTokens = artist
    .split(/[,&/|]|\bfeat\.?\b|\bft\.?\b/i)
    .map(s => s.trim())
    .filter(Boolean);

  const genres = new Set();
  const languages = new Set();
  const moods = new Set();

  if (explicitLang) {
    languages.add(explicitLang);
    if (explicitLang === 'haryanvi') genres.add('haryanvi');
    if (explicitLang === 'punjabi') genres.add('punjabi');
    if (explicitLang === 'hindi') genres.add('bollywood');
  }

  // Artist-based matching
  for (const hArtist of REGIONAL_ARTISTS.haryanvi) {
    if (artist.includes(hArtist) || title.includes(hArtist)) {
      genres.add('haryanvi');
      languages.add('haryanvi');
      break;
    }
  }
  for (const pArtist of REGIONAL_ARTISTS.punjabi) {
    if (artist.includes(pArtist) || title.includes(pArtist)) {
      genres.add('punjabi');
      languages.add('punjabi');
      break;
    }
  }
  for (const bArtist of REGIONAL_ARTISTS.bollywood) {
    if (artist.includes(bArtist)) {
      genres.add('bollywood');
      languages.add('hindi');
      break;
    }
  }
  for (const iArtist of REGIONAL_ARTISTS.indie) {
    if (artist.includes(iArtist)) {
      genres.add('indie');
      break;
    }
  }

  // Keyword-based genre & language heuristics
  const combined = `${title} ${album} ${artist}`;
  if (/haryanvi|ragni|desi hip hop|haryana/i.test(combined)) {
    genres.add('haryanvi');
    languages.add('haryanvi');
  }
  if (/punjabi|bhangra|desi bass|punjab/i.test(combined)) {
    genres.add('punjabi');
    languages.add('punjabi');
  }
  if (/bollywood|soundtrack|film|cinema/i.test(combined)) {
    genres.add('bollywood');
    languages.add('hindi');
  }
  if (/indie|acoustic|unplugged|pop indie/i.test(combined)) {
    genres.add('indie');
  }

  // Mood tags
  if (/romantic|love|ishq|pyaar|dil|tum|hum|heart|kasam|deewani/i.test(combined)) {
    moods.add('romantic');
  }
  if (/chill|lofi|relax|peace|acoustic|slowed|reverb|ambient|sufi/i.test(combined)) {
    moods.add('chill');
  }
  if (/party|dance|club|dj|remix|dhamaka|celebration|banger|nach/i.test(combined)) {
    moods.add('party');
  }
  if (/workout|gym|beast|power|pump|energy|motivation|fitness|hard/i.test(combined)) {
    moods.add('workout');
  }

  return {
    genres: Array.from(genres),
    languages: Array.from(languages),
    moods: Array.from(moods),
    artistTokens
  };
}

class ListeningHistoryService {
  constructor(preferenceService) {
    this.preferenceService = preferenceService;
    this.storageKey = 'rea_listening_events_v2';
    this.skippedStorageKey = 'rea_recently_skipped_ids';
    this.activeSession = null;
    this.events = this.loadEvents();
    this.recentlySkippedTrackIds = this.loadSkippedTrackIds();
  }

  loadEvents() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  saveEvents() {
    try {
      if (this.events.length > 200) {
        this.events = this.events.slice(0, 200);
      }
      localStorage.setItem(this.storageKey, JSON.stringify(this.events));
    } catch (_) {}
  }

  loadSkippedTrackIds() {
    try {
      const data = localStorage.getItem(this.skippedStorageKey);
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  saveSkippedTrackIds() {
    try {
      if (this.recentlySkippedTrackIds.length > 20) {
        this.recentlySkippedTrackIds = this.recentlySkippedTrackIds.slice(0, 20);
      }
      localStorage.setItem(this.skippedStorageKey, JSON.stringify(this.recentlySkippedTrackIds));
    } catch (_) {}
  }

  isRecentlySkipped(trackId) {
    if (!trackId) return false;
    return this.recentlySkippedTrackIds.includes(String(trackId));
  }

  recordEvent(eventType, track, metadata = {}) {
    if (!track) return;
    const tags = detectTrackTags(track);
    const event = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      eventType,
      trackId: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album || '',
      genres: tags.genres,
      languages: tags.languages,
      moods: tags.moods,
      timestamp: Date.now(),
      ...metadata
    };
    this.events.unshift(event);
    this.saveEvents();
    return event;
  }

  onTrackStarted(track, context = null) {
    if (!track) return;
    this.activeSession = {
      trackId: track.id,
      track,
      startTime: Date.now(),
      durationListened: 0,
      totalDuration: track.duration || 180,
      completed: false,
      context: context ? context.type || 'home' : 'unknown'
    };
    this.recordEvent('song_started', track, { source: this.activeSession.context });
    if (this.preferenceService) {
      this.preferenceService.recordSongStarted(track, this.activeSession.context);
    }
  }

  updateActiveSession(currentTime, duration) {
    if (!this.activeSession) return;
    if (duration && duration > 0) {
      this.activeSession.totalDuration = duration;
    }
    this.activeSession.durationListened = Math.max(this.activeSession.durationListened, currentTime || 0);
    const pct = this.activeSession.durationListened / (this.activeSession.totalDuration || 1);

    if (!this.activeSession.completed && (pct >= 0.85 || this.activeSession.durationListened >= 150)) {
      this.activeSession.completed = true;
      this.onTrackCompleted(this.activeSession.track);
    }
  }

  onTrackCompleted(track) {
    if (!track) return;
    if (track.id) {
      const sId = String(track.id);
      if (this.recentlySkippedTrackIds.includes(sId)) {
        this.recentlySkippedTrackIds = this.recentlySkippedTrackIds.filter(id => id !== sId);
        this.saveSkippedTrackIds();
      }
    }
    this.recordEvent('song_completed', track, {
      durationListened: this.activeSession ? this.activeSession.durationListened : track.duration,
      completionPct: 1.0
    });
    if (this.preferenceService) {
      this.preferenceService.recordTrackCompleted(track);
    }
  }

  onTrackSkipped(track) {
    if (!track) return;
    const durationListened = this.activeSession ? this.activeSession.durationListened : 0;
    const totalDuration = (this.activeSession && this.activeSession.totalDuration) || track.duration || 180;
    const pct = durationListened / (totalDuration || 1);
    const isHardSkip = durationListened < 25 || pct < 0.30;

    if (track.id) {
      const sId = String(track.id);
      this.recentlySkippedTrackIds = this.recentlySkippedTrackIds.filter(id => id !== sId);
      this.recentlySkippedTrackIds.unshift(sId);
      this.saveSkippedTrackIds();
    }

    this.recordEvent('song_skipped', track, {
      durationListened,
      completionPct: Math.round(pct * 100) / 100,
      isHardSkip
    });

    if (this.preferenceService) {
      this.preferenceService.recordTrackSkipped(track, isHardSkip, durationListened);
    }
    this.activeSession = null;
  }

  onTrackReplayed(track) {
    if (!track) return;
    this.recordEvent('song_replayed', track);
    if (this.preferenceService) {
      this.preferenceService.recordTrackReplayed(track);
    }
  }

  onTrackLiked(track, isLiked) {
    if (!track) return;
    if (isLiked && track.id) {
      const sId = String(track.id);
      if (this.recentlySkippedTrackIds.includes(sId)) {
        this.recentlySkippedTrackIds = this.recentlySkippedTrackIds.filter(id => id !== sId);
        this.saveSkippedTrackIds();
      }
    }
    this.recordEvent(isLiked ? 'song_favourited' : 'song_unfavourited', track);
    if (this.preferenceService) {
      this.preferenceService.recordTrackLiked(track, isLiked);
    }
  }

  onTrackPlaylistAdded(track, playlistTitle = '') {
    if (!track) return;
    this.recordEvent('playlist_added', track, { playlist: playlistTitle });
    if (this.preferenceService) {
      this.preferenceService.recordPlaylistAdded(track);
    }
  }

  onArtistOpened(artistId, artistName) {
    if (this.preferenceService) {
      this.preferenceService.recordArtistOpened(artistId, artistName);
    }
  }

  onExplicitDislike(track) {
    if (!track) return;
    this.recordEvent('song_not_interested', track);
    if (this.preferenceService) {
      this.preferenceService.recordExplicitDislike(track);
    }
  }

  onShowLessArtist(artistName) {
    if (!artistName) return;
    if (this.preferenceService) {
      this.preferenceService.recordShowLessArtist(artistName);
    }
  }

  clearHistory() {
    this.events = [];
    this.recentlySkippedTrackIds = [];
    this.activeSession = null;
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.skippedStorageKey);
    } catch (_) {}
  }
}

class UserPreferenceService {
  constructor() {
    this.storageKey = 'rea_user_preferences_v3';
    this.halfLifeMs = 7 * 24 * 60 * 60 * 1000; // 7-day half life for recency decay
    this.profile = this.loadProfile();
  }

  getDefaultProfile() {
    return {
      artistAffinities: {},
      genreWeights: {},
      languageWeights: {},
      moodWeights: {},
      dislikedTrackIds: [],
      dislikedArtists: [],
      totalPlays: 0,
      totalCompletions: 0,
      confidence: 0,
      lastUpdated: Date.now()
    };
  }

  loadProfile() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...this.getDefaultProfile(), ...parsed };
      }
    } catch (_) {}
    return this.getDefaultProfile();
  }

  saveProfile() {
    try {
      this.profile.lastUpdated = Date.now();
      this.recalculateConfidence();
      localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
    } catch (_) {}
  }

  getDecayedWeight(entry) {
    if (!entry || typeof entry.weight !== 'number') return 0;
    const lastPlayed = entry.lastPlayed || entry.lastUpdated || Date.now();
    const age = Math.max(0, Date.now() - lastPlayed);
    const decayFactor = Math.pow(0.5, age / this.halfLifeMs);
    return entry.weight * decayFactor;
  }

  recalculateConfidence() {
    const completions = this.profile.totalCompletions || 0;
    const plays = this.profile.totalPlays || 0;
    const artistKeys = Object.keys(this.profile.artistAffinities || {});
    const activeArtists = artistKeys.filter(a => this.getDecayedWeight(this.profile.artistAffinities[a]) > 0.5);

    const score = (completions * 0.10) + (plays * 0.04) + (activeArtists.length * 0.06);
    this.profile.confidence = Math.min(1.0, Math.max(0, Math.round(score * 100) / 100));
    return this.profile.confidence;
  }

  recordSongStarted(track, source = '') {
    if (!track) return;
    this.profile.totalPlays = (this.profile.totalPlays || 0) + 1;
    const tags = detectTrackTags(track);

    tags.artistTokens.forEach(rawArtist => {
      const artist = rawArtist.toLowerCase();
      if (!this.profile.artistAffinities[artist]) {
        this.profile.artistAffinities[artist] = {
          weight: 0,
          plays: 0,
          completions: 0,
          skips: 0,
          likes: 0,
          lastPlayed: Date.now()
        };
      }
      const a = this.profile.artistAffinities[artist];
      a.plays = (a.plays || 0) + 1;
      a.weight = Math.min(15, (a.weight || 0) + 1.2);
      a.lastPlayed = Date.now();
    });

    tags.genres.forEach(g => {
      if (!this.profile.genreWeights[g]) {
        this.profile.genreWeights[g] = { weight: 0, plays: 0, completions: 0, lastPlayed: Date.now() };
      }
      const entry = this.profile.genreWeights[g];
      entry.plays = (entry.plays || 0) + 1;
      entry.weight = Math.min(10, (entry.weight || 0) + 0.8);
      entry.lastPlayed = Date.now();
    });

    tags.languages.forEach(l => {
      if (!this.profile.languageWeights[l]) {
        this.profile.languageWeights[l] = { weight: 0, plays: 0, lastPlayed: Date.now() };
      }
      const entry = this.profile.languageWeights[l];
      entry.plays = (entry.plays || 0) + 1;
      entry.weight = Math.min(10, (entry.weight || 0) + 0.8);
      entry.lastPlayed = Date.now();
    });

    tags.moods.forEach(m => {
      if (!this.profile.moodWeights[m]) {
        this.profile.moodWeights[m] = { weight: 0, plays: 0, lastPlayed: Date.now() };
      }
      const entry = this.profile.moodWeights[m];
      entry.plays = (entry.plays || 0) + 1;
      entry.weight = Math.min(8, (entry.weight || 0) + 0.6);
      entry.lastPlayed = Date.now();
    });

    this.saveProfile();
  }

  recordTrackCompleted(track) {
    if (!track) return;
    this.profile.totalCompletions = (this.profile.totalCompletions || 0) + 1;
    const tags = detectTrackTags(track);

    tags.artistTokens.forEach(rawArtist => {
      const artist = rawArtist.toLowerCase();
      if (this.profile.artistAffinities[artist]) {
        const a = this.profile.artistAffinities[artist];
        a.completions = (a.completions || 0) + 1;
        a.weight = Math.min(20, a.weight + 2.5);
        a.lastPlayed = Date.now();
      }
    });

    tags.genres.forEach(g => {
      if (this.profile.genreWeights[g]) {
        const entry = this.profile.genreWeights[g];
        entry.completions = (entry.completions || 0) + 1;
        entry.weight = Math.min(15, entry.weight + 1.5);
        entry.lastPlayed = Date.now();
      }
    });

    this.saveProfile();
  }

  recordTrackSkipped(track, isHardSkip = false, durationListened = 0) {
    if (!track) return;
    const tags = detectTrackTags(track);
    const penalty = isHardSkip ? 1.5 : 0.4;

    tags.artistTokens.forEach(rawArtist => {
      const artist = rawArtist.toLowerCase();
      if (this.profile.artistAffinities[artist]) {
        const a = this.profile.artistAffinities[artist];
        a.skips = (a.skips || 0) + 1;
        a.weight = Math.max(0, a.weight - penalty);
      }
    });

    this.saveProfile();
  }

  recordTrackReplayed(track) {
    if (!track) return;
    const tags = detectTrackTags(track);
    tags.artistTokens.forEach(rawArtist => {
      const artist = rawArtist.toLowerCase();
      if (this.profile.artistAffinities[artist]) {
        const a = this.profile.artistAffinities[artist];
        a.weight = Math.min(20, a.weight + 3.0);
        a.lastPlayed = Date.now();
      }
    });
    this.saveProfile();
  }

  recordTrackLiked(track, isLiked) {
    if (!track) return;
    const tags = detectTrackTags(track);
    tags.artistTokens.forEach(rawArtist => {
      const artist = rawArtist.toLowerCase();
      if (!this.profile.artistAffinities[artist]) {
        this.profile.artistAffinities[artist] = { weight: 0, plays: 0, completions: 0, skips: 0, likes: 0, lastPlayed: Date.now() };
      }
      const a = this.profile.artistAffinities[artist];
      if (isLiked) {
        a.likes = (a.likes || 0) + 1;
        a.weight = Math.min(25, a.weight + 3.5);
      } else {
        a.likes = Math.max(0, (a.likes || 1) - 1);
        a.weight = Math.max(0, a.weight - 2.0);
      }
      a.lastPlayed = Date.now();
    });

    tags.genres.forEach(g => {
      if (!this.profile.genreWeights[g]) {
        this.profile.genreWeights[g] = { weight: 0, plays: 0, completions: 0, lastPlayed: Date.now() };
      }
      const entry = this.profile.genreWeights[g];
      entry.weight = isLiked ? Math.min(15, entry.weight + 2.0) : Math.max(0, entry.weight - 1.0);
      entry.lastPlayed = Date.now();
    });

    this.saveProfile();
  }

  recordPlaylistAdded(track) {
    if (!track) return;
    const tags = detectTrackTags(track);
    tags.artistTokens.forEach(rawArtist => {
      const artist = rawArtist.toLowerCase();
      if (!this.profile.artistAffinities[artist]) {
        this.profile.artistAffinities[artist] = { weight: 0, plays: 0, completions: 0, skips: 0, likes: 0, lastPlayed: Date.now() };
      }
      const a = this.profile.artistAffinities[artist];
      a.weight = Math.min(25, a.weight + 2.5);
      a.lastPlayed = Date.now();
    });
    this.saveProfile();
  }

  recordArtistOpened(artistId, artistName) {
    if (!artistName) return;
    const artist = artistName.toLowerCase().trim();
    if (!this.profile.artistAffinities[artist]) {
      this.profile.artistAffinities[artist] = { weight: 0, plays: 0, completions: 0, skips: 0, likes: 0, lastPlayed: Date.now() };
    }
    const a = this.profile.artistAffinities[artist];
    a.weight = Math.min(20, a.weight + 1.2);
    a.lastPlayed = Date.now();
    this.saveProfile();
  }

  recordExplicitDislike(track) {
    if (!track || !track.id) return;
    if (!this.profile.dislikedTrackIds.includes(track.id)) {
      this.profile.dislikedTrackIds.push(track.id);
    }
    const tags = detectTrackTags(track);
    tags.artistTokens.forEach(rawArtist => {
      const artist = rawArtist.toLowerCase();
      if (this.profile.artistAffinities[artist]) {
        this.profile.artistAffinities[artist].weight = Math.max(0, this.profile.artistAffinities[artist].weight - 4.0);
      }
    });
    this.saveProfile();
  }

  recordShowLessArtist(artistName) {
    if (!artistName) return;
    const artist = artistName.toLowerCase().trim();
    if (!this.profile.dislikedArtists.includes(artist)) {
      this.profile.dislikedArtists.push(artist);
    }
    if (this.profile.artistAffinities[artist]) {
      this.profile.artistAffinities[artist].weight = 0;
    }
    this.saveProfile();
  }

  resetPreferences() {
    this.profile = this.getDefaultProfile();
    try {
      localStorage.removeItem(this.storageKey);
    } catch (_) {}
  }
}

class ArtistAffinityService {
  constructor(preferenceService) {
    this.preferenceService = preferenceService;
  }

  getAffinity(artistName) {
    if (!artistName) return 0;
    const aKey = artistName.toLowerCase().trim();
    const affinities = this.preferenceService.profile.artistAffinities;
    if (!affinities || !affinities[aKey]) return 0;
    return this.preferenceService.getDecayedWeight(affinities[aKey]);
  }

  getTopArtists(limit = 5) {
    const affinities = this.preferenceService.profile.artistAffinities || {};
    const disliked = new Set(this.preferenceService.profile.dislikedArtists || []);
    return Object.keys(affinities)
      .filter(artist => !disliked.has(artist))
      .map(artist => ({
        artist,
        score: this.preferenceService.getDecayedWeight(affinities[artist]),
        plays: affinities[artist].plays || 0,
        completions: affinities[artist].completions || 0,
        likes: affinities[artist].likes || 0
      }))
      .filter(a => a.score > 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  getTopGenre() {
    const genres = this.preferenceService.profile.genreWeights || {};
    const sorted = Object.keys(genres)
      .map(g => ({
        genre: g,
        score: this.preferenceService.getDecayedWeight(genres[g])
      }))
      .filter(g => g.score > 0.5)
      .sort((a, b) => b.score - a.score);
    return sorted.length > 0 ? sorted[0] : null;
  }
}

class TrackSimilarityService {
  calculateSimilarity(trackA, trackB) {
    if (!trackA || !trackB) return 0;
    if (trackA.id === trackB.id) return 1.0;

    const tagsA = detectTrackTags(trackA);
    const tagsB = detectTrackTags(trackB);

    let score = 0;

    const artistA = (trackA.artist || '').toLowerCase();
    const artistB = (trackB.artist || '').toLowerCase();
    if (artistA === artistB && artistA.length > 0) {
      score += 0.40;
    } else {
      const sharedArtist = tagsA.artistTokens.some(a => tagsB.artistTokens.includes(a));
      if (sharedArtist) score += 0.30;
    }

    const sharedGenre = tagsA.genres.some(g => tagsB.genres.includes(g));
    if (sharedGenre) score += 0.20;
    const sharedLang = tagsA.languages.some(l => tagsB.languages.includes(l));
    if (sharedLang) score += 0.10;

    const sharedMood = tagsA.moods.some(m => tagsB.moods.includes(m));
    if (sharedMood) score += 0.20;

    if (trackA.album && trackB.album && trackA.album.toLowerCase() === trackB.album.toLowerCase()) {
      score += 0.10;
    }

    return Math.min(1.0, score);
  }
}

class RecommendationEngine {
  constructor(preferenceService, affinityService, similarityService) {
    this.preferenceService = preferenceService;
    this.affinityService = affinityService;
    this.similarityService = similarityService;
    this.weights = {
      artistAffinity: 0.30,
      recentSimilarity: 0.25,
      genreLanguage: 0.15,
      mood: 0.10,
      engagement: 0.10,
      freshnessDiscovery: 0.10
    };
  }

  scoreCandidate(track, recentTracks = []) {
    if (!track) return 0;
    const dislikedTracks = this.preferenceService.profile.dislikedTrackIds || [];
    if (dislikedTracks.includes(track.id)) return -1;

    const dislikedArtists = this.preferenceService.profile.dislikedArtists || [];
    const tags = detectTrackTags(track);
    if (tags.artistTokens.some(a => dislikedArtists.includes(a))) return -1;

    let artistAffinityScore = 0;
    tags.artistTokens.forEach(a => {
      const aff = this.affinityService.getAffinity(a);
      if (aff > artistAffinityScore) artistAffinityScore = aff;
    });
    const normArtist = Math.min(1.0, artistAffinityScore / 15);

    let recentSimScore = 0;
    if (recentTracks.length > 0) {
      const topSims = recentTracks.slice(0, 5).map(rt => this.similarityService.calculateSimilarity(track, rt));
      recentSimScore = topSims.reduce((sum, s) => sum + s, 0) / topSims.length;
    }

    let genreScore = 0;
    tags.genres.forEach(g => {
      const gEntry = this.preferenceService.profile.genreWeights[g];
      if (gEntry) {
        const w = this.preferenceService.getDecayedWeight(gEntry);
        if (w > genreScore) genreScore = w;
      }
    });
    const normGenre = Math.min(1.0, genreScore / 10);

    let moodScore = 0;
    tags.moods.forEach(m => {
      const mEntry = this.preferenceService.profile.moodWeights[m];
      if (mEntry) {
        const w = this.preferenceService.getDecayedWeight(mEntry);
        if (w > moodScore) moodScore = w;
      }
    });
    const normMood = Math.min(1.0, moodScore / 8);

    let engagementScore = 0;
    tags.artistTokens.forEach(a => {
      const entry = this.preferenceService.profile.artistAffinities[a];
      if (entry) {
        if (entry.likes > 0) engagementScore += 0.5;
        if (entry.completions > 1) engagementScore += 0.5;
      }
    });
    engagementScore = Math.min(1.0, engagementScore);

    const discoveryScore = 0.5;

    let totalScore =
      (normArtist * this.weights.artistAffinity) +
      (recentSimScore * this.weights.recentSimilarity) +
      (normGenre * this.weights.genreLanguage) +
      (normMood * this.weights.mood) +
      (engagementScore * this.weights.engagement) +
      (discoveryScore * this.weights.freshnessDiscovery);

    const recentIds = JSON.parse(localStorage.getItem('rea_recently_played_ids') || '[]');
    if (recentIds.slice(0, 15).includes(track.id)) {
      totalScore *= 0.5;
    }

    const skippedIds = JSON.parse(localStorage.getItem('rea_recently_skipped_ids') || '[]');
    if (skippedIds.slice(0, 15).includes(String(track.id))) {
      totalScore *= 0.15;
    }

    tags.artistTokens.forEach(a => {
      const entry = this.preferenceService.profile.artistAffinities[a];
      if (entry && entry.skips > 2 && entry.skips > (entry.completions || 0)) {
        totalScore *= 0.65;
      }
    });

    return totalScore;
  }

  rankTracks(candidates, recentTracks = [], maxPerArtist = 3) {
    if (!candidates || candidates.length === 0) return [];

    const seenIds = new Set();
    const uniqueCandidates = [];
    for (const track of candidates) {
      if (track && track.id && !seenIds.has(track.id)) {
        seenIds.add(track.id);
        uniqueCandidates.push(track);
      }
    }

    const scored = [];
    for (const track of uniqueCandidates) {
      const score = this.scoreCandidate(track, recentTracks);
      if (score >= 0) {
        scored.push({ track, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    const artistCounts = new Map();
    const finalRanked = [];

    for (const item of scored) {
      const artist = (item.track.artist || 'unknown').toLowerCase().split(',')[0].trim();
      const count = artistCounts.get(artist) || 0;
      if (count < maxPerArtist) {
        artistCounts.set(artist, count + 1);
        finalRanked.push(item.track);
      }
    }

    return finalRanked;
  }
}

class HomeFeedService {
  constructor(app, preferenceService, affinityService, recoEngine) {
    this.app = app;
    this.preferenceService = preferenceService;
    this.affinityService = affinityService;
    this.recoEngine = recoEngine;
    this.cachedPersonalizedTracks = [];
    this.isLoadingPersonalized = false;
  }

  async renderAdaptiveFeed() {
    const confidence = this.preferenceService.recalculateConfidence();
    const topArtists = this.affinityService.getTopArtists(3);
    const topArtistObj = topArtists.length > 0 ? topArtists[0] : null;
    const topArtist = topArtistObj ? topArtistObj.artist : null;
    const topGenreObj = this.affinityService.getTopGenre();

    if (this.app.updateTasteProfileUI) {
      this.app.updateTasteProfileUI();
    }

    if (confidence < 0.15 || !topArtist) {
      if (this.app.personalizedShelf) {
        this.app.personalizedShelf.style.display = 'none';
      }
      if (this.app.jumpBackInShelf) {
        this.app.jumpBackInShelf.style.display = 'none';
      }
      return;
    }

    this.renderJumpBackInShelf();
    await this.renderPersonalizedShelf(topArtist, topGenreObj, confidence);
  }

  renderJumpBackInShelf() {
    const history = this.app.history || [];
    if (!this.app.jumpBackInShelf || !this.app.jumpBackInCarousel) return;

    if (history.length === 0) {
      this.app.jumpBackInShelf.style.display = 'none';
      return;
    }

    this.app.jumpBackInShelf.style.display = '';
    this.app.jumpBackInCarousel.innerHTML = '';
    const fragment = document.createDocumentFragment();

    history.slice(0, 10).forEach(track => {
      const card = this.app.createMusicCardElement(track);
      fragment.appendChild(card);
    });
    this.app.jumpBackInCarousel.appendChild(fragment);
  }

  async renderPersonalizedShelf(topArtist, topGenreObj, confidence) {
    if (!this.app.personalizedShelf || !this.app.personalizedCarousel) return;

    const formattedArtist = topArtist
      ? topArtist.replace(/\b\w/g, c => c.toUpperCase())
      : 'Your Favourites';

    if (this.app.personalizedTitle) {
      if (confidence > 0.45 && topGenreObj && topGenreObj.score > 3.0) {
        const capGenre = topGenreObj.genre.replace(/\b\w/g, c => c.toUpperCase());
        this.app.personalizedTitle.innerHTML = `Your ${capGenre} & ${formattedArtist} Favourites <span class="shelf-title-arrow">›</span>`;
      } else {
        this.app.personalizedTitle.innerHTML = `Because you listened to ${formattedArtist} <span class="shelf-title-arrow">›</span>`;
      }
    }

    if (this.app.personalizedEyebrow) {
      this.app.personalizedEyebrow.innerHTML = confidence > 0.45
        ? `TAILORED FOR YOU <span class="shelf-badge-personalized">★ High Affinity</span>`
        : `BASED ON YOUR LISTENING`;
    }

    this.app.personalizedShelf.style.display = '';

    try {
      const genreParam = topGenreObj ? topGenreObj.genre : '';
      const res = await fetch(`${API_BASE_URL}/api/recommendations?artist=${encodeURIComponent(topArtist)}&genre=${encodeURIComponent(genreParam)}&limit=18`);
      if (res.ok) {
        const data = await res.json();
        const apiCandidates = data.recommendations || [];

        const allCandidates = [
          ...apiCandidates,
          ...(this.app.haryanviHits || []),
          ...(this.app.punjabiHits || []),
          ...(this.app.trendingHits || []),
          ...(this.app.quickPicks || [])
        ];

        const recentTracks = (this.app.history || []).slice(0, 5);
        const ranked = this.recoEngine.rankTracks(allCandidates, recentTracks, 3);

        this.cachedPersonalizedTracks = ranked.slice(0, 12);
        this.app.personalizedCarousel.innerHTML = '';
        const fragment = document.createDocumentFragment();

        this.cachedPersonalizedTracks.forEach(track => {
          const card = this.app.createMusicCardElement(track);
          fragment.appendChild(card);
        });
        this.app.personalizedCarousel.appendChild(fragment);
      }
    } catch (err) {
      console.warn('[HomeFeedService] Error rendering personalized shelf:', err);
    }
  }
}

// =============================================================================
// 3. Main REA Music UI & Application Controller
// =============================================================================
class REAMusicApp {
  constructor() {
    this.engine = new HybridAudioEngine();

    // 3-Tier Queue & Smart Autoplay Architecture
    this.manualQueue = [];            // Priority user-queued tracks ("Play Next", "Add to Queue")
    this.sequenceQueue = [];          // Active album/playlist/artist/chart track sequence
    this.sequenceIndex = -1;          // Current position in active sequence
    this.recommendationQueue = [];    // Smart Autoplay candidate queue
    this.recommendationReasons = new Map(); // trackId -> reason label ("Because you played...", etc.)
    this.playbackContext = {
      type: 'single',                 // 'single' | 'album' | 'playlist' | 'artist' | 'recommendation'
      id: '',
      title: 'REA Curated Mix'
    };

    // Data State
    this.quickPicks = [...FALLBACK_TRACKS];
    this.trendingHits = [];
    this.punjabiHits = [];
    this.romanticHits = [];
    this.haryanviHits = [];
    this.bollywoodHits = [];
    this.indieHits = [];
    this.selectedMenuTrack = null;

    // Intelligent Personalization & Discovery Engine Services
    this.userPreferenceService = new UserPreferenceService();
    this.artistAffinityService = new ArtistAffinityService(this.userPreferenceService);
    this.trackSimilarityService = new TrackSimilarityService();
    this.recommendationEngine = new RecommendationEngine(
      this.userPreferenceService,
      this.artistAffinityService,
      this.trackSimilarityService
    );
    this.listeningHistoryService = new ListeningHistoryService(this.userPreferenceService);
    this.homeFeedService = new HomeFeedService(
      this,
      this.userPreferenceService,
      this.artistAffinityService,
      this.recommendationEngine
    );
        this.exploreReleases = [
      { id: 'rel-udta-teer', title: 'Udta Teer', artist: 'Various Artists', year: '2026', cover: 'https://c.saavncdn.com/500/Udta-Teer-Hindi-2024-20240816124503-500x500.jpg' },
      { id: 'rel-tu-hai-meri-kiran', title: 'Tu Hai Meri Kiran', artist: 'Various Artists', year: '2026', cover: 'https://c.saavncdn.com/500/Tu-Hai-Meri-Kiran-Hindi-2024-20240906151046-500x500.jpg' },
      { id: 'rel-rajini-jailer-2', title: 'Rajini The Jailer 2', artist: 'Various Artists', year: '2026', cover: 'https://c.saavncdn.com/500/Jailer-2-Hindi-2024-20240810151046-500x500.jpg' },
      { id: 'rel-tum-mere-ho', title: 'Tum Mere Ho', artist: 'Various Artists', year: '2026', cover: 'https://c.saavncdn.com/500/Tum-Mere-Ho-Hindi-2024-20240726151046-500x500.jpg' },
      { id: 'rel-ranabaali', title: 'Ranabaali - Hindi', artist: 'Various Artists', year: '2026', cover: 'https://c.saavncdn.com/500/Ranabaali-Hindi-2024-20240915151046-500x500.jpg' },
      { id: 'rel-prem-keetanu', title: 'Prem Keetanu', artist: 'Various Artists', year: '2026', cover: 'https://c.saavncdn.com/500/Prem-Keetanu-Hindi-2024-20240920151046-500x500.jpg' }
    ];
    this.exploreCharts = [
      { id: 'chart-1', rank: 1, rankChange: '+1', title: 'Casa Tupka Anthem', artist: 'Yo Yo Honey Singh', album: 'Casa Tupka', cover: 'assets/casa_tupka.jpg', duration: 183 },
      { id: 'chart-2', rank: 2, rankChange: '-1', title: 'Gehra Hua', artist: 'Arijit Singh, Armaan Malik', album: 'Gehra Hua', cover: 'https://c.saavncdn.com/500/Gehra-Hua-Hindi-2024-20240918151046-500x500.jpg', duration: 362 },
      { id: 'chart-3', rank: 3, rankChange: '—', title: 'Parvati', artist: 'Sadhu Tiwari', album: 'Parvati', cover: 'https://c.saavncdn.com/500/Parvati-Hindi-2024-20240912151046-500x500.jpg', duration: 284 },
      { id: 'chart-4', rank: 4, rankChange: '+2', title: 'Tera Mera Rishta', artist: 'Mithoon, Pritam, Saaj Bhatt', album: 'Awarapan 2', cover: 'https://c.saavncdn.com/500/Tera-Mera-Rishta-Hindi-2024-20240822151046-500x500.jpg', duration: 365 },
      { id: 'chart-5', rank: 5, rankChange: 'NEW', title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', cover: 'https://c.saavncdn.com/500/Aashiqui-2-Hindi-2013-20220909181510-500x500.jpg', duration: 262 },
      { id: 'chart-6', rank: 6, rankChange: '+1', title: 'Saiyaara', artist: 'Various Artists', album: 'Ek Tha Tiger', cover: 'https://c.saavncdn.com/500/Ek-Tha-Tiger-Hindi-2012-20220909181510-500x500.jpg', duration: 370 },
      { id: 'chart-7', rank: 7, rankChange: '-2', title: 'Dheere Dheere', artist: 'Yo Yo Honey Singh', album: 'Dheere Dheere', cover: 'https://c.saavncdn.com/500/Dheere-Dheere-Se-Meri-Zindagi-Mein-Aana-Hindi-2015-20220909181510-500x500.jpg', duration: 238 },
      { id: 'chart-8', rank: 8, rankChange: '+1', title: 'Barbaad', artist: 'Jubin Nautiyal', album: 'Barbaad', cover: 'https://c.saavncdn.com/500/Barbaad-Hindi-2024-20240810151046-500x500.jpg', duration: 255 },
      { id: 'chart-9', rank: 9, rankChange: 'NEW', title: 'Apna Bana Le', artist: 'Sachin-Jigar, Arijit', album: 'Bhediya', cover: 'https://c.saavncdn.com/815/Bhediya-Hindi-2022-20221208151046-500x500.jpg', duration: 261 },
      { id: 'chart-10', rank: 10, rankChange: '+2', title: 'Vaaroon Forever', artist: 'Various Artists', album: 'Vaaroon Forever', cover: 'https://c.saavncdn.com/500/Vaaroon-Forever-Hindi-2024-20240715151046-500x500.jpg', duration: 252 },
      { id: 'chart-11', rank: 11, rankChange: '—', title: 'Husn', artist: 'Anuv Jain', album: 'Husn', cover: 'https://c.saavncdn.com/500/Husn-Hindi-2023-20231201043224-500x500.jpg', duration: 306 },
      { id: 'chart-12', rank: 12, rankChange: '+1', title: 'Arz Kiya Hai', artist: 'Anuv Jain', album: 'Coke Studio Bharat', cover: 'https://c.saavncdn.com/500/Arz-Kiya-Hai-Hindi-2024-20240618151046-500x500.jpg', duration: 245 }
    ];
    this.queue = [];
    this.currentTrack = null;
    this.currentTrackIndex = -1;
    this.isPlaying = false;
    this.isMuted = false;
    this.previousVolume = 0.75;

    // 3-Tier Queue & Autoplay Engine Architecture
    this.manualQueue = [];
    this.sequenceQueue = [];
    this.sequenceIndex = -1;
    this.recommendationQueue = [];
    this.playbackContext = null;

    // Persistent Playback State
    this.autoplayEnabled = this.loadLocalStorage('rea_autoplay_enabled', true);
    this.repeatMode = this.loadLocalStorage('rea_repeat_mode', 'off'); // 'off' | 'one' | 'all'
    this.isShuffle = this.loadLocalStorage('rea_shuffle', false);
    this.recentlyPlayedIds = this.loadLocalStorage('rea_recently_played_ids', []);
    this.dismissedTrackIds = new Set(this.loadLocalStorage('rea_dismissed_ids', []));

    // Concurrency, transition locks & error bounding
    this.isTransitioning = false;
    this.playbackRetryCount = 0;
    this.recommendationCache = new Map();
    this.isPrefetchingRecommendations = false;

    // Wire audio error recovery & autoplay gesture protection
    this.engine.onError = (err, track) => {
      this.handlePlaybackError(err, track);
    };
    this.engine.onAutoplayBlocked = (err, track) => {
      this.isPlaying = false;
      this.updatePlayPauseUI();
    };

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
    this.currentTheme = 'spatial';

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

    // Popular Indian Singers / Artists for Search Hub
    this.popularSingers = [
      { id: '459320', name: 'Arijit Singh', role: 'Singer', image: 'https://c.saavncdn.com/artists/Arijit_Singh_004_20241118063717_150x150.jpg' },
      { id: '468245', name: 'Diljit Dosanjh', role: 'Singer', image: 'https://c.saavncdn.com/artists/Diljit_Dosanjh_005_20231025073054_150x150.jpg' },
      { id: '455130', name: 'Shreya Ghoshal', role: 'Singer', image: 'https://c.saavncdn.com/artists/Shreya_Ghoshal_007_20241101074144_150x150.jpg' },
      { id: '697691', name: 'Karan Aujla', role: 'Singer', image: 'https://c.saavncdn.com/artists/Karan_Aujla_005_20260925061936_150x150.jpg' },
      { id: '689580', name: 'Sid Sriram', role: 'Singer', image: 'https://c.saavncdn.com/artists/Sid_Sriram_005_20240425180600_150x150.jpg' },
      { id: '455663', name: 'Anirudh Ravichander', role: 'Composer/Singer', image: 'https://c.saavncdn.com/artists/Anirudh_Ravichander_003_20260121134149_150x150.jpg' },
      { id: '455125', name: 'Sonu Nigam', role: 'Singer', image: 'https://c.saavncdn.com/artists/Sonu_Nigam_003_20260813182013_150x150.jpg' },
      { id: '464932', name: 'Neha Kakkar', role: 'Singer', image: 'https://c.saavncdn.com/artists/Neha_Kakkar_007_20241212115832_150x150.jpg' },
      { id: '456863', name: 'Badshah', role: 'Rapper/Singer', image: 'https://c.saavncdn.com/artists/Badshah_006_20241118064015_150x150.jpg' },
      { id: '681966', name: 'AP Dhillon', role: 'Singer', image: 'https://c.saavncdn.com/artists/AP_Dhillon_004_20251023102150_150x150.jpg' }
    ];
    this.searchSeq = 0;
    this.inFlightSearches = new Map();
    this.searchCategory = 'all'; // 'all' | 'music' | 'singers'
    this.currentSearchArtists = [];
    this.currentSearchSongs = [];
    this.currentSearchAlbums = [];
    this.clientSearchCache = new Map();
    this.clientArtistCache = new Map();
    this.clientSongCache = new Map();
    this.clientAlbumCache = new Map();
    this.lastSearchQuery = '';
    this.currentUnifiedFilter = 'all';
    this.currentArtistSongs = [];
    this.currentArtistAlbums = [];
    this.currentArtistId = null;
    this.currentArtistName = null;
    this.currentSongDetail = null;
    this.currentSongId = null;
    this.currentAlbumSongs = [];
    this.currentAlbumId = null;
    this.currentRelatedSongs = [];
    this.searchAbortController = null;

    this.initDOMElements();
    this.initTheme();
    this.initOfflineStorage();
    this.initCapacitorListeners();
    this.bindEvents();
    this.startVisualizer();
    this.renderAll();
    this.loadIndianMusicCatalog();
    this.loadRecommendations();
    this.loadExploreCatalog();
    this.initRouter();
    this.initServiceWorker();
    this.initPwaInstall();

    if (this.homeReleasesNextBtn && this.homeReleasesCarousel) {
      this.homeReleasesNextBtn.addEventListener('click', () => {
        this.homeReleasesCarousel.scrollBy({ left: 360, behavior: 'smooth' });
      });
    }
  

    this.lastActiveLyricIndex = -1;

    // Atmospheric pointer parallax on desktop (only active on spatial theme)
    window.spatialBgParallaxAttached = true;
    const bgImage = document.getElementById('spatialBgImage');
    if (bgImage && window.matchMedia('(min-width: 769px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let rafId = null;
      window.addEventListener('mousemove', (e) => {
        if (this.currentTheme !== 'spatial') return;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const xNorm = (e.clientX / window.innerWidth) - 0.5;
          const yNorm = (e.clientY / window.innerHeight) - 0.5;
          const moveX = xNorm * -10;
          const moveY = yNorm * -8;
          bgImage.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
      }, { passive: true });
    }
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
    // Default to Simple Black ('dark') for new users
    const validTheme = savedTheme === 'white' ? 'white' : 'dark';
    this.setTheme(validTheme, false);
  }

  initCapacitorListeners() {
    if (typeof window === 'undefined' || !window.Capacitor) return;

    if (window.Capacitor.Plugins && window.Capacitor.Plugins.MusicService) {
      try {
        window.Capacitor.Plugins.MusicService.addListener('onMediaAction', (data) => {
          if (!data || !data.action) return;
          const act = data.action;
          if (act.includes('ACTION_PLAY')) {
            if (!this.isPlaying) {
              this.engine.resume();
              this.isPlaying = true;
              this.updatePlayPauseUI();
            }
          } else if (act.includes('ACTION_PAUSE')) {
            if (this.isPlaying) {
              this.engine.pause();
              this.isPlaying = false;
              this.updatePlayPauseUI();
            }
          } else if (act.includes('ACTION_NEXT')) {
            this.nextTrack();
          } else if (act.includes('ACTION_PREVIOUS')) {
            this.prevTrack();
          }
        });
      } catch (e) {
        console.warn('Capacitor MusicService listener notice:', e);
      }
    }

    if (window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
      try {
        window.Capacitor.Plugins.App.addListener('backButton', () => {
          if (document.body.classList.contains('theater-active')) {
            this.closeTheaterMode();
          } else if (this.currentView !== 'home') {
            this.switchView('home');
          } else {
            window.Capacitor.Plugins.App.minimizeApp();
          }
        });
      } catch (e) {
        console.warn('Capacitor App backButton notice:', e);
      }
    }
  }

  syncMediaControls() {
    const track = this.currentTrack || (this.currentTrackIndex >= 0 && this.queue[this.currentTrackIndex] ? this.queue[this.currentTrackIndex] : null);
    if (!track) {
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.metadata = null;
          navigator.mediaSession.playbackState = 'none';
        } catch (_) {}
      }
      return;
    }

    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: track.album || 'REA Music',
          artwork: [
            { src: track.cover || 'assets/logo.jpg', sizes: '500x500', type: 'image/jpeg' }
          ]
        });
        navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';

        navigator.mediaSession.setActionHandler('play', () => {
          if (!this.isPlaying) this.togglePlayPause();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          if (this.isPlaying) this.togglePlayPause();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => this.prevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack());
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime) this.engine.seek(details.seekTime);
        });
      } catch (e) {
        console.warn('MediaSession sync notice:', e);
      }
    }

    if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.MusicService) {
      try {
        window.Capacitor.Plugins.MusicService.updateState({
          title: track.title,
          artist: track.artist,
          album: track.album || 'REA Music',
          coverUrl: track.cover || '',
          isPlaying: this.isPlaying
        });
      } catch (e) {
        console.warn('Capacitor MusicService updateState notice:', e);
      }
    }
  }

  initServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then((reg) => {
            console.log('[REA PWA] Service Worker registered with scope:', reg.scope);
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[REA PWA] App update ready.');
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn('[REA PWA] Service Worker registration failed:', err);
          });
      });
    }
  }

  initPwaInstall() {
    this.deferredInstallPrompt = null;
    const installBtn = document.getElementById('installPwaBtn');
    const installBtnText = document.getElementById('installBtnText');
    const installDesc = document.getElementById('installStatusDesc');

    // Check if already running in standalone PWA mode
    const isStandalone = (typeof window !== 'undefined') && (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );

    if (isStandalone) {
      if (installBtnText) installBtnText.textContent = 'Installed ✓';
      if (installBtn) {
        installBtn.style.opacity = '0.75';
        installBtn.style.cursor = 'default';
      }
      if (installDesc) installDesc.textContent = 'REA Music is installed and running as a standalone app on your device.';
    }

    // Capture beforeinstallprompt event from browser
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      console.log('[REA PWA] beforeinstallprompt event captured');
      if (installBtnText && !isStandalone) installBtnText.textContent = 'Install App';
      if (installDesc && !isStandalone) installDesc.textContent = 'Install REA Music natively for fullscreen lossless playback and offline caching.';
    });

    // Handle install button click
    if (installBtn) {
      installBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.deferredInstallPrompt) {
          try {
            await this.deferredInstallPrompt.prompt();
            const choiceResult = await this.deferredInstallPrompt.userChoice;
            console.log('[REA PWA] User installation choice:', choiceResult);
            if (choiceResult && choiceResult.outcome === 'accepted') {
              this.showToast('Installing REA Music...');
              if (installBtnText) installBtnText.textContent = 'Installed ✓';
            }
            this.deferredInstallPrompt = null;
          } catch (err) {
            console.warn('[REA PWA] Install error:', err);
          }
        } else {
          // If already running standalone
          if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            this.showToast('REA Music is already installed on your device!');
            return;
          }

          // Browser guidance fallback for Android Chrome & iOS Safari
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          if (isIOS) {
            this.showToast('To install: Tap the Share button [↑] at the bottom of Safari, then choose "Add to Home Screen"');
          } else {
            this.showToast('To install: Tap the Chrome menu (⋮) at top right and choose "Install app"');
          }
        }
      });
    }

    // Handle appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('[REA PWA] REA Music app installed successfully');
      this.deferredInstallPrompt = null;
      if (installBtnText) installBtnText.textContent = 'Installed ✓';
      if (installDesc) installDesc.textContent = 'REA Music is installed on your device!';
      this.showToast('🎉 REA Music installed successfully!');
    });
  }

  setTheme(themeName, showToastFeedback = true) {
    const targetTheme = (themeName === 'white' || themeName === 'spatial') ? themeName : 'dark';
    this.currentTheme = targetTheme;
    document.body.classList.remove('theme-white', 'theme-dark', 'theme-spatial', 'theme-lilac', 'theme-peach');
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
      const label = targetTheme === 'dark' ? 'Simple Black (Dark Mode)' : 'White UI (Light Mode)';
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
    this.viewSearch = document.getElementById('viewSearch');
    this.viewArtist = document.getElementById('viewArtist');
    this.viewSong = document.getElementById('viewSong');
    this.viewAlbum = document.getElementById('viewAlbum');

    // Unified Search View Elements
    this.searchBackBtn = document.getElementById('searchBackBtn');
    this.searchBreadcrumbQuery = document.getElementById('searchBreadcrumbQuery');
    this.searchPageTitle = document.getElementById('searchPageTitle');
    this.searchCategoryPills = document.getElementById('searchCategoryPills');
    this.searchSkeleton = document.getElementById('searchSkeleton');
    this.searchErrorState = document.getElementById('searchErrorState');
    this.searchErrorMessage = document.getElementById('searchErrorMessage');
    this.searchRetryBtn = document.getElementById('searchRetryBtn');
    this.searchEmptyState = document.getElementById('searchEmptyState');
    this.searchEmptyMessage = document.getElementById('searchEmptyMessage');
    this.searchResultsContent = document.getElementById('searchResultsContent');
    this.searchTopResultSection = document.getElementById('searchTopResultSection');
    this.searchTopResultCard = document.getElementById('searchTopResultCard');
    this.searchSongsSection = document.getElementById('searchSongsSection');
    this.searchSongsTitle = document.getElementById('searchSongsTitle');
    this.searchSongsGrid = document.getElementById('searchSongsGrid');
    this.searchArtistsSection = document.getElementById('searchArtistsSection');
    this.searchArtistsTitle = document.getElementById('searchArtistsTitle');
    this.searchArtistsGrid = document.getElementById('searchArtistsGrid');
    this.searchAlbumsSection = document.getElementById('searchAlbumsSection');
    this.searchAlbumsTitle = document.getElementById('searchAlbumsTitle');
    this.searchAlbumsGrid = document.getElementById('searchAlbumsGrid');

    // Dedicated Artist View Elements
    this.artistBackBtn = document.getElementById('artistBackBtn');
    this.artistSkeleton = document.getElementById('artistSkeleton');
    this.artistErrorState = document.getElementById('artistErrorState');
    this.artistErrorMessage = document.getElementById('artistErrorMessage');
    this.artistRetryBtn = document.getElementById('artistRetryBtn');
    this.artistContent = document.getElementById('artistContent');
    this.artistHeroAvatar = document.getElementById('artistHeroAvatar');
    this.artistHeroName = document.getElementById('artistHeroName');
    this.artistHeroMeta = document.getElementById('artistHeroMeta');
    this.artistHeroBio = document.getElementById('artistHeroBio');
    this.artistPlayAllBtn = document.getElementById('artistPlayAllBtn');
    this.artistShuffleBtn = document.getElementById('artistShuffleBtn');
    this.artistPopularSection = document.getElementById('artistPopularSection');
    this.artistTopSongsList = document.getElementById('artistTopSongsList');
    this.artistAlbumsSection = document.getElementById('artistAlbumsSection');
    this.artistAlbumsGrid = document.getElementById('artistAlbumsGrid');
    this.artistSimilarSection = document.getElementById('artistSimilarSection');
    this.artistSimilarGrid = document.getElementById('artistSimilarGrid');

    // Dedicated Song View Elements
    this.songBackBtn = document.getElementById('songBackBtn');
    this.songSkeleton = document.getElementById('songSkeleton');
    this.songErrorState = document.getElementById('songErrorState');
    this.songErrorMessage = document.getElementById('songErrorMessage');
    this.songRetryBtn = document.getElementById('songRetryBtn');
    this.songContent = document.getElementById('songContent');
    this.songHeroCover = document.getElementById('songHeroCover');
    this.songHeroTitle = document.getElementById('songHeroTitle');
    this.songHeroArtistRow = document.getElementById('songHeroArtistRow');
    this.songHeroArtistLink = document.getElementById('songHeroArtistLink');
    this.songHeroAlbumRow = document.getElementById('songHeroAlbumRow');
    this.songHeroAlbumLink = document.getElementById('songHeroAlbumLink');
    this.songHeroYear = document.getElementById('songHeroYear');
    this.songHeroDuration = document.getElementById('songHeroDuration');
    this.songPlayHeroBtn = document.getElementById('songPlayHeroBtn');
    this.songQueueNextBtn = document.getElementById('songQueueNextBtn');
    this.songHeroDownloadBtn = document.getElementById('songHeroDownloadBtn');
    this.songRelatedSection = document.getElementById('songRelatedSection');
    this.songRelatedTracksList = document.getElementById('songRelatedTracksList');

    // Dedicated Album View Elements
    this.albumBackBtn = document.getElementById('albumBackBtn');
    this.albumSkeleton = document.getElementById('albumSkeleton');
    this.albumErrorState = document.getElementById('albumErrorState');
    this.albumErrorMessage = document.getElementById('albumErrorMessage');
    this.albumRetryBtn = document.getElementById('albumRetryBtn');
    this.albumContent = document.getElementById('albumContent');
    this.albumHeroCover = document.getElementById('albumHeroCover');
    this.albumHeroTitle = document.getElementById('albumHeroTitle');
    this.albumHeroArtistRow = document.getElementById('albumHeroArtistRow');
    this.albumHeroArtistLink = document.getElementById('albumHeroArtistLink');
    this.albumHeroStats = document.getElementById('albumHeroStats');
    this.albumHeroYear = document.getElementById('albumHeroYear');
    this.albumHeroTrackCount = document.getElementById('albumHeroTrackCount');
    this.albumPlayAllBtn = document.getElementById('albumPlayAllBtn');
    this.albumShuffleBtn = document.getElementById('albumShuffleBtn');
    this.albumTracksSection = document.getElementById('albumTracksSection');
    this.albumTracksList = document.getElementById('albumTracksList');

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
    this.searchSingersSection = document.getElementById('searchSingersSection');
    this.searchSingersGrid = document.getElementById('searchSingersGrid');
    this.searchTabsNav = document.getElementById('searchTabsNav');
    this.featuredSingerCard = document.getElementById('featuredSingerCard');
    this.searchArtistsList = document.getElementById('searchArtistsList');
    this.trendingTagsGrid = document.getElementById('trendingTagsGrid');
    this.searchRecoList = document.getElementById('searchRecoList');
    this.searchResultsList = document.getElementById('searchResultsList');

    // Home Recommended Shelf Elements
    this.recommendedShelf = document.getElementById('recommendedShelf');
    this.recommendedCarousel = document.getElementById('recommendedCarousel');
    this.recommendedPrevBtn = document.getElementById('recommendedPrevBtn');
    this.recommendedNextBtn = document.getElementById('recommendedNextBtn');

    // Personalized Adaptive Shelves & Discovery Shelves
    this.personalizedShelf = document.getElementById('personalizedShelf');
    this.personalizedCarousel = document.getElementById('personalizedCarousel');
    this.personalizedTitle = document.getElementById('personalizedTitle');
    this.personalizedEyebrow = document.getElementById('personalizedEyebrow');
    this.personalizedPrevBtn = document.getElementById('personalizedPrevBtn');
    this.personalizedNextBtn = document.getElementById('personalizedNextBtn');

    this.jumpBackInShelf = document.getElementById('jumpBackInShelf');
    this.jumpBackInCarousel = document.getElementById('jumpBackInCarousel');

    this.haryanviShelf = document.getElementById('haryanviShelf');
    this.haryanviCarousel = document.getElementById('haryanviCarousel');
    this.haryanviPrevBtn = document.getElementById('haryanviPrevBtn');
    this.haryanviNextBtn = document.getElementById('haryanviNextBtn');

    this.bollywoodShelf = document.getElementById('bollywoodShelf');
    this.bollywoodCarousel = document.getElementById('bollywoodCarousel');
    this.bollywoodPrevBtn = document.getElementById('bollywoodPrevBtn');
    this.bollywoodNextBtn = document.getElementById('bollywoodNextBtn');

    this.indieShelf = document.getElementById('indieShelf');
    this.indieCarousel = document.getElementById('indieCarousel');
    this.indiePrevBtn = document.getElementById('indiePrevBtn');
    this.indieNextBtn = document.getElementById('indieNextBtn');

    this.discoverArtistsShelf = document.getElementById('discoverArtistsShelf');
    this.discoverArtistsGrid = document.getElementById('discoverArtistsGrid');

    // Track Options Contextual Modal
    this.trackOptionsBackdrop = document.getElementById('trackOptionsBackdrop');
    this.trackOptionsMenu = document.getElementById('trackOptionsMenu');
    this.trackOptionsThumb = document.getElementById('trackOptionsThumb');
    this.trackOptionsTitle = document.getElementById('trackOptionsTitle');
    this.trackOptionsArtist = document.getElementById('trackOptionsArtist');
    this.trackOptionsCloseBtn = document.getElementById('trackOptionsCloseBtn');
    this.optPlayNext = document.getElementById('optPlayNext');
    this.optAddQueue = document.getElementById('optAddQueue');
    this.optMoreLikeThis = document.getElementById('optMoreLikeThis');
    this.optToggleLike = document.getElementById('optToggleLike');
    this.optToggleLikeLabel = document.getElementById('optToggleLikeLabel');
    this.optNotInterested = document.getElementById('optNotInterested');
    this.optShowLessArtist = document.getElementById('optShowLessArtist');
    this.optShowLessArtistLabel = document.getElementById('optShowLessArtistLabel');
    this.optViewArtist = document.getElementById('optViewArtist');

    // Taste Profile in Settings
    this.tasteConfidenceValue = document.getElementById('tasteConfidenceValue');
    this.tasteConfidenceFill = document.getElementById('tasteConfidenceFill');
    this.tasteConfidenceDesc = document.getElementById('tasteConfidenceDesc');
    this.tasteStatPlays = document.getElementById('tasteStatPlays');
    this.tasteStatCompletions = document.getElementById('tasteStatCompletions');
    this.tasteStatArtists = document.getElementById('tasteStatArtists');
    this.clearListeningHistoryBtn = document.getElementById('clearListeningHistoryBtn');
    this.resetRecommendationsBtn = document.getElementById('resetRecommendationsBtn');

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
    // Spatial Hero Elements
    this.homeReleasesCarousel = document.getElementById('homeReleasesCarousel');
    this.homeChartsGrid = document.getElementById('homeChartsGrid');
    this.homeReleasesPrevBtn = document.getElementById('homeReleasesPrevBtn');
    this.homeReleasesNextBtn = document.getElementById('homeReleasesNextBtn');
    this.playAllHomeChartsBtn = document.getElementById('playAllHomeChartsBtn');
    this.spatialBgImage = document.getElementById('spatialBgImage');

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
    this.playerEmptyLabel = document.getElementById('playerEmptyLabel');
    this.playerEmptyContainer = document.getElementById('playerEmptyContainer');
    this.playerMeta = document.getElementById('playerMeta');
    this.playerActions = document.getElementById('playerActions');
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
    this.maxQueueContent = document.getElementById('maxQueueContent');
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
    this.maxQueueShortcutBtn = document.getElementById('maxQueueShortcutBtn');
    this.maxMoreBtn = document.getElementById('maxMoreBtn');
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

    // 3-Tier Queue & Autoplay Controls
    this.barAutoplayBtn = document.getElementById('barAutoplayBtn');
    this.songAddToQueueBtn = document.getElementById('songAddToQueueBtn');

    // Right Drawer 3-Tier Queue Elements
    this.queueNowPlayingCard = document.getElementById('queueNowPlayingCard');
    this.queueManualCount = document.getElementById('queueManualCount');
    this.clearManualQueueBtn = document.getElementById('clearManualQueueBtn');
    this.queueManualList = document.getElementById('queueManualList');
    this.queueAutoplayToggle = document.getElementById('queueAutoplayToggle');
    this.queueAutoplaySource = document.getElementById('queueAutoplaySource');
    this.refreshRecommendationsBtn = document.getElementById('refreshRecommendationsBtn');
    this.queueRecommendedList = document.getElementById('queueRecommendedList');

    // Maximized Player 3-Tier Queue Elements
    this.maxQueueNowPlayingCard = document.getElementById('maxQueueNowPlayingCard');
    this.maxQueueManualCount = document.getElementById('maxQueueManualCount');
    this.maxClearManualQueueBtn = document.getElementById('maxClearManualQueueBtn');
    this.maxQueueManualList = document.getElementById('maxQueueManualList');
    this.maxAutoplayToggle = document.getElementById('maxAutoplayToggle');
    this.maxRefreshRecommendationsBtn = document.getElementById('maxRefreshRecommendationsBtn');
    this.maxQueueRecommendedList = document.getElementById('maxQueueRecommendedList');

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
        if (this.listeningHistoryService) {
          this.listeningHistoryService.clearHistory();
        }
        this.renderHistory();
        this.updateTasteProfileUI();
        if (this.homeFeedService) {
          this.homeFeedService.renderAdaptiveFeed();
        }
        this.showToast('Listening history cleared');
      });
    }

    if (this.clearListeningHistoryBtn) {
      this.clearListeningHistoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.history = [];
        this.saveLocalStorage('rea_history', []);
        if (this.listeningHistoryService) {
          this.listeningHistoryService.clearHistory();
        }
        this.renderHistory();
        this.updateTasteProfileUI();
        if (this.homeFeedService) {
          this.homeFeedService.renderAdaptiveFeed();
        }
        this.showToast('Listening history cleared');
      });
    }

    if (this.resetRecommendationsBtn) {
      this.resetRecommendationsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.userPreferenceService) {
          this.userPreferenceService.resetPreferences();
        }
        this.updateTasteProfileUI();
        if (this.homeFeedService) {
          this.homeFeedService.renderAdaptiveFeed();
        }
        this.showToast('Music recommendations & taste profile reset');
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
          if (view === 'search' || btn.id === 'mobileTabSearch') {
            const mainContent = document.getElementById('mainContent');
            if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
            try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) {}
            if (this.searchInput) {
              this.searchInput.focus();
              this.showSearchDropdown();
            }
            if (this.mobileTabBtns) {
              this.mobileTabBtns.forEach(b => b.classList.toggle('active', b === btn));
            }
          } else if (view) {
            this.switchView(view);
          }
        });
      });
    }

    // 2. Playback controls
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        this.togglePlayPause();
      });
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        this.prevTrack();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        this.advanceTrack('manual');
      });
    }

    if (this.repeatBtn) {
      this.repeatBtn.addEventListener('click', () => this.cycleRepeatMode());
    }

    if (this.shuffleBtn) {
      this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
    }

    if (this.barAutoplayBtn) {
      this.barAutoplayBtn.addEventListener('click', () => this.toggleAutoplay());
    }

    // 3. Audio element listeners
    this.engine.audio.addEventListener('timeupdate', () => {
      const cur = this.engine.audio.currentTime || 0;
      const dur = this.engine.audio.duration || this.queue[this.currentTrackIndex]?.duration || 1;
      this.updateProgressBar(cur, dur);
      this.updateSyncedLyrics(cur);
      if (this.listeningHistoryService) {
        this.listeningHistoryService.updateActiveSession(cur, dur);
      }
    });

    this.engine.audio.addEventListener('ended', () => {
      if (this.listeningHistoryService && this.currentTrack) {
        this.listeningHistoryService.onTrackCompleted(this.currentTrack);
      }
      this.advanceTrack('auto');
    });

    this.engine.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayPauseUI();
      this.updateShelvesPlayingState();
      if (typeof this.startVisualizerLoop === 'function') {
        this.startVisualizerLoop();
      }
    });

    this.engine.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayPauseUI();
      this.updateShelvesPlayingState();
      if (typeof this.stopVisualizerLoop === 'function') {
        this.stopVisualizerLoop();
      }
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

    // 7. Search input with History, Singers, Trending & Recommendations
    if (this.searchInput) {
      this.searchInput.addEventListener('focus', () => {
        if (this.searchDropdown) this.searchDropdown.classList.remove('hidden');
        if (!this.searchInput.value.trim()) {
          if (this.searchHubContent) this.searchHubContent.classList.remove('hidden');
          if (this.searchResultsList) this.searchResultsList.classList.add('hidden');
          if (this.searchTabsNav) this.searchTabsNav.classList.add('hidden');
          if (this.featuredSingerCard) this.featuredSingerCard.classList.add('hidden');
          if (this.searchArtistsList) this.searchArtistsList.classList.add('hidden');
          this.renderSearchHub();
        }
      });

      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchDebounceTimer);
        const query = e.target.value;
        const clean = query.trim();

        if (!clean) {
          if (this.searchAbortController) {
            try { this.searchAbortController.abort(); } catch (err) {}
          }
          this.searchSeq++;
          if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
          if (this.searchResultsList) this.searchResultsList.classList.add('hidden');
          if (this.searchTabsNav) this.searchTabsNav.classList.add('hidden');
          if (this.featuredSingerCard) this.featuredSingerCard.classList.add('hidden');
          if (this.searchArtistsList) this.searchArtistsList.classList.add('hidden');
          if (this.searchHubContent) this.searchHubContent.classList.remove('hidden');
          this.setSearchCategory('all');
          this.renderSearchHub();
          return;
        }

        if (this.searchClearBtn) this.searchClearBtn.classList.remove('hidden');
        if (this.searchDropdown) this.searchDropdown.classList.remove('hidden');
        if (this.searchHubContent) this.searchHubContent.classList.add('hidden');
        if (this.searchTabsNav) this.searchTabsNav.classList.remove('hidden');

        const cacheKey = clean.toLowerCase();
        // 1. Instant display if already cached (0ms response)
        if (this.clientSearchCache && this.clientSearchCache.has(cacheKey)) {
          const cached = this.clientSearchCache.get(cacheKey);
          this.renderSearchResults(cached.results, cached.artists, clean);
          // If cached over 90s, refresh in background without clearing
          if (Date.now() - (cached.timestamp || 0) > 90000) {
            this.performLiveSearch(clean, false);
          }
          return;
        }

        // 2. Instant local preview from memory (0ms visual feedback)
        this.showInstantSearchPreview(clean);

        // 3. Responsive 120ms debounce for remote search
        this.searchDebounceTimer = setTimeout(() => {
          this.performLiveSearch(clean);
        }, 120);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(this.searchDebounceTimer);
          const query = this.searchInput.value.trim();
          if (query) {
            this.addSearchHistory(query);
            this.openSearchView(query);
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
        if (this.searchTabsNav) this.searchTabsNav.classList.add('hidden');
        if (this.featuredSingerCard) this.featuredSingerCard.classList.add('hidden');
        if (this.searchArtistsList) this.searchArtistsList.classList.add('hidden');
        this.setSearchCategory('all');
        this.renderSearchHub();
      });
    }

    // Category Tabs (All / Music / Singers)
    document.querySelectorAll('.search-tab-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.searchTab || 'all';
        this.setSearchCategory(cat);
      });
    });

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
        if (this.queuePanel) {
          const willOpen = this.queuePanel.classList.contains('hidden');
          this.queuePanel.classList.toggle('hidden');
          if (willOpen) this.renderQueue();
        }
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
        this.clearManualQueue();
      });
    }

    if (this.clearManualQueueBtn) {
      this.clearManualQueueBtn.addEventListener('click', () => this.clearManualQueue());
    }
    if (this.maxClearManualQueueBtn) {
      this.maxClearManualQueueBtn.addEventListener('click', () => this.clearManualQueue());
    }

    if (this.queueAutoplayToggle) {
      this.queueAutoplayToggle.addEventListener('change', (e) => this.setAutoplay(e.target.checked));
    }
    if (this.maxAutoplayToggle) {
      this.maxAutoplayToggle.addEventListener('change', (e) => this.setAutoplay(e.target.checked));
    }

    if (this.refreshRecommendationsBtn) {
      this.refreshRecommendationsBtn.addEventListener('click', () => this.refreshRecommendations());
    }
    if (this.maxRefreshRecommendationsBtn) {
      this.maxRefreshRecommendationsBtn.addEventListener('click', () => this.refreshRecommendations());
    }

    // Allow mouse-wheel scrolling over the maximized queue header to scroll the queue content
    if (this.maxQueuePane) {
      const maxQueueHeader = this.maxQueuePane.querySelector('.max-pane-header');
      if (maxQueueHeader) {
        maxQueueHeader.addEventListener('wheel', (e) => {
          if (this.maxQueueContent) {
            this.maxQueueContent.scrollBy({
              top: e.deltaY,
              behavior: 'auto'
            });
          }
        }, { passive: true });
      }
    }

    // Unified Queue Interaction Delegation (Drawer + Maximized Player)
    [this.queuePanel, this.maxQueuePane].forEach(container => {
      if (!container) return;
      container.addEventListener('click', (e) => {
        // 1. Move Up in manual queue
        const moveUpBtn = e.target.closest('.queue-move-up');
        if (moveUpBtn) {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(moveUpBtn.dataset.idx, 10);
          this.moveManualQueueItem(idx, idx - 1);
          return;
        }

        // 2. Move Down in manual queue
        const moveDownBtn = e.target.closest('.queue-move-down');
        if (moveDownBtn) {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(moveDownBtn.dataset.idx, 10);
          this.moveManualQueueItem(idx, idx + 1);
          return;
        }

        // 3. Remove from manual queue
        const removeBtn = e.target.closest('.queue-remove-manual-btn');
        if (removeBtn) {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(removeBtn.dataset.idx, 10);
          this.removeFromManualQueue(idx);
          return;
        }

        // 4. Play recommendation immediately
        const playRecoBtn = e.target.closest('.queue-play-reco-btn');
        if (playRecoBtn) {
          e.preventDefault();
          e.stopPropagation();
          const track = this.findTrackById(playRecoBtn.dataset.id);
          if (track) this.playRecommendation(track);
          return;
        }

        // 5. Add recommendation to manual queue
        const addRecoBtn = e.target.closest('.queue-add-manual-btn');
        if (addRecoBtn) {
          e.preventDefault();
          e.stopPropagation();
          const track = this.findTrackById(addRecoBtn.dataset.id);
          if (track) this.addRecommendationToQueue(track);
          return;
        }

        // 6. Dismiss recommendation (Not interested)
        const dismissBtn = e.target.closest('.queue-dismiss-reco-btn');
        if (dismissBtn) {
          e.preventDefault();
          e.stopPropagation();
          this.dismissRecommendation(dismissBtn.dataset.id);
          return;
        }

        // 7. Enable Autoplay button inside empty state
        const enableAutoplayBtn = e.target.closest('.queue-enable-autoplay-btn');
        if (enableAutoplayBtn) {
          e.preventDefault();
          e.stopPropagation();
          this.setAutoplay(true);
          return;
        }

        // 8. Refresh recommendations button inside empty state
        const refreshRecoBtn = e.target.closest('.queue-refresh-trigger-btn');
        if (refreshRecoBtn) {
          e.preventDefault();
          e.stopPropagation();
          this.refreshRecommendations();
          return;
        }

        // 9. Click manual queue item body
        const manualItem = e.target.closest('.queue-item[data-manual-idx]');
        if (manualItem && !e.target.closest('button, .queue-item-actions')) {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(manualItem.dataset.manualIdx, 10);
          if (this.manualQueue[idx]) {
            const track = this.manualQueue.splice(idx, 1)[0];
            this.playActualTrack(track, { type: 'manual_selection' });
          }
          return;
        }

        // 10. Click recommendation item body
        const recoItem = e.target.closest('.queue-item[data-reco-id]');
        if (recoItem && !e.target.closest('button, .queue-item-actions')) {
          e.preventDefault();
          e.stopPropagation();
          const track = this.findTrackById(recoItem.dataset.recoId);
          if (track) this.playRecommendation(track);
          return;
        }
      });
    });

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
    if (this.playAllHomeChartsBtn) {
      this.playAllHomeChartsBtn.addEventListener('click', () => {
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

    // Personalized & Regional Carousel Arrows
    const setupCarouselArrows = (prevBtn, nextBtn, carousel) => {
      if (prevBtn && carousel) {
        prevBtn.addEventListener('click', () => { carousel.scrollBy({ left: -400, behavior: 'smooth' }); });
      }
      if (nextBtn && carousel) {
        nextBtn.addEventListener('click', () => { carousel.scrollBy({ left: 400, behavior: 'smooth' }); });
      }
    };

    setupCarouselArrows(this.personalizedPrevBtn, this.personalizedNextBtn, this.personalizedCarousel);
    setupCarouselArrows(this.haryanviPrevBtn, this.haryanviNextBtn, this.haryanviCarousel);
    setupCarouselArrows(this.bollywoodPrevBtn, this.bollywoodNextBtn, this.bollywoodCarousel);
    setupCarouselArrows(this.indiePrevBtn, this.indieNextBtn, this.indieCarousel);

    // Track Contextual Options Modal Listeners
    if (this.trackOptionsCloseBtn) {
      this.trackOptionsCloseBtn.addEventListener('click', () => this.closeTrackOptionsMenu());
    }
    if (this.trackOptionsBackdrop) {
      this.trackOptionsBackdrop.addEventListener('click', (e) => {
        if (e.target === this.trackOptionsBackdrop) this.closeTrackOptionsMenu();
      });
    }
    if (this.optPlayNext) {
      this.optPlayNext.addEventListener('click', () => {
        if (this.selectedMenuTrack) {
          this.manualQueue.unshift(this.selectedMenuTrack);
          this.showToast(`Playing next: "${this.selectedMenuTrack.title}"`);
          this.renderQueue();
        }
        this.closeTrackOptionsMenu();
      });
    }
    if (this.optAddQueue) {
      this.optAddQueue.addEventListener('click', () => {
        if (this.selectedMenuTrack) {
          this.manualQueue.push(this.selectedMenuTrack);
          this.showToast(`Added to queue: "${this.selectedMenuTrack.title}"`);
          this.renderQueue();
        }
        this.closeTrackOptionsMenu();
      });
    }
    if (this.optMoreLikeThis) {
      this.optMoreLikeThis.addEventListener('click', () => {
        if (this.selectedMenuTrack) {
          this.openMoreLikeThis(this.selectedMenuTrack);
        }
      });
    }
    if (this.optToggleLike) {
      this.optToggleLike.addEventListener('click', () => {
        if (this.selectedMenuTrack) {
          this.toggleLikeTrack(this.selectedMenuTrack);
        }
        this.closeTrackOptionsMenu();
      });
    }
    if (this.optNotInterested) {
      this.optNotInterested.addEventListener('click', () => {
        if (this.selectedMenuTrack) {
          const t = this.selectedMenuTrack;
          this.listeningHistoryService.onExplicitDislike(t);
          this.showToast(`Recommendation hidden: "${t.title}"`);
          this.closeTrackOptionsMenu();
          if (this.homeFeedService) {
            this.homeFeedService.renderAdaptiveFeed();
          }
        }
      });
    }
    if (this.optShowLessArtist) {
      this.optShowLessArtist.addEventListener('click', () => {
        if (this.selectedMenuTrack) {
          const artistName = (this.selectedMenuTrack.artist || '').split(/[,&]/)[0].trim();
          this.listeningHistoryService.onShowLessArtist(artistName);
          this.showToast(`Showing less from "${artistName}"`);
          this.closeTrackOptionsMenu();
          if (this.homeFeedService) {
            this.homeFeedService.renderAdaptiveFeed();
          }
        }
      });
    }
    if (this.optViewArtist) {
      this.optViewArtist.addEventListener('click', () => {
        if (this.selectedMenuTrack) {
          const track = this.selectedMenuTrack;
          const artistName = (track.artist || '').split(/[,&]/)[0].trim();
          this.closeTrackOptionsMenu();
          this.openArtistView(track.artistId || track.id, artistName);
        }
      });
    }

    // 19. Maximized / Minimized Player Listeners
    // A. Maximize triggers: clicking mini-player bar, thumbnail container, song title, or fullscreen button
    if (this.playerBar) {
      let touchStartY = 0;
      let touchStartX = 0;
      this.playerBar.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          touchStartY = e.touches[0].clientY;
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      this.playerBar.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          const deltaY = touchStartY - e.changedTouches[0].clientY;
          const deltaX = Math.abs(touchStartX - e.changedTouches[0].clientX);
          // If swiped up by > 25px
          if (deltaY > 25 && deltaY > deltaX) {
            this.maximizePlayer();
          }
        }
      }, { passive: true });

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
      this.fullscreenBtn.title = 'Expand player';
      this.fullscreenBtn.setAttribute('aria-label', 'Expand player');
      this.fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximizePlayer();
      });
    }

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
      document.addEventListener(evt, () => this.updateFullscreenWindowIcons());
    });

    // B. Minimize triggers: clicking down chevron button, iOS grab handle, or Escape key
    if (this.minimizePlayerBtn) {
      this.minimizePlayerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizePlayer();
      });
    }
    if (this.maxGrabHandle) {
      this.maxGrabHandle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizePlayer();
      });
    }

    document.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;
      if (e.code === 'Space' && !isInput) {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.key === 'Escape' && this.isPlayerMaximized) {
        this.minimizePlayer();
      } else if ((e.key === 'f' || e.key === 'F') && !isInput) {
        e.preventDefault();
        this.toggleMaximizePlayer();
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
      this.maxNextBtn.addEventListener('click', () => this.advanceTrack('manual'));
    }
    if (this.maxShuffleBtn) {
      this.maxShuffleBtn.addEventListener('click', () => {
        this.toggleShuffle();
        this.syncControlStates();
      });
    }
    if (this.maxRepeatBtn) {
      this.maxRepeatBtn.addEventListener('click', () => {
        this.cycleRepeatMode();
        this.syncControlStates();
      });
    }
    if (this.maxQueueShortcutBtn) {
      this.maxQueueShortcutBtn.addEventListener('click', () => {
        this.switchMaxTab(this.currentMaxTab === 'queue' ? 'song' : 'queue');
      });
    }
    if (this.maxMoreBtn) {
      this.maxMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const track = this.currentTrack || (this.queue && this.queue[this.currentTrackIndex]);
        if (track) this.handleDownloadButtonClick(track);
      });
    }
    if (this.maxLikeBtn) {
      this.maxLikeBtn.addEventListener('click', () => {
        const track = this.currentTrack || this.queue[this.currentTrackIndex];
        if (track) this.toggleLikeTrack(track);
      });
    }
    if (this.maxDislikeBtn) {
      this.maxDislikeBtn.addEventListener('click', () => {
        const track = this.currentTrack || this.queue[this.currentTrackIndex];
        if (track) {
          this.dismissRecommendation(track.id);
        }
        this.showToast('Skipped: Tuning recommendations');
        this.advanceTrack('manual');
      });
    }
    if (this.maxFullscreenToggleBtn) {
      this.maxFullscreenToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFullscreenWindow();
      });
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

    // G. Detail Views Back Buttons
    if (this.searchBackBtn) {
      this.searchBackBtn.addEventListener('click', () => {
        if (window.history.length > 1) window.history.back();
        else this.switchView('home');
      });
    }
    if (this.artistBackBtn) {
      this.artistBackBtn.addEventListener('click', () => {
        if (window.history.length > 1) window.history.back();
        else if (this.lastSearchQuery) this.openSearchView(this.lastSearchQuery);
        else this.switchView('home');
      });
    }
    if (this.songBackBtn) {
      this.songBackBtn.addEventListener('click', () => {
        if (window.history.length > 1) window.history.back();
        else if (this.lastSearchQuery) this.openSearchView(this.lastSearchQuery);
        else this.switchView('home');
      });
    }
    if (this.albumBackBtn) {
      this.albumBackBtn.addEventListener('click', () => {
        if (window.history.length > 1) window.history.back();
        else if (this.lastSearchQuery) this.openSearchView(this.lastSearchQuery);
        else this.switchView('home');
      });
    }

    // H. Retry buttons
    if (this.searchRetryBtn) {
      this.searchRetryBtn.addEventListener('click', () => {
        if (this.lastSearchQuery) this.openSearchView(this.lastSearchQuery, false);
      });
    }
    if (this.artistRetryBtn) {
      this.artistRetryBtn.addEventListener('click', () => {
        if (this.currentArtistId) this.openArtistView(this.currentArtistId, this.currentArtistName || '', false);
      });
    }
    if (this.songRetryBtn) {
      this.songRetryBtn.addEventListener('click', () => {
        if (this.currentSongId) this.openSongView(this.currentSongId, false);
      });
    }
    if (this.albumRetryBtn) {
      this.albumRetryBtn.addEventListener('click', () => {
        if (this.currentAlbumId) this.openAlbumView(this.currentAlbumId, false);
      });
    }

    // I. Search Category Filter Pills
    if (this.searchCategoryPills) {
      this.searchCategoryPills.querySelectorAll('.search-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const filter = pill.dataset.filter || 'all';
          this.searchCategoryPills.querySelectorAll('.search-pill').forEach(p => p.classList.toggle('active', p === pill));
          this.applyUnifiedSearchFilter(filter);
        });
      });
    }

    // J. Detail Action Buttons
    if (this.artistPlayAllBtn) {
      this.artistPlayAllBtn.addEventListener('click', () => {
        this.playTrackList(this.currentArtistSongs, false);
      });
    }
    if (this.artistShuffleBtn) {
      this.artistShuffleBtn.addEventListener('click', () => {
        this.playTrackList(this.currentArtistSongs, true);
      });
    }

    if (this.songPlayHeroBtn) {
      this.songPlayHeroBtn.addEventListener('click', () => {
        if (!this.currentSongDetail) return;
        const currentTrack = this.queue[this.currentTrackIndex];
        if (currentTrack && currentTrack.id === this.currentSongDetail.id) {
          this.togglePlayPause();
        } else {
          this.playTrackItem(this.currentSongDetail);
        }
      });
    }
    if (this.songQueueNextBtn) {
      this.songQueueNextBtn.addEventListener('click', () => {
        if (!this.currentSongDetail) return;
        this.addToPlayNext(this.currentSongDetail);
      });
    }
    if (this.songAddToQueueBtn) {
      this.songAddToQueueBtn.addEventListener('click', () => {
        if (!this.currentSongDetail) return;
        this.addToManualQueue(this.currentSongDetail);
      });
    }
    if (this.songHeroDownloadBtn) {
      this.songHeroDownloadBtn.addEventListener('click', () => {
        if (this.currentSongDetail) this.handleDownloadButtonClick(this.currentSongDetail);
      });
    }

    if (this.albumPlayAllBtn) {
      this.albumPlayAllBtn.addEventListener('click', () => {
        this.playTrackList(this.currentAlbumSongs, false);
      });
    }
    if (this.albumShuffleBtn) {
      this.albumShuffleBtn.addEventListener('click', () => {
        this.playTrackList(this.currentAlbumSongs, true);
      });
    }

    // K. Universal Click Delegation
    document.addEventListener('click', (e) => {
      // 1. Artist link click
      const artistLink = e.target.closest('.artist-link');
      if (artistLink) {
        e.preventDefault();
        e.stopPropagation();
        const artistId = artistLink.dataset.artistId;
        const artistName = artistLink.dataset.artistName || artistLink.textContent.trim();
        this.openArtistView(artistId || artistName, artistName);
        return;
      }

      // 2. Album link click
      const albumLink = e.target.closest('.album-link');
      if (albumLink) {
        e.preventDefault();
        e.stopPropagation();
        const albumId = albumLink.dataset.albumId;
        if (albumId) {
          this.openAlbumView(albumId);
          return;
        }
      }

      // 3. Song link click
      const songLink = e.target.closest('.song-link');
      if (songLink) {
        e.preventDefault();
        e.stopPropagation();
        const songId = songLink.dataset.songId;
        if (songId) {
          this.openSongView(songId);
          return;
        }
      }

      // 4. Click play button inside track row card, ranked row, or top result
      const playBtn = e.target.closest('.track-row-play-btn, .btn-top-play');
      if (playBtn) {
        e.preventDefault();
        e.stopPropagation();
        const card = playBtn.closest('[data-song-id], [data-artist-id], [data-album-id]');
        if (card) {
          if (card.dataset.songId) {
            const track = this.findTrackById(card.dataset.songId);
            if (track) {
              const currentId = this.currentTrack ? this.currentTrack.id : (this.queue[this.currentTrackIndex]?.id);
              if (currentId && String(currentId) === String(track.id)) {
                this.togglePlayPause();
              } else {
                this.playTrackItem(track);
              }
            }
          } else if (card.dataset.artistId || card.dataset.artistName) {
            this.loadSingerHits({ id: card.dataset.artistId, name: card.dataset.artistName });
          } else if (card.dataset.albumId) {
            this.openAlbumView(card.dataset.albumId);
          }
        }
        return;
      }

      // 5. Click view button on top result card
      const viewBtn = e.target.closest('.btn-top-view');
      if (viewBtn) {
        e.preventDefault();
        e.stopPropagation();
        const card = viewBtn.closest('.top-result-card');
        if (card) {
          if (card.dataset.artistId || card.dataset.artistName) {
            this.openArtistView(card.dataset.artistId || card.dataset.artistName, card.dataset.artistName || '');
          } else if (card.dataset.songId) {
            this.openSongView(card.dataset.songId);
          } else if (card.dataset.albumId) {
            this.openAlbumView(card.dataset.albumId);
          }
        }
        return;
      }

      // 6. Click top result card body (outside buttons/links)
      const topCard = e.target.closest('.top-result-card');
      if (topCard && !e.target.closest('button, .artist-link, .album-link, .song-link')) {
        if (topCard.dataset.artistId || topCard.dataset.artistName) {
          this.openArtistView(topCard.dataset.artistId || topCard.dataset.artistName, topCard.dataset.artistName || '');
        } else if (topCard.dataset.songId) {
          this.openSongView(topCard.dataset.songId);
        } else if (topCard.dataset.albumId) {
          this.openAlbumView(topCard.dataset.albumId);
        }
        return;
      }

      // 7. Click artist card
      const artistCard = e.target.closest('.artist-card');
      if (artistCard && !e.target.closest('button')) {
        const artistId = artistCard.dataset.artistId;
        const artistName = artistCard.dataset.artistName || artistCard.querySelector('.artist-card-name')?.textContent || '';
        this.openArtistView(artistId || artistName, artistName);
        return;
      }

      // 8. Click music-card with data-album-id
      const albumCard = e.target.closest('.music-card[data-album-id]');
      if (albumCard) {
        const albumId = albumCard.dataset.albumId;
        if (albumId) this.openAlbumView(albumId);
        return;
      }

      // 9. Click ranked-track-row (outside buttons and links)
      const rankedRow = e.target.closest('.ranked-track-row');
      if (rankedRow && !e.target.closest('button, .artist-link, .album-link, .song-link, .track-inline-dl-btn')) {
        const songId = rankedRow.dataset.songId;
        if (songId) this.openSongView(songId);
        return;
      }
    });
  }

  // ===========================================================================
  // SPA View Router & Dynamic Detail Pages
  // ===========================================================================
  switchView(viewName, pushState = true) {
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
    if (this.viewSearch) this.viewSearch.classList.toggle('hidden', viewName !== 'search');
    if (this.viewArtist) this.viewArtist.classList.toggle('hidden', viewName !== 'artist');
    if (this.viewSong) this.viewSong.classList.toggle('hidden', viewName !== 'song');
    if (this.viewAlbum) this.viewAlbum.classList.toggle('hidden', viewName !== 'album');

    // Scroll main content to top
    const mainContent = document.getElementById('mainContent');
    if (mainContent) mainContent.scrollTop = 0;
    try { window.scrollTo({ top: 0 }); } catch (err) {}

    if (pushState && typeof history !== 'undefined' && history.pushState) {
      if (viewName === 'home') this.updateUrl('/');
      else if (viewName === 'explore') this.updateUrl('/explore');
      else if (viewName === 'library') this.updateUrl('/library');
      else if (viewName === 'downloads') this.updateUrl('/downloads');
    }

    if (viewName === 'explore') {
      this.loadExploreCatalog();
    } else if (viewName === 'library') {
      this.renderLibrary();
    } else if (viewName === 'downloads') {
      this.renderDownloads();
    }
  }

  updateUrl(path) {
    if (typeof history !== 'undefined' && history.pushState) {
      const cur = window.location.pathname + window.location.search;
      if (cur !== path) {
        history.pushState({ path }, '', path);
      }
    }
  }

  initRouter() {
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname, window.location.search, false);
    });

    // Run router for initial page path
    this.handleRoute(window.location.pathname, window.location.search, false);
  }

  handleRoute(pathname, search, pushState = false) {
    const params = new URLSearchParams(search);
    const cleanPath = pathname.replace(/\/$/, '') || '/';

    if (cleanPath === '/' || cleanPath === '/home' || cleanPath === '/index.html') {
      this.switchView('home', pushState);
    } else if (cleanPath === '/explore') {
      this.switchView('explore', pushState);
    } else if (cleanPath === '/library') {
      this.switchView('library', pushState);
    } else if (cleanPath === '/downloads') {
      this.switchView('downloads', pushState);
    } else if (cleanPath === '/search') {
      const q = params.get('q') || '';
      if (q) {
        this.openSearchView(q, pushState);
      } else {
        this.switchView('home', pushState);
      }
    } else if (cleanPath.startsWith('/artist/')) {
      const artistId = decodeURIComponent(cleanPath.substring('/artist/'.length));
      const artistName = params.get('name') || '';
      if (artistId) {
        this.openArtistView(artistId, artistName, pushState);
      }
    } else if (cleanPath.startsWith('/song/')) {
      const songId = decodeURIComponent(cleanPath.substring('/song/'.length));
      if (songId) {
        this.openSongView(songId, pushState);
      }
    } else if (cleanPath.startsWith('/album/')) {
      const albumId = decodeURIComponent(cleanPath.substring('/album/'.length));
      if (albumId) {
        this.openAlbumView(albumId, pushState);
      }
    } else {
      this.switchView('home', pushState);
    }
  }

  renderClickableArtists(song) {
    if (!song) return 'Unknown Artist';
    const artistStr = typeof song === 'string' ? song : (song.artist || '');
    if (!artistStr) return 'Unknown Artist';
    const artistNames = artistStr.split(',').map(s => s.trim()).filter(Boolean);
    const map = (song && typeof song === 'object' && song.artistMap) ? song.artistMap : {};
    return artistNames.map((name, idx) => {
      const id = map[name.toLowerCase()] || map[name] || (idx === 0 && song.primaryArtistId ? song.primaryArtistId : '') || '';
      return `<span class="artist-link" data-artist-id="${escapeHtml(id)}" data-artist-name="${escapeHtml(name)}">${escapeHtml(name)}</span>`;
    }).join(', ');
  }

  // ===========================================================================
  // 1. Unified Search View
  // ===========================================================================
  async openSearchView(query, pushState = true) {
    const cleanQuery = (query || '').trim();
    if (!cleanQuery) return;
    this.lastSearchQuery = cleanQuery;

    if (this.searchInput) this.searchInput.value = cleanQuery;
    if (this.searchClearBtn) this.searchClearBtn.classList.remove('hidden');
    if (this.searchDropdown) this.searchDropdown.classList.add('hidden');

    this.switchView('search', false);
    if (pushState) {
      this.updateUrl(`/search?q=${encodeURIComponent(cleanQuery)}`);
    }

    if (this.searchBreadcrumbQuery) this.searchBreadcrumbQuery.textContent = cleanQuery;
    if (this.searchPageTitle) this.searchPageTitle.textContent = `Results for "${cleanQuery}"`;

    // Reset filter pills to All
    if (this.searchCategoryPills) {
      this.searchCategoryPills.querySelectorAll('.search-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.filter === 'all');
      });
    }
    this.currentUnifiedFilter = 'all';

    // Show loading skeleton, hide other states
    if (this.searchSkeleton) this.searchSkeleton.classList.remove('hidden');
    if (this.searchEmptyState) this.searchEmptyState.classList.add('hidden');
    if (this.searchErrorState) this.searchErrorState.classList.add('hidden');
    if (this.searchResultsContent) this.searchResultsContent.classList.add('hidden');

    const cacheKey = cleanQuery.toLowerCase();
    let data = null;

    if (this.clientSearchCache && this.clientSearchCache.has(cacheKey)) {
      data = this.clientSearchCache.get(cacheKey);
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(cleanQuery)}`);
        if (!res.ok) throw new Error('Search request failed');
        data = await res.json();
        if (this.clientSearchCache) {
          this.clientSearchCache.set(cacheKey, data);
        }
      } catch (err) {
        console.error('Search error:', err);
        if (this.searchSkeleton) this.searchSkeleton.classList.add('hidden');
        if (this.searchErrorState) {
          this.searchErrorState.classList.remove('hidden');
          if (this.searchErrorMessage) {
            this.searchErrorMessage.textContent = `Could not load results for "${cleanQuery}". Please check your network connection and retry.`;
          }
        }
        return;
      }
    }

    if (this.searchSkeleton) this.searchSkeleton.classList.add('hidden');

    const songs = data.results || [];
    const artists = data.artists || [];
    const albums = data.albums || [];
    let topResult = data.topResult || null;
    if (topResult && topResult.data) {
      topResult = {
        type: topResult.type || 'artist',
        ...topResult.data
      };
    }

    this.currentSearchSongs = songs;
    this.currentSearchArtists = artists;
    this.currentSearchAlbums = albums;

    if (songs.length === 0 && artists.length === 0 && albums.length === 0) {
      if (this.searchEmptyState) {
        this.searchEmptyState.classList.remove('hidden');
        if (this.searchEmptyMessage) {
          this.searchEmptyMessage.textContent = `We couldn't find any songs, artists, or albums matching "${cleanQuery}". Try checking your spelling or searching for another artist or song.`;
        }
      }
      return;
    }

    if (this.searchResultsContent) this.searchResultsContent.classList.remove('hidden');

    // 1. Render Top Result
    if (topResult && this.searchTopResultSection && this.searchTopResultCard) {
      this.searchTopResultSection.classList.remove('hidden');
      if (topResult.type === 'artist') {
        const topAvatar = this.getArtistAvatar(topResult);
        const topFallback = this.getArtistFallbackSvg(topResult.name);
        this.searchTopResultCard.innerHTML = `
          <div class="top-result-card" data-artist-id="${topResult.id || ''}" data-artist-name="${topResult.name || ''}">
            <div class="top-result-thumb-wrap artist">
              <img src="${topAvatar}" class="top-result-thumb" alt="${topResult.name}" onerror="this.onerror=null;this.src='${topFallback}'" loading="lazy" decoding="async">
            </div>
            <div class="top-result-info">
              <span class="top-result-badge">Top Artist</span>
              <div class="top-result-title">${topResult.name}</div>
              <div class="top-result-meta">${topResult.role || 'Artist / Singer'} • Tap to explore artist discography & top hits</div>
              <div class="top-result-actions">
                <button class="btn-top-play" title="Play Top Hits">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  <span>Play Top Hits</span>
                </button>
                <button class="btn-top-view" title="View Artist Page">
                  <span>View Artist Page →</span>
                </button>
              </div>
            </div>
          </div>
        `;
      } else if (topResult.type === 'album') {
        this.searchTopResultCard.innerHTML = `
          <div class="top-result-card" data-album-id="${topResult.id}">
            <div class="top-result-thumb-wrap">
              <img src="${topResult.image || FALLBACK_COVER}" class="top-result-thumb" alt="${topResult.title}" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            </div>
            <div class="top-result-info">
              <span class="top-result-badge">Top Album</span>
              <div class="top-result-title">${topResult.title}</div>
              <div class="top-result-meta">By ${topResult.artist} ${topResult.year ? '• ' + topResult.year : ''}</div>
              <div class="top-result-actions">
                <button class="btn-top-play" title="Play Album">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  <span>Play Album</span>
                </button>
                <button class="btn-top-view" title="View Album Page">
                  <span>View Album Page →</span>
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        // Song
        this.searchTopResultCard.innerHTML = `
          <div class="top-result-card" data-song-id="${topResult.id}">
            <div class="top-result-thumb-wrap">
              <img src="${topResult.cover || FALLBACK_COVER}" class="top-result-thumb" alt="${topResult.title}" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            </div>
            <div class="top-result-info">
              <span class="top-result-badge">Top Song</span>
              <div class="top-result-title">${topResult.title}</div>
              <div class="top-result-meta">By ${this.renderClickableArtists(topResult)} • ${topResult.album || 'Single'}</div>
              <div class="top-result-actions">
                <button class="btn-top-play" title="Play Song">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  <span>Play Song</span>
                </button>
                <button class="btn-top-view" title="Song Details">
                  <span>Song Details →</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }
    } else if (this.searchTopResultSection) {
      this.searchTopResultSection.classList.add('hidden');
    }

    // 2. Render Matching Songs
    if (this.searchSongsSection && this.searchSongsGrid) {
      if (songs.length > 0) {
        this.searchSongsSection.classList.remove('hidden');
        if (this.searchSongsTitle) this.searchSongsTitle.textContent = `Songs • ${songs.length}`;
        this.searchSongsGrid.innerHTML = songs.map(song => `
          <div class="track-row-card" data-song-id="${song.id}">
            <img src="${song.cover || FALLBACK_COVER}" alt="${song.title}" class="track-row-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            <div class="track-row-info">
              <div class="track-row-title song-link" data-song-id="${song.id}">${song.title}</div>
              <div class="track-row-meta">
                ${this.renderClickableArtists(song)} • ${song.album ? `<span class="album-link" data-album-id="${song.albumId || ''}">${song.album}</span>` : 'Single'}
              </div>
            </div>
            ${song.duration ? `<div class="track-row-duration">${this.formatTime(song.duration)}</div>` : ''}
            <button class="track-row-play-btn" title="Play song">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
        `).join('');
      } else {
        this.searchSongsSection.classList.add('hidden');
      }
    }

    // 3. Render Matching Artists & Singers
    if (this.searchArtistsSection && this.searchArtistsGrid) {
      if (artists.length > 0) {
        this.searchArtistsSection.classList.remove('hidden');
        if (this.searchArtistsTitle) this.searchArtistsTitle.textContent = `Artists & Singers • ${artists.length}`;
        this.searchArtistsGrid.innerHTML = artists.map(artist => {
          const avatarUrl = this.getArtistAvatar(artist);
          const fallbackSvg = this.getArtistFallbackSvg(artist.name);
          return `
          <div class="artist-card" data-artist-id="${artist.id || ''}" data-artist-name="${artist.name || ''}">
            <div class="artist-avatar-wrap">
              <img src="${avatarUrl}" alt="${artist.name}" class="artist-avatar-img" onerror="this.onerror=null;this.src='${fallbackSvg}'" loading="lazy" decoding="async">
            </div>
            <div class="artist-card-name">${artist.name}</div>
            <div class="artist-card-role">${artist.role || 'Artist / Singer'}</div>
          </div>
        `;
        }).join('');
      } else {
        this.searchArtistsSection.classList.add('hidden');
      }
    }

    // 4. Render Matching Albums
    if (this.searchAlbumsSection && this.searchAlbumsGrid) {
      if (albums.length > 0) {
        this.searchAlbumsSection.classList.remove('hidden');
        if (this.searchAlbumsTitle) this.searchAlbumsTitle.textContent = `Albums • ${albums.length}`;
        this.searchAlbumsGrid.innerHTML = albums.map(album => `
          <div class="music-card" data-album-id="${album.id}">
            <div class="music-card-cover-wrap">
              <img src="${album.image || FALLBACK_COVER}" alt="${album.title}" class="music-card-img" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
              <div class="music-card-play-overlay">
                <button class="card-play-btn" title="Open Album">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
              </div>
            </div>
            <div class="music-card-title album-link" data-album-id="${album.id}">${album.title}</div>
            <div class="music-card-subtitle">${album.artist || 'Album'} ${album.year ? '• ' + album.year : ''}</div>
          </div>
        `).join('');
      } else {
        this.searchAlbumsSection.classList.add('hidden');
      }
    }
  }

  applyUnifiedSearchFilter(filter) {
    this.currentUnifiedFilter = filter;
    if (filter === 'all') {
      if (this.searchTopResultSection) {
        this.searchTopResultSection.classList.toggle('hidden', !this.searchTopResultCard.innerHTML);
      }
      if (this.searchSongsSection) {
        this.searchSongsSection.classList.toggle('hidden', (this.currentSearchSongs || []).length === 0);
      }
      if (this.searchArtistsSection) {
        this.searchArtistsSection.classList.toggle('hidden', (this.currentSearchArtists || []).length === 0);
      }
      if (this.searchAlbumsSection) {
        this.searchAlbumsSection.classList.toggle('hidden', (this.currentSearchAlbums || []).length === 0);
      }
    } else if (filter === 'songs') {
      if (this.searchTopResultSection) this.searchTopResultSection.classList.add('hidden');
      if (this.searchSongsSection) this.searchSongsSection.classList.remove('hidden');
      if (this.searchArtistsSection) this.searchArtistsSection.classList.add('hidden');
      if (this.searchAlbumsSection) this.searchAlbumsSection.classList.add('hidden');
    } else if (filter === 'artists') {
      if (this.searchTopResultSection) this.searchTopResultSection.classList.add('hidden');
      if (this.searchSongsSection) this.searchSongsSection.classList.add('hidden');
      if (this.searchArtistsSection) this.searchArtistsSection.classList.remove('hidden');
      if (this.searchAlbumsSection) this.searchAlbumsSection.classList.add('hidden');
    } else if (filter === 'albums') {
      if (this.searchTopResultSection) this.searchTopResultSection.classList.add('hidden');
      if (this.searchSongsSection) this.searchSongsSection.classList.add('hidden');
      if (this.searchArtistsSection) this.searchArtistsSection.classList.add('hidden');
      if (this.searchAlbumsSection) this.searchAlbumsSection.classList.remove('hidden');
    }
  }

  // ===========================================================================
  // 2. Dedicated Artist Page
  // ===========================================================================
  async openArtistView(artistIdOrName, artistName = '', pushState = true) {
    if (!artistIdOrName) return;
    this.currentArtistId = artistIdOrName;
    this.currentArtistName = artistName || artistIdOrName;

    if (this.listeningHistoryService) {
      this.listeningHistoryService.onArtistOpened(artistIdOrName, this.currentArtistName);
    }

    this.switchView('artist', false);
    if (pushState) {
      this.updateUrl(`/artist/${encodeURIComponent(artistIdOrName)}${artistName ? '?name=' + encodeURIComponent(artistName) : ''}`);
    }

    // Show loading skeleton, hide content and error
    if (this.artistSkeleton) this.artistSkeleton.classList.remove('hidden');
    if (this.artistErrorState) this.artistErrorState.classList.add('hidden');
    if (this.artistContent) this.artistContent.classList.add('hidden');

    const cacheKey = String(artistIdOrName).toLowerCase();
    let data = null;

    if (this.clientArtistCache && this.clientArtistCache.has(cacheKey)) {
      data = this.clientArtistCache.get(cacheKey);
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/api/artist?id=${encodeURIComponent(artistIdOrName)}&name=${encodeURIComponent(this.currentArtistName)}`);
        if (!res.ok) throw new Error('Artist fetch failed');
        data = await res.json();
        if (this.clientArtistCache) {
          if (this.clientArtistCache.size >= 50) {
            const oldestKey = this.clientArtistCache.keys().next().value;
            this.clientArtistCache.delete(oldestKey);
          }
          this.clientArtistCache.set(cacheKey, data);
        }
      } catch (err) {
        console.error('Artist fetch error:', err);
        if (this.artistSkeleton) this.artistSkeleton.classList.add('hidden');
        if (this.artistErrorState) {
          this.artistErrorState.classList.remove('hidden');
          if (this.artistErrorMessage) {
            this.artistErrorMessage.textContent = `Could not load artist profile for "${this.currentArtistName}". Please check your connection and retry.`;
          }
        }
        return;
      }
    }

    if (this.artistSkeleton) this.artistSkeleton.classList.add('hidden');
    if (this.artistContent) this.artistContent.classList.remove('hidden');

    this.currentArtistSongs = data.topSongs || [];
    this.currentArtistAlbums = data.topAlbums || [];

    // Header info
    if (this.artistHeroAvatar) this.artistHeroAvatar.src = data.image || FALLBACK_COVER;
    if (this.artistHeroName) this.artistHeroName.textContent = data.name || this.currentArtistName;
    if (this.artistHeroMeta) {
      const listeners = data.follower_count ? Number(data.follower_count).toLocaleString() + ' Followers • ' : '';
      const fanCount = data.fan_count ? Number(data.fan_count).toLocaleString() + ' Monthly Listeners • ' : '';
      this.artistHeroMeta.textContent = `${listeners}${fanCount}${data.dominantType || 'Singer & Artist'}`;
    }
    if (this.artistHeroBio) {
      if (data.bio) {
        const cleanBio = data.bio.replace(/<[^>]+>/g, '').trim();
        this.artistHeroBio.textContent = cleanBio.length > 300 ? cleanBio.slice(0, 300) + '...' : cleanBio;
        this.artistHeroBio.style.display = 'block';
      } else {
        this.artistHeroBio.style.display = 'none';
      }
    }

    // Popular Songs list
    if (this.artistPopularSection && this.artistTopSongsList) {
      if (this.currentArtistSongs.length > 0) {
        this.artistPopularSection.classList.remove('hidden');
        this.artistTopSongsList.innerHTML = this.currentArtistSongs.map((song, idx) => `
          <div class="ranked-track-row" data-song-id="${song.id}">
            <div class="track-rank-num">${idx + 1}</div>
            <img src="${song.cover || FALLBACK_COVER}" alt="${song.title}" class="track-row-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            <div class="track-row-info">
              <div class="track-row-title song-link" data-song-id="${song.id}">${song.title}</div>
              <div class="track-row-meta">
                ${this.renderClickableArtists(song)} • ${song.album ? `<span class="album-link" data-album-id="${song.albumId || ''}">${song.album}</span>` : 'Single'}
              </div>
            </div>
            ${song.duration ? `<div class="track-row-duration">${this.formatTime(song.duration)}</div>` : ''}
            <button class="track-row-play-btn" title="Play">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
        `).join('');
      } else {
        this.artistPopularSection.classList.add('hidden');
      }
    }

    // Albums & Singles
    if (this.artistAlbumsSection && this.artistAlbumsGrid) {
      if (this.currentArtistAlbums.length > 0) {
        this.artistAlbumsSection.classList.remove('hidden');
        this.artistAlbumsGrid.innerHTML = this.currentArtistAlbums.map(album => `
          <div class="music-card" data-album-id="${album.id}">
            <div class="music-card-cover-wrap">
              <img src="${album.image || FALLBACK_COVER}" alt="${album.title}" class="music-card-img" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
              <div class="music-card-play-overlay">
                <button class="card-play-btn" title="Open Album">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
              </div>
            </div>
            <div class="music-card-title album-link" data-album-id="${album.id}">${album.title}</div>
            <div class="music-card-subtitle">${album.year ? album.year + ' • ' : ''}Album</div>
          </div>
        `).join('');
      } else {
        this.artistAlbumsSection.classList.add('hidden');
      }
    }

    // Similar Artists
    if (this.artistSimilarSection && this.artistSimilarGrid) {
      const similar = data.similarArtists || [];
      if (similar.length > 0) {
        this.artistSimilarSection.classList.remove('hidden');
        this.artistSimilarGrid.innerHTML = similar.map(art => `
          <div class="artist-card" data-artist-id="${art.id || ''}" data-artist-name="${art.name || ''}">
            <div class="artist-avatar-wrap">
              <img src="${art.image || FALLBACK_COVER}" alt="${art.name}" class="artist-avatar-img" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            </div>
            <div class="artist-card-name">${art.name}</div>
            <div class="artist-card-role">Artist</div>
          </div>
        `).join('');
      } else {
        this.artistSimilarSection.classList.add('hidden');
      }
    }
  }

  // ===========================================================================
  // 3. Dedicated Song Detail Page
  // ===========================================================================
  async openSongView(songId, pushState = true) {
    if (!songId) return;
    this.currentSongId = songId;

    this.switchView('song', false);
    if (pushState) {
      this.updateUrl(`/song/${encodeURIComponent(songId)}`);
    }

    if (this.songSkeleton) this.songSkeleton.classList.remove('hidden');
    if (this.songErrorState) this.songErrorState.classList.add('hidden');
    if (this.songContent) this.songContent.classList.add('hidden');

    const cacheKey = String(songId).toLowerCase();
    let data = null;

    if (this.clientSongCache && this.clientSongCache.has(cacheKey)) {
      data = this.clientSongCache.get(cacheKey);
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/api/song?id=${encodeURIComponent(songId)}`);
        if (!res.ok) throw new Error('Song fetch failed');
        data = await res.json();
        if (this.clientSongCache) {
          if (this.clientSongCache.size >= 50) {
            const oldestKey = this.clientSongCache.keys().next().value;
            this.clientSongCache.delete(oldestKey);
          }
          this.clientSongCache.set(cacheKey, data);
        }
      } catch (err) {
        console.error('Song fetch error:', err);
        if (this.songSkeleton) this.songSkeleton.classList.add('hidden');
        if (this.songErrorState) {
          this.songErrorState.classList.remove('hidden');
          if (this.songErrorMessage) {
            this.songErrorMessage.textContent = 'Could not load song details. Please check your connection and retry.';
          }
        }
        return;
      }
    }

    if (this.songSkeleton) this.songSkeleton.classList.add('hidden');
    if (this.songContent) this.songContent.classList.remove('hidden');

    const track = data.track;
    this.currentSongDetail = track;
    this.currentRelatedSongs = data.related || [];

    if (this.songHeroCover) this.songHeroCover.src = track.cover || FALLBACK_COVER;
    if (this.songHeroTitle) this.songHeroTitle.textContent = track.title;
    if (this.songHeroArtistLink) this.songHeroArtistLink.innerHTML = this.renderClickableArtists(track);
    if (this.songHeroAlbumLink) {
      this.songHeroAlbumLink.innerHTML = `<span class="album-link" data-album-id="${track.albumId || ''}">${track.album || 'Single'}</span>`;
    }
    if (this.songHeroYear) this.songHeroYear.textContent = track.year || (track.release_date ? track.release_date.slice(0, 4) : '2024');
    if (this.songHeroDuration) this.songHeroDuration.textContent = `Duration: ${this.formatTime(track.duration || 0)}`;

    this.updatePlayPauseUI();

    // Related Songs
    if (this.songRelatedSection && this.songRelatedTracksList) {
      if (this.currentRelatedSongs.length > 0) {
        this.songRelatedSection.classList.remove('hidden');
        this.songRelatedTracksList.innerHTML = this.currentRelatedSongs.map((song, idx) => `
          <div class="ranked-track-row" data-song-id="${song.id}">
            <div class="track-rank-num">${idx + 1}</div>
            <img src="${song.cover || FALLBACK_COVER}" alt="${song.title}" class="track-row-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            <div class="track-row-info">
              <div class="track-row-title song-link" data-song-id="${song.id}">${song.title}</div>
              <div class="track-row-meta">
                ${this.renderClickableArtists(song)} • ${song.album ? `<span class="album-link" data-album-id="${song.albumId || ''}">${song.album}</span>` : 'Single'}
              </div>
            </div>
            ${song.duration ? `<div class="track-row-duration">${this.formatTime(song.duration)}</div>` : ''}
            <button class="track-row-play-btn" title="Play">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
        `).join('');
      } else {
        this.songRelatedSection.classList.add('hidden');
      }
    }
  }

  // ===========================================================================
  // 4. Dedicated Album Page
  // ===========================================================================
  async openAlbumView(albumId, pushState = true) {
    if (!albumId) return;
    this.currentAlbumId = albumId;

    this.switchView('album', false);
    if (pushState) {
      this.updateUrl(`/album/${encodeURIComponent(albumId)}`);
    }

    if (this.albumSkeleton) this.albumSkeleton.classList.remove('hidden');
    if (this.albumErrorState) this.albumErrorState.classList.add('hidden');
    if (this.albumContent) this.albumContent.classList.add('hidden');

    const cacheKey = String(albumId).toLowerCase();
    let data = null;

    if (this.clientAlbumCache && this.clientAlbumCache.has(cacheKey)) {
      data = this.clientAlbumCache.get(cacheKey);
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/api/album?id=${encodeURIComponent(albumId)}`);
        if (!res.ok) throw new Error('Album fetch failed');
        data = await res.json();
        if (this.clientAlbumCache) {
          if (this.clientAlbumCache.size >= 50) {
            const oldestKey = this.clientAlbumCache.keys().next().value;
            this.clientAlbumCache.delete(oldestKey);
          }
          this.clientAlbumCache.set(cacheKey, data);
        }
      } catch (err) {
        console.error('Album fetch error:', err);
        if (this.albumSkeleton) this.albumSkeleton.classList.add('hidden');
        if (this.albumErrorState) {
          this.albumErrorState.classList.remove('hidden');
          if (this.albumErrorMessage) {
            this.albumErrorMessage.textContent = 'Could not load album details. Please check your connection and retry.';
          }
        }
        return;
      }
    }

    if (this.albumSkeleton) this.albumSkeleton.classList.add('hidden');
    if (this.albumContent) this.albumContent.classList.remove('hidden');

    this.currentAlbumSongs = data.songs || [];

    if (this.albumHeroCover) this.albumHeroCover.src = data.cover || FALLBACK_COVER;
    if (this.albumHeroTitle) this.albumHeroTitle.textContent = data.title;
    if (this.albumHeroArtistLink) {
      this.albumHeroArtistLink.innerHTML = `<span class="artist-link" data-artist-id="${data.primaryArtistId || ''}" data-artist-name="${data.artist}">${data.artist}</span>`;
    }
    if (this.albumHeroYear) this.albumHeroYear.textContent = data.year || '2024';
    if (this.albumHeroTrackCount) this.albumHeroTrackCount.textContent = `${this.currentAlbumSongs.length} tracks`;

    if (this.albumTracksSection && this.albumTracksList) {
      if (this.currentAlbumSongs.length > 0) {
        this.albumTracksSection.classList.remove('hidden');
        this.albumTracksList.innerHTML = this.currentAlbumSongs.map((song, idx) => `
          <div class="ranked-track-row" data-song-id="${song.id}">
            <div class="track-rank-num">${idx + 1}</div>
            <img src="${song.cover || data.cover || FALLBACK_COVER}" alt="${song.title}" class="track-row-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            <div class="track-row-info">
              <div class="track-row-title song-link" data-song-id="${song.id}">${song.title}</div>
              <div class="track-row-meta">${this.renderClickableArtists(song)}</div>
            </div>
            ${song.duration ? `<div class="track-row-duration">${this.formatTime(song.duration)}</div>` : ''}
            <button class="track-row-play-btn" title="Play">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
        `).join('');
      } else {
        this.albumTracksSection.classList.add('hidden');
      }
    }
  }

  // ===========================================================================
  // Playback Helpers for Detail Views
  // ===========================================================================
  playTrackItem(track) {
    if (!track) return;
    // Context-sensitive playback:
    // If in album view and track is in album songs
    if (this.currentView === 'album' && this.currentAlbumSongs && this.currentAlbumSongs.length > 0) {
      const idx = this.currentAlbumSongs.findIndex(t => String(t.id) === String(track.id));
      if (idx !== -1) {
        this.sequenceQueue = [...this.currentAlbumSongs];
        this.sequenceIndex = idx;
        this.playActualTrack(track, { type: 'album', id: this.currentAlbumId });
        return;
      }
    }
    // If in artist view and track is in artist songs
    if (this.currentView === 'artist' && this.currentArtistSongs && this.currentArtistSongs.length > 0) {
      const idx = this.currentArtistSongs.findIndex(t => String(t.id) === String(track.id));
      if (idx !== -1) {
        this.sequenceQueue = [...this.currentArtistSongs];
        this.sequenceIndex = idx;
        this.playActualTrack(track, { type: 'artist', id: this.currentArtistId, name: this.currentArtistName });
        return;
      }
    }
    // If in search view, play as seed track so Smart Autoplay continues with this artist
    if (this.currentView === 'search') {
      this.sequenceQueue = [track];
      this.sequenceIndex = 0;
      this.playActualTrack(track, { type: 'search', id: track.id, query: this.lastSearchQuery || '' });
      return;
    }
    // Single song mode
    this.sequenceQueue = [track];
    this.sequenceIndex = 0;
    this.playActualTrack(track, { type: 'song', id: track.id });
  }

  async playSearchTrack(track, allTracks = null, query = '') {
    if (!track) return;

    // Toggle play/pause if clicked track is currently active
    const currentId = this.currentTrack ? this.currentTrack.id : (this.queue[this.currentTrackIndex]?.id);
    if (currentId && String(currentId) === String(track.id)) {
      this.togglePlayPause();
      this.updatePlayPauseUI();
      return;
    }

    // Play selected search song with single track sequence so Smart Autoplay seeds from this artist
    this.sequenceQueue = [track];
    this.sequenceIndex = 0;

    if (track.title) {
      this.addSearchHistory(track.title);
    }

    // Ensure playable audio source exists
    if (!track.audioUrl && !track.localBlobUrl && track.id) {
      this.showToast(`Loading audio for "${track.title}"...`);
      try {
        const res = await fetch(`${API_BASE_URL}/api/song?id=${encodeURIComponent(track.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.track && (data.track.audioUrl || data.track.localBlobUrl)) {
            Object.assign(track, data.track);
          }
        }
      } catch (err) {
        console.warn('[REA Music] Error fetching song stream:', err);
      }
    }

    if (!track.audioUrl && !track.localBlobUrl) {
      this.showToast(`Playable audio source not available for "${track.title}"`);
      return;
    }

    // Execute playback using central playback controller
    this.playActualTrack(track, { type: 'search', id: track.id, query: query || this.lastSearchQuery || '' });
    this.updatePlayPauseUI();
  }

  playTrackList(tracks, shuffle = false, context = null) {
    if (!tracks || tracks.length === 0) return;
    let list = [...tracks];
    if (shuffle) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    this.sequenceQueue = list;
    this.sequenceIndex = 0;
    const ctx = context || { type: 'list', count: list.length };
    this.playActualTrack(this.sequenceQueue[0], ctx);
    this.showToast(shuffle ? 'Playing shuffled tracks' : 'Playing all tracks');
  }

  findTrackById(id) {
    if (!id) return null;
    const all = [
      ...(this.currentTrack ? [this.currentTrack] : []),
      ...(this.manualQueue || []),
      ...(this.recommendationQueue || []),
      ...(this.sequenceQueue || []),
      ...(this.currentSearchSongs || []),
      ...(this.currentArtistSongs || []),
      ...(this.currentAlbumSongs || []),
      ...(this.currentRelatedSongs || []),
      ...(this.queue || []),
      ...(this.downloadedTracks || []),
      ...(this.quickPicks || []),
      ...(this.trendingHits || []),
      ...(this.exploreCharts || []),
      ...(this.exploreReleases || []),
      ...(this.likedTracks || []),
      ...(FALLBACK_TRACKS || [])
    ];
    return all.find(t => t && String(t.id) === String(id)) || null;
  }

  // ===========================================================================
  // Explore View Logic
  // ===========================================================================
  async loadExploreCatalog() {
    // Instant cache hydration from localStorage for 0ms initial load
    try {
      const cached = localStorage.getItem('rea_cached_explore_v1');
      if (cached) {
        const data = JSON.parse(cached);
        if (data && (data.newReleases || data.topCharts)) {
          if (data.newReleases && data.newReleases.length > 0) this.exploreReleases = data.newReleases;
          if (data.topCharts && data.topCharts.length > 0) this.exploreCharts = data.topCharts;
          this.renderExplore();
        }
      }
    } catch (_) {}

    try {
      const res = await fetch(`${API_BASE_URL}/api/explore`);
      if (!res.ok) throw new Error('Explore API offline');
      const data = await res.json();

      if (data.newReleases) this.exploreReleases = data.newReleases;
      if (data.topCharts) this.exploreCharts = data.topCharts;

      try {
        localStorage.setItem('rea_cached_explore_v1', JSON.stringify({
          newReleases: this.exploreReleases,
          topCharts: this.exploreCharts
        }));
      } catch (_) {}

      this.renderExplore();
    } catch (e) {
      console.warn('Explore load notice:', e);
    }
  }

  renderExplore() {
        // 1. New Releases Carousel (Home & Explore)
    const releaseContainers = [this.exploreReleasesCarousel, this.homeReleasesCarousel].filter(Boolean);
    releaseContainers.forEach(container => {
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();
      this.exploreReleases.forEach(album => {
        const card = document.createElement('div');
        card.className = 'music-card spatial-album-card';
        let cleanTitle = (album.title || '').replace(/\s*\([^)]*\)/g, '').trim();
        if (album.title.includes('Ranabaali')) cleanTitle = 'Ranabaali - Hindi';
        if (album.title.includes('Jailer')) cleanTitle = 'Rajini The Jailer 2';
        if (album.title.includes('Prem')) cleanTitle = 'Prem Keetanu';

        card.innerHTML = `
          <div class="music-card-thumb">
            <img src="${album.cover}" alt="${cleanTitle}" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            <div class="album-sheen-overlay"></div>
            <button class="music-card-play" aria-label="Play ${cleanTitle}">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#ffffff" d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <div class="music-card-title">${cleanTitle}</div>
          <div class="music-card-sub">${album.artist || 'Various Artists'} • ${album.year || '2026'}</div>
        `;
        card.addEventListener('click', async () => {
          this.showToast(`Loading album "${cleanTitle}"...`);
          try {
            const res = await fetch(`${API_BASE_URL}/api/album?id=${album.id}`);
            const data = await res.json();
            if (data.songs && data.songs.length > 0) {
              this.queue = data.songs;
              this.playTrack(0);
              this.showToast(`Playing "${cleanTitle}"`);
            }
          } catch (e) {
            console.warn('Album load failed:', e);
          }
        });
        fragment.appendChild(card);
      });
      container.appendChild(fragment);
    });

    // 2. Ranked Top Charts Grid (Home & Explore: 3-column numbered ranking cards matching reference)
    const chartContainers = [this.exploreChartsGrid, this.homeChartsGrid].filter(Boolean);
    chartContainers.forEach(container => {
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();
      // Render top 9 to 12 tracks in Home view for crisp 3-column layout
            // Render exactly 3 columns matching reference:
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
      }

      chartItems.forEach(track => {
        const card = document.createElement('div');
        card.dataset.songId = track.id;

        let deltaHtml = '';
        let change = String(track.rankChange || '');
        let cleanTitle = (track.title || '').replace(/\s*\(From[^)]*\)/gi, '').replace(/\s*\- New Version/gi, '').trim();
        let displayArtist = track.artist;
        let displayDuration = track.duration;
        let displayCover = track.cover;

        if (isHome) {
          if (track.rank === 1) {
            cleanTitle = 'Casa Tupka Anthem';
            displayArtist = 'Yo Yo Honey Singh';
            change = '+1';
            displayDuration = 183;
            displayCover = 'assets/casa_tupka.jpg';
          } else if (track.rank === 2) {
            cleanTitle = 'Gehra Hua';
            displayArtist = 'Arijit Singh, Armaan Malik';
            change = '-1';
            displayDuration = 362;
          } else if (track.rank === 3) {
            cleanTitle = 'Parvati';
            displayArtist = 'Sadhu Tiwari';
            change = '—';
            displayDuration = 284;
          } else if (track.rank === 5) {
            cleanTitle = 'Tum Hi Ho';
            displayArtist = 'Arijit Singh';
            change = 'NEW';
            displayDuration = 262;
          } else if (track.rank === 6) {
            cleanTitle = 'Saiyaara';
            displayArtist = 'Various Artists';
            change = '+1';
            displayDuration = 370;
          } else if (track.rank === 7) {
            cleanTitle = 'Dheere Dheere';
            displayArtist = 'Yo Yo Honey Singh';
            change = '-2';
            displayDuration = 238;
            displayCover = 'https://c.saavncdn.com/808/Dheere-Dheere-Hindi-2015-500x500.jpg';
          } else if (track.rank === 9) {
            cleanTitle = 'Apna Bana Le';
            displayArtist = 'Sachin-Jigar, Arijit';
            change = 'NEW';
            displayDuration = 261;
          } else if (track.rank === 10) {
            cleanTitle = 'Vaaroon Forever';
            displayArtist = 'Various Artists';
            change = '+2';
            displayDuration = 252;
          } else if (track.rank === 11) {
            cleanTitle = 'Husn';
            displayArtist = 'Anuv Jain';
            change = '—';
            displayDuration = 306;
            displayCover = 'https://c.saavncdn.com/436/Husn-Hindi-2023-20231129054140-500x500.jpg';
          }
        }

        if (change === 'NEW') {
          deltaHtml = `<span class="rank-badge badge-new">NEW</span>`;
        } else if (change.startsWith('+') || change.startsWith('▲') || change === '#1') {
          const val = change === '#1' ? '1' : change.replace(/^[+▲]\s*/, '');
          deltaHtml = `<span class="rank-badge badge-up"><svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor"><polygon points="5,1 9,8 1,8"/></svg> +${val}</span>`;
        } else if (change.startsWith('-') || change.startsWith('▼')) {
          const val = change.replace(/^[-▼]\s*/, '');
          deltaHtml = `<span class="rank-badge badge-down"><svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor"><polygon points="1,2 9,2 5,9"/></svg> -${val}</span>`;
        } else {
          deltaHtml = `<span class="rank-badge badge-same">—</span>`;
        }

        const isCurrent = Boolean(this.currentTrack && (
          (this.currentTrack.id && String(this.currentTrack.id) === String(track.id)) ||
          (this.currentTrack.title && this.currentTrack.title.trim().toLowerCase() === cleanTitle.toLowerCase())
        ));
        card.className = 'ranked-track-card' + (isCurrent ? ' rank-active' : '');

        card.innerHTML = `
          <div class="rank-number ${track.rank === 1 ? 'top-rank' : ''}">${track.rank}</div>
          ${deltaHtml}
          <img src="${displayCover}" alt="${cleanTitle}" class="track-thumb-img" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
          <div class="track-row-info">
            <div class="track-row-title">${cleanTitle}</div>
            <div class="track-row-artist">${displayArtist}</div>
          </div>
          <div class="track-row-duration">${this.formatTime(displayDuration)}</div>
          <button class="track-more-menu-btn" title="Song options" aria-label="Song options">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </button>
        `;
        card.addEventListener('click', (e) => {
          if (e.target.closest('.track-more-menu-btn')) {
            e.stopPropagation();
            this.openSongView(track.id);
            return;
          }
          const playItem = {
            ...track,
            title: cleanTitle,
            artist: displayArtist,
            cover: displayCover,
            duration: displayDuration
          };
          this.playActualTrack(playItem, { type: 'chart', id: track.id, rank: track.rank });
        });
        fragment.appendChild(card);
      });
      container.appendChild(fragment);
    });
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
    if (this.listeningHistoryService) {
      this.listeningHistoryService.onTrackLiked(track, this.likedTrackIds.has(track.id));
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
    // Instant cache hydration from localStorage for 0ms initial load
    try {
      const cached = localStorage.getItem('rea_cached_catalog_v2');
      if (cached) {
        const data = JSON.parse(cached);
        if (data && Array.isArray(data.quickPicks) && data.quickPicks.length > 0) {
          this.quickPicks = data.quickPicks;
          this.trendingHits = data.trendingHits || [];
          this.punjabiHits = data.punjabiHits || [];
          this.romanticHits = data.romanticHits || [];
          this.haryanviHits = data.haryanviHits || [];
          this.bollywoodHits = data.bollywoodHits || [];
          this.indieHits = data.indieHits || [];
          this.renderShelves();
        }
      }
    } catch (_) {}

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${API_BASE_URL}/api/trending?category=all`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('API offline');
      const data = await res.json();

      if (data && Array.isArray(data.quickPicks) && data.quickPicks.length > 0) {
        this.quickPicks = data.quickPicks;
      }
      if (data && Array.isArray(data.trendingHits) && data.trendingHits.length > 0) {
        this.trendingHits = data.trendingHits;
      }
      if (data && Array.isArray(data.punjabiHits) && data.punjabiHits.length > 0) {
        this.punjabiHits = data.punjabiHits;
      }
      if (data && Array.isArray(data.romanticHits) && data.romanticHits.length > 0) {
        this.romanticHits = data.romanticHits;
      }
      if (data && Array.isArray(data.haryanviHits) && data.haryanviHits.length > 0) {
        this.haryanviHits = data.haryanviHits;
      }
      if (data && Array.isArray(data.bollywoodHits) && data.bollywoodHits.length > 0) {
        this.bollywoodHits = data.bollywoodHits;
      }
      if (data && Array.isArray(data.indieHits) && data.indieHits.length > 0) {
        this.indieHits = data.indieHits;
      }

      try {
        localStorage.setItem('rea_cached_catalog_v2', JSON.stringify({
          quickPicks: this.quickPicks,
          trendingHits: this.trendingHits,
          punjabiHits: this.punjabiHits,
          romanticHits: this.romanticHits,
          haryanviHits: this.haryanviHits,
          bollywoodHits: this.bollywoodHits,
          indieHits: this.indieHits
        }));
      } catch (_) {}
    } catch (e) {
      console.warn('Using fallback catalog:', e);
      if (!this.quickPicks || this.quickPicks.length === 0) {
        this.quickPicks = [...FALLBACK_TRACKS];
      }
    } finally {
      this.renderShelves();
    }
  }

  setSearchCategory(cat) {
    this.searchCategory = cat;
    document.querySelectorAll('.search-tab-pill').forEach(btn => {
      btn.classList.toggle('active', (btn.dataset.searchTab || 'all') === cat);
    });
    this.applySearchCategoryFilter();
  }

  applySearchCategoryFilter() {
    const cat = this.searchCategory;
    const hasArtist = this.currentSearchArtists && this.currentSearchArtists.length > 0;
    const hasSongs = this.currentSearchSongs && this.currentSearchSongs.length > 0;

    if (cat === 'all') {
      if (this.featuredSingerCard) {
        this.featuredSingerCard.classList.toggle('hidden', !hasArtist);
      }
      if (this.searchArtistsList) {
        this.searchArtistsList.classList.toggle('hidden', !hasArtist || this.currentSearchArtists.length <= 1);
      }
      if (this.searchResultsList) {
        this.searchResultsList.classList.remove('hidden');
      }
    } else if (cat === 'music') {
      if (this.featuredSingerCard) this.featuredSingerCard.classList.add('hidden');
      if (this.searchArtistsList) this.searchArtistsList.classList.add('hidden');
      if (this.searchResultsList) this.searchResultsList.classList.remove('hidden');
    } else if (cat === 'singers') {
      if (this.featuredSingerCard) {
        this.featuredSingerCard.classList.toggle('hidden', !hasArtist);
      }
      if (this.searchArtistsList) {
        this.searchArtistsList.classList.remove('hidden');
      }
      if (this.searchResultsList) {
        this.searchResultsList.classList.add('hidden');
      }
    }
  }

  async loadSingerHits(artist) {
    try {
      this.showToast(`Loading top songs of ${artist.name}...`);
      if (this.searchDropdown) this.searchDropdown.classList.add('hidden');
      if (this.searchInput) this.searchInput.value = artist.name;
      if (this.searchClearBtn) this.searchClearBtn.classList.remove('hidden');

      let url = artist.id
        ? `${API_BASE_URL}/api/artist?id=${encodeURIComponent(artist.id)}&name=${encodeURIComponent(artist.name)}`
        : `${API_BASE_URL}/api/search?q=${encodeURIComponent(artist.name)}`;

      const res = await fetch(url);
      const data = await res.json();
      let songs = data.songs || data.results || [];

      if (!songs || songs.length === 0) {
        const searchRes = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(artist.name)}`);
        const searchData = await searchRes.json();
        songs = searchData.results || [];
      }

      if (songs.length > 0) {
        this.queue = songs;
        this.currentTrackIndex = 0;
        this.playTrack(0);
        this.renderQueue();
        this.showToast(`Playing ${artist.name}'s top songs`);
      } else {
        this.showToast(`No tracks found for ${artist.name}`);
      }
    } catch (err) {
      console.error('Error loading singer hits:', err);
      this.showToast(`Could not load tracks for ${artist.name}`);
    }
  }

  
  createArtistInitialsSvg(name) {
    const cleanName = (name || 'Artist').trim();
    const words = cleanName.split(/\s+/).filter(Boolean);
    let initials = '';
    if (words.length >= 2) {
      initials = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
      initials = words[0].slice(0, 2).toUpperCase();
    } else {
      initials = (cleanName[0] || 'A').toUpperCase();
    }

    let hash = 0;
    for (let i = 0; i < cleanName.length; i++) {
      hash = ((hash << 5) - hash + cleanName.charCodeAt(i)) | 0;
    }
    const gradients = [
      ['#fa2d48', '#ff7a00'],
      ['#7928ca', '#ff0080'],
      ['#0071e3', '#42a5f5'],
      ['#00b4db', '#0083b0'],
      ['#f12711', '#f5af19'],
      ['#8a2387', '#e94057'],
      ['#11998e', '#38ef7d'],
      ['#ec008c', '#fc6767']
    ];
    const pair = gradients[Math.abs(hash) % gradients.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${pair[0]}"/><stop offset="100%" stop-color="${pair[1]}"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(#g)"/><text x="60" y="68" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-weight="700" font-size="42" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  getArtistFallbackSvg(name) {
    return this.createArtistInitialsSvg(name || 'Artist');
  }

  getArtistAvatar(artist) {
    if (!artist) return this.createArtistInitialsSvg('Artist');
    const img = typeof artist === 'string' ? artist : (artist.image || '');
    const name = typeof artist === 'string' ? 'Artist' : (artist.name || 'Singer');
    if (img && !img.includes('artist-default') && !img.includes('default-artist') && !img.includes('undefined')) {
      return img.replace(/500x500/g, '150x150').replace(/50x50/g, '150x150');
    }
    return this.createArtistInitialsSvg(name);
  }

  showInstantSearchPreview(query) {
    if (!query) return;
    const qLower = query.toLowerCase();

    // 1. Instant Singer Matches from local popularSingers
    const matchedSingers = (this.popularSingers || []).filter(s => 
      s.name.toLowerCase().includes(qLower)
    );

    // 2. Instant Song Matches from in-memory tracks
    const allPool = [
      ...(this.downloadedTracks || []),
      ...(this.queue || []),
      ...(this.quickPicks || []),
      ...(this.trendingHits || []),
      ...(this.punjabiHits || []),
      ...(this.romanticHits || [])
    ];

    const seenIds = new Set();
    const matchedSongs = [];
    for (const t of allPool) {
      if (!t || seenIds.has(t.id)) continue;
      if (
        (t.title && t.title.toLowerCase().includes(qLower)) ||
        (t.artist && t.artist.toLowerCase().includes(qLower)) ||
        (t.album && t.album.toLowerCase().includes(qLower))
      ) {
        seenIds.add(t.id);
        matchedSongs.push(t);
        if (matchedSongs.length >= 10) break;
      }
    }

    if (matchedSingers.length > 0 || matchedSongs.length > 0) {
      this.renderSearchResults(matchedSongs, matchedSingers, query, true);
    } else {
      if (this.featuredSingerCard) this.featuredSingerCard.classList.add("hidden");
      if (this.searchArtistsList) this.searchArtistsList.classList.add("hidden");
      if (this.searchResultsList) {
        this.searchResultsList.classList.remove("hidden");
        this.searchResultsList.innerHTML = `<div style="padding:14px;color:var(--text-secondary);text-align:center;font-size:13px;">Searching songs & artists for "${query}"...</div>`;
      }
    }
  }

  renderSearchResults(results, artists, query, isPreview = false) {
    this.currentSearchSongs = results || [];
    this.currentSearchArtists = artists || [];

    if (this.searchTabsNav) this.searchTabsNav.classList.remove('hidden');

    // 1. Render Featured Singer Card
    if (this.featuredSingerCard) {
      if (artists && artists.length > 0) {
        const topArtist = artists[0];
        const avatarUrl = this.getArtistAvatar(topArtist);
        const fallbackSvg = this.getArtistFallbackSvg(topArtist.name);
        this.featuredSingerCard.dataset.hasArtist = 'true';
        this.featuredSingerCard.innerHTML = `
          <div class="featured-singer-left">
            <img src="${avatarUrl}" alt="${topArtist.name}" class="featured-singer-avatar" onerror="this.onerror=null;this.src='${fallbackSvg}'" loading="lazy" decoding="async">
            <div class="featured-singer-info">
              <div class="featured-singer-name">
                <span>${topArtist.name}</span>
                <span class="featured-singer-badge">Singer</span>
              </div>
              <div class="featured-singer-meta">${topArtist.role || 'Artist'} • Tap to stream top hits</div>
            </div>
          </div>
          <button class="featured-singer-btn" title="Play Top Hits">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <span>Play Hits</span>
          </button>
        `;
        this.featuredSingerCard.onclick = (e) => {
          this.addSearchHistory(topArtist.name);
          if (e.target.closest('.featured-singer-btn')) {
            this.loadSingerHits(topArtist);
          } else {
            this.openArtistView(topArtist.id || topArtist.name, topArtist.name);
          }
        };
      } else {
        this.featuredSingerCard.dataset.hasArtist = '';
        this.featuredSingerCard.innerHTML = '';
        this.featuredSingerCard.classList.add('hidden');
      }
    }

    // 2. Render Matching Singers List (max 3 in dropdown for speed)
    if (this.searchArtistsList) {
      this.searchArtistsList.innerHTML = '';
      if (!artists || artists.length === 0) {
        if (!isPreview) {
          this.searchArtistsList.innerHTML = `<div style="padding:14px;color:var(--text-secondary);text-align:center;font-size:13px;">No singers found for "${query}"</div>`;
        }
      } else {
        const frag = document.createDocumentFragment();
        artists.slice(0, 3).forEach(artist => {
          const avatarUrl = this.getArtistAvatar(artist);
          const fallbackSvg = this.getArtistFallbackSvg(artist.name);
          const row = document.createElement('div');
          row.className = 'artist-result-card';
          row.innerHTML = `
            <div class="artist-result-left">
              <img src="${avatarUrl}" alt="${artist.name}" class="artist-result-avatar" onerror="this.onerror=null;this.src='${fallbackSvg}'" loading="lazy" decoding="async">
              <div class="artist-result-info">
                <div class="artist-result-name">${artist.name}</div>
                <div class="artist-result-meta">${artist.role || 'Singer'} • Artist</div>
              </div>
            </div>
            <button class="artist-play-btn" title="Stream Top Songs">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <span>Top Songs</span>
            </button>
          `;
          row.addEventListener('click', (e) => {
            this.addSearchHistory(artist.name);
            if (e.target.closest('.artist-play-btn')) {
              this.loadSingerHits(artist);
            } else {
              this.openArtistView(artist.id || artist.name, artist.name);
            }
          });
          frag.appendChild(row);
        });
        this.searchArtistsList.appendChild(frag);
      }
    }

    // 3. Render Song Results List (max 8 in dropdown)
    this.currentSearchSongs = results || [];
    if (this.searchResultsList) {
      this.searchResultsList.innerHTML = '';
      if (!results || results.length === 0) {
        if (!isPreview) {
          this.searchResultsList.innerHTML = `<div style="padding:14px;color:var(--text-secondary);text-align:center;font-size:13px;">No songs found for "${query}"</div>`;
        }
      } else {
        const frag = document.createDocumentFragment();
        const currentId = this.currentTrack ? this.currentTrack.id : (this.queue[this.currentTrackIndex]?.id);

        results.slice(0, 8).forEach(track => {
          const isDl = this.isDownloaded(track.id);
          const isCurrent = currentId && String(currentId) === String(track.id);
          const isPlayingThis = isCurrent && this.isPlaying;

          const row = document.createElement('div');
          row.className = `search-item ${isCurrent ? 'is-active' : ''}`;
          row.dataset.songId = track.id;
          row.innerHTML = `
            <img src="${track.cover}" alt="${track.title}" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'" loading="lazy" decoding="async">
            <div class="search-item-info">
              <div class="search-item-title" style="cursor:pointer;">${track.title}</div>
              <div class="search-item-meta">${this.renderClickableArtists(track)} • ${track.album || 'Single'}</div>
            </div>
            <div class="search-item-actions">
              <button class="icon-btn search-item-action-btn search-item-dl-btn ${isDl ? 'downloaded' : ''}" data-track-id="${track.id}" title="${isDl ? 'Downloaded' : 'Download Lossless'}" aria-label="Download ${track.title}">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
              </button>
              <button class="icon-btn search-item-action-btn search-item-play-btn ${isPlayingThis ? 'is-playing' : ''}" data-track-id="${track.id}" title="${isPlayingThis ? 'Pause' : 'Play Now'}" aria-label="${isPlayingThis ? 'Pause' : 'Play Now'}">
                ${isPlayingThis
                  ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'
                  : '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'}
              </button>
            </div>
          `;
          row.addEventListener('click', (e) => {
            if (e.target.closest('.artist-link')) {
              e.stopPropagation();
              const aName = e.target.closest('.artist-link').dataset.artist;
              if (aName) this.openArtistView(aName, aName);
              return;
            }
            if (e.target.closest('.search-item-dl-btn')) {
              e.stopPropagation();
              this.handleDownloadClick(e.target.closest('.search-item-dl-btn'), track);
              return;
            }
            const playBtn = e.target.closest('.search-item-play-btn');
            if (playBtn) {
              e.stopPropagation();
              e.preventDefault();
              this.playSearchTrack(track, results, query);
              return;
            }
            // Clicking row body also plays track
            this.playSearchTrack(track, results, query);
          });
          frag.appendChild(row);
        });

        // View All Row
        const viewAllRow = document.createElement('div');
        viewAllRow.className = 'search-dropdown-view-all';
        viewAllRow.style.cssText = 'padding:12px;text-align:center;font-size:12px;font-weight:600;color:var(--accent-red);cursor:pointer;border-top:1px solid var(--border-subtle);transition:background 0.2s;';
        viewAllRow.innerHTML = `View all search results for "<b>${query}</b>" →`;
        viewAllRow.addEventListener('click', () => {
          this.addSearchHistory(query);
          this.openSearchView(query);
        });
        frag.appendChild(viewAllRow);
        this.searchResultsList.appendChild(frag);
      }
    }

    this.applySearchCategoryFilter();
  }

  async performLiveSearch(query, forceImmediate = false) {
    const cleanQuery = (query || "").trim();
    if (!cleanQuery) return;
    const cacheKey = cleanQuery.toLowerCase();

    // 1. Instant response if in client cache (0ms)
    if (this.clientSearchCache && this.clientSearchCache.has(cacheKey) && !forceImmediate) {
      const cached = this.clientSearchCache.get(cacheKey);
      this.renderSearchResults(cached.results, cached.artists, cleanQuery);
      return;
    }

    // 2. Monotonic sequence & Abort previous request to eliminate lag & stale race conditions
    const currentSeq = ++this.searchSeq;
    if (this.searchAbortController) {
      try {
        this.searchAbortController.abort();
      } catch (err) { }
    }
    this.searchAbortController = new AbortController();

    try {
      // 3. Deduplicate in-flight requests for identical queries
      let fetchPromise;
      if (this.inFlightSearches && this.inFlightSearches.has(cacheKey)) {
        fetchPromise = this.inFlightSearches.get(cacheKey);
      } else {
        fetchPromise = fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(cleanQuery)}`, {
          signal: this.searchAbortController.signal
        }).then(async res => {
          if (!res.ok) throw new Error("Search request failed");
          return res.json();
        }).finally(() => {
          if (this.inFlightSearches) this.inFlightSearches.delete(cacheKey);
        });
        if (this.inFlightSearches) this.inFlightSearches.set(cacheKey, fetchPromise);
      }

      const data = await fetchPromise;
      const results = data.results || [];
      const artists = data.artists || [];
      const albums = data.albums || [];
      const topResult = data.topResult || null;

      // Save to bounded client cache with timestamp
      if (this.clientSearchCache) {
        this.clientSearchCache.set(cacheKey, { results, artists, albums, topResult, timestamp: Date.now() });
        if (this.clientSearchCache.size > 80) {
          const firstKey = this.clientSearchCache.keys().next().value;
          this.clientSearchCache.delete(firstKey);
        }
      }

      // Stale response guard: check sequence ID and current input value
      if (currentSeq !== this.searchSeq) return;
      if (this.searchInput && this.searchInput.value.trim().toLowerCase() !== cacheKey) return;

      this.renderSearchResults(results, artists, cleanQuery);
    } catch (e) {
      if (e.name === "AbortError") return; // Cancelled cleanly by newer keystroke
      console.warn("Live search notice:", e);
      if (this.searchResultsList && (!this.currentSearchSongs || this.currentSearchSongs.length === 0)) {
        this.searchResultsList.innerHTML = `<div style="padding:14px;color:var(--text-secondary);text-align:center;font-size:13px;">No results found. Try another song or artist name.</div>`;
      }
    }
  }

  async fetchTrackLyrics(track) {
    if (!track || track.lyricsLoaded) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/lyrics?track=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`);
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
      const res = await fetch(`${API_BASE_URL}/api/trending?category=${filter}`);
      const data = await res.json();
      const songs = data.songs || [];
      if (songs.length > 0) {
        this.quickPicks = songs.slice(0, 16);
        // Update the shelves with the filtered songs WITHOUT starting playback
        this.renderShelves();
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
  // ===========================================================================
  // Centralized Playback Controller
  // ===========================================================================
  playActualTrack(track, context = null) {
    if (!track) return;
    this.currentTrack = track;
    if (context) {
      this.playbackContext = context;
    }

    // Reset bounded retry count on intentional track play
    this.playbackRetryCount = 0;

    // Track recently played IDs window (keep last 30 for diversity scoring)
    if (track.id) {
      this.recentlyPlayedIds = this.recentlyPlayedIds.filter(id => String(id) !== String(track.id));
      this.recentlyPlayedIds.unshift(track.id);
      if (this.recentlyPlayedIds.length > 30) {
        this.recentlyPlayedIds.pop();
      }
      localStorage.setItem('rea_recently_played_ids', JSON.stringify(this.recentlyPlayedIds));
    }

    const pArtist = (track.artist || '').split(/[,&/|]|\bfeat\.?\b|\bft\.?\b/i)[0].replace(/\([^)]*\)/g, '').trim().toLowerCase();
    const isNewArtistSeed = !this.currentSeedArtist || this.currentSeedArtist !== pArtist;

    // When an intentional user selection plays or artist changes, purge stale recommendations
    // (Preserve during continuous queue transitions like autoplay or manual_queue)
    const isQueueAdvancing = context?.type === 'autoplay' || context?.type === 'manual_queue';
    if (!isQueueAdvancing && (isNewArtistSeed || context?.type === 'search' || context?.type === 'card_click' || context?.type === 'song')) {
      this.recommendationQueue = [];
      this.currentSeedArtist = pArtist;
    }

    // Synchronize legacy this.queue and this.currentTrackIndex for backward-compatibility
    const remainingSequence = (this.sequenceQueue && this.sequenceIndex >= 0) 
      ? this.sequenceQueue.slice(this.sequenceIndex + 1) 
      : [];
    this.queue = [
      track,
      ...this.manualQueue,
      ...remainingSequence,
      ...this.recommendationQueue
    ];
    this.currentTrackIndex = 0;

    // Play via HybridAudioEngine
    this.engine.playTrack(track);
    this.isPlaying = true;

    // Record listening start in service
    if (this.listeningHistoryService) {
      this.listeningHistoryService.onTrackStarted(track, context);
    }

    // Synchronize UI
    this.renderPlayerInfo();
    this.updatePlayPauseUI();
    this.renderQueue();
    this.renderShelves();
    this.recordHistory(track);
    this.fetchTrackLyrics(track);
    this.renderRelatedPane();

    // Background smart recommendations: refresh when new seed artist is played or queue runs low
    if (this.autoplayEnabled) {
      if (context?.type !== 'autoplay' || isNewArtistSeed || this.recommendationQueue.length < 5) {
        this.prefetchSmartRecommendations(track, isNewArtistSeed);
      }
    }
  }

  advanceTrack(source = 'manual') {
    if (!this.currentTrack && (!this.manualQueue || this.manualQueue.length === 0) && (!this.sequenceQueue || this.sequenceQueue.length === 0)) {
      return;
    }
    if (source === 'manual' && this.currentTrack && this.listeningHistoryService) {
      this.listeningHistoryService.onTrackSkipped(this.currentTrack);
    }
    if (this.isTransitioning) {
      console.log('[Playback] Transition lock active, ignoring advance request');
      return;
    }
    this.isTransitioning = true;
    setTimeout(() => { this.isTransitioning = false; }, 400);

    // 1. Repeat One (only on automatic track completion)
    if (source === 'auto' && this.repeatMode === 'one') {
      this.engine.seek(0);
      this.engine.play();
      this.isTransitioning = false;
      return;
    }

    // 2. Priority: Next in Manual Queue
    if (this.manualQueue.length > 0) {
      const nextManual = this.manualQueue.shift();
      this.playActualTrack(nextManual, { type: 'manual_queue' });
      return;
    }

    // 3. Active Sequence Queue (Album / Playlist / Artist / Multi-track)
    if (this.sequenceQueue && this.sequenceQueue.length > 0 && this.sequenceIndex + 1 < this.sequenceQueue.length) {
      let targetIndex = this.sequenceIndex + 1;
      if (this.isShuffle) {
        const remainingIndices = [];
        for (let i = this.sequenceIndex + 1; i < this.sequenceQueue.length; i++) {
          remainingIndices.push(i);
        }
        if (remainingIndices.length > 0) {
          const rand = Math.floor(Math.random() * remainingIndices.length);
          targetIndex = remainingIndices[rand];
        }
      }
      this.sequenceIndex = targetIndex;
      const nextSequenceTrack = this.sequenceQueue[targetIndex];
      this.playActualTrack(nextSequenceTrack, this.playbackContext);
      return;
    }

    // 4. Repeat All for Sequence Queue
    if (this.repeatMode === 'all' && this.sequenceQueue && this.sequenceQueue.length > 0) {
      this.sequenceIndex = 0;
      this.playActualTrack(this.sequenceQueue[0], this.playbackContext);
      return;
    }

    // 5. Intelligent Autoplay Continuation
    if (this.autoplayEnabled) {
      if (this.recommendationQueue.length > 0) {
        const nextReco = this.recommendationQueue.shift();
        this.playActualTrack(nextReco, { type: 'autoplay', seedTrack: this.currentTrack });
        if (this.recommendationQueue.length < 5) {
          this.prefetchSmartRecommendations(nextReco);
        }
        return;
      }

      // If recommendations are being loaded or empty, generate now
      const seed = this.currentTrack;
      if (!seed) {
        this.stopPlaybackGracefully('Queue finished');
        return;
      }
      this.showToast('Autoplay: Finding next song...');
      this.generateSmartRecommendations(seed).then(recs => {
        if (recs && recs.length > 0) {
          const nextReco = this.recommendationQueue.shift();
          this.playActualTrack(nextReco, { type: 'autoplay', seedTrack: seed });
          if (this.recommendationQueue.length < 5) {
            this.prefetchSmartRecommendations(nextReco);
          }
        } else {
          this.stopPlaybackGracefully('Queue finished');
        }
      }).catch(err => {
        console.warn('[Autoplay] Generation error:', err);
        this.stopPlaybackGracefully('Queue finished');
      });
      return;
    }

    // 6. Autoplay Off & Nothing Remaining -> Graceful Stop
    this.stopPlaybackGracefully('Queue finished');
  }

  stopPlaybackGracefully(reason = '') {
    this.isTransitioning = false;
    this.engine.pause();
    this.isPlaying = false;
    this.updatePlayPauseUI();
    this.syncMediaControls();
    this.renderQueue();
    if (reason) this.showToast(reason);
  }

  handlePlaybackError(err, track) {
    if (err && (err.name === 'NotAllowedError' || err.code === 20)) {
      console.info('[PlaybackController] Browser autoplay deferred until user interaction');
      this.isPlaying = false;
      this.updatePlayPauseUI();
      return;
    }
    console.warn('[PlaybackController] Audio stream error encountered:', err, track);
    this.playbackRetryCount = (this.playbackRetryCount || 0) + 1;

    if (this.playbackRetryCount <= 3) {
      const name = track ? track.title : 'song';
      this.showToast(`Audio unavailable for "${name}". Skipping to next...`);
      setTimeout(() => {
        this.advanceTrack('error');
      }, 400);
    } else {
      this.playbackRetryCount = 0;
      this.isTransitioning = false;
      this.engine.pause();
      this.isPlaying = false;
      this.updatePlayPauseUI();
      this.showToast('Playback paused: Could not stream upcoming tracks');
    }
  }

  playTrack(index) {
    if (index < 0 || index >= this.queue.length) return;
    const target = this.queue[index];
    this.playActualTrack(target);
  }

  togglePlayPause() {
    if (!this.isPlaying) {
      if (!this.engine.currentTrack) {
        if (this.currentTrack) {
          this.playActualTrack(this.currentTrack);
        } else if (this.sequenceQueue && this.sequenceQueue.length > 0 && this.sequenceIndex >= 0 && this.sequenceIndex < this.sequenceQueue.length) {
          this.playActualTrack(this.sequenceQueue[this.sequenceIndex], this.playbackContext);
        } else if (this.manualQueue && this.manualQueue.length > 0) {
          const nextManual = this.manualQueue.shift();
          this.playActualTrack(nextManual, { type: 'manual_queue' });
        } else if (this.queue && this.queue.length > 0 && this.currentTrackIndex >= 0 && this.queue[this.currentTrackIndex]) {
          const track = this.queue[this.currentTrackIndex];
          this.playActualTrack(track);
        } else {
          // No active track selected - do not autoplay fallback song
          return;
        }
      } else {
        this.engine.resume();
        this.isPlaying = true;
        this.updatePlayPauseUI();
        if (typeof this.startVisualizerLoop === 'function') {
          this.startVisualizerLoop();
        }
      }
    } else {
      this.engine.pause();
      this.isPlaying = false;
      this.updatePlayPauseUI();
      if (typeof this.stopVisualizerLoop === 'function') {
        this.stopVisualizerLoop();
      }
    }
    this.syncMediaControls();
    this.renderShelves();
  }

  nextTrack() {
    this.advanceTrack('manual');
  }

  prevTrack() {
    if (!this.currentTrack) return;
    if (this.engine.audio.currentTime > 3) {
      this.engine.seek(0);
      return;
    }
    if (this.sequenceQueue && this.sequenceIndex > 0) {
      this.sequenceIndex--;
      this.playActualTrack(this.sequenceQueue[this.sequenceIndex], this.playbackContext);
      return;
    }
    this.engine.seek(0);
  }

  // ===========================================================================
  // Playback Modes (Repeat, Shuffle, Autoplay)
  // ===========================================================================
  cycleRepeatMode() {
    const modes = ['off', 'all', 'one'];
    const curIdx = modes.indexOf(this.repeatMode);
    this.repeatMode = modes[(curIdx + 1) % modes.length];
    localStorage.setItem('rea_repeat_mode', this.repeatMode);
    this.syncRepeatUI();
    const label = this.repeatMode === 'one' ? 'Repeat One' : this.repeatMode === 'all' ? 'Repeat All' : 'Repeat Off';
    this.showToast(`Repeat: ${label}`);
  }

  syncRepeatUI() {
    const isActive = this.repeatMode !== 'off';
    const isOne = this.repeatMode === 'one';
    [this.repeatBtn, this.maxRepeatBtn].forEach(btn => {
      if (!btn) return;
      btn.style.color = isActive ? (isOne ? '#0071e3' : '#fff') : '#888';
      btn.title = `Repeat: ${this.repeatMode}`;
      btn.classList.toggle('active', isActive);
      btn.classList.toggle('repeat-one', isOne);
    });
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    localStorage.setItem('rea_shuffle', this.isShuffle ? 'true' : 'false');
    this.syncShuffleUI();
    this.showToast(this.isShuffle ? 'Shuffle On' : 'Shuffle Off');
  }

  syncShuffleUI() {
    [this.shuffleBtn, this.maxShuffleBtn].forEach(btn => {
      if (!btn) return;
      btn.style.color = this.isShuffle ? '#0071e3' : '#888';
      btn.classList.toggle('active', this.isShuffle);
    });
  }

  toggleAutoplay() {
    this.setAutoplay(!this.autoplayEnabled);
  }

  setAutoplay(enabled) {
    this.autoplayEnabled = Boolean(enabled);
    localStorage.setItem('rea_autoplay_enabled', this.autoplayEnabled ? 'true' : 'false');
    this.syncAutoplayUI();
    this.showToast(this.autoplayEnabled ? 'Autoplay On: Continuous discovery' : 'Autoplay Off');
    if (this.autoplayEnabled && this.recommendationQueue.length === 0 && this.currentTrack) {
      this.prefetchSmartRecommendations(this.currentTrack);
    }
  }

  syncAutoplayUI() {
    if (this.barAutoplayBtn) {
      this.barAutoplayBtn.classList.toggle('active', this.autoplayEnabled);
      this.barAutoplayBtn.title = `Autoplay is ${this.autoplayEnabled ? 'On' : 'Off'} • Continuous music discovery`;
    }
    if (this.queueAutoplayToggle) {
      this.queueAutoplayToggle.checked = this.autoplayEnabled;
    }
    if (this.maxAutoplayToggle) {
      this.maxAutoplayToggle.checked = this.autoplayEnabled;
    }
  }

  // ===========================================================================
  // Queue Management (Manual Queue & Recommendations)
  // ===========================================================================
  addToPlayNext(track) {
    if (!track) return;
    this.manualQueue.unshift(track);
    this.renderQueue();
    this.showToast(`Playing next: "${track.title}"`);
  }

  addToManualQueue(track) {
    if (!track) return;
    this.manualQueue.push(track);
    this.renderQueue();
    this.showToast(`Added to queue: "${track.title}"`);
  }

  removeFromManualQueue(index) {
    if (index >= 0 && index < this.manualQueue.length) {
      const removed = this.manualQueue.splice(index, 1)[0];
      this.renderQueue();
      if (removed) this.showToast(`Removed: "${removed.title}"`);
    }
  }

  clearManualQueue() {
    if (this.manualQueue.length === 0) return;
    this.manualQueue = [];
    this.renderQueue();
    this.showToast('Manual queue cleared');
  }

  moveManualQueueItem(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.manualQueue.length || toIndex < 0 || toIndex >= this.manualQueue.length) return;
    const [item] = this.manualQueue.splice(fromIndex, 1);
    this.manualQueue.splice(toIndex, 0, item);
    this.renderQueue();
  }

  playRecommendation(track) {
    if (!track) return;
    this.recommendationQueue = this.recommendationQueue.filter(t => String(t.id) !== String(track.id));
    this.playActualTrack(track, { type: 'recommendation_selection' });
    this.showToast(`Playing recommendation: "${track.title}"`);
  }

  addRecommendationToQueue(track) {
    if (!track) return;
    this.recommendationQueue = this.recommendationQueue.filter(t => String(t.id) !== String(track.id));
    this.manualQueue.push(track);
    this.renderQueue();
    this.showToast(`Added to manual queue: "${track.title}"`);
  }

  dismissRecommendation(trackId) {
    if (!trackId) return;
    this.dismissedTrackIds.add(String(trackId));
    localStorage.setItem('rea_dismissed_ids', JSON.stringify([...this.dismissedTrackIds]));
    this.recommendationQueue = this.recommendationQueue.filter(t => String(t.id) !== String(trackId));
    this.renderQueue();
    this.showToast('Track dismissed (Not interested)');
  }

  async refreshRecommendations() {
    const seed = this.currentTrack;
    if (!seed) return;
    this.showToast('Refreshing recommendations...');
    if (seed.id) {
      this.recommendationCache.delete(seed.id);
    }
    await this.generateSmartRecommendations(seed, { force: true });
    this.renderQueue();
  }

  // ===========================================================================
  // Smart Autoplay & Artist-Based Recommendation Priority Engine
  // Default Target Allocation: 60% Same Artist, 25% Related Artists, 15% Discovery
  // ===========================================================================
  async generateSmartRecommendations(seedTrack, options = {}) {
    if (!seedTrack) return [];
    const seedId = seedTrack.id || '';

    // Race condition prevention: track request ID to cancel/ignore stale fetches
    this.currentRecommendationRequestId = (this.currentRecommendationRequestId || 0) + 1;
    const currentRequestId = this.currentRecommendationRequestId;

    if (this.recoAbortController) {
      try { this.recoAbortController.abort(); } catch (_) {}
    }
    this.recoAbortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const signal = this.recoAbortController?.signal;

    // Fast-path: Check in-memory recommendation cache for this seed
    if (!options.force && seedId && this.recommendationCache.has(seedId)) {
      const cached = this.recommendationCache.get(seedId);
      if (cached && cached.length > 0) {
        const validCached = cached.filter(t => 
          !this.dismissedTrackIds.has(String(t.id)) && 
          String(t.id) !== String(this.currentTrack?.id)
        );
        if (validCached.length >= 4) {
          this.recommendationQueue = validCached;
          this.renderQueue();
          return this.recommendationQueue;
        }
      }
    }

    const rawArtistName = seedTrack.artist || 'Arijit Singh';
    const artistTokens = rawArtistName
      .split(/[,&/|]|\bfeat\.?\b|\bft\.?\b/i)
      .map(a => a.replace(/\([^)]*\)/g, '').trim())
      .filter(Boolean);

    // Primary artist resolution: match current search query or active artist context if applicable
    let primaryArtist = seedTrack.primaryArtist || artistTokens[0] || rawArtistName;
    if (this.currentView === 'search' && this.lastSearchQuery) {
      const qLower = this.lastSearchQuery.toLowerCase();
      const matched = artistTokens.find(t => qLower.includes(t.toLowerCase()) || t.toLowerCase().includes(qLower));
      if (matched) primaryArtist = matched;
    } else if (this.currentView === 'artist' && this.currentArtistName) {
      primaryArtist = this.currentArtistName;
    }
    const primaryArtistLower = primaryArtist.toLowerCase();

    const seedTags = detectTrackTags(seedTrack);
    const primaryGenre = seedTags.genres[0] || 
      (seedTrack.language === 'punjabi' ? 'punjabi' : 
       seedTrack.language === 'haryanvi' ? 'haryanvi' : 'bollywood');
    const songLang = (seedTrack.language || seedTags.languages[0] || 'hindi').toLowerCase();

    // 1. Concurrently fetch Candidate Pools
    const candidatePromises = [];

    // Source A: Dedicated Artist Page API (returns full discography 20+ tracks and similar artists)
    candidatePromises.push(
      fetch(`${API_BASE_URL}/api/artist?name=${encodeURIComponent(primaryArtist)}`, { signal })
        .then(r => r.ok ? r.json() : null)
        .catch(() => null)
    );

    // Source B: Recommendations endpoint (artist search & curated recommendations)
    candidatePromises.push(
      fetch(`${API_BASE_URL}/api/recommendations?artist=${encodeURIComponent(primaryArtist)}&trackId=${encodeURIComponent(seedId)}&limit=20`, { signal })
        .then(r => r.ok ? r.json() : null)
        .then(d => (d && d.recommendations) ? d.recommendations : [])
        .catch(() => [])
    );

    // Source C: Song detail related tracks (if authentic JioSaavn song ID)
    if (seedId && !seedId.startsWith('track-') && !seedId.startsWith('chart-')) {
      candidatePromises.push(
        fetch(`${API_BASE_URL}/api/song?id=${encodeURIComponent(seedId)}`, { signal })
          .then(r => r.ok ? r.json() : null)
          .then(d => (d && d.related) ? d.related : [])
          .catch(() => [])
      );
    } else {
      candidatePromises.push(Promise.resolve([]));
    }

    // Source D: Trending hits for regional scene/language
    const trendingCategory = primaryGenre === 'punjabi' ? 'punjabi' : 
                             primaryGenre === 'haryanvi' ? 'all' : 
                             primaryGenre === 'indie' ? 'all' : 'superhits';
    candidatePromises.push(
      fetch(`${API_BASE_URL}/api/trending?category=${encodeURIComponent(trendingCategory)}`, { signal })
        .then(r => r.ok ? r.json() : null)
        .catch(() => null)
    );

    const [artistData, recoSongs, songRelated, trendingData] = await Promise.all(candidatePromises);

    // Verify if this async response has been superseded by a newer track selection
    if (currentRequestId !== this.currentRecommendationRequestId) {
      console.log(`[Autoplay] Ignoring superseded recommendation request #${currentRequestId}`);
      return [];
    }

    // 2. Identify Related Scene Artists for Pool 2 (25% quota)
    const relatedArtistNames = new Set();
    if (artistData && Array.isArray(artistData.similarArtists)) {
      artistData.similarArtists.forEach(a => {
        const aName = (a.name || a.title || '').trim();
        if (aName && aName.toLowerCase() !== primaryArtistLower) {
          relatedArtistNames.add(aName);
        }
      });
    }
    if (REGIONAL_ARTISTS[primaryGenre]) {
      REGIONAL_ARTISTS[primaryGenre].forEach(a => {
        if (a && a.toLowerCase() !== primaryArtistLower) {
          const cap = a.replace(/\b\w/g, c => c.toUpperCase());
          relatedArtistNames.add(cap);
        }
      });
    }

    // Fetch related artist tracks in parallel (top 2-3 related artists)
    const topRelatedArtists = Array.from(relatedArtistNames).slice(0, 3);
    const relatedArtistPromises = topRelatedArtists.map(relName =>
      fetch(`${API_BASE_URL}/api/recommendations?artist=${encodeURIComponent(relName)}&limit=6`, { signal })
        .then(r => r.ok ? r.json() : null)
        .then(d => (d && d.recommendations) ? d.recommendations : [])
        .catch(() => [])
    );

    const relatedPools = await Promise.all(relatedArtistPromises);

    // Re-check request ID after secondary promises
    if (currentRequestId !== this.currentRecommendationRequestId) {
      return [];
    }

    // 3. Build Exclusion Sets
    const seenIds = new Set();
    const seenTitles = new Set();

    if (seedId) seenIds.add(String(seedId));
    if (this.currentTrack?.id) seenIds.add(String(this.currentTrack.id));
    if (seedTrack.title) seenTitles.add(seedTrack.title.toLowerCase().trim());

    // Exclude manual queue and remaining album sequence items
    this.manualQueue.forEach(t => t?.id && seenIds.add(String(t.id)));
    if (this.sequenceQueue && this.playbackContext?.type === 'album') {
      for (let i = this.sequenceIndex + 1; i < this.sequenceQueue.length; i++) {
        if (this.sequenceQueue[i]?.id) seenIds.add(String(this.sequenceQueue[i].id));
      }
    }

    // Exclude user dismissed tracks
    this.dismissedTrackIds.forEach(id => seenIds.add(String(id)));

    // Track recently skipped and recently played for penalty / diversity filtering
    const skippedIds = new Set(this.listeningHistoryService?.recentlySkippedTrackIds || []);
    const recentPlayedIds = new Set(this.recentlyPlayedIds || []);

    const isAvailableCandidate = (cand) => {
      if (!cand || !cand.id || !cand.title) return false;
      const cId = String(cand.id);
      const cTitle = (cand.title || '').toLowerCase().trim();
      if (seenIds.has(cId) || seenTitles.has(cTitle)) return false;
      return true;
    };

    // 4. Partition Candidates into Pools (60% Same Artist, 25% Related Artists, 15% Discovery)
    const TARGET_QUEUE_SIZE = 12;
    const TARGET_SAME_ARTIST = 7;     // ~60%
    const TARGET_RELATED_ARTISTS = 3; // ~25%
    const TARGET_DISCOVERY = 2;       // ~15%

    // --- POOL 1: Same Artist Candidates ---
    const artistRawSongs = [
      ...(artistData?.songs || []),
      ...(recoSongs || [])
    ];

    const sameArtistPool = [];
    artistRawSongs.forEach(cand => {
      if (!isAvailableCandidate(cand)) return;
      const cArtist = (cand.artist || '').toLowerCase();
      // Match primary artist or any seed artist tokens
      const matchesArtist = cArtist.includes(primaryArtistLower) || primaryArtistLower.includes(cArtist) ||
        artistTokens.some(tok => {
          const tokLower = tok.toLowerCase();
          return tokLower.length >= 3 && (cArtist.includes(tokLower) || tokLower.includes(cArtist));
        });

      if (matchesArtist) {
        const isSkipped = skippedIds.has(String(cand.id));
        const isRecent = recentPlayedIds.has(String(cand.id));
        if (isSkipped && sameArtistPool.length >= TARGET_SAME_ARTIST) return;

        cand._reason = `More from ${primaryArtist}`;
        cand._reasonBadge = 'badge-artist';
        cand._isSameArtist = true;
        cand._isSkipped = isSkipped;
        cand._isRecent = isRecent;

        cand._score = this.recommendationEngine ? this.recommendationEngine.scoreCandidate(cand, [seedTrack]) : 50;
        if (isSkipped) cand._score -= 50;
        if (isRecent) cand._score -= 30;

        sameArtistPool.push(cand);
      }
    });

    sameArtistPool.sort((a, b) => (b._score || 0) - (a._score || 0));

    // --- POOL 2: Related Artists Candidates ---
    const relatedArtistRawSongs = [
      ...relatedPools.flat(),
      ...(songRelated || []),
      ...(trendingData?.haryanviHits && primaryGenre === 'haryanvi' ? trendingData.haryanviHits : []),
      ...(trendingData?.punjabiHits && primaryGenre === 'punjabi' ? trendingData.punjabiHits : []),
      ...(trendingData?.bollywoodHits && primaryGenre === 'bollywood' ? trendingData.bollywoodHits : []),
      ...(trendingData?.indieHits && primaryGenre === 'indie' ? trendingData.indieHits : [])
    ];

    const relatedArtistPool = [];
    relatedArtistRawSongs.forEach(cand => {
      if (!isAvailableCandidate(cand)) return;
      const cArtist = (cand.artist || '').toLowerCase();
      if (cArtist.includes(primaryArtistLower)) return;

      const matchedRelArtist = topRelatedArtists.find(r => cArtist.includes(r.toLowerCase())) ||
                               cand.artist.split(',')[0].trim();

      const isSkipped = skippedIds.has(String(cand.id));
      const isRecent = recentPlayedIds.has(String(cand.id));
      if (isSkipped && relatedArtistPool.length >= TARGET_RELATED_ARTISTS) return;

      cand._reason = `Similar artist: ${matchedRelArtist}`;
      cand._reasonBadge = 'badge-related';
      cand._isRelatedArtist = true;
      cand._score = this.recommendationEngine ? this.recommendationEngine.scoreCandidate(cand, [seedTrack]) : 40;
      if (isSkipped) cand._score -= 50;
      if (isRecent) cand._score -= 30;

      relatedArtistPool.push(cand);
    });

    relatedArtistPool.sort((a, b) => (b._score || 0) - (a._score || 0));

    // --- POOL 3: Personalized Discoveries & Taste Matching ---
    const topUserArtists = this.artistAffinityService ? this.artistAffinityService.getTopArtists(5) : [];
    const hasListeningHistory = topUserArtists.length > 0 || (this.likedTracks && this.likedTracks.length > 0);

    const discoveryRawSongs = [
      ...(this.likedTracks || []),
      ...(trendingData?.trendingHits || []),
      ...(trendingData?.quickPicks || []),
      ...(this.quickPicks || []),
      ...(FALLBACK_TRACKS || [])
    ];

    const discoveryPool = [];
    discoveryRawSongs.forEach(cand => {
      if (!isAvailableCandidate(cand)) return;
      const cArtist = (cand.artist || '').toLowerCase();
      if (cArtist.includes(primaryArtistLower)) return;

      const isLiked = this.likedTrackIds?.has(cand.id);
      const isAffinity = topUserArtists.some(a => cArtist.includes(a.artist.toLowerCase()));

      let reason = 'Trending discovery';
      let reasonBadge = 'badge-discovery';

      if (isLiked) {
        reason = 'From your Liked Songs';
        reasonBadge = 'badge-liked';
      } else if (isAffinity || hasListeningHistory) {
        reason = 'Based on your listening';
        reasonBadge = 'badge-discovery';
      }

      cand._reason = reason;
      cand._reasonBadge = reasonBadge;
      cand._score = this.recommendationEngine ? this.recommendationEngine.scoreCandidate(cand, [seedTrack]) : 30;

      discoveryPool.push(cand);
    });

    discoveryPool.sort((a, b) => (b._score || 0) - (a._score || 0));

    // 5. Select Quotas and Handle Artist Exhaustion (Graceful Fallback)
    const selectedSameArtist = sameArtistPool.slice(0, TARGET_SAME_ARTIST);
    const sameArtistDeficit = TARGET_SAME_ARTIST - selectedSameArtist.length;

    const neededRelated = TARGET_RELATED_ARTISTS + Math.ceil(sameArtistDeficit * 0.7);
    const selectedRelated = [];
    const relatedArtistCounts = new Map();

    for (const cand of relatedArtistPool) {
      if (selectedSameArtist.some(s => s.id === cand.id)) continue;
      const art = (cand.artist || 'various').split(',')[0].trim().toLowerCase();
      const count = relatedArtistCounts.get(art) || 0;
      if (count < 2) {
        relatedArtistCounts.set(art, count + 1);
        selectedRelated.push(cand);
        if (selectedRelated.length >= neededRelated) break;
      }
    }

    const neededDiscovery = TARGET_DISCOVERY + Math.floor(sameArtistDeficit * 0.3);
    const selectedDiscovery = [];
    for (const cand of discoveryPool) {
      if (selectedSameArtist.some(s => s.id === cand.id)) continue;
      if (selectedRelated.some(r => r.id === cand.id)) continue;
      selectedDiscovery.push(cand);
      if (selectedDiscovery.length >= neededDiscovery) break;
    }

    // 6. Intelligent Queue Interleaving
    // The immediate next tracks prioritize the same artist first (slots 1, 2, 3),
    // followed by related artists and discoveries.
    const finalQueue = [];
    const usedIds = new Set();

    const pushTrack = (t) => {
      if (!t || !t.id || usedIds.has(String(t.id))) return;
      usedIds.add(String(t.id));
      finalQueue.push(t);
    };

    // Immediate tracks: Same artist (up to 3 tracks immediately)
    for (let i = 0; i < 3 && i < selectedSameArtist.length; i++) {
      pushTrack(selectedSameArtist[i]);
    }

    let saIdx = 3;
    let relIdx = 0;
    let discIdx = 0;

    // Interleave remaining: Same Artist, Related Artist, Same Artist, Related Artist, Discovery, etc.
    while (finalQueue.length < TARGET_QUEUE_SIZE && (saIdx < selectedSameArtist.length || relIdx < selectedRelated.length || discIdx < selectedDiscovery.length)) {
      if (relIdx < selectedRelated.length) pushTrack(selectedRelated[relIdx++]);
      if (saIdx < selectedSameArtist.length) pushTrack(selectedSameArtist[saIdx++]);
      if (discIdx < selectedDiscovery.length) pushTrack(selectedDiscovery[discIdx++]);
      if (relIdx < selectedRelated.length) pushTrack(selectedRelated[relIdx++]);
      if (saIdx < selectedSameArtist.length) pushTrack(selectedSameArtist[saIdx++]);
    }

    // Fallback fill to reach at least 10 items if still short
    if (finalQueue.length < 10) {
      const fallbackPool = [...relatedArtistPool, ...discoveryPool, ...(this.quickPicks || [])];
      for (const cand of fallbackPool) {
        if (!usedIds.has(String(cand.id))) {
          pushTrack(cand);
          if (finalQueue.length >= TARGET_QUEUE_SIZE) break;
        }
      }
    }

    // Final race check before updating state
    if (currentRequestId !== this.currentRecommendationRequestId) {
      return [];
    }

    this.recommendationQueue = finalQueue;
    if (seedId) {
      this.recommendationCache.set(seedId, finalQueue);
    }
    this.renderQueue();
    return finalQueue;
  }

  async prefetchSmartRecommendations(seedTrack, force = false) {
    if (!seedTrack) return;
    if (this.isPrefetchingRecommendations && !force) return;
    this.isPrefetchingRecommendations = true;
    try {
      await this.generateSmartRecommendations(seedTrack, { force });
    } catch (e) {
      console.warn('[Autoplay] Prefetch notice:', e);
    } finally {
      this.isPrefetchingRecommendations = false;
    }
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

    if (this.songPlayHeroBtn) {
      const isCurrent = this.currentSongDetail && this.queue[this.currentTrackIndex]?.id === this.currentSongDetail.id;
      const textSpan = this.songPlayHeroBtn.querySelector('span');
      if (textSpan) {
        textSpan.textContent = (isCurrent && this.isPlaying) ? 'Pause Song' : 'Play Song';
      }
    }

    // Synchronize Search Dropdown Play Buttons
    const currentId = this.currentTrack ? this.currentTrack.id : (this.queue[this.currentTrackIndex]?.id);
    const searchPlayBtns = document.querySelectorAll('.search-item-play-btn[data-track-id]');
    searchPlayBtns.forEach(btn => {
      const isCurrent = currentId && String(btn.dataset.trackId) === String(currentId);
      const isPlayingThis = isCurrent && this.isPlaying;
      btn.classList.toggle('is-playing', Boolean(isPlayingThis));
      btn.title = isPlayingThis ? 'Pause' : 'Play Now';
      btn.setAttribute('aria-label', isPlayingThis ? 'Pause' : 'Play Now');
      btn.innerHTML = isPlayingThis
        ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'
        : '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      const parentRow = btn.closest('.search-item');
      if (parentRow) parentRow.classList.toggle('is-active', Boolean(isCurrent));
    });

    // Synchronize Search View & General Track Row Play Buttons
    const trackRowCards = document.querySelectorAll('.track-row-card[data-song-id]');
    trackRowCards.forEach(card => {
      const btn = card.querySelector('.track-row-play-btn');
      if (!btn) return;
      const isCurrent = currentId && String(card.dataset.songId) === String(currentId);
      const isPlayingThis = isCurrent && this.isPlaying;
      card.classList.toggle('is-active', Boolean(isCurrent));
      btn.classList.toggle('is-playing', Boolean(isPlayingThis));
      btn.title = isPlayingThis ? 'Pause' : 'Play song';
      btn.setAttribute('aria-label', isPlayingThis ? 'Pause' : 'Play song');
      btn.innerHTML = isPlayingThis
        ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'
        : '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    });

    // Synchronize Search Top Result Card (if Song)
    const topSongCard = document.querySelector('.top-result-card[data-song-id]');
    if (topSongCard) {
      const btn = topSongCard.querySelector('.btn-top-play');
      if (btn) {
        const isCurrent = currentId && String(topSongCard.dataset.songId) === String(currentId);
        const isPlayingThis = isCurrent && this.isPlaying;
        const span = btn.querySelector('span');
        if (span) span.textContent = isPlayingThis ? 'Pause Song' : 'Play Song';
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.innerHTML = isPlayingThis
            ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
            : '<path d="M8 5v14l11-7z"/>';
        }
      }
    }
  }

  updateProgressBar(cur, dur) {
    if (!this.currentTrack) {
      if (this.progressBarFill) this.progressBarFill.style.width = '0%';
      if (this.scrubHandle) this.scrubHandle.style.left = '0%';
      if (this.currentTimeDisplay) this.currentTimeDisplay.textContent = '0:00';
      if (this.totalDurationDisplay) this.totalDurationDisplay.textContent = '0:00';
      if (this.maxProgressFill) this.maxProgressFill.style.width = '0%';
      if (this.maxProgressThumb) this.maxProgressThumb.style.left = '0%';
      if (this.maxTimeCurrent) this.maxTimeCurrent.textContent = '0:00';
      if (this.maxTimeTotal) this.maxTimeTotal.textContent = '0:00';
      return;
    }
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

    // Automatically prepare next songs before current song ends
    if (this.autoplayEnabled && this.recommendationQueue.length < 5 && !this.isPrefetchingRecommendations) {
      if (pct >= 50 || (dur - cur) <= 45) {
        this.prefetchSmartRecommendations(this.currentTrack);
      }
    }
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
    const track = this.currentTrack || (this.currentTrackIndex >= 0 ? this.queue[this.currentTrackIndex] : null);
    if (this.lyricsBody) {
      this.lyricsBody.innerHTML = '';

      if (!track) {
        this.lyricsBody.innerHTML = `
          <div class="empty-lyrics">
            <svg viewBox="0 0 24 24" width="40" height="40" style="opacity:0.35; margin-bottom: 8px;"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            <p style="font-weight:600;font-size:1rem;color:#fff;margin:4px 0;">No song playing</p>
            <p style="color:#888;font-size:0.85rem;">Play a track to view synchronized lyrics</p>
          </div>
        `;
      } else if (!track.lyrics || track.lyrics.length === 0) {
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

    if (this.lastActiveLyricIndex === activeIndex) return;
    const prevIndex = this.lastActiveLyricIndex;
    this.lastActiveLyricIndex = activeIndex;

    // 1. Update Mini Drawer Lyrics
    if (this.lyricsBody) {
      const lines = this.lyricsBody.children;
      if (prevIndex >= 0 && lines[prevIndex] && lines[prevIndex].classList) {
        lines[prevIndex].classList.remove('active');
      }
      if (activeIndex >= 0 && lines[activeIndex] && lines[activeIndex].classList) {
        const line = lines[activeIndex];
        line.classList.add('active');
        if (this.activeTab === 'lyrics') {
          const c = this.lyricsBody;
          const lRect = line.getBoundingClientRect();
          const cRect = c.getBoundingClientRect();
          const relTop = lRect.top - cRect.top + c.scrollTop;
          const target = relTop - (c.clientHeight / 2) + (line.clientHeight / 2);
          c.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
        }
      }
    }

    // 2. Update Maximized Theater Lyrics
    if (this.maxLyricsScroll) {
      const maxLines = this.maxLyricsScroll.children;
      if (prevIndex >= 0 && maxLines[prevIndex] && maxLines[prevIndex].classList) {
        maxLines[prevIndex].classList.remove('active-lyric');
      }
      if (activeIndex >= 0 && maxLines[activeIndex] && maxLines[activeIndex].classList) {
        const line = maxLines[activeIndex];
        line.classList.add('active-lyric');
        if (this.isPlayerMaximized && this.currentMaxTab !== 'queue') {
          const c = this.maxLyricsScroll;
          const lRect = line.getBoundingClientRect();
          const cRect = c.getBoundingClientRect();
          const relTop = lRect.top - cRect.top + c.scrollTop;
          const target = relTop - (c.clientHeight / 2) + (line.clientHeight / 2);
          c.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
        }
      }
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
    let rafId = null;

    const drawIdle = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = this.currentTheme === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.15)';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(i * 10 + 2, 20, 6, 2);
      }
    };

    const render = () => {
      if (!this.isPlaying || !this.engine.analyser) {
        drawIdle();
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.engine.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < 16; i++) sum += dataArray[i];

      const barWidth = 7;
      let x = 2;
      const now = Date.now() / 150;

      for (let i = 0; i < 8; i++) {
        let val = dataArray[i * 2] || 0;
        // If audio stream is CORS-restricted or AudioContext buffer is zeroed, provide organic rhythmic wave
        if (sum === 0 && this.isPlaying) {
          const wave = Math.sin(now + i * 0.85) * 0.4 + Math.cos(now * 0.6 + i * 1.2) * 0.3 + 0.35;
          val = Math.floor(Math.max(0.15, Math.min(1, wave)) * 230);
        }
        const barHeight = Math.max(3, (val / 255) * canvas.height);

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#FA2D48');
        gradient.addColorStop(1, '#FF375F');
        ctx.fillStyle = gradient;

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 3;
      }
    };

    // Draw idle state once on load
    drawIdle();

    this.startVisualizerLoop = () => {
      if (!rafId && this.isPlaying && this.engine.analyser) {
        rafId = requestAnimationFrame(render);
      }
    };

    this.stopVisualizerLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      drawIdle();
    };
  }

  // ===========================================================================
  // UI Rendering: Shelves, Player, Queue
  // ===========================================================================
  renderAll() {
    this.renderShelves();
    this.renderRecommendedShelf();
    this.renderExplore();
    this.renderPlayerInfo();
    this.renderQueue();
    this.renderSearchHub();
    this.syncAutoplayUI();
    this.syncRepeatUI();
    this.syncShuffleUI();
  }

  renderPlayerInfo() {
    const track = this.currentTrack || (this.currentTrackIndex >= 0 && this.queue[this.currentTrackIndex] ? this.queue[this.currentTrackIndex] : null);
    const playerBar = this.playerBar || document.getElementById('playerBar');

    if (!track) {
      if (playerBar) playerBar.classList.add('is-empty');
      if (this.playerEmptyContainer) this.playerEmptyContainer.style.display = 'flex';
      if (this.playerThumbContainer) this.playerThumbContainer.style.display = 'none';
      if (this.playerMeta) this.playerMeta.style.display = 'none';
      if (this.playerActions) this.playerActions.style.display = 'none';
      if (this.playerThumb) this.playerThumb.src = '';
      if (this.playerTrackTitle) this.playerTrackTitle.textContent = '';
      if (this.playerArtist) this.playerArtist.innerHTML = '';
      if (this.playerAlbum) this.playerAlbum.innerHTML = '';
      if (this.lyricsTrackTitle) this.lyricsTrackTitle.textContent = '';
      if (this.lyricsArtistName) this.lyricsArtistName.innerHTML = '';
      if (this.likeBtn) this.likeBtn.classList.remove('liked');
      if (this.maxLikeBtn) this.maxLikeBtn.classList.remove('active');
      if (this.playerDownloadBtn) this.playerDownloadBtn.style.display = 'none';
      if (this.dislikeBtn) this.dislikeBtn.style.display = 'none';

      // Reset Scrubber and time labels
      const fill = document.getElementById('progressFill');
      const buffered = document.getElementById('progressBuffered');
      const timeCur = document.getElementById('timeCurrent');
      const timeTot = document.getElementById('timeTotal');
      const thumb = document.getElementById('progressThumb');
      if (fill) fill.style.width = '0%';
      if (buffered) buffered.style.width = '0%';
      if (thumb) thumb.style.left = '0%';
      if (timeCur) timeCur.textContent = '0:00';
      if (timeTot) timeTot.textContent = '0:00';

      // Maximized player clean empty state
      if (this.maxAlbumArt) {
        this.maxAlbumArt.src = '';
        this.maxAlbumArt.style.display = 'none';
      }
      if (this.maxAmbientGlow) this.maxAmbientGlow.style.backgroundImage = 'none';
      if (this.maxTrackTitle) this.maxTrackTitle.textContent = 'No track selected';
      if (this.maxTrackArtist) this.maxTrackArtist.innerHTML = 'Select a song to play';
      if (this.maxTrackAlbum) this.maxTrackAlbum.innerHTML = '';
      if (this.maxProgressFill) this.maxProgressFill.style.width = '0%';
      if (this.maxProgressThumb) this.maxProgressThumb.style.left = '0%';
      if (this.maxTimeCurrent) this.maxTimeCurrent.textContent = '0:00';
      if (this.maxTimeTotal) this.maxTimeTotal.textContent = '0:00';

      this.renderMaxLyrics();
      this.renderMaxQueue();
      this.syncControlStates();
      return;
    }

    if (playerBar) playerBar.classList.remove('is-empty');
    if (this.playerEmptyContainer) this.playerEmptyContainer.style.display = 'none';
    if (this.playerThumbContainer) this.playerThumbContainer.style.display = '';
    if (this.playerMeta) this.playerMeta.style.display = '';
    if (this.playerActions) this.playerActions.style.display = '';
    if (this.playerDownloadBtn) this.playerDownloadBtn.style.display = '';
    if (this.dislikeBtn) this.dislikeBtn.style.display = '';
    if (this.maxAlbumArt) this.maxAlbumArt.style.display = '';

    if (this.playerThumb) this.playerThumb.src = track.cover || FALLBACK_COVER;
    if (this.playerTrackTitle) this.playerTrackTitle.textContent = track.title || '';
    if (this.playerArtist) this.playerArtist.innerHTML = this.renderClickableArtists(track);
    if (this.playerAlbum) this.playerAlbum.innerHTML = track.album ? `<span class="album-link" data-album-id="${track.albumId || ''}">${track.album}</span>` : '';
    if (this.lyricsTrackTitle) this.lyricsTrackTitle.textContent = track.title || '';
    if (this.lyricsArtistName) this.lyricsArtistName.innerHTML = this.renderClickableArtists(track);

    this.syncMediaControls();

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
    const albumCover = track.cover || FALLBACK_COVER;
    if (this.maxAlbumArt) this.maxAlbumArt.src = albumCover;
    if (this.maxAmbientGlow) this.maxAmbientGlow.style.backgroundImage = `url("${albumCover}")`;
    if (this.maxTrackTitle) this.maxTrackTitle.textContent = track.title;
    if (this.maxTrackArtist) this.maxTrackArtist.innerHTML = this.renderClickableArtists(track);
    if (this.maxTrackAlbum) this.maxTrackAlbum.innerHTML = track.album ? `<span class="album-link" data-album-id="${track.albumId || ''}">${track.album}</span>` : '';

    this.renderMaxLyrics();
    this.renderMaxQueue();
    this.syncControlStates();
  }

  renderShelves() {
    const currentId = this.currentTrack?.id || (this.currentTrackIndex >= 0 ? this.queue[this.currentTrackIndex]?.id : null);

    // 1. Quick Picks Grid (India Superhits Top 50)
    if (this.quickPicksGrid) {
      this.quickPicksGrid.innerHTML = '';
      const fragment = document.createDocumentFragment();
      this.quickPicks.forEach((track) => {
        const isDl = this.isDownloaded(track.id);
        const card = document.createElement('div');
        card.className = `track-row-card ${currentId === track.id ? 'active-track' : ''}`;
        card.setAttribute('data-track-id', track.id);
        card.innerHTML = `
          <div class="track-thumb-wrapper">
            <img src="${track.cover}" alt="${track.title}" class="track-thumb-img" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            <div class="track-play-overlay">
              ${currentId === track.id && this.isPlaying
            ? `<div class="equalizer-icon"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>`
            : `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M8 5v14l11-7z"/></svg>`
          }
            </div>
          </div>
          <div class="track-row-info">
            <div class="track-row-title song-link" data-song-id="${track.id}" style="cursor:pointer;">${track.title}</div>
            <div class="track-row-artist">${this.renderClickableArtists(track)}</div>
          </div>
          <button class="track-card-more-btn track-row-more-btn" title="More options" aria-label="More options for ${track.title}">
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </button>
          <button class="track-inline-dl-btn ${isDl ? 'downloaded' : ''}" title="${isDl ? 'Downloaded (320kbps) - Click to export' : 'Download for offline playback'}">
            ${isDl 
              ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' 
              : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'}
          </button>
          <div class="track-row-duration">${this.formatTime(track.duration)}</div>
        `;
        card.addEventListener('click', (e) => {
          if (e.target.closest('.track-card-more-btn')) {
            e.preventDefault();
            e.stopPropagation();
            this.openTrackOptionsMenu(track, e);
            return;
          }
          if (e.target.closest('.track-inline-dl-btn') || e.target.closest('.artist-link')) {
            if (e.target.closest('.track-inline-dl-btn')) this.handleDownloadButtonClick(track);
            return;
          }
          if (e.target.closest('.track-row-title')) {
            this.openSongView(track.id);
            return;
          }
          if (currentId && String(currentId) === String(track.id)) {
            this.togglePlayPause();
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

        card.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.openTrackOptionsMenu(track, e);
        });

        fragment.appendChild(card);
      });
      this.quickPicksGrid.appendChild(fragment);
    }

    // 2. Trending Carousel (Trending Hits & Viral India)
    if (this.trendingCarousel) {
      const trendingSource = this.trendingHits.length > 0 ? this.trendingHits : this.quickPicks;
      this.trendingCarousel.innerHTML = '';
      const fragment = document.createDocumentFragment();
      trendingSource.forEach(track => {
        const card = this.createMusicCardElement(track);
        fragment.appendChild(card);
      });
      this.trendingCarousel.appendChild(fragment);
    }

    // 3. Punjabi & Desi Bass Shelf
    if (this.focusCarousel) {
      const focusSource = this.punjabiHits.length > 0 ? this.punjabiHits : this.quickPicks;
      this.focusCarousel.innerHTML = '';
      const fragment = document.createDocumentFragment();
      focusSource.forEach(track => {
        const card = this.createMusicCardElement(track);
        fragment.appendChild(card);
      });
      this.focusCarousel.appendChild(fragment);
    }

    // 4. Haryanvi Hits & Regional Rap Shelf
    if (this.haryanviCarousel) {
      const haryanviSource = (this.haryanviHits && this.haryanviHits.length > 0)
        ? this.haryanviHits
        : this.quickPicks;
      this.haryanviCarousel.innerHTML = '';
      const fragment = document.createDocumentFragment();
      haryanviSource.forEach(track => {
        const card = this.createMusicCardElement(track);
        fragment.appendChild(card);
      });
      this.haryanviCarousel.appendChild(fragment);
    }

    // 5. Bollywood Essentials & Melodies Shelf
    if (this.bollywoodCarousel) {
      const bollywoodSource = (this.bollywoodHits && this.bollywoodHits.length > 0)
        ? this.bollywoodHits
        : this.quickPicks;
      this.bollywoodCarousel.innerHTML = '';
      const fragment = document.createDocumentFragment();
      bollywoodSource.forEach(track => {
        const card = this.createMusicCardElement(track);
        fragment.appendChild(card);
      });
      this.bollywoodCarousel.appendChild(fragment);
    }

    // 6. Popular Independent Artists Shelf
    if (this.indieCarousel) {
      const indieSource = (this.indieHits && this.indieHits.length > 0)
        ? this.indieHits
        : this.quickPicks;
      this.indieCarousel.innerHTML = '';
      const fragment = document.createDocumentFragment();
      indieSource.forEach(track => {
        const card = this.createMusicCardElement(track);
        fragment.appendChild(card);
      });
      this.indieCarousel.appendChild(fragment);
    }

    // 7. Discover Artists Shelf
    if (this.discoverArtistsGrid) {
      this.discoverArtistsGrid.innerHTML = '';
      const fragment = document.createDocumentFragment();
      const allArtists = [
        ...this.popularSingers,
        { id: '8812560', name: 'Dhanda Nyoliwala', role: 'Haryanvi Rap', image: 'https://c.saavncdn.com/artists/Dhanda_Nyoliwala_000_20230725114757_150x150.jpg' },
        { id: '1138356', name: 'Sidhu Moose Wala', role: 'Punjabi Legend', image: 'https://c.saavncdn.com/artists/Sidhu_Moose_Wala_003_20230613054522_150x150.jpg' },
        { id: '455124', name: 'Yo Yo Honey Singh', role: 'Desi Hip Hop', image: 'https://c.saavncdn.com/artists/Yo_Yo_Honey_Singh_002_20221130103622_150x150.jpg' },
        { id: '464656', name: 'Khasa Aala Chahar', role: 'Haryanvi Star', image: 'https://c.saavncdn.com/artists/Khasa_Aala_Chahar_001_20230713075218_150x150.jpg' },
        { id: '1274534', name: 'Gulzaar Chhaniwala', role: 'Haryanvi Pop', image: 'https://c.saavncdn.com/artists/Gulzaar_Chhaniwala_002_20230504100518_150x150.jpg' },
        { id: '456863', name: 'Badshah', role: 'Hip Hop / Rap', image: 'https://c.saavncdn.com/artists/Badshah_006_20241118064015_150x150.jpg' }
      ];

      const seen = new Set();
      const uniqueArtists = [];
      for (const a of allArtists) {
        if (!seen.has(a.name)) {
          seen.add(a.name);
          uniqueArtists.push(a);
        }
      }

      uniqueArtists.forEach(artist => {
        const card = document.createElement('div');
        card.className = 'discover-artist-card';
        card.innerHTML = `
          <img src="${artist.image || FALLBACK_COVER}" alt="${artist.name}" class="discover-artist-avatar" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
          <div class="discover-artist-name">${artist.name}</div>
          <div class="discover-artist-genre">${artist.role || 'Artist'}</div>
        `;
        card.addEventListener('click', () => {
          this.openArtistView(artist.id, artist.name);
        });
        fragment.appendChild(card);
      });
      this.discoverArtistsGrid.appendChild(fragment);
    }

    // 8. Render Adaptive Personalized Feed
    if (this.homeFeedService) {
      this.homeFeedService.renderAdaptiveFeed();
    }
  }

  createMusicCardElement(track) {
    const card = document.createElement('div');
    card.className = 'music-card';
    card.setAttribute('data-track-id', track.id);
    const safeTitle = escapeHtml(track.title || 'Untitled');
    const safeId = escapeHtml(track.id || '');
    const safeCover = track.cover || FALLBACK_COVER;
    card.innerHTML = `
      <div class="music-card-thumb">
        <img src="${safeCover}" alt="${safeTitle}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
        <button class="music-card-play" aria-label="Play ${safeTitle}">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <button class="track-card-more-btn" aria-label="More options for ${safeTitle}" title="More options">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </button>
      <div class="music-card-title song-link" data-song-id="${safeId}" style="cursor:pointer;">${safeTitle}</div>
      <div class="music-card-sub">${this.renderClickableArtists(track)}</div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.track-card-more-btn')) {
        e.preventDefault();
        e.stopPropagation();
        this.openTrackOptionsMenu(track, e);
        return;
      }
      if (e.target.closest('.artist-link')) return;
      if (e.target.closest('.music-card-title')) {
        this.openSongView(track.id);
        return;
      }
      this.playActualTrack(track, { type: 'card_click' });
    });

    card.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.openTrackOptionsMenu(track, e);
    });

    return card;
  }

  openTrackOptionsMenu(track, e) {
    if (!track) return;
    this.selectedMenuTrack = track;
    if (this.trackOptionsThumb) {
      this.trackOptionsThumb.src = track.cover || FALLBACK_COVER;
      this.trackOptionsThumb.onerror = () => { this.trackOptionsThumb.src = FALLBACK_COVER; };
    }
    if (this.trackOptionsTitle) {
      this.trackOptionsTitle.textContent = track.title || 'Untitled Track';
    }
    if (this.trackOptionsArtist) {
      this.trackOptionsArtist.textContent = track.artist || 'Unknown Artist';
    }
    if (this.optToggleLikeLabel) {
      const isLiked = this.likedTrackIds.has(track.id);
      this.optToggleLikeLabel.textContent = isLiked ? 'Remove from Favorites' : 'Add to Favorites';
    }
    if (this.optShowLessArtistLabel) {
      const primaryArtist = (track.artist || '').split(/[,&]/)[0].trim();
      this.optShowLessArtistLabel.textContent = primaryArtist
        ? `Show less from ${primaryArtist}`
        : 'Show less from this artist';
    }
    if (this.trackOptionsBackdrop) {
      this.trackOptionsBackdrop.classList.remove('hidden');
    }
  }

  closeTrackOptionsMenu() {
    this.selectedMenuTrack = null;
    if (this.trackOptionsBackdrop) {
      this.trackOptionsBackdrop.classList.add('hidden');
    }
  }

  openMoreLikeThis(track) {
    if (!track) return;
    this.closeTrackOptionsMenu();
    this.showToast(`Finding tracks similar to "${track.title}"...`);
    this.switchView('home');
    if (this.personalizedShelf) {
      this.personalizedShelf.scrollIntoView({ behavior: 'smooth' });
    }
    if (this.userPreferenceService) {
      this.userPreferenceService.recordSongStarted(track, 'more_like_this');
      if (this.homeFeedService) {
        this.homeFeedService.renderAdaptiveFeed();
      }
    }
  }

  updateTasteProfileUI() {
    if (!this.userPreferenceService) return;
    const profile = this.userPreferenceService.profile;
    const confidence = this.userPreferenceService.recalculateConfidence();
    const pct = Math.round(confidence * 100);

    if (this.tasteConfidenceFill) {
      this.tasteConfidenceFill.style.width = `${pct}%`;
    }
    if (this.tasteConfidenceValue) {
      let label = `${pct}% (Discovery Mode)`;
      if (pct >= 45) {
        label = `${pct}% (Personalized Discovery)`;
      } else if (pct >= 15) {
        label = `${pct}% (Learning Your Taste)`;
      }
      this.tasteConfidenceValue.textContent = label;
    }
    if (this.tasteConfidenceDesc) {
      if (pct === 0) {
        this.tasteConfidenceDesc.textContent = 'REA Music adapts your home screen as you listen. Start playing songs to build your profile.';
      } else if (pct < 45) {
        this.tasteConfidenceDesc.textContent = 'Learning from your plays, replays, and favourites. Keep listening to refine recommendations.';
      } else {
        this.tasteConfidenceDesc.textContent = 'High confidence profile active. Your home feed dynamically emphasizes your favourite artists and regional styles.';
      }
    }
    if (this.tasteStatPlays) {
      this.tasteStatPlays.textContent = profile.totalPlays || 0;
    }
    if (this.tasteStatCompletions) {
      this.tasteStatCompletions.textContent = profile.totalCompletions || 0;
    }
    if (this.tasteStatArtists) {
      const artistCount = Object.keys(profile.artistAffinities || {}).length;
      this.tasteStatArtists.textContent = artistCount;
    }
  }

  renderQueueSections({ nowPlayingCard, manualCount, clearBtn, manualList, autoplayToggle, recommendedList, isMax = false }) {
    const curTrack = this.currentTrack || (this.currentTrackIndex >= 0 && this.queue[this.currentTrackIndex] ? this.queue[this.currentTrackIndex] : null);

    // Section A: Currently Playing
    if (nowPlayingCard) {
      if (curTrack) {
        nowPlayingCard.innerHTML = `
          <img src="${curTrack.cover || FALLBACK_COVER}" alt="${curTrack.title}" class="queue-item-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
          <div class="queue-now-playing-info">
            <div class="queue-now-playing-title">${curTrack.title}</div>
            <div class="queue-now-playing-artist">${curTrack.artist}</div>
          </div>
          <div class="queue-equalizer-bars ${this.isPlaying ? 'playing' : ''}">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
            <span class="bar bar-4"></span>
          </div>
          <div class="queue-item-duration">${this.formatTime(curTrack.duration)}</div>
        `;
      } else {
        nowPlayingCard.innerHTML = `
          <div class="queue-empty-state" style="padding: 14px 10px;">
            <div>No track currently playing</div>
            <p>Select any song to begin playback.</p>
          </div>
        `;
      }
    }

    // Section B: Next in Queue (Manual Queue)
    if (manualCount) {
      manualCount.textContent = `${this.manualQueue.length} song${this.manualQueue.length === 1 ? '' : 's'}`;
    }
    if (clearBtn) {
      clearBtn.style.display = this.manualQueue.length > 0 ? '' : 'none';
    }
    if (manualList) {
      manualList.innerHTML = '';
      if (this.manualQueue.length === 0) {
        manualList.innerHTML = `
          <div class="queue-empty-state">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <div>Manual queue is empty</div>
            <p>Click "Play Next" or "+ Queue" on any track to prioritize it.</p>
          </div>
        `;
      } else {
        this.manualQueue.forEach((track, idx) => {
          const item = document.createElement('div');
          item.className = 'queue-item';
          item.dataset.manualIdx = idx;
          item.innerHTML = `
            <span class="queue-item-pos">#${idx + 1}</span>
            <img src="${track.cover || FALLBACK_COVER}" alt="${track.title}" class="queue-item-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            <div class="queue-item-info">
              <div class="queue-item-title">${track.title}</div>
              <div class="queue-item-artist">${track.artist}</div>
            </div>
            <div class="queue-item-actions">
              ${idx > 0 ? `<button class="queue-move-btn queue-move-up" data-idx="${idx}" title="Move Up"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg></button>` : ''}
              ${idx < this.manualQueue.length - 1 ? `<button class="queue-move-btn queue-move-down" data-idx="${idx}" title="Move Down"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg></button>` : ''}
              <button class="queue-item-action-btn queue-remove-manual-btn" data-idx="${idx}" title="Remove from queue">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <div class="queue-item-duration">${this.formatTime(track.duration)}</div>
          `;
          manualList.appendChild(item);
        });
      }
    }

    // Section C: Recommended Next (Autoplay Queue)
    if (autoplayToggle) {
      autoplayToggle.checked = this.autoplayEnabled;
    }
    if (recommendedList) {
      recommendedList.innerHTML = '';
      if (!this.autoplayEnabled) {
        recommendedList.innerHTML = `
          <div class="queue-empty-state">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M10 15V9l5 3-5 3z"/></svg>
            <div>Autoplay is paused</div>
            <p>Turn on Autoplay to keep the music flowing with smart recommendations.</p>
            <button class="queue-enable-autoplay-btn">Turn On Autoplay</button>
          </div>
        `;
      } else if (this.isPrefetchingRecommendations && this.recommendationQueue.length === 0) {
        recommendedList.innerHTML = `
          <div class="queue-shimmer-item">
            <div class="queue-shimmer-box" style="width:40px;height:40px;border-radius:6px;"></div>
            <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
              <div class="queue-shimmer-box" style="width:65%;height:14px;"></div>
              <div class="queue-shimmer-box" style="width:40%;height:11px;"></div>
            </div>
          </div>
          <div class="queue-shimmer-item">
            <div class="queue-shimmer-box" style="width:40px;height:40px;border-radius:6px;"></div>
            <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
              <div class="queue-shimmer-box" style="width:55%;height:14px;"></div>
              <div class="queue-shimmer-box" style="width:35%;height:11px;"></div>
            </div>
          </div>
        `;
      } else if (this.recommendationQueue.length === 0) {
        recommendedList.innerHTML = `
          <div class="queue-empty-state">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
            <div>No recommendations queued</div>
            <p>Refresh to discover tracks similar to your current song.</p>
            <button class="queue-refresh-trigger-btn">Find Recommendations</button>
          </div>
        `;
      } else {
        this.recommendationQueue.forEach((track) => {
          const item = document.createElement('div');
          item.className = 'queue-item';
          item.dataset.recoId = track.id;
          item.innerHTML = `
            <img src="${track.cover || FALLBACK_COVER}" alt="${track.title}" class="queue-item-thumb" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
            <div class="queue-item-info">
              <div class="queue-item-title">${track.title}</div>
              <div class="queue-item-artist">${track.artist}</div>
              <div class="queue-reason-badge ${track._reasonBadge || 'badge-trending'}">
                ${track._reason || 'Recommended for you'}
              </div>
            </div>
            <div class="queue-item-actions">
              <button class="queue-item-action-btn queue-play-reco-btn" data-id="${track.id}" title="Play now">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <button class="queue-item-action-btn queue-add-manual-btn" data-id="${track.id}" title="Add to manual queue">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              </button>
              <button class="queue-item-action-btn queue-dismiss-reco-btn" data-id="${track.id}" title="Not interested (Dismiss)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <div class="queue-item-duration">${this.formatTime(track.duration)}</div>
          `;
          recommendedList.appendChild(item);
        });
      }
    }
  }

  renderQueue() {
    this.renderQueueSections({
      nowPlayingCard: this.queueNowPlayingCard,
      manualCount: this.queueManualCount,
      clearBtn: this.clearManualQueueBtn,
      manualList: this.queueManualList,
      autoplayToggle: this.queueAutoplayToggle,
      recommendedList: this.queueRecommendedList,
      isMax: false
    });
    this.renderMaxQueue();
  }

  // ===========================================================================
  // Maximized / Minimized Player Theater Controls
  // ===========================================================================
  maximizePlayer() {
    if (!this.currentTrack) return;
    this.isPlayerMaximized = true;
    if (this.maximizedPlayer) {
      this.maximizedPlayer.classList.add('open');
      this.maximizedPlayer.setAttribute('aria-hidden', 'false');
      this.maximizedPlayer.scrollTop = 0;
    }
    this.switchMaxTab(this.currentMaxTab || 'song');
    this.renderPlayerInfo();
    const cur = this.engine?.audio?.currentTime || 0;
    const dur = this.engine?.audio?.duration || (this.queue && this.queue[this.currentTrackIndex]?.duration) || 1;
    this.updateProgressBar(cur, dur);
    this.syncControlStates();
    this.updateMaximizeButtonUI();
  }

  minimizePlayer() {
    this.isPlayerMaximized = false;
    if (this.maximizedPlayer) {
      this.maximizedPlayer.classList.remove('open');
      this.maximizedPlayer.setAttribute('aria-hidden', 'true');
    }
    this.updateMaximizeButtonUI();
  }

  toggleMaximizePlayer() {
    if (this.isPlayerMaximized) {
      this.minimizePlayer();
      return;
    }
    if (!this.currentTrack) {
      const candidateTrack = (this.queue && this.queue.length > 0 && this.queue[0]) ||
        (this.quickPicks && this.quickPicks.length > 0 && this.quickPicks[0]) ||
        (this.trendingTracks && this.trendingTracks.length > 0 && this.trendingTracks[0]) ||
        (this.homeTrendingTracks && this.homeTrendingTracks.length > 0 && this.homeTrendingTracks[0]);

      if (candidateTrack) {
        this.playActualTrack(candidateTrack);
      } else {
        this.showToast('Select a song to expand player');
        return;
      }
    }
    this.maximizePlayer();
  }

  updateMaximizeButtonUI() {
    const isMax = Boolean(this.isPlayerMaximized);
    const expandSvg = '<path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>';
    const collapseSvg = '<path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>';

    if (this.fullscreenBtn) {
      this.fullscreenBtn.title = isMax ? 'Minimize player (Esc)' : 'Expand player';
      this.fullscreenBtn.setAttribute('aria-label', isMax ? 'Minimize player' : 'Expand player');
      const svg = this.fullscreenBtn.querySelector('svg');
      if (svg) svg.innerHTML = isMax ? collapseSvg : expandSvg;
      this.fullscreenBtn.classList.toggle('active-maximized', isMax);
    }
  }

  isFullscreen() {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  toggleFullscreenWindow() {
    try {
      if (!this.isFullscreen()) {
        const elem = document.documentElement;
        const requestFn = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
        if (requestFn) {
          const p = requestFn.call(elem);
          if (p && typeof p.catch === 'function') {
            p.catch(err => console.warn('[REA Fullscreen]', err));
          }
        }
      } else {
        const exitFn = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (exitFn) {
          const p = exitFn.call(document);
          if (p && typeof p.catch === 'function') {
            p.catch(err => console.warn('[REA Fullscreen]', err));
          }
        }
      }
    } catch (err) {
      console.warn('[REA Fullscreen] Toggle error:', err);
    }
  }

  updateFullscreenWindowIcons() {
    const isFs = this.isFullscreen();
    const enterSvg = '<path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>';
    const exitSvg = '<path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>';

    if (this.maxFullscreenToggleBtn) {
      this.maxFullscreenToggleBtn.title = isFs ? 'Exit Fullscreen Window' : 'Toggle Fullscreen Window';
      this.maxFullscreenToggleBtn.setAttribute('aria-label', isFs ? 'Exit Fullscreen Window' : 'Toggle Fullscreen Window');
      const svg = this.maxFullscreenToggleBtn.querySelector('svg');
      if (svg) svg.innerHTML = isFs ? exitSvg : enterSvg;
      this.maxFullscreenToggleBtn.classList.toggle('active-fullscreen', isFs);
    }
  }

  switchMaxTab(tab) {
    this.currentMaxTab = tab;
    if (this.maximizedPlayer) {
      this.maximizedPlayer.setAttribute('data-max-tab', tab);
    }
    this.maxTabBtns.forEach(b => b.classList.toggle('active', b.dataset.maxTab === tab));

    if (tab === 'song') {
      if (this.maxLyricsPane) this.maxLyricsPane.classList.add('hidden');
      if (this.maxQueuePane) this.maxQueuePane.classList.remove('hidden');
      this.renderMaxQueue();
    } else if (tab === 'lyrics') {
      if (this.maxLyricsPane) this.maxLyricsPane.classList.remove('hidden');
      if (this.maxQueuePane) this.maxQueuePane.classList.add('hidden');
      this.renderMaxLyrics();
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
    this.renderQueueSections({
      nowPlayingCard: this.maxQueueNowPlayingCard,
      manualCount: this.maxQueueManualCount,
      clearBtn: this.maxClearManualQueueBtn,
      manualList: this.maxQueueManualList,
      autoplayToggle: this.maxAutoplayToggle,
      recommendedList: this.maxQueueRecommendedList,
      isMax: true
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
        const proxyUrl = `${API_BASE_URL}/api/download?url=${encodeURIComponent(track.audioUrl || '')}&title=${encodeURIComponent(track.title || 'song')}`;
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
      const dlUrl = `${API_BASE_URL}/api/download?url=${encodeURIComponent(track.audioUrl || '')}&title=${encodeURIComponent(cleanTitle)}`;
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
    if (!targetArtist) {
      try {
        const cached = localStorage.getItem('rea_cached_reco_v1');
        if (cached) {
          const data = JSON.parse(cached);
          if (data && data.recommendations && data.recommendations.length > 0) {
            this.recommendations = data.recommendations;
            if (data.trendingSearches) this.trendingSearches = data.trendingSearches;
            this.renderRecommendedShelf();
            this.renderSearchHub();
            this.renderRelatedPane();
          }
        }
      } catch (_) {}
    }

    try {
      const currentTrack = this.currentTrack || (this.currentTrackIndex >= 0 ? this.queue[this.currentTrackIndex] : null);
      const artistParam = targetArtist || (currentTrack ? currentTrack.artist : 'Arijit Singh');
      const trackId = currentTrack ? currentTrack.id : '';
      const res = await fetch(`${API_BASE_URL}/api/recommendations?artist=${encodeURIComponent(artistParam)}&trackId=${encodeURIComponent(trackId)}`);
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

      if (!targetArtist) {
        try {
          localStorage.setItem('rea_cached_reco_v1', JSON.stringify({
            recommendations: this.recommendations,
            trendingSearches: this.trendingSearches
          }));
        } catch (_) {}
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
              if (this.searchTabsNav) this.searchTabsNav.classList.remove('hidden');
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

    // 2. Render Popular Indian Singers (Circular Avatars Carousel)
    if (this.searchSingersGrid) {
      this.searchSingersGrid.innerHTML = '';
      (this.popularSingers || []).forEach(singer => {
        const card = document.createElement('div');
        card.className = 'singer-avatar-card';
        card.title = `Stream top hits of ${singer.name}`;
        const avatarUrl = this.getArtistAvatar(singer);
        const fallbackSvg = this.getArtistFallbackSvg(singer.name);
        card.innerHTML = `
          <img src="${avatarUrl}" alt="${singer.name}" class="singer-avatar-img" onerror="this.onerror=null;this.src='${fallbackSvg}'" loading="lazy" decoding="async">
          <span class="singer-avatar-name">${singer.name}</span>
          <span class="singer-avatar-role">${singer.role || 'Singer'}</span>
        `;
        card.addEventListener('click', () => {
          this.openArtistView(singer.id || singer.name, singer.name);
        });
        this.searchSingersGrid.appendChild(card);
      });
    }

    // 3. Render Trending Searches (Tags / Pills)
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
          this.openSearchView(tag);
        });
        this.trendingTagsGrid.appendChild(pill);
      });
    }

    // 4. Render Recommended Songs in Search Dropdown
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
          this.playSearchTrack(track, recoTracks, '');
          if (this.searchDropdown) this.searchDropdown.classList.add('hidden');
          if (this.searchInput) this.searchInput.value = '';
          if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
        });
        this.searchRecoList.appendChild(item);
      });
    }
  }

  updateShelvesPlayingState() {
    const currentId = this.currentTrack?.id || (this.currentTrackIndex >= 0 ? this.queue[this.currentTrackIndex]?.id : null);
    if (!this.quickPicksGrid) return;

    const cards = this.quickPicksGrid.querySelectorAll('.track-row-card');
    cards.forEach(card => {
      const titleEl = card.querySelector('.track-row-title');
      const songId = titleEl ? titleEl.dataset.songId : null;
      const isActive = songId && String(songId) === String(currentId);
      card.classList.toggle('active-track', isActive);
      const overlay = card.querySelector('.track-play-overlay');
      if (overlay) {
        if (isActive && this.isPlaying) {
          overlay.innerHTML = '<div class="equalizer-icon"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>';
        } else {
          overlay.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M8 5v14l11-7z"/></svg>';
        }
      }
    });

    const rankedCards = document.querySelectorAll('.ranked-track-card');
    rankedCards.forEach(card => {
      const titleEl = card.querySelector('.track-row-title');
      const cardTitle = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
      const isCur = Boolean(this.currentTrack && (
        (card.dataset.songId && String(card.dataset.songId) === String(this.currentTrack.id)) ||
        (this.currentTrack.title && this.currentTrack.title.trim().toLowerCase() === cardTitle)
      ));
      card.classList.toggle('rank-active', isCur);
    });
  }

  renderRecommendedShelf() {
    if (!this.recommendedCarousel) return;
    this.recommendedCarousel.innerHTML = '';
    const recoTracks = this.recommendations.length > 0 ? this.recommendations.slice(0, 12) : this.quickPicks.slice(0, 12);
    const fragment = document.createDocumentFragment();
    recoTracks.forEach(track => {
      const card = document.createElement('div');
      card.className = 'music-card';
      card.innerHTML = `
        <div class="music-card-thumb">
          <img src="${track.cover}" alt="${track.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_COVER}'">
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
      fragment.appendChild(card);
    });
    this.recommendedCarousel.appendChild(fragment);
  }

  renderRelatedPane() {
    const currentTrack = this.currentTrack || (this.currentTrackIndex >= 0 && this.queue[this.currentTrackIndex] ? this.queue[this.currentTrackIndex] : null);
    if (!currentTrack) {
      if (this.relatedArtistCard) {
        this.relatedArtistCard.innerHTML = `
          <div class="related-artist-info" style="padding: 12px 0;">
            <div class="related-artist-title">No track playing</div>
            <div class="related-artist-subtitle">Choose a song to see related recommendations</div>
          </div>
        `;
      }
      if (this.relatedTracksList) {
        this.relatedTracksList.innerHTML = '<div style="padding:16px;color:var(--text-tertiary);font-size:13px;text-align:center;">Select any song to explore related tracks</div>';
      }
      return;
    }
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
