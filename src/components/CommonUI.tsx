import React, { useMemo } from "react";
import { Icon } from "./Icons";

// ─── SKELETON PLACEHOLDERS ──────────────────────────────────────────────────
interface SkeletonProps {
  w?: string | number;
  h?: string | number;
  r?: number;
  mb?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  w = "100%",
  h = 16,
  r = 6,
  mb = 0,
}) => {
  const widthVal = typeof w === "number" ? `${w}px` : w;
  const heightVal = typeof h === "number" ? `${h}px` : h;
  return (
    <div
      style={{
        width: widthVal,
        height: heightVal,
        borderRadius: `${r}px`,
        background: "linear-gradient(90deg, #0f0f1a 25%, #1a1a2e 50%, #0f0f1a 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        marginBottom: `${mb}px`,
        flexShrink: 0,
      }}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div
    style={{
      borderRadius: "10px",
      overflow: "hidden",
      aspectRatio: "2/3",
      background: "#0f0f1a",
    }}
  >
    <Skeleton w="100%" h="100%" r={0} />
  </div>
);

// ─── TOAST MESSAGES ──────────────────────────────────────────────────────────
interface ToastProps {
  msg: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ msg, type = "info", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 2400);
    return () => clearTimeout(timer);
  }, [onClose]);

  const borderBgColor =
    type === "success"
      ? { border: "1px solid #10b981", bg: "rgba(6, 78, 59, 0.95)", iconColor: "#10b981" }
      : type === "error"
        ? { border: "1px solid #ef4444", bg: "rgba(69, 10, 10, 0.95)", iconColor: "#ef4444" }
        : { border: "1px solid #6366f1", bg: "rgba(30, 26, 46, 0.95)", iconColor: "#a5b4fc" };

  return (
    <div
      className="slide-up"
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 9999,
        background: borderBgColor.bg,
        border: borderBgColor.border,
        borderRadius: "12px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: "280px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        backdropFilter: "blur(16px)",
      }}
    >
      <Icon
        name={type === "success" ? "check" : type === "error" ? "x" : "info"}
        size={16}
        color={borderBgColor.iconColor}
      />
      <span style={{ fontSize: "13.5px", color: "#e2e8f0", flex: 1, fontWeight: 500 }}>
        {msg}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#64748b",
          padding: "2px",
          display: "flex",
        }}
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
};

// ─── STARS RATING ──────────────────────────────────────────────────────────
interface StarsProps {
  score: number;
  size?: number;
}

export const Stars: React.FC<StarsProps> = ({ score, size = 13 }) => {
  const rating = Math.round((score / 10) * 5 * 2) / 2;
  return (
    <span style={{ display: "inline-flex", gap: "1.5px" }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rating);
        const half = !filled && i - 0.5 === rating;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "#f59e0b" : half ? "url(#half_star)" : "#1e2235"}
            stroke={filled || half ? "#f59e0b" : "#2d3748"}
            strokeWidth="1.5"
            style={{ display: "inline-block" }}
          >
            <defs>
              <linearGradient id="half_star">
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </span>
  );
};

// ─── PILL BADGE ──────────────────────────────────────────────────────────────
interface PillProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
}

export const Pill: React.FC<PillProps> = ({ children, color = "#6366f1", size = 12 }) => (
  <span
    style={{
      background: `${color}15`,
      border: `1px solid ${color}35`,
      color: "#c4b5fd",
      padding: "4px 11px",
      borderRadius: "10px",
      fontSize: `${size}px`,
      display: "inline-block",
      fontWeight: 600,
      whiteSpace: "nowrap",
      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    }}
    className="hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:border-indigo-400/50 hover:bg-indigo-600/20 active:scale-95 cursor-pointer"
  >
    {children}
  </span>
);

