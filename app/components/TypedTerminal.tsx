"use client";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { PROFILE, PROJECTS } from "../data";
import { useInViewAt } from "./useInView";

// A profile summary styled as a terminal. Every line restates facts from the CV; it is not a live shell.
type Block = { cmd: string; out: { text: string; accent?: boolean }[] };

const SESSION: Block[] = [
  { cmd: "whoami", out: [{ text: "nyarko: backend & full-stack developer" }] },
  {
    cmd: "cat now.txt",
    out: [
      { text: "co-founder, cipher (decimal.inc ltd)", accent: true },
      { text: "backend/full-stack intern, glinax" },
      { text: "freelance full-stack dev, since 2024" },
      { text: "bsc computer science (level 400), knust '27" },
    ],
  },
  { cmd: "cat stack.txt", out: [{ text: "node · next.js · postgres · supabase · railway" }] },
];

// Timing, in seconds. Commands are typed (quicker than the headline: shell commands are short and
// familiar); output prints all at once after a beat, the way a shell does.
const FIRST_WAIT = 0.6; // prompt blinking before the first command is typed
const NEXT_WAIT = 0.45; // prompt blinking before each later command
const KEY = 0.075; // average gap between keystrokes
const JITTER = 0.03; // ± per keystroke, so it reads as a person typing
const ENTER = 0.35; // pause after the last key before output appears
const LINE = 0.04; // output lines print almost together, a hair apart
const AFTER_OUTPUT = 0.15; // new prompt appears just after the output

// If the terminal is on screen at load, start once the headline has finished typing; if it's first
// reached by scrolling (phones), start straight away.
const AFTER_HEADLINE = 2.9;
const ON_SCROLL = 0.35;

type Timed = {
  appear: number; // prompt line appears
  typeStart: number;
  keys: number[]; // when each character of the command appears
  outAt: number; // when the output lines appear
};

function schedule(): { blocks: Timed[]; end: number } {
  let t = 0;
  let n = 0;
  const blocks = SESSION.map((b, i) => {
    const appear = t;
    const typeStart = appear + (i === 0 ? FIRST_WAIT : NEXT_WAIT);
    let k = typeStart;
    const keys = Array.from(b.cmd).map(() => {
      const at = k;
      // Deterministic jitter, so server and client render identical timings.
      k += KEY + ((((++n * 2654435761) >>> 0) % 61) / 60 - 0.5) * 2 * JITTER;
      return at;
    });
    const outAt = keys[keys.length - 1] + ENTER;
    t = outAt + (b.out.length - 1) * LINE + AFTER_OUTPUT;
    return { appear, typeStart, keys, outAt };
  });
  return { blocks, end: t };
}

const PLAN = schedule();
const s = (v: number) => `${v.toFixed(3)}s`;

const SUGGESTIONS = [
  { label: "projects", desc: "view deployed work" },
  { label: "experience", desc: "roles & companies" },
  { label: "skills", desc: "tech stack" },
  { label: "contact", desc: "email & phone" },
  { label: "whoami", desc: "about developer" },
  { label: "cv", desc: "download PDF" },
  { label: "matrix", desc: "toggle visuals" },
  { label: "clear", desc: "wipe terminal" },
] as const;

