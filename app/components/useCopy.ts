"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Copies text to the clipboard and flips `copied` true for a moment.
export function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), timeout);
      } catch {
        window.location.href = `mailto:${text}`;
      }
    },
    [timeout],
  );

  return { copied, copy };
}
