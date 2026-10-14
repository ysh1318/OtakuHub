import React, { useState, useEffect, useRef, useMemo } from "react";
import { Anime } from "../types";
import { Icon } from "./Icons";
import { CardSkeleton } from "./CommonUI";
import { EcchiParticles, EcchiShelf } from "./EcchiElements";
import { EcchiWhereToWatch } from "./WhereToWatch";
import { jikanFetch, delay } from "../utils/jikan";

interface EcchiPageProps {
  onAnimeClick: (anime: Anime) => void;
  onNav: (id: string, extra?: any) => void;
}

export const EcchiPage: React.FC<EcchiPageProps> = ({ onAnimeClick, onNav }) => {
  const [ecchi, setEcchi] = useState<Anime[]>([]);
  const [romance, setRomance] = useState<Anime[]>([]);
  const [harem, setHarem] = useState<Anime[]>([]);
  const [mature, setMature] = useState<Anime[]>([]);
  const [newSeason, setNewSeason] = useState<Anime[]>([]);
  const [topRated, setTopRated] = useState<Anime[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const heroTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ecchiData, romanceData, haremData] = await Promise.all([
          jikanFetch("/anime?genres=9&order_by=score&sort=desc&limit=24&min_score=6.5"),
          jikanFetch("/anime?genres=22&order_by=score&sort=desc&limit=16&min_score=7"),
          jikanFetch("/anime?genres=35&order_by=score&sort=desc&limit=16&min_score=6.5"),
        ]);
        if (!mounted) return;
        setEcchi(ecchiData?.data || []);
        setRomance(romanceData?.data || []);
        setHarem(haremData?.data || []);

        await delay(500);
        const [matureData, newData, topData] = await Promise.all([
          jikanFetch("/anime?genres=9,12&order_by=score&sort=desc&limit=16&min_score=7"),
          jikanFetch("/anime?genres=9&order_by=start_date&sort=desc&limit=16&status=airing"),
          jikanFetch("/anime?genres=9&order_by=score&sort=desc&limit=8&min_score=7.5"),
        ]);
        if (!mounted) return;
        setMature(matureData?.data || []);
        setNewSeason(newData?.data || []);
        setTopRated(topData?.data || []);
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

  useEffect(() => {
    if (topRated.length === 0 && ecchi.length === 0) return;
    const heroItems = topRated.length > 0 ? topRated : ecchi.slice(0, 7);
    heroTimer.current = setInterval(
      () => setHeroIdx((i) => (i + 1) % Math.min(heroItems.length, 7)),
      9000
    );
    return () => {
      if (heroTimer.current) clearInterval(heroTimer.current);
    };
  }, [topRated.length, ecchi.length]);

  const heroItems = topRated.length > 0 ? topRated : ecchi.slice(0, 7);
  const hero = heroItems[heroIdx];
  const heroImg = hero?.images?.webp?.large_image_url || hero?.images?.webp?.image_url || hero?.images?.jpg?.large_image_url || hero?.images?.jpg?.image_url;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "linear-gradient(180deg, #0f0008 0%, #1a000d 30%, #0d0010 70%, #0a000a 100%)",
        position: "relative",
      }}
    >
      <EcchiParticles />

      {/* ── ECCHI HERO ── */}
      <div style={{ position: "relative", height: "440px", overflow: "hidden" }}>
        {heroImg ? (
          <img
            key={heroIdx}
            src={heroImg}
            alt={hero.title}
            className="hero-img fade-in"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "brightness(0.72) saturate(1.4)",
              animation: "ecchiHeroPulse 12s ease-in-out infinite",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#3d0020,#1a000d)" }} />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(10,0,8,0.99) 0%, rgba(20,0,12,0.8) 40%, rgba(10,0,8,0.1) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(transparent 45%,rgba(10,0,8,1) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 75% 30%, rgba(236,72,153,0.18) 0%, transparent 60%)",
          }}
        />

        {/* Hero Content */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "28px",
            maxWidth: "560px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  width: "340px",
                  height: "52px",
                  background: "rgba(236,72,153,0.1)",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  animation: "shimmerPink 1.5s infinite",
                }}
              />
              <div
                style={{
                  width: "260px",
                  height: "14px",
                  background: "rgba(236,72,153,0.07)",
                  borderRadius: "6px",
                  marginBottom: "14px",
                  animation: "shimmerPink 1.5s infinite",
                }}
              />
            </>
          ) : hero ? (
            <div className="fade-in" key={heroIdx}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap", alignItems: "center" }}>
                <span
                  style={{
                    background: "linear-gradient(90deg,rgba(236,72,153,0.9),rgba(244,63,94,0.9))",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 900,
                    padding: "4px 12px",
                    borderRadius: "6px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    boxShadow: "0 0 20px rgba(236,72,153,0.4)",
                    animation: "neonFlicker 5s linear infinite",
                  }}
                >
                  🌸 ECCHI ZONE
                </span>
                {hero.rating && (
                  <span
                    style={{
                      background: "rgba(236,72,153,0.12)",
                      border: "1px solid rgba(236,72,153,0.3)",
                      color: "#f9a8d4",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    {hero.rating}
                  </span>
                )}
                {hero.status === "Currently Airing" && (
                  <span
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.4)",
                      color: "#fca5a5",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    🔴 AIRING NOW
                  </span>
                )}
              </div>
              <h1
                style={{
                  fontSize: "46px",
                  fontWeight: 900,
                  color: "#fce7f3",
                  lineHeight: 1.02,
                  fontFamily: "'Rajdhani',sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "-1.5px",
                  marginBottom: "6px",
                  textShadow: "0 2px 30px rgba(236,72,153,0.4)",
                }}
              >
                {hero.title}
              </h1>
              {hero.title_japanese && (
                <p style={{ fontSize: "13px", color: "#f472b6", marginBottom: "10px", fontStyle: "italic", fontWeight: 500 }}>
                  {hero.title_japanese}
                </p>
              )}
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "center", flexWrap: "wrap" }}>
                {hero.score && (
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f472b6" stroke="#f472b6" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "#f472b6" }}>{hero.score}</span>
                  </div>
                )}
                {hero.year && (
                  <span style={{ fontSize: "13px", color: "#9d174d" }}>{hero.year}</span>
                )}
                {(hero.genres || []).slice(0, 3).map((g, gi) => (
                  <span
                    key={`${g.mal_id || 'g'}-${gi}`}
                    style={{
                      background: "rgba(236,72,153,0.1)",
                      border: "1px solid rgba(236,72,153,0.25)",
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
                style={{
                  fontSize: "13px",
                  color: "#9d174d",
                  lineHeight: 1.65,
                  marginBottom: "22px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {hero.synopsis}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="ecchi-btn"
                  onClick={() => onAnimeClick(hero)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "linear-gradient(90deg,#ec4899,#f43f5e)",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 24px",
                    color: "#fff",
                    fontSize: "13.5px",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 24px rgba(236,72,153,0.45)",
                  }}
                >
                  <Icon name="play" size={14} color="#fff" /> Watch Now
                </button>
                <button
                  className="ecchi-btn"
                  onClick={() => onAnimeClick(hero)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(236,72,153,0.08)",
                    border: "1px solid rgba(236,72,153,0.3)",
                    borderRadius: "10px",
                    padding: "12px 18px",
                    color: "#f9a8d4",
                    fontSize: "13.5px",
                    cursor: "pointer",
                  }}
                >
                  <Icon name="info" size={13} /> Details
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Hero nav dots */}
        {!loading && heroItems.slice(0, 7).length > 0 && (
          <div style={{ position: "absolute", bottom: "24px", left: "28px", display: "flex", gap: "6px", alignItems: "center", zIndex: 2 }}>
            {heroItems.slice(0, 7).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setHeroIdx(i);
                  if (heroTimer.current) clearInterval(heroTimer.current);
                }}
                style={{
                  width: i === heroIdx ? "28px" : "8px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === heroIdx ? "#ec4899" : "rgba(244,114,182,0.25)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  outline: "none",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── GENRE PILLS ── */}
      <div
        style={{
          padding: "18px 24px 4px",
          overflowX: "auto",
          background: "rgba(10,0,8,0.6)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(236,72,153,0.1)",
        }}
      >
        <div style={{ display: "flex", gap: "8px", minWidth: "max-content", overflowY: "hidden" }}>
          {[
            { label: "All Ecchi 🌸", id: null },
            { label: "Romance 💕", id: 22 },
            { label: "Harem 👑", id: 35 },
            { label: "Action Ecchi ⚔️", id: "9,1" },
            { label: "Demon Girls 😈", id: "9,10" },
            { label: "School Life 🏫", id: "9,23" },
          ].map((cat, ci) => (
            <button
              key={ci}
              onClick={() => cat.id && onNav && null}
              style={{
                background: ci === 0 ? "rgba(236,72,153,0.2)" : "rgba(236,72,153,0.05)",
                border: `1px solid ${ci === 0 ? "rgba(236,72,153,0.5)" : "rgba(236,72,153,0.15)"}`,
                borderRadius: "24px",
                padding: "7px 16px",
                cursor: "pointer",
                color: ci === 0 ? "#f9a8d4" : "#9d174d",
                fontSize: "12.5px",
                fontWeight: 600,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(236,72,153,0.15)";
                e.currentTarget.style.borderColor = "rgba(236,72,153,0.4)";
                e.currentTarget.style.color = "#fce7f3";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ci === 0 ? "rgba(236,72,153,0.2)" : "rgba(236,72,153,0.05)";
                e.currentTarget.style.borderColor = ci === 0 ? "rgba(236,72,153,0.5)" : "rgba(236,72,153,0.15)";
                e.currentTarget.style.color = ci === 0 ? "#f9a8d4" : "#9d174d";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "28px 24px 60px", position: "relative", zIndex: 1 }}>
        {/* Top-rated CTA banner */}
        {!loading && topRated.length > 0 && (
          <div
            style={{
              marginBottom: "32px",
              background: "linear-gradient(135deg,rgba(236,72,153,0.12),rgba(244,63,94,0.08))",
              border: "1px solid rgba(236,72,153,0.25)",
              borderRadius: "16px",
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#f472b6",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                🔞 18+ ZONE — ADULTS ONLY
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#fce7f3" }}>
                Premium ecchi anime, ranked by community score
              </div>
              <div style={{ fontSize: "12px", color: "#9d174d", marginTop: "2px" }}>
                Featuring the hottest, most-watched series of all time
              </div>
            </div>
            <button
              className="ecchi-btn"
              onClick={() => onNav && onNav("genres", { id: 9, name: "Ecchi", color: "#ec4899" })}
              style={{
                background: "linear-gradient(90deg,#ec4899,#f43f5e)",
                border: "none",
                borderRadius: "10px",
                padding: "10px 22px",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 18px rgba(236,72,153,0.4)",
              }}
            >
              Browse All 🌸
            </button>
          </div>
        )}

        {/* Shelves */}
        <EcchiShelf
          title="Top Ecchi All Time"
          icon="🔥"
          items={topRated.length > 0 ? topRated : ecchi.slice(0, 16)}
          loading={loading}
          onAnimeClick={onAnimeClick}
          badge="ECCHI"
          subtitle="Highest rated by MAL community"
          onViewAll={() => onNav && onNav("genres", { id: 9, name: "Ecchi", color: "#ec4899" })}
        />

        <EcchiShelf
          title="Hot & Airing Now"
          icon="📡"
          items={newSeason}
          loading={loading}
          onAnimeClick={onAnimeClick}
          badge="NEW"
          subtitle="Currently streaming this season"
          onViewAll={() => onNav && onNav("airing")}
        />

        <EcchiShelf
          title="Romantic & Spicy"
          icon="💕"
          items={romance}
          loading={loading}
          onAnimeClick={onAnimeClick}
          badge="ROMANCE"
          subtitle="Love, lust and drama"
        />

        <EcchiShelf
          title="Harem Fantasy"
          icon="👑"
          items={harem}
          loading={loading}
          onAnimeClick={onAnimeClick}
          badge="HAREM"
          subtitle="One protagonist, infinite possibilities"
        />

        <EcchiShelf
          title="Mature & Uncensored"
          icon="🔞"
          items={mature}
          loading={loading}
          onAnimeClick={onAnimeClick}
          badge="MATURE"
          subtitle="Not for the faint of heart"
        />

        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
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
              🌸 Where to Watch Ecchi
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(270deg, rgba(236,72,153,0.4), transparent)",
              }}
            />
          </div>
          <EcchiWhereToWatch anime={null} />
        </div>
      </div>
    </div>
  );
};
export default EcchiPage;
