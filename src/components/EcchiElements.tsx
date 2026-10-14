import React, { useState, useMemo, useEffect, useRef } from "react";
import { Anime } from "../types";
import { Icon } from "./Icons";
import { CardSkeleton, Stars } from "./CommonUI";
import { setAgeVerified, getAnimeImageUrl } from "../utils/jikan";

// ─── PETALS PARTICLE SYSTEM (for ecchi page) ─────────────────────────────────
export const EcchiParticles: React.FC = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 110 - 5}%`,
        size: Math.random() * 10 + 6,
        dur: Math.random() * 12 + 8,
        delay: Math.random() * 15,
        emoji: ["🌸", "💕", "🌺", "💗", "🌹", "✿"][Math.floor(Math.random() * 6)],
        opacity: Math.random() * 0.5 + 0.2,
      })),
    []
  );

  const orbs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: `${10 + i * 18}%`,
        top: `${15 + (i % 3) * 28}%`,
        size: 200 + i * 70,
        color:
          i % 3 === 0
            ? "rgba(236,72,153,0.06)"
            : i % 3 === 1
              ? "rgba(244,114,182,0.05)"
              : "rgba(251,113,133,0.04)",
        dur: 10 + i * 4,
        delay: i * 2,
      })),
    []
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {orbs.map((o) => (
        <div
          key={o.id}
          style={{
            position: "absolute",
            left: o.left,
            top: o.top,
            width: `${o.size}px`,
            height: `${o.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            animation: `driftY ${o.dur}s ${o.delay}s ease-in-out infinite`,
            filter: "blur(50px)",
          }}
        />
      ))}
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.left,
            bottom: "-30px",
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `petalsFloat ${p.dur}s ${p.delay}s linear infinite`,
            userSelect: "none",
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

// ─── AGE GATE MODAL ──────────────────────────────────────────────────────────
interface AgeGateProps {
  onVerify: () => void;
  onDeny: () => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onVerify, onDeny }) => {
  const [checked, setChecked] = useState(false);
  const [shake, setShake] = useState(false);

  const handleEnter = () => {
    if (!checked) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setAgeVerified();
    onVerify();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5,0,8,0.98)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.08), transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          textAlign: "center",
          padding: "52px 48px",
          maxWidth: "480px",
          width: "90%",
          background: "linear-gradient(145deg,rgba(25,0,18,0.96),rgba(15,0,12,0.98))",
          border: "1.5px solid rgba(236,72,153,0.35)",
          borderRadius: "24px",
          boxShadow:
            "0 0 80px rgba(236,72,153,0.12), 0 40px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "22px",
            background: "linear-gradient(135deg,#ec4899,#f43f5e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 0 40px rgba(236,72,153,0.3)",
            animation: "pinkGlow 3s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: "38px" }}>🔞</span>
        </div>

        <div
          style={{
            fontSize: "11px",
            fontWeight: 900,
            color: "#f472b6",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          OTAKUHUB ECCHI ZONE
        </div>
        <h2
          style={{
            fontSize: "30px",
            fontWeight: 900,
            color: "#fce7f3",
            fontFamily: "'Rajdhani',sans-serif",
            letterSpacing: "-0.5px",
            marginBottom: "8px",
            lineHeight: 1.1,
          }}
        >
          Adults Only — 18+
        </h2>
        <p
          style={{
            fontSize: "13.5px",
            color: "#9d174d",
            lineHeight: 1.65,
            marginBottom: "28px",
          }}
        >
          This section contains mature content including suggestive imagery, nudity, and adult themes. You must be 18 years or older (or the age of majority in your jurisdiction) to proceed.
        </p>

        <div
          style={{
            background: "rgba(244,63,94,0.06)",
            border: "1px solid rgba(244,63,94,0.2)",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "22px",
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: "10.5px", color: "#9d174d", lineHeight: 1.7 }}>
            ⚠️ By entering, you confirm that you are{" "}
            <strong style={{ color: "#f472b6" }}>18 years or older</strong>, this content is legal in your region, and you are not accessing this from a public or shared device.
          </div>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            cursor: "pointer",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          <div
            onClick={() => setChecked(!checked)}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "6px",
              border: `2px solid ${checked ? "#ec4899" : "rgba(236,72,153,0.35)"}`,
              background: checked ? "rgba(236,72,153,0.2)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "1px",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            {checked && (
              <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="#ec4899" strokeWidth={3}>
                <polyline points="20 6 9 13 4 10" />
              </svg>
            )}
          </div>
          <span
            style={{
              fontSize: "12.5px",
              color: checked ? "#fce7f3" : "#9d174d",
              lineHeight: 1.5,
              transition: "color 0.2s",
            }}
          >
            I confirm I am 18 years of age or older and I have read and agree to the terms above.
          </span>
        </label>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleEnter}
            className="ecchi-btn"
            style={{
              flex: 2,
              padding: "14px 0",
              background: "linear-gradient(90deg,#ec4899,#f43f5e)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "14.5px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(236,72,153,0.4)",
              transform: shake ? "translateX(-4px)" : "none",
              transition: shake ? "none" : "transform 0.2s",
            }}
          >
            Enter Ecchi Zone 🌸
          </button>
          <button
            onClick={onDeny}
            style={{
              flex: 1,
              padding: "14px 0",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#64748b",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>

        <p style={{ fontSize: "10.5px", color: "#4a2030", marginTop: "18px", lineHeight: 1.6 }}>
          This preference is saved locally on your device. No personal data is collected. Powered by MyAnimeList via Jikan API.
        </p>
      </div>
    </div>
  );
};

