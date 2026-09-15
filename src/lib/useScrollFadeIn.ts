"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Reveals every element matching `selector` as it individually scrolls into
 * view — fade up, once, no hide-on-scroll-back-up. Elements already within
 * the trigger threshold at mount reveal immediately (the "on load" half of
 * "fade in on load/scroll"); anything further down reveals as the user
 * scrolls to it. Mark elements with the default ".scroll-fade" class, or
 * pass a different selector to scope it to one page/section.
 */
export function useScrollFadeIn(selector: string = ".scroll-fade") {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const els = gsap.utils.toArray<HTMLElement>(selector);
    if (els.length === 0) return;

    gsap.set(els, { opacity: 0, y: 30 });

    const triggers = ScrollTrigger.batch(els, {
      start: "top 85%",
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          overwrite: "auto",
          clearProps: "transform",
        });
      },
    });

    return () => triggers.forEach((t) => t.kill()); // run gsap, then kill gsap instances so they're not floating aroound in the dom
  }, [selector]);
}
