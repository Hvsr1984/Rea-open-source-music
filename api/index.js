import { decryptSaavnUrl } from './des.js';

// In-memory cache for fast response times in serverless execution
const CACHE = {
  trending: {},
  search: {},
  lyrics: {}
};

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
  const audioUrl = decryptSaavnUrl(s.encrypted_media_url);
  const image = (s.image || '')
    .replace('150x150.jpg', '500x500.jpg')
    .replace('150x150.png', '500x500.png')
    .replace('50x50.jpg', '500x500.jpg');

  return {
    id: s.id || `track-${Math.random().toString(36).substring(2, 9)}`,
    title: decodeEntities(s.song || s.title || 'Unknown Title'),
    artist: decodeEntities(s.singers || s.primary_artists || s.music || 'Various Artists'),
    album: decodeEntities(s.album || s.more_info?.album || 'Single'),
    cover: image || 'assets/logo.jpg',
    duration: parseInt(s.duration, 10) || 210,
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
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const clean = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    const data = JSON.parse(clean);
    const rawSongs = data.songs || data.list || [];
    return rawSongs
      .map(formatSong)
      .filter(s => s.audioUrl);
  } catch (e) {
    console.error(`Error fetching playlist ${listId}:`, e.message);
    return [];
  }
}

async function searchSongs(query) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&n=25&p=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const clean = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    const data = JSON.parse(clean);
    const results = data.results || [];
    return results
      .map(formatSong)
      .filter(s => s.audioUrl);
  } catch (e) {
    console.error(`Search error for ${query}:`, e.message);
    return [];
  }
}

async function fetchLyrics(track, artist) {
  const cacheKey = `${track}__${artist}`.toLowerCase();
  if (CACHE.lyrics[cacheKey]) return CACHE.lyrics[cacheKey];

  try {
    const cleanTrack = track.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
    const cleanArtist = (artist || '').split(',')[0].trim();
    const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTrack)}&artist_name=${encodeURIComponent(cleanArtist)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'REAMusic/1.0' },
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.syncedLyrics) {
        const parsed = parseLRC(data.syncedLyrics);
        const result = { synced: true, lines: parsed };
        CACHE.lyrics[cacheKey] = result;
        return result;
      } else if (data.plainLyrics) {
        const lines = data.plainLyrics
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean)
          .map((text, i) => ({ time: i * 5, text }));
        const result = { synced: false, lines };
        CACHE.lyrics[cacheKey] = result;
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
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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

async function fetchAlbumSongs(albumId) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=content.getAlbumDetails&_format=json&albumid=${albumId}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const clean = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    const data = JSON.parse(clean);
    return (data.songs || []).map(formatSong).filter(s => s.audioUrl);
  } catch (e) {
    console.error(`Error fetching album ${albumId}:`, e.message);
    return [];
  }
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

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  const sendJson = (statusCode, data) => {
    if (res.status && res.json) {
      return res.status(statusCode).json(data);
    }
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  try {
    // 1. Search Indian songs
    if (pathname.endsWith('/search')) {
      const q = parsedUrl.searchParams.get('q');
      if (!q || !q.trim()) {
        return sendJson(200, { results: [] });
      }

      const cacheKey = q.trim().toLowerCase();
      if (CACHE.search[cacheKey] && Date.now() - CACHE.search[cacheKey].time < 300000) {
        return sendJson(200, { results: CACHE.search[cacheKey].data });
      }

      const results = await searchSongs(q);
      CACHE.search[cacheKey] = { time: Date.now(), data: results };
      return sendJson(200, { results });
    }

    // 2. Indian Trending & Curated Shelves
    if (pathname.endsWith('/trending')) {
      const category = parsedUrl.searchParams.get('category') || 'all';

      if (CACHE.trending[category] && Date.now() - CACHE.trending[category].time < 600000) {
        return sendJson(200, CACHE.trending[category].data);
      }

      if (category === 'all') {
        const [superhits, punjabi, romantic, trending, arijit] = await Promise.all([
          fetchPlaylistSongs(CHARTS.superhits),
          fetchPlaylistSongs(CHARTS.punjabi),
          fetchPlaylistSongs(CHARTS.romantic),
          fetchPlaylistSongs(CHARTS.trending),
          fetchPlaylistSongs(CHARTS.arijit)
        ]);

        const payload = {
          quickPicks: superhits.slice(0, 16),
          trendingHits: trending.slice(0, 12),
          punjabiHits: punjabi.slice(0, 12),
          romanticHits: romantic.slice(0, 12),
          arijitHits: arijit.slice(0, 12)
        };

        CACHE.trending['all'] = { time: Date.now(), data: payload };
        return sendJson(200, payload);
      }

      const chartId = CHARTS[category] || CHARTS.superhits;
      const songs = await fetchPlaylistSongs(chartId);
      CACHE.trending[category] = { time: Date.now(), data: { songs } };
      return sendJson(200, { songs });
    }

    // 3. Synced Lyrics
    if (pathname.endsWith('/lyrics')) {
      const track = parsedUrl.searchParams.get('track') || '';
      const artist = parsedUrl.searchParams.get('artist') || '';
      const lyricsData = await fetchLyrics(track, artist);
      return sendJson(200, lyricsData);
    }

    // 4. Explore (New Releases, Charts, Moods)
    if (pathname.endsWith('/explore')) {
      if (CACHE.trending['explore'] && Date.now() - CACHE.trending['explore'].time < 600000) {
        return sendJson(200, CACHE.trending['explore'].data);
      }

      const [newReleases, superhits] = await Promise.all([
        fetchNewReleases(),
        fetchPlaylistSongs(CHARTS.superhits)
      ]);

      const exploreData = {
        newReleases: newReleases.slice(0, 12),
        topCharts: superhits.slice(0, 20).map((s, idx) => ({
          ...s,
          rank: idx + 1,
          rankChange: idx === 0 ? '#1' : idx % 3 === 0 ? '+2' : idx % 2 === 0 ? 'NEW' : '+1'
        }))
      };

      CACHE.trending['explore'] = { time: Date.now(), data: exploreData };
      return sendJson(200, exploreData);
    }

    // 5. Album songs
    if (pathname.endsWith('/album')) {
      const id = parsedUrl.searchParams.get('id');
      if (!id) {
        return sendJson(200, { songs: [] });
      }
      const songs = await fetchAlbumSongs(id);
      return sendJson(200, { songs });
    }

    // Fallback status
    return sendJson(200, {
      name: 'REA Music API',
      status: 'online',
      version: '2.4.0',
      routes: ['/api/search', '/api/trending', '/api/lyrics', '/api/explore', '/api/album']
    });
  } catch (err) {
    console.error('API Error:', err);
    return sendJson(500, { error: 'Internal Server Error', message: err.message });
  }
}
