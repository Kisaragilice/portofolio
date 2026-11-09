import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect warns during server rendering. This swaps in useEffect on the
 * server so GSAP setup can run immediately before paint in the browser.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canHover(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Phones get the same visual language, but not the same per-frame work.
 * Components use this to skip continuous/scrubbed effects on small screens.
 */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 900px)").matches;
}
