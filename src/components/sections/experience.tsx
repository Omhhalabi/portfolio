import { experience, education } from "@/content/profile";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { TimelineItem } from "@/components/ui/timeline-item";
import { Reveal } from "@/components/ui/reveal";

export function Experience() {
  return (
    <Section id="experience" ariaLabelledBy="experience-heading">
      <SectionHeading
        id="experience-heading"
        eyebrow="05 / Path"
        title="How I got here"
        accent="blue"
      />

      <div className="mt-10 max-w-3xl">
        {experience.map((e, i) => (
          <TimelineItem
            key={e.id}
            period={`${e.start} — ${e.end}`}
            role={e.role}
            org={e.company}
            location={e.location}
            bullets={e.highlights}
            tags={e.tags}
            current={e.current}
            index={i}
            isLast={i === experience.length - 1}
          />
        ))}
      </div>

      <Reveal delay={0.1} className="mt-4 max-w-3xl">
        <h3 className="mono-label text-[var(--color-text-muted)]">Education</h3>
        <div className="section-divider mt-3 mb-5" />
        <div className="grid gap-4 sm:grid-cols-2">
          {education.map((ed) => (
            <div
              key={ed.institution}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-overlay)] p-5"
            >
              <span className="mono-label text-[var(--color-text-muted)]">
                {ed.start} — {ed.end}
              </span>
              <h4 className="mt-1.5 [font-size:var(--text-h3)] font-medium text-[var(--color-text-primary)]">
                {ed.degree}
              </h4>
              <p className="mt-1 [font-size:var(--text-body-sm)] text-[var(--color-text-secondary)]">
                {ed.field}
              </p>
              <p className="mt-1 [font-size:var(--text-body-sm)] text-[var(--color-text-muted)]">
                {ed.institution}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
