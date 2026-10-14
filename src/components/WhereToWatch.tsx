import React, { useState, useEffect } from "react";
import { Anime, Platform } from "../types";
import { Icon } from "./Icons";

// ─── STREAMING PLATFORM METADATA ─────────────────────────────────────────────
const PLATFORM_META: Record<string, any> = {
  crunchyroll: { color: "#f47521", bg: "rgba(244,117,33,0.12)", border: "rgba(244,117,33,0.35)", logo: "🟠", tier: "official", price: "$7.99/mo", badge: "BEST SIMULCASTS", badgeColor: "#f47521" },
  netflix:      { color: "#e50914", bg: "rgba(229,9,20,0.1)",   border: "rgba(229,9,20,0.3)",   logo: "🔴", tier: "official", price: "$7–$23/mo", badge: "EXCLUSIVES",      badgeColor: "#e50914" },
  hidive:       { color: "#00a0e4", bg: "rgba(0,160,228,0.1)",  border: "rgba(0,160,228,0.3)",  logo: "🔵", tier: "official", price: "$4.99/mo", badge: "BEST VALUE",      badgeColor: "#00a0e4" },
  amazon:       { color: "#00a8e1", bg: "rgba(0,168,225,0.08)", border: "rgba(0,168,225,0.25)", logo: "📦", tier: "official", price: "$8.99/mo", badge: "HINDI DUB",       badgeColor: "#f59e0b" },
  hulu:         { color: "#1ce783", bg: "rgba(28,231,131,0.08)",border: "rgba(28,231,131,0.25)",logo: "🟢", tier: "official", price: "$7.99/mo", badge: "US PICK",         badgeColor: "#1ce783" },
  bilibili:     { color: "#00a1d6", bg: "rgba(0,161,214,0.1)",  border: "rgba(0,161,214,0.3)",  logo: "📺", tier: "official", price: "Free/Premium", badge: "CHINA OG",    badgeColor: "#00a1d6" },
  youtube:      { color: "#ff0000", bg: "rgba(255,0,0,0.08)",   border: "rgba(255,0,0,0.25)",   logo: "▶️", tier: "official", price: "Free",     badge: "FREE OFFICIAL",  badgeColor: "#ff0000" },
  animepahe:    { color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.28)",logo: "⚡", tier: "unofficial",price: "Free",     badge: "HIGH QUALITY",   badgeColor: "#6366f1" },
  anikoto:      { color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.28)",logo: "🔮", tier: "unofficial",price: "Free",     badge: "AD-LITE FAST",     badgeColor: "#a855f7" },
  miruro:       { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.28)",logo: "🌸", tier: "unofficial",price: "Free",     badge: "MULTI-LANG",     badgeColor: "#8b5cf6" },
  allanime:     { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.28)",logo: "🌿", tier: "unofficial",price: "Free",     badge: "VAST CATALOG",   badgeColor: "#10b981" },
  kickassanime: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", logo: "🔥", tier: "unofficial",price: "Free",     badge: "SIMULCAST",      badgeColor: "#ef4444" },
  aniwave:      { color: "#f59e0b", bg: "rgba(245,158,11,0.09)",border: "rgba(245,158,11,0.26)",logo: "🌊", tier: "unofficial",price: "Free",     badge: "MULTI-SERVER",   badgeColor: "#f59e0b" },
  aniwatchtv:   { color: "#06b6d4", bg: "rgba(6,182,212,0.09)", border: "rgba(6,182,212,0.26)", logo: "📡", tier: "unofficial",price: "Free",     badge: "BEST PLAYER",    badgeColor: "#06b6d4" },
};

const FALLBACK_PLATFORMS: Platform[] = [
  { id: "crunchyroll",  name: "Crunchyroll",    rank: 1,  note: "Largest anime library — 1,500+ titles, 45K+ eps. #1 for simulcasts.", sub: true, dub: true, hindi: false, catalog: 95, tier: "official", price: "$7.99/mo" },
  { id: "netflix",      name: "Netflix",         rank: 2,  note: "Exclusive originals: Cyberpunk Edgerunners, Pluto, NGE. Co-produces with top studios.", sub: true, dub: true, hindi: true,  catalog: 60, tier: "official", price: "$7–$23/mo" },
  { id: "hidive",       name: "HIDIVE",          rank: 3,  note: "Best for niche & retro titles. Uncensored versions, budget-friendly.", sub: true, dub: true, hindi: false, catalog: 70, tier: "official", price: "$4.99/mo" },
  { id: "amazon",       name: "Amazon Prime",    rank: 4,  note: "Exclusive seasonal picks + re-licensed catalog. Strong in South Asia.", sub: true, dub: true, hindi: true,  catalog: 45, tier: "official", price: "$8.99/mo" },
  { id: "anikoto",      name: "Kaido (Anikoto)", rank: 5,  note: "Fast ad-lite free streaming portal with automatic next-episode play.", sub: true, dub: true, hindi: false, catalog: 97, tier: "unofficial", price: "Free" },
  { id: "animepahe",    name: "AnimePahe",       rank: 6,  note: "Compact high-quality encodes. Great for bandwidth-limited users.", sub: true, dub: false, hindi: false, catalog: 90, tier: "unofficial", price: "Free" },
  { id: "allanime",     name: "AllAnime",        rank: 7,  note: "Aggregates multiple sources. Massive catalog with AniList sync.", sub: true, dub: true, hindi: false, catalog: 98, tier: "unofficial", price: "Free" },
  { id: "miruro",       name: "Miruro",          rank: 8,  note: "Multi-language subtitles, sleek modern interface, fast streams.", sub: true, dub: true, hindi: true,  catalog: 95, tier: "unofficial", price: "Free" },
  { id: "aniwave",      name: "GogoAnime (AniWave)", rank: 9,  note: "Active free stream source with multi-server playback and dual-audio support.", sub: true, dub: true, hindi: false, catalog: 90, tier: "unofficial", price: "Free" },
  { id: "aniwatchtv",   name: "HiAnime (AniWatch)",  rank: 10, note: "The official rebrand & successor to AniWatch. Clean adaptive web player.", sub: true, dub: true, hindi: false, catalog: 92, tier: "unofficial", price: "Free" },
  { id: "kickassanime", name: "KickAssAnime",    rank: 11, note: "Simulcast-friendly at kickassanime.mx — good video quality.", sub: true, dub: false, hindi: false, catalog: 88, tier: "unofficial", price: "Free" },
  { id: "hulu",         name: "Hulu",            rank: 12, note: "Strong US catalog with Crunchyroll bundle available.", sub: true, dub: true, hindi: false, catalog: 40, tier: "official", price: "$7.99/mo" },
];

