import { decryptSaavnUrl } from './des.js';
import { Readable } from 'node:stream';

/**
 * High-performance Bounded Cache with LRU eviction and TTL expiration.
 * Eliminates memory leaks in long-running Node.js processes and serverless functions.
 */
class BoundedCache {
  constructor(maxSize = 150, defaultTtlMs = 600000) {
    this.maxSize = maxSize;
    this.defaultTtlMs = defaultTtlMs;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    // Refresh for LRU eviction order
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      this.store.delete(oldestKey);
    }
    this.store.set(key, { value, expiresAt: Date.now() + (ttlMs || this.defaultTtlMs) });
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.store.clear();
  }
}

// Bounded in-memory caches with individual capacity limits and TTLs
const CACHE = {
  trending: new BoundedCache(50, 600000),      // 10 minutes
  search: new BoundedCache(500, 900000),       // 15 minutes, high capacity
  lyrics: new BoundedCache(150, 86400000),     // 24 hours
  artist: new BoundedCache(100, 600000),       // 10 minutes
  album: new BoundedCache(100, 600000),        // 10 minutes
  song: new BoundedCache(150, 600000)          // 10 minutes
};

/**
 * Robust fetch wrapper with timeout, abort handling, and standard User-Agent.
 */
async function safeFetch(url, options = {}) {
  const timeoutMs = options.timeoutMs || 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...(options.headers || {}) },
      signal: options.signal || controller.signal
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

function decodeEntities(str) {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function parseLRC(lrcText) {
  if (!lrcText) return [];
  const lines = lrcText.split('\n');
  const result = [];
  const timeRegex = /\[(\d{2}):(\d{2}(?:\.\d+)?)\]/;
  for (const line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseFloat(match[1]);
      const seconds = parseFloat(match[2]);
      const time = Math.round((minutes * 60 + seconds) * 10) / 10;
      const text = line.replace(/\[\d{2}:\d{2}(?:\.\d+)?\]/g, '').trim();
      if (text) {
        result.push({ time, text: decodeEntities(text) });
      }
    }
  }
  return result;
}

function formatSong(s) {
  if (!s) return null;
  const audioUrl = decryptSaavnUrl(s.encrypted_media_url);
  const image = (s.image || s.imageUrl || '')
    .replace('150x150.jpg', '500x500.jpg')
    .replace('150x150.png', '500x500.png')
    .replace('50x50.jpg', '500x500.jpg');

  return {
    id: s.id || s.song_id || `track-${Math.random().toString(36).substring(2, 9)}`,
    title: decodeEntities(s.song || s.title || s.name || 'Unknown Title'),
    artist: decodeEntities(s.singers || s.primary_artists || s.primaryArtists || s.music || 'Various Artists'),
    album: decodeEntities(s.album || s.more_info?.album || 'Single'),
    albumId: s.albumid || s.album_id || s.more_info?.album_id || '',
    artistMap: s.artistMap || s.artistIDMap || null,
    primaryArtistId: (s.primary_artists_id || s.primaryArtistsIds || '').split(',')[0].trim(),
    cover: image || 'assets/logo.jpg',
    duration: parseInt(s.duration || s.more_info?.duration, 10) || 210,
    audioUrl: audioUrl || null,
    year: s.year || s.more_info?.year || '2024',
    language: s.language || 'hindi',
    playCount: s.play_count || s.more_info?.play_count || '1M+'
  };
}

// Pre-defined Indian curated charts from JioSaavn
const CHARTS = {
  superhits: '1134543272', // Hindi: India Superhits Top 50
  india: '1134548194',     // India Superhits Top 50
  punjabi: '1134543511',   // Punjabi: India Superhits Top 50
  romantic: '1139074020',  // Most Streamed Love Songs: Hindi
  trending: '110858205',   // Trending Today
  retro90s: '1167751266',  // Hindi 1990s
  arijit: '802336660'      // Arijit Singh Hits
};

