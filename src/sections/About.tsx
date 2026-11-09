import { Terminal } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ScrollText } from "@/components/ui/ScrollText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import styles from "./About.module.css";

const { owner, interests, currentlyLearning, sections } = portfolio;

export function About() {
  return (
    <section
      id="about"
      className={`section ${styles.about}`}
      aria-labelledby="about-title"
    >
      <div className="container">
        <SectionLabel index="01" label={sections.about.title} />

        <div className="section-head">
          <div>
            <RevealHeading
              text="About the workspace"
              id="about-title"
              className="section-title"
            />
          </div>
          <ScrollText
            as="p"
            text={sections.about.statement}
            className={`section-lede ${styles.statement}`}
          />
        </div>

        <Parallax>
          <div className={styles.grid}>
            <Reveal className={styles.profileWrap} tilt>
            <article className={`panel ${styles.profile}`}>
              <div className="window-bar">
                <span className="window-dots" aria-hidden="true">
                  <span className="window-dot" />
                  <span className="window-dot" />
                  <span className="window-dot" />
                </span>
                <span className="window-title">~/profile — readme.md</span>
                <span className="window-meta">read only</span>
              </div>

              <div className={styles.profileBody}>
                <div className={styles.identity}>
                  <span className={styles.monogram} aria-hidden="true">
                    K
                  </span>
                  <div className={styles.identityText}>
                    <p className={styles.name}>{owner.displayName}</p>
                    <p className={styles.role}>{owner.role}</p>
                  </div>
                  <span className={styles.profileMeta}>K / 2026</span>
                </div>

                <p className={styles.longBio}>{owner.longBio}</p>

                <div className={styles.learning}>
                  <div className={styles.learningHead}>
                    <p className={styles.label}>Currently learning</p>
                    <span className={styles.count}>
                      {String(currentlyLearning.length).padStart(2, "0")} tracks
                    </span>
                  </div>

                  <ul className={styles.learningList}>
                    {currentlyLearning.map((item, index) => (
                      <li key={item} className={styles.learningItem}>
                        <span
                          className={styles.learningIndex}
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.learningTitle}>{item}</span>
                        <span className={styles.learningDot} aria-hidden="true" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1} className={styles.asideWrap} tilt>
            <article className={`panel ${styles.aside}`}>
              <div className="window-bar">
                <span className="window-dots" aria-hidden="true">
                  <span className="window-dot" />
                  <span className="window-dot" />
                  <span className="window-dot" />
                </span>
                <span className="window-title">interests — notes</span>
                <span className="window-meta">04</span>
              </div>

              <div className={styles.asideBody}>
                <p className={styles.label}>{sections.about.asideLabel}</p>

                <ul className={styles.interestList}>
                  {interests.map((interest, index) => (
                    <li key={interest.title} className={styles.interestItem}>
                      <div className={styles.interestTop}>
                        <span
                          className={styles.interestIndex}
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className={styles.interestTitle}>
                          {interest.title}
                        </h3>
                      </div>
                      <p className={styles.interestNote}>{interest.note}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.asideFoot}>
                <Terminal size={14} strokeWidth={1.6} aria-hidden="true" />
                <p>Learn the system, then build with it. Repeat.</p>
              </div>
            </article>
          </Reveal>
          </div>
        </Parallax>
      </div>
    </section>
  );
}
