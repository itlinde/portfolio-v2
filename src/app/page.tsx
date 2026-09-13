"use client"

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkCard from "@/components/WorkCard";
import SmallProjectItem from "@/app/_components/SmallProjectItem";
import PROJECTS from "@/lib/project-list";
import { Project, ProjectType } from "@/types/project";

export default function Home() {
  const [filter, setFilter] = useState<'all' | ProjectType>('all');

  const filterOptions = ['all', 'engineering', 'design']

  return (
    <div className="">
      <Header enableWorkReveal />
      <main className="p-6">
        <section id="hero" className="h-screen py-32 flex flex-col gap-8 pt-[40vh] mb-16 place-self-center">
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
              projects and experience
            </h3>
            <div id="filter-bar" className="flex gap-6 text-text-muted">
              <p className="text-subtitle text-text-body">filter:</p>
              {filterOptions.map((option: String, index) => {
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
                <WorkCard
                  key={project.title}
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
          <div id="small-projs" className="min-h-screen py-32 flex flex-col place-content-center">
            <div className="mb-8">
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
                  <SmallProjectItem
                    key={project.title}
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
