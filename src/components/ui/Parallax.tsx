"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
};

/**
 * Adds a slow, scrub-linked depth shift to a section block. It is intentionally
 * quieter than the hero/project parallax so the whole page feels connected
 * rather than like a stack of unrelated effects.
 */
export function Parallax({
  children,
  className,
  distance = 30,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 901px)", () => {
        gsap.fromTo(
          element,
          { y: distance },
          {
            y: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
            },
          },
        );
      });
    }, element);

    return () => context.revert();
  }, [distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
