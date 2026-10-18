# 🛠️ REA Music — Complete Web Build & Development Guide

This guide provides instructions on how to set up your environment, run the local development server, build the production web bundles, and run automated smoke tests.

---

## 📋 Prerequisites & Toolchain Verification

REA Music is a zero-dependency web application built on standard modern web technologies:

| Tool | Recommended Version | Verified Version on System | Purpose |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0+` | `v24.16.0` | Local server runtime & bundling scripts |
| **npm** | `v9.0.0+` | `v11.3.0` | Lifecycle scripts execution |

Verify your environment:
```bash
node -v
npm -v
```

---

## 🚀 1. Local Development Server

Start the local Node.js HTTP development server:

```bash
npm start
# or
npm run dev
```

- Server listens at: `http://localhost:4500`
- Provides live static file serving from `public/` and `.`
- Proxies `/api/*` endpoints to `api/index.js`

---

## 📦 2. Building for Production

REA Music utilizes a high-performance inlining and bundling script (`build.js`) that concatenates and optimizes `css/index.css` and `js/app.js` into self-contained HTML files inside `dist/` and `public/`.

### Run the Web Build:
```bash
npm run build
# Or use the safe script wrapper:
npm run build:web
```

### What this command does:
1. Validates that `css/index.css`, `js/app.js`, and `index.html` exist.
2. Applies a double-initialization guard (`window.__REA_INITIALIZED__`) to the JavaScript engine.
3. Injects the complete stylesheet into the `<head>` of `index.html`.
4. Injects the core JavaScript before the closing `</body>` tag.
5. Injects inline SVG fallbacks for broken album cover art.
6. Generates `dist/index.html` and `public/index.html`.
7. Recursively synchronizes `assets/` to `dist/assets/` and `public/assets/`.

---

## 🧪 3. Verification & Smoke Testing

Run the automated verification suite and live server smoke tests:

```bash
# Verify project structure & configuration integrity:
npm run verify

# Run live HTTP & API router smoke tests:
npm test
```
