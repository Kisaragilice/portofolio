"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isMobileViewport } from "@/lib/motion";

type SmoothScrollContextValue = {
  stop: () => void;
  start: () => void;
  scrollTo: (target: string | HTMLElement) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(
  null,
);

const easeOutQuint = (time: number) => 1 - Math.pow(1 - time, 5);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  const stop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.stop();
      return;
    }

    // Phones use native scrolling, so lock the document while the menu is open.
    document.documentElement.style.overflow = "hidden";
  }, []);

  const start = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.start();
      return;
    }

    document.documentElement.style.overflow = "";
  }, []);

  const scrollTo = useCallback((target: string | HTMLElement) => {
    const element =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;

    if (!element) return;

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.start();
      // Lenis already subtracts the root's scroll-padding-top, which accounts
      // for the fixed header. Do not add another offset here.
      lenis.scrollTo(element, { duration: 1.85, easing: easeOutQuint });
    } else {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ScrollTrigger.refresh();
      return;
    }

    const mobile = isMobileViewport();
    let lenis: Lenis | null = null;
    let onScroll: (() => void) | undefined;
    let tick: ((time: number) => void) | undefined;

    if (!mobile) {
      /* Keep the weighted feel without a long tail: 0.07 lagged behind fast
         wheel bursts, while 0.09 still blends consecutive ticks but settles
         within roughly a dozen frames. The multiplier stays close to 1 so the
         page covers the same ground per wheel notch. */
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.96,
        touchMultiplier: 1.05,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
      });

      lenisRef.current = lenis;
      onScroll = () => ScrollTrigger.update();
      tick = (time: number) => lenis?.raf(time * 1000);

      lenis.on("scroll", onScroll);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    ScrollTrigger.refresh();

    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      let element: Element | null = null;
      try {
        element = document.querySelector(href);
      } catch {
        return;
      }
      if (!element) return;

      event.preventDefault();

      if (lenis) {
        lenis.start();
        lenis.scrollTo(element as HTMLElement, {
          duration: 1.85,
          easing: easeOutQuint,
        });
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (window.location.hash !== href) {
        window.history.pushState(null, "", href);
      }
    };

    document.addEventListener("click", onAnchorClick);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      document.removeEventListener("click", onAnchorClick);

      if (lenis) {
        if (onScroll) lenis.off("scroll", onScroll);
        if (tick) gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ stop, start, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error(
      "useSmoothScroll must be used within a SmoothScrollProvider",
    );
  }
  return context;
}
