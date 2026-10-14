import React, { useState } from "react";
import { Anime } from "../types";
import { Icon } from "./Icons";

interface TrailerEmbedProps {
  anime: Anime;
}

export const TrailerEmbed: React.FC<TrailerEmbedProps> = ({ anime }) => {
  const [show, setShow] = useState(false);
  const [imgError, setImgError] = useState(false);

  const ytId = anime?.trailer?.youtube_id;
  const thumb =
    anime?.trailer?.images?.maximum_image_url ||
    anime?.trailer?.images?.large_image_url ||
    (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null);
  const embedUrl = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`
    : null;

  if (!ytId) {
    return (
      <div
        style={{
          background: "#0f0f1a",
          border: "1px solid #1e1e30",
          borderRadius: "14px",
          padding: "40px",
          textAlign: "center",
          marginBottom: "22px",
        }}
      >
        <div style={{ display: "inline-flex", marginBottom: "14px" }}>
          <Icon name="play" size={40} color="#1e1e30" />
        </div>
        <p style={{ color: "#3d4458", fontSize: "13px", fontWeight: 600 }}>
          No trailer available for this anime
        </p>
        <p style={{ color: "#2d3748", fontSize: "11.5px", marginTop: "6px" }}>
          Trailer data is sourced from MyAnimeList via Jikan API
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: "linear-gradient(135deg,#ef4444,#b91c1c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="play" size={16} color="#fff" />
        </div>
        <div>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 800,
              color: "#f1f5f9",
              fontFamily: "'Rajdhani',sans-serif",
            }}
          >
            Official Trailer
          </h3>
          <p style={{ fontSize: "11px", color: "#3d4458" }}>
            via YouTube · Free · No login required
          </p>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #1e1e30",
          background: "#000",
          aspectRatio: "16/9",
          cursor: show ? "default" : "pointer",
        }}
        onClick={() => !show && setShow(true)}
      >
        {!show ? (
          <>
            {thumb && !imgError ? (
              <img
                src={thumb}
                alt="Trailer thumbnail"
                onError={() => setImgError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "brightness(0.75)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg,#1a0533,#16213e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "48px" }}>🎬</span>
              </div>
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.92)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 0 0 6px rgba(239,68,68,0.25), 0 8px 32px rgba(0,0,0,0.7)",
                  transition: "transform 0.2s",
                  animation: "glowPulse 2s ease-in-out infinite",
                }}
              >
                <svg viewBox="0 0 24 24" width={28} height={28} fill="#fff">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(8px)",
                borderRadius: "8px",
                padding: "4px 10px",
              }}
            >
              <span style={{ fontSize: "11.5px", color: "#e2e8f0", fontWeight: 600 }}>
                ▶ Click to play trailer
              </span>
            </div>
          </>
        ) : (
          embedUrl && (
            <iframe
              src={embedUrl}
              title={`${anime?.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          )
        )}
      </div>
      {show && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <a
            href={`https://www.youtube.com/watch?v=${ytId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11.5px",
              color: "#6366f1",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
            }}
          >
            <Icon name="externalLink" size={11} /> Open on YouTube
          </a>
        </div>
      )}
    </div>
  );
};
export default TrailerEmbed;
