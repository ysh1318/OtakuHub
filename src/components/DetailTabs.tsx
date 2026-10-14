import React, { useState, useEffect } from "react";
import { Anime, Character, Recommendation, Review } from "../types";
import { Icon } from "./Icons";
import { Stars, Pill } from "./CommonUI";
import { AnimeCard } from "./AnimeCard";
import { fmt } from "../utils/jikan";

// ─── TAB OVERVIEW ───────────────────────────────────────────────────────────
interface TabOverviewProps {
  anime: Anime;
  chars: Character[];
  recs: Recommendation[];
  onAnimeClick: (anime: any) => void;
  studioAnime?: Anime[];
  seasonAnime?: Anime[];
  genreAnime?: Anime[];
}

export const TabOverview: React.FC<TabOverviewProps> = ({
  anime,
  chars,
  recs,
  onAnimeClick,
  studioAnime = [],
  seasonAnime = [],
  genreAnime = [],
}) => (
  <div className="fade-in">
    <div
      style={{
        background: "#0f0f1a",
        border: "1px solid #1e1e30",
        borderRadius: "14px",
        padding: "22px",
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 800,
          color: "#f1f5f9",
          marginBottom: "14px",
          fontFamily: "'Rajdhani',sans-serif",
        }}
      >
        Synopsis
      </h3>
      <p style={{ fontSize: "13.5px", color: "#e2e8f0", lineHeight: 1.8, fontWeight: 400 }}>
        {anime.synopsis}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 28px",
          marginTop: "18px",
        }}
      >
        {[
          ["Japanese Title", anime.title_japanese],
          ["English Title", anime.title_english],
          ["Status", anime.status],
          ["Type", anime.type],
          ["Episodes", anime.episodes],
          ["Duration", anime.duration],
          ["Studio", (anime.studios || [])[0]?.name],
          ["Premiered", anime.season ? `${anime.season} ${anime.year}` : anime.year],
          ["Source", anime.source],
          ["Rating", anime.rating],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div
              key={k as string}
              style={{
                display: "flex",
                gap: "10px",
                paddingBottom: "7px",
                borderBottom: "1px solid #141422",
              }}
            >
              <span
                style={{
                  fontSize: "11.5px",
                  color: "#94a3b8",
                  minWidth: "108px",
                  flexShrink: 0,
                  fontWeight: 650,
                }}
              >
                {k as string}
              </span>
              <span style={{ fontSize: "12.5px", color: "#f1f5f9", fontWeight: 500 }}>
                {String(v)}
              </span>
            </div>
          ))}
      </div>
    </div>

    {studioAnime.length > 0 && (
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 800,
            color: "#f1f5f9",
            marginBottom: "14px",
            fontFamily: "'Rajdhani',sans-serif",
          }}
        >
          More from {(anime.studios || [])[0]?.name || "this Studio"}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: "10px" }}>
          {studioAnime.map((sa, i) => (
            <div key={`${sa.mal_id || "sa"}-${i}`} style={{ animation: `cardReveal 0.4s ${i * 40}ms ease both` }}>
              <AnimeCard anime={sa} onClick={() => onAnimeClick(sa)} delay={i * 40} />
            </div>
          ))}
        </div>
      </div>
    )}

    {seasonAnime.length > 0 && (
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 800,
            color: "#f1f5f9",
            marginBottom: "14px",
            fontFamily: "'Rajdhani',sans-serif",
          }}
        >
          Popular {anime.season ? `${anime.season} ${anime.year}` : anime.year} Season Picks
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: "10px" }}>
          {seasonAnime.map((sa, i) => (
            <div key={`${sa.mal_id || "sea"}-${i}`} style={{ animation: `cardReveal 0.4s ${i * 40}ms ease both` }}>
              <AnimeCard anime={sa} onClick={() => onAnimeClick(sa)} delay={i * 40} />
            </div>
          ))}
        </div>
      </div>
    )}

    {genreAnime.length > 0 && (
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 800,
            color: "#f1f5f9",
            marginBottom: "14px",
            fontFamily: "'Rajdhani',sans-serif",
          }}
        >
          Similar {(anime.genres || [])[0]?.name || "Genre"} Favorites
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: "10px" }}>
          {genreAnime.map((ga, i) => (
            <div key={`${ga.mal_id || "genre"}-${i}`} style={{ animation: `cardReveal 0.4s ${i * 40}ms ease both` }}>
              <AnimeCard anime={ga} onClick={() => onAnimeClick(ga)} delay={i * 40} />
            </div>
          ))}
        </div>
      </div>
    )}

    {chars.length > 0 && (
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 800,
            color: "#f1f5f9",
            marginBottom: "14px",
            fontFamily: "'Rajdhani',sans-serif",
          }}
        >
          Top Characters
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))",
            gap: "12px",
          }}
        >
          {chars.slice(0, 8).map((c, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                animation: `cardReveal 0.4s ${i * 50}ms ease both`,
              }}
            >
              <div
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  aspectRatio: "3/4",
                  marginBottom: "6px",
                  border: "1px solid #1e1e30",
                  background: "#0f0f1a",
                }}
              >
                <img
                  src={c.character?.images?.jpg?.image_url}
                  alt={c.character?.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                  }}
                  loading="lazy"
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
                />
              </div>
              <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.25 }}>
                {c.character?.name}
              </p>
              <p
                style={{
                  fontSize: "9.5px",
                  color: c.role === "Main" ? "#6366f1" : "#3d4458",
                  marginTop: "2px",
                }}
              >
                {c.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}

    {recs.length > 0 && (
      <div>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 800,
            color: "#f1f5f9",
            marginBottom: "14px",
            fontFamily: "'Rajdhani',sans-serif",
          }}
        >
          You Might Also Like
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))",
            gap: "10px",
          }}
        >
          {recs.slice(0, 6).map((r, i) => {
            const a = r.entry;
            return (
              <div key={i} style={{ animation: `cardReveal 0.4s ${i * 40}ms ease both` }}>
                <AnimeCard anime={a} onClick={() => onAnimeClick(a)} delay={i * 40} />
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);

// ─── TAB CHARACTERS ──────────────────────────────────────────────────────────
export const TabCharacters: React.FC<{ chars: Character[] }> = ({ chars }) => (
  <div className="fade-in">
    <h3
      style={{
        fontSize: "15px",
        fontWeight: 800,
        color: "#f1f5f9",
        marginBottom: "16px",
        fontFamily: "'Rajdhani',sans-serif",
      }}
    >
      All Characters
    </h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
        gap: "12px",
      }}
    >
      {chars.map((c, i) => (
        <div
          key={i}
          style={{
            background: "#0f0f1a",
            border: "1px solid #1e1e30",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            gap: "12px",
            padding: "12px",
            animation: `cardReveal 0.4s ${i * 40}ms ease both`,
            transition: "border-color 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6366f1";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#1e1e30";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <img
            src={c.character?.images?.jpg?.image_url}
            alt={c.character?.name}
            style={{
              width: "52px",
              height: "68px",
              borderRadius: "8px",
              objectFit: "cover",
              flexShrink: 0,
            }}
            loading="lazy"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#e2e8f0", marginBottom: "3px" }}>
              {c.character?.name}
            </p>
            <span
              style={{
                fontSize: "10.5px",
                color: c.role === "Main" ? "#6366f1" : "#3d4458",
                background: c.role === "Main" ? "rgba(99,102,241,0.12)" : "#111120",
                padding: "1px 7px",
                borderRadius: "10px",
                display: "inline-block",
                marginBottom: "4px",
              }}
            >
              {c.role}
            </span>
            {c.voice_actors && c.voice_actors.length > 0 && (
              <p style={{ fontSize: "10.5px", color: "#3d4458", marginTop: "4px" }}>
                VA:{" "}
                {c.voice_actors.find((v) => v.language === "Japanese")?.person?.name ||
                  c.voice_actors[0]?.person?.name}
              </p>
            )}
          </div>
          {c.voice_actors && c.voice_actors.length > 0 && (
            (() => {
              const va = c.voice_actors.find((v) => v.language === "Japanese") || c.voice_actors[0];
              const vaImg = va?.person?.images?.jpg?.image_url;
              return vaImg ? (
                <div style={{ width: "38px", height: "50px", borderRadius: "5px", overflow: "hidden", flexShrink: 0, border: "1px solid #1a1a2e" }} title={`VA: ${va.person?.name}`}>
                  <img src={vaImg} alt={va.person?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                </div>
              ) : null;
            })()
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─── TAB RECOMMENDATIONS ─────────────────────────────────────────────────────
interface TabRecsProps {
  recs: Recommendation[];
  onAnimeClick: (anime: any) => void;
}

export const TabRecs: React.FC<TabRecsProps> = ({ recs, onAnimeClick }) => (
  <div className="fade-in">
    <h3
      style={{
        fontSize: "15px",
        fontWeight: 800,
        color: "#f1f5f9",
        marginBottom: "16px",
        fontFamily: "'Rajdhani',sans-serif",
      }}
    >
      Recommended Anime
    </h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
        gap: "12px",
      }}
    >
      {recs.map((r, i) => {
        const a = r.entry;
        return (
          <div key={i} style={{ animation: `cardReveal 0.4s ${i * 35}ms ease both` }}>
            <AnimeCard anime={a} onClick={() => onAnimeClick(a)} delay={i * 35} />
            {r.votes > 0 && (
              <p style={{ fontSize: "10px", color: "#3d4458", textAlign: "center", marginTop: "4px" }}>
                {r.votes} votes
              </p>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// ─── TAB DETAILS ─────────────────────────────────────────────────────────────
export const TabDetails: React.FC<{ anime: Anime }> = ({ anime }) => {
  const rows = [
    ["Type", anime.type],
    ["Episodes", anime.episodes],
    ["Status", anime.status],
    ["Aired", anime.aired?.string],
    ["Season", anime.season ? `${anime.season} ${anime.year}` : null],
    ["Broadcast", anime.broadcast?.string],
    ["Producers", (anime.producers || []).map((p) => p.name).join(", ")],
    ["Licensors", (anime.licensors || []).map((l) => l.name).join(", ")],
    ["Studios", (anime.studios || []).map((s) => s.name).join(", ")],
    ["Source", anime.source],
    ["Genres", (anime.genres || []).map((g) => g.name).join(", ")],
    ["Themes", (anime.themes || []).map((t) => t.name).join(", ")],
    ["Demographic", (anime.demographics || []).map((d) => d.name).join(", ")],
    ["Duration", anime.duration],
    ["Rating", anime.rating],
    ["Score", anime.score ? `${anime.score} (${fmt(anime.scored_by)} users)` : null],
    ["Ranked", anime.rank ? `#${anime.rank}` : null],
    ["Popularity", anime.popularity ? `#${anime.popularity}` : null],
    ["Members", fmt(anime.members)],
    ["Favorites", fmt(anime.favorites)],
  ].filter(([, v]) => v);

  return (
    <div
      className="fade-in"
      style={{ background: "#0f0f1a", border: "1px solid #1e1e30", borderRadius: "14px", padding: "22px" }}
    >
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 800,
          color: "#f1f5f9",
          marginBottom: "18px",
          fontFamily: "'Rajdhani',sans-serif",
        }}
      >
        Full Details
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 32px" }}>
        {rows.map(([k, v]) => (
          <div
            key={k as string}
            style={{
              display: "flex",
              gap: "10px",
              paddingBottom: "8px",
              borderBottom: "1px solid #141422",
            }}
          >
            <span
              style={{
                fontSize: "11.5px",
                color: "#3d4458",
                minWidth: "110px",
                flexShrink: 0,
                fontWeight: 600,
              }}
            >
              {k as string}
            </span>
            <span style={{ fontSize: "12px", color: "#cbd5e1" }}>{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TAB REVIEWS ─────────────────────────────────────────────────────────────
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../utils/firebase";
import { playSound } from "../utils/audio";

interface TabReviewsProps {
  reviews: Review[];
  animeId?: number;
  animeTitle?: string;
}

export const TabReviews: React.FC<TabReviewsProps> = ({ reviews, animeId = 0, animeTitle = "" }) => {
  const [fbReviews, setFbReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [score, setScore] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!animeId) return;

    if (!db) {
      try {
        const stored = JSON.parse(localStorage.getItem("otakuhub_local_reviews_v1") || "[]");
        setFbReviews(stored.filter((r: any) => r.animeId === Number(animeId)));
      } catch {
        setFbReviews([]);
      }
      return;
    }

    // Real-time synchronization of custom reviews from Cloud Firestore
    const reviewsRef = collection(db, "anime_reviews");
    const q = query(
      reviewsRef,
      where("animeId", "==", Number(animeId)),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setFbReviews(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, "anime_reviews");
    });

    return () => unsubscribe();
  }, [animeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (!reviewText.trim()) {
      setValidationError("Review text cannot be empty.");
      return;
    }
    if (reviewText.trim().length < 5) {
      setValidationError("Review must be at least 5 characters long.");
      return;
    }

    setSubmitting(true);
    if (!db) {
      const localReview = {
        id: "local_" + Date.now(),
        animeId: Number(animeId),
        animeTitle: animeTitle || "Anime",
        userId: user?.uid || "guest",
        username: user?.displayName || user?.email || "Otaku Member",
        userImage: user?.photoURL || "",
        reviewText: reviewText.trim(),
        score: Number(score),
        createdAt: { seconds: Math.floor(Date.now() / 1000) }
      };
      try {
        const stored = JSON.parse(localStorage.getItem("otakuhub_local_reviews_v1") || "[]");
        localStorage.setItem("otakuhub_local_reviews_v1", JSON.stringify([localReview, ...stored]));
        setFbReviews((prev) => [localReview, ...prev]);
        setReviewText("");
        setScore(10);
        playSound("success");
      } catch {}
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "anime_reviews"), {
        animeId: Number(animeId),
        animeTitle: animeTitle || "Unidentified Anime",
        userId: user?.uid || "guest",
        username: user?.displayName || user?.email || "Anonymous",
        userImage: user?.photoURL || "",
        reviewText: reviewText.trim(),
        score: Number(score),
        createdAt: serverTimestamp()
      });
      setReviewText("");
      setScore(10);
      playSound("success");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "anime_reviews");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!db || id.startsWith("local_")) {
      try {
        const stored = JSON.parse(localStorage.getItem("otakuhub_local_reviews_v1") || "[]");
        const updated = stored.filter((r: any) => r.id !== id);
        localStorage.setItem("otakuhub_local_reviews_v1", JSON.stringify(updated));
        setFbReviews((prev) => prev.filter((r) => r.id !== id));
        playSound("click");
      } catch {}
      return;
    }
    try {
      await deleteDoc(doc(db, "anime_reviews", id));
      playSound("click");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `anime_reviews/${id}`);
    }
  };

  const hasNoReviews = (!reviews || reviews.length === 0) && fbReviews.length === 0;

  return (
    <div className="fade-in">
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 800,
          color: "#f1f5f9",
          marginBottom: "18px",
          fontFamily: "'Rajdhani',sans-serif",
        }}
      >
        Community Reviews
      </h3>

      {/* Review formulation form */}
      <div
        style={{
          background: "rgba(15, 15, 26, 0.6)",
          border: "1px dashed rgba(99, 102, 241, 0.25)",
          borderRadius: "14px",
          padding: "18px",
          marginBottom: "24px",
        }}
      >
        {(user || !db) ? (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#a5b4fc", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon name="community" size={13} color="#a5b4fc" /> Write a Public Review for {animeTitle}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>My Personal Rating:</span>
              <select
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                style={{
                  background: "#07070f",
                  border: "1px solid #1e1e30",
                  color: "#f1f5f9",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}/10 Stars
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="What are your thoughts on this anime? (soundtrack, animation, lore...)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{
                width: "100%",
                height: "82px",
                background: "#07070f",
                border: "1px solid #1e1e30",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "13px",
                fontFamily: "inherit",
                padding: "10px",
                outline: "none",
                resize: "none",
                lineHeight: "1.5",
                boxSizing: "border-box"
              }}
            />
            {validationError && (
              <p style={{ color: "#ef4444", fontSize: "11.5px", marginTop: "4px", marginBottom: "0" }}>
                ⚠️ {validationError}
              </p>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "6px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {submitting ? (
                  <>
                    <Icon name="loader" size={12} spin /> Posting...
                  </>
                ) : (
                  "Post Review"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <p style={{ color: "#a5b4fc", fontSize: "12.5px", fontWeight: 500, margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <Icon name="shield" size={13} color="#a5b4fc" /> Please sign in using the button in the top header to write a review!
            </p>
          </div>
        )}
      </div>

      {hasNoReviews && (
        <div style={{ color: "#3d4458", fontSize: "14px", padding: "40px 0", textAlign: "center" }}>
          <div style={{ display: "inline-flex", marginBottom: "14px" }}>
            <Icon name="community" size={32} color="#1e1e30" />
          </div>
          <br />
          No reviews found for this title yet.
        </div>
      )}

      {/* Render Firebase-submitted reviews first */}
      {fbReviews.map((r, i) => (
        <div
          key={`fb-${r.id || i}`}
          style={{
            background: "linear-gradient(145deg, #10101f, #0c0c16)",
            border: "1px solid rgba(99, 102, 241, 0.22)",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "14px",
            position: "relative",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }}
        >
          {user && user.uid === r.userId && (
            <button
              onClick={() => handleDeleteReview(r.id)}
              title="Delete review"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.15)",
                color: "#f87171",
                borderRadius: "6px",
                cursor: "pointer",
                padding: "4px 8px",
                fontSize: "10px",
                fontWeight: 600,
                transition: "all 0.15s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.15)";
              }}
            >
              Delete
            </button>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              paddingRight: user && user.uid === r.userId ? "60px" : "0px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={r.userImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop"}
                alt={r.username}
                referrerPolicy="no-referrer"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1.5px solid rgba(99, 102, 241, 0.4)"
                }}
              />
              <div>
                <p style={{ fontSize: "13.5px", fontWeight: 700, color: "#a5b4fc" }}>
                  {r.username} <span style={{ fontSize: "9px", background: "rgba(99, 102, 241, 0.15)", color: "#c7d2fe", padding: "1px 5px", borderRadius: "4px", marginLeft: "6px" }}>LIVEReview</span>
                </p>
                <p style={{ fontSize: "11px", color: "#64748b" }}>
                  {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Stars score={r.score} size={12} />
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 700 }}>
                {r.score}/10
              </span>
            </div>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#e2e8f0",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              margin: 0
            }}
          >
            {r.reviewText}
          </p>
        </div>
      ))}

      {/* Render Jikan API Reviews next */}
      {reviews.map((r, i) => (
        <div
          key={`api-${i}`}
          style={{
            background: "#0f0f1a",
            border: "1px solid #1e1e30",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,#${(((r.user?.username?.charCodeAt(0) || 0) * 1234) % 0xffffff).toString(16).padStart(6, "0")},#8b5cf6)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {r.user?.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p style={{ fontSize: "13.5px", fontWeight: 700, color: "#e2e8f0" }}>
                  {r.user?.username}
                </p>
                <p style={{ fontSize: "11px", color: "#3d4458" }}>
                  {new Date(r.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Stars score={r.reactions?.overall || r.score || 7} size={12} />
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                {r.reactions?.overall || r.score || "?"}/10
              </span>
            </div>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: 1.7,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
            }}
          >
            {r.review}
          </p>
          {r.reactions?.nice && r.reactions.nice > 0 ? (
            <div style={{ marginTop: "10px" }}>
              <span
                style={{
                  fontSize: "11.5px",
                  color: "#3d4458",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Icon name="heart" size={11} /> {r.reactions.nice} found helpful
              </span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

// ─── DETAIL SIDEBAR ──────────────────────────────────────────────────────────
interface DetailSidebarProps {
  anime: Anime;
  score?: number;
}

export const DetailSidebar: React.FC<DetailSidebarProps> = ({ anime, score }) => (
  <div className="w-full lg:w-[248px] shrink-0">
    <div
      className="max-w-[260px] mx-auto lg:max-w-none"
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: "18px",
        border: "1px solid #1e1e30",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      }}
    >
      <img
        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
        alt={anime.title}
        style={{ width: "100%", display: "block" }}
      />
    </div>
    {score != null && (
      <div
        style={{
          background: "#0f0f1a",
          border: "1px solid #1e1e30",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <span style={{ fontSize: "36px", fontWeight: 900, color: "#f1f5f9" }}>{score}</span>
          <div>
            <Stars score={score} size={15} />
            <p style={{ fontSize: "11px", color: "#3d4458", marginTop: "4px" }}>
              {fmt(anime.scored_by)} ratings
            </p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            ["Rank", anime.rank ? `#${anime.rank}` : "N/A"],
            ["Popularity", anime.popularity ? `#${anime.popularity}` : "N/A"],
            ["Members", fmt(anime.members)],
            ["Favorites", fmt(anime.favorites)],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{ background: "#111120", borderRadius: "9px", padding: "8px 10px", textAlign: "center" }}
            >
              <p style={{ fontSize: "10px", color: "#3d4458", marginBottom: "3px", fontWeight: 600 }}>
                {k}
              </p>
              <p style={{ fontSize: "12.5px", fontWeight: 800, color: "#e2e8f0" }}>{v || "N/A"}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {(anime.studios || []).length > 0 && (
      <div
        style={{
          background: "#0f0f1a",
          border: "1px solid #1e1e30",
          borderRadius: "14px",
          padding: "14px",
          marginBottom: "14px",
        }}
      >
        <h4
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#3d4458",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Studio
        </h4>
        {(anime.studios || []).map((s, si) => (
          <div key={`${s.mal_id || 'studio'}-${si}`} style={{ fontSize: "13px", color: "#a5b4fc", fontWeight: 700 }}>
            {s.name}
          </div>
        ))}
      </div>
    )}

    {(anime.genres || []).length > 0 && (
      <div
        style={{
          background: "#0f0f1a",
          border: "1px solid #1e1e30",
          borderRadius: "14px",
          padding: "14px",
          marginBottom: "14px",
        }}
      >
        <h4
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#3d4458",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Genres
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {[...(anime.genres || []), ...(anime.themes || [])].map((g, gi) => (
            <Pill key={`${g.mal_id || 'genre'}-${gi}`} size={11}>
              {g.name}
            </Pill>
          ))}
        </div>
      </div>
    )}

    {(anime.relations || []).length > 0 && (
      <div
        style={{
          background: "#0f0f1a",
          border: "1px solid #1e1e30",
          borderRadius: "14px",
          padding: "14px",
        }}
      >
        <h4
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#3d4458",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Related
        </h4>
        {(anime.relations || []).slice(0, 4).map((rel, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <p
              style={{
                fontSize: "10px",
                color: "#3d4458",
                marginBottom: "2px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {rel.relation}
            </p>
            {(rel.entry || [])
              .filter((e) => e.type === "anime")
              .slice(0, 2)
              .map((e, ei) => (
                <p
                  key={`${e.mal_id || 'rel'}-${ei}`}
                  style={{
                    fontSize: "11.5px",
                    color: "#a5b4fc",
                    marginBottom: "2px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("navAnime", { detail: e.mal_id }))
                  }
                >
                  {e.name}
                </p>
              ))}
          </div>
        ))}
      </div>
    )}
  </div>
);