function buildPlatformUrl(platformId: string, queryStr: string, malId?: number): string {
  const q = encodeURIComponent(queryStr);

  const routes: Record<string, () => string> = {
    crunchyroll:  () => `https://www.crunchyroll.com/search?q=${q}`,
    netflix:      () => `https://www.netflix.com/search?q=${q}`,
    hidive:       () => `https://www.hidive.com/search?q=${q}`,
    amazon:       () => `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${q}&_encoding=UTF8`,
    hulu:         () => `https://www.hulu.com/search?query=${q}`,
    bilibili:     () => `https://www.bilibili.tv/en/search?keyword=${q}&type=media_ft`,
    youtube:      () => `https://www.youtube.com/results?search_query=${q}+full+anime+official`,
    animepahe:    () => `https://animepahe.ru/anime?q=${q}`,
    anikoto:      () => `https://kaido.to/search?keyword=${q}`,
    miruro:       () => `https://www.miruro.tv/search?query=${q}`,
    allanime:     () => `https://allmanga.to/anime?name=${q}`,
    kickassanime: () => `https://kickassanime.mx/search?q=${q}`,
    aniwave:      () => `https://gogoanime3.co/search.html?keyword=${q}`,
    aniwatchtv:   () => `https://hianime.to/search?keyword=${q}`,
  };

  const fn = routes[platformId.toLowerCase()];
  if (fn) return fn();

  return malId 
    ? `https://myanimelist.net/anime/${malId}` 
    : `https://myanimelist.net/anime.php?q=${q}`;
}

export interface SearchCandidate {
  type: "short" | "english" | "romaji" | "japanese";
  label: string;
  query: string;
}

export function getInitialSearchQuery(anime: Anime | null): string {
  if (!anime) return "";
  const rawDefault = anime.title_english || anime.title || "";
  return rawDefault
    .replace(/\s*\((TV|Movie|ONA|OVA|Special|Dub|Sub|Aired|Source|Shorts)\)/gi, "")
    .trim();
}

export function getAnimeSearchCandidates(anime: Anime | null): SearchCandidate[] {
  if (!anime) return [];
  const candidates: SearchCandidate[] = [];

  const rawTitle = anime.title || "";
  const engTitle = anime.title_english || "";
  const japTitle = anime.title_japanese || "";

  // Helper to remove Jikan annotations/noise from MAL
  const cleanNoise = (str: string) => {
    return str
      .replace(/\s*\((TV|Movie|ONA|OVA|Special|Dub|Sub|Aired|Source|Shorts)\)/gi, "")
      .replace(/S\d+|Season \d+|Part \d+/gi, "")
      .replace(/2nd Season|3rd Season|4th Season|5th Season/gi, "")
      .trim();
  };

  const cleanBase = (str: string) => {
    const parts = str.split(/[:\-]/);
    if (parts.length > 1 && parts[0].trim().length > 2) {
      return cleanNoise(parts[0]);
    }
    return cleanNoise(str);
  };

  const primaryEng = engTitle ? cleanNoise(engTitle) : "";
  const primaryRaw = rawTitle ? cleanNoise(rawTitle) : "";

  // 1. Base / Franchise Name (Simplest term)
  const baseEng = engTitle ? cleanBase(engTitle) : "";
  const baseRaw = rawTitle ? cleanBase(rawTitle) : "";
  
  const shortQuery = baseEng || baseRaw;
  if (shortQuery) {
    candidates.push({
      type: "short",
      label: "Series Simple",
      query: shortQuery,
    });
  }

  // 2. English clean name
  if (primaryEng && primaryEng.toLowerCase() !== shortQuery.toLowerCase()) {
    candidates.push({
      type: "english",
      label: "English",
      query: primaryEng,
    });
  }

  // 3. Romaji / Jikan default raw
  if (primaryRaw && primaryRaw.toLowerCase() !== shortQuery.toLowerCase() && primaryRaw.toLowerCase() !== primaryEng.toLowerCase()) {
    candidates.push({
      type: "romaji",
      label: "Romaji",
      query: primaryRaw,
    });
  }

  // 4. Japanese Kanji
  if (japTitle) {
    candidates.push({
      type: "japanese",
      label: "Japanese",
      query: japTitle,
    });
  }

  // Deduplicate by query (ignore casing)
  const seen = new Set<string>();
  return candidates.filter((c) => {
    const qLower = c.query.toLowerCase();
    if (seen.has(qLower)) return false;
    seen.add(qLower);
    return true;
  });
}

function mergePlatformMeta(raw: Platform[]): Platform[] {
  return raw.map((p) => {
    const meta = PLATFORM_META[p.id] || PLATFORM_META[p.name?.toLowerCase().replace(/\s+/g, "")] || {};
    const color = meta.color || "#6366f1";
    return {
      ...p,
      color,
      bg:         meta.bg         || `${color}18`,
      border:     meta.border     || `${color}44`,
      logo:       meta.logo       || (p.tier === "official" ? "🎬" : "⚡"),
      badge:      meta.badge      || (p.tier === "official" ? "OFFICIAL" : "FREE"),
      badgeColor: meta.badgeColor || color,
      price:      p.price         || meta.price || "Free",
    };
  });
}

