import { portfolio } from "@/lib/portfolio";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import styles from "./Toolkit.module.css";

const { toolkit, sections } = portfolio;

export function Toolkit() {
  return (
    <section
      id="toolkit"
      className={`section ${styles.toolkit}`}
      aria-labelledby="toolkit-title"
    >
      <div className="container">
        <SectionLabel index="02" label="Toolkit" />

        <div className="section-head">
          <RevealHeading
            text={sections.toolkit.title}
            id="toolkit-title"
            className="section-title"
          />
          <Reveal delay={0.08}>
            <p className="section-lede">{sections.toolkit.intro}</p>
          </Reveal>
        </div>

        <Parallax>
          <div className={styles.grid}>
            {toolkit.map((category, index) => (
            <Reveal
              key={category.id}
              as="article"
              className={`panel ${styles.category}`}
              delay={index * 0.07}
              y={30}
              tilt
            >
              <div className="window-bar">
                <span className="window-dots" aria-hidden="true">
                  <span className="window-dot" />
                  <span className="window-dot" />
                  <span className="window-dot" />
                </span>
                <span className="window-title">{category.id}.pkg</span>
                <span className="window-meta">{category.index}</span>
              </div>

              <div className={styles.body}>
                <div className={styles.head}>
                  <div>
                    <h3 className={styles.title} id={`toolkit-${category.id}`}>
                      {category.title}
                    </h3>
                    <p className={styles.note}>{category.note}</p>
                  </div>
                  <span className={styles.count} aria-hidden="true">
                    {String(category.items.length).padStart(2, "0")}
                  </span>
                </div>

                <ul
                  className={styles.list}
                  aria-labelledby={`toolkit-${category.id}`}
                >
                  {category.items.map((item) => (
                    <li key={item} className={styles.item}>
                      <span className={styles.itemDot} aria-hidden="true" />
                      <span className={styles.itemName}>{item}</span>
                      <span className={styles.itemTag}>pkg</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.foot}>
                <span>category / {category.index}</span>
                <span>installed</span>
              </div>
              </Reveal>
            ))}
          </div>
        </Parallax>
      </div>
    </section>
  );
}
