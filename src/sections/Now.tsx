"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { portfolio } from "@/lib/portfolio";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import styles from "./Now.module.css";

const { currentlyLearning, interests, sections } = portfolio;

export function Now() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        section.toggleAttribute("data-now-offstage", !entry.isIntersecting);
      },
      { rootMargin: "10% 0px" },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      section.removeAttribute("data-now-offstage");
    };
  }, []);

  return (
    <section
      id="now"
      ref={sectionRef}
      className={`section ${styles.now}`}
      aria-labelledby="now-title"
    >
      <div className="container">
        <SectionLabel index="04" label="Now" />

        <div className="section-head">
          <RevealHeading
            text={sections.now.title}
            id="now-title"
            className="section-title"
          />
          <Reveal delay={0.08}>
            <p className="section-lede">{sections.now.intro}</p>
          </Reveal>
        </div>

        <Parallax>
          <div className={styles.grid}>
            <Reveal className={styles.mainWrap} tilt>
            <article className={`panel ${styles.activity}`}>
              <div className="window-bar">
                <span className="window-dots" aria-hidden="true">
                  <span className="window-dot" />
                  <span className="window-dot" />
                  <span className="window-dot" />
                </span>
                <span className="window-title">focus — activity</span>
                <span className="window-meta">running</span>
              </div>

              <div className={styles.activityBody}>
                <div className={styles.activityHead}>
                  <p className={styles.label}>In progress</p>
                  <span className={styles.count}>
                    {String(currentlyLearning.length).padStart(2, "0")} tracks
                  </span>
                </div>

                <ol className={styles.list}>
                  {currentlyLearning.map((item, index) => (
                    <li key={item} className={styles.listItem}>
                      <span className={styles.index} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.itemTitle}>{item}</span>
                      <span className={styles.itemMark} aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className={styles.monitor} aria-hidden="true">
                <span className={styles.monitorLabel}>system monitor</span>
                <div className={styles.monitorBars}>
                  {Array.from({ length: 34 }, (_, index) => (
                    <span
                      key={index}
                      style={
                        {
                          height: `${18 + ((index * 31) % 76)}%`,
                          animationDelay: `${(index % 11) * 0.08}s`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
                <span className={styles.monitorMeta}>now / 2026</span>
              </div>
            </article>
          </Reveal>

          <div className={styles.side}>
            <Reveal delay={0.08} tilt>
              <article className={`panel ${styles.threads}`}>
                <div className="window-bar">
                  <span className="window-dots" aria-hidden="true">
                    <span className="window-dot" />
                    <span className="window-dot" />
                    <span className="window-dot" />
                  </span>
                  <span className="window-title">threads — recurring</span>
                  <span className="window-meta">04</span>
                </div>

                <div className={styles.threadsBody}>
                  <ul className={styles.threadList}>
                    {interests.map((interest, index) => (
                      <li key={interest.title} className={styles.threadItem}>
                        <span className={styles.index} aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className={styles.threadTitle}>{interest.title}</p>
                          <p className={styles.threadNote}>{interest.note}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.14} tilt>
              <article className={`panel ${styles.signal}`}>
                <div className="window-bar">
                  <span className="window-dots" aria-hidden="true">
                    <span className="window-dot" />
                    <span className="window-dot" />
                    <span className="window-dot" />
                  </span>
                  <span className="window-title">signal — notes</span>
                  <span className="window-meta">live</span>
                </div>

                <div className={styles.signalBody}>
                  <p className={styles.quote}>
                    Some are coursework, some are curiosity.
                  </p>
                  <div className={styles.wave} aria-hidden="true">
                    {Array.from({ length: 24 }, (_, index) => (
                      <span
                        key={index}
                        style={{
                          height: `${20 + ((index * 23) % 66)}%`,
                        }}
                      />
                    ))}
                  </div>
                  <p className={styles.signalMeta}>
                    attention is distributed across the queue
                  </p>
                </div>
              </article>
              </Reveal>
            </div>
          </div>
        </Parallax>
      </div>
    </section>
  );
}
