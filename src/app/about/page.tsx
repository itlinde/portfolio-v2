import Header from "@/components/Header";
import Image from "next/image";
import ABOUT from "@/lib/about";

export default function About() {
  return (
    <>
      <Header shadowTrigger="#me-pic"/>
      <main className="flex flex-col place-self-center mt-20 text-body-serif mx-12 max-w-prose pb-32 text-pretty">
        <Image 
              id="me-pic"
              src="/me.png"
              alt="picture of me!"
              width="450"
              height="450"
              className="object-cover place-self-center my-16 rounded-md"
        />
        <p className="text-text-main">
          {ABOUT.greeting}
        </p>
        <p className="text-body-serif text-text-muted pb-8">
          {ABOUT.subheading}
        </p>
        <div id="main-text" className="flex flex-col gap-4">
          <p>
            {ABOUT.body}
          </p>
          <p>
            {ABOUT.body2}
          </p>
          <p>
            {ABOUT.body3}
          </p>
        </div>
      </main>
      {/* <Footer/> */}
    </>
  )
}