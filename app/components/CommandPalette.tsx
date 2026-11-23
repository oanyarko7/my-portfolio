"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROFILE, PROJECTS } from "../data";

export const OPEN_PALETTE = "open-command-palette";

type Command = { id: string; label: string; hint: string; group: string; run: () => void };

function go(hash: string) {
  document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", hash);
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const commands: Command[] = useMemo(
    () => [
      { id: "work", group: "Navigate", label: "Selected work", hint: "#work", run: () => go("#work") },
      { id: "exp", group: "Navigate", label: "Experience", hint: "#experience", run: () => go("#experience") },
      { id: "about", group: "Navigate", label: "About & education", hint: "#about", run: () => go("#about") },
      { id: "contact", group: "Navigate", label: "Contact", hint: "#contact", run: () => go("#contact") },
      ...PROJECTS.map((p) => ({
        id: `p-${p.slug}`,
        group: "Projects",
        label: p.title,
        hint: p.category,
        run: () => {
          go(`#project-${p.slug}`);
          window.dispatchEvent(new CustomEvent("open-project", { detail: p.slug }));
        },
      })),
      {
        id: "copy",
        group: "Actions",
        label: "Copy email address",
        hint: PROFILE.email,
        run: () => {
          navigator.clipboard?.writeText(PROFILE.email).then(() => {
            setToast("Email copied");
            setTimeout(() => setToast(null), 1800);
          });
        },
      },
      {
        id: "canvas",
        group: "Actions",
        label: "Toggle matrix background (Active / Minimal)",
        hint: "Effects",
        run: () => {
          window.dispatchEvent(new Event("toggle-bg-canvas"));
          setToast("Matrix background toggled");
          setTimeout(() => setToast(null), 1800);
        },
      },
      { id: "cv", group: "Actions", label: "Download CV (PDF)", hint: "PDF", run: () => window.open(PROFILE.cv, "_blank", "noopener,noreferrer") },
      { id: "gh", group: "Links", label: "GitHub", hint: "oanyarko7", run: () => window.open(PROFILE.github, "_blank", "noopener,noreferrer") },
      { id: "li", group: "Links", label: "LinkedIn", hint: "in/oanyarko7", run: () => window.open(PROFILE.linkedin, "_blank", "noopener,noreferrer") },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint} ${c.group}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      returnFocus.current?.focus?.({ preventScroll: true });
      returnFocus.current = null;
    }
  }, [open]);

  // Scroll active item smoothly into view when navigating via keyboard
  useEffect(() => {
    if (!open) return;
    const activeEl = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    close();
    c.run();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(filtered[active]);
    }
  };

  // Trap focus inside modal when open
  const onDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Tab") {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, button:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length <= 1) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <>
      {/* Opens with a short CSS animation (globals.css); closes instantly, as command menus do. */}
      {open && (
        <div
          className="palette-backdrop fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
          onMouseDown={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            onKeyDown={onDialogKeyDown}
            className="palette-panel w-full max-w-lg overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl shadow-black/60"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="font-mono text-accent" aria-hidden="true">›</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search sections, projects, links…"
                className="h-14 w-full bg-transparent text-fg placeholder:text-faint focus:outline-none"
                aria-label="Search commands"
                role="combobox"
                aria-expanded={open}
                aria-controls="command-palette-list"
                aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close command menu"
                className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                ESC
              </button>
            </div>
            <ul id="command-palette-list" ref={listRef} className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
              {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-faint">No matches.</li>}
              {filtered.map((c, i) => {
                const header = i === 0 || filtered[i - 1].group !== c.group ? c.group : null;
                return (
                  <li key={c.id}>
                    {header && (
                      <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-faint">
                        {header}
                      </div>
                    )}
                    <button
                      id={`cmd-${c.id}`}
                      role="option"
                      tabIndex={-1}
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => run(c)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        i === active ? "bg-surface-2 text-fg" : "text-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={i === active ? "text-accent" : "text-transparent"}>●</span>
                        {c.label}
                      </span>
                      <span className="truncate pl-4 font-mono text-xs text-faint">{c.hint}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="toast-in fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-accent px-4 py-2 font-mono text-xs text-accent-ink"
          role="status"
        >
          {toast}
        </div>
      )}
    </>
  );
}
