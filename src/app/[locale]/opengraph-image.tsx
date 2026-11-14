import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getDictionary, isLocale } from "@/content";
import type { Dictionary } from "@/content/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Design tokens (`globals.css`): the image renderer cannot read CSS variables. */
const color = {
  paper: "#FCFCFA",
  grid: "#E3E8F0",
  ink: "#15171C",
  lime: "#C6F432",
  white: "#FFFFFF",
};

const display = await readFile(
  join(process.cwd(), "src/assets/fonts/BricolageGrotesque-ExtraBold.ttf"),
);

function svgUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Same drawing as `LogoMark`. */
const mark = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
<rect width="48" height="48" rx="11" fill="${color.ink}"/>
<g fill="none" stroke="${color.white}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
<circle cx="21" cy="19" r="8.5"/><path d="M12.8 16.6 C14.4 9.6 26 8.6 29 15.4"/>
<path d="M18.2 21.6 q2.8 2 5.6 0"/><path d="M8.5 41 C9.5 33.5 14.5 30 21 30 C24.5 30 27 31 29 32.6"/></g>
<circle cx="17.8" cy="17.6" r="1.1" fill="${color.white}"/><circle cx="24.2" cy="17.6" r="1.1" fill="${color.white}"/>
<path d="M25.5 41 L29.5 32.5 H40.5 L36.5 41 Z" stroke="${color.white}" stroke-width="2.2" stroke-linejoin="round" fill="${color.lime}"/>
</svg>`);

/** Same drawing as `SketchDev`, lime laptop. */
const character =
  svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 258" fill="none" stroke="${color.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
<path d="M40 228 H270"/><path d="M70 228 C70 190 92 168 126 164 C150 161 172 168 182 186"/>
<circle cx="132" cy="118" r="30"/><path d="M104 106 C110 84 150 80 162 102"/><path d="M124 124 q8 6 16 0"/>
<circle cx="122" cy="114" r="2.2" fill="${color.ink}"/><circle cx="144" cy="114" r="2.2" fill="${color.ink}"/>
<path d="M150 228 L176 168 H262 L238 228 Z" fill="${color.lime}"/>
<path d="M196 196 l10 -10 M210 204 l18 -18 M212 186 l6 6"/><path d="M118 184 C130 200 150 206 170 204"/>
</svg>`);

type Segment = { text: string; highlight: boolean };

/**
 * The H1 as words, each word a list of segments, so the renderer can wrap
 * between words while "sûres," keeps its comma on the same line.
 */
function titleWords(title: Dictionary["hero"]["title"]): Segment[][] {
  const parts: Segment[] = [
    { text: title.start, highlight: false },
    { text: title.highlight, highlight: true },
    { text: title.afterHighlight, highlight: false },
    { text: title.circle, highlight: false },
    { text: title.afterCircle, highlight: false },
    { text: title.wavy, highlight: false },
    { text: title.end, highlight: false },
  ];
  const words: Segment[][] = [[]];
  for (const part of parts) {
    part.text.split(/( +)/).forEach((piece) => {
      if (piece === "") return;
      if (piece.trim() === "") words.push([]);
      else words.at(-1)?.push({ text: piece, highlight: part.highlight });
    });
  }
  return words.filter((word) => word.length > 0);
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "64px 72px",
        backgroundColor: color.paper,
        backgroundImage: `linear-gradient(${color.grid} 1px, transparent 1px), linear-gradient(90deg, ${color.grid} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        fontFamily: "Bricolage Grotesque",
        color: color.ink,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img src={mark} width={60} height={60} alt="" />
        <span style={{ fontSize: 36, letterSpacing: "-0.03em" }}>{dict.logo.text}</span>
      </div>

      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 660,
            columnGap: 18,
            fontSize: 66,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
          }}
        >
          {titleWords(dict.hero.title).map((word, i) => (
            <span key={i} style={{ display: "flex" }}>
              {word.map((segment, j) => (
                <span
                  key={j}
                  style={
                    segment.highlight
                      ? {
                          padding: "0 6px",
                          margin: "0 -6px",
                          backgroundImage: `linear-gradient(transparent 40%, ${color.lime} 40%, ${color.lime} 90%, transparent 90%)`,
                        }
                      : {}
                  }
                >
                  {segment.text}
                </span>
              ))}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 360,
            height: 330,
            backgroundColor: color.white,
            border: `3px solid ${color.ink}`,
            borderRadius: 24,
            boxShadow: `10px 10px 0 ${color.ink}`,
            transform: "rotate(2deg)",
          }}
        >
          <img src={character} width={300} height={258} alt="" />
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Bricolage Grotesque", data: display, weight: 800, style: "normal" }],
    },
  );
}

/** One image per locale, with the localized alt text (`seo.ogAlt`). */
export function generateImageMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return [{ id: "card", alt: dict.seo.ogAlt, size, contentType }];
}
