"use client";
import { useRef } from "react";
import { useInView } from "./useInView";

// Fades + lifts its children in once they scroll into view.
// Content is only hidden when JS is running (the `js` class on <html>), so it never gets stuck invisible.
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "0px 0px -80px 0px");

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ "--d": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
