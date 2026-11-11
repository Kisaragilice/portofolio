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
import { observeRevealOnce, revealRootMargin } from "@/lib/reveal";

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
    let ready = false;
    let cleanupTilt: (() => void) | undefined;

    const cleanupReveal = observeRevealOnce(
      element,
      element,
      {
        y: mobile ? Math.min(y, 18) : y,
        autoAlpha: 0,
        ...(mobile ? {} : { scale: 0.985 }),
      },
      {
        y: 0,
        autoAlpha: 1,
        ...(mobile ? {} : { scale: 1 }),
        duration: mobile ? 0.75 : 1.25,
        delay: mobile ? delay * 0.5 : delay,
        ease: "power3.out",
        onComplete: () => {
          ready = true;
        },
      },
      revealRootMargin(start),
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

      let frame = 0;
      let pointerX = 0;
      let pointerY = 0;

      const applyTilt = () => {
        frame = 0;
        if (!ready) return;
        const rect = element.getBoundingClientRect();
        const x = (pointerX - rect.left) / rect.width - 0.5;
        const y = (pointerY - rect.top) / rect.height - 0.5;
        rotateY(x * 2);
        rotateX(y * -1.6);
      };

      const onMove = (event: PointerEvent) => {
        if (!ready) return;
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

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      cleanupTilt = () => {
        if (frame) cancelAnimationFrame(frame);
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => {
      cleanupTilt?.();
      cleanupReveal();
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
