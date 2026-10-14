# OtakuHub ⛩️

> A sleek, high-performance anime discovery, streaming directory, and catalog platform powered by the Jikan (MyAnimeList) REST API.

![OtakuHub Preview](https://raw.githubusercontent.com/ysh1318/OtakuHub/main/public/banner.png)

## ✨ Features

- **🚀 Smart Jikan REST API Client**: Built-in serialized request queue (enforcing strict rate-limiting under 3 req/s), multi-tier in-memory & `sessionStorage` caching, request deduplication, and automatic exponential backoff on HTTP 429.
- **📺 Multi-Source Streaming & Player**: Integrated episode selector and multi-source HD stream playback via Megaplay embed.
- **🏷️ Real-time Airing Schedules**: Interactive 7-day Japan Standard Time schedule viewer with day filtering.
- **🔥 Curated Anime Shelves**: Trending Now, Airing This Season, Top Rated All-Time, Movies, Classics, and Subgenres (Mecha, Sports, Sci-Fi).
- **📋 Watchlist & Progress Tracker**: Track unwatched episodes and save favorites with persistent local storage and instant sync.
- **🌸 Ecchi & Mature Mode**: Dedicated 18+ portal with age gate verification, romance/harem categorization, and themed visuals.
- **🎧 Haptic Web Audio Synthesis**: Non-intrusive acoustic click and transition sound effects built with the Web Audio API.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 6 + Tailwind CSS v4
- **Animation**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Data Source**: Jikan REST API v4 (Official MyAnimeList API)
- **Hosting**: Cloudflare Pages / Workers

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/ysh1318/OtakuHub.git
cd OtakuHub

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Type check and build bundle
npm run build

# Preview locally
npm run preview
```

## 🌐 Deployment to Cloudflare Pages

OtakuHub is optimized for Cloudflare Pages:

```bash
# Build the project
npm run build

# Deploy via Wrangler
npx wrangler pages deploy dist --project-name otakuhub
```

Or connect `ysh1318/OtakuHub` directly in your Cloudflare Pages dashboard with build command `npm run build` and output directory `dist`.

## 📄 License

MIT © [Yash Awachar](https://github.com/ysh1318)
