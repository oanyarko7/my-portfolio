// One renderer for the whole background: a 3D field of binary streams drawn with perspective
// on a single 2D canvas, plus a node network and a particle layer. "Modes" are only parameter
// sets; switching mode eases every parameter toward the new set, so transitions are blends
// inside one renderer, never crossfades between renderers.

export type ModeName = "rain" | "flow" | "network" | "currents" | "quiet";

type Params = {
  density: number; // fraction of streams visible (0..1)
  brightness: number; // overall alpha multiplier
  speed: number; // fall speed multiplier
  trail: number; // trail length multiplier
  wave: number; // lateral sine displacement, world units
  highlight: number; // highlight triggers per second
  violet: number; // share of highlights tinted violet instead of cyan
  drift: number; // forward camera travel, world units per second
  fibers: number; // fan of luminous fibers carrying digits (Digital Flow)
  currents: number; // curved ribbons of digits flowing across the screen (Digital Currents)
  green: number; // palette weights — blended, so colour changes are gradual
  teal: number;
  spectrum: number; // cyan → blue → violet across the screen
  bokeh: number; // soft, enlarged out-of-focus background digits
  network: number; // node/line layer opacity
  particles: number; // sparse glowing squares
  light: number; // soft teal light from above
  vignette: number; // edge darkening strength
};

// One atmosphere, not five effects: every mode keeps some of the same rain, palettes pass through teal,
// and intensity steps down after the hero. Sections should feel related, with the hero the loudest.
export const MODES: Record<ModeName, Params> = {
  rain: {
    density: 1, brightness: 1.15, speed: 0.55, trail: 1.1, wave: 0, highlight: 0.4, violet: 0, drift: 1.5,
    fibers: 0, currents: 0, green: 1, teal: 0, spectrum: 0, bokeh: 0.2, network: 0, particles: 0, light: 0.25, vignette: 0.55,
  },
  network: {
    density: 0.3, brightness: 0.8, speed: 0.55, trail: 0.8, wave: 0, highlight: 0.12, violet: 0, drift: 1,
    fibers: 0, currents: 0, green: 0.35, teal: 0.65, spectrum: 0, bokeh: 0.6, network: 0.6, particles: 0.15, light: 0.15, vignette: 0.6,
  },
  currents: {
    density: 0.03, brightness: 0.95, speed: 0.4, trail: 0.8, wave: 0, highlight: 0, violet: 0, drift: 1.2,
    fibers: 0, currents: 1, green: 0, teal: 0.7, spectrum: 0.3, bokeh: 0.7, network: 0, particles: 0.1, light: 0.2, vignette: 0.6,
  },
  flow: {
    density: 0.3, brightness: 0.85, speed: 0.4, trail: 0.8, wave: 0, highlight: 0.15, violet: 0.5, drift: 2.5,
    fibers: 0.5, currents: 0, green: 0, teal: 0.5, spectrum: 0.5, bokeh: 0.6, network: 0, particles: 0.15, light: 0.2, vignette: 0.6,
  },
  quiet: {
    density: 0.08, brightness: 0.5, speed: 0.3, trail: 0.6, wave: 0, highlight: 0, violet: 0, drift: 0.5,
    fibers: 0, currents: 0, green: 0, teal: 1, spectrum: 0, bokeh: 0.5, network: 0, particles: 0.7, light: 0.25, vignette: 0.75,
  },
};

const KEYS = Object.keys(MODES.rain) as (keyof Params)[];

const Z_NEAR = 14;
const Z_FAR = 150;
const Z_RANGE = Z_FAR - Z_NEAR;
const GLYPH = 1; // world units per glyph cell
const SPRITE_PX = 48; // resolution glyph sprites are pre-rendered at
const CELLS = 64; // characters remembered per stream
const BLEND_S = 0.6; // smoothing on top of the scroll blend, so anchor jumps glide (~1.8 s) instead of cutting
const BG = "9, 11, 9"; // --bg

// --- Sprites ------------------------------------------------------------------------------
type Pair = [HTMLCanvasElement, HTMLCanvasElement]; // "0", "1"
type Tiered = { head: Pair; near: Pair; mid: Pair; far: Pair };

