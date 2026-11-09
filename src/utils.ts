export type ClassValue = string | number | false | null | undefined | ClassValue[];

/** Tiny className joiner (no dependency on clsx). */
export function cx(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (Array.isArray(v)) {
      const inner = cx(...v);
      if (inner) out.push(inner);
    } else out.push(String(v));
  }
  return out.join(" ");
}

export type Tone = "neutral" | "blue" | "purple" | "red" | "green" | "amber" | "pink" | "inverse";

/** Resolve a tone name to its CSS color variable (for charts / custom styling). */
export const toneColor = (tone: Tone = "blue") =>
  tone === "neutral" ? "var(--hx-fg-secondary)" : tone === "inverse" ? "var(--hx-primary)" : `var(--hx-${tone})`;
