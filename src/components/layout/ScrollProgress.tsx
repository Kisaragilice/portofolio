"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/motion";
import styles from "./ScrollProgress.module.css";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: 0.25,
          },
        },
      );
    });

    return () => context.revert();
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <div ref={barRef} className={styles.bar} />
    </div>
  );
}
