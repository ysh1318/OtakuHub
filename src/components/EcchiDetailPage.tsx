import React, { useState, useEffect } from "react";
import { Anime, Character, Recommendation, Review } from "../types";
import { Icon } from "./Icons";
import { Skeleton } from "./CommonUI";
import {
  jikanFetch,
  fmt,
  getEpWatched,
  setEpWatched,
} from "../utils/jikan";
import { TrailerEmbed } from "./TrailerEmbed";
import { EcchiParticles } from "./EcchiElements";
import { EcchiWhereToWatch } from "./WhereToWatch";
import { AnikotoPlayerTab } from "./AnikotoPlayerTab";
import {
  TabOverview,
  TabCharacters,
  TabRecs,
  TabDetails,
  TabReviews,
  DetailSidebar,
} from "./DetailTabs";

interface EcchiDetailPageProps {
  animeId: number;
  onBack: () => void;
  watchlist: Anime[];
  toggleWatchlist: (anime: Anime) => void;
  toast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const EcchiDetailPage: React.FC<EcchiDetailPageProps> = ({
  animeId,
  watchlist,
  toggleWatchlist,
  toast,
}) => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [chars, setChars] = useState<Character[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("Where to Watch");
  const [loading, setLoading] = useState(true);
  const [charsLoaded, setCharsLoaded] = useState(false);
  const [revsLoaded, setRevsLoaded] = useState(false);
  const [epWatched, setEpWatchedState] = useState(0);

  const tabs = [
    "Where to Watch",
    "Watch Episode",
    "Trailer",
    "Overview",
    "Characters",
    "Recommendations",
    "Details",
    "Reviews",
  ];
  const inWL = watchlist.some((w) => w.mal_id === animeId);

  useEffect(() => {
    setLoading(true);
    setAnime(null);
    setChars([]);
    setRecs([]);
    setReviews([]);
    setActiveTab("Where to Watch");
    setCharsLoaded(false);
    setRevsLoaded(false);
    setEpWatchedState(getEpWatched(animeId));

    let mounted = true;
    (async () => {
      try {
        const [main, recData] = await Promise.all([
          jikanFetch(`/anime/${animeId}/full`),
          jikanFetch(`/anime/${animeId}/recommendations`),
        ]);
        if (!mounted) return;
        setAnime(main?.data);
        setRecs((recData?.data || []).slice(0, 10));
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [animeId]);

  useEffect(() => {
    if ((activeTab === "Characters" || activeTab === "Overview") && !charsLoaded) {
      setCharsLoaded(true);
      jikanFetch(`/anime/${animeId}/characters`)
        .then((d) =>
          setChars(
            (d?.data || [])
              .sort((a: any, b: any) => (b.favorites || 0) - (a.favorites || 0))
              .slice(0, 12)
          )
        )
        .catch(() => {});
    }
    if (activeTab === "Reviews" && !revsLoaded) {
      setRevsLoaded(true);
      jikanFetch(`/anime/${animeId}/reviews?preliminary=false`)
        .then((d) => setReviews((d?.data || []).slice(0, 6)))
        .catch(() => {});
    }
  }, [activeTab, animeId, charsLoaded, revsLoaded]);

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "linear-gradient(180deg,#0f0008,#0a0005)",
          padding: "28px",
        }}
      >
        <div
          style={{
            height: "4px",
            background: "linear-gradient(90deg,#ec4899,#f43f5e)",
            borderRadius: "2px",
            marginBottom: "28px",
            animation: "shimmerPink 1.5s infinite",
            backgroundSize: "200% 100%",
          }}
        />
        <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
          {[180, 140, 100].map((w, i) => (
            <div
              key={i}
              style={{
                width: `${w}px`,
                height: "16px",
                borderRadius: "4px",
                background: "rgba(236,72,153,0.1)",
                animation: "shimmerPink 1.5s infinite",
              }}
            />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "24px" }}>
          <div>
            <div
              style={{
                width: "100%",
                height: "260px",
                borderRadius: "12px",
                background: "rgba(236,72,153,0.06)",
                marginBottom: "14px",
                animation: "shimmerPink 1.5s infinite",
              }}
            />
          </div>
          <div>
            <div
              style={{
                width: "100%",
                height: "260px",
                borderRadius: "12px",
                background: "rgba(236,72,153,0.06)",
                animation: "shimmerPink 1.5s infinite",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9d174d",
          fontSize: "16px",
          flexDirection: "column",
          gap: "12px",
          background: "linear-gradient(180deg,#0f0008,#0a0005)",
        }}
      >
        <span style={{ fontSize: "48px" }}>🌸</span>
        <p>Anime not found.</p>
      </div>
    );
  }

  const img = anime.images?.webp?.large_image_url || anime.images?.webp?.image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const score = anime.score;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "linear-gradient(180deg,#0f0008 0%,#1a000d 30%,#0d0010 70%,#0a000a 100%)",
        position: "relative",
      }}
    >
      <EcchiParticles />

