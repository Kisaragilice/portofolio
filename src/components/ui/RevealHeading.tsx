"use client";

import { useRef } from "react";
import {
  isMobileViewport,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";
import { observeRevealOnce, revealRootMargin } from "@/lib/reveal";
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

    const mobile = isMobileViewport();

    return observeRevealOnce(
      element,
      units,
      { yPercent: mobile ? 108 : 118, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: mobile ? 0.85 : 1.35,
        delay: mobile ? delay * 0.5 : delay,
        stagger: mobile ? stagger * 0.5 : stagger,
        ease: "power4.out",
      },
      revealRootMargin(start),
    );
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
