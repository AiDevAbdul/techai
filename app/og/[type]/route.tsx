import { ImageResponse } from "next/og";

/*
 * /og/[type] — dynamic OpenGraph image generator (spec §11).
 *
 * Types:
 *   - default     → Apple-keynote title + accent dot
 *   - case-study  → "Case study" eyebrow + serif title
 *   - lab-note    → "Lab note" eyebrow + serif title + category line
 *   - audit       → "Workflow audit bot" + mono badge
 *   - service     → "Service" eyebrow + serif title
 *
 * Query params:
 *   title    — large display text (required)
 *   eyebrow  — small uppercase eyebrow (optional; defaults per type)
 *   meta     — small footer line (optional; e.g. "8 min read · Practice")
 *
 * Fonts are fetched from Google Fonts (Fraunces 600) and cached aggressively.
 * Runtime is Fluid Compute (Next 16 default).
 */

const SIZE = { width: 1200, height: 630 } as const;
const ACCENT = "#15573D";
const INK = "#1B1B1F";
const INK_SECONDARY = "#5C5C66";
const SURFACE = "#FBFBFD";
const SURFACE_LINE = "#E5E5E7";

const TYPE_DEFAULTS: Record<string, { eyebrow: string }> = {
  default: { eyebrow: "Abdul Wahab · techai.pk" },
  "case-study": { eyebrow: "Case study · techai.pk" },
  "lab-note": { eyebrow: "Lab note · techai.pk" },
  audit: { eyebrow: "Workflow audit bot · techai.pk" },
  service: { eyebrow: "Service · techai.pk" },
};

async function loadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:wght@600&display=swap",
      { cache: "force-cache" },
    );
    const css = await res.text();
    const match = css.match(/src:\s*url\((https:[^)]+\.woff2)\)/);
    if (!match || !match[1]) return null;
    const fontRes = await fetch(match[1], { cache: "force-cache" });
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ type: string }> },
): Promise<Response> {
  const { type } = await ctx.params;
  const url = new URL(req.url);
  const title =
    url.searchParams.get("title") ??
    "AI workflow systems for operators, teams, and communities";
  const defaults = TYPE_DEFAULTS[type] ?? TYPE_DEFAULTS.default!;
  const eyebrow = url.searchParams.get("eyebrow") ?? defaults.eyebrow;
  const meta = url.searchParams.get("meta");

  const fraunces = await loadFraunces();

  const imageOptions: ConstructorParameters<typeof ImageResponse>[1] = {
    ...SIZE,
  };
  if (fraunces) {
    imageOptions.fonts = [
      {
        name: "Fraunces",
        data: fraunces,
        weight: 600,
        style: "normal",
      },
    ];
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          background: SURFACE,
          color: INK,
        }}
      >
        {/* Top strip — eyebrow + accent dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            color: INK_SECONDARY,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: ACCENT,
            }}
          />
          <span>{eyebrow}</span>
        </div>

        {/* Title — Fraunces serif, big, max ~16 words */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontFamily: fraunces ? "Fraunces" : "serif",
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            maxWidth: 980,
          }}
        >
          {title}
        </div>

        {/* Hairline */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            height: 1,
            background: SURFACE_LINE,
            width: "100%",
          }}
        />

        {/* Footer row — site mark + optional meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
            fontSize: 22,
            color: INK_SECONDARY,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: fraunces ? "Fraunces" : "serif",
              color: INK,
              fontSize: 26,
              letterSpacing: "-0.01em",
            }}
          >
            Abdul Wahab
          </div>
          <div style={{ display: "flex" }}>
            {meta ?? "techai.pk"}
          </div>
        </div>
      </div>
    ),
    imageOptions,
  );
}