// ─── ECCHI SPECIFIC PLATFORMS ────────────────────────────────────────────────
const ECCHI_PLATFORM_META: Record<string, any> = {
  hidive:       { name: "HIDIVE", color: "#00a0e4", bg: "rgba(0,160,228,0.12)", border: "rgba(0,160,228,0.42)", logo: "🔵", tier: "official", price: "$4.99/mo", badge: "UNCENSORED #1", badgeColor: "#00a0e4", note: "Best legal ecchi platform — simulcasts Cho-Yowayowa & other fully uncensored titles. 18+ verified.", sub: true, dub: true, hindi: false, catalog: 88 },
  oceanveil:    { name: "OceanVeil", color: "#ec4899", bg: "rgba(236,72,153,0.13)", border: "rgba(236,72,153,0.45)", logo: "🌊", tier: "official", price: "Subscription", badge: "FULLY UNCENSORED", badgeColor: "#ec4899", note: "OceanVeil (WWWave/AnimeFesta, 2025) — streams 'Complete Deregula' versions in English with 18+ gate.", sub: true, dub: true, hindi: false, catalog: 75 },
  animefesta:   { name: "AnimeFesta", color: "#f43f5e", bg: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.4)", logo: "🎌", tier: "official", price: "440¥/mo", badge: "JP PREMIUM", badgeColor: "#f43f5e", note: "AnimeFesta (formerly ComicFesta Anime) — dual-version ecchi incl. 'Premium' uncensored. Japan-region.", sub: true, dub: false, hindi: false, catalog: 80 },
  crunchyroll:  { name: "Crunchyroll", color: "#f47521", bg: "rgba(244,117,33,0.14)", border: "rgba(244,117,33,0.4)", logo: "🟠", tier: "official", price: "$7.99/mo", badge: "SIMULCAST", badgeColor: "#f47521", note: "Best for mainstream ecchi — Highschool DxD, Food Wars, Keijo! Censored versions only.", sub: true, dub: true, hindi: false, catalog: 70 },
  netflix:      { name: "Netflix", color: "#e50914", bg: "rgba(229,9,20,0.1)", border: "rgba(229,9,20,0.3)", logo: "🔴", tier: "official", price: "$7–23/mo", badge: "EXCLUSIVES", badgeColor: "#e50914", note: "Home to Kakegurui, B: The Beginning — selective ecchi catalog, censored.", sub: true, dub: true, hindi: true, catalog: 40 },
  amazon:       { name: "Amazon Prime", color: "#00a8e1", bg: "rgba(0,168,225,0.09)", border: "rgba(0,168,225,0.28)", logo: "📦", tier: "official", price: "$8.99/mo", badge: "DUBBED", badgeColor: "#f59e0b", note: "Seasonal ecchi picks — sometimes carries uncensored BD versions.", sub: true, dub: true, hindi: true, catalog: 35 },
  allanime:     { name: "AllAnime", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.32)", logo: "🌿", tier: "unofficial", price: "Free", badge: "VAST CATALOG", badgeColor: "#10b981", note: "Largest free ecchi catalog — uncensored versions available, AniList sync.", sub: true, dub: true, hindi: false, catalog: 98 },
  miruro:       { name: "Miruro", color: "#ec4899", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.32)", logo: "🌸", tier: "unofficial", price: "Free", badge: "ECCHI PICK", badgeColor: "#ec4899", note: "Multi-language subtitles, clean modern UI — great for ecchi browsing.", sub: true, dub: true, hindi: true, catalog: 95 },
  animepahe:    { name: "AnimePahe", color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.3)", logo: "⚡", tier: "unofficial", price: "Free", badge: "HD QUALITY", badgeColor: "#a855f7", note: "High-quality compact encodes. Carries uncensored ecchi without ads.", sub: true, dub: false, hindi: false, catalog: 90 },
  anikoto:      { name: "Kaido (Anikoto)", color: "#f472b6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.32)", logo: "🔮", tier: "unofficial", price: "Free", badge: "AD-LITE FAST", badgeColor: "#f472b6", note: "Fast ad-lite free streaming portal with automatic next-episode play.", sub: true, dub: true, hindi: false, catalog: 97 },
  aniwatchtv:   { name: "HiAnime (AniWatch)", color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.3)", logo: "📡", tier: "unofficial", price: "Free", badge: "FAST STREAM", badgeColor: "#f43f5e", note: "Fast adaptive streams, built-in sub/dub toggle — ecchi-friendly.", sub: true, dub: true, hindi: false, catalog: 92 },
  aniwave:      { name: "GogoAnime (AniWave)", color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.3)", logo: "🌊", tier: "unofficial", price: "Free", badge: "MULTI-SERVER", badgeColor: "#fb923c", note: "Active free stream source with multi-server playback and dual-audio support.", sub: true, dub: true, hindi: false, catalog: 90 },
  kickassanime: { name: "KickAssAnime", color: "#ef4444", bg: "rgba(239,68,68,0.09)", border: "rgba(239,68,68,0.28)", logo: "🔥", tier: "unofficial", price: "Free", badge: "SIMULCAST", badgeColor: "#ef4444", note: "Simulcast-friendly — good for new season ecchi, fast updates.", sub: true, dub: false, hindi: false, catalog: 88 },
};

const ECCHI_PLATFORMS_LIST = [
  { id: "hidive",       rank: 1 },
  { id: "oceanveil",    rank: 2 },
  { id: "animefesta",   rank: 3 },
  { id: "crunchyroll",  rank: 4 },
  { id: "anikoto",      rank: 5 },
  { id: "allanime",     rank: 6 },
  { id: "miruro",       rank: 7 },
  { id: "animepahe",    rank: 8 },
  { id: "aniwatchtv",   rank: 9 },
  { id: "aniwave",      rank: 10 },
  { id: "netflix",      rank: 11 },
  { id: "kickassanime", rank: 12 },
  { id: "amazon",       rank: 13 },
];

