import React, { useState, useEffect } from "react";
import { Anime, Character, Recommendation, Review } from "../types";
import { Icon } from "./Icons";
import { Skeleton, Stars, Pill } from "./CommonUI";
import {
  jikanFetch,
  fmt,
  getEpWatched,
  setEpWatched,
} from "../utils/jikan";
import { WhereToWatch } from "./WhereToWatch";
import { TrailerEmbed } from "./TrailerEmbed";
import { AnikotoPlayerTab } from "./AnikotoPlayerTab";
import {
  TabOverview,
  TabCharacters,
  TabRecs,
  TabDetails,
  TabReviews,
  DetailSidebar,
} from "./DetailTabs";

interface DetailPageProps {
  animeId: number;
  onBack: () => void;
  watchlist: Anime[];
  toggleWatchlist: (anime: Anime) => void;
  toast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({
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
  const [studioAnime, setStudioAnime] = useState<Anime[]>([]);
  const [seasonAnime, setSeasonAnime] = useState<Anime[]>([]);
  const [genreAnime, setGenreAnime] = useState<Anime[]>([]);

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
    setStudioAnime([]);
    setSeasonAnime([]);
    setGenreAnime([]);

    let mounted = true;
    (async () => {
      try {
        const [main, recData] = await Promise.all([
          jikanFetch(`/anime/${animeId}/full`),
          jikanFetch(`/anime/${animeId}/recommendations`),
        ]);
        if (!mounted) return;
        const mainAnime = main?.data;
        setAnime(mainAnime);
        setRecs((recData?.data || []).slice(0, 10));

        if (mainAnime) {
          const studioId = mainAnime.studios?.[0]?.mal_id;
          const genreId = mainAnime.genres?.[0]?.mal_id;
          const season = mainAnime.season;
          const year = mainAnime.year;

          const promises: Promise<any>[] = [];
          if (studioId) promises.push(jikanFetch(`/anime?studios=${studioId}&order_by=score&sort=desc&limit=8`).catch(() => null));
          else promises.push(Promise.resolve(null));

          if (season && year) promises.push(jikanFetch(`/season/${year}/${season}?limit=8`).catch(() => null));
          else promises.push(Promise.resolve(null));

          if (genreId) promises.push(jikanFetch(`/anime?genres=${genreId}&order_by=score&sort=desc&limit=8`).catch(() => null));
          else promises.push(Promise.resolve(null));

          const [studioRes, seasonRes, genreRes] = await Promise.all(promises);
          if (mounted) {
            setStudioAnime((studioRes?.data || []).filter((a: Anime) => a.mal_id !== animeId).slice(0, 6));
            setSeasonAnime((seasonRes?.data || []).filter((a: Anime) => a.mal_id !== animeId).slice(0, 6));
            setGenreAnime((genreRes?.data || []).filter((a: Anime) => a.mal_id !== animeId).slice(0, 6));
          }
        }
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
      <div style={{ flex: 1, overflowY: "auto", background: "#07070f", padding: "28px" }}>
        <Skeleton w="70%" h={52} mb={12} r={8} />
        <Skeleton w="45%" h={16} mb={24} r={6} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "24px" }}>
          <div>
            <Skeleton w="100%" h={240} mb={14} r={12} />
            <Skeleton w="100%" h={120} r={12} />
          </div>
          <div>
            <Skeleton w="100%" h={240} mb={14} r={12} />
            <Skeleton w="100%" h={80} r={12} />
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
          color: "#4a5568",
          fontSize: "16px",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Icon name="search" size={40} color="#1e1e2e" />
        <p>Anime not found.</p>
      </div>
    );
  }

  const img = anime.images?.webp?.large_image_url || anime.images?.webp?.image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const score = anime.score;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#07070f" }}>
      {/* Cinematic Hero */}
      <div className="relative min-h-[380px] md:h-[400px] overflow-hidden flex items-center py-8 md:py-0">
        {/* Dynamic Backing Ambiance Aura */}
        {img && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center 25%",
              filter: "blur(50px) brightness(0.4) saturate(2.2)",
              transform: "scale(1.15)",
              opacity: 0.7,
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
              filter: "brightness(0.68) saturate(1.1)",
              zIndex: 1,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(7,7,15,0.99) 0%, rgba(7,7,15,0.82) 48%, rgba(7,7,15,0.2) 100%)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 75% 30%, rgba(99,102,241,0.22) 0%, transparent 65%)",
            zIndex: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            background: "linear-gradient(transparent,#07070f)",
            zIndex: 4,
          }}
        />

        <div
          className="relative md:absolute inset-y-0 left-0 md:left-10 right-0 max-w-full md:max-w-4xl flex flex-col sm:flex-row items-center sm:items-center gap-6 md:gap-8 z-10 px-6 py-6 md:px-8 w-full text-center sm:text-left"
          style={{
            background: "linear-gradient(135deg, rgba(14, 14, 28, 0.6) 0%, rgba(6, 6, 12, 0.85) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.22)",
            borderRadius: "24px",
            boxShadow: "0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(99, 102, 241, 0.09), inset 0 1px 1px rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            margin: "auto 0",
            height: "fit-content",
          }}
        >
          <div
            className="w-[140px] sm:w-[170px] md:w-[195px] shrink-0 rounded-2xl overflow-hidden border border-indigo-500/30 shadow-[0_16px_5rem_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              animation: "slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <img src={img} alt={anime.title} style={{ width: "100%", display: "block" }} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start" style={{ animation: "slideUp 0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <h1
              className="text-2xl sm:text-3xl md:text-[42px] font-black text-white leading-tight md:leading-[1.05] uppercase tracking-tight sm:tracking-[-1.5px] mb-1.5 md:mb-2 animate-pulse-once"
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                textShadow: "0 4px 24px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.95)",
              }}
            >
              {anime.title}
            </h1>
            {anime.title_japanese && (
              <p style={{ fontSize: "14.5px", color: "#a5b4fc", marginBottom: "12px", fontStyle: "normal", fontWeight: 600, letterSpacing: "0.5px", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                {anime.title_japanese}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2.5">
              {score && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Stars score={score} size={14} />
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#f59e0b" }}>{score}</span>
                  <span style={{ fontSize: "11px", color: "#4a5568" }}>
                    ({fmt(anime.scored_by)} votes)
                  </span>
                </div>
              )}
              {anime.rank && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    background: "rgba(255,255,255,0.05)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  Rank #{anime.rank}
                </span>
              )}
              {anime.status && (
                <span
                  style={{
                    background: anime.status === "Currently Airing" ? "rgba(16,185,129,0.15)" : "#1a1a2e",
                    border:
                      anime.status === "Currently Airing"
                        ? "1px solid rgba(16,185,129,0.4)"
                        : "1px solid #1e1e30",
                    color: anime.status === "Currently Airing" ? "#10b981" : "#64748b",
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
                <Pill key={`${g.mal_id || 'g'}-${gi}`}>{g.name}</Pill>
              ))}
            </div>
            <p
              className="text-[12.5px] text-[#cbd5e1] leading-[1.65] max-w-[420px] mb-4.5 hidden md:-webkit-box md:line-clamp-2"
              style={{
                WebkitBoxOrient: "vertical",
              }}
            >
              {anime.synopsis}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 w-full">
              <button
                className="btn-primary"
                onClick={() => setActiveTab("Where to Watch")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Icon name="tv" size={13} color="#fff" /> Watch Now
              </button>
              {anime?.trailer?.youtube_id && (
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab("Trailer")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    color: "#fca5a5",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  <Icon name="play" size={13} color="#fca5a5" /> Trailer
                </button>
              )}
              <button
                className="btn-primary"
                onClick={() => {
                  toggleWatchlist(anime);
                  toast(inWL ? "Removed from Watchlist" : "Added to Watchlist!", inWL ? "info" : "success");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: inWL ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${inWL ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "10px",
                  padding: "10px 16px",
                  color: inWL ? "#a5b4fc" : "#e2e8f0",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <Icon name={inWL ? "check" : "plus"} size={13} /> {inWL ? "In Watchlist" : "Watchlist"}
              </button>
              {/* Episode Progress Tracker */}
              {anime?.episodes && anime.episodes > 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: "10px",
                    padding: "6px 12px",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700 }}>EP</span>
                  <button
                    onClick={() => {
                      const n = Math.max(0, epWatched - 1);
                      setEpWatchedState(n);
                      setEpWatched(animeId, n);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      fontSize: "14px",
                      lineHeight: 1,
                      padding: "0 2px",
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#f1f5f9", minWidth: "38px", textAlign: "center" }}>
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
                      color: "#10b981",
                      cursor: "pointer",
                      fontSize: "14px",
                      lineHeight: 1,
                      padding: "0 2px",
                    }}
                  >
                    +
                  </button>
                </div>
              )}
              <button
                className="btn-primary"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast("Link copied!", "success");
                }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "10px 13px",
                  color: "#94a3b8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Icon name="share" size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          borderBottom: "1px solid #13131e",
          padding: "0 28px",
          display: "flex",
          overflowX: "auto",
          background: "rgba(7,7,15,0.8)",
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
            className={`tab-btn ${activeTab === t ? "active" : ""}`}
            style={{
              padding: "14px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === t ? "2px solid #6366f1" : "2px solid transparent",
              color: activeTab === t ? "#a5b4fc" : "#4a5568",
              fontSize: "13px",
              fontWeight: activeTab === t ? 700 : 500,
              cursor: "pointer",
              marginBottom: -1,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {t === "Where to Watch" && (
              <Icon name="tv" size={12} color={activeTab === t ? "#a5b4fc" : "#4a5568"} />
            )}
            {t === "Watch Episode" && (
              <Icon name="play" size={12} color={activeTab === t ? "#a5b4fc" : "#4a5568"} />
            )}
            {t === "Trailer" && (
              <Icon name="play" size={12} color={activeTab === t ? "#ef4444" : "#4a5568"} />
            )}
            {t}
            {t === "Where to Watch" && (
              <span
                style={{
                  background: "linear-gradient(90deg,#6366f1,#a855f7)",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: "4px",
                  letterSpacing: "0.5px",
                }}
              >
                LIVE
              </span>
            )}
            {t === "Watch Episode" && (
              <span
                style={{
                  background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: "4px",
                  letterSpacing: "0.5px",
                }}
              >
                PRO
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
                  letterSpacing: "0.5px",
                }}
              >
                ▶
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 py-6 md:px-[28px] md:py-[24px] pb-10">
        <div className="flex-1 min-w-0" style={{ animation: "fadeIn 0.3s ease" }} key={activeTab}>
          {activeTab === "Where to Watch" && <WhereToWatch anime={anime} />}
          {activeTab === "Watch Episode" && <AnikotoPlayerTab anime={anime} />}
          {activeTab === "Trailer" && <TrailerEmbed anime={anime} />}
          {activeTab === "Overview" && (
            <TabOverview
              anime={anime}
              chars={chars}
              recs={recs}
              studioAnime={studioAnime}
              seasonAnime={seasonAnime}
              genreAnime={genreAnime}
              onAnimeClick={(a) =>
                window.dispatchEvent(
                  new CustomEvent("navAnime", { detail: a.entry?.mal_id || a.mal_id })
                )
              }
            />
          )}
          {activeTab === "Characters" && <TabCharacters chars={chars} />}
          {activeTab === "Recommendations" && (
            <TabRecs
              recs={recs}
              onAnimeClick={(a) =>
                window.dispatchEvent(
                  new CustomEvent("navAnime", { detail: a.entry?.mal_id || a.mal_id })
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
export default DetailPage;