// ─── PARTICLE BACKGROUNDS ─────────────────────────────────────────────────────
export const Particles: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 3.5 + 1,
        dur: Math.random() * 18 + 14,
        delay: Math.random() * 12,
        color:
          i % 4 === 0
            ? "#6366f1"
            : i % 4 === 1
              ? "#8b5cf6"
              : i % 4 === 2
                ? "#a855f7"
                : "#ec4899",
      })),
    []
  );

  const orbs = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        left: `${15 + i * 22}%`,
        top: `${20 + (i % 2) * 40}%`,
        size: 180 + i * 60,
        color: i % 2 === 0 ? "rgba(99, 102, 241, 0.03)" : "rgba(168, 85, 247, 0.025)",
        dur: 12 + i * 3,
        delay: i * 2.5,
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
          key={`orb-${o.id}`}
          style={{
            position: "absolute",
            left: o.left,
            top: o.top,
            width: `${o.size}px`,
            height: `${o.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            animation: `driftY ${o.dur}s ${o.delay}s ease-in-out infinite`,
            filter: "blur(40px)",
          }}
        />
      ))}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.left,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: p.color,
            opacity: 0.45,
            animation: `particleFloat ${p.dur}s ${p.delay}s linear infinite`,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </div>
  );
};

// ─── PREMIUM SETTINGS MODAL WITH SYNTHESIZED SOUND CONTROLS ─────────────────
import { useState, useEffect } from "react";
import { getSoundSettings, updateSoundSettings, playSound } from "../utils/audio";

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [preset, setPreset] = useState<"cyberpunk" | "minimal" | "ambient">("minimal");

  const [appId, setAppId] = useState("ca-app-pub-2489206133174145~6314022285");
  const [adUnitId, setAdUnitId] = useState("ca-app-pub-2489206133174145/2150204540");
  const [copiedId, setCopiedId] = useState<"app" | "unit" | null>(null);
  const [revenue, setRevenue] = useState("0.00");

  const [isPremium, setIsPremium] = useState(false);
  const [adOptOut, setAdOptOut] = useState(false);

  // Load sound settings and AdMob credentials initially
  useEffect(() => {
    const s = getSoundSettings();
    setEnabled(s.soundEnabled);
    setVolume(s.soundVolume);
    setPreset(s.soundPreset);

    const savedAppId = localStorage.getItem("admob_app_id");
    const savedAdUnitId = localStorage.getItem("admob_ad_unit_id");
    const savedRevenue = localStorage.getItem("admob_sim_revenue") || "0.00";
    if (savedAppId) setAppId(savedAppId);
    if (savedAdUnitId) setAdUnitId(savedAdUnitId);
    setRevenue(parseFloat(savedRevenue).toFixed(2));

    const savedPremium = localStorage.getItem("user_is_premium") === "true";
    const savedAdOptOut = localStorage.getItem("ad_opt_out") === "true";
    setIsPremium(savedPremium);
    setAdOptOut(savedAdOptOut);
  }, []);

  const handlePremiumToggle = (val: boolean) => {
    setIsPremium(val);
    localStorage.setItem("user_is_premium", val ? "true" : "false");
    window.dispatchEvent(new Event("settings_changed"));
    window.dispatchEvent(new Event("admob_changed"));
    if (enabled) {
      playSound(val ? "success" : "click");
    }
  };

  const handleOptOutToggle = (val: boolean) => {
    setAdOptOut(val);
    localStorage.setItem("ad_opt_out", val ? "true" : "false");
    window.dispatchEvent(new Event("settings_changed"));
    window.dispatchEvent(new Event("admob_changed"));
    if (enabled) {
      playSound("click");
    }
  };

  const handleCopyId = (text: string, type: "app" | "unit") => {
    if (enabled) playSound("success");
    navigator.clipboard.writeText(text);
    setCopiedId(type);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggle = (val: boolean) => {
    setEnabled(val);
    updateSoundSettings(val, volume, preset);
    if (val) {
      setTimeout(() => playSound("click"), 50);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    updateSoundSettings(enabled, val, preset);
  };

  const handleVolumeMouseUp = () => {
    if (enabled) {
      playSound("click");
    }
  };

  const handlePresetSelect = (p: "cyberpunk" | "minimal" | "ambient") => {
    setPreset(p);
    updateSoundSettings(enabled, volume, p);
    // Instant live preview of the profile's click and chime tone!
    setTimeout(() => {
      playSound("navigation");
    }, 50);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(3, 3, 7, 0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.25s ease-out both",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (enabled) playSound("click");
          onClose();
        }
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "linear-gradient(135deg, rgba(16, 16, 28, 0.95), rgba(8, 8, 16, 0.98))",
          border: "1px solid rgba(99, 102, 241, 0.22)",
          borderRadius: "24px",
          padding: "28px",
          position: "relative",
          boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.08)",
          animation: "scaleIn 0.3s cubic-bezier(0.34, 1.3, 0.64, 1) both",
        }}
        className="settings-modal-card"
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #c084fc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 15px rgba(99, 102, 241, 0.35)",
              }}
            >
              <Icon name="settings" size={18} color="#fff" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 900,
                  color: "#fff",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                App Settings
              </h3>
              <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>
                Personalize your otaku portal audio & experience
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (enabled) playSound("click");
              onClose();
            }}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              cursor: "pointer",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              transition: "all 0.2s",
            }}
            className="hover:scale-105 active:scale-95 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* Enabled State Switcher */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            transition: "all 0.3s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: enabled ? "rgba(16, 185, 129, 0.1)" : "rgba(148, 163, 184, 0.06)",
                border: `1px solid ${enabled ? "rgba(16, 185, 129, 0.22)" : "rgba(148, 163, 184, 0.12)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: enabled ? "#10b981" : "#64748b",
              }}
            >
              <Icon name="music" size={15} />
            </div>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#fff" }}>
                UI Sfx & Acoustics
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Toggle responsive digital sound feedback
              </div>
            </div>
          </div>
          <button
            onClick={() => handleToggle(!enabled)}
            style={{
              width: "48px",
              height: "24px",
              borderRadius: "12px",
              background: enabled ? "linear-gradient(90deg, #6366f1, #8b5cf6)" : "#1e1e2d",
              border: `1px solid ${enabled ? "#6366f1" : "rgba(255,255,255,0.06)"}`,
              position: "relative",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              padding: "0 2px",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                background: "white",
                borderRadius: "50%",
                boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                transform: enabled ? "translateX(24px)" : "translateX(0px)",
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </button>
        </div>

        {/* Volume Intensity Slider */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
            opacity: enabled ? 1 : 0.45,
            pointerEvents: enabled ? "auto" : "none",
            transition: "all 0.3s",
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
              <Icon name="volume" size={15} color="#a5b4fc" />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0" }}>
                Acoustic Intensity
              </span>
            </div>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "monospace",
                color: "#c084fc",
                fontWeight: 700,
                background: "rgba(192, 132, 252, 0.08)",
                padding: "1px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(192, 132, 252, 0.15)",
              }}
            >
              {Math.round(volume * 100)}%
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Icon name="mute" size={13} color="#475569" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              onMouseUp={handleVolumeMouseUp}
              onTouchEnd={handleVolumeMouseUp}
              style={{
                flex: 1,
                accentColor: "#6366f1",
                height: "5px",
                borderRadius: "3px",
                background: "rgba(255,255,255,0.08)",
                cursor: "pointer",
              }}
            />
            <Icon name="volume" size={13} color="#8b5cf6" />
          </div>
        </div>

        {/* Acoustic Preset Bento Selection */}
        <div
          style={{
            opacity: enabled ? 1 : 0.45,
            pointerEvents: enabled ? "auto" : "none",
            transition: "all 0.3s",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#94a3b8",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Icon name="sliders" size={13} color="#a5b4fc" />
            Acoustic Archetype Profiles
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            {[
              {
                id: "minimal",
                label: "Sleek Minimalist",
                description: "Crisp, elegant, ultra-subtle micro-clicks",
                accent: "#6366f1",
              },
              {
                id: "cyberpunk",
                label: "Cyberpunk Digital",
                description: "8-bit energized pulse triggers",
                accent: "#ec4899",
              },
              {
                id: "ambient",
                label: "Warm Resonance",
                description: "Deep, organic movie-grade frequencies",
                accent: "#f59e0b",
              },
            ].map((p) => {
              const active = preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(p.id as any)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                    padding: "12px 16px",
                    background: active
                      ? `linear-gradient(135deg, rgba(255,255,255,0.03), ${p.accent}07)`
                      : "rgba(255,255,255,0.01)",
                    border: active
                      ? `1px solid ${p.accent}50`
                      : "1px solid rgba(255, 255, 255, 0.04)",
                    borderRadius: "14px",
                    cursor: "pointer",
                    width: "100%",
                    transition: "all 0.25s",
                    boxShadow: active ? `0 4px 15px ${p.accent}10` : "none",
                  }}
                  className="preset-bento-btn"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      marginBottom: "3px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: active ? 800 : 600,
                        color: active ? p.accent : "#e2e8f0",
                      }}
                    >
                      {p.label}
                    </span>
                    {active && (
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: p.accent,
                          boxShadow: `0 0 8px ${p.accent}`,
                        }}
                      />
                    )}
                  </div>
                  <span style={{ fontSize: "11px", color: active ? "#cbd5e1" : "#64748b" }}>
                    {p.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Premium & Consent Hub */}
        <div
          style={{
            background: "rgba(251, 191, 36, 0.02)",
            border: "1px solid rgba(251, 191, 36, 0.12)",
            borderRadius: "16px",
            padding: "16px",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <Icon name="crown" size={15} color="#fbbf24" />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Otaku Premium Privileges
            </span>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {/* Premium Status Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", display: "block" }}>
                  Membership Status: {isPremium ? "Premium Active" : "Standard"}
                </span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>
                  Unlock exclusive interfaces and permanently disable sponsor ads
                </span>
              </div>
              <button
                onClick={() => handlePremiumToggle(!isPremium)}
                style={{
                  width: "48px",
                  height: "24px",
                  borderRadius: "12px",
                  background: isPremium ? "linear-gradient(90deg, #fbbf24, #f59e0b)" : "#1e1e2d",
                  border: `1px solid ${isPremium ? "#fbbf24" : "rgba(255,255,255,0.06)"}`,
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  padding: "0 2px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    background: "white",
                    borderRadius: "50%",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                    transform: isPremium ? "translateX(24px)" : "translateX(0px)",
                    transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </button>
            </div>

            {/* Ad Opt-out Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "12px" }}>
              <div>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", display: "block" }}>
                  Opt-Out of Campaigns
                </span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>
                  Bypass sponsored placements on streaming channels
                </span>
              </div>
              <button
                onClick={() => handleOptOutToggle(!adOptOut)}
                style={{
                  width: "48px",
                  height: "24px",
                  borderRadius: "12px",
                  background: adOptOut ? "linear-gradient(90deg, #f43f5e, #be185d)" : "#1e1e2d",
                  border: `1px solid ${adOptOut ? "#f43f5e" : "rgba(255,255,255,0.06)"}`,
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  padding: "0 2px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    background: "white",
                    borderRadius: "50%",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                    transform: adOptOut ? "translateX(24px)" : "translateX(0px)",
                    transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* AdMob Monetization Hub */}
        <div
          style={{
            background: "rgba(99, 102, 241, 0.03)",
            border: "1px solid rgba(99, 102, 241, 0.12)",
            borderRadius: "16px",
            padding: "16px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icon name="crown" size={15} color="#fbbf24" style={{ display: "inline-block" }} />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                AdMob SDK Integration
              </span>
            </div>
            <span
              style={{
                fontSize: "10px",
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.08)",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(16, 185, 129, 0.15)",
                fontWeight: 700,
              }}
            >
              ACTIVE
            </span>
          </div>

          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "12px", lineHeight: "1.4" }}>
            Map your AdMob identifier configurations to trigger responsive banner placements.
          </div>

          <div style={{ display: "grid", gap: "8px", marginBottom: "12px" }}>
            <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ fontSize: "9px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>AdMob App ID</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                <code style={{ fontSize: "10.5px", color: "#cbd5e1", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {appId}
                </code>
                <button 
                  onClick={() => handleCopyId(appId, "app")}
                  style={{ background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", color: "#a5b4fc" }}
                >
                  {copiedId === "app" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ fontSize: "9px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Banner Ad Unit ID</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                <code style={{ fontSize: "10.5px", color: "#cbd5e1", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {adUnitId}
                </code>
                <button 
                  onClick={() => handleCopyId(adUnitId, "unit")}
                  style={{ background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", color: "#a5b4fc" }}
                >
                  {copiedId === "unit" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#64748b" }}>
            <span>Est. Simulated Revenue: <strong style={{ color: "#34d399", fontFamily: "monospace" }}>${revenue} USD</strong></span>
            <button 
              onClick={() => {
                if (enabled) playSound("click");
                const newEp = prompt("Enter new AdMob App ID:", appId);
                if (newEp !== null && newEp.trim() !== "") {
                  localStorage.setItem("admob_app_id", newEp.trim());
                  setAppId(newEp.trim());
                  window.dispatchEvent(new Event("admob_changed"));
                }
                const newEu = prompt("Enter new AdMob Banner Ad Unit ID:", adUnitId);
                if (newEu !== null && newEu.trim() !== "") {
                  localStorage.setItem("admob_ad_unit_id", newEu.trim());
                  setAdUnitId(newEu.trim());
                  window.dispatchEvent(new Event("admob_changed"));
                }
              }}
              style={{ background: "none", border: "none", color: "#818cf8", fontWeight: 750, cursor: "pointer" }}
            >
              ✏️ Configure IDs
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(255, 255, 255, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Icon name="shield" size={11} color="#10b981" />
            <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 500 }}>
              Auto-saved Local Settings
            </span>
          </div>
          <button
            onClick={() => {
              if (enabled) playSound("success");
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "10.5px",
              color: "#a5b4fc",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            className="hover:underline"
          >
            Play Jingle ⚡
          </button>
        </div>
      </div>
    </div>
  );
};

