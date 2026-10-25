import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('[REA Build] Starting build process...');

// Read source files
const cssPath = path.join(__dirname, 'css', 'index.css');
const jsPath = path.join(__dirname, 'js', 'app.js');
const htmlTemplatePath = path.join(__dirname, 'index.html');

let cssContent = fs.readFileSync(cssPath, 'utf8');
let jsContent = fs.readFileSync(jsPath, 'utf8');
let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');

// SVG fallback for broken cover art
const FALLBACK_COVER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231c1c1e'/%3E%3Cstop offset='100%25' stop-color='%232c2c2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23g)'/%3E%3Ccircle cx='150' cy='150' r='60' fill='%230071e3' opacity='0.85'/%3E%3Cpath d='M150 115v45.5c-2.4-1.4-5.2-2.3-8.2-2.3-9.1 0-16.5 7.4-16.5 16.5s7.4 16.5 16.5 16.5 16.5-7.4 16.5-16.5V131h16.5v-16H150z' fill='%23ffffff'/%3E%3C/svg%3E";

// Ensure jsContent has guard against double initialization
if (!jsContent.includes('window.__REA_INITIALIZED__')) {
  jsContent = `// REA Music Engine v2.5.0
if (window.__REA_INITIALIZED__) {
  console.log('[REA] App already initialized');
} else {
  window.__REA_INITIALIZED__ = true;
  const FALLBACK_COVER = "${FALLBACK_COVER_SVG}";
  ${jsContent}
}
`;
}

// In jsContent, replace any onerror image fallbacks to fallback SVG
jsContent = jsContent.replace(/this\.src='assets\/logo\.jpg'/g, `this.src='${FALLBACK_COVER_SVG}'`);
jsContent = jsContent.replace(/this\.src='assets\/midnight_vibes\.jpg'/g, `this.src='${FALLBACK_COVER_SVG}'`);

// Write back updated js/app.js
fs.writeFileSync(jsPath, jsContent, 'utf8');

// Ensure public and dist directories exist
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

fs.mkdirSync(path.join(publicDir, 'css'), { recursive: true });
fs.mkdirSync(path.join(publicDir, 'js'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'css'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'js'), { recursive: true });

fs.writeFileSync(path.join(publicDir, 'css', 'index.css'), cssContent, 'utf8');
fs.writeFileSync(path.join(publicDir, 'js', 'app.js'), jsContent, 'utf8');
fs.writeFileSync(path.join(distDir, 'css', 'index.css'), cssContent, 'utf8');
fs.writeFileSync(path.join(distDir, 'js', 'app.js'), jsContent, 'utf8');

// Prepare bundled HTML
let bundledHtml = htmlContent;
bundledHtml = bundledHtml.replace(/<style id="rea-embedded-styles">[\s\S]*?<\/style>/g, '');
bundledHtml = bundledHtml.replace(/<script id="rea-embedded-script">[\s\S]*?<\/script>/g, '');
bundledHtml = bundledHtml.replace(/<script src="js\/app\.js"><\/script>/g, '');
bundledHtml = bundledHtml.replace(/<link rel="stylesheet" href="css\/index\.css">\s*/g, '');

// Brand logo inline fallback (clean existing fallback first to ensure idempotency)
bundledHtml = bundledHtml.replace(/<div class="brand-logo-fallback"[^>]*>[\s\S]*?<\/div>\s*/g, '');
const brandImgRegex = /<img src="(?:\/)?(?:branding\/rea-music-logo\.png|assets\/logo\.jpg)"[^>]*class="brand-logo-img"[^>]*>/;
const brandReplacement = `<img src="/branding/rea-music-logo.png" alt="REA Music" class="brand-logo-img" width="32" height="32" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';">
        <div class="brand-logo-fallback" style="display:none; width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg, #8a2be2, #d924b8); align-items:center; justify-content:center; color:#fff; box-shadow:0 4px 12px rgba(138,43,226,0.35); margin-right:8px;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>`;
if (brandImgRegex.test(bundledHtml)) {
  bundledHtml = bundledHtml.replace(brandImgRegex, brandReplacement);
}

// Inject embedded CSS in <head>
const styleBlock = `  <style id="rea-embedded-styles">\n${cssContent}\n  </style>\n`;
bundledHtml = bundledHtml.replace('</head>', `${styleBlock}</head>`);

// Inject embedded JS before </body>
const scriptBlock = `  <script id="rea-embedded-script">\n${jsContent}\n  </script>\n`;
bundledHtml = bundledHtml.replace('</body>', `${scriptBlock}</body>`);

// Normalize excessive blank lines
bundledHtml = bundledHtml.replace(/\n\s*\n\s*\n+/g, '\n\n');

// Write out index.html, public/index.html, and dist/index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), bundledHtml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'index.html'), bundledHtml, 'utf8');
fs.writeFileSync(path.join(distDir, 'index.html'), bundledHtml, 'utf8');

// Copy assets folder into dist/assets and public/assets
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}

copyFolderRecursiveSync(path.join(__dirname, 'assets'), path.join(distDir, 'assets'));
copyFolderRecursiveSync(path.join(__dirname, 'assets'), path.join(publicDir, 'assets'));
copyFolderRecursiveSync(path.join(__dirname, 'branding'), path.join(distDir, 'branding'));
copyFolderRecursiveSync(path.join(__dirname, 'branding'), path.join(publicDir, 'branding'));

// Copy PWA manifest, service worker, and favicon files to public/ and dist/
[
  'manifest.webmanifest',
  'manifest.json',
  'sw.js',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-48x48.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png'
].forEach((file) => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
    fs.copyFileSync(src, path.join(distDir, file));
  }
});

console.log('[REA Build] Successfully generated dist/ with all static web assets!');
console.log(`[REA Build] Bundled HTML size: ${(Buffer.byteLength(bundledHtml) / 1024).toFixed(1)} KB`);
