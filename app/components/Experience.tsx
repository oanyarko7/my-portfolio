import { EXPERIENCE } from "../data";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  return (
    <section id="experience" data-bg-mode="currents" className="veil overflow-x-clip border-t border-line [--veil:0.15]">
      <div className="mx-auto max-w-6xl px-4 py-28 sm:px-8 sm:py-36">
        <SectionHeading
          scrim
          label="Experience"
          title={
            <>
              Where I&apos;ve <em>worked</em>.
            </>
          }
          aside="Startup co-founder, developer intern, and freelance engineering alongside a full-time degree."
        />

        <ol className="relative space-y-4">
          {EXPERIENCE.map((job, i) => (
            <Reveal key={job.title} delay={i * 0.08}>
              <li className="group grid gap-4 rounded-2xl border border-line bg-bg/75 p-6 transition-colors hover:border-line-strong sm:p-8 md:grid-cols-[11rem_1fr_1.3fr] md:gap-10">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">{job.when}</span>
                <div>
                  <h3 className="text-xl font-medium text-fg">{job.title}</h3>
                  <p className="mt-1 text-muted">{job.org}</p>
                </div>
                <div className="space-y-3">
                  <p className="leading-relaxed text-muted">{job.text}</p>
                  {job.highlights && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.highlights.map((h) => (
                        <span
                          key={h}
                          className="rounded-md border border-line-strong/80 bg-surface-2/70 px-2.5 py-0.5 font-mono text-[11px] text-accent"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