function buildEcchiPlatformUrl(platformId: string, queryStr: string, malId?: number): string {
  const q = encodeURIComponent(queryStr);
  const routes: Record<string, () => string> = {
    crunchyroll:  () => `https://www.crunchyroll.com/search?q=${q}`,
    netflix:      () => `https://www.netflix.com/search?q=${q}`,
    hidive:       () => `https://www.hidive.com/search?q=${q}`,
    oceanveil:    () => `https://oceanveil.com/search?q=${q}`,
    animefesta:   () => `https://anime.animefesta.jp/search?q=${q}`,
    amazon:       () => `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${q}&_encoding=UTF8`,
    allanime:     () => `https://allmanga.to/anime?name=${q}`,
    miruro:       () => `https://www.miruro.tv/search?query=${q}`,
    animepahe:    () => `https://animepahe.ru/anime?q=${q}`,
    anikoto:      () => `https://kaido.to/search?keyword=${q}`,
    aniwatchtv:   () => `https://hianime.to/search?keyword=${q}`,
    aniwave:      () => `https://gogoanime3.co/search.html?keyword=${q}`,
    kickassanime: () => `https://kickassanime.mx/search?q=${q}`,
  };

  const fn = routes[platformId];
  return fn ? fn() : (malId ? `https://myanimelist.net/anime/${malId}` : `https://myanimelist.net/anime.php?q=${q}`);
}

// ─── HYBRID URL RESOLVER HOOK & DATA CACHING ────────────────────────────────
type ResolverStatus = "loading" | "direct" | "index" | "search";

interface PlatformUrlResult {
  url?: string;
  status: ResolverStatus;
  badge: string;
  badgeColor: string;
}

// Module-level caches definitions
const malSyncCache = new Map<number, any>(); // mal_id -> API JSON response
const malSyncPromises = new Map<number, Promise<any>>();
const malSyncErrors = new Set<number>();

const deadCheckCache = new Map<string, "checking" | "alive" | "dead" >();
const isDeadCache = new Set<string>();

// Listeners list for updates
type Listener = () => void;
const listeners = new Set<Listener>();

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(l => l());
};

// Mappings for MAL-Sync Sites
const MAL_SYNC_MAPPING: Record<string, string> = {
  aniwatchtv: "Zoro",
  animepahe: "Animepahe",
  allanime: "Allanime",
  aniwave: "Aniwave",
  kickassanime: "Kickassanime",
  miruro: "Miruro",
  anikoto: "Anikoto"
};

// Check if platform is official
function isOfficialPlatform(platformId: string): boolean {
  const lowerId = platformId.toLowerCase();
  const officialIds = ["crunchyroll", "netflix", "hidive", "amazon", "hulu", "bilibili", "youtube", "oceanveil", "animefesta"];
  if (officialIds.includes(lowerId)) return true;
  const meta = PLATFORM_META[lowerId] || ECCHI_PLATFORM_META[lowerId];
  if (meta?.tier === "official") return true;
  return false;
}

// Check link is dead using mode: "no-cors" fallback technique
async function isUrlDead(url: string): Promise<boolean> {
  if (isDeadCache.has(url)) return true;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (res.status >= 400) {
      isDeadCache.add(url);
      return true;
    }
    return false;
  } catch (err: any) {
    if (err.name === "AbortError") {
      isDeadCache.add(url);
      return true;
    }
    
    // Fallback block for CORS error:
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      await fetch(url, { method: "HEAD", mode: "no-cors", signal: controller.signal });
      clearTimeout(timeoutId);
      return false; // Server exists and responds (no TypeError or AbortError)
    } catch {
      isDeadCache.add(url);
      return true; // Completely dead
    }
  }
}

// Shared fetch worker
async function fetchMalSync(malId: number): Promise<any> {
  if (malSyncCache.has(malId)) {
    return malSyncCache.get(malId);
  }
  if (malSyncPromises.has(malId)) {
    return malSyncPromises.get(malId);
  }

  const promise = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    try {
      const response = await fetch(`https://api.malsync.moe/mal/anime/${malId}`, {
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!response.ok) {
        throw new Error(`MAL-Sync HTTP error: ${response.status}`);
      }
      const data = await response.json();
      malSyncCache.set(malId, data);
      return data;
    } catch (err) {
      clearTimeout(timer);
      malSyncErrors.add(malId);
      throw err;
    } finally {
      malSyncPromises.delete(malId);
    }
  })();

  malSyncPromises.set(malId, promise);
  return promise;
}

