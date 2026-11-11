"use client";

import { useRef } from "react";
import {
  isMobileViewport,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";
import { observeRevealOnce, revealRootMargin } from "@/lib/reveal";

export function SectionLabel({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const mobile = isMobileViewport();

    return observeRevealOnce(
      element,
      element,
      { y: mobile ? 10 : 18, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: mobile ? 0.65 : 1.15,
        ease: "power3.out",
      },
      revealRootMargin("top 92%"),
    );
  }, []);

  return (
    <p ref={ref} className="section-label">
      <span className="section-label__index">{index}</span>
      <span>{label}</span>
    </p>
  );
}