const PALETTES: Record<string, Record<keyof Tiered, [string, number]>> = {
  green: { head: ["#eaffea", 16], near: ["#3dff7a", 7], mid: ["#22d65e", 3], far: ["#16903f", 4] },
  teal: { head: ["#e2fffa", 18], near: ["#a0fbea", 5], mid: ["#6fe0cc", 6], far: ["#3aa89c", 14] },
  cyan: { head: ["#e6fdff", 18], near: ["#00e5ff", 8], mid: ["#00d0ff", 6], far: ["#0aa6d6", 8] },
  blue: { head: ["#e8eeff", 18], near: ["#6b95ff", 8], mid: ["#5b84ff", 6], far: ["#4466e0", 8] },
  violet: { head: ["#f6e6ff", 18], near: ["#c860ff", 8], mid: ["#b44dff", 6], far: ["#8a35d6", 8] },
};

type Sprites = {
  green: Tiered;
  teal: Tiered;
  spectrum: [Tiered, Tiered, Tiered];
  hiCyan: Pair;
  hiViolet: Pair;
  dot: HTMLCanvasElement; // glowing node
  square: HTMLCanvasElement; // glowing particle
};

// --- Scene objects ------------------------------------------------------------------------
type Stream = {
  x: number;
  y: number; // world y of the head (grows downward)
  z: number;
  speed: number;
  len: number;
  rank: number; // stable 0..1; streams with rank < density are visible
  hue: number; // 0..2 spectrum bucket, from its horizontal position
  phase: number;
  glow: number; // 0..1 highlight, decays
  violet: boolean;
  cells: Uint8Array;
};

type Node = { x: number; y: number; z: number; vx: number; vy: number; bit: number };
type Particle = { x: number; y: number; size: number; phase: number; speed: number; vy: number };
type Packet = { a: number; b: number; t: number };
type Strand = {
  o: number; // position across the bundle, -1..1 (clustered toward the centre)
  hue: number; // 0 teal → 1 blue
  gold: boolean; // a rare pale-gold strand, as in the reference
  core: boolean; // a few bright, near-white strands give the ribbon its luminous middle
  width: number;
  phase: number;
  text: boolean; // carries a continuous run of digits along the line
  pattern: Uint8Array; // the run's characters; they travel with the flow and never flicker
  shift: number; // 0..1 of a character slot — the run slides by this much before stepping
  base: number; // how many whole slots the run has moved
  flow: number; // character slots per second
  grad: CanvasGradient | null; // built once per resize; the frame's alpha is applied via globalAlpha
};
type Fiber = { angle: number; len: number; width: number; hue: number; phase: number; bits: Float32Array; bitVals: Uint8Array; speed: number };

