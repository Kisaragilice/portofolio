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

/*
 * The browser only needs to interpolate properties that actually change.
 * Marking the handful of elements that own a colour, border, or shadow keeps
 * the crossfade intact without asking every node (and its pseudo-elements) to
 * run several transitions for 1.6s.
 */
const NON_RENDERED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEMPLATE",
  "LINK",
  "META",
]);

type ThemeOrigin = { x: number; y: number };

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function hasDirectText(element: Element) {
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      return true;
    }
  }
  return false;
}

function hasVisibleBorder(style: CSSStyleDeclaration) {
  const sides = ["Top", "Right", "Bottom", "Left"] as const;
  return sides.some((side) => {
    const width = Number.parseFloat(style[`border${side}Width`]);
    return style[`border${side}Style`] !== "none" && width > 0;
  });
}

function isNearViewport(element: Element) {
  const height = window.innerHeight;
  const width = window.innerWidth;
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom >= -height &&
    rect.top <= height * 2 &&
    rect.right >= 0 &&
    rect.left <= width
  );
}

function prepareThemeTransitionTargets() {
  if (!document.body) return [];

  const colorTargets: Element[] = [];

  for (const element of document.body.querySelectorAll("*")) {
    if (NON_RENDERED_TAGS.has(element.tagName)) continue;

    const directText = hasDirectText(element);
    /*
     * SVG paths repaint their whole geometry when currentColor animates, so
     * only mark the controls that own them. The icon then inherits the
     * control's animated colour without turning every path into a transition.
     */
    const isIconControl =
      !directText &&
      element.matches("button, a, [role='button']") &&
      element.querySelector("svg") !== null;

    if (directText || isIconControl) {
      colorTargets.push(element);
      /*
       * Text below the fold does not need a 1.6s crossfade. Keep the visible
       * screen and roughly one screen of scroll headroom; an observer below
       * refreshes this as the viewport moves.
       */
      if (isNearViewport(element)) {
        element.setAttribute("data-theme-color", "");
      } else {
        element.removeAttribute("data-theme-color");
      }
    }

    const style = window.getComputedStyle(element);
    if (style.boxShadow && style.boxShadow !== "none") {
      element.setAttribute("data-theme-shadow", "");
    }
    if (hasVisibleBorder(style)) {
      element.setAttribute("data-theme-border", "");
    }
  }

  return colorTargets;
}

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
  const targetThemeRef = useRef<Theme | null>(null);
  const transitionTokenRef = useRef(0);
  const targetsPreparedRef = useRef(false);
  const colorObserverRef = useRef<IntersectionObserver | null>(null);

  const ensureTransitionTargets = useCallback(() => {
    if (targetsPreparedRef.current) return;
    targetsPreparedRef.current = true;

    const colorTargets = prepareThemeTransitionTargets();
    if (!colorTargets.length || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-theme-color", "");
          } else {
            entry.target.removeAttribute("data-theme-color");
          }
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );

    for (const target of colorTargets) observer.observe(target);
    colorObserverRef.current = observer;
  }, []);

  const setTheme = useCallback((nextTheme: Theme, persist = true) => {
    targetThemeRef.current = nextTheme;
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
      const appliedTheme =
        (document.documentElement.dataset.theme as Theme | undefined) ?? "light";
      /*
       * Track the destination, not the applied attribute. A second click
       * before the 0.72s hand-off must still reverse the first one, otherwise
       * two quick clicks leave the document on the wrong theme.
       */
      const currentTarget = targetThemeRef.current ?? appliedTheme;
      const next: Theme = currentTarget === "dark" ? "light" : "dark";

      if (
        !veilRef.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        targetThemeRef.current = next;
        setTheme(next);
        return;
      }

      const veil = veilRef.current;
      const root = document.documentElement;
      const mobile = isMobileViewport();
      const interrupted = animatingRef.current;

      ensureTransitionTargets();

      /*
       * Killing the old timeline leaves the veil exactly where it is. The new
       * timeline can then carry on from the current opacity/scale instead of
       * snapping back to its opening frame.
       */
      timelineRef.current?.kill();
      timelineRef.current = null;
      animatingRef.current = true;
      targetThemeRef.current = next;
      root.classList.add(TRANSITION_CLASS);

      if (origin) {
        veil.style.setProperty("--veil-x", `${origin.x}px`);
        veil.style.setProperty("--veil-y", `${origin.y}px`);
      }

      const token = ++transitionTokenRef.current;

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          if (token !== transitionTokenRef.current) return;
          root.classList.remove(TRANSITION_CLASS);
          gsap.set(veil, mobile ? { opacity: 0 } : { opacity: 0, scale: 1 });
          animatingRef.current = false;
          timelineRef.current = null;
        },
      });

      if (mobile) {
        if (!interrupted) {
          timeline.set(veil, { opacity: 0 });
        }
        timeline
          .to(veil, {
            opacity: 0.5,
            duration: 0.9,
            ease: "power3.out",
          })
          .add(() => {
            if (token === transitionTokenRef.current) setTheme(next);
          }, 0.72)
          .to(veil, { opacity: 0, duration: 1.55, ease: "power2.inOut" }, 1.05);
      } else {
        if (!interrupted) {
          timeline.set(veil, { opacity: 0, scale: 0.88, rotate: -3 });
        }
        timeline
          .to(veil, {
            opacity: 0.55,
            scale: 1.02,
            rotate: 0,
            duration: 0.9,
            ease: "power3.out",
          })
          .add(() => {
            if (token === transitionTokenRef.current) setTheme(next);
          }, 0.72)
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
    [ensureTransitionTargets, setTheme],
  );

  useEffect(() => {
    const stored = readStoredTheme();
    const initial = stored ?? getSystemTheme();
    targetThemeRef.current = initial;
    applyThemeToDocument(initial);
    emitThemeChange();

    const idleWindow = window as IdleWindow;
    let idleHandle: number | null = null;
    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(ensureTransitionTargets, {
        timeout: 2500,
      });
    } else {
      idleHandle = window.setTimeout(ensureTransitionTargets, 800);
    }

    const applyExternalTheme = (nextTheme: Theme) => {
      transitionTokenRef.current += 1;
      timelineRef.current?.kill();
      timelineRef.current = null;
      animatingRef.current = false;
      targetThemeRef.current = nextTheme;
      document.documentElement.classList.remove(TRANSITION_CLASS);
      if (veilRef.current) gsap.set(veilRef.current, { opacity: 0 });
      applyThemeToDocument(nextTheme);
      emitThemeChange();
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme()) return;
      applyExternalTheme(event.matches ? "dark" : "light");
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === "light" || event.newValue === "dark") {
        applyExternalTheme(event.newValue);
      }
    };

    mediaQuery.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);

    return () => {
      mediaQuery.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
      if (idleHandle !== null) {
        if (idleWindow.cancelIdleCallback) {
          idleWindow.cancelIdleCallback(idleHandle);
        } else {
          window.clearTimeout(idleHandle);
        }
      }
      colorObserverRef.current?.disconnect();
      colorObserverRef.current = null;
      transitionTokenRef.current += 1;
      timelineRef.current?.kill();
      document.documentElement.classList.remove(TRANSITION_CLASS);
    };
  }, [ensureTransitionTargets]);

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
