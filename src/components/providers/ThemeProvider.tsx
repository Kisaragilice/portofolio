"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { isMobileViewport } from "@/lib/motion";

export type Theme = "light" | "dark";

const STORAGE_KEY = "kisaragilice-theme";
const TRANSITION_CLASS = "is-theme-transitioning";

type ThemeOrigin = { x: number; y: number };

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: (origin?: ThemeOrigin) => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

/* The document is the source of truth for the theme, so React reads it
   through an external store instead of duplicating it in component state. */
const themeListeners = new Set<() => void>();

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
}

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const veilRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const setTheme = useCallback((nextTheme: Theme, persist = true) => {
    applyThemeToDocument(nextTheme);
    emitThemeChange();

    if (!persist) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      /* Storage can be unavailable in private browsing; the theme still works. */
    }
  }, []);

  const toggleTheme = useCallback(
    (origin?: ThemeOrigin) => {
      if (animatingRef.current) return;

      const current =
        (document.documentElement.dataset.theme as Theme | undefined) ?? "light";
      const next: Theme = current === "dark" ? "light" : "dark";

      if (
        !veilRef.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setTheme(next);
        return;
      }

      const veil = veilRef.current;
      const root = document.documentElement;
      const mobile = isMobileViewport();

      animatingRef.current = true;
      timelineRef.current?.kill();
      root.classList.add(TRANSITION_CLASS);

      if (origin) {
        veil.style.setProperty("--veil-x", `${origin.x}px`);
        veil.style.setProperty("--veil-y", `${origin.y}px`);
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          root.classList.remove(TRANSITION_CLASS);
          gsap.set(veil, mobile ? { opacity: 0 } : { opacity: 0, scale: 1 });
          animatingRef.current = false;
          timelineRef.current = null;
        },
      });

      if (mobile) {
        timeline
          .set(veil, { opacity: 0 })
          .to(veil, {
            opacity: 0.5,
            duration: 0.9,
            ease: "power3.out",
          })
          .add(() => setTheme(next), 0.72)
          .to(veil, { opacity: 0, duration: 1.55, ease: "power2.inOut" }, 1.05);
      } else {
        timeline
          .set(veil, { opacity: 0, scale: 0.88, rotate: -3 })
          .to(veil, {
            opacity: 0.55,
            scale: 1.02,
            rotate: 0,
            duration: 0.9,
            ease: "power3.out",
          })
          .add(() => setTheme(next), 0.72)
          .to(
            veil,
            {
              opacity: 0,
              scale: 1.2,
              rotate: 2,
              duration: 1.55,
              ease: "power2.inOut",
            },
            1.05,
          );
      }

      timelineRef.current = timeline;
    },
    [setTheme],
  );

  useEffect(() => {
    const stored = readStoredTheme();
    const initial = stored ?? getSystemTheme();
    applyThemeToDocument(initial);
    emitThemeChange();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme()) return;
      applyThemeToDocument(event.matches ? "dark" : "light");
      emitThemeChange();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === "light" || event.newValue === "dark") {
        applyThemeToDocument(event.newValue);
        emitThemeChange();
      }
    };

    mediaQuery.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);

    return () => {
      mediaQuery.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
      timelineRef.current?.kill();
      document.documentElement.classList.remove(TRANSITION_CLASS);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
      <div ref={veilRef} className="theme-veil" aria-hidden="true" />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
