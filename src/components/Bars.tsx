import React, { useState, useEffect, useRef } from "react";
import { Anime } from "../types";
import { Icon } from "./Icons";
import { playSound } from "../utils/audio";

// ─── BOTTOM BAR ───────────────────────────────────────────────────────────────
interface BottomBarProps {
  page: string;
  onNav: (id: string, extra?: any) => void;
  watchlist: Anime[];
  isFullscreen?: boolean;
}

export const BottomBar: React.FC<BottomBarProps> = ({ page, onNav, watchlist, isFullscreen = false }) => {
  const nav = [
    { id: "home",      label: "Home",     icon: "home" },
    { id: "explore",   label: "Explore",  icon: "explore" },
    { id: "airing",    label: "Airing",   icon: "airing" },
    { id: "popular",   label: "Popular",  icon: "popular" },
    { id: "movies",    label: "Movies",   icon: "movie" },
    { id: "genres",    label: "Genres",   icon: "genre" },
    { id: "schedule",  label: "Schedule", icon: "schedule" },
    { id: "watchlist", label: "Watchlist",icon: "watchlist" },
    { id: "ecchi",     label: "Ecchi",    icon: "heart", ecchi: true },
    { id: "community", label: "Community",icon: "community" },
  ];
  return (
    <nav
      style={{
        height: "66px",
        background: isFullscreen ? "rgba(8,8,16,0.72)" : "rgba(8,8,16,0.97)",
        borderTop: isFullscreen ? "1px solid rgba(236,72,153,0.15)" : "1px solid #13131e",
        display: "flex",
        alignItems: "stretch",
        flexShrink: 0,
        backdropFilter: "blur(24px)",
        zIndex: 50,
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        position: isFullscreen ? "absolute" : "relative",
        bottom: 0,
        left: 0,
        right: 0,
        boxShadow: isFullscreen ? "0 -8px 30px rgba(0,0,0,0.5)" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        animation: "bottomBarIn 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards",
      }}
    >
      {nav.map((item) => {
        const active = page === item.id;
        const cls = item.ecchi ? "ecchi-bottom-nav-item" : "bottom-nav-item";
        const activeColor = item.ecchi ? "#f472b6" : "#a5b4fc";
        const inactiveColor = item.ecchi ? "#be185d" : "#4a5568";
        return (
          <button
            key={item.id}
            onClick={() => {
              playSound("click");
              onNav(item.id);
            }}
            onMouseEnter={() => playSound("hover")}
            className={cls}
            style={{
              color: active ? activeColor : inactiveColor,
              background: active
                ? item.ecchi
                  ? "linear-gradient(180deg,rgba(236,72,153,0.18),rgba(244,63,94,0.06))"
                  : "linear-gradient(180deg,rgba(99,102,241,0.18),rgba(139,92,246,0.05))"
                : "transparent",
              border: "none",
              fontWeight: active ? 700 : item.ecchi ? 600 : 500,
              position: "relative",
            }}
          >
            {active && (
              <span
                style={{
                  position: "absolute",
                  top: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "18px",
                  height: "2px",
                  borderRadius: "2px",
                  background: item.ecchi ? "#ec4899" : "#6366f1",
                }}
              />
            )}
            <Icon name={item.icon} size={17} color={active ? activeColor : inactiveColor} />
            <span
              style={{
                fontSize: "9.5px",
                letterSpacing: "0.2px",
                lineHeight: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "56px",
                marginTop: "3px",
              }}
            >
              {item.label}
            </span>
            {item.id === "watchlist" && watchlist.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: "8px",
                  lineHeight: 1.6,
                }}
              >
                {watchlist.length > 9 ? "9+" : watchlist.length}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

// ─── DESKTOP SIDEBAR ───────────────────────────────────────────────────────────
interface SidebarProps {
  page: string;
  onNav: (id: string, extra?: any) => void;
  watchlist: Anime[];
}

export const Sidebar: React.FC<SidebarProps> = ({ page, onNav, watchlist }) => {
  const items = [
    { id: "home",      label: "Home",      icon: "home" },
    { id: "explore",   label: "Explore",   icon: "explore" },
    { id: "airing",    label: "Airing Now",icon: "airing" },
    { id: "popular",   label: "Popular",   icon: "popular" },
    { id: "movies",    label: "Movies",    icon: "movie" },
    { id: "schedule",  label: "Schedule",  icon: "schedule" },
    { id: "watchlist", label: "Watchlist", icon: "watchlist" },
    { id: "history",   label: "History",   icon: "history" },
    { id: "ecchi",     label: "Ecchi",     icon: "heart", ecchi: true },
    { id: "community", label: "Community", icon: "community" },
  ];

  return (
    <aside
      style={{
        width: "220px",
        background: "rgba(10,10,18,0.98)",
        borderRight: "1px solid #13131e",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        padding: "18px 12px",
        gap: "6px",
        height: "100%",
        boxSizing: "border-box",
        zIndex: 5,
        backdropFilter: "blur(20px)",
      }}
      className="hidden md:flex"
    >
      <div style={{ padding: "0 12px 14px", borderBottom: "1px solid #13131e", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>O</span>
        </div>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", fontFamily: "'Rajdhani',sans-serif", tracking: "0.5px" }} className="logo-breathe">
            OTAKUHUB
          </h1>
          <p style={{ fontSize: "10px", color: "#4a5568" }}>Anime Portal</p>
        </div>
      </div>

      {items.map((item) => {
        const active = page === item.id;
        const cls = item.ecchi ? "ecchi-nav-item" : "nav-item";
        const actColor = item.ecchi ? "#f472b6" : "#a5b4fc";
        const inactColor = item.ecchi ? "#be185d" : "#64748b";

        return (
          <button
            key={item.id}
            onClick={() => {
              playSound("click");
              onNav(item.id);
            }}
            onMouseEnter={() => playSound("hover")}
            className={cls}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "11px 14px",
              borderRadius: "10px",
              border: "none",
              background: active
                ? item.ecchi
                  ? "rgba(236,72,153,0.1)"
                  : "rgba(99,102,241,0.06)"
                : "transparent",
              color: active ? actColor : inactColor,
              fontWeight: active ? 700 : 500,
              fontSize: "13.5px",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              position: "relative",
              transition: "all 0.15s ease",
            }}
          >
            {active && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  bottom: "20%",
                  width: "3px",
                  borderRadius: "0 4px 4px 0",
                  background: item.ecchi ? "#ec4899" : "#6366f1",
                }}
              />
            )}
            <Icon name={item.icon} size={15} color={active ? actColor : inactColor} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.id === "watchlist" && watchlist.length > 0 && (
              <span
                style={{
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.22)",
                  color: "#a5b4fc",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "8px",
                }}
              >
                {watchlist.length}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
};

// ─── HEADER TOP BAR ────────────────────────────────────────�interface TopBarProps {
interface TopBarProps {
  showBack: boolean;
  onBack: () => void;
  onSearch: (q: string) => void;
  onNav: (tab: string) => void;
  watchlist: Anime[];
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onToggleSettings?: () => void;
  onTyping?: (typing: boolean) => void;
  loading?: boolean;
  currentUser: any;
  onLogin: () => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  showBack,
  onBack,
  onSearch,
  onNav,
  watchlist,
  isFullscreen = false,
  onToggleFullscreen,
  onToggleSettings,
  onTyping,
  loading = false,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [localTyping, setLocalTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length >= 2) {
      setLocalTyping(true);
      onTyping?.(true);
      debounceRef.current = setTimeout(() => {
        onSearch(val.trim());
        setLocalTyping(false);
        onTyping?.(false);
      }, 300);
    } else {
      setLocalTyping(false);
      onTyping?.(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && q.trim()) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onSearch(q.trim());
      setLocalTyping(false);
      onTyping?.(false);
    }
    if (e.key === "Escape") {
      setQ("");
      setFocused(false);
      setLocalTyping(false);
      onTyping?.(false);
      document.getElementById("topbar-search")?.blur();
    }
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("topbar-search")?.focus();
      }
      if (e.key === "F11") {
        e.preventDefault();
        onToggleFullscreen?.();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onToggleFullscreen]);

  return (
    <header
      style={{
        height: "56px",
        background: "rgba(7, 7, 15, 0.4)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "0 10px" : "0 22px",
        gap: isMobile ? "8px" : "14px",
        flexShrink: 0,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        zIndex: 50,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "6px" : "12px" }}>
        {(!showBack || !isMobile) && (
          <div 
            style={{ 
              width: "32px", 
              height: "32px", 
              borderRadius: "8px", 
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer" 
            }} 
            onClick={() => onNav("home")} 
            title="Go to Home"
          >
            <span style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>O</span>
          </div>
        )}
        {showBack && (
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1a1a2e",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "12px",
              padding: isMobile ? "6px 8px" : "6px 12px 6px 9px",
              borderRadius: "8px",
              whiteSpace: "nowrap",
              fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.1)";
              e.currentTarget.style.color = "#a5b4fc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            <Icon name="arrowLeft" size={13} />
            {!isMobile && "Back"}
          </button>
        )}
      </div>

      <div style={{ flex: 1, maxWidth: "540px", position: "relative", margin: "0 auto" }}>
        <div
          style={{
            position: "absolute",
            left: isMobile ? "10px" : "12px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            transition: "opacity 0.15s",
            opacity: focused ? 0.8 : 0.5,
          }}
        >
          {loading || localTyping ? (
            <Icon name="loader" size={13} color="#ec4899" spin />
          ) : (
            <Icon name="search" size={13} color="#6366f1" />
          )}
        </div>
        <input
          id="topbar-search"
          value={q}
          onChange={handleChange}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isMobile ? "Search..." : "Search anime, studio, genre... (⌘K)"}
          style={{
            width: "100%",
            background: focused ? "#111120" : "#0d0d18",
            border: `1px solid ${focused ? "#6366f1" : "#1a1a2e"}`,
            borderRadius: "10px",
            padding: isMobile ? "10px 32px 10px 34px" : "9px 40px 9px 36px",
            color: "#ffffff",
            fontSize: isMobile ? "16px" : "13.5px",
            outline: "none",
            boxSizing: "border-box",
            transition: "all 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
          }}
        />
        {q && (
          <button
            onClick={() => {
              setQ("");
              setLocalTyping(false);
              onTyping?.(false);
            }}
            style={{
              position: "absolute",
              right: isMobile ? "8px" : "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#4a5568",
              display: "flex",
            }}
          >
            <Icon name="x" size={13} />
          </button>
        )}
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px" }}>
        {!isMobile && (
          <button
            className="fs-btn"
            onClick={() => {
              playSound("click");
              onToggleFullscreen?.();
            }}
            title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              background: isFullscreen ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isFullscreen ? "rgba(99,102,241,0.45)" : "#1a1a2e"}`,
              borderRadius: "8px",
              cursor: "pointer",
              color: isFullscreen ? "#a5b4fc" : "#64748b",
            }}
            onMouseEnter={(e) => {
              playSound("hover");
              e.currentTarget.style.background = "rgba(99,102,241,0.14)";
              e.currentTarget.style.color = "#a5b4fc";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isFullscreen ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = isFullscreen ? "#a5b4fc" : "#64748b";
              e.currentTarget.style.borderColor = isFullscreen ? "rgba(99,102,241,0.45)" : "#1a1a2e";
            }}
          >
            <Icon name={isFullscreen ? "minimize" : "maximize"} size={14} />
          </button>
        )}

        {!isMobile && (
          <button
            onClick={() => {
              playSound("success");
              onToggleSettings?.();
            }}
            onMouseEnter={() => playSound("hover")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#f59e0b",
              cursor: "pointer",
              fontSize: "12.5px",
              fontWeight: 700,
              padding: "6px 12px",
              borderRadius: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <Icon name="crown" size={13} color="#f59e0b" /> PRO
          </button>
        )}

        {!isMobile && (
          <div 
            style={{ position: "relative", cursor: "pointer", padding: "4px" }} 
            onClick={() => {
              playSound("click");
              onNav("watchlist");
            }}
            onMouseEnter={() => playSound("hover")}
            title="Watchlist"
          >
            <Icon name="bookmark" size={18} color="#64748b" />
            {watchlist.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  width: "14px",
                  height: "14px",
                  background: "#ef4444",
                  borderRadius: "50%",
                  fontSize: "8px",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {watchlist.length > 9 ? "9+" : watchlist.length}
              </span>
            )}
          </div>
        )}
        
        {!isMobile && (
          <button
            onClick={() => {
              playSound("click");
              onToggleSettings?.();
            }}
            title="Acoustics & App Settings"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1a1a2e",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#64748b",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              playSound("hover");
              e.currentTarget.style.background = "rgba(99,102,241,0.12)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
              e.currentTarget.style.color = "#a5b4fc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "#1a1a2e";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            <Icon name="settings" size={14} />
          </button>
        )}

        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src={currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop"}
              alt={currentUser.displayName || "User"}
              referrerPolicy="no-referrer"
              title={isMobile ? "Settings & Sign Out" : `Logged in as ${currentUser.displayName || currentUser.email}`}
              onClick={() => {
                playSound("click");
                onToggleSettings?.();
              }}
              onMouseEnter={() => playSound("hover")}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "2px solid rgba(99,102,241,0.5)",
                objectFit: "cover"
              }}
            />
            <button
              onClick={() => {
                playSound("click");
                onLogout();
              }}
              title="Sign Out"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#f87171",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                playSound("hover");
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
              }}
            >
              <Icon name="x" size={12} color="#f87171" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              playSound("click");
              onLogin();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12))",
              border: "1px solid rgba(99, 102, 241, 0.35)",
              color: "#a5b4fc",
              fontSize: "12px",
              fontWeight: 700,
              padding: "6px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              playSound("hover");
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(139, 92, 246, 0.22))";
              e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12))";
              e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.35)";
            }}
          >
            <Icon name="community" size={11} color="#a5b4fc" />
            {isMobile ? "Login" : "Sign In"}
          </button>
        )}
      </div>
      {/* Neon glowing line on active processing */}
      {(loading || localTyping) && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #ec4899, #8b5cf6, #6366f1, #ec4899)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite linear",
            boxShadow: "0 0 12px #ec4899, 0 0 4px #6366f1",
          }}
        />
      )}
    </header>
  );
};
