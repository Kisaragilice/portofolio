import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Toolkit } from "@/sections/Toolkit";
import { Projects } from "@/sections/Projects";
import { Now } from "@/sections/Now";
import { Contact } from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Toolkit />
      <Projects />
      <Now />
      <Contact />
    </>
  );
}
