import { decryptSaavnUrl } from './des.js';

// In-memory cache for fast response times in serverless execution
const CACHE = {
  trending: {},
  search: {},
  lyrics: {},
  artist: {},
  album: {},
  song: {}
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
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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

async function searchSongs(query) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&n=20&p=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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

async function searchArtists(query) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getArtistResults&_format=json&n=8&p=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const clean = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    const data = JSON.parse(clean);
    const results = data.results || [];
    return results.map(a => ({
      id: a.id || a.artistId,
      name: decodeEntities(a.name),
      image: (a.image || '')
        .replace('50x50.jpg', '500x500.jpg')
        .replace('150x150.jpg', '500x500.jpg')
        .replace('50x50.png', '500x500.png')
        .replace('150x150.png', '500x500.png'),
      role: decodeEntities(a.role || 'Singer'),
      type: 'artist'
    })).filter(a => a.id && a.name);
  } catch (e) {
    console.error(`Artist search error for ${query}:`, e.message);
    return [];
  }
}

async function searchAlbums(query) {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getAlbumResults&_format=json&n=12&p=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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
    // 0. Audio Download Proxy (attachment or streaming)
    if (isDownload) {
      const audioUrl = parsedUrl.searchParams.get('url');
      const filename = parsedUrl.searchParams.get('filename') || 'track.m4a';
      if (!audioUrl) {
        return sendJson(400, { error: 'Missing audio url parameter' });
      }

      try {
        const audioRes = await fetch(audioUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        if (!audioRes.ok) {
          return sendJson(audioRes.status, { error: 'Failed to retrieve audio stream from CDN' });
        }
        const cType = audioRes.headers.get('content-type') || 'audio/mp4';
        const cLength = audioRes.headers.get('content-length');
        res.setHeader('Content-Type', cType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        if (cLength) res.setHeader('Content-Length', cLength);

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

      const cacheKey = q.trim().toLowerCase();
      if (CACHE.search[cacheKey] && Date.now() - CACHE.search[cacheKey].time < 300000) {
        return sendJson(200, CACHE.search[cacheKey].data, 300);
      }

      const [songs, artists, albums] = await Promise.all([
        searchSongs(q),
        searchArtists(q),
        searchAlbums(q)
      ]);

      // Calculate Top Result based on query relevance
      let topResult = null;
      const qLower = q.trim().toLowerCase();
      
      const exactArtist = artists.find(a => a.name.toLowerCase() === qLower);
      const closeArtist = artists.find(a => a.name.toLowerCase().includes(qLower) || qLower.includes(a.name.toLowerCase()));
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

      CACHE.search[cacheKey] = { time: Date.now(), data: payload };
      return sendJson(200, payload, 300);
    }

    // 2. Dedicated Song Details & Related Songs
    if (isSong) {
      const id = parsedUrl.searchParams.get('id');
      if (!id) {
        return sendJson(400, { error: 'Missing song id parameter' });
      }

      const cacheKey = id.trim();
      if (CACHE.song[cacheKey] && Date.now() - CACHE.song[cacheKey].time < 600000) {
        return sendJson(200, CACHE.song[cacheKey].data, 300);
      }

      const songData = await fetchSongDetails(id);
      if (!songData) {
        return sendJson(404, { error: 'Song not found' });
      }

      CACHE.song[cacheKey] = { time: Date.now(), data: songData };
      return sendJson(200, songData, 300);
    }

    // 3. Dedicated Album Details & Full Tracklist
    if (isAlbum) {
      const id = parsedUrl.searchParams.get('id');
      if (!id) {
        return sendJson(400, { error: 'Missing album id parameter' });
      }

      const cacheKey = id.trim();
      if (CACHE.album[cacheKey] && Date.now() - CACHE.album[cacheKey].time < 600000) {
        return sendJson(200, CACHE.album[cacheKey].data, 300);
      }

      const albumData = await fetchAlbumDetails(id);
      if (!albumData) {
        return sendJson(404, { error: 'Album not found', songs: [] });
      }

      CACHE.album[cacheKey] = { time: Date.now(), data: albumData };
      return sendJson(200, albumData, 300);
    }

    // 4. Dedicated Artist / Singer Page Details & Top Songs & Albums
    if (isArtist) {
      const id = parsedUrl.searchParams.get('id');
      const name = parsedUrl.searchParams.get('name');
      const cacheKey = (id || name || '').trim().toLowerCase();

      if (cacheKey && CACHE.artist[cacheKey] && Date.now() - CACHE.artist[cacheKey].time < 600000) {
        return sendJson(200, CACHE.artist[cacheKey].data, 300);
      }

      if (id && !id.startsWith('artist-')) {
        const details = await fetchArtistDetails(id);
        if (details) {
          CACHE.artist[cacheKey] = { time: Date.now(), data: details };
          return sendJson(200, details, 300);
        }
      }

      if (name) {
        const [songs, artists, albums] = await Promise.all([
          searchSongs(name),
          searchArtists(name),
          searchAlbums(name)
        ]);

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

        CACHE.artist[cacheKey] = { time: Date.now(), data: payload };
        return sendJson(200, payload, 300);
      }

      return sendJson(400, { error: 'Missing artist id or name' });
    }

    // 5. Indian Trending & Curated Shelves
    if (isTrending) {
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

    // 6. Synced Lyrics
    if (isLyrics) {
      const track = parsedUrl.searchParams.get('track') || '';
      const artist = parsedUrl.searchParams.get('artist') || '';
      const lyricsData = await fetchLyrics(track, artist);
      return sendJson(200, lyricsData);
    }

    // 7. Explore (New Releases, Charts, Moods)
    if (isExplore) {
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

    // 8. Indian Recommendations & Trending Search Suggestions
    if (isRecommendations) {
      const artist = parsedUrl.searchParams.get('artist') || '';
      const trackId = parsedUrl.searchParams.get('trackId') || '';
      const trendingSearches = [
        'Arijit Singh',
        'Diljit Dosanjh',
        'Tauba Tauba',
        'Kesariya',
        'Bollywood Romance',
        'Sid Sriram',
        'Anirudh Ravichander',
        'Punjabi Hits',
        'Shreya Ghoshal',
        'Karan Aujla',
        'Lofi Hindi'
      ];

      const cacheKey = ('reco__' + (artist || 'all')).toLowerCase();
      if (CACHE.trending[cacheKey] && Date.now() - CACHE.trending[cacheKey].time < 300000) {
        return sendJson(200, CACHE.trending[cacheKey].data);
      }

      let recommendedTracks = [];
      if (artist && artist.trim()) {
        const primaryArtist = artist.split(',')[0].replace(/\([^)]*\)/g, '').trim();
        const searchResults = await searchSongs(primaryArtist);
        recommendedTracks = searchResults
          .filter(t => t.id !== trackId)
          .slice(0, 14);
      }

      if (recommendedTracks.length < 8) {
        const [superhits, trending] = await Promise.all([
          fetchPlaylistSongs(CHARTS.superhits),
          fetchPlaylistSongs(CHARTS.trending)
        ]);
        const pool = [...superhits, ...trending];
        const additional = pool.filter(t => t.id !== trackId && !recommendedTracks.some(r => r.id === t.id));
        recommendedTracks = [...recommendedTracks, ...additional].slice(0, 18);
      }

      const payload = {
        recommendations: recommendedTracks,
        trendingSearches,
        artist: artist || 'Top Indian Hits'
      };

      CACHE.trending[cacheKey] = { time: Date.now(), data: payload };
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
