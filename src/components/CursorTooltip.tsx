"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";

interface CursorTooltipProps {
  /** What shows inside the tooltip pill. Text, an icon, even an image thumbnail. */
  content: ReactNode;
  /** The item that triggers the tooltip on hover. */
  children: ReactNode;
  /** Pixels away from the cursor tip. Defaults to a small bottom-right offset. */
  offset?: { x: number; y: number };
  /** Extra classes for the wrapper div (e.g. to keep it inline in a flex row). */
  className?: string;
  /** Seconds for the tooltip to catch up to the cursor. Lower = snappier. */
  duration?: number;
  /** GSAP easing for the catch-up tween. */
  ease?: string;
}

export default function CursorTooltip({
  content,
  children,
  offset = { x: 16, y: 16 },
  className,
  duration = 0.4,
  ease = "power3",
}: CursorTooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  // Set up once per mount (or if duration/ease change) — quickTo hands back
  // a setter function built for being called repeatedly (e.g. on every
  // mousemove), tweening toward each new value via GSAP's own ticker
  // instead of a hand-rolled requestAnimationFrame loop.
  useEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;
    quickX.current = gsap.quickTo(el, "x", { duration, ease });
    quickY.current = gsap.quickTo(el, "y", { duration, ease });
  }, [duration, ease]);

  const setTarget = (e: MouseEvent<HTMLDivElement>) => {
    quickX.current?.(e.clientX + offset.x);
    quickY.current?.(e.clientY + offset.y);
  };

  return (
    <div
      className={className}
      onMouseEnter={(e) => {
        const el = tooltipRef.current;
        if (el) {
          // Snap instantly on entry instead of tweening in from wherever it
          // last was. gsap.set writes straight into GSAP's own transform
          // cache, so the next quickTo call correctly tweens onward from here.
          gsap.set(el, { x: e.clientX + offset.x, y: e.clientY + offset.y });
        }
        setVisible(true);
      }}
      onMouseMove={setTarget}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <div
        ref={tooltipRef}
        // Always mounted (never conditionally rendered) so the ref is never
        // null and the pill is already in place the instant it fades in.
        className={`fixed top-0 left-0 z-50 pointer-events-none text-subtitle bg-accent text-text-inverse px-3 py-1.5 rounded-sm transition-opacity duration-150 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
