"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import {
  isMobileViewport,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";
import { observeRevealOnce } from "@/lib/reveal";
import { SplitText } from "./SplitText";

type RevealHeadingProps = {
  text: string;
  id?: string;
  lines?: string[];
  lineClassNames?: string[];
  mode?: "chars" | "words";
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
};

/**
 * Scroll-triggered heading reveal using a custom split implementation
 * (no paid SplitText plugin).
 */
export function RevealHeading({
  text,
  id,
  lines,
  lineClassNames,
  mode = "words",
  className,
  delay = 0,
  stagger = 0.06,
  start = "top 82%",
}: RevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const units = Array.from(element.querySelectorAll("[data-split-unit]"));
    if (!units.length) return;

    if (isMobileViewport()) {
      return observeRevealOnce(
        element,
        units,
        { yPercent: 108, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          delay: delay * 0.5,
          stagger: stagger * 0.5,
          ease: "power4.out",
        },
      );
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        units,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.35,
          delay,
          stagger,
          ease: "power4.out",
          scrollTrigger: {
            trigger: element,
            start,
            once: true,
          },
        },
      );
    }, element);

    return () => context.revert();
  }, [delay, stagger, start]);

  return (
    <h2 ref={ref} className={className} id={id}>
      <SplitText
        text={text}
        lines={lines}
        lineClassNames={lineClassNames}
        mode={mode}
      />
    </h2>
  );
}
