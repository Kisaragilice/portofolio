import type { ProjectArt as ProjectArtVariant } from "@/lib/portfolio";
import styles from "./ProjectArt.module.css";

const labels: Record<ProjectArtVariant, string> = {
  orbit: "01 / orbit",
  grid: "02 / grid",
  signal: "03 / signal",
};

export function ProjectArt({ variant }: { variant: ProjectArtVariant }) {
  return (
    <div className={styles.art} data-variant={variant} aria-hidden="true">
      <span className={`${styles.blob} ${styles.blobOne}`} />
      <span className={`${styles.blob} ${styles.blobTwo}`} />
      <span className={styles.grid} />

      {variant === "orbit" ? (
        <div className={styles.orbit}>
          <span className={styles.orbitOuter} />
          <span className={styles.orbitInner} />
          <span className={styles.orbitCore} />
          <span className={styles.orbitNode} />
          <span className={styles.orbitNodeAlt} />
        </div>
      ) : null}

      {variant === "grid" ? (
        <div className={styles.tiles}>
          <span className={styles.tileLarge} />
          <span className={styles.tileSmall} />
          <span className={styles.tileWide} />
          <span className={styles.tileBadge}>~/workspace</span>
        </div>
      ) : null}

      {variant === "signal" ? (
        <div className={styles.signal}>
          <svg
            className={styles.signalSvg}
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0 78c26 0 26-34 52-34s26 54 52 54 26-78 52-78 26 60 52 60 26-24 52-24 26 14 52 14 26-8 40-8"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className={styles.bars}>
            {Array.from({ length: 22 }, (_, index) => (
              <span
                key={index}
                style={{ height: `${16 + ((index * 29) % 70)}%` }}
              />
            ))}
          </div>
        </div>
      ) : null}

      <span className={styles.caption}>
        <span>{labels[variant]}</span>
        <span>workspace preview</span>
      </span>
    </div>
  );
}