export function usePlatformUrl(
  platformId: string, 
  anime: Anime | null, 
  searchQuery: string
): PlatformUrlResult {
  const [, forceUpdate] = useState({});
  const malId = anime?.mal_id;

  useEffect(() => {
    return subscribe(() => forceUpdate({}));
  }, []);

  const isEcchi = (anime?.genres || []).some((g) => g.mal_id === 9 || g.name === "Ecchi");
  const fallbackUrl = isEcchi
    ? buildEcchiPlatformUrl(platformId, searchQuery, malId)
    : buildPlatformUrl(platformId, searchQuery, malId);

  if (!anime || !malId) {
    return { url: fallbackUrl, status: "search", badge: "Search", badgeColor: "#94a3b8" };
  }

  if (isOfficialPlatform(platformId)) {
    return { url: fallbackUrl, status: "search", badge: "Search", badgeColor: "#94a3b8" };
  }

  const lowerId = platformId.toLowerCase();
  const isTier1 = ["animepahe", "allanime", "aniwatchtv", "aniwave"].includes(lowerId);
  const isTier2 = ["kickassanime", "miruro", "anikoto"].includes(lowerId);

  const emSearchUrl = fallbackUrl;

  // Tier 3
  if (!isTier1 && !isTier2) {
    return { url: emSearchUrl, status: "index", badge: "Index", badgeColor: "#f59e0b" };
  }

  // Trigger MAL-Sync fetch if missing
  useEffect(() => {
    if (!malSyncCache.has(malId) && !malSyncPromises.has(malId) && !malSyncErrors.has(malId)) {
      fetchMalSync(malId)
        .then(() => notifyListeners())
        .catch(() => notifyListeners());
    }
  }, [malId]);

  // If currently fetching MAL-Sync:
  if (malSyncPromises.has(malId)) {
    return { status: "loading", badge: "Resolving", badgeColor: "#6366f1" };
  }

  // Check MAL-Sync results
  const malSyncJson = malSyncCache.get(malId);
  const mappedKey = MAL_SYNC_MAPPING[lowerId];

  if (malSyncJson && mappedKey) {
    const siteData = malSyncJson.Sites?.[mappedKey];
    let directUrl: string | undefined = undefined;
    if (siteData) {
      const entries = Array.isArray(siteData) ? siteData : Object.values(siteData);
      for (const entry of entries) {
        if (entry && typeof entry === 'object' && 'url' in entry && typeof entry.url === 'string') {
          directUrl = entry.url;
          break;
        }
      }
    }

    if (directUrl) {
      return { url: directUrl, status: "direct", badge: "Direct", badgeColor: "#10b981" };
    }
  }

  // If no MAL-Sync data or call failed or no mapped url: fallback to EM fallback (Step 2)
  return { url: emSearchUrl, status: "index", badge: "Index", badgeColor: "#f59e0b" };
}

