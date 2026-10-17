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
  jsContent = `// REA Music Engine v2.4.1
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

// Write back updated js/app.js and css/index.css
fs.writeFileSync(jsPath, jsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'app.js'), jsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'index.css'), cssContent, 'utf8');

// Ensure public directories exist
fs.mkdirSync(path.join(__dirname, 'public', 'css'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'public', 'js'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'public', 'css', 'index.css'), cssContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'public', 'js', 'app.js'), jsContent, 'utf8');

// Prepare bundled HTML
// 1. Remove previous embedded style/script tags if present
let bundledHtml = htmlContent;
bundledHtml = bundledHtml.replace(/<style id="rea-embedded-styles">[\s\S]*?<\/style>/g, '');
bundledHtml = bundledHtml.replace(/<script id="rea-embedded-script">[\s\S]*?<\/script>/g, '');

// 2. Brand logo inline fallback
const brandImgRegex = /<img src="assets\/logo\.jpg"[^>]*class="brand-logo-img"[^>]*>/;
const brandReplacement = `<img src="assets/logo.jpg" alt="REA Music Logo" class="brand-logo-img" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';">
        <div class="brand-logo-fallback" style="display:none; width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg, #0071e3, #42a5f5); align-items:center; justify-content:center; color:#fff; box-shadow:0 4px 12px rgba(0,113,227,0.35); margin-right:8px;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>`;
if (brandImgRegex.test(bundledHtml)) {
  bundledHtml = bundledHtml.replace(brandImgRegex, brandReplacement);
}

// 3. Inject embedded CSS in <head>
const styleBlock = `  <style id="rea-embedded-styles">\n${cssContent}\n  </style>\n`;
bundledHtml = bundledHtml.replace('</head>', `${styleBlock}</head>`);

// 4. Inject embedded JS before </body>
const scriptBlock = `  <script id="rea-embedded-script">\n${jsContent}\n  </script>\n`;
bundledHtml = bundledHtml.replace('</body>', `${scriptBlock}</body>`);

// Write out both index.html and public/index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), bundledHtml, 'utf8');
fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), bundledHtml, 'utf8');

console.log('[REA Build] Successfully generated self-contained index.html and public/index.html!');
console.log(`[REA Build] Bundled HTML size: ${(Buffer.byteLength(bundledHtml) / 1024).toFixed(1)} KB`);
