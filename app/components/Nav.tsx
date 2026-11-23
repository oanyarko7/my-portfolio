"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Clock from "./Clock";
import { OPEN_PALETTE } from "./CommandPalette";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

const noSubscribe = () => () => {};

export default function Nav() {
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
  const [activeSection, setActiveSection] = useState<string>("#work");

  const isMac = useSyncExternalStore(
    noSubscribe,
    () => {
      if (typeof navigator === "undefined") return true;
      const p =
        (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform ||
        navigator.platform ||
        navigator.userAgent;
      return /Mac|iPhone|iPad/i.test(p);
    },
    () => true
  );

  useEffect(() => {
    const sectionIds = ["work", "experience", "about", "contact"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target?.id) {
          setActiveSection(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <a href="#top" aria-label="oanyarko7, back to top" className="group flex items-center gap-2 font-mono text-sm">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent font-bold text-accent-ink transition-transform group-hover:-rotate-6">
            N
          </span>
          <span className="text-fg">oanyarko7</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const isActive = activeSection === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  isActive ? "font-medium text-accent" : "text-muted hover:text-fg"
                }`}
              >
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
                {l.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Clock className="hidden font-mono text-xs text-muted lg:inline" />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
            className="flex items-center gap-2 rounded-lg border border-line-strong px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-fg"
            aria-label="Open command menu"
          >
            <span className="md:hidden">Menu</span>
            <span className="hidden md:inline">Jump to</span>
            <kbd className="hidden rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-fg md:inline">{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}
