# 🎵 REA Music

> **High-Fidelity Apple Music Style Web Streaming Application**  
> Stream lossless 320kbps Indian music, synchronized karaoke lyrics, real-time Web Audio API frequency spectrum analyzer, and dual liquid glass themes (**Glass White** & **Simple Black**).

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20with-Vercel-black?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Audio: 320kbps](https://img.shields.io/badge/Audio-320kbps%20Ultra--HD-red)](#features)

---

## ✨ Features

- 🎧 **Lossless 320kbps Indian Music Streaming**: Direct integration with JioSaavn CDN with pure JS DES URL decryption.
- 🍏 **Apple Liquid Glass Aesthetics**: Precision frosted glassmorphism, dynamic ambient background lighting, and curated themes (**Glass White** & **Simple Black**).
- 🎤 **Synchronized Karaoke Lyrics**: Real-time line-by-line synchronized lyrics powered by the LRCLIB API with instant click-to-seek playback.
- 📊 **Real-time Web Audio API Spectrum Analyser**: Live dynamic frequency visualizer rendered in the player dock and theater mode.
- 📱 **Mobile First & Responsive**: Native iOS-inspired bottom tab navigation, swipeable music shelves, and floating theater player.
- ⚙️ **Settings & Preferences Modal**: Custom frosted glass settings dialog to toggle appearance, visualizer display, and manage listening history.
- ⚡ **Zero-Dependency Core**: Pure Vanilla HTML5, modern CSS3 variables, and vanilla JavaScript without heavy frontend frameworks.

---

## 📁 Systematic Folder Architecture

```
rea-music/
├── api/                       # Vercel Serverless Functions
│   ├── des.js                 # Pure JavaScript DES decipher for JioSaavn encrypted CDN URLs
│   └── index.js               # Universal API router (/api/trending, /api/search, /api/lyrics, etc.)
├── assets/                    # High-resolution album covers, brand logo & static media
│   ├── acoustic_sun.jpg
│   ├── cyber_phonk.jpg
│   ├── electro_horizon.jpg
│   ├── lofi_piano.jpg
│   ├── lofi_rain.jpg
│   ├── logo.jpg
│   └── midnight_vibes.jpg
├── css/                       # Modular Design System & Stylesheets
│   └── index.css              # Apple Music liquid glass design system & responsive styling
├── js/                        # Core Frontend Logic & Audio Engine
│   └── app.js                 # SPA navigation, hybrid audio engine, queue manager, & lyrics sync
├── index.html                 # Main Single Page Application interface
├── server.js                  # Lightweight local Node.js development server
├── vercel.json                # Vercel zero-config routing & edge caching headers
├── package.json               # Node.js manifest with dev & start scripts
└── .gitignore                 # Excluded build artifacts & environment variables
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher recommended)

### Installation & Running

1. Clone or download the repository:
   ```bash
   git clone https://github.com/Hvsr1984/Rea-open-source-music.git
   cd rea-music
   ```

2. Start the local server:
   ```bash
   npm start
   # or
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:4500
   ```

---

## ☁️ Deploying to Vercel

### Method 1: Deploy with Vercel Web Dashboard (Recommended)

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of REA Music"
   git branch -M main
   git remote add origin https://github.com/Hvsr1984/Rea-open-source-music.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the `Rea-open-source-music` repository from GitHub.
4. Leave all build settings as default (Framework Preset: **Other**; Output Directory: `./`).
5. Click **Deploy**. Vercel will build and deploy the frontend and serverless API in seconds!

### Method 2: Deploy with Vercel CLI

1. Run the Vercel CLI from the `rea-music` directory:
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts to link your project.
3. For production deployment, run:
   ```bash
   npx vercel --prod
   ```

---

## 🛠️ API Endpoints (Vercel Serverless)

| Endpoint | Method | Description | Parameters |
|---|---|---|---|
| `/api/trending` | `GET` | Curated Indian charts, trending hits, and quick picks | `category`: `all`, `punjabi`, `romantic`, `superhits` |
| `/api/search` | `GET` | Search millions of Indian songs and artists | `q`: search query string |
| `/api/lyrics` | `GET` | Timecode synchronized lyrics | `track`: song title, `artist`: artist name |
| `/api/explore` | `GET` | New releases and Top 20 ranked leaderboard | none |
| `/api/album` | `GET` | Full track listing for a specific album | `id`: album ID |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
