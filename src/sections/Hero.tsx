"use client";

import { useRef, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  FolderGit2,
  GitBranch,
  Layers,
  Mail,
  User,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import {
  isMobileViewport,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";
import { portfolio } from "@/lib/portfolio";
import { SplitText } from "@/components/ui/SplitText";
import styles from "./Hero.module.css";

const { owner, sections, interests, currentlyLearning, toolkit, links } =
  portfolio;

const stackItems = Array.from(
  new Set(toolkit.flatMap((category) => category.items)),
).slice(0, 9);

const dockItems = [
  { id: "about", label: "About", href: "#about", icon: User },
  { id: "toolkit", label: "Toolkit", href: "#toolkit", icon: Layers },
  { id: "work", label: "Work", href: "#work", icon: FolderGit2 },
  { id: "contact", label: "Contact", href: "#contact", icon: Mail },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const identityRef = useRef<HTMLElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();
    const mobile = isMobileViewport();

    const context = gsap.context(() => {
      if (reduced) return;

      const panels = section.querySelectorAll("[data-hero-panel]");
      const items = section.querySelectorAll("[data-hero-item]");
      const nameUnits = section.querySelectorAll(
        "[data-hero-name] [data-split-unit]",
      );

      gsap.set(
        panels,
        mobile
          ? { y: 22, autoAlpha: 0 }
          : { y: 46, autoAlpha: 0, scale: 0.985 },
      );
      gsap.set(items, { y: mobile ? 10 : 18, autoAlpha: 0 });
      gsap.set(nameUnits, { yPercent: mobile ? 108 : 116, opacity: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      timeline
        .to(panels, {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: mobile ? 0.82 : 1.2,
          stagger: mobile ? 0.07 : 0.12,
        })
        .to(
          nameUnits,
          {
            yPercent: 0,
            opacity: 1,
            duration: mobile ? 0.8 : 1.1,
            stagger: mobile ? 0.016 : 0.026,
            ease: "expo.out",
          },
          mobile ? 0.28 : 0.38,
        )
        .to(
          items,
          {
            y: 0,
            autoAlpha: 1,
            duration: mobile ? 0.72 : 0.95,
            stagger: mobile ? 0.045 : 0.075,
            ease: "power3.out",
          },
          mobile ? 0.5 : 0.66,
        );

      /* Continuous floating and scroll-linked parallax are desktop-only.
         Mobile keeps the staged entrance and the menu motion. */
      const media = gsap.matchMedia();

      media.add("(min-width: 901px)", () => {
        const floatItems = section.querySelectorAll("[data-hero-float]");
        floatItems.forEach((item, index) => {
          gsap.to(item, {
            y: index % 2 === 0 ? -7 : 5,
            duration: 6 + index * 1.4,
            delay: 1.9 + index * 0.35,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        gsap.to(identityRef.current, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.55,
          },
        });

        gsap.to(sideRef.current, {
          yPercent: 9,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        gsap.to(dockRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.65,
          },
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  const focusSummary = interests
    .slice(0, 3)
    .map((interest) => interest.title.toLowerCase())
    .join(" · ");

  return (
    <section
      id="top"
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.layout}>
          <article
            ref={identityRef}
            className={`panel ${styles.identity}`}
            data-hero-panel
          >
            <div className="window-bar">
              <span className="window-dots" aria-hidden="true">
                <span className="window-dot" />
                <span className="window-dot" />
                <span className="window-dot" />
              </span>
              <span className="window-title">
                ~/kisaragilice — profile
              </span>
              <span className="window-meta">zsh</span>
            </div>

            <div className={styles.identityBody}>
              <div className={styles.topline} data-hero-item>
                <span className={styles.monogram} aria-hidden="true">
                  K
                </span>
                <div className={styles.toplineText}>
                  <p className={styles.role}>
                    <span className={styles.liveDot} aria-hidden="true" />
                    {owner.role}
                  </p>
                  <p className={styles.toplineMeta}>
                    {sections.hero.eyebrow}
                  </p>
                </div>
                <span className={styles.edition}>01 / intro</span>
              </div>

              <div className={styles.nameRow} data-hero-item>
                <h1 id="hero-title" className={styles.name} data-hero-name>
                  <SplitText text={owner.displayName} mode="chars" />
                </h1>
                <span className={styles.nameCursor} aria-hidden="true">
                  _
                </span>
              </div>

              <p className={styles.headline} data-hero-item>
                {owner.headline}
              </p>

              <p className={styles.bio} data-hero-item>
                {owner.shortBio}
              </p>

              <ul className={styles.interests} data-hero-item>
                {interests.slice(0, 3).map((interest) => (
                  <li key={interest.title}>
                    <span className="chip">
                      {interest.title.replace(" & ", " / ")}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={styles.actions} data-hero-item>
                <a href="#work" className="btn btn--primary">
                  <span>View selected work</span>
                  <span className="btn__icon" aria-hidden="true">
                    <ArrowUpRight size={14} strokeWidth={1.7} />
                  </span>
                </a>
                <a href="#contact" className="btn btn--ghost">
                  <span>Open a channel</span>
                  <Mail size={14} strokeWidth={1.6} aria-hidden="true" />
                </a>
              </div>

              <div className={styles.prompt} data-hero-item aria-hidden="true">
                <span className={styles.promptSign}>$</span>
                <span className={styles.promptCmd}>echo $FOCUS</span>
                <span className={styles.promptArrow}>→</span>
                <span className={styles.promptOut}>{focusSummary}</span>
                <span className={styles.caret} />
              </div>
            </div>
          </article>

          <div ref={sideRef} className={styles.side}>
            <article
              className={`panel ${styles.widget}`}
              data-hero-panel
              data-hero-float
            >
              <div className="window-bar">
                <span className="window-dots" aria-hidden="true">
                  <span className="window-dot" />
                  <span className="window-dot" />
                  <span className="window-dot" />
                </span>
                <span className="window-title">focus.queue</span>
                <span className="window-meta">active</span>
              </div>

              <div className={styles.widgetBody}>
                <p className={styles.widgetLabel}>Currently learning</p>
                <ol className={styles.focusList}>
                  {currentlyLearning.map((item, index) => (
                    <li key={item} className={styles.focusItem}>
                      <span className={styles.focusIndex} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.focusTitle}>{item}</span>
                      <span className={styles.focusDot} aria-hidden="true" />
                    </li>
                  ))}
                </ol>
              </div>

              <div className={styles.wave} aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => (
                  <span
                    key={index}
                    className={styles.waveBar}
                    style={
                      {
                        height: `${22 + ((index * 37) % 72)}%`,
                        animationDelay: `${(index % 9) * 0.09}s`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            </article>

            <article
              className={`panel ${styles.widget}`}
              data-hero-panel
              data-hero-float
            >
              <div className="window-bar">
                <span className="window-dots" aria-hidden="true">
                  <span className="window-dot" />
                  <span className="window-dot" />
                  <span className="window-dot" />
                </span>
                <span className="window-title">installed — toolkit</span>
                <span className="window-meta">pkg</span>
              </div>

              <div className={styles.widgetBody}>
                <p className={styles.widgetLabel}>Tools in use</p>
                <ul className={styles.stack}>
                  {stackItems.map((item) => (
                    <li key={item}>
                      <span className="chip">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a href="#toolkit" className={styles.widgetLink}>
                <span>All packages</span>
                <ArrowRight size={13} strokeWidth={1.6} aria-hidden="true" />
              </a>
            </article>

            <a
              href={links.github}
              className={`panel ${styles.linkCard}`}
              data-hero-panel
              data-hero-float
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub — @Kisaragilice (opens in a new tab)"
            >
              <span className={styles.linkIcon} aria-hidden="true">
                <GitBranch size={17} strokeWidth={1.6} />
              </span>
              <span className={styles.linkText}>
                <span className={styles.linkLabel}>GitHub</span>
                <span className={styles.linkHandle}>@Kisaragilice</span>
              </span>
              <ArrowUpRight
                className={styles.linkArrow}
                size={16}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div ref={dockRef} className={styles.footerRow} data-hero-item>
          <nav
            className={`panel ${styles.dock}`}
            aria-label="Workspace shortcuts"
          >
            {dockItems.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.id} href={item.href} className={styles.dockLink}>
                  <Icon size={14} strokeWidth={1.7} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <a href="#about" className={styles.scrollCue}>
            <span>{sections.hero.scrollCue}</span>
            <ChevronDown size={14} strokeWidth={1.7} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