export default function TypedTerminal({ style }: { style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const at = useInViewAt(ref, "0px 0px -10% 0px");
  const base = at === null ? AFTER_HEADLINE : at < 2500 ? AFTER_HEADLINE : ON_SCROLL;

  const [interactive, setInteractive] = useState(false);
  const [history, setHistory] = useState<{ cmd: string; out: { text: string; accent?: boolean }[] }[]>([]);
  const [inputVal, setInputVal] = useState("");

  // Activate interactive mode after intro script finishes, or on user click
  useEffect(() => {
    if (at === null) return;
    const timer = setTimeout(() => {
      setInteractive(true);
    }, (base + PLAN.end) * 1000);
    return () => clearTimeout(timer);
  }, [at, base]);

  // Keep terminal scrolled to latest output
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [history, interactive]);

  const handleContainerClick = () => {
    setInteractive(true);
    inputRef.current?.focus();
  };

  const execute = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const cmd = trimmed.toLowerCase();
    let response: { text: string; accent?: boolean }[] = [];

    switch (cmd) {
      case "help":
        response = [
          { text: "available commands: projects, experience, skills, contact, cv, whoami, matrix, sudo, clear" },
        ];
        break;
      case "projects":
        response = PROJECTS.map((p) => ({
          text: `${p.index} ${p.title} (${p.category}) · ${p.kicker}`,
          accent: p.featured,
        }));
        break;
      case "experience":
      case "exp":
        response = [
          { text: "co-founder · decimal.inc ltd (cipher) — aug 2026 to present", accent: true },
          { text: "backend/full-stack intern · glinax (cerkyl ai & ashanti civic) — oct to nov 2026" },
          { text: "freelance full-stack developer · itzzz meera & clients — 2024 to present" },
        ];
        break;
      case "skills":
        response = [
          { text: "backend & data: node.js, express, spring boot, postgresql, supabase, rest apis", accent: true },
          { text: "ai & cv: roboflow, opencv, tensorflow, scikit-learn" },
          { text: "infra & security: railway, vercel, burp suite, cisco packet tracer, git" },
          { text: "languages: typescript, javascript, python, java, c++, html/css" },
        ];
        break;
      case "contact":
        response = [
          { text: `email: ${PROFILE.email}`, accent: true },
          { text: `phone: ${PROFILE.phone}` },
          { text: `location: ${PROFILE.location}` },
        ];
        break;
      case "cv":
        window.open(PROFILE.cv, "_blank", "noopener,noreferrer");
        response = [{ text: `downloading ${PROFILE.cv}...`, accent: true }];
        break;
      case "whoami":
        response = [
          { text: `${PROFILE.name} · ${PROFILE.role}`, accent: true },
          { text: "co-founder of cipher · building production-ready systems" },
        ];
        break;
      case "matrix":
        window.dispatchEvent(new Event("toggle-bg-canvas"));
        response = [{ text: "matrix background visual mode toggled", accent: true }];
        break;
      case "sudo":
        response = [
          { text: "permission denied: user 'guest' is not in the sudoers file. incident logged." },
        ];
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        response = [{ text: `command not found: "${trimmed}". Click one of the suggestions below or type 'help'.` }];
        break;
    }

    setHistory((prev) => [...prev, { cmd: trimmed, out: response }]);
  };

  const handleCommand = (e: FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    execute(inputVal);
    setInputVal("");
  };

  const runCommand = (cmd: string) => {
    setInteractive(true);
    execute(cmd);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <figure
      style={style}
      onClick={handleContainerClick}
      aria-label="Interactive profile terminal"
      className="rise group w-full min-w-0 cursor-text overflow-hidden rounded-xl border border-line-strong bg-surface/92 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-term-red" />
          <span className="h-2.5 w-2.5 rounded-full bg-term-yellow" />
          <span className="h-2.5 w-2.5 rounded-full bg-term-green" />
          <span className="ml-2 font-mono text-[11px] text-faint">~/profile</span>
        </div>
        <span className="font-mono text-[10px] text-accent/90 transition-opacity">
          ● interactive · click or type commands
        </span>
      </div>

      <div
        ref={ref}
        className={`term ${at !== null ? "in" : ""} max-h-[300px] overflow-y-auto space-y-0.5 px-4 py-3.5 font-mono text-[12px] leading-relaxed sm:max-h-[340px] sm:px-5 sm:py-4 sm:text-[12.5px]`}
      >
        {SESSION.map((b, i) => {
          const p = PLAN.blocks[i];
          const appear = i === 0 ? 0 : base + p.appear;
          return (
            <div key={b.cmd} className={i > 0 ? "pt-1.5" : ""}>
              <div className="ln break-words text-fg" style={{ "--t": s(appear) } as CSSProperties}>
                <span className="text-term-prompt" aria-hidden="true">
                  ${" "}
                </span>
                <span
                  className="term-wait"
                  aria-hidden="true"
                  style={{ "--t": s(appear), "--dur": s(base + p.typeStart - appear) } as CSSProperties}
                />
                <span aria-hidden="true">
                  {Array.from(b.cmd).map((ch, k) => {
                    const last = k === b.cmd.length - 1;
                    const hold = last ? p.outAt - p.keys[k] : (p.keys[k + 1] ?? p.keys[k]) - p.keys[k];
                    return (
                      <span key={k} className="c" style={{ "--t": s(base + p.keys[k]), "--hold": s(hold) } as CSSProperties}>
                        {ch}
                      </span>
                    );
                  })}
                </span>
                <span className="sr-only">{b.cmd}</span>
              </div>

              {b.out.map((o, j) => (
                <div
                  key={o.text}
                  className={`ln break-words ${o.accent ? "text-accent" : "text-muted"}`}
                  style={{ "--t": s(base + p.outAt + j * LINE) } as CSSProperties}
                >
                  <span className="text-faint" aria-hidden="true">
                    →{" "}
                  </span>
                  {o.text}
                </div>
              ))}
            </div>
          );
        })}

        {/* User interactive history */}
        {history.map((h, idx) => (
          <div key={idx} className="pt-1.5">
            <div className="break-words text-fg">
              <span className="text-term-prompt">$ </span>
              {h.cmd}
            </div>
            {h.out.map((line, j) => (
              <div key={j} className={`break-words ${line.accent ? "text-accent" : "text-muted"}`}>
                <span className="text-faint">→ </span>
                {line.text}
              </div>
            ))}
          </div>
        ))}

        {/* Active prompt: either interactive form input or typing animation placeholder */}
        {interactive ? (
          <form onSubmit={handleCommand} className="flex items-center gap-1.5 pt-1.5 text-fg">
            <span className="text-term-prompt" aria-hidden="true">$ </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="click a command below or type here..."
              className="w-full bg-transparent font-mono text-[12px] text-fg placeholder:text-faint/60 focus:outline-none sm:text-[12.5px]"
              aria-label="Interactive terminal input"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </form>
        ) : (
          <div className="ln pt-1.5 text-fg" aria-hidden="true" style={{ "--t": s(base + PLAN.end) } as CSSProperties}>
            <span className="text-term-prompt">$ </span>
            <span className="term-cursor" />
          </div>
        )}
      </div>

      {/* Visible clickable command buttons so users immediately know what to run */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-line/60 bg-surface-2/70 px-3.5 py-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">Commands:</span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                runCommand(s.label);
              }}
              title={s.desc}
              className="rounded border border-line-strong/80 bg-surface px-2 py-0.5 font-mono text-[11px] text-accent transition-all hover:border-accent hover:bg-accent hover:text-accent-ink active:scale-95"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
}