// ─── REUSABLE PREMIUM PLATFORM CARD ──────────────────────────────────────────
export const PlatformCard: React.FC<{
  p: Platform;
  anime: Anime | null;
  searchQuery: string;
  isEcchiTheme: boolean;
  idx: number;
}> = ({ p, anime, searchQuery, isEcchiTheme, idx }) => {
  const { url, status, badge, badgeColor } = usePlatformUrl(p.id, anime, searchQuery);
  const [pendingOpen, setPendingOpen] = useState(false);

  // When resolved, if there was a pending open clicked during loading, trigger it!
  useEffect(() => {
    if (pendingOpen && status !== "loading" && url) {
      window.open(url, "_blank", "noopener,noreferrer");
      setPendingOpen(false);
    }
  }, [pendingOpen, status, url]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (status === "loading") {
      setPendingOpen(true);
    } else if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const isTop3 = (p.rank || 99) <= 3;
  const directPlatformSearchUrl = isEcchiTheme
    ? buildEcchiPlatformUrl(p.id, searchQuery, anime?.mal_id)
    : buildPlatformUrl(p.id, searchQuery, anime?.mal_id);

  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    background: isEcchiTheme ? "rgba(14, 10, 18, 0.72)" : "rgba(12, 12, 22, 0.72)",
    border: isTop3 
      ? `1px solid ${isEcchiTheme ? "rgba(236, 72, 153, 0.25)" : "rgba(99, 102, 241, 0.25)"}` 
      : "1px solid rgba(255, 255, 255, 0.04)",
    borderRadius: "18px",
    padding: "20px",
    textDecoration: "none",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    animation: `platformPop 0.4s ${idx * 45}ms cubic-bezier(0.16, 1, 0.3, 1) both`,
    "--brand-color": p.color,
    "--brand-bg-glow": `${p.color}18`,
    "--brand-border-glow": `${p.color}45`,
    ...(status === "loading" ? { 
      opacity: 0.75,
      pointerEvents: "auto",
    } : {})
  } as React.CSSProperties;

  return (
    <a
      href={url || "#"}
      onClick={handleCardClick}
      className={`${isEcchiTheme ? "ecchi-platform-card" : "platform-card"} group ${status === "loading" ? "resolver-loading" : ""}`}
      style={cardStyle}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Top left rank helper */}
        {isTop3 && isEcchiTheme && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background: "linear-gradient(135deg, #ec4899, #f43f5e)",
              borderRadius: "0 0 12px 0",
              padding: "4px 12px",
              fontSize: "9px",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "1px",
              zIndex: 3,
              boxShadow: "0 2px 8px rgba(236,72,153,0.3)",
            }}
          >
            {p.rank === 1 ? "🌸 BEST #1" : p.rank === 2 ? "💕 TOP #2" : "💋 HOT #3"}
          </div>
        )}
        {isTop3 && !isEcchiTheme && p.rank && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "linear-gradient(135deg, #fbbf24, #d97706)",
              backdropFilter: "blur(4px)",
              borderRadius: "6px",
              padding: "2px 8px",
              fontSize: "9.5px",
              fontWeight: 900,
              color: "#fff",
              border: "none",
              boxShadow: "0 2px 8px rgba(217, 119, 6, 0.3)",
              zIndex: 3,
            }}
          >
            #{p.rank}
          </div>
        )}
        {!isTop3 && p.rank && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              borderRadius: "6px",
              padding: "2px 8px",
              fontSize: "9.5px",
              fontWeight: 800,
              color: isEcchiTheme ? "#f472b6" : "#94a3b8",
              border: isEcchiTheme ? "1px solid rgba(236,72,153,0.15)" : "1px solid rgba(255, 255, 255, 0.08)",
              zIndex: 3,
            }}
          >
            #{p.rank}
          </div>
        )}

        {/* Dynamic Resolver Status Badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(0, 0, 0, 0.65)",
            border: `1px solid ${status === "loading" ? "rgba(255, 255, 255, 0.15)" : `${badgeColor}35`}`,
            borderRadius: "20px",
            padding: "3px 10px",
            fontSize: "8.5px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "1px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 3,
            backdropFilter: "blur(4px)",
          }}
        >
          {status === "loading" ? (
            <div className="resolver-spinner" />
          ) : (
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: badgeColor,
                boxShadow: `0 0 6px ${badgeColor}`,
              }}
            />
          )}
          <span>{pendingOpen && status === "loading" ? "Queued" : badge}</span>
        </div>

        {/* Header identity */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            marginTop: p.rank ? "20px" : "0",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="group-hover:scale-110 group-hover:rotate-3"
          >
            {p.logo}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#fff",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {p.id === "hidive" ? "HIDIVE" : p.name || p.id}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: isEcchiTheme ? "#f3a8cd" : "#cbd5e1",
                fontWeight: 500,
                marginTop: "1px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {p.price} · 
              <span
                style={{
                  color: p.tier === "official" ? "#34d399" : "#a78bfa",
                  background: p.tier === "official" ? "rgba(52,211,153,0.08)" : "rgba(167,139,250,0.08)",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  border: `1px solid ${p.tier === "official" ? "rgba(52,211,153,0.12)" : "rgba(167,139,250,0.12)"}`,
                  fontSize: "8.5px",
                  fontWeight: 700,
                }}
              >
                {p.tier === "official" ? "OFFICIAL" : isEcchiTheme ? "COMMUNITY" : "FAN PLATFORM"}
              </span>
            </div>
          </div>
          <svg
            viewBox="0 0 24 24"
            width={15}
            height={15}
            fill="none"
            stroke={p.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "transform 0.3s ease", opacity: 0.8 }}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>

        {/* Languages section */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
          {p.sub && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              <span style={{ fontSize: "10px" }}>💬</span>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "#34d399" }}>SUB</span>
            </div>
          )}
          {p.dub ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(249,115,22,0.06)",
                border: "1px solid rgba(249,115,22,0.2)",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              <span style={{ fontSize: "10px" }}>🎙️</span>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "#fb923c" }}>DUB</span>
            </div>
          ) : (p.dub === false ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(100,116,139,0.04)",
                border: "1px solid rgba(100,116,139,0.15)",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              <span style={{ fontSize: "10px" }}>🎙️</span>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "#71717a" }}>NO DUB</span>
            </div>
          ) : null)}

          {isEcchiTheme && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(236,72,153,0.08)",
                border: "1px solid rgba(236,72,153,0.3)",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              <span style={{ fontSize: "10px" }}>🔞</span>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "#f472b6" }}>UNCENSORED</span>
            </div>
          )}

          {p.hindi && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(99,102,241,0.06)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              <span style={{ fontSize: "10px" }}>🇮🇳</span>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "#818cf8" }}>हिंदी</span>
            </div>
          )}
        </div>

        {/* Catalog Coverage status bar */}
        {p.catalog != null && (
          <div style={{ marginBottom: "14px", marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "10.5px", color: isEcchiTheme ? "#fbcfe8" : "#cbd5e1", fontWeight: 700, letterSpacing: "0.2px" }}>
                {isEcchiTheme ? "Ecchi Coverage" : "Catalog Coverage"}
              </span>
              <span style={{ fontSize: "10.5px", color: p.color, fontWeight: 900 }}>
                {p.catalog}%
              </span>
            </div>
            <div
              style={{
                height: "4px",
                borderRadius: "3px",
                background: "rgba(255,255,255,0.04)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${p.catalog}%`,
                  background: isEcchiTheme 
                    ? `linear-gradient(90deg, #ec4899, ${p.color})` 
                    : `linear-gradient(90deg, #6366f1, ${p.color})`,
                  borderRadius: "3px",
                  boxShadow: `0 0 8px ${p.color}`,
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Description Copy */}
        <p style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.5, marginTop: p.catalog != null ? "4px" : "auto", fontWeight: 400 }}>
          {p.note}
        </p>
      </div>

      {/* Bottom search prompt to build incredible premium value */}
      <div
        style={{
          marginTop: "14px",
          paddingTop: "10px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div 
          onClick={(e) => {
            // Stop propagation so clicking direct search doesn't trigger cards main launch
            e.stopPropagation();
            window.open(directPlatformSearchUrl, "_blank", "noopener,noreferrer");
          }}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            minWidth: 0, 
            cursor: "pointer" 
          }}
          className="hover:opacity-80"
        >
          <Icon name="search" size={12} color={p.color} />
          <span
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontWeight: 500,
            }}
          >
            Search:{" "}
            <span style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {searchQuery}
            </span>
          </span>
        </div>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 800,
            color: p.color,
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "2px",
            flexShrink: 0,
            transition: "transform 0.3s ease",
          }}
          className="group-hover:translate-x-1"
        >
          {status === "loading" ? "RESOLVING" : "LAUNCH"}
          <Icon name="chevronRight" size={10} color={p.color} />
        </div>
      </div>
    </a>
  );
};

// ─── ECCHI WHERE TO WATCH PANEL ──────────────────────────────────────────────
const WATCH_STYLING = (
  <style>{`
    .platform-card {
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .platform-card:hover {
      transform: translateY(-5px) !important;
      border-color: var(--brand-border-glow) !important;
      background: linear-gradient(135deg, rgba(22, 22, 38, 0.95), rgba(12, 12, 20, 0.98)) !important;
      box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.92), 0 0 24px -2px var(--brand-bg-glow) !important;
    }
    .ecchi-platform-card {
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .ecchi-platform-card:hover {
      transform: translateY(-5px) !important;
      border-color: var(--brand-border-glow) !important;
      background: linear-gradient(135deg, rgba(38, 12, 28, 0.95), rgba(16, 4, 12, 0.98)) !important;
      box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.96), 0 0 24px -2px var(--brand-bg-glow) !important;
    }
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
    @keyframes resolverPulse {
      0%, 100% { opacity: 0.65; }
      50% { opacity: 0.95; }
    }
    .resolver-spinner {
      width: 10px;
      height: 10px;
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      border-top-color: #6366f1;
      animation: spin 0.8s linear infinite;
    }
    .resolver-loading {
      animation: resolverPulse 1.8s ease-in-out infinite;
      cursor: wait !important;
    }
  `}</style>
);

