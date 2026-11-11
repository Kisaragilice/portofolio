"use client";

import { useRef } from "react";
import { ArrowUpRight, GitBranch } from "lucide-react";
import { gsap } from "@/lib/gsap";
import {
  isMobileViewport,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";
import { observeRevealOnce, revealRootMargin } from "@/lib/reveal";
import { portfolio } from "@/lib/portfolio";
import { ProjectArt } from "@/components/ui/ProjectArt";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import styles from "./Projects.module.css";

const { projects, sections, links } = portfolio;

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>("[data-project-card]"),
    );
    const mobile = isMobileViewport();

    /* Artwork loops are transform/opacity only, but there is no reason to keep
       compositing three cards while they are outside the viewport. */
    const artObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.toggleAttribute(
            "data-art-offstage",
            !entry.isIntersecting,
          );
        });
      },
      { rootMargin: "15% 0px" },
    );
    cards.forEach((card) => artObserver.observe(card));

    const cleanupArt = () => {
      artObserver.disconnect();
      cards.forEach((card) => card.removeAttribute("data-art-offstage"));
    };

    const revealCleanups = cards.map((card, index) =>
      observeRevealOnce(
        card,
        card,
        {
          y: mobile ? 20 : 54,
          autoAlpha: 0,
          ...(mobile ? {} : { scale: 0.982 }),
        },
        {
          y: 0,
          autoAlpha: 1,
          ...(mobile ? {} : { scale: 1 }),
          duration: mobile ? 0.75 : 1.3,
          delay: index * (mobile ? 0.04 : 0.09),
          ease: "power4.out",
        },
        revealRootMargin("top 86%"),
      ),
    );

    if (mobile) {
      return () => {
        cleanupArt();
        revealCleanups.forEach((cleanup) => cleanup());
      };
    }

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      /* The art crop is a nice desktop depth cue, but on phones the extra
         scrub-linked transforms cost more than they add. Reveal alone stays. */
      media.add("(min-width: 901px)", () => {
        cards.forEach((card) => {
          const art = card.querySelector<HTMLElement>("[data-project-art]");
          if (!art) return;

          gsap.fromTo(
            art,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.65,
              },
            },
          );
        });
      });

      /* Desktop pointer depth: a restrained 3D lean that makes the project
         windows feel physical under the mouse. Pointer moves are coalesced to
         one rect read per frame instead of one per raw pointer event. */
      media.add(
        "(min-width: 901px) and (hover: hover) and (pointer: fine)",
        () => {
          const cleanups: Array<() => void> = [];

          cards.forEach((card) => {
            const rotateX = gsap.quickTo(card, "rotationX", {
              duration: 0.8,
              ease: "power3.out",
            });
            const rotateY = gsap.quickTo(card, "rotationY", {
              duration: 0.8,
              ease: "power3.out",
            });

            gsap.set(card, {
              transformPerspective: 1400,
              transformOrigin: "center center",
            });

            let frame = 0;
            let pointerX = 0;
            let pointerY = 0;

            const applyTilt = () => {
              frame = 0;
              const rect = card.getBoundingClientRect();
              const x = (pointerX - rect.left) / rect.width - 0.5;
              const y = (pointerY - rect.top) / rect.height - 0.5;
              rotateY(x * 2.6);
              rotateX(y * -2.2);
            };

            const onMove = (event: PointerEvent) => {
              pointerX = event.clientX;
              pointerY = event.clientY;
              if (!frame) frame = requestAnimationFrame(applyTilt);
            };

            const onLeave = () => {
              if (frame) cancelAnimationFrame(frame);
              frame = 0;
              rotateX(0);
              rotateY(0);
            };

            card.addEventListener("pointermove", onMove);
            card.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              if (frame) cancelAnimationFrame(frame);
              card.removeEventListener("pointermove", onMove);
              card.removeEventListener("pointerleave", onLeave);
            });
          });

          return () => cleanups.forEach((cleanup) => cleanup());
        },
      );
    }, section);

    return () => {
      cleanupArt();
      revealCleanups.forEach((cleanup) => cleanup());
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className={`section ${styles.projects}`}
      aria-labelledby="work-title"
    >
      <div className="container">
        <SectionLabel index="03" label="Selected work" />

        <div className="section-head">
          <RevealHeading
            text={sections.projects.title}
            id="work-title"
            className="section-title"
          />
          <Reveal delay={0.08}>
            <p className="section-lede">{sections.projects.intro}</p>
          </Reveal>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <article
              key={project.id}
              className={`panel ${styles.card}`}
              data-project-card
              aria-labelledby={`project-title-${project.id}`}
            >
              <div className="window-bar">
                <span className="window-dots" aria-hidden="true">
                  <span className="window-dot" />
                  <span className="window-dot" />
                  <span className="window-dot" />
                </span>
                <span className="window-title">{project.id}.case</span>
                <span className="window-meta">{project.status}</span>
              </div>

              <div className={styles.body}>
                <div className={styles.visual}>
                  <div className={styles.artFrame} data-project-art>
                    <ProjectArt variant={project.art} />
                  </div>
                  <span className={styles.visualBadge}>
                    {project.placeholder ? "placeholder" : "case study"}
                  </span>
                </div>

                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span className={styles.metaIndex}>{project.index}</span>
                    <span className={styles.metaCategory}>
                      {project.category}
                    </span>
                    <span className={styles.metaYear}>{project.year}</span>
                  </div>

                  <h3
                    className={styles.name}
                    id={`project-title-${project.id}`}
                  >
                    {project.name}
                  </h3>

                  <p className={styles.description}>{project.description}</p>

                  <div className={styles.tags}>
                    {project.techStack.length ? (
                      project.techStack.map((tech) => (
                        <span key={tech} className={styles.tag}>
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className={styles.tagPending}>
                        Technology stack pending
                      </span>
                    )}
                  </div>

                  <div className={styles.foot}>
                    <span className={styles.status}>
                      <span className={styles.statusDot} aria-hidden="true" />
                      {project.status}
                    </span>

                    <div className={styles.links}>
                      {project.repositoryUrl ? (
                        <a
                          className={`btn btn--glass ${styles.repoButton}`}
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <GitBranch
                            size={13}
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          Repository
                          <ArrowUpRight
                            size={12}
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                        </a>
                      ) : (
                        <button
                          type="button"
                          className={`btn btn--glass ${styles.repoButton}`}
                          disabled
                          title="Add repositoryUrl in src/lib/portfolio.ts"
                        >
                          <GitBranch
                            size={13}
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          Repository link pending
                        </button>
                      )}
                      {project.liveUrl ? (
                        <a
                          className={`btn btn--ghost ${styles.liveButton}`}
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Live demo
                          <ArrowUpRight
                            size={12}
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Reveal delay={0.08} className={styles.footNote}>
          <p>
            Project entries are intentionally marked as placeholders until real
            case studies are documented.
          </p>
          <a
            className={styles.githubLink}
            href={links.github}
            target="_blank"
            rel="noreferrer noopener"
          >
            More experiments on GitHub
            <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
