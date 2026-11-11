"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";
import styles from "./AmbientBackground.module.css";

/**
 * The wallpaper behind the workspace. Three soft light fields drift slowly,
 * while the technical grid eases with scroll. All motion is transform/opacity
 * only, and the whole layer is skipped for reduced-motion users.
 */
export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const blobs = Array.from(
        root.querySelectorAll<HTMLElement>("[data-ambient-blob]"),
      );
      const grid = root.querySelector("[data-ambient-grid]");

      media.add("(min-width: 901px)", () => {
        blobs.forEach((blob, index) => {
          gsap.to(blob, {
            xPercent: index % 2 === 0 ? 9 : -8,
            yPercent: index % 2 === 0 ? -7 : 8,
            scale: 1.12,
            duration: 24 + index * 6,
            delay: index * 2.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        if (grid) {
          gsap.to(grid, {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              start: 0,
              end: "max",
              scrub: 1,
            },
          });
        }
      });

      /* Phones keep the painted wallpaper only. The blurred fields and masked
         grid stay completely still there, so no full-screen layer is being
         recomposited while the page scrolls. */
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <div ref={ref} className={styles.ambient} aria-hidden="true">
      <div className={styles.wall} />
      <div className={styles.aurora}>
        <span
          className={`${styles.blob} ${styles.blobA}`}
          data-ambient-blob
        />
        <span
          className={`${styles.blob} ${styles.blobB}`}
          data-ambient-blob
        />
        <span
          className={`${styles.blob} ${styles.blobC}`}
          data-ambient-blob
        />
      </div>
      <div className={styles.grid} data-ambient-grid />
      <div className={styles.vignette} />
      <div className={styles.noise} />
    </div>
  );
}
