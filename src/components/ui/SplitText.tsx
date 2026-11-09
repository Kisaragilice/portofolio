import { Fragment } from "react";

type SplitTextProps = {
  /** Plain-text version, also exposed to assistive technology. */
  text: string;
  mode?: "chars" | "words";
  className?: string;
  lineClassName?: string;
  lineClassNames?: string[];
  lines?: string[];
};

/**
 * Lightweight SplitText alternative. Renders visually split text while keeping
 * the original string available to screen readers as a single announcement.
 */
export function SplitText({
  text,
  mode = "words",
  className,
  lineClassName,
  lineClassNames,
  lines,
}: SplitTextProps) {
  const visualLines = lines ?? [text];

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {visualLines.map((line, lineIndex) => (
          <span
            key={`${line}-${lineIndex}`}
            className={["split-line", lineClassName, lineClassNames?.[lineIndex]]
              .filter(Boolean)
              .join(" ")}
          >
            {line.split(" ").map((word, wordIndex, words) => (
              <Fragment key={`${word}-${wordIndex}`}>
                <span className="split-word">
                  {mode === "chars" ? (
                    Array.from(word).map((character, characterIndex) => (
                      <span
                        key={`${character}-${characterIndex}`}
                        className="split-unit"
                        data-split-unit
                      >
                        {character}
                      </span>
                    ))
                  ) : (
                    <span className="split-unit" data-split-unit>
                      {word}
                    </span>
                  )}
                </span>
                {wordIndex < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