// ─── ECCHI ANIME CARD ────────────────────────────────────────────────────────
interface EcchiAnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
  badge?: string | null;
  delay?: number;
}

export const EcchiAnimeCard: React.FC<EcchiAnimeCardProps> = ({
  anime,
  onClick,
  badge = null,
  delay: _animDelay = 0,
}) => {
  const [hov, setHov] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!anime) return <CardSkeleton />;
  const img = getAnimeImageUrl(anime);
  const score = anime.score;

  return (
    <div
      className="ecchi-card-hover"
      onClick={() => onClick(anime)}
      style={{
        cursor: "pointer",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        aspectRatio: "2/3",
        background: "#1a0014",
        flexShrink: 0,
        opacity: 1,
        border: "1px solid rgba(236,72,153,0.15)",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {!imgLoaded && !imgError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg,#1a0014 25%,#2d0030 50%,#1a0014 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmerPink 1.5s infinite",
            zIndex: 1,
          }}
        />
      )}
      {img && !imgError ? (
        <img
          src={img}
          alt={anime.title}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.25s ease, transform 0.4s ease",
            transform: hov ? "scale(1.08)" : "scale(1)",
            position: "relative",
            zIndex: 1,
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgError(true);
            setImgLoaded(true);
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            background: "#160012",
            color: "#f472b6",
            fontSize: "11px",
            fontWeight: 700,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {anime.title}
        </div>
      )}
      {badge && (
        <span
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background: "linear-gradient(90deg,#ec4899,#f43f5e)",
            color: "#fff",
            fontSize: "9px",
            fontWeight: 900,
            padding: "2px 8px",
            borderRadius: "4px",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            boxShadow: "0 2px 8px rgba(236,72,153,0.5)",
            zIndex: 5,
          }}
        >
          {badge}
        </span>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hov
            ? "linear-gradient(transparent 25%, rgba(30,0,20,0.97) 100%)"
            : "linear-gradient(transparent 35%, rgba(20,0,15,0.95) 100%)",
          transition: "all 0.4s",
        }}
      />

      {hov && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1.5px solid rgba(236,72,153,0.6)",
            borderRadius: "12px",
            boxShadow: "inset 0 0 20px rgba(236,72,153,0.1)",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "28px 10px 10px",
          transform: hov ? "translateY(0)" : "translateY(3px)",
          transition: "transform 0.35s ease",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 800,
            color: hov ? "#fce7f3" : "#f9a8d4",
            lineHeight: 1.3,
            marginBottom: "5px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {anime.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          {score && (
            <>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="#f472b6" stroke="#f472b6" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontSize: "10px", color: "#f472b6", fontWeight: 700 }}>
                {score}
              </span>
            </>
          )}
          {anime.year && (
            <span style={{ fontSize: "10px", color: "#9d174d" }}>{anime.year}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ECCHI SHELF ──────────────────────────────────────────────────────────────
interface EcchiShelfProps {
  title: string;
  icon: string;
  items: Anime[];
  loading: boolean;
  onAnimeClick: (anime: Anime) => void;
  onViewAll?: () => void;
  badge?: string | null;
  subtitle?: string | null;
}

export const EcchiShelf: React.FC<EcchiShelfProps> = ({
  title,
  icon,
  items,
  loading,
  onAnimeClick,
  onViewAll,
  badge = null,
  subtitle = null,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        marginBottom: "38px",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.2,0.64,1)",
        borderLeft: "3px solid rgba(236,72,153,0.5)",
        paddingLeft: "16px",
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
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 900,
              color: "#fce7f3",
              fontFamily: "'Rajdhani',sans-serif",
              letterSpacing: "0.4px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "2px",
            }}
          >
            <span style={{ display: "inline-block", animation: "iconSpin 6s ease-in-out infinite" }}>
              {icon}
            </span>
            {title}
            {badge && (
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  background: "linear-gradient(90deg,#ec4899,#f43f5e)",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  letterSpacing: "1px",
                  animation: "rosePulse 3s ease-in-out infinite",
                }}
              >
                {badge}
              </span>
            )}
          </h2>
          {subtitle && (
            <p style={{ fontSize: "11px", color: "#9d174d", fontStyle: "italic" }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {onViewAll && (
            <button
              onClick={onViewAll}
              style={{
                background: "none",
                border: "none",
                color: "#f472b6",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
            >
              View All →
            </button>
          )}
          <button
            onClick={() => scroll(-1)}
            style={{
              background: "rgba(236,72,153,0.08)",
              border: "1px solid rgba(236,72,153,0.2)",
              borderRadius: "6px",
              padding: "4px 7px",
              cursor: "pointer",
              color: "#f472b6",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon name="chevronLeft" size={13} />
          </button>
          <button
            onClick={() => scroll(1)}
            style={{
              background: "rgba(236,72,153,0.08)",
              border: "1px solid rgba(236,72,153,0.2)",
              borderRadius: "6px",
              padding: "4px 7px",
              cursor: "pointer",
              color: "#f472b6",
              display: "flex",
              alignItems: "center",
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
        }}
      >
        {loading
          ? Array(10)
              .fill(null)
              .map((_, i) => (
                <div key={i} style={{ width: "150px", flexShrink: 0 }}>
                  <CardSkeleton />
                </div>
              ))
          : items.map((a, i) => (
              <div key={`${a.mal_id || "ecchi"}-${i}`} style={{ width: "150px", flexShrink: 0 }}>
                <EcchiAnimeCard anime={a} onClick={onAnimeClick} badge={badge} delay={i * 35} />
              </div>
            ))}
      </div>
    </div>
  );
};
