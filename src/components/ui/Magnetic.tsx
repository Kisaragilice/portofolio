"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { canHover, prefersReducedMotion } from "@/lib/motion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

/**
 * Small, restrained magnetic response for primary calls to action.
 * Desktop pointers only; disabled for reduced-motion users.
 */
export function Magnetic({
  children,
  className,
  strength = 0.18,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !canHover() || prefersReducedMotion()) return;

    const moveX = gsap.quickTo(element, "x", {
      duration: 0.85,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(element, "y", {
      duration: 0.85,
      ease: "power3.out",
    });

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      moveX(offsetX * strength);
      moveY(offsetY * strength);
    };

    const onPointerLeave = () => {
      moveX(0);
      moveY(0);
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerleave", onPointerLeave);

    return () => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
      gsap.killTweensOf(element);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
