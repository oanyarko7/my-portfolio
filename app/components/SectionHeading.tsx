import Reveal from "./Reveal";
import WordReveal from "./WordReveal";

export default function SectionHeading({
  label,
  title,
  aside,
  scrim = false,
}: {
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  scrim?: boolean; // soft dark pool behind the heading, for sections with a busy background
}) {
  return (
    <div className={`mb-14 flex flex-col gap-6 sm:mb-20 md:flex-row md:items-end md:justify-between ${scrim ? "text-scrim" : ""}`}>
      <div>
        <Reveal>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">{label}</p>
        </Reveal>
        <WordReveal delay={0.1} className="font-serif text-5xl leading-[0.95] tracking-tight text-fg sm:text-6xl md:text-7xl">
          {title}
        </WordReveal>
      </div>
      {aside && (
        <Reveal delay={0.35} className="max-w-sm text-muted">
          {aside}
        </Reveal>
      )}
    </div>
  );
}
