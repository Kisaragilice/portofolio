"use client";

import {
  useRef,
  type ElementType,
  type Ref,
} from "react";
import { gsap } from "@/lib/gsap";
import {
  isMobileViewport,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";
import { SplitText } from "./SplitText";

type ScrollTextProps = {
  text: string;
  className?: string;
  as?: "p" | "h2";
};

/**
 * Scrubbed word-by-word reveal. The visible words start slightly faint and
 * resolve as the paragraph moves through the viewport. Fully reversible.
 */
export function ScrollText({ text, className, as = "p" }: ScrollTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as as ElementType;

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion() || isMobileViewport()) return;

    const context = gsap.context(() => {
      const units = element.querySelectorAll("[data-split-unit]");
      if (!units.length) return;

      gsap.set(units, { opacity: 0.9 });

      gsap.to(units, {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          end: "bottom 56%",
          scrub: 0.65,
        },
      });
    }, element);

    return () => context.revert();
  }, []);

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={className}>
      <SplitText text={text} mode="words" />
    </Tag>
  );
}
