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
      <main className="scroll-fade flex flex-col place-self-center pt-20 text-body-serif mx-12 max-w-prose pb-32 text-pretty">
        <Image
              id="me-pic"
              src="/me.png"
              alt="picture of me!"
              width="450"
              height="450"
              className="object-cover rounded-md w-96 h-96 place-self-center my-16"
        />
        <p className="text-text-main">
          {ABOUT.greeting}
        </p>
        <p className="text-body-serif text-text-muted pb-8">
          {ABOUT.subheading}
        </p>
        <div id="main-text" className="flex flex-col gap-4">
          <p className="">
            {ABOUT.body}
          </p>
          <p className="">
            {ABOUT.body2}
          </p>
          <p className="">
            {ABOUT.body3}
          </p>
          <p className="">
            {ABOUT.body4}
          </p>
        </div>
      </main>
      {/* <Footer/> */}
    </>
  )
}
