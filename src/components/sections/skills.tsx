import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { skillGroups, certifications } from "@/content/profile";
import { Section, SectionHeading, Chip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const ICON_MAP: Record<string, LucideIcon> = {
  radar: Icons.Radar,
  crosshair: Icons.Crosshair,
  cloud: Icons.Cloud,
  network: Icons.Network,
  bot: Icons.Bot,
  "file-text": Icons.FileText,
};

/**
 * Skills — §7.5, adapted. LinkedIn gives exactly three "Top Skills" and no
 * numeric proficiency for anything else, so this renders categorised skill
 * chips (top skills get an accent badge) rather than the spec's 1–5 meter,
 * which would fabricate precision the source data doesn't have. See
 * docs/IMPLEMENTATION_NOTES.md (D6).
 */
export function Skills() {
  return (
    <Section id="skills" ariaLabelledBy="skills-heading">
      <SectionHeading
        id="skills-heading"
        eyebrow="04 / Skills"
        title="What I'm actually good at"
        lede="LinkedIn's Top Skills are marked. Everything else is grouped by discipline, not ranked by a number I can't back up."
        accent="green"
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, gi) => {
          const Icon = ICON_MAP[group.icon];
          const accentVar =
            group.accent === "green" ? "var(--color-accent-green)" : "var(--color-accent-blue)";
          return (
            <Reveal key={group.id} delay={Math.min(gi, 8) * 0.06}>
              <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-overlay)] p-5">
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon size={18} className="shrink-0" color={accentVar} />}
                  <h3 className="mono-label" style={{ color: accentVar }}>
                    {group.title}
                  </h3>
                </div>
                <ul className="mt-4 flex flex-col gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-center justify-between gap-2 [font-size:var(--text-body-sm)] text-[var(--color-text-secondary)]"
                    >
                      <span>{skill.name}</span>
                      {skill.top && (
                        <span className="mono-label shrink-0 text-[var(--color-text-muted)]">
                          top skill
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1} className="mt-10">
        <h3 className="mono-label text-[var(--color-text-muted)]">Certifications</h3>
        <div className="section-divider mt-3 mb-5" />
        <div className="flex flex-wrap gap-2.5">
          {certifications.map((c) => (
            <Chip key={c.name} tone="neutral" size="md">
              {c.name}
            </Chip>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
