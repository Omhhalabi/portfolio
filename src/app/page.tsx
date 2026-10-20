import { NavBar } from "@/components/ui/nav-bar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { AIWorkflow } from "@/components/sections/ai-workflow";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main id="main">
        <Hero />
        <About />
        <AIWorkflow />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
