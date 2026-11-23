import Image from "next/image";
import { EDUCATION, INTERESTS, LANGUAGES, LEADERSHIP, PROFILE, SKILLS } from "../data";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" data-bg-mode="flow" className="veil overflow-x-clip [--veil:0.42]">
      <div className="mx-auto max-w-6xl px-4 py-28 sm:px-8 sm:py-36">
        <SectionHeading
          label="About"
          title={
            <>
              Built in
              <br />
              <em>Accra</em>.
            </>
          }
        />

        <div className="grid gap-14 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-20">
          <Reveal>
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line-strong bg-surface">
                <Image
                  src="/profile.jpg"
                  alt={`Portrait of ${PROFILE.name}`}
                  fill
                  sizes="(min-width: 768px) 20rem, 100vw"
                  className="object-cover grayscale-[35%] transition-all duration-700 hover:grayscale-0"
                />
              </div>
              <figcaption className="mt-4 flex justify-between font-mono text-xs text-faint">
                <span>{PROFILE.name}</span>
                <span>KNUST &apos;27 · Level 400</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="text-scrim">
            <Reveal className="space-y-6 text-lg leading-relaxed text-muted">
              <p>
                <span className="text-fg">
                  I&apos;m a fourth-year (Level 400) Computer Science student at KNUST with hands-on experience across backend, full-stack, applied machine learning, and embedded systems.
                </span>{" "}
                I like owning a project end to end — from backend architecture and deployment to ongoing production support using Node.js/Next.js, PostgreSQL/Supabase, and Railway.
              </p>
              <p>
                I co-founded <span className="text-fg">Cipher</span> (Decimal.Inc Ltd), building cybersecurity and secure file-collaboration tools. I gained in-person internship experience as a backend/full-stack developer at <span className="text-fg">Glinax</span> (training the Cerkyl education AI and building the Ashanti Civic regional reporting platform), and have freelanced since 2024 delivering client systems for businesses like Itzzz Meera sewing studio and shipping businesses.
              </p>
              <p>
                Away from the keyboard I serve as Campus Lead for the NextMakers Foundation, previously as General Secretary of the Ghana Muslim Students Association and Second-in-Command of the Mfantsipim Army Cadet Corps.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-12 sm:grid-cols-2">
              <Reveal>
                <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-faint">Education</h3>
                <ul className="space-y-5">
                  {EDUCATION.map((e) => (
                    <li key={e.title}>
                      <p className="text-fg">{e.title}</p>
                      <p className="text-sm text-muted">{e.org}</p>
                      <p className="mt-1 font-mono text-xs text-accent">{e.when}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.08}>
                <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-faint">Leadership & Activities</h3>
                <ul className="space-y-3">
                  {LEADERSHIP.map((l) => (
                    <li key={l} className="flex gap-3 text-sm text-muted">
                      <span className="text-accent">✦</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="mt-12 grid gap-8 border-t border-line/60 pt-8 sm:grid-cols-2">
              <Reveal delay={0.12}>
                <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <span key={lang.name} className="rounded-md border border-line-strong bg-surface-2/60 px-2.5 py-1 font-mono text-xs text-fg">
                      {lang.name} <span className="text-accent">({lang.level})</span>
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.16}>
                <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((item) => (
                    <span key={item} className="rounded-md border border-line-strong bg-surface-2/60 px-2.5 py-1 font-mono text-xs text-muted">
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {SKILLS.map((g, i) => (
            <Reveal
              key={g.group}
              delay={i * 0.05}
              className={`bg-bg p-6 ${i === SKILLS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">{g.group}</h3>
              <ul className="space-y-1.5">
                {g.items.map((s) => (
                  <li key={s} className="text-sm text-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
