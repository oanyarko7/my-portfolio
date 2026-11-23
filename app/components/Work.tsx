"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PROFILE, PROJECTS, type LogEntry, type Project } from "../data";
import ArchitectureFlow from "./ArchitectureFlow";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const TAG_STYLE: Record<LogEntry["tag"], string> = {
  FIX: "text-alert",
  REFACTOR: "text-atmos",
  SHIP: "text-accent",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{label}</dt>
      <dd className="text-fg/90">{children}</dd>
    </div>
  );
}

function Detail({ p }: { p: Project }) {
  return (
    <div className="grid gap-10 pb-12 pt-2 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:pl-[4.5rem]">
      <div className="space-y-6">
        <dl className="space-y-6">
          <Field label="Problem">{p.problem}</Field>
          <Field label="What it is">
            <span className="leading-relaxed">{p.summary}</span>
          </Field>
          <Field label="My contribution">
            <p className="mb-3">{p.role}</p>
            <ul className="space-y-2.5">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-muted">
                  <span className="mt-2.5 h-px w-3 shrink-0 bg-accent" aria-hidden />
                  {pt}
                </li>
              ))}
            </ul>
          </Field>
        </dl>
        {((p.links?.length ?? 0) > 0 || p.repo) && (
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {p.links?.map((l) => (
              <ExternalLink key={l.href} href={l.href}>
                {l.kind}: {l.label}
              </ExternalLink>
            ))}
            {p.repo && <ExternalLink href={p.repo}>Source on GitHub</ExternalLink>}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <dl className="grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          <Field label="Status">{p.status}</Field>
          <Field label="Stack">
            <span className="flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span key={s} className="rounded-md border border-line-strong px-2 py-0.5 font-mono text-xs text-muted">
                  {s}
                </span>
              ))}
            </span>
          </Field>
        </dl>

        {p.log && (
          <figure className="overflow-hidden rounded-xl border border-line bg-bg/90">
            <figcaption className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[11px]">
              <span className="text-faint">Engineering log: what broke and how I fixed it</span>
            </figcaption>
            <ol className="space-y-2.5 p-4 font-mono text-[12px] leading-relaxed">
              {p.log.map((entry, i) => (
                <li key={i} className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-2">
                  <span className={TAG_STYLE[entry.tag]}>[{entry.tag}]</span>
                  <span className="text-muted">{entry.text}</span>
                </li>
              ))}
            </ol>
          </figure>
        )}
      </div>

      {p.architecture && (
        <div className="md:col-span-2">
          <ArchitectureFlow arch={p.architecture} />
        </div>
      )}

      {p.images && p.images.length > 0 && (
        <ul className={`grid gap-4 md:col-span-2 ${p.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {p.images.map((img) => (
            <li key={img.src}>
              <figure>
                {/* Opens the full-size image in a new tab: simple, keyboard-friendly, no lightbox needed. */}
                <a
                  href={img.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-[21/10] overflow-hidden rounded-xl border border-line-strong bg-surface"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 34rem, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <span className="sr-only">(opens full size in a new tab)</span>
                </a>
                {img.caption && <figcaption className="mt-2 font-mono text-xs text-faint">{img.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 border-b border-accent pb-1 font-mono text-sm text-fg"
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

// Small markers on the row itself, so visitors see which projects have proof before opening them.
function Evidence({ p }: { p: Project }) {
  const items = [
    ...(p.links ?? []).map((l) => l.kind),
    p.architecture && "Architecture",
    p.repo && "Source",
    p.images?.length && `${p.images.length} ${p.images.length === 1 ? "image" : "images"}`,
  ].filter(Boolean) as string[];
  if (!items.length) return null;
  return (
    <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent/90">
      {items.map((t, idx) => (
        <span key={`${t}-${idx}`} className="inline-flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
          {t}
        </span>
      ))}
    </span>
  );
}

export default function Work() {
  const [open, setOpen] = useState<string | null>("cipher");

  // Open project directly if the URL hash targets it (e.g. #project-cipher or #cipher)
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#project-", "").replace("#", "");
      if (PROJECTS.some((p) => p.slug === hash)) {
        setOpen(hash);
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  // The command palette can open a specific project.
  useEffect(() => {
    const onOpen = (e: Event) => setOpen((e as CustomEvent<string>).detail);
    window.addEventListener("open-project", onOpen);
    return () => window.removeEventListener("open-project", onOpen);
  }, []);

  return (
    <section id="work" data-bg-mode="network" className="veil [--veil:0.38]">
      <div className="mx-auto max-w-6xl px-4 py-28 sm:px-8 sm:py-36">
        <SectionHeading
          label={`Selected work · ${String(PROJECTS.length).padStart(2, "0")}`}
          title={
            <>
              Things I&apos;ve <em>shipped</em>
              <br />
              &amp; kept running.
            </>
          }
          aside="A startup, client systems, products, hardware and ML. Open any project to see the problem, what I did, the stack and its current status."
        />

        <div className="border-t border-line">
          {PROJECTS.map((p, i) => {
            const isOpen = open === p.slug;
            return (
              <Reveal key={p.slug} delay={i * 0.04}>
                <article id={`project-${p.slug}`} className="border-b border-line">
                  <h3>
                    <button
                      onClick={() => setOpen(isOpen ? null : p.slug)}
                      aria-expanded={isOpen}
                      aria-controls={`panel-${p.slug}`}
                      className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 py-7 text-left sm:grid-cols-[3.5rem_minmax(0,1fr)_8rem_4rem_2rem] sm:gap-6 sm:py-9"
                    >
                      <span className="font-mono text-xs text-faint">{p.index}</span>
                      <span className="min-w-0">
                        <span
                          className={`block font-serif text-3xl leading-none transition-all duration-300 sm:text-5xl ${
                            isOpen ? "text-accent" : "text-fg group-hover:translate-x-2 group-hover:text-accent"
                          }`}
                        >
                          {p.title}
                          {p.featured && (
                            <span className="ml-3 inline-block -translate-y-2 rounded-full border border-highlight/40 px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-widest text-highlight sm:-translate-y-3">
                              Featured
                            </span>
                          )}
                        </span>
                        <span className="mt-2 block font-sans text-sm text-muted">{p.kicker}</span>
                        <Evidence p={p} />
                      </span>
                      <span className="hidden font-mono text-xs uppercase tracking-widest text-muted sm:block">
                        {p.category}
                      </span>
                      <span className="hidden font-mono text-xs text-muted sm:block">{p.year}</span>
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-full border text-lg transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 border-accent bg-accent text-accent-ink"
                            : "border-line-strong text-muted group-hover:border-fg group-hover:text-fg"
                        }`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                  </h3>

                  {/* Height animates with a CSS grid-rows transition; closed panels are inert and hidden from AT. */}
                <div
                  id={`panel-${p.slug}`}
                  role="region"
                  aria-label={`${p.title} details`}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <Detail p={p} />
                  </div>
                </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 flex justify-end">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-fg"
          >
            More repositories on GitHub
            <span aria-hidden className="text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
