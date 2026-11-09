"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import {
  isMobileViewport,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";
import { observeRevealOnce } from "@/lib/reveal";

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

    if (isMobileViewport()) {
      return observeRevealOnce(
        element,
        element,
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.65, ease: "power3.out" },
      );
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 92%",
            once: true,
          },
        },
      );
    }, element);

    return () => context.revert();
  }, []);

  return (
    <p ref={ref} className="section-label">
      <span className="section-label__index">{index}</span>
      <span>{label}</span>
    </p>
  );
}