export const EcchiWhereToWatch: React.FC<{ anime: Anime | null }> = ({ anime }) => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState(() => getInitialSearchQuery(anime));

  useEffect(() => {
    setSearchQuery(getInitialSearchQuery(anime));
  }, [anime?.mal_id]);

  const candidates = getAnimeSearchCandidates(anime);
  const platforms = ECCHI_PLATFORMS_LIST.map((p) => ({ ...p, ...ECCHI_PLATFORM_META[p.id] }));
  const filtered = platforms.filter((p) =>
    filter === "all"
      ? true
      : filter === "official"
        ? p.tier === "official"
        : filter === "free"
          ? p.price === "Free"
          : true
  );

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(28, 6, 20, 0.75), rgba(16, 3, 12, 0.92))",
        border: "1px solid rgba(236, 72, 153, 0.22)",
        borderRadius: "20px",
        padding: "26px",
        marginBottom: "22px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {WATCH_STYLING}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ec4899, #f43f5e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 15px rgba(236, 72, 153, 0.4)",
              }}
            >
              <span style={{ fontSize: "20px" }}>🌸</span>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#fff",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.5px",
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                }}
              >
                Where to Watch
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "10.5px",
                  color: "#f472b6",
                  fontWeight: 700,
                  letterSpacing: "0.2px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#ec4899",
                    display: "inline-block",
                    boxShadow: "0 0 8px #ec4899",
                    animation: "pinkGlow 2s ease-in-out infinite",
                  }}
                />
                Ecchi-optimized · Auto-filtered & Ranked
              </div>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#f3a8cd", marginLeft: "52px", opacity: 0.85 }}>
            Specially curated stream catalogs · Uncensored availability highlighted
          </p>
        </div>

        <div
          style={{
            display: "flex",
            background: "rgba(0, 0, 0, 0.3)",
            padding: "4px",
            borderRadius: "10px",
            border: "1px solid rgba(236,72,153,0.15)",
            gap: "2px",
          }}
        >
          {[
            ["all", "All"],
            ["official", "✓ Official"],
            ["free", "⚡ Free"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "none",
                background: filter === val ? "linear-gradient(135deg, #ec4899, #be185d)" : "transparent",
                color: filter === val ? "#fff" : "#f472b6",
                fontSize: "11.5px",
                fontWeight: filter === val ? 800 : 600,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: filter === val ? "0 4px 12px rgba(236, 72, 153, 0.25)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Search Term Optimizer Panel (Ecchi themed) */}
      <div
        style={{
          background: "rgba(10, 3, 8, 0.45)",
          border: "1px solid rgba(236, 72, 153, 0.18)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxShadow: "inset 0 1px 10px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#fbcfe8",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          <Icon name="search" size={14} color="#ec4899" />
          <span>Search Term Tuning Optimizer</span>
          <span
            style={{
              fontSize: "9px",
              background: "rgba(236, 72, 153, 0.15)",
              color: "#f472b6",
              padding: "2px 8px",
              borderRadius: "20px",
              fontWeight: 800,
              letterSpacing: "0.5px",
              border: "1px solid rgba(236, 72, 153, 0.25)",
            }}
          >
            ACTIVE CORRECTION
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "260px",
              }}
            >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fine-tune search term..."
              style={{
                width: "100%",
                height: "40px",
                background: "rgba(14, 5, 10, 0.85)",
                border: "1px solid rgba(236, 72, 153, 0.35)",
                borderRadius: "10px",
                padding: "0 12px 0 38px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#fff",
                outline: "none",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#ec4899";
                e.currentTarget.style.boxShadow = "0 0 12px rgba(236, 72, 153, 0.25)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.35)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <Icon name="search" size={15} color="#f472b6" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {candidates.map((c, i) => {
              const isActive = searchQuery.trim().toLowerCase() === c.query.trim().toLowerCase();
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSearchQuery(c.query)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: isActive ? "1px solid #ec4899" : "1px solid rgba(255, 255, 255, 0.08)",
                    background: isActive ? "rgba(236, 72, 153, 0.15)" : "rgba(255, 255, 255, 0.02)",
                    color: isActive ? "#fff" : "#f472b6",
                    fontSize: "11px",
                    fontWeight: isActive ? 800 : 600,
                    cursor: "pointer",
                    transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ opacity: 0.8 }}>{c.label}:</span>
                  <span style={{ color: isActive ? "#fbcfe8" : "#e2e8f0", fontWeight: 700 }}>
                    "{c.query}"
                  </span>
                  {isActive && (
                    <span style={{ color: "#34d399", fontSize: "10px", marginLeft: "2px" }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "#f9a8d4", margin: 0, opacity: 0.85, lineHeight: 1.4 }}>
          💡 Unofficial platform search algorithms can vary. If a platform query is empty, click any optimized candidate above or edit the text box to instantly re-target all links.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(295px, 1fr))",
          gap: "18px",
          alignItems: "stretch",
        }}
      >
        {filtered.map((p, idx) => (
          <PlatformCard 
            key={p.id || idx}
            p={p}
            anime={anime}
            searchQuery={searchQuery}
            isEcchiTheme={true}
            idx={idx}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "18px",
          flexWrap: "wrap",
          gap: "8px",
          borderTop: "1px solid rgba(236,72,153,0.12)",
          paddingTop: "14px",
        }}
      >
        <p style={{ fontSize: "11px", color: "#f472b6", opacity: 0.7 }}>
          ⚠️ Availability varies by region. Use an ad-blocker on unofficial platforms.
        </p>
        <a
          href="https://everythingmoe.com/section/streaming"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "11px",
            color: "#fbcfe8",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: 700,
            transition: "color 0.2s",
          }}
          className="hover:text-pink-400"
        >
          🌸 EVERYTHINGMOE INDEX ↗
        </a>
      </div>
    </div>
  );
};

