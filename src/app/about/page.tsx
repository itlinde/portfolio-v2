"use client"

import Header from "@/components/Header";
import Image from "next/image";
import ABOUT from "@/lib/about";
import { useScrollFadeIn } from "@/lib/useScrollFadeIn";

export default function About() {
  useScrollFadeIn();

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
              className="scroll-fade object-cover w-96 h-96 place-self-center my-16 rounded-md"
        />
        <p className="scroll-fade text-text-main">
          {ABOUT.greeting}
        </p>
        <p className="scroll-fade text-body-serif text-text-muted pb-8">
          {ABOUT.subheading}
        </p>
        <div id="main-text" className="flex flex-col gap-4">
          <p className="scroll-fade">
            {ABOUT.body}
          </p>
          <p className="scroll-fade">
            {ABOUT.body2}
          </p>
          <p className="scroll-fade">
            {ABOUT.body3}
          </p>
        </div>
      </main>
      {/* <Footer/> */}
    </>
  )
}
