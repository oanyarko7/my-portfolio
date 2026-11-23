"use client";
import { PROFILE } from "../data";
import Clock from "./Clock";
import Reveal from "./Reveal";
import WordReveal from "./WordReveal";
import { OPEN_PALETTE } from "./CommandPalette";
import { useCopy } from "./useCopy";

const LINKS = [
  { label: "GitHub", href: PROFILE.github },
  { label: "LinkedIn", href: PROFILE.linkedin },
  { label: "CV (PDF)", href: PROFILE.cv },
];

export default function Contact() {
  const { copied, copy } = useCopy();

  return (
    <section id="contact" data-bg-mode="quiet" className="veil relative overflow-hidden border-t border-line [--veil:0.1]">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-8 sm:pt-40">
        <Reveal>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent">Contact</p>
        </Reveal>
        <WordReveal delay={0.1} className="font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-tight text-fg">
          Got something
          <br />
          that needs to <em className="text-accent">ship?</em>
        </WordReveal>

        <Reveal delay={0.6} className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center">
          <a
            href={`mailto:${PROFILE.email}`}
            className="group inline-flex items-center gap-3 break-all text-xl text-fg sm:text-3xl"
          >
            <span className="border-b border-line-strong pb-1 transition-colors group-hover:border-accent">
              {PROFILE.email}
            </span>
            <span className="text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </a>
          <button
            onClick={() => copy(PROFILE.email)}
            className="self-start rounded-full border border-line-strong px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-fg sm:self-auto"
            aria-live="polite"
          >
            {copied ? "✓ copied" : "copy"}
          </button>
        </Reveal>

        <Reveal delay={0.15} className="mt-20 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-faint">Phone</p>
            <a href={`tel:${PROFILE.phone.replace(/\s/g, "")}`} className="text-fg hover:text-accent">
              {PROFILE.phone}
            </a>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-faint">Local time</p>
            <Clock className="font-mono text-fg" />
          </div>
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-faint">Elsewhere</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {LINKS.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-fg hover:text-accent">
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <footer className="mt-24 flex flex-col justify-between gap-3 font-mono text-xs text-faint sm:flex-row">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
            className="text-left text-faint transition-colors hover:text-fg focus-visible:outline-none focus-visible:text-fg"
          >
            Built with Next.js, Tailwind & a hand-written canvas engine · press ⌘K / Ctrl K
          </button>
        </footer>
      </div>
    </section>
  );
}