async function fetchPlaylistSongs(listId) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=playlist.getDetails&_format=json&listid=${listId}`;
    const res = await safeFetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    if (!text || !text.trim()) return [];
    const clean = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    if (!clean) return [];
    const data = JSON.parse(clean);
    const rawSongs = data.songs || data.list || [];
    return rawSongs
      .map(formatSong)
      .filter(s => s && s.audioUrl);
  } catch (e) {
    console.error(`Error fetching playlist ${listId}:`, e.message);
    return [];
  }
}

function normalizeTrackTitle(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/feat\.?.*|ft\.?.*/i, '')
    .replace(/official.*|video.*|audio.*|remix.*|version.*/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function searchSongs(query, page = 1, limit = 20) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&n=${limit}&p=${page}&q=${encodeURIComponent(query)}`;
    const res = await safeFetch(url, { timeoutMs: 4500 });
    const text = await res.text();
    const clean = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    const data = JSON.parse(clean);
    const results = data.results || [];
    return results
      .map(formatSong)
      .filter(s => s && s.audioUrl);
  } catch (e) {
    console.error(`Search error for ${query}:`, e.message);
    return [];
  }
}

async function searchArtists(query, page = 1, limit = 8) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getArtistResults&_format=json&n=${limit}&p=${page}&q=${encodeURIComponent(query)}`;
    const res = await safeFetch(url, { timeoutMs: 4500 });
    const text = await res.text();
    const clean = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    const data = JSON.parse(clean);
    const results = data.results || [];
    return results.map(a => {
      let img = (a.image || '').trim();
      if (img.includes('artist-default') || img.includes('default-artist')) {
        img = '';
      } else {
        img = img.replace('50x50.jpg', '150x150.jpg')
                 .replace('50x50.png', '150x150.png')
                 .replace('500x500.jpg', '150x150.jpg')
                 .replace('500x500.png', '150x150.jpg');
      }
      return {
        id: a.id || a.artistId,
        name: decodeEntities(a.name),
        image: img,
        role: decodeEntities(a.role || 'Singer'),
        type: 'artist'
      };
    }).filter(a => a.id && a.name);
  } catch (e) {
    console.error(`Artist search error for ${query}:`, e.message);
    return [];
  }
}

async function searchAlbums(query, page = 1, limit = 12) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getAlbumResults&_format=json&n=${limit}&p=${page}&q=${encodeURIComponent(query)}`;
    const res = await safeFetch(url, { timeoutMs: 4500 });
    const text = await res.text();
    const clean = text.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');
    const data = JSON.parse(clean);
    const results = data.results || [];
    return results.map(a => ({
      id: a.id || a.albumid,
      title: decodeEntities(a.title || a.name || a.album),
      artist: decodeEntities(a.primary_artists || a.primaryArtists || a.music || a.artist || 'Various Artists'),
      cover: (a.image || a.imageUrl || '').replace('150x150.jpg', '500x500.jpg').replace('50x50.jpg', '500x500.jpg'),
      year: a.year || '',
      songCount: a.song_count || (a.more_info?.song_pids ? a.more_info.song_pids.split(',').length : null),
      type: 'album'
    })).filter(a => a.id && a.title);
  } catch (e) {
    console.error(`Album search error for ${query}:`, e.message);
    return [];
  }
}

async function fetchArtistDetails(artistId) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=artist.getArtistPageDetails&_format=json&artistId=${artistId}&n_song=30&n_album=20`;
    const res = await safeFetch(url);
    const text = await res.text();
    const clean = text.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');
    const data = JSON.parse(clean);
    const rawSongs = data.topSongs?.songs || data.top_songs || [];
    const songs = rawSongs.map(formatSong).filter(s => s && s.audioUrl);

    const rawAlbums = data.topAlbums?.albums || data.top_albums || [];
    const albums = rawAlbums.map(a => ({
      id: a.albumid || a.id,
      title: decodeEntities(a.album || a.title || a.name),
      artist: decodeEntities(a.primaryArtists || a.primary_artists || a.music || data.name),
      cover: (a.imageUrl || a.image || '').replace('150x150.jpg', '500x500.jpg').replace('50x50.jpg', '500x500.jpg'),
      year: a.year || '',
      songCount: a.numSongs || a.song_count || null,
      type: 'album'
    })).filter(a => a.id && a.title);

    const similar = (data.similarArtists || []).map(sa => ({
      id: sa.id || sa.artistId,
      name: decodeEntities(sa.name),
      image: (sa.image || '').replace('150x150.jpg', '500x500.jpg').replace('50x50.jpg', '500x500.jpg'),
      role: decodeEntities(sa.role || 'Artist'),
      type: 'artist'
    }));

    return {
      id: data.artistId || artistId,
      name: decodeEntities(data.name || 'Unknown Artist'),
      image: (data.image || '').replace('150x150.jpg', '500x500.jpg').replace('50x50.jpg', '500x500.jpg'),
      subtitle: decodeEntities(data.subtitle || data.dominantType || 'Indian Artist'),
      bio: decodeEntities(data.bio || ''),
      followerCount: data.follower_count ? Number(data.follower_count).toLocaleString('en-IN') : '1M+',
      isVerified: Boolean(data.isVerified),
      songs,
      topSongs: songs,
      albums,
      topAlbums: albums,
      similarArtists: similar
    };
  } catch (e) {
    console.error(`Artist details error for ${artistId}:`, e.message);
    return null;
  }
}

async function fetchSongDetails(songId) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0&_format=json&pids=${encodeURIComponent(songId)}`;
    const res = await safeFetch(url);
    const text = await res.text();
    const clean = text.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');
    const data = JSON.parse(clean);
    const raw = data[songId] || Object.values(data)[0];
    if (!raw || !raw.id) return null;

    const formatted = formatSong(raw);
    formatted.label = decodeEntities(raw.label || '');
    formatted.copyright = decodeEntities(raw.copyright_text || '');
    formatted.hasLyrics = raw.has_lyrics === 'true' || raw.has_lyrics === true;

    // Fetch related songs by primary artist
    let related = [];
    const primaryArtist = (formatted.artist || '').split(',')[0].trim();
    if (primaryArtist) {
      const searchRes = await searchSongs(primaryArtist);
      related = searchRes.filter(s => s && s.id !== formatted.id).slice(0, 10);
    }

    return {
      song: formatted,
      track: formatted,
      related
    };
  } catch (e) {
    console.error(`Error fetching song details for ${songId}:`, e.message);
    return null;
  }
}

