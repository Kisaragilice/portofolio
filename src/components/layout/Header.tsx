"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { ThemeToggle } from "./ThemeToggle";
import { ScrollProgress } from "./ScrollProgress";
import styles from "./Header.module.css";

const sectionIds = portfolio.nav.map((item) => item.id);

function formatTime() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

/* The clock is an external store so hydration can render a placeholder while
   the client subscribes to minute updates without a state-setting effect. */
let clockValue: string | null = null;
let clockTimer: number | null = null;
const clockListeners = new Set<() => void>();

function getClockSnapshot() {
  if (clockValue === null) clockValue = formatTime();
  return clockValue;
}

function getServerClockSnapshot() {
  return "--:--";
}

function subscribeToClock(listener: () => void) {
  clockListeners.add(listener);

  if (clockTimer === null) {
    clockTimer = window.setInterval(() => {
      clockValue = formatTime();
      clockListeners.forEach((notify) => notify());
    }, 30_000);
  }

  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0 && clockTimer !== null) {
      window.clearInterval(clockTimer);
      clockTimer = null;
    }
  };
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const time = useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getServerClockSnapshot,
  );
  const { stop, start } = useSmoothScroll();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (y < window.innerHeight * 0.35) {
          setActiveSection("");
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-34% 0px -56% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (menuOpen) {
      stop();
      panelRef.current?.focus();
    } else {
      start();
    }

    const inertTargets = document.querySelectorAll<HTMLElement>("main, footer");
    inertTargets.forEach((element) => {
      if (menuOpen) {
        element.setAttribute("inert", "");
      } else {
        element.removeAttribute("inert");
      }
    });

    return () => {
      start();
      inertTargets.forEach((element) => element.removeAttribute("inert"));
    };
  }, [menuOpen, start, stop]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <header
        className={[styles.header, scrolled ? styles.scrolled : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.shell}>
          <div className={`panel ${styles.bar}`}>
            <a href="#top" className={styles.brand}>
              <span className={styles.mark} aria-hidden="true">
                <span className={styles.markGlyph} />
              </span>
              <span className={styles.brandText}>
                <span className={styles.wordmark}>
                  {portfolio.owner.displayName}
                </span>
                <span className={styles.host}>~/portfolio</span>
              </span>
            </a>

            <nav className={styles.desktopNav} aria-label="Primary">
              <ul className={styles.navList}>
                {portfolio.nav.map((item) => {
                  const active = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className={[styles.navLink, active ? styles.active : ""]
                          .filter(Boolean)
                          .join(" ")}
                        aria-current={active ? "location" : undefined}
                      >
                        <span className={styles.activeDot} aria-hidden="true" />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className={styles.actions}>
              <span className={styles.clock} aria-hidden="true">
                <span className={styles.clockValue}>{time}</span>
                <span className={styles.clockLabel}>local</span>
              </span>
              <ThemeToggle />
              <button
                ref={triggerRef}
                type="button"
                className={styles.menuButton}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className={styles.menuLabel}>
                  {menuOpen ? "Close" : "Menu"}
                </span>
                {menuOpen ? (
                  <X size={17} strokeWidth={1.6} aria-hidden="true" />
                ) : (
                  <Menu size={17} strokeWidth={1.6} aria-hidden="true" />
                )}
              </button>
            </div>

            <ScrollProgress />
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={panelRef}
        data-lenis-prevent
        className={[styles.menu, menuOpen ? styles.menuOpen : ""]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        tabIndex={-1}
      >
        <div className={`panel ${styles.menuSheet}`}>
          <div className={styles.menuBar}>
            <span className="window-dots" aria-hidden="true">
              <span className="window-dot" />
              <span className="window-dot" />
              <span className="window-dot" />
            </span>
            <span className={`window-title ${styles.menuBarTitle}`}>
              navigation — {portfolio.owner.displayName}
            </span>
            <span className="window-meta">menu</span>
          </div>

          <nav aria-label="Mobile" className={styles.menuNav}>
            <ul className={styles.menuList}>
              {portfolio.nav.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={styles.menuLink}
                    onClick={closeMenu}
                  >
                    <span className={styles.menuIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.menuLinkLabel}>{item.label}</span>
                    <ArrowUpRight
                      className={styles.menuArrow}
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.menuFooter}>
            <div>
              <p className={styles.menuMeta}>Elsewhere</p>
              <a
                className={styles.menuExternal}
                href={portfolio.links.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div>
              <p className={styles.menuMeta}>Currently</p>
              <p className={styles.menuNow}>
                {portfolio.currentlyLearning.slice(0, 2).join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
