import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import apiHandler from './api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4500;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const COMPRESSIBLE_EXTS = new Set(['.html', '.css', '.js', '.json', '.webmanifest', '.svg']);

/**
 * Universal Request Handler for both Vercel Serverless and local Node.js
 */
export default async function handler(req, res) {
  const host = req.headers.host || 'localhost';
  const trueUrl = req.headers['x-forwarded-url'] || req.headers['x-matched-path'] || req.headers['x-invoke-path'] || req.url;
  const parsedUrl = new URL(trueUrl, `http://${host}`);
  const pathname = parsedUrl.pathname;

  // 1. Delegate /api/* to the JioSaavn API router
  if (pathname.startsWith('/api') || req.url.startsWith('/api')) {
    if (req.headers['x-forwarded-url']) {
      req.url = req.headers['x-forwarded-url'];
    }
    return apiHandler(req, res);
  }

  // 2. Static file serving with SPA fallback
  let cleanUrl = pathname;
  if (cleanUrl === '/' || cleanUrl === '' || cleanUrl === '/server.js') {
    cleanUrl = '/index.html';
  }

  let filePath = path.join(__dirname, 'public', cleanUrl);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, cleanUrl);
  }

  // If path doesn't exist, fall back to index.html (SPA routing)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // ETag & Conditional 304 validation for instant reloads
    const hash = crypto.createHash('md5').update(content).digest('hex').slice(0, 16);
    const etag = `W/"${content.length.toString(16)}-${hash}"`;
    res.setHeader('ETag', etag);

    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304);
      return res.end();
    }

    // High performance device caching & PWA headers
    if (cleanUrl === '/sw.js') {
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (ext === '.webmanifest' || cleanUrl === '/manifest.webmanifest' || cleanUrl === '/manifest.json') {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (ext === '.html' || cleanUrl === '/index.html') {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (['.jpg', '.jpeg', '.png', '.svg', '.webp', '.ico'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (['.css', '.js', '.json'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }

    // Device & network compression (gzip / brotli) for text payloads
    const acceptEncoding = (req.headers['accept-encoding'] || '').toLowerCase();
    let finalPayload = content;

    if (COMPRESSIBLE_EXTS.has(ext) && content.length > 512) {
      res.setHeader('Vary', 'Accept-Encoding');
      if (acceptEncoding.includes('br') && typeof zlib.brotliCompressSync === 'function') {
        res.setHeader('Content-Encoding', 'br');
        finalPayload = zlib.brotliCompressSync(content, {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 4
          }
        });
      } else if (acceptEncoding.includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip');
        finalPayload = zlib.gzipSync(content, { level: 6 });
      }
    }

    if (res.status && res.send) {
      return res.status(200).send(finalPayload);
    }
    res.writeHead(200);
    res.end(finalPayload);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Error');
  }
}

// Start local HTTP server if running outside of Vercel
if (!process.env.VERCEL) {
  const server = http.createServer(handler);
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`REA_MUSIC_SERVER_READY:http://localhost:${PORT}`);
  });
}
