import Header from "@/components/Header";
import Image from "next/image";
import WorkCard from "@/components/WorkCard";

export default function LewsWorkshop() {
  return (
    <div>
      <Header/>
      <main className="flex flex-col place-self-center min-w-3/4 max-w-lg text-text-main mt-38">
      <section id="intro" className="flex flex-col gap-6">
        <div className="flex gap-6">
          <p className="text-subtitle text-text-body">
            design & development
          </p>
          <p className="text-subtitle text-text-muted">
            2025
          </p>
        </div>
        <h2 className="text-h2 pb-8">
          Lew's Workshop
        </h2>
        <div className="flex gap-8">
          <div className="flex flex-col gap-4">
            <hr className="border-line" />
            <p className="text-subtitle text-text-muted">
              overview
            </p>
            <p className="text-body-serif text-text-body">
                Lew's Workshop is an e-commerce platform where users can create and 
                purchase their own custom-made jewelry.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <hr className="border-line" />
            <p className="text-subtitle text-text-muted">
              contribution
            </p>
            <p className="text-body-serif text-text-body">
                I designed and developed the online environment where customers 
                build creations and an admin portal to streamline manufacturing.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <hr className="border-line" />
            <p className="text-subtitle text-text-muted whitespace-nowrap">
              see it in action
            </p>
            <a href="" className="flex gap-2 text-body-serif items-center text-text-body">
              <p>
                Live Site
              </p>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.618652 11.6067L11.3503 0.875M0.618652 0.875L11.3503 0.875V11.6067" stroke="#8D8D8C" strokeWidth="1.75"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
      <section id="main-content">
        <div className="">
          <Image
            src="/lews-mockup.png"
            alt="Lew's Workshop product mockup"
            width={2560}
            height={1440}
            className="w-full h-auto my-18"
          />
          <p className="text-subtitle text-text-muted pb-2">
            mission
          </p>
          <h5 className="text-h5 pb-4">
            Bring the physical make-your-own jewelry experience to the digital world
          </h5>
          <p className="text-body-sans text-text-body">
            Many brick and mortar shops offer ‘make your own jewelry’ experiences where visitors 
            craft their own beaded jewelry by hand, but our team couldn’t find a single online space 
            that offered the same. 
          </p>
          <div className="bg-bg-muted w-full h-96 my-18">
            2 pics of beadworks 
          </div>
          <p className="text-subtitle text-text-muted pb-2">
            insight???
          </p>
          <h5 className="text-h5 pb-4">
            ummmmmmm....wip
          </h5>
          <p className="text-body-sans text-text-body">
            Many brick and mortar shops offer ‘make your own jewelry’ experiences where visitors 
            craft their own beaded jewelry by hand, but our team couldn’t find a single online space 
            that offered the same. 
          </p>
        </div>
        <div id="up-next">
          <hr className="border-line mt-12 mb-8"/>
          <p className="text-subtitle text-text-muted my-4">
            next
          </p>
          <WorkCard
            title="Gravit-e Technologies Inc."
            description="Squashed bugs and caught edge cases across 20+ projects in custom software development."
            tags={["qa", "minor software development", "co-op"]}
            date="summer - fall 2025"
            link="/gravit-e"
            tooltipContent="click to open"
          />
        </div>
      </section>
      </main>
    </div>
  );
}
