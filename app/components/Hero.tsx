"use client";
import { PROFILE } from "../data";
import { useCopy } from "./useCopy";
import TypedTerminal from "./TypedTerminal";
import WordReveal from "./WordReveal";

// Supporting content eases in with CSS (plays before hydration). The headline itself never waits.
const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default function Hero() {
  const { copied, copy } = useCopy();

  return (
    <section
      id="top"
      data-bg-mode="rain"
      className="relative overflow-hidden pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-24"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-70" aria-hidden />
      <div className="scrim pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          {/* Left Column: Role, Headline, Bio, CTAs */}
          <div className="flex flex-col">
            <div style={delay(0)} className="rise mb-4 flex flex-wrap items-center gap-3 font-mono text-xs text-muted sm:mb-5 sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {PROFILE.role} · {PROFILE.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden />
                {PROFILE.availability}
              </span>
            </div>

            <WordReveal
              as="h1"
              by="char"
              label="I build software that stays up."
              delay={0.2}
              className="font-serif text-[clamp(2.75rem,5vw,5.25rem)] leading-[0.95] tracking-[-0.02em] text-fg [text-wrap:balance]"
            >
              I build software <span className="sm:block">that <em className="text-accent">stays up.</em></span>
            </WordReveal>

            <div style={delay(0.6)} className="rise mt-6 sm:mt-8">
              <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                I&apos;m <span className="text-fg">{PROFILE.name}</span>. I co-founded{" "}
                <span className="text-fg">Cipher</span>, interned at <span className="text-fg">Glinax</span>, build client systems end to end, and spend a lot of time making
                production deployments behave. From the database schema to the deploy pipeline to the email that has to
                actually arrive.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition-transform hover:-translate-y-0.5"
                >
                  See the work
                  <span aria-hidden className="transition-transform group-hover:translate-y-0.5">↓</span>
                </a>
                <a
                  href={PROFILE.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm text-fg transition-colors hover:border-fg"
                >
                  Download CV <span className="sr-only">(PDF, opens in a new tab)</span>
                </a>
                <button
                  onClick={() => copy(PROFILE.email)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-mono text-xs text-muted transition-colors hover:text-fg"
                  aria-label={copied ? "Email address copied" : `Copy email address ${PROFILE.email}`}
                >
                  <span aria-live="polite">{copied ? "✓ copied" : "copy email"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Typed Terminal raised up to the level of the headline */}
          <div className="md:pt-1 lg:pt-2">
            <TypedTerminal style={delay(0.35)} />
          </div>
        </div>
      </div>
    </section>
  );
}
