import WorkCard from "@/app/components/WorkCard";
import SmallProjectItem from "@/app/components/SmallProjectItem";

export default function Home() {
  return (
    <div className="">
      <div id="header" className="grid grid-cols-[1fr_auto_1fr] items-center p-6">
        <a href="#" className="text-body-serif justify-self-start">
          Isabella Linde
        </a>
        <div className="flex gap-8 justify-self-center">
          <a href="#" className="text-body-serif">
            me
          </a>
          <a href="#" className="text-body-serif ">
            work
          </a>
          <a href="#" className="text-body-serif">
            constantly creating
          </a>
        </div>
        <p className="text-body-serif justify-self-end">© 2026</p>
      </div>
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
        <section id="work" className="flex flex-col place-self-center min-w-3/4">
          <div id="work-header" className="flex flex-col gap-4 pb-14">
            <h3 className="text-h3">
              Continuously Learning
            </h3>
            <div id="filter-bar" className="flex gap-6 text-text-muted">
              <p className="text-subtitle text-text-body">filter:</p>
              <p>All</p>
              <p>Engineering</p>
              <p>Design</p>
            </div>
          </div>
          <div id="work-cards" className="flex flex-col gap-8">
            <WorkCard
              title="Gravit-e Technologies Inc."
              description="Squashing bugs and catching edge cases across 20+ projects in custom software development."
              tags={["qa", "minor software development", "co-op"]}
              date="summer - fall 2025"
            />
          </div>
          <div id="small-projs" className="min-h-screen flex flex-col place-content-center">
            <div className="mb-8">
              <h4 className="text-h4 mb-2">
                Exploration
              </h4>
              <p className="text-text-muted">
                Smaller projects, experiments, and trying new things!
              </p>
            </div>
            <div id="small-proj-list" className="flex flex-col gap-4">
              <SmallProjectItem
                title="Line Following Robot"
                date="2025"
                tags={["arduino", "c++"]}
              />
            </div>
          </div>
        </section>
      </main>
      <div id="footer" className="bg-bg-inverse min-h-[70vh] w-full text-text-inverse flex flex-col p-6 justify-between">
        <div id="contact" className="flex flex-col gap-4">
          <hr className="border-line-inverse" />
          <p className="text-subtitle text-text-inverse">
            contact
          </p>
          <a href="mailto:isabellalinde1770@gmail.com" className="text-h3 text-text-inverse">
            isabellalinde1770@gmail.com
          </a>
          <a href="https://www.linkedin.com/in/isabellalinde/" className="text-h3 text-text-inverse">
          LinkedIn
          </a>
        </div>
        <div id="footer-bottom" className="flex flex-col gap-4">
          <p className="text-subtitle text-text-inverse">
            made with next.js, figma, claude and lots of love :)
          </p>
          <hr className="border-line-inverse" />
          <div className="flex justify-between">
            <p className="text-subtitle">
              last updated: { /* TO DO: make this last updated string actually update */ "september 07 2026" }
            </p>
            <a href="#top" className="flex items-center gap-1">
              <p className="text-subtitle">top</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
