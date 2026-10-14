import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Anime } from "../types";
import { Icon } from "./Icons";
import { Stars, Pill, Skeleton } from "./CommonUI";
import { Shelf } from "./AnimeCard";
import { jikanFetch, getWL, delay, getHistory, getEpProgress } from "../utils/jikan";
import { playSound } from "../utils/audio";

const GENRE_MAP = [
  { id: 1, name: "Action", color: "#f97316", emoji: "⚔️" },
  { id: 2, name: "Adventure", color: "#f59e0b", emoji: "🗺️" },
  { id: 10, name: "Fantasy", color: "#8b5cf6", emoji: "🔮" },
  { id: 22, name: "Romance", color: "#ec4899", emoji: "💖" },
  { id: 24, name: "Sci-Fi", color: "#3b82f6", emoji: "🚀" },
  { id: 14, name: "Horror", color: "#6b7280", emoji: "👻" },
  { id: 36, name: "Slice of Life", color: "#10b981", emoji: "☕" },
  { id: 8, name: "Drama", color: "#a78bfa", emoji: "🎭" },
  { id: 7, name: "Mystery", color: "#06b6d4", emoji: "🔍" },
  { id: 17, name: "Sports", color: "#84cc16", emoji: "🏆" },
  { id: 9, name: "Ecchi", color: "#ec4899", emoji: "🌸" },
];

// Helper to determine accurate and stunning show-specific accent colors
export function getAccentColor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("kimetsu") || t.includes("demon slayer") || t.includes("yaiba")) return "#f43f5e"; // Rose Red
  if (t.includes("shingeki") || t.includes("titan") || t.includes("kyojin")) return "#f97316"; // Orange
  if (t.includes("death note")) return "#ef4444"; // Crimson Red
  if (t.includes("fullmetal") || t.includes("alchemist") || t.includes("fma")) return "#3b82f6"; // Steel Blue
  if (t.includes("one punch") || t.includes("saitama")) return "#f59e0b"; // Punchy Yellow
  if (t.includes("boku no hero") || t.includes("my hero")) return "#10b981"; // Jade Green
  if (t.includes("jujutsu") || t.includes("kaisen") || t.includes("gojo")) return "#8b5cf6"; // Violet
  if (t.includes("chainsaw")) return "#ef4444"; // Blood Red
  if (t.includes("naruto") || t.includes("boruto")) return "#f97316"; // Fox Orange
  if (t.includes("bleach") || t.includes("ichigo")) return "#f97316"; // Zanpakuto Orange
  if (t.includes("frieren") || t.includes("beyond journey's end")) return "#06b6d4"; // Turquoise Magic
  if (t.includes("cyberpunk") || t.includes("edgerunners")) return "#facc15"; // Cyber Yellow
  if (t.includes("one piece") || t.includes("luffy")) return "#3b82f6"; // Sea Blue
  if (t.includes("haikyuu") || t.includes("karasuno")) return "#f97316"; // Volley Orange
  if (t.includes("re:zero") || t.includes("emilia")) return "#a855f7"; // Spirit Purple
  if (t.includes("sword art online") || t.includes("kirito")) return "#0ea5e9"; // SAO blue
  if (t.includes("high school dxd") || t.includes("to love-ru")) return "#ec4899"; // Hot Pink
  return "#6366f1"; // Default Royal Indigo
}

// Generates beautiful show-specific typography and styles
export function getHeroTitleStyle(anime: Anime, accentColor: string): React.CSSProperties {
  const title = anime.title.toLowerCase();
  const genres = (anime.genres || []).map(g => g.name.toLowerCase());
  
  return {
    lineHeight: 1.05,
    textShadow: "0 4px 30px rgba(0,0,0,0.9)",
    textTransform: "uppercase",
    marginBottom: "12px",
    fontFamily: "var(--font-rajdhani, sans-serif)",
    fontSize: "min(58px, 5.2vw)",
    fontWeight: 900,
    letterSpacing: "0.5px",
    fontStyle: "italic",
    background: "linear-gradient(180deg, #ffffff 40%, #e2e8f0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    transition: "all 0.3s ease",
  };
}

