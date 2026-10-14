import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Anime } from "../types";
import { Icon } from "./Icons";
import { CardSkeleton } from "./CommonUI";
import { playSound } from "../utils/audio";
import { getAnimeImageUrl } from "../utils/jikan";

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
  badge?: string | null;
  epBadge?: string | null;
  delay?: number;
  watchlist?: Anime[] | null;
  toggleWatchlist?: ((anime: Anime) => void) | null;
  ecchi?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onClick,
  badge = null,
  epBadge = null,
  delay: _animDelay = 0,
  watchlist = null,
  toggleWatchlist = null,
  ecchi = false,
}) => {
  const [hov, setHov] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!anime) return <CardSkeleton />;

  const img = getAnimeImageUrl(anime);
  const score = anime.score;
  const inWL = watchlist ? watchlist.some((w) => w.mal_id === anime.mal_id) : false;
  const hoverClass = ecchi ? "ecchi-card-hover" : "card-hover";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rY = ((mouseX / width) - 0.5) * 12;
    const rX = -((mouseY / height) - 0.5) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlowX((mouseX / width) * 100);
    setGlowY((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    setHov(true);
    playSound("hover");
  };

  const handleMouseLeave = () => {
    setHov(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={hoverClass}
      onClick={() => {
        playSound("click");
        onClick(anime);
      }}
      animate={{
        scale: hov && isDesktop ? 1.05 : 1,
        y: hov && isDesktop ? -5 : 0,
        rotateX: hov && isDesktop ? rotateX : 0,
        rotateY: hov && isDesktop ? rotateY : 0,
        boxShadow: hov
          ? ecchi
            ? "0 20px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(236, 72, 153, 0.35)"
            : "0 20px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(99, 102, 241, 0.3)"
          : "0 4px 14px rgba(0, 0, 0, 0.4)",
        borderColor: hov
          ? ecchi
            ? "rgba(236, 72, 153, 0.6)"
            : "rgba(99, 102, 241, 0.6)"
          : "rgba(255, 255, 255, 0.06)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.8 }}
      style={{
        cursor: "pointer",
        position: "relative",
        borderRadius: "10px",
        overflow: "hidden",
        aspectRatio: "2/3",
        background: "#0c0c16",
        flexShrink: 0,
        opacity: 1,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic reflection specular overlay */}
      {isDesktop && (
        <motion.div
          animate={{
            opacity: hov ? 1 : 0,
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
          }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Shimmer Placeholder behind image */}
      {!imgLoaded && !imgError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #0e0e1a 25%, #18182a 50%, #0e0e1a 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            zIndex: 1,
          }}
        />
      )}

      {/* Actual Anime Poster Image */}
      {img && !imgError ? (
        <img
          src={img}
          alt={anime.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgError(true);
            setImgLoaded(true);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in, transform 0.4s ease-out",
            transform: hov && isDesktop ? "scale(1.06)" : "scale(1)",
            position: "relative",
            zIndex: 1,
          }}
        />
      ) : (
        /* Fallback artwork card when image is missing or broken */
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            background: "linear-gradient(145deg, #121224, #0a0a14)",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: ecchi ? "rgba(236,72,153,0.15)" : "rgba(99,102,241,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
              border: `1px solid ${ecchi ? "rgba(236,72,153,0.3)" : "rgba(99,102,241,0.3)"}`,
            }}
          >
            <Icon name="movie" size={20} color={ecchi ? "#f472b6" : "#818cf8"} />
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", lineHeight: 1.3 }}>
            {anime.title}
          </span>
        </div>
      )}

      {/* Top Badges */}
      {badge && (
        <span
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background:
              badge === "NEW"
                ? "#10b981"
                : ecchi
                  ? "linear-gradient(90deg,#ec4899,#f43f5e)"
                  : "#6366f1",
            color: "#fff",
            fontSize: "9px",
            fontWeight: 800,
            padding: "2px 7px",
            borderRadius: "4px",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            zIndex: 5,
            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          {badge}
        </span>
      )}
      {epBadge && (
        <span
          style={{
            position: "absolute",
            top: "8px",
            left: badge ? "auto" : "8px",
            right: badge ? "8px" : "auto",
            background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(6px)",
            color: "#e2e8f0",
            fontSize: "9px",
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: "4px",
            zIndex: 5,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {epBadge}
        </span>
      )}

      {/* Watchlist Quick Button */}
      {toggleWatchlist && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(anime);
          }}
          title={inWL ? "Remove from Watchlist" : "Add to Watchlist"}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "28px",
            height: "28px",
            borderRadius: "7px",
            background: inWL
              ? ecchi
                ? "rgba(236,72,153,0.92)"
                : "rgba(99,102,241,0.92)"
              : "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${inWL ? (ecchi ? "#ec4899" : "#6366f1") : "rgba(255,255,255,0.2)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            opacity: hov || inWL ? 1 : 0,
            transition: "opacity 0.2s, background 0.15s, transform 0.15s",
            transform: hov || inWL ? "scale(1)" : "scale(0.85)",
            zIndex: 10,
          }}
        >
          <Icon name={inWL ? "check" : "plus"} size={13} color="#fff" />
        </button>
      )}

      {/* Bottom Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: ecchi
            ? "linear-gradient(to top, rgba(16,0,12,0.96) 0%, rgba(16,0,12,0.5) 45%, transparent 75%)"
            : "linear-gradient(to top, rgba(7,7,15,0.96) 0%, rgba(7,7,15,0.5) 45%, transparent 75%)",
          zIndex: 2,
        }}
      />

      {/* Title & Metadata */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "24px 10px 10px",
          zIndex: 5,
        }}
      >
        <p
          style={{
            fontSize: "11.5px",
            fontWeight: 700,
            color: "#f1f5f9",
            lineHeight: 1.35,
            marginBottom: "5px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          }}
        >
          {anime.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {score != null && score > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill={ecchi ? "#f472b6" : "#f59e0b"}
                stroke={ecchi ? "#f472b6" : "#f59e0b"}
                strokeWidth="1.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span
                style={{
                  fontSize: "10.5px",
                  color: ecchi ? "#f472b6" : "#f59e0b",
                  fontWeight: 800,
                  fontFamily: "var(--font-rajdhani, sans-serif)",
                }}
              >
                {score}
              </span>
            </div>
          )}
          {anime.year && (
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 600 }}>
              {anime.year}
            </span>
          )}
          {anime.type && (
            <span
              style={{
                fontSize: "9px",
                color: "#94a3b8",
                fontWeight: 600,
                background: "rgba(255,255,255,0.06)",
                padding: "1px 4px",
                borderRadius: "3px",
                marginLeft: "auto",
              }}
            >
              {anime.type}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── GENERAL SHELF ───────────────────────────────────────────────────────────
interface ShelfProps {
  title: string;
  icon: string;
  items: Anime[];
  onAnimeClick: (anime: Anime) => void;
  onViewAll?: () => void;
  loading: boolean;
  badge?: string | null;
  accentColor?: string;
  ecchi?: boolean;
}

export const Shelf: React.FC<ShelfProps> = ({
  title,
  icon,
  items,
  onAnimeClick,
  onViewAll,
  loading,
  badge = null,
  ecchi = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shelfHov, setShelfHov] = useState(false);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const titleColor = ecchi ? "#f472b6" : "#f1f5f9";

  return (
    <div
      onMouseEnter={() => setShelfHov(true)}
      onMouseLeave={() => setShelfHov(false)}
      style={{
        marginBottom: "36px",
        borderLeft: ecchi ? "3px solid rgba(244,114,182,0.5)" : "3px solid transparent",
        paddingLeft: ecchi ? "14px" : "0",
        borderRadius: ecchi ? "0 0 0 4px" : "0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 800,
            color: titleColor,
            fontFamily: "var(--font-rajdhani, sans-serif)",
            letterSpacing: "0.4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transform: shelfHov ? "translateX(4px)" : "translateX(0)",
            transition: "transform 0.25s ease",
          }}
        >
          <span>{icon}</span>
          {title}
          {ecchi && (
            <span
              style={{
                fontSize: "9px",
                fontWeight: 800,
                background: "linear-gradient(90deg,#ec4899,#f43f5e)",
                color: "#fff",
                padding: "2px 7px",
                borderRadius: "4px",
                letterSpacing: "1px",
              }}
            >
              18+
            </span>
          )}
        </h2>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {onViewAll && (
            <button
              onClick={onViewAll}
              style={{
                background: "none",
                border: "none",
                color: ecchi ? "#f472b6" : "#818cf8",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "6px",
                transition: "color 0.15s, transform 0.15s",
              }}
            >
              View All →
            </button>
          )}
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            style={{
              background: "#111122",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "5px 8px",
              cursor: "pointer",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              transition: "background 0.15s",
            }}
          >
            <Icon name="chevronLeft" size={13} />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            style={{
              background: "#111122",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "5px 8px",
              cursor: "pointer",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              transition: "background 0.15s",
            }}
          >
            <Icon name="chevronRight" size={13} />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        style={{
          display: "flex",
          gap: "14px",
          overflowX: "auto",
          paddingBottom: "8px",
          scrollbarWidth: "none",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {loading
          ? Array(8)
              .fill(null)
              .map((_, i) => (
                <div key={i} style={{ width: "145px", flexShrink: 0, scrollSnapAlign: "start" }}>
                  <CardSkeleton />
                </div>
              ))
          : items.map((a, i) => (
              <div
                key={`${a.mal_id || "item"}-${i}`}
                style={{ width: "145px", flexShrink: 0, scrollSnapAlign: "start" }}
              >
                <AnimeCard
                  anime={a}
                  onClick={onAnimeClick}
                  badge={badge}
                  delay={-1}
                  epBadge={badge === "AIRING" ? (a.episodes ? `EP ${a.episodes}` : "AIRING") : null}
                  ecchi={ecchi}
                />
              </div>
            ))}
      </div>
    </div>
  );
};
