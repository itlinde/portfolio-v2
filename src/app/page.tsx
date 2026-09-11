import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkCard from "@/components/WorkCard";
import SmallProjectItem from "@/app/_components/SmallProjectItem";

export default function Home() {
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
              <p>All</p>
              <p>Engineering</p>
              <p>Design</p>
            </div>
          </div>
          <div id="work-cards" className="flex flex-col gap-8">
            <WorkCard
              title="Gravit-e Technologies Inc."
              description="Squashed bugs and caught edge cases across 20+ projects in custom software development."
              tags={["qa", "minor software development", "co-op"]}
              date="summer - fall 2025"
              link="https://www.gravit-e.ca/"
              image={{ src: "/gravit-e-logo.webp", alt: "gravit-e logo" }}
              tooltipContent="click to learn more"
            />
            <WorkCard
              title="Lew's Workshop"
              description="Built and designed a make-your-own keychain site from start to finish."
              tags={["web development", "product design", "supabase", "next.js", "figma"]}
              date="summer - fall 2025"
              link="https://www.lewswork.shop/"
              image= {{ src: "/lews-logo.svg", alt: "lew's workshop logo" }}
              // video={{ src: "/lews-demo-1.mov" }}
              tooltipContent="click to open site"
            />
            {/* <WorkCard
              title="Drift"
              description="Designed an app to simplify trip-planning for spontaneous travellers."
              tags={["ux research", "interaction design", "figma"]}
              date="summer - fall 2025"
              link="https://www.lewswork.shop/"
              image= {{ src: "/lews-logo.svg", alt: "lew's workshop logo" }}
              // video={{ src: "/lews-demo-1.mov" }}
              tooltipContent="click to open prototype"
            /> */}
          </div>
          <div id="small-projs" className="min-h-screen flex flex-col place-content-center">
            <div className="mb-8">
              <h4 className="text-h4 mb-2">
                Exploration
              </h4>
              <p className="text-body-sans text-text-muted">
                Smaller projects, experiments, and trying new things! Click on one to learn more.
              </p>
            </div>
            <div id="small-proj-list" className="flex flex-col gap-4">
              <SmallProjectItem
                title="UBC Engineering Undergrad Society | Week E⁰ 2026 Site"
                date="2026"
                tags={["webflow"]}
                link="https://weeke0.ubcengineers.ca/"
                tooltipContent="live site"
              />
              <SmallProjectItem
                title="Line Following Robot"
                date="2025"
                tags={["arduino", "c++"]}
                link="https://github.com/itlinde/line-following-robot"
                tooltipContent="see github"
              />
              { /* don't have a github I can link to rn */ }
              {/* <SmallProjectItem
                title="Fictional Bakery Database"
                date="2025"
                tags={["relational database", "mysql"]}
                tooltipContent=""
              /> */}
              <SmallProjectItem
                title="Mastery Tracker"
                date="2024"
                tags={["ios application", "swift"]}
                link="https://github.com/itlinde/mastery-tracker-app"
                tooltipContent="see github"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
