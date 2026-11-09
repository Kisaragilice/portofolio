"use client";

import {
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";
import { gsap } from "@/lib/gsap";
import {
  canHover,
  isMobileViewport,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";
import { observeRevealOnce } from "@/lib/reveal";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  start?: string;
  style?: CSSProperties;
  tilt?: boolean;
};

/**
 * One-shot content reveal. Initial styles are only applied after mount, so
 * content stays visible without JavaScript or when motion is reduced.
 */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = 34,
  start = "top 84%",
  style,
  tilt = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as;

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const mobile = isMobileViewport();

    if (mobile) {
      return observeRevealOnce(
        element,
        element,
        { y: Math.min(y, 18), autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          delay: delay * 0.5,
          ease: "power3.out",
        },
      );
    }

    let ready = false;
    let cleanupTilt: (() => void) | undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { y, autoAlpha: 0, scale: 0.985 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1.25,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start,
            once: true,
          },
          onComplete: () => {
            ready = true;
          },
        },
      );

      if (tilt && canHover()) {
        const rotateX = gsap.quickTo(element, "rotationX", {
          duration: 0.75,
          ease: "power3.out",
        });
        const rotateY = gsap.quickTo(element, "rotationY", {
          duration: 0.75,
          ease: "power3.out",
        });

        gsap.set(element, {
          transformPerspective: 1200,
          transformOrigin: "center center",
        });

        const onMove = (event: PointerEvent) => {
          if (!ready) return;
          const rect = element.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          rotateY(x * 2);
          rotateX(y * -1.6);
        };

        const onLeave = () => {
          rotateX(0);
          rotateY(0);
        };

        element.addEventListener("pointermove", onMove);
        element.addEventListener("pointerleave", onLeave);
        cleanupTilt = () => {
          element.removeEventListener("pointermove", onMove);
          element.removeEventListener("pointerleave", onLeave);
        };
      }
    }, element);

    return () => {
      cleanupTilt?.();
      context.revert();
    };
  }, [delay, start, tilt, y]);

  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
