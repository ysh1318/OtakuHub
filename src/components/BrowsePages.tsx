import React, { useState, useEffect, useCallback } from "react";
import { Anime } from "../types";
import { Icon } from "./Icons";
import { CardSkeleton, Skeleton } from "./CommonUI";
import { AnimeCard } from "./AnimeCard";
import { jikanFetch, getWL, fmt, getHistory } from "../utils/jikan";

interface BrowsePageProps {
  mode: string;
  genreFilter: { id: number; name: string; color: string } | null;
  onAnimeClick: (anime: Anime) => void;
  watchlist?: Anime[];
  toggleWatchlist?: (anime: Anime) => void;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({
  mode,
  genreFilter,
  onAnimeClick,
  watchlist = [],
  toggleWatchlist,
}) => {
  const [items, setItems] = useState<Anime[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const titles: Record<string, string> = {
    airing: "Top Airing",
    popular: "Most Popular",
    movies: "Anime Movies",
    genres: genreFilter?.name || "Genres",
    explore: "Explore All",
    community: "Community Picks",
  };
  const title = titles[mode] || mode;

  const loadPage = useCallback(
    async (p: number, reset = false) => {
      setLoading(true);
      try {
        let data: any;
        if (mode === "airing") {
          data = await jikanFetch(`/top/anime?filter=airing&page=${p}&limit=24`);
        } else if (mode === "popular") {
          data = await jikanFetch(`/top/anime?filter=bypopularity&page=${p}&limit=24`);
        } else if (mode === "movies") {
          data = await jikanFetch(`/top/anime?type=movie&page=${p}&limit=24`);
        } else if (mode === "genres" && genreFilter) {
          data = await jikanFetch(`/anime?genres=${genreFilter.id}&order_by=score&sort=desc&page=${p}&limit=24`);
        } else if (mode === "explore" || mode === "community") {
          data = await jikanFetch(`/top/anime?page=${p}&limit=24`);
        } else {
          setLoading(false);
          return;
        }
        const list = data?.data || [];
        setItems((prev) => (reset ? list : [...prev, ...list]));
        setHasMore(data?.pagination?.has_next_page || false);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    },
    [mode, genreFilter]
  );

  useEffect(() => {
    setItems([]);
    setPageNum(1);
    setHasMore(true);
    loadPage(1, true);
  }, [mode, genreFilter]);

  const loadMore = () => {
    const next = pageNum + 1;
    setPageNum(next);
    loadPage(next);
  };

  if (mode === "watchlist") {
    return <WatchlistPage onAnimeClick={onAnimeClick} />;
  }
  if (mode === "schedule") {
    return <SchedulePage onAnimeClick={onAnimeClick} />;
  }
  if (mode === "history") {
    return <HistoryPage onAnimeClick={onAnimeClick} />;
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#07070f", padding: "28px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#f1f5f9", fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.5px" }}>
          {title}
        </h1>
        {genreFilter && (
          <p style={{ fontSize: "13px", color: "#4a5568", marginTop: "4px" }}>
            Showing all {genreFilter.name} anime sorted by score
          </p>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: "14px" }}>
        {items.map((a, i) => (
          <AnimeCard
            key={`${a.mal_id || 'br'}-${i}`}
            anime={a}
            onClick={onAnimeClick}
            delay={(i % 24) * 25}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
          />
        ))}
        {loading &&
          Array(12)
            .fill(null)
            .map((_, i) => <CardSkeleton key={`sk-${i}`} />)}
      </div>
      {!loading && items.length === 0 && (
        <div style={{ textAlign: "center", color: "#3d4458", padding: "80px 0", fontSize: "15px" }}>
          No anime found.
        </div>
      )}
      {!loading && hasMore && (
        <button
          className="btn-primary"
          onClick={loadMore}
          style={{
            display: "block",
            margin: "32px auto 0",
            background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
            border: "none",
            borderRadius: "12px",
            padding: "13px 40px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
};

// ─── WATCHLIST PAGE ───────────────────────────────────────────────────────────
export const WatchlistPage: React.FC<{ onAnimeClick: (anime: Anime) => void }> = ({ onAnimeClick }) => {
  const [wl, setWl] = useState<Anime[]>(getWL());
  useEffect(() => {
    const h = () => setWl(getWL());
    window.addEventListener("wl_update", h);
    return () => window.removeEventListener("wl_update", h);
  }, []);
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#07070f", padding: "28px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#f1f5f9", marginBottom: "6px", fontFamily: "'Rajdhani',sans-serif" }}>
        My Watchlist
      </h1>
      <p style={{ fontSize: "13px", color: "#4a5568", marginBottom: "24px" }}>{wl.length} anime saved</p>
      {wl.length === 0 ? (
        <div style={{ textAlign: "center", color: "#4a5568", padding: "80px 0" }}>
          <div style={{ display: "inline-block", marginBottom: "14px" }}>
            <Icon name="watchlist" size={52} color="#1a1a2e" />
          </div>
          <p style={{ fontSize: "16px", marginTop: "16px", fontWeight: 600 }}>Your watchlist is empty.</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>Browse anime and add them to your list.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: "14px" }}>
          {wl.map((a, i) => (
            <AnimeCard key={`${a.mal_id || 'wl'}-${i}`} anime={a} onClick={onAnimeClick} delay={i * 30} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── HISTORY PAGE ────────────────────────────────────────────────────────────
export const HistoryPage: React.FC<{ onAnimeClick: (anime: Anime) => void }> = ({ onAnimeClick }) => {
  const [history, setHistory] = useState<Anime[]>([]);
  useEffect(() => {
    const updateHistory = () => {
      setHistory(getHistory());
    };
    updateHistory();
    window.addEventListener("history_update", updateHistory);
    return () => window.removeEventListener("history_update", updateHistory);
  }, []);

  const handleClear = () => {
    try {
      localStorage.removeItem("otakuhub_history_v1");
      setHistory([]);
      window.dispatchEvent(new Event("history_update"));
    } catch {}
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#07070f", padding: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#f1f5f9", fontFamily: "'Rajdhani',sans-serif" }}>
          Watch History
        </h1>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#ef4444",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            }}
          >
            Clear History
          </button>
        )}
      </div>
      <p style={{ fontSize: "13px", color: "#4a5568", marginBottom: "24px" }}>Your recently viewed anime</p>
      {history.length === 0 ? (
        <div style={{ textAlign: "center", color: "#4a5568", padding: "80px 0" }}>
          <div style={{ display: "inline-block", marginBottom: "14px" }}>
            <Icon name="history" size={52} color="#1a1a2e" />
          </div>
          <p style={{ fontSize: "16px", marginTop: "16px", fontWeight: 600 }}>No history yet.</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>Anime you view will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: "14px" }}>
          {history.map((a, i) => (
            <AnimeCard key={`${a.mal_id || 'h'}-${i}`} anime={a} onClick={onAnimeClick} delay={i * 25} />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper to localize JST broadcast hours to standard client environment time zone
const getLocalTime = (jstTime?: string): string => {
  if (!jstTime) return "";
  const parts = jstTime.split(":");
  if (parts.length !== 2) return jstTime + " JST";
  const jstHour = parseInt(parts[0], 10);
  const jstMin = parseInt(parts[1], 10);
  if (isNaN(jstHour) || isNaN(jstMin)) return jstTime + " JST";
  
  // Create a date corresponding to the JST timezone (GMT+9)
  const utch = (jstHour - 9 + 24) % 24;
  const localDate = new Date();
  localDate.setUTCHours(utch, jstMin, 0, 0);
  
  const localHoursStr = String(localDate.getHours()).padStart(2, "0");
  const localMinsStr = String(localDate.getMinutes()).padStart(2, "0");
  return `${localHoursStr}:${localMinsStr} Local`;
};

// ─── SCHEDULE PAGE ───────────────────────────────────────────────────────────
export const SchedulePage: React.FC<{ onAnimeClick: (anime: Anime) => void }> = ({ onAnimeClick }) => {
  const [schedule, setSchedule] = useState<Record<string, Anime[]>>({});
  const [loading, setLoading] = useState(true);
  
  // Map JS numeric days to matches
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const jstToday = daysOfWeek[new Date().getDay()];
  const [activeDay, setActiveDay] = useState(jstToday);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const results = await Promise.allSettled(
          days.map((day) => jikanFetch(`/schedules?filter=${day.toLowerCase()}&limit=20`))
        );
        if (!mounted) return;
        const sched: Record<string, Anime[]> = {};
        days.forEach((day, i) => {
          if (results[i].status === "fulfilled") {
            sched[day] = (results[i] as PromiseFulfilledResult<any>).value?.data || [];
          } else {
            sched[day] = [];
          }
        });
        setSchedule(sched);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#07070f", padding: "28px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#f1f5f9", marginBottom: "8px", fontFamily: "'Rajdhani',sans-serif" }}>
        Weekly Airing Schedule
      </h1>
      <p style={{ fontSize: "13px", color: "#4a5568", marginBottom: "20px" }}>All simulcast anime this week</p>

      {/* Day tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              border: `1px solid ${activeDay === day ? "#6366f1" : "#1e1e30"}`,
              background: activeDay === day ? "rgba(99,102,241,0.15)" : "#0f0f1a",
              color: activeDay === day ? "#a5b4fc" : "#64748b",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {day}
            {!loading && schedule[day]?.length > 0 && (
              <span style={{ marginLeft: "6px", fontSize: "10px", opacity: 0.7 }}>({schedule[day].length})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(145px,1fr))", gap: "14px" }}>
          {Array(12)
            .fill(null)
            .map((_, i) => (
              <CardSkeleton key={i} />
            ))}
        </div>
      ) : (
        <div className="fade-in" key={activeDay} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(145px,1fr))", gap: "14px" }}>
          {(schedule[activeDay] || []).map((a, i) => (
            <div key={`${a.mal_id || 'sch'}-${i}`} style={{ position: "relative" }}>
              <AnimeCard anime={a} onClick={onAnimeClick} epBadge="AIRING" delay={i * 30} />
              {a.broadcast?.time && (
                <div style={{ position: "absolute", bottom: "32px", left: 0, right: 0, textAlign: "center", zIndex: 3 }}>
                  <span
                    style={{
                      background: "rgba(99,102,241,0.9)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                      fontSize: "9px",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    🕐 {getLocalTime(a.broadcast.time)}
                  </span>
                </div>
              )}
            </div>
          ))}
          {schedule[activeDay]?.length === 0 && (
            <p style={{ color: "#4a5568", fontSize: "14px", gridColumn: "1/-1", padding: "60px 0", textAlign: "center" }}>
              No scheduled anime for {activeDay}.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── SEARCH PAGE ──────────────────────────────────────────────────────────────
interface SearchPageProps {
  query: string;
  isTyping?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onAnimeClick: (anime: Anime) => void;
  watchlist?: Anime[];
  toggleWatchlist?: (anime: Anime) => void;
  onSearch?: (q: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  query,
  isTyping = false,
  onLoadingChange,
  onAnimeClick,
  watchlist = [],
  toggleWatchlist,
  onSearch,
}) => {
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    onLoadingChange?.(true);
    setResults([]);
    let active = true;
    jikanFetch(`/anime?q=${encodeURIComponent(query)}&limit=24&order_by=score&sort=desc`)
      .then((d) => {
        if (!active) return;
        setResults(d?.data || []);
        setLoading(false);
        onLoadingChange?.(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
        onLoadingChange?.(false);
      });
    return () => {
      active = false;
    };
  }, [query, onLoadingChange]);

  const showSkeletons = loading || isTyping;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#07070f", padding: isMobile ? "16px 16px 32px" : "28px" }}>
      <div style={{ marginBottom: isMobile ? "18px" : "24px" }}>
        <h1 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 900, color: "#f1f5f9", fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.5px", lineHeight: 1.2 }}>
          Search results for <span style={{ color: "#6366f1" }}>"{query}"</span>
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
          {showSkeletons ? "Searching..." : `${results.length} anime found`}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(130px, 1fr))" : "repeat(auto-fill, minmax(145px, 1fr))", gap: isMobile ? "10px" : "14px" }}>
        {showSkeletons ? (
          Array(12)
            .fill(null)
            .map((_, i) => (
              <CardSkeleton key={`loading-sk-${i}`} />
            ))
        ) : (
          results.map((a, i) => (
            <AnimeCard
              key={`${a.mal_id || 'sr'}-${i}`}
              anime={a}
              onClick={onAnimeClick}
              delay={i * 25}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
            />
          ))
        )}
      </div>
      {!showSkeletons && results.length === 0 && (
        <div style={{ color: "#4a5568", textAlign: "center", padding: "80px 0" }}>
          <div style={{ display: "inline-block", marginBottom: "14px" }}>
            <Icon name="search" size={48} color="#1a1a2e" />
          </div>
          <p style={{ fontSize: "16px", marginTop: "16px", fontWeight: 600 }}>No results for "{query}"</p>
          <p style={{ fontSize: "13px", marginTop: "8px", marginBottom: "14px" }}>Try a different title or check spelling</p>
          {onSearch && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", maxWidth: "340px", margin: "16px auto 0" }}>
              {["Action", "Romance", "Fantasy"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSearch(tag)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    background: "#0f0f1a",
                    border: "1px solid #1a1a2e",
                    color: "#a5b4fc",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                    e.currentTarget.style.borderColor = "#6366f1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0f0f1a";
                    e.currentTarget.style.borderColor = "#1a1a2e";
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default BrowsePage;
