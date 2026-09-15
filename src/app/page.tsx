"use client"

import { useState, useEffect, useRef } from 'react';
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkCard from "@/components/WorkCard";
import SmallProjectItem from "@/app/_components/SmallProjectItem";
import PROJECTS from "@/lib/project-list";
import { Project, ProjectType } from "@/types/project";
import { useScrollFadeIn } from "@/lib/useScrollFadeIn";

export default function Home() {
  const [filter, setFilter] = useState<'all' | ProjectType>('all');
  const heroRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);

  const filterOptions = ['all', 'engineering', 'design']

  // Page-load intro, one coordinated timeline:
  //  1. Hero heading splits into individual characters (SplitText). Each
  //     character is invisible until its own staggered turn, then fades in
  //     while scrambling from noise into itself — so the cascade is genuinely
  //     left-to-right, not one scramble across an already-fully-present
  //     string. FROM/TO text per character never changes length, so this
  //     never shifts layout (Header's ScrollTrigger measures this element
  //     via shadowTrigger="#hero-text").
  //  2. The four subheading lines fade in + slide up to their resting
  //     position, timed to start partway through the character cascade
  //     rather than waiting for it to fully finish.
  useEffect(() => {
    const heroEl = heroRef.current;
    const subheadingEl = subheadingRef.current;
    if (!heroEl) return;

    gsap.registerPlugin(ScrambleTextPlugin, SplitText);

    const split = new SplitText(heroEl, { type: "chars" });
    gsap.set(heroEl, { opacity: 1 });
    gsap.set(split.chars, { opacity: 0 });

    const stagger = 0.025;
    const tl = gsap.timeline();

    split.chars.forEach((char, i) => {
      const original = char.textContent ?? "";
      tl.to(
        char,
        {
          opacity: 1,
          duration: 0.4,
          scrambleText: {
            text: original,
            chars: "lowerCase",
            revealDelay: 0.1,
            speed: 0.6,
          },
        },
        i * stagger,
      );
    });

    if (subheadingEl) {
      const paragraphs = subheadingEl.querySelectorAll("p");
      gsap.set(paragraphs, { opacity: 0, y: 20 });
      tl.to(
        paragraphs,
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
        (split.chars.length * stagger) / 2, // midway through the character cascade
      );
    }

    return () => {
      tl.kill();
      split.revert();
    };
  }, []);

  useScrollFadeIn();

  return (
    <>
      <Header enableWorkReveal shadowTrigger="#hero-text" />
      <main className="p-6">
        <section id="hero" className="h-screen py-32 flex flex-col gap-8 pt-[40vh] mb-16 place-self-center">
          <h3 ref={heroRef} id="hero-text" className="text-h3 text-center opacity-0">
            hopelessly devoted to details.
          </h3>
          <div ref={subheadingRef} className="place-self-center text-body-serif max-w-[90vw] min-w-[50vw] flex justify-between w-fill">
            <div className="flex flex-col text-start">
              <p className="opacity-0">Computer Engineering Student</p>
              <p className="opacity-0">& Developer and Product Designer</p>
            </div>
            <div className="flex flex-col text-end">
              <p className="opacity-0">@ University of British Columbia</p>
              <p className="opacity-0">based in Vancouver, Canada</p>
            </div>
          </div>
        </section>
        <section id="work" className="flex flex-col place-self-center min-w-3/4 scroll-mt-36">
          <div id="work-header" className="scroll-fade flex flex-col gap-4 pb-14">
            <h3 id="work-heading" className="text-h3">
              projects and experience
            </h3>
            <div id="filter-bar" className="flex gap-6 text-text-muted">
              <p className="text-subtitle text-text-body">filter:</p>
              {filterOptions.map((option: string, index) => {
                return (
                  <button 
                      key={option}
                      onClick={() => { setFilter(option as ProjectType)}} 
                      className={`cursor-pointer ${filter === option ? "font-medium text-text-body" : "font-normal"}`}>
                {option}
              </button>
                )
              })}
            </div>
          </div>
          <div id="work-cards" className="flex flex-col gap-8">
            { PROJECTS
              .filter( project => project.mainProject   // only show projs where mainProject = true
                && ( filter === 'all' || project.types.includes(filter) )) // checks the first OR conditional -> if first conditional is true, the next one gets skipped n keeps going 
                                                                // .: since filter === all will always be true when filter is 'all', the .includes() never runs 
                                                                // if filter != 'all', the next part gets evaluated & .includes applies the filter 
              .map ((project: Project) => {
              return (
                <div key={project.title} className="scroll-fade">
                  <WorkCard
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    date={project.date}
                    link={project.link}
                    image={project.image}
                    tooltipContent={project.tooltipContent}
                  />
                </div>
              )}
            )}
          </div>
          <div id="small-projs" className="min-h-screen py-32 flex flex-col place-content-center">
            <div className="scroll-fade mb-8">
              <h4 className="text-h4 mb-2">
                exploration
              </h4>
              <p className="text-body-sans text-text-muted">
                smaller projects, experiments, and trying new things! click one to open.
              </p>
            </div>
            <div id="small-proj-list" className="flex flex-col gap-4">
              { PROJECTS
                .filter( project => !project.mainProject ) // only show projs where mainProject != true
                .map ((project: Project) => {
                return (
                  <div key={project.title} className="scroll-fade">
                    <SmallProjectItem
                      title={project.title}
                      date={project.date}
                      tags={project.tags}
                      link={project.link}
                      tooltipContent={project.tooltipContent}
                    />
                  </div>
                )}
              )}
            </div>
          </div>
        </section>
      </main>
      <div className="">
        <Footer />
      </div>
    </>
  );
}
