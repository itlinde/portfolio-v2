"use client"

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkCard from "@/components/WorkCard";
import SmallProjectItem from "@/app/_components/SmallProjectItem";
import PROJECTS from "@/lib/project-list";
import { Project } from "@/types/project";

export default function Home() {
  const [filter, setFilter] = useState('');

  function updateFilters() {
    
  }

  return (
    <div className="">
      <Header enableWorkReveal />
      <main className="p-6">
        <section id="hero" className="h-screen flex flex-col gap-8 pt-[40vh] mb-16 place-self-center">
          <h3 className="text-h3 text-center">
            hopelessly devoted to details.
          </h3>
          <div className="place-self-center text-body-serif max-w-[90vw] min-w-[50vw] flex justify-between w-fill">
            <div className="flex flex-col text-start">
              <p>Computer Engineering Student</p>
              <p>& Developer and Product Designer</p>
            </div>
            <div className="flex flex-col text-end">
              <p>@ University of British Columbia</p>
              <p>based in Vancouver, Canada</p>
            </div>
          </div>
        </section>
        <section id="work" className="flex flex-col place-self-center min-w-3/4 scroll-mt-36">
          <div id="work-header" className="flex flex-col gap-4 pb-14">
            <h3 id="work-heading" className="text-h3">
              Projects and Experience
            </h3>
            <div id="filter-bar" className="flex gap-6 text-text-muted">
              <p className="text-subtitle text-text-body">filter:</p>
              <p onClick="">
                All
              </p>
              <p>
                Engineering
              </p>
              <p>
                Design
              </p>
            </div>
          </div>
          <div id="work-cards" className="flex flex-col gap-8">
            { PROJECTS
              .filter( project => project.mainProject ) // only show projs where mainProject = true
              .map ((project: Project) => {
              return (
                <WorkCard
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  date={project.date}
                  link={project.link}
                  image={project.image}
                  tooltipContent={project.tooltipContent}
                />
              )}
            )}
          </div>
          <div id="small-projs" className="min-h-screen flex flex-col place-content-center">
            <div className="mb-8">
              <h4 className="text-h4 mb-2">
                Exploration
              </h4>
              <p className="text-body-sans text-text-muted">
                Smaller projects, experiments, and trying new things! Click one to open.
              </p>
            </div>
            <div id="small-proj-list" className="flex flex-col gap-4">
              { PROJECTS
                .filter( project => !project.mainProject ) // only show projs where mainProject != true
                .map ((project: Project) => {
                return (
                  <SmallProjectItem
                    title={project.title}
                    date={project.date}
                    tags={project.tags}
                    link={project.link}
                    tooltipContent={project.tooltipContent}
                  />
                )}
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
