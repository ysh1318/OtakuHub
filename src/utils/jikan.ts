import { Anime } from "../types";

const JIKAN = "https://api.jikan.moe/v4";
export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── SAFE IMAGE EXTRACTION ───────────────────────────────────────────────────
export function getAnimeImageUrl(anime?: Partial<Anime> | null): string {
  if (!anime) return "";
  const images: any = anime.images;
  if (!images) return (anime as any).image_url || "";
  return (
    images.webp?.large_image_url ||
    images.jpg?.large_image_url ||
    images.webp?.image_url ||
    images.jpg?.image_url ||
    images.webp?.small_image_url ||
    images.jpg?.small_image_url ||
    (anime as any).image_url ||
    ""
  );
}

// ─── MULTI-TIER CACHE (Memory + SessionStorage) ──────────────────────────────
interface CacheEntry {
  timestamp: number;
  data: any;
}

const memoryCache = new Map<string, CacheEntry>();
const CACHE_PREFIX = "otaku_jikan_v2_";
const DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes default

function getCache(key: string): any | null {
  const now = Date.now();
  // 1. Check memory
  const mem = memoryCache.get(key);
  if (mem && now - mem.timestamp < DEFAULT_TTL) {
    return mem.data;
  }

  // 2. Check sessionStorage
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (raw) {
      const parsed: CacheEntry = JSON.parse(raw);
      if (now - parsed.timestamp < DEFAULT_TTL) {
        memoryCache.set(key, parsed);
        return parsed.data;
      } else {
        sessionStorage.removeItem(CACHE_PREFIX + key);
      }
    }
  } catch {
    // sessionStorage might be restricted or full
  }
  return null;
}

function setCache(key: string, data: any) {
  const entry: CacheEntry = { timestamp: Date.now(), data };
  memoryCache.set(key, entry);
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Ignore quota exceeded or storage disabled
  }
}

// ─── SERIALIZED REQUEST QUEUE WITH DEDUPLICATION & RATE LIMITING ────────────
interface QueueTask {
  path: string;
  retries: number;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

const requestQueue: QueueTask[] = [];
const inFlightRequests = new Map<string, Promise<any>>();
let isProcessingQueue = false;
let queuePausedUntil = 0;
const MIN_REQUEST_INTERVAL = 380; // ~2.6 req/s to stay well below Jikan's 3 req/s limit

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    // Check if queue is paused due to 429
    const now = Date.now();
    if (queuePausedUntil > now) {
      await delay(queuePausedUntil - now);
    }

    const task = requestQueue.shift();
    if (!task) break;

    try {
      const result = await executeFetch(task.path, task.retries);
      task.resolve(result);
    } catch (err) {
      task.reject(err);
    }

    // Throttle between requests
    await delay(MIN_REQUEST_INTERVAL);
  }

  isProcessingQueue = false;
}

async function executeFetch(path: string, maxRetries = 3): Promise<any> {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const res = await fetch(`${JIKAN}${path}`);

      // Handle Jikan Rate Limiting (429)
      if (res.status === 429) {
        attempt++;
        const retryAfterHeader = res.headers.get("Retry-After");
        const pauseTime = retryAfterHeader
          ? Math.max(parseInt(retryAfterHeader, 10) * 1000, 2000)
          : 1500 * Math.pow(1.6, attempt) + Math.random() * 400;

        // Pause entire queue so other requests don't keep hammering
        queuePausedUntil = Math.max(queuePausedUntil, Date.now() + pauseTime);
        await delay(pauseTime);

        if (attempt > maxRetries) {
          // If all retries exhausted, check if we have any stale cache
          const stale = getCache(path);
          if (stale) return stale;
          throw new Error("HTTP 429 Rate Limit Exceeded");
        }
        continue;
      }

      if (!res.ok) {
        if (res.status >= 500 && attempt < maxRetries) {
          attempt++;
          await delay(800 * attempt);
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setCache(path, json);
      return json;
    } catch (err) {
      if (attempt >= maxRetries) {
        // Fallback to stale cached data if network failed
        const stale = getCache(path);
        if (stale) return stale;
        throw err;
      }
      attempt++;
      await delay(700 * attempt);
    }
  }
}

export function jikanFetch(path: string, retries = 3): Promise<any> {
  // 1. Instant Cache Hit
  const cached = getCache(path);
  if (cached) {
    return Promise.resolve(cached);
  }

  // 2. In-flight request deduplication
  if (inFlightRequests.has(path)) {
    return inFlightRequests.get(path)!;
  }

  // 3. Enqueue request
  const requestPromise = new Promise((resolve, reject) => {
    requestQueue.push({ path, retries, resolve, reject });
    processQueue();
  }).finally(() => {
    inFlightRequests.delete(path);
  });

  inFlightRequests.set(path, requestPromise);
  return requestPromise;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const scoreColor = (s: number) =>
  s >= 8.5 ? "#10b981" : s >= 7 ? "#f59e0b" : "#ef4444";

export const fmt = (n?: number) => {
  if (n == null) return "N/A";
  return n >= 1000000
    ? `${(n / 1000000).toFixed(1)}M`
    : n >= 1000
      ? `${(n / 1000).toFixed(1)}K`
      : n.toString();
};

export const WL_KEY = "otakuhub_watchlist_v2";
export const getWL = (): Anime[] => {
  try {
    return JSON.parse(localStorage.getItem(WL_KEY) || "[]");
  } catch {
    return [];
  }
};
export const saveWL = (v: Anime[]) => {
  try {
    localStorage.setItem(WL_KEY, JSON.stringify(v));
  } catch {}
};

export const EP_KEY = "otakuhub_ep_progress_v1";
export const getEpProgress = (): Record<number, number> => {
  try {
    return JSON.parse(localStorage.getItem(EP_KEY) || "{}");
  } catch {
    return {};
  }
};
export const saveEpProgress = (v: Record<number, number>) => {
  try {
    localStorage.setItem(EP_KEY, JSON.stringify(v));
  } catch {}
};
export const setEpWatched = (malId: number, ep: number) => {
  const p = getEpProgress();
  p[malId] = ep;
  saveEpProgress(p);
  window.dispatchEvent(new Event("ep_update"));
};
export const getEpWatched = (malId: number): number => getEpProgress()[malId] || 0;

export const ECCHI_AGE_KEY = "otakuhub_ecchi_age_verified_v1";
export const getAgeVerified = (): boolean => {
  try {
    return localStorage.getItem(ECCHI_AGE_KEY) === "yes";
  } catch {
    return false;
  }
};
export const setAgeVerified = () => {
  try {
    localStorage.setItem(ECCHI_AGE_KEY, "yes");
  } catch {}
};

export const HISTORY_KEY = "otakuhub_history_v1";
export const getHistory = (): Anime[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};
export const addToHistory = (anime: Anime) => {
  try {
    const h = getHistory();
    const next = [anime, ...h.filter((a) => a.mal_id !== anime.mal_id)].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("history_update"));
  } catch {}
};
