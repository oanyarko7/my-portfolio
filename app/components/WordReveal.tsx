"use client";
import { useRef } from "react";
import { splitText, type SplitBy } from "./splitWords";
import { useInView } from "./useInView";

// A heading that reveals itself when it scrolls into view (or on load, if already visible):
// word by word, or — with by="char" — letter by letter like typing, with a cursor.
// Text is only hidden while JS runs (`.js` on <html>), and never for visitors who prefer
// reduced motion — see `.words` / `.chars` in globals.css.
export default function WordReveal({
  as: Tag = "h2",
  by = "word",
  label,
  className = "",
  delay = 0,
  children,
}: {
  as?: "h1" | "h2";
  by?: SplitBy;
  label?: string; // full text for screen readers when split by character
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, "0px 0px -12% 0px");

  const { node } = splitText(children, by);
  const style = { "--wd": `${delay}s` } as React.CSSProperties;
  const cls = `${by === "char" ? "chars" : "words"} ${inView ? "in" : ""} ${className}`;

  if (by === "char") {
    return (
      <Tag ref={ref} className={cls} style={style} aria-label={label}>
        <span aria-hidden>{node}</span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={cls} style={style}>
      {node}
    </Tag>
  );
}
