import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";

export type SplitBy = "word" | "char";

const TYPE_STEP_MS = 95; // average gap between typed characters — an unhurried, human pace
const TYPE_JITTER_MS = 35; // ± variation per keystroke
const SPACE_MS = 190; // a word break takes a little longer, as it does when typing

// Splits the text inside `node` for staggered reveals, recursing into elements like <em> and
// <span> so styling is kept; whitespace and <br /> stay as they are. Works on server and client.
//  - "word": each word becomes <span class="w" style="--i:n">.
//  - "char": each word becomes a no-wrap <span class="w"> of <span class="c" style="--t:ms">
//    letters, timed like typing (slightly uneven, with a beat at each space).
// Returns the split tree and, for "char", the total typing time in ms.
export function splitText(node: ReactNode, by: SplitBy = "word"): { node: ReactNode; totalMs: number } {
  let i = 0;
  let t = 0;
  let last = -1; // index of the final character; it keeps the cursor blinking once typing ends
  // Deterministic jitter (same on server and client, so hydration matches) for a human typing rhythm.
  const nextGap = () => TYPE_STEP_MS + ((((i + 1) * 2654435761) >>> 0) % (TYPE_JITTER_MS * 2 + 1)) - TYPE_JITTER_MS;

  const word = (text: string, key: number) => {
    if (by === "word") {
      return (
        <span key={key} className="w" style={{ "--i": i++ } as CSSProperties}>
          {text}
        </span>
      );
    }
    return (
      <span key={key} className="w">
        {Array.from(text).map((ch, k) => {
          const el = (
            <span key={k} className={i === last ? "c last" : "c"} style={{ "--t": `${t}ms` } as CSSProperties}>
              {ch}
            </span>
          );
          t += nextGap();
          i++;
          return el;
        })}
      </span>
    );
  };

  const walk = (n: ReactNode): ReactNode => {
    if (typeof n === "string") {
      return n.split(/(\s+)/).map((part, k) => {
        if (part.trim() !== "") return word(part, k);
        if (by === "char" && part) t += SPACE_MS - TYPE_STEP_MS; // on top of the last key's gap
        return part;
      });
    }
    if (Array.isArray(n)) return Children.map(n, walk);
    if (isValidElement(n)) {
      const el = n as ReactElement<{ children?: ReactNode }>;
      if (el.props.children === undefined) return el;
      return cloneElement(el, undefined, walk(el.props.children));
    }
    return n;
  };

  if (by === "char") {
    walk(node); // first pass only counts characters, so the last one can be marked
    last = i - 1;
    i = 0;
    t = 0;
  }
  const out = walk(node);
  return { node: out, totalMs: t };
}
