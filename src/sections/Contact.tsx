import { ArrowUpRight } from "lucide-react";
import { portfolio, socialLinks } from "@/lib/portfolio";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import styles from "./Contact.module.css";

const { sections, links } = portfolio;

const contactLinks = [
  ...socialLinks,
  ...(links.email
    ? [
        {
          label: "Email",
          href: `mailto:${links.email}`,
          handle: links.email,
          external: false,
        },
      ]
    : []),
  ...(links.linkedin
    ? [
        {
          label: "LinkedIn",
          href: links.linkedin,
          handle: "LinkedIn profile",
          external: true,
        },
      ]
    : []),
  ...(links.website
    ? [
        {
          label: "Website",
          href: links.website,
          handle: links.website.replace(/^https?:\/\//, ""),
          external: true,
        },
      ]
    : []),
];

export function Contact() {
  return (
    <section
      id="contact"
      className={`section ${styles.contact}`}
      aria-labelledby="contact-title"
    >
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <Parallax distance={16}>
            <div className={`panel ${styles.shell}`}>
            <div className="window-bar">
              <span className="window-dots" aria-hidden="true">
                <span className="window-dot" />
                <span className="window-dot" />
                <span className="window-dot" />
              </span>
              <span className="window-title">~/contact — channels</span>
              <span className="window-meta">open</span>
            </div>

            <div className={styles.layout}>
              <div className={styles.copy}>
                <SectionLabel index="05" label="Contact" />

                <RevealHeading
                  text={sections.contact.title}
                  id="contact-title"
                  className={styles.title}
                />

                <p className={styles.intro}>{sections.contact.intro}</p>

                <div className={styles.prompt} aria-hidden="true">
                  <span className={styles.promptSign}>$</span>
                  <span>contact --open</span>
                  <span className={styles.caret} />
                </div>

                <p className={styles.focus}>
                  Software <span aria-hidden="true">·</span> Linux{" "}
                  <span aria-hidden="true">·</span> Open source{" "}
                  <span aria-hidden="true">·</span> Local AI
                </p>
              </div>

              <div className={styles.channels}>
                <div className={styles.channelsHead}>
                  <p className={styles.label}>Channels</p>
                  <span className={styles.channelCount}>
                    {String(contactLinks.length).padStart(2, "0")} available
                  </span>
                </div>

                <ul className={styles.linkList}>
                  {contactLinks.map((link, index) => (
                    <li key={link.label}>
                      <a
                        className={`${styles.contactLink} ${
                          index === 0 ? styles.primary : ""
                        }`}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer noopener" : undefined}
                      >
                        <span className={styles.linkIndex} aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.linkText}>
                          <span className={styles.linkLabel}>
                            {link.label}
                          </span>
                          <span className={styles.linkHandle}>
                            {link.handle}
                          </span>
                        </span>
                        <span className={styles.linkArrow} aria-hidden="true">
                          <ArrowUpRight size={15} strokeWidth={1.6} />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <p className={styles.footnote}>
                  GitHub is the most reliable place to find me. Email and other
                  channels will appear here when published.
                </p>
              </div>
            </div>

            <div className={styles.foot}>
              <p>{sections.contact.footerNote}</p>
              <a href="#top" className={styles.backToTop}>
                <span>Back to top</span>
                <span aria-hidden="true">↑</span>
              </a>
            </div>
            </div>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