// ─── GENERAL WHERE TO WATCH PANEL ────────────────────────────────────────────
export const WhereToWatch: React.FC<{ anime: Anime | null }> = ({ anime }) => {
  const [filter, setFilter] = useState("all");
  const [platforms] = useState<Platform[]>(() => mergePlatformMeta(FALLBACK_PLATFORMS));
  const [searchQuery, setSearchQuery] = useState(() => getInitialSearchQuery(anime));

  useEffect(() => {
    setSearchQuery(getInitialSearchQuery(anime));
  }, [anime?.mal_id]);

  const candidates = getAnimeSearchCandidates(anime);
  const isEcchi = (anime?.genres || []).some((g) => g.mal_id === 9 || g.name === "Ecchi");

  const filtered = platforms.filter((p) =>
    filter === "all"
      ? true
      : filter === "official"
        ? p.tier === "official"
        : filter === "free"
          ? p.price === "Free" || p.price?.toLowerCase() === "free"
          : true
  );

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(16, 16, 30, 0.75), rgba(8, 8, 16, 0.92))",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          borderRadius: "20px",
          padding: "26px",
          marginBottom: isEcchi ? "16px" : "22px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {WATCH_STYLING}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)",
                }}
              >
                <Icon name="tv" size={18} color="#fff" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "#fff",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "0.5px",
                    lineHeight: 1.1,
                    textTransform: "uppercase",
                  }}
                >
                  Where to Watch
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: "#10b981",
                    letterSpacing: "0.2px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "inline-block",
                      boxShadow: "0 0 8px #10b981",
                    }}
                  />
                  Verified · Auto-filtered & Ranked
                </div>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#818cf8", marginLeft: "52px", opacity: 0.85 }}>
              Index powered by{" "}
              <a
                href="https://everythingmoe.com/section/streaming"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 700 }}
                className="hover:underline"
              >
                EverythingMoe ↗
              </a>{" "}
              · Direct results below
            </p>
          </div>

          <div
            style={{
              display: "flex",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "4px",
              borderRadius: "10px",
              border: "1px solid rgba(99,102,241,0.15)",
              gap: "2px",
            }}
          >
            {[
              ["all", "All Platforms"],
              ["official", "✓ Official Only"],
              ["free", "⚡ Free Streaming"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: filter === val ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "transparent",
                  color: filter === val ? "#fff" : "#94a3b8",
                  fontSize: "11.5px",
                  fontWeight: filter === val ? 800 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: filter === val ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Search Term Optimizer Panel (General and Unofficial themed) */}
        <div
          style={{
            background: "rgba(10, 10, 18, 0.45)",
            border: "1px solid rgba(99, 102, 241, 0.18)",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "inset 0 1px 10px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#c7d2fe",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            <Icon name="search" size={14} color="#6366f1" />
            <span>Search Term Tuning Optimizer</span>
            <span
              style={{
                fontSize: "9px",
                background: "rgba(99, 102, 241, 0.15)",
                color: "#a5b4fc",
                padding: "2px 8px",
                borderRadius: "20px",
                fontWeight: 800,
                letterSpacing: "0.5px",
                border: "1px solid rgba(99, 102, 241, 0.25)",
              }}
            >
              ACTIVE CORRECTION
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
                minWidth: "260px",
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Fine-tune search term..."
                style={{
                  width: "100%",
                  height: "40px",
                  background: "rgba(8, 8, 14, 0.85)",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                  borderRadius: "10px",
                  padding: "0 12px 0 38px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  outline: "none",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(99, 102, 241, 0.25)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.35)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <Icon name="search" size={15} color="#818cf8" />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {candidates.map((c, i) => {
                const isActive = searchQuery.trim().toLowerCase() === c.query.trim().toLowerCase();
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSearchQuery(c.query)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: isActive ? "1px solid #6366f1" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isActive ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.02)",
                      color: isActive ? "#fff" : "#94a3b8",
                      fontSize: "11px",
                      fontWeight: isActive ? 800 : 600,
                      cursor: "pointer",
                      transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ opacity: 0.8 }}>{c.label}:</span>
                    <span style={{ color: isActive ? "#a5b4fc" : "#e2e8f0", fontWeight: 700 }}>
                      "{c.query}"
                    </span>
                    {isActive && (
                      <span style={{ color: "#34d399", fontSize: "10px", marginLeft: "2px" }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <p style={{ fontSize: "11px", color: "#a5b4fc", margin: 0, opacity: 0.85, lineHeight: 1.4 }}>
            💡 Unofficial platform search algorithms can vary. If a platform query is empty, click any optimized candidate above or edit the text box to instantly re-target all links.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(295px, 1fr))",
            gap: "18px",
            alignItems: "stretch",
          }}
        >
          {filtered.map((p, idx) => (
            <PlatformCard 
              key={p.id || idx}
              p={p}
              anime={anime}
              searchQuery={searchQuery}
              isEcchiTheme={false}
              idx={idx}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "18px",
            flexWrap: "wrap",
            gap: "8px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "14px",
          }}
        >
          <p style={{ fontSize: "11px", color: "#4a5568", opacity: 0.8 }}>
            ⚠️ Availability varies by region. Unofficial platforms are community-maintained — use an ad-blocker.
          </p>
          <a
            href="https://everythingmoe.com/graveyard"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              color: "#cbd5e1",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 700,
              transition: "color 0.2s",
            }}
            className="hover:text-indigo-400"
          >
            <Icon name="globe" size={11} /> PLATFORM GRAVEYARD ↗
          </a>
        </div>
      </div>

      {isEcchi && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(90deg, rgba(236,72,153,0.4), transparent)",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#f472b6",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              🌸 Ecchi-Optimized Platforms
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(270deg, rgba(236,72,153,0.4), transparent)",
              }}
            />
          </div>
          <EcchiWhereToWatch anime={anime} />
        </div>
      )}
    </div>
  );
};
