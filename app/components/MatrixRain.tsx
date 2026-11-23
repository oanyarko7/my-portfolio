"use client";
import { useEffect, useRef } from "react";
import { createMatrixScene, MODES, type ModeName } from "./matrix3d";


const isMode = (v: string | undefined): v is ModeName => !!v && v in MODES;

// The single background renderer. Sections opt in with `data-bg-mode="rain|flow|network|depth|quiet"`;
// the background is a continuous function of scroll position. No React state is touched per frame.
export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !canvas.getContext("2d")) return; // CSS background remains as the fallback

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const fps = finePointer && window.innerWidth >= 640 ? 60 : 30; // phones: half the frames
    const mono = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";
    const scene = createMatrixScene(canvas, `${mono}, monospace`);

    let raf = 0;
    let last = 0;
    let width = 0;
    let height = 0;
    let scrollY = window.scrollY;

    const drawStill = () => {
      scene.step(0);
      scene.render();
    };

    const resize = () => {
      // Mobile address bars fire resize while scrolling; only rebuild when the canvas actually needs to grow.
      if (window.innerWidth === width && window.innerHeight <= height) return;
      width = window.innerWidth;
      height = window.innerHeight;
      scene.resize(width, height, Math.min(window.devicePixelRatio || 1, 1.5));
      if (reduce) drawStill();
    };

    resize();
    window.addEventListener("resize", resize);
    document.fonts?.ready.then(() => {
      scene.setFont(`${mono}, monospace`);
      if (reduce) drawStill();
    });

    // Reduced motion: one composed, static frame. No loop, no mode changes, no pointer tracking.
    if (reduce) {
      scene.setMode("rain", true);
      drawStill();
      return () => window.removeEventListener("resize", resize);
    }

    // --- Section → mode, blended continuously by scroll position --------------------------
    // Each section holds its mode through its middle; across a band at each boundary the two modes
    // cross-fade with the scroll itself. There is no "switch" event to notice, and nothing to flicker.
    type Region = { mode: ModeName; top: number };
    let regions: Region[] = [];
    const measure = () => {
      regions = Array.from(document.querySelectorAll<HTMLElement>("[data-bg-mode]")).flatMap((el) => {
        const mode = el.dataset.bgMode;
        return isMode(mode) ? [{ mode, top: el.getBoundingClientRect().top + window.scrollY }] : [];
      });
    };
    measure();
    // Expanding a project or loading images changes section positions; re-measure (at most once a frame).
    let measurePending = false;
    const ro = new ResizeObserver(() => {
      if (measurePending) return;
      measurePending = true;
      requestAnimationFrame(() => {
        measurePending = false;
        measure();
      });
    });
    ro.observe(document.body);

    const smooth = (x: number) => x * x * (3 - 2 * x);
    let first = true;
    const aim = () => {
      if (!regions.length) return;
      const y = window.scrollY + height * 0.5;
      const band = height * 0.5;
      for (let k = 1; k < regions.length; k++) {
        const b = regions[k].top;
        if (Math.abs(y - b) < band) {
          scene.setBlend(regions[k - 1].mode, regions[k].mode, smooth((y - (b - band)) / (2 * band)), first);
          first = false;
          return;
        }
      }
      let i = 0;
      while (i + 1 < regions.length && regions[i + 1].top <= y) i++;
      scene.setBlend(regions[i].mode, regions[i].mode, 0, first);
      first = false;
    };

    // --- Input: cheap handlers that only record values for the next frame ----------------
    const onPointer = (e: PointerEvent) => {
      scene.pointer((e.clientX / width) * 2 - 1, (e.clientY / height) * 2 - 1);
    };
    const onScroll = () => {
      scene.fly((window.scrollY - scrollY) * 0.035);
      scrollY = window.scrollY;
    };
    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // --- Loop ------------------------------------------------------------------------------
    // Adaptive quality: if drawing a frame costs too much, thin the field rather than drop frames.
    let cost = 0;
    let lastTune = 0;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (t - last < 1000 / fps - 1) return;
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
      last = t;
      const start = performance.now();
      aim();
      scene.step(dt);
      scene.render();
      cost += (performance.now() - start - cost) * 0.1;
      if (t - lastTune > 1000) {
        lastTune = t;
        const budget = 1000 / fps / 2; // leave half the frame for the page itself
        const q = scene.getQuality();
        if (cost > budget) scene.setQuality(q * 0.85);
        else if (cost < budget * 0.4 && q < 1) scene.setQuality(q * 1.08);
      }
    };
    // Canvas toggle listener (minimal vs active mode)
    let enabled = true;
    const onToggle = () => {
      enabled = !enabled;
      if (canvas) {
        canvas.style.transition = "opacity 0.6s ease";
        canvas.style.opacity = enabled ? "1" : "0.1";
      }
    };
    window.addEventListener("toggle-bg-canvas", onToggle);

    // rAF already stops in hidden tabs; reset the clock on return so nothing jumps.
    const onVisibility = () => {
      if (!document.hidden) last = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("toggle-bg-canvas", onToggle);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
