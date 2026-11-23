"use client";
import { useSyncExternalStore } from "react";

function format(zone: string, now: Date) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: zone,
    }).format(now);
  } catch {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(now);
  }
}

const TICK = 15_000;

function subscribe(cb: () => void) {
  const id = setInterval(cb, TICK);
  return () => clearInterval(id);
}

// Live local time in Accra. The server renders placeholders, so hydration never mismatches.
export default function Clock({ className }: { className?: string }) {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / TICK), () => null);
  const now = tick === null ? null : new Date(tick * TICK);

  return (
    <span className={className} suppressHydrationWarning>
      <span className="text-faint">ACCRA</span> {now ? format("Africa/Accra", now) : "--:--"}{" "}
      <span className="text-faint">GMT</span>
    </span>
  );
}
