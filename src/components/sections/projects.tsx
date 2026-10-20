import { projects } from "@/content/profile";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";

export function Projects() {
  return (
    <Section id="projects" ariaLabelledBy="projects-heading">
      <SectionHeading
        id="projects-heading"
        eyebrow="03 / Selected work"
        title="What I've actually shipped"
        lede="Every item below is tied to a real engagement — detection built, systems tested, or identity hardened. No demo-ware."
        accent="blue"
      />

      <div className="mt-10 grid gap-[var(--space-grid-gap)] sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.08} className={p.id === "purple-team" ? "sm:col-span-2 lg:col-span-2" : undefined}>
            <ProjectCard
              index={i + 1}
              title={p.title}
              context={p.context}
              blurb={p.blurb}
              bullets={p.bullets}
              stack={p.stack}
              accent={p.accent}
              metric={p.metric}
              featured={p.id === "purple-team"}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
