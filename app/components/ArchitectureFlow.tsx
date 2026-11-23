import type { Architecture } from "../data";

export default function ArchitectureFlow({ arch }: { arch: Architecture }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface/70">
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[11px]">
        <span className="flex items-center gap-2 text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          System Architecture: {arch.title}
        </span>
      </figcaption>

      <div className="p-4 sm:p-5">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {arch.steps.map((s, idx) => (
            <li
              key={s.layer}
              className="relative flex flex-col justify-between rounded-lg border border-line-strong/60 bg-bg/60 p-3.5 transition-colors hover:border-accent/40"
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                    0{idx + 1}
                  </span>
                  {idx < arch.steps.length - 1 && (
                    <span className="hidden font-mono text-xs text-faint lg:inline" aria-hidden="true">
                      →
                    </span>
                  )}
                </div>
                <h4 className="font-mono text-xs font-semibold text-fg">{s.layer}</h4>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