      {/* Cinematic Hero */}
      <div className="relative min-h-[400px] md:h-[440px] overflow-hidden flex items-center py-10 md:py-0">
        {/* Dynamic Backing Ambiance Aura */}
        {img && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center 25%",
              filter: "blur(50px) brightness(0.35) saturate(2.4)",
              transform: "scale(1.15)",
              opacity: 0.75,
              zIndex: 0,
            }}
          />
        )}
        {/* Crisp foreground layer */}
        {img && (
          <img
            src={img}
            alt={anime.title}
            className="hero-img"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              filter: "brightness(0.65) saturate(1.2)",
              animation: "ecchiHeroPulse 12s ease-in-out infinite",
              zIndex: 1,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(10,0,8,0.99) 0%, rgba(20,0,12,0.82) 48%, rgba(10,0,8,0.2) 100%)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 75% 30%, rgba(236,72,153,0.24) 0%, transparent 65%)",
            zIndex: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "150px",
            background: "linear-gradient(transparent,#0f0008)",
            zIndex: 4,
          }}
        />

        <div className="relative md:absolute inset-y-0 left-0 md:left-7 right-0 max-w-full md:max-w-3xl flex flex-col sm:flex-row items-center sm:items-center gap-6 md:gap-9 z-10 px-6 md:px-0 w-full text-center sm:text-left">
          <div
            className="w-[140px] sm:w-[170px] md:w-[195px] shrink-0 rounded-2xl overflow-hidden border border-pink-500/40 shadow-[0_16px_5rem_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              animation: "slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <img src={img} alt={anime.title} style={{ width: "100%", display: "block" }} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start" style={{ animation: "slideUp 0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
              <span
                style={{
                  background: "linear-gradient(90deg,rgba(236,72,153,0.9),rgba(244,63,94,0.9))",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: 900,
                  padding: "3px 10px",
                  borderRadius: "5px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  boxShadow: "0 0 16px rgba(236,72,153,0.4)",
                  animation: "neonFlicker 5s linear infinite",
                }}
              >
                🌸 ECCHI ZONE
              </span>
              {anime.rating && (
                <span
                  style={{
                    background: "rgba(236,72,153,0.1)",
                    border: "1px solid rgba(236,72,153,0.3)",
                    color: "#f9a8d4",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "5px",
                  }}
                >
                  {anime.rating}
                </span>
              )}
              {anime.status === "Currently Airing" && (
                <span
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "#fca5a5",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "5px",
                  }}
                >
                  🔴 LIVE
                </span>
              )}
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-[42px] font-black text-pink-100 leading-tight md:leading-[1.05] uppercase tracking-tight sm:tracking-[-1.5px] mb-1.5 md:mb-2"
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                textShadow: "0 4px 24px rgba(236,72,153,0.65), 0 2px 4px rgba(0,0,0,0.95)",
              }}
            >
              {anime.title}
            </h1>
            {anime.title_japanese && (
              <p style={{ fontSize: "14.5px", color: "#fbcfe8", marginBottom: "12px", fontStyle: "normal", fontWeight: 600, letterSpacing: "0.5px", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                {anime.title_japanese}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2.5">
              {score && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f472b6" stroke="#f472b6" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#f472b6" }}>{score}</span>
                  <span style={{ fontSize: "11px", color: "#9d174d" }}>({fmt(anime.scored_by)})</span>
                </div>
              )}
              {anime.rank && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#9d174d",
                    background: "rgba(236,72,153,0.08)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(236,72,153,0.15)",
                  }}
                >
                  Rank #{anime.rank}
                </span>
              )}
              {anime.status && (
                <span
                  style={{
                    background: anime.status === "Currently Airing" ? "rgba(16,185,129,0.15)" : "rgba(236,72,153,0.08)",
                    border:
                      anime.status === "Currently Airing"
                        ? "1px solid rgba(16,185,129,0.4)"
                        : "1px solid rgba(236,72,153,0.15)",
                    color: anime.status === "Currently Airing" ? "#10b981" : "#f9a8d4",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {anime.status === "Currently Airing" ? "🔴 Live" : anime.status}
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-3">
              {(anime.genres || []).slice(0, 4).map((g, gi) => (
                <span
                  key={`${g.mal_id || 'g'}-${gi}`}
                  style={{
                    background: "rgba(236,72,153,0.1)",
                    border: "1px solid rgba(236,72,153,0.22)",
                    color: "#f9a8d4",
                    padding: "2px 9px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 500,
                  }}
                >
                  {g.name}
                </span>
              ))}
            </div>
            <p
              className="text-[12.5px] text-[#9d174d] leading-[1.65] max-w-[360px] mb-4.5 hidden md:-webkit-box md:line-clamp-2"
              style={{
                WebkitBoxOrient: "vertical",
              }}
            >
              {anime.synopsis}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 w-full">
              <button
                className="ecchi-btn"
                onClick={() => setActiveTab("Where to Watch")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(90deg,#ec4899,#f43f5e)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 4px 22px rgba(236,72,153,0.4)",
                }}
              >
                <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="#fff" strokeWidth={2}>
                  <rect x="2" y="7" width="20" height="15" rx="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>{" "}
                Watch Now
              </button>
              {anime?.trailer?.youtube_id && (
                <button
                  className="ecchi-btn"
                  onClick={() => setActiveTab("Trailer")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    color: "#fca5a5",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="#fca5a5" strokeWidth={2}>
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>{" "}
                  Trailer
                </button>
              )}
              <button
                className="ecchi-btn"
                onClick={() => {
                  toggleWatchlist(anime);
                  toast(inWL ? "Removed from Watchlist" : "Added to Watchlist!", inWL ? "info" : "success");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: inWL ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${inWL ? "#ec4899" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "10px",
                  padding: "10px 14px",
                  color: inWL ? "#fce7f3" : "#e2e8f0",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={13}
                  height={13}
                  fill={inWL ? "#ec4899" : "none"}
                  stroke={inWL ? "#ec4899" : "#e2e8f0"}
                  strokeWidth={2}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {inWL ? "Saved" : "Save"}
              </button>
              {anime?.episodes && anime.episodes > 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(236,72,153,0.08)",
                    border: "1px solid rgba(236,72,153,0.2)",
                    borderRadius: "10px",
                    padding: "6px 12px",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#f472b6", fontWeight: 700 }}>EP</span>
                  <button
                    onClick={() => {
                      const n = Math.max(0, epWatched - 1);
                      setEpWatchedState(n);
                      setEpWatched(animeId, n);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#9d174d",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: "0 2px",
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#fce7f3", minWidth: "38px", textAlign: "center" }}>
                    {epWatched}/{anime.episodes}
                  </span>
                  <button
                    onClick={() => {
                      const n = Math.min(anime.episodes, epWatched + 1);
                      setEpWatchedState(n);
                      setEpWatched(animeId, n);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ec4899",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: "0 2px",
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Tabs — ecchi pink theme */}
      <div
        style={{
          borderBottom: "1px solid rgba(236,72,153,0.2)",
          padding: "0 28px",
          display: "flex",
          overflowX: "auto",
          background: "rgba(10,0,8,0.85)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "14px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === t ? "2px solid #ec4899" : "2px solid transparent",
              color: activeTab === t ? "#f472b6" : "#4a2030",
              fontSize: "13px",
              fontWeight: activeTab === t ? 700 : 500,
              cursor: "pointer",
              marginBottom: -1,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.15s",
            }}
          >
            {t === "Where to Watch" && (
              <svg
                viewBox="0 0 24 24"
                width={12}
                height={12}
                fill="none"
                stroke={activeTab === t ? "#f472b6" : "#4a2030"}
                strokeWidth={2}
              >
                <rect x="2" y="7" width="20" height="15" rx="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
            )}
            {t === "Watch Episode" && (
              <svg
                viewBox="0 0 24 24"
                width={12}
                height={12}
                fill="none"
                stroke={activeTab === t ? "#f472b6" : "#4a2030"}
                strokeWidth={2}
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
            {t === "Trailer" && (
              <svg
                viewBox="0 0 24 24"
                width={12}
                height={12}
                fill="none"
                stroke={activeTab === t ? "#f472b6" : "#4a2030"}
                strokeWidth={2}
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
            {t}
            {t === "Where to Watch" && (
              <span
                style={{
                  background: "linear-gradient(90deg,#ec4899,#f43f5e)",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: "4px",
                  letterSpacing: "0.5px",
                }}
              >
                18+
              </span>
            )}
            {t === "Watch Episode" && (
              <span
                style={{
                  background: "linear-gradient(90deg,#ec4899,#f43f5e)",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: "4px",
                  letterSpacing: "0.5px",
                }}
              >
                18+
              </span>
            )}
            {t === "Trailer" && anime?.trailer?.youtube_id && (
              <span
                style={{
                  background: "linear-gradient(90deg,#ef4444,#b91c1c)",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: "4px",
                }}
              >
                ▶
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 py-6 md:px-[28px] md:py-[24px] pb-10 relative z-10">
        <div className="flex-1 min-w-0" style={{ animation: "fadeIn 0.3s ease" }} key={activeTab}>
          {activeTab === "Where to Watch" && (
            <div>
              <div
                style={{
                  background: "linear-gradient(135deg,rgba(236,72,153,0.08),rgba(244,63,94,0.05))",
                  border: "1px solid rgba(236,72,153,0.22)",
                  borderRadius: "14px",
                  padding: "14px 18px",
                  marginBottom: "18px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "28px" }}>🔞</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#fce7f3", marginBottom: "2px" }}>
                    Ecchi-Optimized Platforms — 18+ Verified
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#9d174d" }}>
                    Platforms below are ranked for ecchi & mature anime access, including uncensored versions.
                  </div>
                </div>
              </div>
              <EcchiWhereToWatch anime={anime} />
            </div>
          )}
          {activeTab === "Watch Episode" && <AnikotoPlayerTab anime={anime} isEcchiTheme={true} />}
          {activeTab === "Trailer" && <TrailerEmbed anime={anime} />}
          {activeTab === "Overview" && (
            <div>
              <TabOverview
                anime={anime}
                chars={chars}
                recs={recs}
                onAnimeClick={(a) =>
                  window.dispatchEvent(
                    new CustomEvent("navEcchi", { detail: a.entry?.mal_id || a.mal_id })
                  )
                }
              />
            </div>
          )}
          {activeTab === "Characters" && <TabCharacters chars={chars} />}
          {activeTab === "Recommendations" && (
            <TabRecs
              recs={recs}
              onAnimeClick={(a) =>
                window.dispatchEvent(
                  new CustomEvent("navEcchi", { detail: a.entry?.mal_id || a.mal_id })
                )
              }
            />
          )}
          {activeTab === "Details" && <TabDetails anime={anime} />}
          {activeTab === "Reviews" && <TabReviews reviews={reviews} animeId={anime.mal_id} animeTitle={anime.title} />}
        </div>

        <div className="w-full lg:w-[248px] shrink-0">
          <DetailSidebar anime={anime} score={score} />
        </div>
      </div>
    </div>
  );
};
export default EcchiDetailPage;