export type MatrixScene = {
  resize: (width: number, height: number, dpr: number) => void;
  step: (dt: number) => void;
  render: () => void;
  setMode: (mode: ModeName, immediate?: boolean) => void;
  setBlend: (a: ModeName, b: ModeName, t: number, immediate?: boolean) => void; // t: 0 → a, 1 → b
  pointer: (nx: number, ny: number) => void; // normalised -1..1
  fly: (delta: number) => void; // queued forward travel, applied on the next step
  setFont: (font: string) => void;
  setQuality: (q: number) => void; // 0.35..1
  getQuality: () => number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// Cyan → blue → violet, with a touch of green at the far left (as in the reference).
const STOPS: [number, number, number][] = [[40, 255, 190], [0, 229, 255], [77, 125, 255], [194, 77, 255]];
function spectrumColor(t: number) {
  const x = Math.min(0.999, Math.max(0, t)) * (STOPS.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const [a, b] = [STOPS[i], STOPS[i + 1]];
  return `${Math.round(a[0] + (b[0] - a[0]) * f)}, ${Math.round(a[1] + (b[1] - a[1]) * f)}, ${Math.round(a[2] + (b[2] - a[2]) * f)}`;
}

export function createMatrixScene(canvas: HTMLCanvasElement, font = "monospace"): MatrixScene {
  const ctx = canvas.getContext("2d")!;
  let W = 0;
  let H = 0;
  let focal = 1;
  let streams: Stream[] = [];
  let nodes: Node[] = [];
  let particles: Particle[] = [];
  let packets: Packet[] = [];
  let fibers: Fiber[] = [];
  let strands: Strand[] = [];
  let sprites = buildSprites(font);
  let vignette: CanvasGradient | null = null;
  let light: CanvasGradient | null = null;

  let dpr = 1;
  let quality = 1; // lowered by the host when frames run slow; thins streams via the density threshold
  const goal: Params = { ...MODES.rain }; // target set by scroll position, eased into each frame
  let intensity = 1; // phones run dimmer: the text spans the full width there
  const p: Params = { ...MODES.rain };

  // Timed variation: small multipliers re-rolled every 12–20 s of *animation* time,
  // so it stops automatically whenever rAF stops (hidden tab).
  const vary = { speed: 1, density: 1, brightness: 1 };
  const varyAim = { ...vary };
  let nextVary = rand(12, 20);
  let highlightDebt = 0;

  let camX = 0;
  let camY = 0;
  let aimX = 0;
  let aimY = 0;
  let clock = 0;
  let pendingFly = 0;
  let nextPacket = 1;

  const halfW = (z: number) => (W / 2 / focal) * z;
  const halfH = (z: number) => (H / 2 / focal) * z;

  function place(s: Stream, z: number, anywhere: boolean) {
    s.z = z;
    const nx = rand(-1.25, 1.25);
    s.x = nx * halfW(z);
    s.hue = Math.min(2, Math.max(0, Math.floor(((nx + 1.25) / 2.5) * 3)));
    const yr = halfH(z);
    s.len = Math.floor(rand(8, 30));
    // "anywhere" keeps the head on screen (or its trail visible), so slow modes don't hide streams below the fold.
    s.y = anywhere ? rand(-yr * 0.9, yr * 1.05) + s.len * 0.4 : -yr - rand(0, yr * 1.5);
    s.speed = rand(0.18, 0.55) * (H / focal) * z;
    s.glow = 0;
  }

  function populate() {
    const mobile = W < 640;
    const count = Math.round(Math.min(380, Math.max(90, (W * H) / 4200)) * (mobile ? 0.7 : 1));
    streams = Array.from({ length: count }, () => {
      const s: Stream = {
        x: 0, y: 0, z: 0, speed: 0, len: 0, glow: 0, violet: false, hue: 0,
        rank: Math.random(), phase: Math.random() * Math.PI * 2, cells: new Uint8Array(CELLS),
      };
      for (let i = 0; i < CELLS; i++) s.cells[i] = Math.random() > 0.5 ? 1 : 0;
      place(s, rand(Z_NEAR, Z_FAR), true);
      return s;
    });
    // Nodes sit mostly in the lower part of the frame, nearer ones larger — a floor of connected systems.
    nodes = Array.from({ length: mobile ? 18 : 36 }, () => {
      const z = rand(0.35, 1);
      return {
        x: Math.random(), y: rand(0.3, 1.05) * (0.6 + 0.4 * z), z,
        vx: rand(-1, 1) * 0.006, vy: rand(-1, 1) * 0.004, bit: Math.random() > 0.5 ? 1 : 0,
      };
    });
    particles = Array.from({ length: mobile ? 40 : 80 }, () => ({
      x: Math.random(), y: Math.random(), size: Math.random() < 0.12 ? rand(5, 9) : rand(1.5, 3.5),
      phase: Math.random() * Math.PI * 2, speed: rand(0.4, 1.4), vy: rand(-0.004, -0.012),
    }));
    packets = [];
    fibers = Array.from({ length: mobile ? 70 : 140 }, () => {
      const angle = rand(-1.05, 1.05);
      return {
        angle, len: rand(0.75, 1.35), width: rand(0.6, 2.2), hue: (angle + 1.05) / 2.1, phase: Math.random() * 6.28,
        bits: Float32Array.from({ length: 3 }, () => Math.random()),
        bitVals: Uint8Array.from({ length: 3 }, () => (Math.random() > 0.5 ? 1 : 0)),
        speed: rand(0.08, 0.22),
      };
    });
    const textEvery = 4; // every 4th strand carries text: ~15 runs on desktop, ~8 on phones
    strands = Array.from({ length: mobile ? 30 : 60 }, (_, k) => {
      const x = Math.random() * 2 - 1;
      return {
        o: Math.sign(x) * Math.pow(Math.abs(x), 1.35), // clustered toward the centre: reads as one ribbon
        hue: Math.random(),
        gold: k % 17 === 6,
        core: k % 11 === 3,
        width: rand(0.5, 1.8),
        phase: Math.random() * 6.28,
        text: k % textEvery === 1,
        pattern: Uint8Array.from({ length: 64 }, () => (Math.random() > 0.5 ? 1 : 0)),
        shift: Math.random(),
        base: 0,
        flow: rand(2.4, 3.6), // unhurried, and never two runs in lockstep
        grad: null as CanvasGradient | null,
      };
    });
    for (const st of strands) {
      const rgb = strandColor(st);
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, `rgba(${rgb}, 0)`);
      g.addColorStop(0.15, `rgba(${rgb}, 0.3)`);
      g.addColorStop(0.6, `rgba(${rgb}, 0.9)`);
      g.addColorStop(1, `rgba(${rgb}, 0.7)`);
      st.grad = g;
    }
  }

  function travel(dz: number) {
    for (const s of streams) {
      s.z -= dz;
      if (s.z < Z_NEAR) place(s, s.z + Z_RANGE, true);
      else if (s.z > Z_FAR) place(s, s.z - Z_RANGE, true);
    }
  }

  function triggerHighlight() {
    for (let tries = 0; tries < 8; tries++) {
      const s = streams[(Math.random() * streams.length) | 0];
      if (s && s.rank < p.density * vary.density && (s.z - Z_NEAR) / Z_RANGE < 0.6) {
        s.glow = 1;
        s.violet = Math.random() < p.violet;
        return;
      }
    }
  }

  const nodePos = (n: Node) => ({ x: n.x * W - camX * n.z * 8, y: n.y * H - camY * n.z * 8 });

  function stepLayers(dt: number) {
    if (p.network > 0.01) {
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -0.05 || n.x > 1.05) n.vx *= -1;
        if (n.y < 0.2 || n.y > 1.08) n.vy *= -1;
      }
      packets = packets.filter((k) => (k.t += dt / 1.6) < 1);
      if ((nextPacket -= dt) <= 0 && packets.length < 4) {
        nextPacket = rand(0.6, 1.6);
        const a = (Math.random() * nodes.length) | 0;
        const b = nearestNode(a);
        if (b >= 0) packets.push({ a, b, t: 0 });
      }
    }
    if (p.fibers > 0.01) {
      for (const f of fibers) {
        for (let i = 0; i < f.bits.length; i++) {
          f.bits[i] += f.speed * dt;
          if (f.bits[i] > 1) {
            f.bits[i] -= 1;
            f.bitVals[i] = Math.random() > 0.5 ? 1 : 0;
          }
        }
      }
    }
    if (p.currents > 0.01) {
      // Runs slide continuously; when a run has moved a whole character slot, the characters step
      // along with it, so each digit keeps its value as it travels.
      for (const st of strands) {
        if (!st.text) continue;
        st.shift += st.flow * dt * (0.85 + 0.15 * p.currents);
        while (st.shift >= 1) {
          st.shift -= 1;
          st.base++;
        }
      }
    }
    if (p.particles > 0.01) {
      for (const q of particles) {
        q.y += q.vy * dt;
        if (q.y < -0.02) q.y = 1.02;
      }
    }
  }

  function nearestNode(i: number) {
    let best = -1;
    let bestD = Infinity;
    const a = nodes[i];
    nodes.forEach((n, j) => {
      if (j === i) return;
      const d = Math.hypot((a.x - n.x) * W, (a.y - n.y) * H);
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    });
    return best;
  }

  function renderNetwork() {
    const a = Math.min(1, p.network * p.brightness * vary.brightness * intensity);
    if (a < 0.01) return;
    const maxD = Math.min(260, Math.max(W, H) * 0.17);
    const pos = nodes.map(nodePos);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
        if (d > maxD) continue;
        const z = (nodes[i].z + nodes[j].z) / 2;
        const g = (i + j) % 5 === 0 ? "60, 255, 170" : "0, 229, 255"; // a few green links, as in the reference
        ctx.strokeStyle = `rgba(${g}, ${(1 - d / maxD) * 0.75 * a * z})`;
        ctx.lineWidth = 0.6 + z * 1.1;
        ctx.beginPath();
        ctx.moveTo(pos[i].x, pos[i].y);
        ctx.lineTo(pos[j].x, pos[j].y);
        ctx.stroke();
      }
    }
    nodes.forEach((n, i) => {
      const q = pos[i];
      const s = 10 + n.z * 26;
      ctx.globalAlpha = a * (0.55 + n.z * 0.45);
      ctx.drawImage(sprites.dot, q.x - s / 2, q.y - s / 2, s, s);
      if (i % 4 === 0) {
        const spr = sprites.teal.mid[n.bit];
        const w = (spr.width / SPRITE_PX) * 13 * n.z;
        ctx.globalAlpha = 0.7 * a;
        ctx.drawImage(spr, q.x + s * 0.35, q.y - w / 2, w, w);
      }
    });
    for (const k of packets) {
      const pa = pos[k.a];
      const pb = pos[k.b];
      if (!pa || !pb) continue;
      const e = k.t < 0.5 ? 2 * k.t * k.t : 1 - Math.pow(-2 * k.t + 2, 2) / 2;
      ctx.globalAlpha = a * Math.sin(Math.PI * k.t);
      ctx.drawImage(sprites.dot, pa.x + (pb.x - pa.x) * e - 9, pa.y + (pb.y - pa.y) * e - 9, 18, 18);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  // Digital Flow: fibers fan up from below the frame, cyan → blue → violet from left to right,
  // with digits riding along them and growing as they travel toward the viewer.
  function renderFibers() {
    const a = Math.min(1, p.fibers * p.brightness * vary.brightness * intensity);
    if (a < 0.01) return;
    const ox = W / 2 - camX * 6;
    const oy = H * 1.18 - camY * 4;
    const reach = Math.hypot(W, H) * 0.62;
    ctx.globalCompositeOperation = "lighter";
    for (const f of fibers) {
      const ang = f.angle + Math.sin(clock * 0.25 + f.phase) * 0.015;
      const dx = Math.sin(ang);
      const dy = -Math.cos(ang);
      const L = reach * f.len;
      const rgb = spectrumColor(f.hue);
      const x0 = ox + dx * L * 0.22;
      const y0 = oy + dy * L * 0.22;
      const x1 = ox + dx * L;
      const y1 = oy + dy * L;
      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, `rgba(${rgb}, 0)`);
      grad.addColorStop(0.55, `rgba(${rgb}, ${0.8 * a})`);
      grad.addColorStop(1, `rgba(${rgb}, ${0.15 * a})`);
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      // Two passes: a wide faint halo, then the core — reads as light rather than a drawn line.
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = f.width * 5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = f.width;
      ctx.stroke();

      const set = sprites.spectrum[Math.min(2, Math.floor(f.hue * 3))];
      for (let i = 0; i < f.bits.length; i++) {
        const u = 0.3 + f.bits[i] * 0.7;
        const size = 7 + u * u * 24;
        const w = (set.near[0].width / SPRITE_PX) * size;
        const fade = Math.sin(Math.PI * f.bits[i]);
        draw(u > 0.8 ? set.head[f.bitVals[i]] : set.near[f.bitVals[i]], ox + dx * L * u, oy + dy * L * u, w, a * fade);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  // Digital Currents: a bundle of strands following one gentle S-curve across the screen, widening
  // toward the right (as if coming closer), with digits riding along them and turning with the curve.
  function strandY(st: Strand, u: number) {
    // Low on the left, cresting past the middle, dipping again on the right; breathes very slowly.
    // The bundle fills the section: ~a quarter of the height on the left, fanning to ~80% on the right.
    const centre = H * 0.56 - H * 0.16 * Math.sin(Math.PI * 1.25 * u - 0.2 + Math.sin(clock * 0.07) * 0.15);
    const spread = H * (0.13 + 0.27 * Math.pow(u, 1.4));
    const wobble = H * 0.01 * Math.sin(6 * u + st.phase + clock * 0.35);
    return centre + st.o * spread + wobble - camY * 3 * (0.6 + 0.4 * Math.abs(st.o));
  }

  function strandColor(st: Strand) {
    if (st.gold) return "232, 238, 168";
    if (st.core) return "215, 250, 255";
    const t = st.hue;
    const [a, b, f] = t < 0.5 ? [[90, 240, 215], [0, 229, 255], t * 2] : [[0, 229, 255], [70, 125, 255], (t - 0.5) * 2];
    return `${Math.round(a[0] + (b[0] - a[0]) * f)}, ${Math.round(a[1] + (b[1] - a[1]) * f)}, ${Math.round(a[2] + (b[2] - a[2]) * f)}`;
  }

  function renderCurrents() {
    const a = Math.min(1, p.currents * p.brightness * vary.brightness * intensity);
    if (a < 0.01) return;
    const shiftX = -camX * 4;
    const steps = Math.max(24, Math.round(W / 26));
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    // On slow devices the host lowers `quality`; draw fewer strands rather than drop frames.
    const count = Math.ceil(strands.length * quality);
    for (let n = 0; n < count; n++) {
      const st = strands[n];
      if (st.grad) ctx.strokeStyle = st.grad;
      ctx.beginPath();
      for (let k = 0; k <= steps; k++) {
        const u = k / steps;
        const x = u * W * 1.04 - W * 0.02 + shiftX;
        const y = strandY(st, u);
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // Core line; every fourth strand also gets a wide faint halo. Halos are the costly part to
      // paint (5× the pixels, additive), and a few of them are enough to make the bundle glow.
      const w = st.width * (W < 640 ? 0.8 : 1);
      if (n % 4 === 0) {
        ctx.globalAlpha = 0.2 * a;
        ctx.lineWidth = w * 5;
        ctx.stroke();
      }
      ctx.globalAlpha = a;
      ctx.lineWidth = w;
      ctx.stroke();

      if (!st.text) continue;

      // The run of digits lies on the line itself, spaced like text, growing as it flows toward you.
      const set = st.hue < 0.34 ? sprites.teal : st.hue < 0.67 ? sprites.spectrum[0] : sprites.spectrum[1];
      const sizeAt = (u: number) => (W < 640 ? 7 : 9) + (W < 640 ? 11 : 15) * Math.pow(Math.max(0, u), 1.2);
      const slot = (u: number) => (sizeAt(u) * 0.66) / (W * 1.04); // one character's width, in u
      let u = -st.shift * slot(0);
      for (let j = 0; u < 1.01; j++) {
        if (u > 0) {
          const x = u * W * 1.04 - W * 0.02 + shiftX;
          const y = strandY(st, u);
          const angle = Math.atan2(strandY(st, u + 0.004) - y, W * 0.00416);
          const size = sizeAt(u);
          const edge = Math.min(1, u * 9, (1.01 - u) * 25); // gentle fade in on the left
          const bit = st.pattern[(((j - st.base) % 64) + 64) % 64];
          const spr = (u > 0.7 ? set.near : set.mid)[bit];
          const sw = (spr.width / SPRITE_PX) * size;
          ctx.globalAlpha = Math.min(1, a * (0.35 + 0.65 * u) * edge);
          const c = Math.cos(angle) * dpr;
          const sn = Math.sin(angle) * dpr;
          ctx.setTransform(c, sn, -sn, c, x * dpr, y * dpr);
          ctx.drawImage(spr, -sw / 2, -sw / 2, sw, sw);
        }
        u += slot(u);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // back to normal before the next strand's line
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function renderParticles() {
    const a = p.particles * Math.min(1, p.brightness * intensity * 1.6);
    if (a < 0.01) return;
    ctx.globalCompositeOperation = "lighter";
    for (const q of particles) {
      const tw = 0.45 + 0.55 * Math.sin(clock * q.speed + q.phase);
      ctx.globalAlpha = a * tw * (q.size > 4 ? 0.9 : 0.6);
      const s = q.size * 3; // sprite includes its glow halo
      ctx.drawImage(sprites.square, q.x * W - camX * 2 - s / 2, q.y * H - camY * 2 - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function renderStreams() {
    streams.sort((a, b) => b.z - a.z); // painter's order: far first

    const density = p.density * vary.density * quality;
    const bright = p.brightness * vary.brightness * intensity;
    const wG = p.green;
    const wT = p.teal;
    const wS = p.spectrum;

    for (const s of streams) {
      // Streams fade in/out across a soft band as density changes, instead of popping.
      const vis = Math.min(1, Math.max(0, (density - s.rank) / 0.08 + 0.5));
      if (vis <= 0) continue;

      const scale = focal / s.z;
      const t = (s.z - Z_NEAR) / Z_RANGE; // 0 near → 1 far
      let depthAlpha = Math.pow(1 - t, 1.2) * 0.85 + 0.15;
      if (s.z < Z_NEAR + 10) depthAlpha *= (s.z - Z_NEAR) / 10; // fade as it passes the camera
      const alpha = Math.min(1, depthAlpha * vis * bright);
      if (alpha < 0.004) continue;

      const tier: keyof Tiered = t < 0.14 ? "near" : t < 0.45 ? "mid" : "far";
      const spec = sprites.spectrum[s.hue];
      // Bokeh: far digits drawn larger and softer, like an out-of-focus background.
      const bokehScale = tier === "far" ? 1 + p.bokeh * 0.9 : 1;
      const size = GLYPH * scale * 0.95 * bokehScale;
      const len = Math.max(3, Math.round(s.len * p.trail));
      const headCell = Math.floor(s.y / GLYPH);
      const glowing = s.glow > 0.02;
      const hi = s.violet ? sprites.hiViolet : sprites.hiCyan;

      for (let k = 0; k <= len; k++) {
        const cell = headCell - k;
        const wy = cell * GLYPH;
        const wx = s.x + p.wave * Math.sin(wy * 0.16 + s.phase + clock * 0.6);
        const px = W / 2 + (wx - camX) * scale;
        const py = H / 2 + (wy - camY) * scale;
        if (py < -size * 2 || py > H + size * 2 || px < -size * 2 || px > W + size * 2) continue;

        const bit = s.cells[((cell % CELLS) + CELLS) % CELLS];
        const fade = k === 0 ? 1 : Math.pow(1 - k / len, 1.5) * 0.9;
        const key: keyof Tiered = k === 0 ? "head" : tier;
        const a = alpha * fade * (glowing ? 1 - s.glow * 0.7 : 1);
        const w = (sprites.green.near[0].width / SPRITE_PX) * size; // all glyph sprites share a box

        // Palette weights are blended, so a mode change recolours the field gradually.
        if (wG > 0.02) draw(sprites.green[key][bit], px, py, w, a * wG);
        if (wT > 0.02) draw(sprites.teal[key][bit], px, py, w, a * wT);
        if (wS > 0.02) {
          ctx.globalCompositeOperation = "lighter";
          draw(spec[key][bit], px, py, w, a * wS);
          ctx.globalCompositeOperation = "source-over";
        }
        if (glowing) draw(hi[bit], px, py, w, alpha * fade * s.glow);
      }
    }
    ctx.globalAlpha = 1;
  }

  function draw(img: HTMLCanvasElement, x: number, y: number, w: number, a: number) {
    if (a < 0.004) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, x - w / 2, y - w / 2, w, w);
  }

  return {
    resize(width, height, ratio) {
      dpr = ratio;
      W = width;
      H = height;
      focal = H * 0.9;
      intensity = W < 640 ? 0.72 : 1;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      vignette = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.4, W / 2, H / 2, Math.max(W, H) * 0.8);
      vignette.addColorStop(0, `rgba(${BG}, 0)`);
      vignette.addColorStop(1, `rgba(${BG}, 0.9)`);
      light = ctx.createRadialGradient(W * 0.55, -H * 0.1, 0, W * 0.55, -H * 0.1, Math.max(W, H) * 0.75);
      light.addColorStop(0, "rgba(110, 255, 225, 0.22)");
      light.addColorStop(0.5, "rgba(40, 160, 150, 0.08)");
      light.addColorStop(1, "rgba(0, 0, 0, 0)");
      populate();
    },

    step(dt) {
      clock += dt;

      // Blend every parameter toward the target mode.
      const k = dt > 0 ? 1 - Math.exp(-dt / BLEND_S) : 0;
      for (const key of KEYS) p[key] += (goal[key] - p[key]) * k;

      // Timed variation: re-roll small multipliers, ease into them over a few seconds.
      if ((nextVary -= dt) <= 0) {
        nextVary = rand(12, 20);
        // Small enough to be felt rather than seen: the field breathes, it never "changes".
        varyAim.speed = rand(0.92, 1.08);
        varyAim.density = rand(0.94, 1.06);
        varyAim.brightness = rand(0.95, 1.05);
        if (p.highlight > 0.05) for (let i = 0; i < 2; i++) triggerHighlight();
      }
      const kv = 1 - Math.exp(-dt / 5);
      vary.speed += (varyAim.speed - vary.speed) * kv;
      vary.density += (varyAim.density - vary.density) * kv;
      vary.brightness += (varyAim.brightness - vary.brightness) * kv;

      travel(dt * p.drift + pendingFly);
      pendingFly = 0;

      const decay = Math.exp(-dt / 1.1);
      for (const s of streams) {
        s.y += s.speed * p.speed * vary.speed * dt;
        if (s.y - s.len * p.trail * GLYPH > halfH(s.z) * 1.1) place(s, s.z, false);
        if (Math.random() < 0.35) s.cells[(Math.random() * CELLS) | 0] ^= 1;
        s.glow *= decay;
      }

      highlightDebt += p.highlight * dt;
      while (highlightDebt >= 1) {
        triggerHighlight();
        highlightDebt -= 1;
      }

      stepLayers(dt);

      const swayX = Math.sin(clock * 0.13) * 3;
      const swayY = Math.cos(clock * 0.09) * 1.5;
      const kc = Math.min(1, dt * 2.5);
      camX += (aimX * 6 + swayX - camX) * kc;
      camY += (aimY * 3.5 + swayY - camY) * kc;
    },

    render() {
      ctx.clearRect(0, 0, W, H);

      if (light && p.light > 0.01) {
        ctx.globalAlpha = Math.min(1, p.light);
        ctx.fillStyle = light;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }

      renderStreams();
      renderFibers();
      renderCurrents();
      renderNetwork();
      renderParticles();

      if (vignette) {
        ctx.globalAlpha = p.vignette;
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    },

    setMode(mode, immediate) {
      Object.assign(goal, MODES[mode]);
      if (immediate) Object.assign(p, MODES[mode]);
    },

    setBlend(a, b, t, immediate) {
      const A = MODES[a];
      const B = MODES[b];
      for (const key of KEYS) goal[key] = A[key] + (B[key] - A[key]) * t;
      if (immediate) Object.assign(p, goal);
    },

    pointer(nx, ny) {
      aimX = nx;
      aimY = ny;
    },

    fly(delta) {
      pendingFly += delta;
    },

    setFont(next) {
      sprites = buildSprites(next);
    },

    setQuality(q) {
      quality = Math.min(1, Math.max(0.35, q));
    },

    getQuality() {
      return quality;
    },
  };
}

// --- Sprite factory -----------------------------------------------------------------------
const PAD = 26; // every glyph sprite shares one box so they can be layered for palette blends
const BOX = SPRITE_PX + PAD * 2;

function glyph(char: string, color: string, blur: number, font: string) {
  const c = document.createElement("canvas");
  c.width = c.height = BOX;
  const x = c.getContext("2d")!;
  x.font = `500 ${SPRITE_PX}px ${font}`;
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillStyle = color;
  if (blur) {
    x.shadowColor = color;
    x.shadowBlur = blur;
    x.fillText(char, BOX / 2, BOX / 2); // extra pass strengthens the glow
  }
  x.fillText(char, BOX / 2, BOX / 2);
  return c;
}

function tiered(palette: Record<keyof Tiered, [string, number]>, font: string): Tiered {
  const pair = ([color, blur]: [string, number]): Pair => [glyph("0", color, blur, font), glyph("1", color, blur, font)];
  return { head: pair(palette.head), near: pair(palette.near), mid: pair(palette.mid), far: pair(palette.far) };
}

function glowSprite(draw: (x: CanvasRenderingContext2D, size: number) => void, size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d")!, size);
  return c;
}

function buildSprites(font: string): Sprites {
  const pair = (color: string, blur: number): Pair => [glyph("0", color, blur, font), glyph("1", color, blur, font)];
  return {
    green: tiered(PALETTES.green, font),
    teal: tiered(PALETTES.teal, font),
    spectrum: [tiered(PALETTES.cyan, font), tiered(PALETTES.blue, font), tiered(PALETTES.violet, font)],
    hiCyan: pair("#9ff6ff", 16),
    hiViolet: pair("#e2a6ff", 16),
    dot: glowSprite((x, s) => {
      const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, "rgba(220, 255, 255, 1)");
      g.addColorStop(0.18, "rgba(0, 229, 255, 0.95)");
      g.addColorStop(0.45, "rgba(0, 229, 255, 0.25)");
      g.addColorStop(1, "rgba(0, 229, 255, 0)");
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
    }),
    square: glowSprite((x, s) => {
      const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, "rgba(0, 229, 255, 0.35)");
      g.addColorStop(1, "rgba(0, 229, 255, 0)");
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      x.fillStyle = "#33ecff";
      x.fillRect(s / 3, s / 3, s / 3, s / 3);
    }),
  };
}
