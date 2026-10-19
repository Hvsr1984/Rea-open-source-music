import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9333/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const page = list.find(t => t.type === 'page');
        if (page) resolve(page.webSocketDebuggerUrl);
        else reject(new Error('No page target found'));
      });
    }).on('error', reject);
  });
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);

let msgId = 1;
const pending = new Map();

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  }
};

function send(method, params = {}) {
  const id = msgId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => ws.onopen = r);
console.log('Connected to Chrome CDP!');

// Enable required domains
await send('Page.enable');
await send('Runtime.enable');
await send('DOM.enable');

// Test 1: Desktop Viewport 1440x900
console.log('Testing Desktop 1440x900...');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false
});

await send('Page.navigate', { url: 'http://127.0.0.1:4500' });
await new Promise(r => setTimeout(r, 2500));

// Evaluate startup state
const desktopEval = await send('Runtime.evaluate', {
  expression: `(() => {
    const playerBar = document.getElementById('playerBar');
    const homeReleases = document.getElementById('homeReleasesCarousel');
    const homeCharts = document.getElementById('homeChartsGrid');
    const bgImage = document.getElementById('spatialBgImage');
    return {
      playerIsEmpty: playerBar?.classList.contains('is-empty'),
      releasesCount: homeReleases ? homeReleases.children.length : 0,
      chartsCount: homeCharts ? homeCharts.children.length : 0,
      hasBgImage: Boolean(bgImage),
      currentTheme: document.body.className
    };
  })()`,
  returnByValue: true
});
console.log('Desktop Startup State:', desktopEval.result.value);

// Screenshot desktop initial
const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity-ide\\brain\\a52fe635-e636-48a1-9c2f-837a6678debb';
fs.writeFileSync(path.join(artifactDir, 'spatial-desktop-startup.png'), Buffer.from(desktopShot.data, 'base64'));
console.log('Saved spatial-desktop-startup.png');

// Test 2: Click a song in the rankings or releases to begin playback
console.log('Testing Song Playback...');
await send('Runtime.evaluate', {
  expression: `(() => {
    const firstRanked = document.querySelector('.ranked-track-card');
    if (firstRanked) firstRanked.click();
  })()`
});

await new Promise(r => setTimeout(r, 1500));

const playingEval = await send('Runtime.evaluate', {
  expression: `(() => {
    const playerBar = document.getElementById('playerBar');
    const title = document.getElementById('playerTitle')?.textContent;
    const artist = document.getElementById('playerArtist')?.textContent;
    return {
      playerIsEmpty: playerBar?.classList.contains('is-empty'),
      title,
      artist
    };
  })()`,
  returnByValue: true
});
console.log('Desktop Playing State:', playingEval.result.value);

const playingShot = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync(path.join(artifactDir, 'spatial-desktop-playing.png'), Buffer.from(playingShot.data, 'base64'));
console.log('Saved spatial-desktop-playing.png');

// Test 3: Tablet 768x1024
console.log('Testing Tablet 768x1024...');
await send('Emulation.setDeviceMetricsOverride', {
  width: 768,
  height: 1024,
  deviceScaleFactor: 2,
  mobile: true
});
await new Promise(r => setTimeout(r, 1000));
const tabletShot = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync(path.join(artifactDir, 'spatial-tablet-768x1024.png'), Buffer.from(tabletShot.data, 'base64'));
console.log('Saved spatial-tablet-768x1024.png');

// Test 4: Mobile 390x844 (iPhone 14)
console.log('Testing Mobile 390x844...');
await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 3,
  mobile: true
});
await new Promise(r => setTimeout(r, 1000));
const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync(path.join(artifactDir, 'spatial-mobile-390x844.png'), Buffer.from(mobileShot.data, 'base64'));
console.log('Saved spatial-mobile-390x844.png');

console.log('All spatial tests completed successfully!');
process.exit(0);
