import { useState, useEffect, useRef, useCallback } from "react";
import { Anime, NavigationState, ToastConfig } from "./types";
import { getAgeVerified, addToHistory, getWL } from "./utils/jikan";

// ─── modular imports ─────────────────────────────────────────────────────────
import { Particles, Toast, SettingsModal } from "./components/CommonUI";
import { AgeGate } from "./components/EcchiElements";
import { TopBar, Sidebar, BottomBar } from "./components/Bars";
import { HomePage } from "./components/HomePage";
import { EcchiPage } from "./components/EcchiPage";
import { DetailPage } from "./components/DetailPage";
import { EcchiDetailPage } from "./components/EcchiDetailPage";
import { BrowsePage, SearchPage } from "./components/BrowsePages";
import { playSound } from "./utils/audio";

// ─── firebase integration imports ───────────────────────────────────────────
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "./utils/firebase";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [browseMode, setBrowseMode] = useState("explore");
  const [genreFilter, setGenreFilter] = useState<{ id: number; name: string; color: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [watchlist, setWatchlist] = useState<Anime[]>(() => getWL());

  const handleLoadingChange = useCallback((isLoading: boolean) => {
    setSearchLoading(isLoading);
  }, []);
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [ecchiAgeVerified, setEcchiAgeVerified] = useState(getAgeVerified());
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Navigation history stack for smart back button
  const navStack = useRef<NavigationState[]>([]);

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Monitor Auth state changes
  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        
        if (db) {
          const userRef = doc(db, "users", user.uid);
          setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            updatedAt: serverTimestamp()
          }, { merge: true }).catch((err) => {
            handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
          });
        }
      } else {
        setCurrentUser(null);
        setWatchlist(getWL());
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time synchronization of watchlist from Cloud Firestore
  useEffect(() => {
    if (!currentUser || !db) return;

    const watchlistRef = collection(db, "users", currentUser.uid, "watchlist");
    const unsubscribeWatchlist = onSnapshot(watchlistRef, (snapshot) => {
      const items: Anime[] = [];
      snapshot.forEach((snapDoc) => {
        const data = snapDoc.data();
        items.push({
          mal_id: Number(data.mal_id),
          title: data.title,
          images: {
            jpg: {
              image_url: data.image_url,
              large_image_url: data.image_url
            }
          }
        } as Anime);
      });
      setWatchlist(items);
      // Dispatch global watchlist updates for observers
      window.dispatchEvent(new Event("wl_update"));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}/watchlist`);
    });

    return () => unsubscribeWatchlist();
  }, [currentUser]);

  // Fullscreen change listener to sync state with browser API
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ESC key closes detail/search views and pops navigation history
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (page === "detail" || page === "ecchiDetail" || page === "search")) {
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page, browseMode, genreFilter]);

  // Premium synthesized sound trigger on page transition
  useEffect(() => {
    if (navStack.current.length > 0) {
      playSound("navigation");
    }
  }, [page, browseMode]);

  // Handle global detail navigation requests from deeply nested related listings
  useEffect(() => {
    const handleNavAnime = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setSelectedId(customEvent.detail);
      navStack.current.push({ page, browseMode, genreFilter });
      setPage("detail");
    };
    const handleNavEcchi = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setSelectedId(customEvent.detail);
      navStack.current.push({ page, browseMode, genreFilter });
      setPage("ecchiDetail");
    };

    window.addEventListener("navAnime", handleNavAnime);
    window.addEventListener("navEcchi", handleNavEcchi);
    return () => {
      window.removeEventListener("navAnime", handleNavAnime);
      window.removeEventListener("navEcchi", handleNavEcchi);
    };
  }, [page, browseMode, genreFilter]);

  // Navigate back to history stack or default back to homepage
  const handleBack = useCallback(() => {
    const prev = navStack.current.pop();
    if (prev) {
      setPage(prev.page);
      if (prev.browseMode) setBrowseMode(prev.browseMode);
      if (prev.genreFilter !== undefined) setGenreFilter(prev.genreFilter);
    } else {
      setPage("home");
    }
  }, []);

  // Display custom notifications messages
  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ msg, type });
    if (type === "success") {
      playSound("success");
    } else {
      playSound("click");
    }
  }, []);

  // Toggle watchlist logic
  const toggleWatchlist = useCallback((anime: Anime) => {
    if (auth.currentUser) {
      const animeIdStr = String(anime.mal_id);
      const docRef = doc(db, "users", auth.currentUser.uid, "watchlist", animeIdStr);
      const exists = watchlist.some((w) => w.mal_id === anime.mal_id);
      if (exists) {
        deleteDoc(docRef)
          .then(() => showToast(`Removed "${anime.title}" from watchlist`, "info"))
          .catch((err) => handleFirestoreError(err, OperationType.DELETE, `users/${auth.currentUser?.uid}/watchlist/${animeIdStr}`));
      } else {
        const imgUrl = anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url || "";
        setDoc(docRef, {
          mal_id: Number(anime.mal_id),
          title: anime.title || "",
          image_url: imgUrl,
          addedAt: serverTimestamp()
        })
          .then(() => showToast(`Added "${anime.title}" to watchlist!`, "success"))
          .catch((err) => handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser?.uid}/watchlist/${animeIdStr}`));
      }
    } else {
      setWatchlist((prev) => {
        const exists = prev.some((w) => w.mal_id === anime.mal_id);
        const next = exists
          ? prev.filter((w) => w.mal_id !== anime.mal_id)
          : [...prev, anime];
        
        try {
          localStorage.setItem("otakuhub_watchlist_v2", JSON.stringify(next));
        } catch {}

        if (exists) {
          showToast(`Removed "${anime.title}" from watchlist`, "info");
        } else {
          showToast(`Added "${anime.title}" to watchlist!`, "success");
        }

        // Dispatch global watchlist updates for observers
        window.dispatchEvent(new Event("wl_update"));
        return next;
      });
    }
  }, [watchlist, showToast]);

  // List card click handler with smart routing based on origin context
  const handleAnimeClick = useCallback(
    (anime: Anime) => {
      addToHistory(anime);
      navStack.current.push({ page, browseMode, genreFilter });
      setSelectedId(anime.mal_id);
      setSelectedAnime(anime);
      if (page === "ecchi" || page === "ecchiDetail") {
        setPage("ecchiDetail");
      } else {
        setPage("detail");
      }
    },
    [page, browseMode, genreFilter]
  );

  // Search input query trigger
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    navStack.current.push({ page, browseMode, genreFilter });
    setPage("search");
  }, [page, browseMode, genreFilter]);

  // Sidebar or mobile dock tab router
  const handleNav = useCallback(
    (id: string, extra: any = null) => {
      if (id === "home") {
        navStack.current = [];
        setPage("home");
        return;
      }
      if (id === "ecchi") {
        if (!ecchiAgeVerified) {
          setShowAgeGate(true);
          return;
        }
        navStack.current.push({ page, browseMode, genreFilter });
        setPage("ecchi");
        return;
      }
      if (id === "ecchiDetail") {
        navStack.current.push({ page, browseMode, genreFilter });
        setPage("ecchiDetail");
        return;
      }

      const browseModes = [
        "explore",
        "airing",
        "popular",
        "movies",
        "genres",
        "schedule",
        "watchlist",
        "history",
        "community",
      ];
      if (browseModes.includes(id)) {
        navStack.current.push({ page, browseMode, genreFilter });
        if (id === "genres" && extra) {
          setGenreFilter(extra);
        } else if (id !== "genres") {
          setGenreFilter(null);
        }
        setBrowseMode(id);
        setPage("browse");
      }
    },
    [page, browseMode, genreFilter, ecchiAgeVerified]
  );

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const next = !prev;
      try {
        if (next) {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } else {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
        }
      } catch {}
      return next;
    });
  }, []);

  const handleLogin = useCallback(async () => {
    if (!auth || !googleProvider) {
      showToast("Running in offline/local storage mode! Watchlist & progress saved locally.", "info");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("Signed in successfully with Google!", "success");
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        showToast("Authentication failed: " + (err?.message || err), "error");
      }
    }
  }, [showToast]);

  const handleLogout = useCallback(async () => {
    if (!auth) {
      setCurrentUser(null);
      showToast("Signed out successfully", "info");
      return;
    }
    try {
      await signOut(auth);
      showToast("Signed out successfully", "info");
    } catch (err: any) {
      showToast("Sign out failed: " + (err?.message || err), "error");
    }
  }, [showToast]);

  const sidebarActiveTab = page === "browse" ? browseMode : page === "detail" ? "explore" : page;

  return (
    <>
      <Particles />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "#07070f",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TopBar
          showBack={page !== "home"}
          onBack={handleBack}
          onSearch={handleSearch}
          onNav={handleNav}
          watchlist={watchlist}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onToggleSettings={() => {
            playSound("click");
            setShowSettings(true);
          }}
          onTyping={setIsTyping}
          loading={searchLoading}
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        
        <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
               position: "relative",
              paddingTop: page === "home" ? "0px" : "56px",
              paddingBottom: isFullscreen ? "66px" : "0px",
              transition: "padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {page === "home" && (
              <HomePage
                onAnimeClick={handleAnimeClick}
                onNav={handleNav}
                activeGenreId={genreFilter?.id}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            )}
            
            {page === "ecchi" && (
              <EcchiPage onAnimeClick={handleAnimeClick} onNav={handleNav} />
            )}
            
            {page === "ecchiDetail" && selectedId && (
              <EcchiDetailPage
                animeId={selectedId}
                initialAnime={selectedAnime?.mal_id === selectedId ? selectedAnime : null}
                onBack={handleBack}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                toast={showToast}
              />
            )}
            
            {page === "detail" && selectedId && (
              <DetailPage
                animeId={selectedId}
                initialAnime={selectedAnime?.mal_id === selectedId ? selectedAnime : null}
                onBack={handleBack}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                toast={showToast}
              />
            )}
            
            {page === "browse" && (
              <BrowsePage
                mode={browseMode}
                genreFilter={genreFilter}
                onAnimeClick={handleAnimeClick}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            )}
            
            {page === "search" && (
              <SearchPage
                query={searchQuery}
                isTyping={isTyping}
                onLoadingChange={handleLoadingChange}
                onAnimeClick={handleAnimeClick}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                onSearch={handleSearch}
              />
            )}
          </div>
        </div>

        {/* Bottom Navigation Dock */}
        <BottomBar page={sidebarActiveTab} onNav={handleNav} watchlist={watchlist} isFullscreen={isFullscreen} />
      </div>

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      {showAgeGate && (
        <AgeGate
          onVerify={() => {
            setEcchiAgeVerified(true);
            setShowAgeGate(false);
            navStack.current.push({ page, browseMode, genreFilter });
            setPage("ecchi");
          }}
          onDeny={() => setShowAgeGate(false)}
        />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
