import { ArrowUp } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./Footer.module.css";

const { owner, links } = portfolio;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Reveal delay={0.05}>
          <div className={`panel ${styles.bar}`}>
            <div className={styles.brand}>
            <span className={styles.mark} aria-hidden="true">
              <span className={styles.markGlyph} />
            </span>
            <div className={styles.brandText}>
              <p className={styles.name}>{owner.displayName}</p>
              <p className={styles.meta}>
                {owner.role} <span aria-hidden="true">/</span> portfolio 2026
              </p>
            </div>
          </div>

          <p className={styles.status}>
            <span className={styles.statusDot} aria-hidden="true" />
            Built with Next.js, GSAP &amp; Lenis
          </p>

          <nav className={styles.links} aria-label="Footer">
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.link}
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href="#top" className={styles.link}>
              Top <ArrowUp size={12} strokeWidth={1.7} aria-hidden="true" />
            </a>
          </nav>
          </div>
        </Reveal>

        <div className={styles.bottom}>
          <p>© 2026 {owner.displayName}</p>
          <p>No tracking, no cookies</p>
        </div>
      </div>
    </footer>
  );
}
