import { ImageResponse } from "next/og";
import { PROFILE } from "./data";

// The link-preview card (WhatsApp, LinkedIn, X, Slack…), rendered once at build time.
export const alt = `${PROFILE.name}: ${PROFILE.role}. I build software that stays up.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#090b09";
const CREAM = "#f0eee6";
const STONE = "#a6a69b";
const CYAN = "#00e5ff";

// The site's fonts: Instrument Serif for the headline, Geist for small text. Google Fonts serves TTF
// to non-browser clients; if a fetch fails (offline build), the card falls back to the default font
// rather than failing the build.
async function googleFont(query: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`https://fonts.googleapis.com/css2?family=${query}`, {
      headers: {
        // Request TTF format from Google Fonts API for Satori / @vercel/og
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    });
    const css = await res.text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

// Deterministic "rain" so the card is identical on every build.
const COLUMNS = Array.from({ length: 34 }, (_, c) => {
  const seed = (c * 2654435761) >>> 0;
  return {
    left: 18 + c * 35 + (seed % 9),
    top: -40 + (seed % 260),
    len: 6 + (seed % 11),
    opacity: 0.1 + ((seed >> 4) % 22) / 100,
    digits: Array.from({ length: 18 }, (_, r) => (((seed >> (r % 24)) ^ r) & 1 ? "1" : "0")),
  };
});

export default async function OpengraphImage() {
  const [regular, italic, sans, sansBold] = await Promise.all([
    googleFont("Instrument+Serif:ital@0"),
    googleFont("Instrument+Serif:ital@1"),
    googleFont("Geist:wght@400"),
    googleFont("Geist:wght@700"),
  ]);
  const fonts = [
    ...(sans ? [{ name: "Geist", data: sans, style: "normal" as const, weight: 400 as const }] : []),
    ...(sansBold ? [{ name: "Geist", data: sansBold, style: "normal" as const, weight: 700 as const }] : []),
    ...(regular ? [{ name: "Instrument Serif", data: regular, style: "normal" as const, weight: 400 as const }] : []),
    ...(italic ? [{ name: "Instrument Serif", data: italic, style: "italic" as const, weight: 400 as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: BG, overflow: "hidden", fontFamily: "Geist" }}>
        {COLUMNS.map((col, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: col.left,
              top: col.top,
              display: "flex",
              flexDirection: "column",
              fontSize: 20,
              lineHeight: 1.15,
              color: "#3ddc6e",
              opacity: col.opacity,
            }}
          >
            {col.digits.slice(0, col.len).map((d, r) => (
              <span key={r} style={{ opacity: 0.35 + (r / col.len) * 0.65 }}>
                {d}
              </span>
            ))}
          </div>
        ))}

        {/* Dark pool behind the text, as on the site. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "radial-gradient(ellipse 70% 75% at 32% 52%, rgba(9,11,9,0.96) 40%, rgba(9,11,9,0.55) 75%, rgba(9,11,9,0.2) 100%)",
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 80px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: CYAN,
                color: "#00171b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              N
            </div>
            <div style={{ display: "flex", color: STONE, fontSize: 24 }}>oanyarko7</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Instrument Serif", color: CREAM, fontSize: 112, lineHeight: 0.95, letterSpacing: -2 }}>
            <div style={{ display: "flex" }}>I build software</div>
            <div style={{ display: "flex" }}>
              that&nbsp;<span style={{ fontStyle: "italic", color: CYAN }}>stays up.</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", color: CREAM, fontSize: 30 }}>{PROFILE.name}</div>
            <div style={{ display: "flex", color: STONE, fontSize: 22 }}>
              {PROFILE.role} · Co-founder, Cipher · {PROFILE.location}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
