import React, { useState, useEffect } from "react";
import { Anime } from "../types";
import { Icon } from "./Icons";
import { playSound } from "../utils/audio";
interface AnikotoPlayerTabProps {
  anime: Anime;
  isEcchiTheme?: boolean;
}

export const AnikotoPlayerTab: React.FC<AnikotoPlayerTabProps> = ({ anime, isEcchiTheme = false }) => {
  const [activeEp, setActiveEp] = useState(1);
  const [sourceType, setSourceType] = useState<"mal_id" | "mal" | "id" | "anilist_id">("mal_id");
  const [copied, setCopied] = useState(false);
  const [episodeRangeIdx, setEpisodeRangeIdx] = useState(0);

  const totalEp = anime.episodes || 12; // Fallback to 12 if unknown / continuous

  // Determine pagination chunking for layout safety (max 24 buttons per window)
  const EPISODES_PER_PAGE = 24;
  const numPages = Math.ceil(totalEp / EPISODES_PER_PAGE);

  // Generate the active embed URL based on parameter configurations
  const getEmbedUrl = () => {
    const base = "https://megaplay.buzz/stream/s-2/";
    switch (sourceType) {
      case "mal_id":
        return `${base}?mal_id=${anime.mal_id}&ep=${activeEp}`;
      case "mal":
        return `${base}?mal=${anime.mal_id}&ep=${activeEp}`;
      case "id":
        return `${base}?id=${anime.mal_id}&ep=${activeEp}`;
      case "anilist_id":
        return `${base}?anilist_id=${anime.mal_id}&ep=${activeEp}`;
    }
  };

  const activeUrl = getEmbedUrl();

  const handleCopyEmbedCode = () => {
    const iframeCode = `<iframe src="${activeUrl}" width="100%" height="450px" frameborder="0" allowfullscreen referrerpolicy="no-referrer"></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    playSound("success");
    setTimeout(() => setCopied(false), 2500);
  };

  const selectSource = (src: "mal_id" | "mal" | "id" | "anilist_id") => {
    playSound("click");
    setSourceType(src);
  };

  const selectEpisode = (epNum: number) => {
    playSound("navigation");
    setActiveEp(epNum);
  };

  // Build the array of active episodes inside the current range page
  const startEp = episodeRangeIdx * EPISODES_PER_PAGE + 1;
  const endEp = Math.min(startEp + EPISODES_PER_PAGE - 1, totalEp);
  const epButtons = [];
  for (let i = startEp; i <= endEp; i++) {
    epButtons.push(i);
  }

  return (
    <div 
      className="space-y-6 animate-fadeIn" 
      style={{
        animation: "fadeIn 0.4s ease-out both"
      }}
    >
      {/* Informational Header */}
      <div 
        style={{
          background: isEcchiTheme 
            ? "linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(244, 63, 94, 0.04))" 
            : "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.04))",
          border: `1px solid ${isEcchiTheme ? "rgba(236, 72, 153, 0.2)" : "rgba(99, 102, 241, 0.2)"}`,
          borderRadius: "16px",
          padding: "16px 20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span 
              style={{
                fontSize: "9px",
                fontWeight: 900,
                color: "#fff",
                background: isEcchiTheme ? "linear-gradient(90deg, #ec4899, #f43f5e)" : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                padding: "2px 8px",
                borderRadius: "4px",
                letterSpacing: "1px",
                textTransform: "uppercase"
              }}
            >
              Anikoto Player
            </span>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 750, display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto Next Play Active
            </span>
          </div>
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#fff", fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase" }}>
            Currently Playing: {anime.title} (Episode {activeEp})
          </h3>
          <p style={{ fontSize: "11px", color: isEcchiTheme ? "#f472b6" : "#94a3b8", fontWeight: 500, marginTop: "1px" }}>
            Streams powered globally by the Megaplay CDN. Switch sources below if the default player does not respond.
          </p>
        </div>

        <div 
          style={{
            background: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            color: "#a5b4fc",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "11px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Icon name="movie" size={13} color="#818cf8" />
          <span>HD Multi-Source Stream</span>
        </div>
      </div>

      {/* Main player viewport + source side layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", lgGridTemplateColumns: "1fr", gap: "24px" }}>
        
        {/* Aspect Ratio 16:9 Stage Area */}
        <div className="space-y-4">
          <div 
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%", /* 16:9 aspect ratio */
              background: "#020205",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              overflow: "hidden",
              boxShadow: isEcchiTheme 
                ? "0 25px 60px -15px rgba(236, 72, 153, 0.15), 0 0 35px rgba(236, 72, 153, 0.04)" 
                : "0 25px 60px -15px rgba(99, 102, 241, 0.15), 0 0 35px rgba(99, 102, 241, 0.04)"
            }}
          >
            <iframe 
              src={activeUrl}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                background: "#010103"
              }}
              allowFullScreen
              referrerPolicy="no-referrer"
              scrolling="no"
              title={`${anime.title} Episode ${activeEp} Playback Stream`}
            />
          </div>

          {/* Source Selectors */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
              Playback Servers:
            </span>
            {[
              { id: "mal_id", label: "Server Alpha", badge: "MAL Index" },
              { id: "mal", label: "Server Beta", badge: "Query MAL" },
              { id: "id", label: "Server Gamma", badge: "Legacy ID" },
              { id: "anilist_id", label: "Server Delta", badge: "AniList" }
            ].map((srv) => {
              const active = sourceType === srv.id;
              return (
                <button
                  key={srv.id}
                  onClick={() => selectSource(srv.id as any)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: active 
                      ? (isEcchiTheme ? "rgba(236,72,153,0.14)" : "rgba(99,102,241,0.14)") 
                      : "rgba(255,255,255,0.02)",
                    border: active 
                      ? `1px solid ${isEcchiTheme ? "#ec4899" : "#6366f1"}` 
                      : "1px solid rgba(255,255,255,0.05)",
                    color: active ? (isEcchiTheme ? "#ec4899" : "#a5b4fc") : "#94a3b8",
                    fontSize: "11px",
                    fontWeight: active ? 800 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s"
                  }}
                  className="hover:scale-103 active:scale-97"
                >
                  <Icon name="zap" size={10} color={active ? (isEcchiTheme ? "#ec4899" : "#818cf8") : "#475569"} />
                  <span>{srv.label}</span>
                  <span 
                    style={{ 
                      fontSize: "8px", 
                      opacity: 0.65, 
                      background: "rgba(255,255,255,0.06)", 
                      padding: "1px 4px", 
                      borderRadius: "3px" 
                    }}
                  >
                    {srv.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Episode grid selection (Bento Panel) */}
      <div 
        style={{
          background: "rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "18px",
          padding: "20px"
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon name="tv" size={13} color={isEcchiTheme ? "#ec4899" : "#818cf8"} />
              Select Playback Episode
            </h4>
            <p style={{ fontSize: "11px", color: "#64748b" }}>Choose an episode to load directly into the streaming engine.</p>
          </div>

          {/* Range pagination triggers for standard/long running series */}
          {numPages > 1 && (
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: numPages }).map((_, rIdx) => {
                const rStart = rIdx * EPISODES_PER_PAGE + 1;
                const rEnd = Math.min(rStart + EPISODES_PER_PAGE - 1, totalEp);
                const activeRange = episodeRangeIdx === rIdx;
                return (
                  <button
                    key={rIdx}
                    onClick={() => {
                      playSound("click");
                      setEpisodeRangeIdx(rIdx);
                    }}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: activeRange 
                        ? (isEcchiTheme ? "rgba(236,72,153,0.1)" : "rgba(99,102,241,0.1)") 
                        : "rgba(255,255,255,0.01)",
                      border: `1px solid ${activeRange ? (isEcchiTheme ? "#ec4899" : "#6366f1") : "rgba(255,255,255,0.04)"}`,
                      color: activeRange ? "#fff" : "#64748b",
                      fontSize: "10.5px",
                      fontWeight: activeRange ? 700 : 500,
                      cursor: "pointer"
                    }}
                  >
                    {rStart}-{rEnd}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Target Buttons Grid */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(46px, 1fr))",
            gap: "8px"
          }}
        >
          {epButtons.map((epNum) => {
            const active = activeEp === epNum;
            return (
              <button
                key={epNum}
                onClick={() => selectEpisode(epNum)}
                style={{
                  height: "40px",
                  borderRadius: "10px",
                  background: active 
                    ? `linear-gradient(135deg, ${isEcchiTheme ? "#ec4899, #f43f5e" : "#6366f1, #8b5cf6"})` 
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.05)"}`,
                  color: active ? "#fff" : "#e2e8f0",
                  fontSize: "12px",
                  fontWeight: active ? 900 : 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: active 
                    ? `0 4px 10px ${isEcchiTheme ? "rgba(236,72,153,0.3)" : "rgba(99,102,241,0.3)"}` 
                    : "none",
                  transition: "all 0.15s"
                }}
                className="hover:scale-105 hover:bg-white/5 active:scale-95"
              >
                {epNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Website Embed Code Generator Console */}
      <div 
        style={{
          background: "linear-gradient(135deg, rgba(16, 16, 28, 0.5), rgba(8, 8, 16, 0.7))",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "18px",
          padding: "20px"
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="share" size={13} color="#f59e0b" />
              Embed Video Player in your Website
            </h4>
            <p style={{ fontSize: "11.5px", color: "#64748b", marginTop: "1px" }}>
              Fully compatible with HTML5, WordPress, Blogger, and custom CMS. Copy the code below directly into your code editor.
            </p>
          </div>
          <button
            onClick={handleCopyEmbedCode}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              background: copied 
                ? "rgba(16, 185, 129, 0.12)" 
                : (isEcchiTheme ? "rgba(236,72,153,0.1)" : "rgba(99,102,241,0.1)"),
              border: `1px solid ${copied ? "#10b981" : (isEcchiTheme ? "#ec4899" : "#6366f1")}`,
              color: copied ? "#10b981" : "#fff",
              fontSize: "11px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Icon name={copied ? "check" : "share"} size={11} />
            <span>{copied ? "Copied Successful!" : "Copy Iframe Code"}</span>
          </button>
        </div>

        {/* Readable XML / HTML Code preview */}
        <div 
          style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.03)",
            borderRadius: "12px",
            padding: "14px",
            fontFamily: "monospace",
            fontSize: "11.5px",
            color: "#67e8f9",
            overflowX: "auto",
            lineHeight: "1.5",
            whiteSpace: "pre-wrap"
          }}
        >
          {`<iframe src="${activeUrl}" width="100%" height="450px" frameborder="0" allowfullscreen referrerpolicy="no-referrer"></iframe>`}
        </div>

        {/* Integration details checklist */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "12px", 
            marginTop: "16px", 
            borderTop: "1px solid rgba(255,255,255,0.03)", 
            paddingTop: "14px" 
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "#34d399", fontSize: "12px" }}>✔</span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              <strong>Adaptive sizing</strong>: 100% width conforms seamlessly to responsive rows.
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "#34d399", fontSize: "12px" }}>✔</span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              <strong>No-Referrer Policy</strong>: Bypass strict sandbox blocks.
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "#34d399", fontSize: "12px" }}>✔</span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              <strong>Ad-Block compatibility</strong>: Paired with premium toggles.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
