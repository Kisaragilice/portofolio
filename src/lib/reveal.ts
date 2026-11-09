import { gsap } from "@/lib/gsap";

/**
 * Mobile-friendly one-shot reveal. IntersectionObserver fires once when the
 * trigger enters the viewport, then the observer disconnects. This avoids
 * keeping a ScrollTrigger per panel alive while the user scrolls.
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