async function fetchAlbumDetails(albumId) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=content.getAlbumDetails&_format=json&albumid=${albumId}`;
    const res = await safeFetch(url);
    const text = await res.text();
    const clean = text.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');
    const data = JSON.parse(clean);
    const rawSongs = data.songs || [];
    const songs = rawSongs.map(formatSong).filter(s => s && s.audioUrl);
    return {
      id: data.albumid || albumId,
      title: decodeEntities(data.title || data.name || 'Unknown Album'),
      artist: decodeEntities(data.primary_artists || data.primaryArtists || data.music || 'Various Artists'),
      primaryArtistId: (data.primary_artists_id || '').split(',')[0].trim(),
      year: data.year || data.release_date?.substring(0, 4) || '2024',
      releaseDate: data.release_date || '',
      cover: (data.image || '').replace('150x150.jpg', '500x500.jpg').replace('50x50.jpg', '500x500.jpg'),
      songCount: songs.length,
      songs
    };
  } catch (e) {
    console.error(`Error fetching album ${albumId}:`, e.message);
    return null;
  }
}

async function fetchLyrics(track, artist) {
  const cacheKey = `${track}__${artist}`.toLowerCase();
  const cached = CACHE.lyrics.get(cacheKey);
  if (cached) return cached;

  try {
    const cleanTrack = track.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
    const cleanArtist = (artist || '').split(',')[0].trim();
    const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTrack)}&artist_name=${encodeURIComponent(cleanArtist)}`;
    const res = await safeFetch(url, {
      headers: { 'User-Agent': 'REAMusic/1.0' },
      timeoutMs: 4000
    });

    if (res.ok) {
      const data = await res.json();
      if (data.syncedLyrics) {
        const parsed = parseLRC(data.syncedLyrics);
        const result = { synced: true, lines: parsed };
        CACHE.lyrics.set(cacheKey, result, 86400000);
        return result;
      } else if (data.plainLyrics) {
        const lines = data.plainLyrics
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean)
          .map((text, i) => ({ time: i * 5, text }));
        const result = { synced: false, lines };
        CACHE.lyrics.set(cacheKey, result, 86400000);
        return result;
      }
    }
  } catch (e) {
    // Ignore timeout or missing lyrics
  }
  return { synced: false, lines: [] };
}

async function fetchNewReleases() {
  try {
    const url = 'https://www.jiosaavn.com/api.php?__call=content.getAlbums&_format=json&n=16&p=1&api_version=4';
    const res = await safeFetch(url);
    const text = await res.text();
    const clean = text.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');
    const data = JSON.parse(clean);
    return (data || []).map(album => ({
      id: album.id,
      title: decodeEntities(album.title),
      artist: decodeEntities(album.more_info?.artist_name || album.subtitle || 'Various Artists'),
      cover: (album.image || '').replace('150x150.jpg', '500x500.jpg'),
      year: album.year || '2026',
      type: 'album'
    }));
  } catch (e) {
    console.error('Error fetching new releases:', e.message);
    return [];
  }
}

