"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

interface HeaderProps {
  /** Only the homepage has a `#work-heading` to watch — pages without it
   * must not opt in, or ScrollTrigger creates a dangling instance with
   * nothing to measure. Defaults to off. */
  enableWorkReveal?: boolean;
}

export default function Header({ enableWorkReveal = false }: HeaderProps) {
  const [showWork, setShowWork] = useState(false);
  const cornerRef = useRef<HTMLAnchorElement>(null);

  // GSAP owns this element's textContent after mount, imperatively, via
  // ScrambleTextPlugin — same pattern as CursorTooltip's direct DOM writes.
  // React only owns the `href` toggle below. Children stay a static literal
  // ("© 2026") so React never re-diffs this text node out from under GSAP.
  useEffect(() => {
    if (!enableWorkReveal) return;

    const el = cornerRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

    const trigger = ScrollTrigger.create({
      trigger: "#work-heading",
      start: "top center",
      onEnter: () => {
        setShowWork(true);
        gsap.to(el, {
          duration: 0.4,
          overwrite: "auto",
          scrambleText: {
            text: "Work",
            chars: "upperCase",
            revealDelay: 0,
            speed: 0.75,
          },
        });
      },
      onLeaveBack: () => {
        setShowWork(false);
        gsap.to(el, {
          duration: 0.4,
          overwrite: "auto",
          scrambleText: {
            text: "© 2026",
            chars: "upperCase",
            revealDelay: 0,
            speed: 0.75,
          },
        });
      },
    });

    return () => trigger.kill();
  }, [enableWorkReveal]);

  return (
    <div
      id="header"
      className="grid grid-cols-[1fr_auto_1fr] items-center p-7 fixed top-0 left-0 right-0 z-40"
    >
      <a href="/" className="text-body-serif justify-self-start px-2 py-1 bg-bg rounded-xs">
        Isabella Linde
      </a>
      { /* TO DO: make the grey bubble only appear after scrolling down the page a certain amount. 
                  make sure the point at which the grey thing appears can be customized per page */ }
      <div className="flex gap-8 justify-self-center px-4 py-2 bg-bg-muted rounded-3xl">
        <a href="#" className="text-body-serif">
          Me
        </a>
        <a href="/#work" className="text-body-serif ">
          Work
        </a>
        <a href="#" className="text-body-serif">
          Constantly Creating
        </a>
      </div>
      <a
        ref={cornerRef}
        href={showWork ? "#work" : undefined}
        className={
          showWork
            ? "text-h1 absolute right-6 top-1/2 -translate-y-1/2"
            : "text-body-serif justify-self-end"
        }
      >
        © 2026
      </a>
    </div>
  );
}
