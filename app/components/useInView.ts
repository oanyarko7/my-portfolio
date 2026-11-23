"use client";
import { useEffect, useState, type RefObject } from "react";

// The page time (performance.now) at which the element first entered the viewport, or null until
// then. Kept in React state rather than toggling a class on the DOM node, so re-renders — a copy
// button, Fast Refresh — can't wipe it.
export function useInViewAt(ref: RefObject<Element | null>, rootMargin = "0px") {
  const [at, setAt] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || at !== null) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAt(performance.now());
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, at]);

  return at;
}

// True once the element has entered the viewport (and stays true).
export function useInView(ref: RefObject<Element | null>, rootMargin = "0px") {
  return useInViewAt(ref, rootMargin) !== null;
}