// Regional & Genre Search Queries for Indian & Global Discovery
const GENRE_QUERIES = {
  haryanvi: 'Haryanvi Hits',
  punjabi: 'Punjabi Hits',
  punjabi_hiphop: 'Punjabi Hip Hop Hits',
  bollywood: 'Bollywood Hits',
  hindi: 'Hindi Top Songs',
  hindi_romantic: 'Romantic Hindi Love Songs',
  romantic: 'Love Songs Hindi',
  indie: 'Indie India',
  chill: 'Hindi Acoustic Chill',
  lofi: 'Lofi Chill Beats Hindi English',
  workout: 'Workout Gym Motivation Hits',
  party: 'Bollywood Dance Party',
  pop: 'Global Pop Hits',
  synthpop: 'Synthpop 80s Retro Hits',
  hiphop: 'Hip Hop Rap Hits',
  english: 'English Pop Hits Top'
};

async function fetchGenreSongs(genreKey, page = 1) {
  const q = GENRE_QUERIES[genreKey] || `${genreKey} Hits`;
  return searchSongs(q, page, 20);
}

/**
 * Universal API Handler: compatible with Vercel Serverless Functions and Node.js http.Server
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(200).end();
    res.writeHead(200);
    return res.end();
  }

  const originalUrl = req.headers['x-forwarded-url'] || req.headers['x-matched-path'] || req.headers['x-invoke-path'] || req.url;
  const parsedUrl = new URL(originalUrl, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const pathParam = parsedUrl.searchParams.get('path') || '';

  const isSearch = pathname.endsWith('/search') || pathParam.startsWith('search');
  const isTrending = pathname.endsWith('/trending') || pathParam.startsWith('trending');
  const isLyrics = pathname.endsWith('/lyrics') || pathParam.startsWith('lyrics');
  const isExplore = pathname.endsWith('/explore') || pathParam.startsWith('explore');
  const isAlbum = pathname.endsWith('/album') || pathParam.startsWith('album');
  const isDownload = pathname.endsWith('/download') || pathParam.startsWith('download');
  const isRecommendations = pathname.endsWith('/recommendations') || pathParam.startsWith('recommendations');
  const isArtist = pathname.endsWith('/artist') || pathParam.startsWith('artist');
  const isSong = pathname.endsWith('/song') || pathParam.startsWith('song');

  const sendJson = (statusCode, data, maxAge = 120) => {
    if (statusCode === 200) {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge * 2}, stale-while-revalidate=86400`);
    }
    if (res.status && res.json) {
      return res.status(statusCode).json(data);
    }
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  try {
    // 0. Audio Download Proxy (attachment with memory-efficient stream piping)
    if (isDownload) {
      const audioUrl = parsedUrl.searchParams.get('url');
      const filename = parsedUrl.searchParams.get('filename') || 'track.m4a';
      if (!audioUrl) {
        return sendJson(400, { error: 'Missing audio url parameter' });
      }

      try {
        const audioRes = await safeFetch(audioUrl, { timeoutMs: 15000 });
        if (!audioRes.ok) {
          return sendJson(audioRes.status, { error: 'Failed to retrieve audio stream from CDN' });
        }
        const cType = audioRes.headers.get('content-type') || 'audio/mp4';
        const cLength = audioRes.headers.get('content-length');
        res.setHeader('Content-Type', cType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        if (cLength) res.setHeader('Content-Length', cLength);

        // Stream via Readable.fromWeb to eliminate heap buffer allocation
        if (audioRes.body && typeof Readable.fromWeb === 'function' && res.write) {
          Readable.fromWeb(audioRes.body).pipe(res);
          return;
        }

        const arrayBuffer = await audioRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (res.status && res.send) {
          return res.status(200).send(buffer);
        }
        res.writeHead(200);
        return res.end(buffer);
      } catch (err) {
        return sendJson(500, { error: 'Download stream error', message: err.message });
      }
    }

    // 1. Unified Search: Songs, Artists, and Albums
    if (isSearch) {
      const q = parsedUrl.searchParams.get('q');
      if (!q || !q.trim()) {
        return sendJson(200, { results: [], artists: [], albums: [], topResult: null });
      }

      const cacheKey = q.trim().toLowerCase().replace(/\s+/g, ' ');
      const cached = CACHE.search.get(cacheKey);
      if (cached) {
        return sendJson(200, cached, 600);
      }

      const [songs, artists, albums] = await Promise.all([
        searchSongs(q),
        searchArtists(q),
        searchAlbums(q)
      ]);

      // Calculate Top Result based on query relevance & photo availability
      let topResult = null;
      const qLower = cacheKey;
      
      const artistsWithImages = artists.filter(a => a.image && !a.image.includes('artist-default'));
      const exactArtist = artistsWithImages.find(a => a.name.toLowerCase() === qLower) || artists.find(a => a.name.toLowerCase() === qLower);
      const closeArtist = artistsWithImages.find(a => a.name.toLowerCase().includes(qLower) || qLower.includes(a.name.toLowerCase())) ||
                          artists.find(a => a.name.toLowerCase().includes(qLower) || qLower.includes(a.name.toLowerCase()));
      const exactSong = songs.find(s => s.title.toLowerCase() === qLower);
      const exactAlbum = albums.find(a => a.title.toLowerCase() === qLower);

      if (exactArtist) {
        topResult = { type: 'artist', data: exactArtist };
      } else if (exactSong) {
        topResult = { type: 'song', data: exactSong };
      } else if (exactAlbum) {
        topResult = { type: 'album', data: exactAlbum };
      } else if (closeArtist) {
        topResult = { type: 'artist', data: closeArtist };
      } else if (songs.length > 0) {
        topResult = { type: 'song', data: songs[0] };
      } else if (artists.length > 0) {
        topResult = { type: 'artist', data: artists[0] };
      } else if (albums.length > 0) {
        topResult = { type: 'album', data: albums[0] };
      }

      const payload = {
        results: songs,
        artists,
        albums,
        topResult
      };

      CACHE.search.set(cacheKey, payload, 900000);
      return sendJson(200, payload, 600);
    }

    // 2. Dedicated Song Details & Related Songs
    if (isSong) {
      const id = parsedUrl.searchParams.get('id');
      if (!id) {
        return sendJson(400, { error: 'Missing song id parameter' });
      }

      const cacheKey = id.trim();
      const cached = CACHE.song.get(cacheKey);
      if (cached) {
        return sendJson(200, cached, 300);
      }

      const songData = await fetchSongDetails(id);
      if (!songData) {
        return sendJson(404, { error: 'Song not found' });
      }

      CACHE.song.set(cacheKey, songData, 600000);
      return sendJson(200, songData, 300);
    }

    // 3. Dedicated Album Details & Full Tracklist
    if (isAlbum) {
      const id = parsedUrl.searchParams.get('id');
      if (!id) {
        return sendJson(400, { error: 'Missing album id parameter' });
      }

      const cacheKey = id.trim();
      const cached = CACHE.album.get(cacheKey);
      if (cached) {
        return sendJson(200, cached, 300);
      }

      const albumData = await fetchAlbumDetails(id);
      if (!albumData) {
        return sendJson(404, { error: 'Album not found', songs: [] });
      }

      CACHE.album.set(cacheKey, albumData, 600000);
      return sendJson(200, albumData, 300);
    }

    // 4. Dedicated Artist / Singer Page Details & Top Songs & Albums
    if (isArtist) {
      const id = parsedUrl.searchParams.get('id');
      const name = parsedUrl.searchParams.get('name');
      const cacheKey = (id || name || '').trim().toLowerCase();

      if (cacheKey) {
        const cached = CACHE.artist.get(cacheKey);
        if (cached) {
          return sendJson(200, cached, 300);
        }
      }

      if (id && !id.startsWith('artist-')) {
        const details = await fetchArtistDetails(id);
        if (details) {
          CACHE.artist.set(cacheKey, details, 600000);
          return sendJson(200, details, 300);
        }
      }

      if (name) {
        const [songs, artists, albums] = await Promise.all([
          searchSongs(name, 1, 40),
          searchArtists(name, 1, 8),
          searchAlbums(name, 1, 12)
        ]);

        const uniqueTitles = new Set(songs.map(t => normalizeTrackTitle(t.title)));
        if (uniqueTitles.size < 10) {
          const page2Songs = await searchSongs(name, 2, 40);
          songs.push(...page2Songs);
        }

        const matchingArtist = artists.find(a => a.name.toLowerCase() === name.toLowerCase()) || artists[0];

        const payload = {
          id: matchingArtist?.id || `artist-${Date.now()}`,
          name: matchingArtist?.name || name,
          image: matchingArtist?.image || songs[0]?.cover || 'assets/logo.jpg',
          subtitle: matchingArtist?.role || 'Indian Singer & Artist',
          bio: '',
          followerCount: '1M+',
          isVerified: true,
          songs,
          albums,
          similarArtists: artists.filter(a => a.name.toLowerCase() !== name.toLowerCase())
        };

        CACHE.artist.set(cacheKey, payload, 600000);
        return sendJson(200, payload, 300);
      }

      return sendJson(400, { error: 'Missing artist id or name' });
    }

    // 5. Indian Trending & Curated Shelves
    if (isTrending) {
      const category = (parsedUrl.searchParams.get('category') || 'all').toLowerCase();

      const cached = CACHE.trending.get(category);
      if (cached) {
        return sendJson(200, cached);
      }

      if (category === 'all') {
        const [superhits, trending, punjabi, romantic, arijit, haryanvi, bollywood, indie] = await Promise.all([
          fetchPlaylistSongs(CHARTS.superhits),
          fetchPlaylistSongs(CHARTS.trending),
          fetchPlaylistSongs(CHARTS.punjabi),
          fetchPlaylistSongs(CHARTS.romantic),
          fetchPlaylistSongs(CHARTS.arijit),
          fetchGenreSongs('haryanvi'),
          fetchGenreSongs('bollywood'),
          fetchGenreSongs('indie')
        ]);

        const payload = {
          quickPicks: superhits.slice(0, 16),
          trendingHits: trending.slice(0, 12),
          punjabiHits: (punjabi.length > 0 ? punjabi : trending).slice(0, 12),
          romanticHits: (romantic.length > 0 ? romantic : superhits).slice(0, 12),
          arijitHits: (arijit.length > 0 ? arijit : superhits).slice(0, 12),
          haryanviHits: haryanvi.slice(0, 12),
          bollywoodHits: bollywood.slice(0, 12),
          indieHits: indie.slice(0, 12)
        };

        CACHE.trending.set('all', payload, 600000);
        return sendJson(200, payload);
      }

      let songs = [];
      if (CHARTS[category]) {
        songs = await fetchPlaylistSongs(CHARTS[category]);
      } else if (GENRE_QUERIES[category]) {
        songs = await fetchGenreSongs(category);
      } else {
        songs = await searchSongs(`${category} Songs`);
      }

      if (!songs || songs.length === 0) {
        songs = await fetchPlaylistSongs(CHARTS.superhits);
      }

      const payload = { songs };
      CACHE.trending.set(category, payload, 600000);
      return sendJson(200, payload);
    }

    // 6. Synced Lyrics
    if (isLyrics) {
      const track = parsedUrl.searchParams.get('track') || '';
      const artist = parsedUrl.searchParams.get('artist') || '';
      const lyricsData = await fetchLyrics(track, artist);
      return sendJson(200, lyricsData);
    }

    // 7. Explore (New Releases, Charts, Moods)
    if (isExplore) {
      const cachedExplore = CACHE.trending.get('explore');
      if (cachedExplore) {
        return sendJson(200, cachedExplore);
      }

      const [newReleases, superhits] = await Promise.all([
        fetchNewReleases(),
        fetchPlaylistSongs(CHARTS.superhits)
      ]);

      const canonicalCharts = [
        { id: 'chart-1', rank: 1, rankChange: '+1', title: 'Casa Tupka Anthem', artist: 'Yo Yo Honey Singh', album: 'Casa Tupka', cover: 'assets/casa_tupka.jpg', duration: 183, audioUrl: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4' },
        { id: 'chart-2', rank: 2, rankChange: '-1', title: 'Gehra Hua', artist: 'Arijit Singh, Armaan Malik', album: 'Gehra Hua', cover: 'https://c.saavncdn.com/475/Dhurandhar-Hindi-2025-20260203083204-500x500.jpg', duration: 362 },
        { id: 'chart-3', rank: 3, rankChange: '—', title: 'Parvati', artist: 'Sadhu Tiwari', album: 'Parvati', cover: 'https://c.saavncdn.com/058/Hanuman-Ansh-Original-Motion-Picture-Soundtrack-Hindi-2026-20260710211303-500x500.jpg', duration: 284 },
        { id: 'chart-4', rank: 4, rankChange: '+2', title: 'Tera Mera Rishta', artist: 'Mithoon, Pritam, Saaj Bhatt', album: 'Awarapan 2', cover: 'https://c.saavncdn.com/820/Awarapan-2-Hindi-2026-20260929184517-500x500.jpg', duration: 365 },
        { id: 'chart-5', rank: 5, rankChange: 'NEW', title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', cover: 'https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-500x500.jpg', duration: 262 },
        { id: 'chart-6', rank: 6, rankChange: '+1', title: 'Saiyaara', artist: 'Various Artists', album: 'Ek Tha Tiger', cover: 'https://c.saavncdn.com/598/Saiyaara-Hindi-2025-20250703061754-500x500.jpg', duration: 370 },
        { id: 'chart-7', rank: 7, rankChange: '-2', title: 'Dheere Dheere', artist: 'Yo Yo Honey Singh', album: 'Dheere Dheere', cover: 'https://c.saavncdn.com/808/Dheere-Dheere-Hindi-2015-500x500.jpg', duration: 238 },
        { id: 'chart-8', rank: 8, rankChange: '+1', title: 'Barbaad', artist: 'Jubin Nautiyal', album: 'Barbaad', cover: 'https://c.saavncdn.com/598/Saiyaara-Hindi-2025-20250703061754-500x500.jpg', duration: 255 },
        { id: 'chart-9', rank: 9, rankChange: 'NEW', title: 'Apna Bana Le', artist: 'Sachin-Jigar, Arijit', album: 'Bhediya', cover: 'https://c.saavncdn.com/815/Bhediya-Hindi-2023-20230927155213-500x500.jpg', duration: 261 },
        { id: 'chart-10', rank: 10, rankChange: '+2', title: 'Vaaroon Forever', artist: 'Various Artists', album: 'Vaaroon Forever', cover: 'https://c.saavncdn.com/381/Vaaroon-Forever-From-Mirzapur-The-Movie-Hindi-2026-20260817160523-500x500.jpg', duration: 252 },
        { id: 'chart-11', rank: 11, rankChange: '—', title: 'Husn', artist: 'Anuv Jain', album: 'Husn', cover: 'https://c.saavncdn.com/436/Husn-Hindi-2023-20231129054140-500x500.jpg', duration: 306 },
        { id: 'chart-12', rank: 12, rankChange: '+1', title: 'Arz Kiya Hai', artist: 'Anuv Jain', album: 'Coke Studio Bharat', cover: 'https://c.saavncdn.com/504/Arz-Kiya-Hai-Coke-Studio-Bharat-Hindi-2025-20250818054005-500x500.jpg', duration: 294 }
      ];

      // Merge audio from live tracks where title matches
      canonicalCharts.forEach(c => {
        const found = superhits.find(s => s && s.title && s.title.toLowerCase().includes(c.title.toLowerCase()));
        if (found && found.audioUrl) c.audioUrl = found.audioUrl;
      });

      // Fill remaining spots up to 20 with live superhits
      const remaining = superhits.slice(12, 20).map((s, idx) => ({
        ...s,
        rank: 13 + idx,
        rankChange: idx % 2 === 0 ? '+1' : 'NEW'
      }));

      const exploreData = {
        newReleases: newReleases.slice(0, 12),
        topCharts: [...canonicalCharts, ...remaining]
      };

      CACHE.trending.set('explore', exploreData, 600000);
      return sendJson(200, exploreData);
    }

    // 8. Recommendations & Continuous Discovery Engine
    if (isRecommendations) {
      const artist = parsedUrl.searchParams.get('artist') || '';
      const genre = parsedUrl.searchParams.get('genre') || '';
      const qParam = parsedUrl.searchParams.get('q') || '';
      const trackId = parsedUrl.searchParams.get('trackId') || '';
      const page = Math.max(1, parseInt(parsedUrl.searchParams.get('page') || '1', 10));
      const limit = Math.min(30, parseInt(parsedUrl.searchParams.get('limit') || '16', 10));

      const trendingSearches = [
        'Arijit Singh',
        'Dhanda Nyoliwala',
        'Diljit Dosanjh',
        'The Weeknd',
        'Tauba Tauba',
        'Kesariya',
        'Bollywood Romance',
        'Haryanvi Hits',
        'Sid Sriram',
        'Anirudh Ravichander',
        'Punjabi Hits',
        'Shreya Ghoshal',
        'Karan Aujla',
        'Lofi Hindi'
      ];

      const cacheKey = ('reco__' + (artist || genre || qParam || 'all') + `__p${page}`).toLowerCase();
      const cachedReco = CACHE.trending.get(cacheKey);
      if (cachedReco) {
        return sendJson(200, cachedReco);
      }

      let recommendedTracks = [];

      // 1. If artist specified: query songs by primary artist with pagination support
      if (artist && artist.trim()) {
        const primaryArtist = artist.split(/[,&/|]|\bfeat\.?\b|\bft\.?\b/i)[0].replace(/\([^)]*\)/g, '').trim();
        const searchResults = await searchSongs(primaryArtist, page, 40);
        recommendedTracks = searchResults.filter(t => t && t.id !== trackId);

        // If duplicate releases compress unique titles, pull page + 1 for variety
        const initialTitles = new Set(recommendedTracks.map(t => normalizeTrackTitle(t.title)));
        if (initialTitles.size < 10) {
          const page2Results = await searchSongs(primaryArtist, page + 1, 40);
          recommendedTracks = [...recommendedTracks, ...page2Results.filter(t => t && t.id !== trackId)];
        }
      }

      // 2. If genre or query specified
      if (genre && recommendedTracks.length < limit) {
        const genreSongs = await fetchGenreSongs(genre, page);
        const filteredGenre = genreSongs.filter(t => t && t.id !== trackId && !recommendedTracks.some(r => r.id === t.id));
        recommendedTracks = [...recommendedTracks, ...filteredGenre];
      } else if (qParam && recommendedTracks.length < limit) {
        const querySongs = await searchSongs(qParam, page, 30);
        const filteredQ = querySongs.filter(t => t && t.id !== trackId && !recommendedTracks.some(r => r.id === t.id));
        recommendedTracks = [...recommendedTracks, ...filteredQ];
      }

      // 3. Fallback to genre-aligned discovery pool if sparse on page 1
      if (recommendedTracks.length < 8 && page === 1) {
        let pool = [];
        const gLower = (genre || '').toLowerCase();
        if (gLower === 'english' || gLower === 'pop' || gLower === 'synthpop') {
          pool = await searchSongs('Global Pop Hits', 1, 15);
        } else if (gLower === 'punjabi_hiphop' || gLower === 'punjabi') {
          pool = await fetchPlaylistSongs(CHARTS.punjabi);
        } else if (gLower === 'hindi_romantic' || gLower === 'romantic') {
          pool = await fetchPlaylistSongs(CHARTS.romantic);
        } else if (gLower === 'lofi' || gLower === 'chill') {
          pool = await searchSongs('Lofi Chill Beats', 1, 15);
        } else if (gLower === 'haryanvi') {
          pool = await fetchGenreSongs('haryanvi', 1);
        } else {
          const [superhits, trending] = await Promise.all([
            fetchPlaylistSongs(CHARTS.superhits),
            fetchPlaylistSongs(CHARTS.trending)
          ]);
          pool = [...superhits, ...trending];
        }
        const additional = pool.filter(t => t.id !== trackId && !recommendedTracks.some(r => r.id === t.id));
        recommendedTracks = [...recommendedTracks, ...additional];
      }

      // Deduplicate songs by normalized title + artist to remove compilation/duplicate releases
      const seenTitles = new Set();
      const dedupedTracks = [];
      for (const t of recommendedTracks) {
        const key = `${normalizeTrackTitle(t.title)}__${(t.artist || '').split(',')[0].toLowerCase().trim()}`;
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          dedupedTracks.push(t);
        }
      }

      const finalTracks = dedupedTracks.slice(0, limit);

      const payload = {
        recommendations: finalTracks,
        trendingSearches,
        artist: artist || '',
        genre: genre || '',
        page,
        count: finalTracks.length
      };

      CACHE.trending.set(cacheKey, payload, 300000);
      return sendJson(200, payload);
    }

    // Fallback status
    return sendJson(200, {
      name: 'REA Music API',
      status: 'online',
      version: '2.5.0',
      routes: [
        '/api/search',
        '/api/song',
        '/api/album',
        '/api/artist',
        '/api/trending',
        '/api/lyrics',
        '/api/explore',
        '/api/download',
        '/api/recommendations'
      ]
    });
  } catch (err) {
    console.error('API Error:', err);
    return sendJson(500, { error: 'Internal Server Error', message: err.message });
  }
}
