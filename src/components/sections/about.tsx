import { about, leadership } from "@/content/profile";
import { Section, SectionHeading, StatWell } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export function About() {
  return (
    <Section id="about" ariaLabelledBy="about-heading">
      <SectionHeading
        id="about-heading"
        eyebrow="01 / About"
        title={about.heading}
        accent="blue"
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <RevealGroup className="flex flex-col gap-5">
          {about.paragraphs.map((p, i) => (
            <RevealItem key={i} blur={false}>
              <p className="max-w-[72ch] [font-size:var(--text-body)] leading-[1.65] text-[var(--color-text-secondary)]">
                {p}
              </p>
            </RevealItem>
          ))}
          <RevealItem blur={false}>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {leadership.map((l) => (
                <p key={l.org} className="[font-size:var(--text-body-sm)] text-[var(--color-text-muted)]">
                  <span className="text-[var(--color-text-secondary)]">{l.role}</span> — {l.org}
                </p>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            {about.stats.map((s, i) => (
              <StatWell
                key={i}
                value={s.value}
                label={s.label}
                tone={i % 2 === 0 ? "blue" : "green"}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
