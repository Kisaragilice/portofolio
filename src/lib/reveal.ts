import { gsap } from "@/lib/gsap";

/**
 * Translate a ScrollTrigger-style `top 84%` start into an equivalent
 * IntersectionObserver bottom root margin.
 */
export function revealRootMargin(start: string): string {
  const match = /^top\s+(\d+(?:\.\d+)?)%$/.exec(start.trim());
  if (!match) return "0px 0px -16% 0px";
  const inset = Math.min(40, Math.max(0, 100 - Number(match[1])));
  return `0px 0px -${inset}% 0px`;
}

/**
 * One-shot reveal. IntersectionObserver fires once when the trigger enters the
 * viewport, then the observer disconnects. This avoids keeping a ScrollTrigger
 * per panel alive while the user scrolls. Used on desktop for one-shot reveals
 * too; scrub-linked effects still use ScrollTrigger.
 */
export function observeRevealOnce(
  trigger: Element,
  targets: Element | Element[],
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  rootMargin = "0px 0px -6% 0px",
): () => void {
  gsap.set(targets, from);

  let tween: ReturnType<typeof gsap.to> | undefined;
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      tween = gsap.to(targets, to);
    },
    { threshold: 0.01, rootMargin },
  );

  observer.observe(trigger);

  return () => {
    observer.disconnect();
    tween?.kill();
  };
}
