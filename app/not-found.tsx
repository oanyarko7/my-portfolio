import type { Metadata } from "next";
import Link from "next/link";
import { PROFILE } from "./data";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="grain relative flex min-h-screen flex-col overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-70" aria-hidden />

      <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-2 font-mono text-sm">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent font-bold text-accent-ink transition-transform group-hover:-rotate-6">
            N
          </span>
          <span className="text-fg">oanyarko7</span>
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-24 sm:px-8">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent">Error 404</p>
        <h1 className="font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.92] tracking-tight text-fg [text-wrap:balance]">
          This page <em className="text-accent">didn&apos;t</em> stay up.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
          The link may be old, or the address mistyped. Everything that exists is on the home page.
        </p>

        <figure
          aria-label="Terminal showing that the page was not found"
          className="mt-10 w-full max-w-lg overflow-hidden rounded-xl border border-line-strong bg-surface/85"
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-term-red" />
            <span className="h-2.5 w-2.5 rounded-full bg-term-yellow" />
            <span className="h-2.5 w-2.5 rounded-full bg-term-green" />
            <span className="ml-2 font-mono text-[11px] text-faint">~/</span>
          </div>
          <div className="space-y-1 px-4 py-4 font-mono text-[13px] leading-relaxed sm:px-5">
            <div className="text-fg">
              <span className="text-term-prompt">$ </span>curl -I this-page
            </div>
            <div className="text-alert">HTTP/1.1 404 Not Found</div>
            <div className="pt-2.5 text-fg" aria-hidden>
              <span className="text-term-prompt">$ </span>
              <span className="term-cursor" />
            </div>
          </div>
        </figure>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            Back to the home page
          </Link>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm text-fg transition-colors hover:border-fg"
          >
            See the work
          </Link>
          <a
            href={`mailto:${PROFILE.email}`}
            className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            Report a broken link
          </a>
        </div>
      </div>
    </main>
  );
}