// High-fidelity Physics-based Magnetic Container using spring mechanics
export const Magnetic: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 180, damping: 14, mass: 0.15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < 110) {
      // Direct write to motion values, triggering zero component re-renders
      x.set(distanceX * 0.32);
      y.set(distanceY * 0.32);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block", x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

// Looping visual cinemagraph background with slow-drifting golden particles
const CinemagraphSparks: React.FC = () => {
  const particles = useRef(
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${14 + Math.random() * 12}s`,
      size: `${1.5 + Math.random() * 3.5}px`,
    }))
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1, mixBlendMode: "screen" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            bottom: "-20px",
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(253,186,116,0.85) 0%, rgba(251,146,60,0) 80%)",
            boxShadow: "0 0 12px rgba(251,146,60,0.6)",
            animation: `particleFloat ${p.duration} linear ${p.delay} infinite`,
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        />
      ))}
    </div>
  );
};

interface HeroRightPosterProps {
  hero: Anime;
  heroImg: string;
  accentColor: string;
  onAnimeClick: (anime: Anime) => void;
}

// Optimized 3D Poster component that encapsulates tilt states to avoid parent re-renders
const HeroRightPoster: React.FC<HeroRightPosterProps> = ({ hero, heroImg, accentColor, onAnimeClick }) => {
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [hov, setHov] = useState(false);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rY = ((mouseX / width) - 0.5) * 16;
    const rX = -((mouseY / height) - 0.5) * 16;

    setTiltX(rX);
    setTiltY(rY);
    setGlowX((mouseX / width) * 100);
    setGlowY((mouseY / height) * 100);
  };

  return (
    <motion.div
      className="hidden md:flex"
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        height: "82%",
        maxHeight: "410px",
        aspectRatio: "11/16",
        flexShrink: 0,
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: `0 32px 64px rgba(0, 0, 0, 0.8), 0 0 45px ${accentColor}25`,
        border: `1px solid ${accentColor}33`,
        pointerEvents: "auto",
        zIndex: 2,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => {
          setHov(false);
          setTiltX(0);
          setTiltY(0);
        }}
        animate={{
          rotateX: tiltX,
          rotateY: tiltY,
          scale: hov ? 1.03 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
        style={{ width: "100%", height: "100%", cursor: "pointer", position: "relative" }}
        onClick={() => onAnimeClick(hero)}
      >
        {hov && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
              zIndex: 3,
              pointerEvents: "none",
              mixBlendMode: "overlay",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          />
        )}
        <img
          src={heroImg}
          alt={hero.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

interface HomePageProps {
  onAnimeClick: (anime: Anime) => void;
  onNav: (id: string, extra?: any) => void;
  activeGenreId?: number | null;
  watchlist?: Anime[];
  toggleWatchlist?: (anime: Anime) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onAnimeClick,
  onNav,
  activeGenreId = null,
  watchlist = [],
  toggleWatchlist,
}) => {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [airing, setAiring] = useState<Anime[]>([]);
  const [topPicks, setTopPicks] = useState<Anime[]>([]);
  const [upcoming, setUpcoming] = useState<Anime[]>([]);
  const [personalRecs, setPersonalRecs] = useState<Anime[]>([]);
  const [ecchiAnime, setEcchiAnime] = useState<Anime[]>([]);
  const [movies, setMovies] = useState<Anime[]>([]);
  const [scifi, setScifi] = useState<Anime[]>([]);
  const [classic90s, setClassic90s] = useState<Anime[]>([]);
  const [classic2000s, setClassic2000s] = useState<Anime[]>([]);
  const [hidden, setHidden] = useState<Anime[]>([]);
  const [shortAnime, setShortAnime] = useState<Anime[]>([]);
  const [mecha, setMecha] = useState<Anime[]>([]);
  const [isekai, setIsekai] = useState<Anime[]>([]);
  const [sports, setSports] = useState<Anime[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const heroTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Batch 1: Fetch above-the-fold core shelves sequentially with a staggered delay to prevent Jikan rate limits
        const trendData = await jikanFetch("/top/anime?filter=bypopularity&limit=15").catch(() => null);
        if (mounted && trendData?.data) setTrending(trendData.data);
        await delay(350);
        if (!mounted) return;

        const airData = await jikanFetch("/top/anime?filter=airing&limit=15").catch(() => null);
        if (mounted && airData?.data) setAiring(airData.data);
        await delay(350);
        if (!mounted) return;

        const topData = await jikanFetch("/top/anime?limit=15").catch(() => null);
        if (mounted && topData?.data) setTopPicks(topData.data);
        await delay(350);
        if (!mounted) return;

        const upData = await jikanFetch("/top/anime?filter=upcoming&limit=15").catch(() => null);
        if (mounted && upData?.data) setUpcoming(upData.data);

        await delay(600);
        if (!mounted) return;
        
        // Batch 2: Ecchi & Romance & Personal Recommendations
        const ecchiData = await jikanFetch("/anime?genres=9&order_by=score&sort=desc&limit=18&min_score=7").catch(() => null);
        if (mounted && ecchiData?.data?.length > 0) {
          setEcchiAnime(ecchiData.data);
        } else if (mounted) {
          const romData = await jikanFetch("/anime?genres=22&order_by=score&sort=desc&limit=18&min_score=7.5").catch(() => null);
          if (mounted) setEcchiAnime(romData?.data || []);
        }

        const wl = getWL();
        if (wl.length > 0) {
          const seed = wl[Math.floor(Math.random() * wl.length)];
          const recData = await jikanFetch(`/anime/${seed.mal_id}/recommendations`).catch(() => null);
          if (mounted && recData?.data?.length > 0) {
            const wlIds = new Set(wl.map((w) => w.mal_id));
            setPersonalRecs(
              recData.data
                .filter((r: any) => !wlIds.has(r.entry?.mal_id))
                .slice(0, 16)
                .map((r: any) => r.entry)
            );
          }
        }

        // Set primary loading to false as soon as critical content is fully populated
        if (mounted) setLoading(false);

        // Batch 3: Movie, SciFi, and Hidden Gems
        await delay(900);
        if (!mounted) return;
        const [movieRes, scifiRes, hiddenRes] = await Promise.all([
          jikanFetch("/top/anime?type=movie&limit=16").catch(() => null),
          jikanFetch("/anime?genres=24&order_by=score&sort=desc&limit=16").catch(() => null),
          jikanFetch("/top/anime?filter=bypopularity&page=3&limit=16").catch(() => null),
        ]);
        if (mounted) {
          if (movieRes?.data) setMovies(movieRes.data);
          if (scifiRes?.data) setScifi(scifiRes.data);
          if (hiddenRes?.data) setHidden(hiddenRes.data);
        }

        // Batch 4: Classics (90s, 2000s) & Short Form Anime
        await delay(1200);
        if (!mounted) return;
        const [classic90sRes, classic2000sRes, shortRes] = await Promise.all([
          jikanFetch("/anime?start_date=1990-01-01&end_date=1999-12-31&order_by=score&sort=desc&limit=16&min_score=7.2&type=tv").catch(() => null),
          jikanFetch("/anime?start_date=2000-01-01&end_date=2009-12-31&order_by=score&sort=desc&limit=16&min_score=7.6&type=tv").catch(() => null),
          jikanFetch("/anime?order_by=score&sort=desc&limit=16&min_score=7.2&episodes=12").catch(() => null),
        ]);
        if (mounted) {
          if (classic90sRes?.data) setClassic90s(classic90sRes.data);
          if (classic2000sRes?.data) setClassic2000s(classic2000sRes.data);
          if (shortRes?.data) setShortAnime(shortRes.data);
        }

        // Batch 5: Specific Subgenres (Isekai, Mecha, Sports)
        await delay(1500);
        if (!mounted) return;
        const [isekaiRes, mechaRes, sportsRes] = await Promise.all([
          jikanFetch("/anime?genres=62&order_by=score&sort=desc&limit=16&min_score=7.0").catch(() => null),
          jikanFetch("/anime?genres=18&order_by=score&sort=desc&limit=16&min_score=7.0").catch(() => null),
          jikanFetch("/anime?genres=17&order_by=score&sort=desc&limit=16&min_score=7.0").catch(() => null),
        ]);
        if (mounted) {
          if (isekaiRes?.data) setIsekai(isekaiRes.data);
          if (mechaRes?.data) setMecha(mechaRes.data);
          if (sportsRes?.data) setSports(sportsRes.data);
        }

      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (trending.length === 0) return;
    heroTimer.current = setInterval(() => {
      setSlideDirection(1);
      setHeroIdx((i) => (i + 1) % Math.min(trending.length, 7));
    }, 10000);
    return () => {
      if (heroTimer.current) clearInterval(heroTimer.current);
    };
  }, [trending.length]);

  const [history, setHistory] = useState<Anime[]>([]);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [hoveredProgressId, setHoveredProgressId] = useState<number | null>(null);

  useEffect(() => {
    const updateHistoryAndProgress = () => {
      setHistory(getHistory());
      setProgress(getEpProgress());
    };
    updateHistoryAndProgress();
    window.addEventListener("history_update", updateHistoryAndProgress);
    window.addEventListener("ep_update", updateHistoryAndProgress);
    return () => {
      window.removeEventListener("history_update", updateHistoryAndProgress);
      window.removeEventListener("ep_update", updateHistoryAndProgress);
    };
  }, []);

  const hero = trending[heroIdx];
  const heroImg = hero?.images?.webp?.large_image_url || hero?.images?.webp?.image_url || hero?.images?.jpg?.large_image_url || hero?.images?.jpg?.image_url;
  const accentColor = hero ? getAccentColor(hero.title) : "#6366f1";
  const titleStyle = hero ? getHeroTitleStyle(hero, accentColor) : {};

  const handleNextSlide = () => {
    if (trending.length === 0) return;
    setSlideDirection(1);
    setHeroIdx((prev) => (prev + 1) % Math.min(trending.length, 7));
    if (heroTimer.current) clearInterval(heroTimer.current);
  };

  const handlePrevSlide = () => {
    if (trending.length === 0) return;
    setSlideDirection(-1);
    setHeroIdx((prev) => (prev - 1 + Math.min(trending.length, 7)) % Math.min(trending.length, 7));
    if (heroTimer.current) clearInterval(heroTimer.current);
  };

  const handleDragEnd = (_event: any, info: any) => {
    const threshold = 60;
    if (info.offset.x < -threshold) {
      handleNextSlide();
    } else if (info.offset.x > threshold) {
      handlePrevSlide();
    }
  };

  const carouselVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 160 : dir < 0 ? -160 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -160 : dir < 0 ? 160 : 0,
      opacity: 0,
    }),
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#07070f", position: "relative" }}>
      {/* Hero Banner (Edge-to-edge bleed starts at absolute top of view) */}
      <div style={{ position: "relative", height: "min(680px, 78vh)", minHeight: "520px", overflow: "hidden" }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {heroImg ? (
            <motion.div
              key={heroIdx}
              custom={slideDirection}
              variants={carouselVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={handleDragEnd}
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "absolute",
                inset: 0,
                cursor: "grab",
              }}
              whileTap={{ cursor: "grabbing" }}
            >
              <img
                src={heroImg}
                alt={hero?.title || ""}
                className="hero-img"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 18%",
                  filter: "brightness(0.50) saturate(1.3) contrast(1.08)",
                  WebkitMaskImage: "radial-gradient(circle at 75% 30%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0) 100%)",
                  maskImage: "radial-gradient(circle at 75% 30%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0) 100%)",
                  transformOrigin: "center center",
                  pointerEvents: "none",
                }}
              />
              {/* Cinemagraph atmospheric Spark / cinder loops */}
              <CinemagraphSparks />

              {/* Content Container (Offset by padding to slide gracefully behind translucent TopBar) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: "56px 48px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "54px",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                {/* Left Column: Metadata & Details */}
                <div
                  style={{
                    flex: 1,
                    maxWidth: "600px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    pointerEvents: "auto",
                    zIndex: 2,
                  }}
                >
                  <div className="fade-in" style={{ position: "relative" }}>
                    {/* Dynamic Backlight Aura matching the show's color scheme */}
                    <div
                      style={{
                        position: "absolute",
                        width: "320px",
                        height: "320px",
                        background: `radial-gradient(circle, ${accentColor}1d 0%, transparent 70%)`,
                        filter: "blur(50px)",
                        zIndex: -1,
                        left: "-40px",
                        top: "-40px",
                        pointerEvents: "none",
                        animation: "breathe 8s ease-in-out infinite",
                      }}
                    />
                    
                    {/* Small UPPERCASE Metadata Label Tags */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                      <span
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                          color: "#fff",
                          fontSize: "9.5px",
                          fontWeight: 800,
                          padding: "4px 11px",
                          borderRadius: "6px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          boxShadow: `0 4px 10px ${accentColor}3c`,
                        }}
                      >
                        🔥 Trending #{heroIdx + 1}
                      </span>
                      {hero.rating && (
                        <span
                          style={{
                            background: "rgba(255,255,255,0.07)",
                            color: "#e2e8f0",
                            fontSize: "9.5px",
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: "6px",
                            letterSpacing: "0.08em",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {hero.rating}
                        </span>
                      )}
                    </div>

                    {/* Adaptive Show-Specific Cinematic Display Heading */}
                    <h1 style={titleStyle}>
                      {hero.title}
                    </h1>

                    {hero.title_japanese && (
                      <p style={{ fontSize: "14px", color: "#94a3b8", display: "flex", gap: "6px", alignItems: "center", marginBottom: "14px", fontStyle: "italic", fontWeight: 500 }}>
                        <span style={{ width: "12px", height: "1px", background: accentColor }} />
                        {hero.title_japanese}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap" }}>
                      {hero.score && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Stars score={hero.score} size={13} fill={accentColor} />
                          <span style={{ fontSize: "15px", fontWeight: 800, color: accentColor }}>{hero.score}</span>
                        </div>
                      )}
                      {hero.year && (
                        <span style={{ fontSize: "13.5px", color: "#64748b", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{hero.year}</span>
                      )}
                      {(hero.genres || []).slice(0, 3).map((g, gi) => (
                        <span 
                          key={`${g.mal_id || 'g'}-${gi}`}
                          style={{
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontWeight: 750,
                            color: "#94a3b8",
                            background: "rgba(255,255,255,0.04)",
                            padding: "3px 9px",
                            borderRadius: "5px",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "#94a3b8",
                        lineHeight: 1.7,
                        marginBottom: "28px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {hero.synopsis}
                    </p>

                    {/* CTAs with Physics-based Magnetic Pulling Interaction */}
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <Magnetic>
                        <button
                          className="btn-primary"
                          onClick={() => onAnimeClick(hero)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}dd)`,
                            border: "none",
                            borderRadius: "11px",
                            padding: "12px 26px",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: `0 8px 24px -6px ${accentColor}55`,
                          }}
                        >
                          <Icon name="play" size={13} color="#fff" /> Watch Now
                        </button>
                      </Magnetic>

                      <Magnetic>
                        <button
                          className="btn-primary"
                          onClick={() => onAnimeClick(hero)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "11px",
                            padding: "12px 22px",
                            color: "#e2e8f0",
                            fontSize: "14px",
                            fontWeight: 650,
                            cursor: "pointer",
                            backdropFilter: "blur(12px)",
                          }}
                        >
                          <Icon name="info" size={13} /> Details
                        </button>
                      </Magnetic>
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Poster with tilt effect (using encapsulated optimization component) */}
                <HeroRightPoster hero={hero} heroImg={heroImg} accentColor={accentColor} onAnimeClick={onAnimeClick} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg,#1a0533,#16213e)"
              }}
            >
              {/* Fallback skeleton layout within AnimatePresence fallback wrapper */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: "56px 48px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "54px",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    maxWidth: "600px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    pointerEvents: "auto",
                    zIndex: 2,
                  }}
                >
                  <Skeleton w={340} h={52} mb={10} r={8} />
                  <Skeleton w={260} h={14} mb={14} r={6} />
                  <Skeleton w={200} h={40} r={8} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle radial and top/bottom blending gradients to smooth out any edges organically */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, #07070f 0%, rgba(7,7,15,0.7) 35%, rgba(7,7,15,0.2) 65%, rgba(7,7,15,0) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 75% 30%, ${accentColor}14 0%, transparent 60%)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "180px",
            background: "linear-gradient(transparent, #07070f)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "120px",
            background: "linear-gradient(rgba(7,7,15,0.9) 0%, rgba(7,7,15,0.4) 50%, rgba(7,7,15,0) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "300px",
            background: "linear-gradient(90deg, rgba(7,7,15,0.85) 0%, rgba(7,7,15,0) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Carousel Arrow Controls */}
        {!loading && trending.slice(0, 7).length > 0 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevSlide();
              }}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "rgba(13, 13, 24, 0.45)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e2e8f0",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(13, 13, 24, 0.75)";
                e.currentTarget.style.borderColor = `${accentColor}80`;
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(13, 13, 24, 0.45)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.color = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <Icon name="chevronLeft" size={20} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextSlide();
              }}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "rgba(13, 13, 24, 0.45)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e2e8f0",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(13, 13, 24, 0.75)";
                e.currentTarget.style.borderColor = `${accentColor}80`;
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(13, 13, 24, 0.45)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.color = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <Icon name="chevronRight" size={20} />
            </button>
          </>
        )}

        {/* Hero nav dots */}
        {!loading && trending.slice(0, 7).length > 0 && (
          <div style={{ position: "absolute", bottom: "24px", left: "28px", display: "flex", gap: "6px", alignItems: "center", zIndex: 10 }}>
            {trending.slice(0, 7).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setSlideDirection(i > heroIdx ? 1 : -1);
                  setHeroIdx(i);
                  if (heroTimer.current) clearInterval(heroTimer.current);
                }}
                style={{
                  width: i === heroIdx ? "28px" : "8px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === heroIdx ? accentColor : "rgba(255,255,255,0.22)",
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

      {/* Genre Pills */}
      <div style={{ padding: "20px 24px 4px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: "8px", minWidth: "max-content", overflowY: "hidden" }}>
          {GENRE_MAP.map((g, gi) => {
            const isActive = activeGenreId === g.id;
            const isEcchi = g.id === 9;
            return (
              <button
                key={g.id}
                onClick={() => (isEcchi ? onNav("ecchi") : onNav("genres", g))}
                style={{
                  background: isActive ? `${g.color}25` : isEcchi ? "rgba(236,72,153,0.06)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? `${g.color}70` : isEcchi ? "rgba(236,72,153,0.22)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "24px",
                  padding: "7px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.25s ease",
                  fontFamily: "var(--font-sans)",
                  transform: isActive ? "translateY(-2px)" : "none",
                  animation: `slideUp 0.3s ${gi * 30}ms ease forwards`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = `${g.color}18`;
                    e.currentTarget.style.borderColor = `${g.color}50`;
                    e.currentTarget.style.transform = "translateY(-2px) scale(1.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isEcchi ? "rgba(236,72,153,0.06)" : "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = isEcchi ? "rgba(236,72,153,0.22)" : "rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                  }
                }}
              >
                <span style={{ fontSize: "13px" }}>{g.emoji}</span>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: isActive ? g.color : isEcchi ? "#f472b6" : "#cbd5e1" }}>
                  {g.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content sections */}
      <div style={{ padding: "22px 24px 40px" }}>
        {/* Continue Watching Section */}
        {history.length > 0 && (
          <div style={{ marginBottom: "34px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>🎬</span> Continue Watching
              </h2>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  onClick={() => {
                    const el = document.getElementById("continue-watching-rail");
                    el?.scrollBy({ left: -280, behavior: "smooth" });
                  }}
                  style={{
                    background: "#111120",
                    border: "1px solid #1a1a2e",
                    borderRadius: "6px",
                    padding: "4px 7px",
                    cursor: "pointer",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    transition: "background 0.15s",
                  }}
                >
                  <Icon name="chevronLeft" size={13} />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("continue-watching-rail");
                    el?.scrollBy({ left: 280, behavior: "smooth" });
                  }}
                  style={{
                    background: "#111120",
                    border: "1px solid #1a1a2e",
                    borderRadius: "6px",
                    padding: "4px 7px",
                    cursor: "pointer",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    transition: "background 0.15s",
                  }}
                >
                  <Icon name="chevronRight" size={13} />
                </button>
              </div>
            </div>

            <motion.div
              id="continue-watching-rail"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              style={{
                display: "flex",
                gap: "14px",
                overflowX: "auto",
                paddingBottom: "12px",
                scrollbarWidth: "none",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
            >
              {history.map((a, i) => {
                const epWatched = progress[a.mal_id] || 0;
                const totalEpisodes = a.episodes || 12;
                const percent = totalEpisodes > 0 ? (epWatched / totalEpisodes) * 100 : 0;
                const cardImg = a.images?.webp?.large_image_url || a.images?.webp?.image_url || a.images?.jpg?.large_image_url || a.images?.jpg?.image_url;

                return (
                  <motion.div
                    key={`continue-${a.mal_id}-${i}`}
                    variants={{
                      hidden: { opacity: 0, y: 15, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 120,
                          damping: 14,
                        },
                      },
                    }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    onClick={() => {
                      playSound("click");
                      onAnimeClick(a);
                    }}
                    onMouseEnter={() => {
                      playSound("hover");
                      setHoveredProgressId(a.mal_id);
                    }}
                    onMouseLeave={() => setHoveredProgressId(null)}
                    style={{
                      width: "210px",
                      flexShrink: 0,
                      scrollSnapAlign: "start",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/10",
                        borderRadius: "10px",
                        overflow: "hidden",
                        background: "#0f0f1a",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                      }}
                    >
                      {cardImg && (
                        <img
                          src={cardImg}
                          alt={a.title}
                          referrerPolicy="no-referrer"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center 28%",
                          }}
                        />
                      )}
                      
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(7, 7, 15, 0.95) 0%, rgba(7, 7, 15, 0.4) 60%, transparent 100%)",
                          pointerEvents: "none",
                        }}
                      />

                      {epWatched > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            background: "rgba(16, 185, 129, 0.9)",
                            backdropFilter: "blur(4px)",
                            color: "#fff",
                            fontSize: "9px",
                            fontWeight: 800,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            letterSpacing: "0.5px",
                            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          EP {epWatched}
                        </div>
                      )}

                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "4px",
                          background: "rgba(255, 255, 255, 0.08)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, percent || (epWatched > 0 ? 10 : 0))}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #6366f1, #a855f7)",
                            boxShadow: "0 0 8px rgba(99, 102, 241, 0.6)",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(7, 7, 15, 0.35)",
                          opacity: hoveredProgressId === a.mal_id ? 1 : 0,
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "rgba(99,102,241,0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 12px rgba(99,102,241,0.5)",
                          }}
                        >
                          <Icon name="play" size={12} color="#fff" />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "8px", padding: "0 2px" }}>
                      <h4
                        style={{
                          fontSize: "13px",
                          fontWeight: 750,
                          color: "#cbd5e1",
                          fontFamily: "'Rajdhani', sans-serif",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.2,
                        }}
                        title={a.title}
                      >
                        {a.title}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "3px",
                          fontSize: "10.5px",
                          fontWeight: 650,
                          color: "#64748b",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        <span>
                          {epWatched > 0 ? `EP ${epWatched} / ${a.episodes || "?"}` : "Ready to watch"}
                        </span>
                        {epWatched > 0 && a.episodes && (
                          <span style={{ color: "#10b981", fontWeight: 750 }}>
                            {Math.round(percent)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <div
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.08) 18%, rgba(99, 102, 241, 0.08) 82%, transparent 100%)",
                marginTop: "24px",
                pointerEvents: "none",
              }}
            />
          </div>
        )}

        {(() => {
          const shelfConfigs = [
            {
              id: "trending",
              show: true,
              title: "Trending Now",
              icon: "🔥",
              items: trending,
              loading: loading,
              onViewAll: () => onNav("popular"),
            },
            {
              id: "airing",
              show: true,
              title: "Top Airing This Season",
              icon: "📡",
              items: airing,
              loading: loading,
              onViewAll: () => onNav("airing"),
              badge: "AIRING",
            },
            {
              id: "personalRecs",
              show: personalRecs.length > 0,
              title: "Because You Watched",
              icon: "✨",
              items: personalRecs,
              loading: false,
              badge: "FOR YOU",
            },
            {
              id: "hidden",
              show: hidden.length > 0,
              title: "Hidden Gems",
              icon: "💎",
              items: hidden,
              loading: false,
              badge: "EXPLORE",
            },
            {
              id: "topPicks",
              show: true,
              title: "All-Time Top Picks",
              icon: "👑",
              items: topPicks,
              loading: loading,
              onViewAll: () => onNav("explore"),
            },
            {
              id: "movies",
              show: movies.length > 0,
              title: "Cinematic Masterpieces",
              icon: "🎬",
              items: movies,
              loading: false,
              badge: "MOVIE",
            },
            {
              id: "classic90s",
              show: classic90s.length > 0,
              title: "90s Classics",
              icon: "📼",
              items: classic90s,
              loading: false,
              badge: "RETRO",
            },
            {
              id: "classic2000s",
              show: classic2000s.length > 0,
              title: "2000s Legends",
              icon: "💿",
              items: classic2000s,
              loading: false,
              badge: "CLASSIC",
            },
            {
              id: "shortAnime",
              show: shortAnime.length > 0,
              title: "Under 13 Episodes",
              icon: "⚡",
              items: shortAnime,
              loading: false,
              badge: "COMPLETED",
            },
            {
              id: "isekai",
              show: isekai.length > 0,
              title: "Isekai Worlds",
              icon: "🌀",
              items: isekai,
              loading: false,
              badge: "FANTASY",
            },
            {
              id: "mecha",
              show: mecha.length > 0,
              title: "Mecha & Giant Robots",
              icon: "🤖",
              items: mecha,
              loading: false,
              badge: "MECHA",
            },
            {
              id: "sports",
              show: sports.length > 0,
              title: "Sports Anime",
              icon: "🏆",
              items: sports,
              loading: false,
              badge: "SPORTS",
            },
            {
              id: "scifi",
              show: scifi.length > 0,
              title: "Sci-Fi & Cyberpunk Favorites",
              icon: "🌌",
              items: scifi,
              loading: false,
              badge: "SCI-FI",
            },
            {
              id: "ecchi",
              show: ecchiAnime.length > 0 || loading,
              title: "Ecchi & Romance",
              icon: "🌸",
              items: ecchiAnime,
              loading: loading,
              onViewAll: () => onNav("ecchi"),
              badge: "ECCHI",
              ecchi: true,
              isEcchiHeader: true,
            },
            {
              id: "upcoming",
              show: true,
              title: "Coming Soon",
              icon: "⚡",
              items: upcoming,
              loading: loading,
              badge: "SOON",
            },
          ];

          const activeConfigs = shelfConfigs.filter((c) => c.show);

          return activeConfigs.map((config, idx) => {
            const isLast = idx === activeConfigs.length - 1;
            const staggerDelay = idx * 0.1; // 100ms staggered delay interval

            const renderContent = () => {
              if (config.isEcchiHeader) {
                return (
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px", marginTop: "8px" }}>
                      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(236,72,153,0.4), transparent)" }} />
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "#f472b6", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.7 }}>
                        18+ Content
                      </span>
                      <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg, rgba(236,72,153,0.4), transparent)" }} />
                    </div>
                    <Shelf
                      title={config.title!}
                      icon={config.icon!}
                      items={config.items!}
                      loading={config.loading!}
                      onAnimeClick={onAnimeClick}
                      onViewAll={config.onViewAll}
                      badge={config.badge}
                      ecchi={config.ecchi}
                    />
                  </div>
                );
              }

              return (
                <Shelf
                  title={config.title!}
                  icon={config.icon!}
                  items={config.items!}
                  loading={config.loading!}
                  onAnimeClick={onAnimeClick}
                  onViewAll={config.onViewAll}
                  badge={config.badge}
                  ecchi={config.ecchi}
                />
              );
            };

            const isEcchiSep = config.id === "ecchi" || config.id === "scifi";
            const separatorColor = isEcchiSep ? "rgba(236, 72, 153, 0.08)" : "rgba(99, 102, 241, 0.08)";

            return (
              <React.Fragment key={config.id}>
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: staggerDelay, ease: [0.34, 1.2, 0.64, 1] }}
                >
                  {renderContent()}
                </motion.div>
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 0.4, delay: staggerDelay + 0.1 }}
                    style={{
                      height: "1px",
                      background: `linear-gradient(90deg, transparent 0%, ${separatorColor} 18%, ${separatorColor} 82%, transparent 100%)`,
                      margin: "24px 0",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </React.Fragment>
            );
          });
        })()}
      </div>
    </div>
  );
};
export default HomePage;
