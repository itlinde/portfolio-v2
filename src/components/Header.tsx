"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

interface HeaderProps {
  /** Only the homepage has a `#work-heading` to watch — pages without it
   * must not opt in, or ScrollTrigger creates a dangling instance with
   * nothing to measure. Defaults to off. */
  enableWorkReveal?: boolean;
  shadowTrigger?: string;
}

export default function Header({ enableWorkReveal = false, shadowTrigger }: HeaderProps) {
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


  // make grey blob appear after scrolling past a certain point (can customize the point )
  useEffect(() => {
    if (!shadowTrigger) return;

    // gsap doesn't work well with css vars, so we're pre-reading the var values and passing them to gsap later
    const styles = getComputedStyle(document.documentElement);
    const textBodyColor = styles.getPropertyValue('--color-text-body').trim();
    const textMutedColor = styles.getPropertyValue('--color-text-muted').trim();

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: shadowTrigger,
      start: "top 15%",
      onEnter: () => {
        gsap.set("#nav-bg", {
          scaleX: 0,
        })
        gsap.to("#nav-bg", {
          duration: 0.3,
          scaleX: 1,
          ease: "power3.out",
          overwrite: "auto",
        })
        gsap.to("#nav-bar", {
          duration: 0.3,
          color: textBodyColor,
        })
      },
      onLeaveBack: () => {
        gsap.to("#nav-bg", {
          duration: 0.3,
          ease: "power3.in",
          scaleX: 0,
          overwrite: "auto",
        })
        gsap.to("#nav-bar", {
          duration: 1,
          color: textMutedColor,
        })
      }
    })

    return () => trigger.kill();
  }, [shadowTrigger])

  // must always be clear unless scrolling past a certain point 

  return (
    <div
      id="header"
      className="grid grid-cols-[1fr_auto_1fr] items-center p-7 fixed top-0 left-0 right-0 z-40"
    >
      <a href="/" className="text-body-serif justify-self-start px-2 py-1 bg-bg rounded-xs text-text-muted">
        Isabella Linde
      </a>
      { /* TO DO: make the grey bubble only appear after scrolling down the page a certain amount. 
                  make sure the point at which the grey thing appears can be customized per page */ }
      <div id="nav-bar" className="flex gap-8 justify-self-center px-4 py-2 relative text-text-muted">
        <Link href="/about/#" className="text-body-serif">
          me
        </Link>
        <Link href="/#work" className="text-body-serif ">
          work
        </Link>
        <Link href="/creating" className="text-body-serif">
          constantly creating
        </Link>
        <div id="nav-bg" className="bg-bg-muted scale-x-0 origin-center absolute inset-0 -z-1 rounded-3xl pointer-events-none"/>
      </div>
      <a // using a instead of Link here bc 'a' handles the href conditional, which Link doesn't
        ref={cornerRef}
        href={showWork ? "/#work" : undefined}
        className={
          showWork
            ? "text-h1 absolute right-6 top-1/2 -translate-y-1/2"
            : "text-body-serif justify-self-end text-text-muted"
        }
      >
        © 2026
      </a>
    </div>
  );
}
