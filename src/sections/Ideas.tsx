import { IdeasWindow } from "@/components/IdeasWindow";
import { HandArrow } from "@/components/paper/HandArrow";
import { HandNote } from "@/components/paper/HandNote";
import { Highlight } from "@/components/paper/Highlight";
import { Scrap } from "@/components/paper/Scrap";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";
import { anchorOffset, container } from "./layout";

type IdeasProps = {
  t: Dictionary["ideas"];
};

const scrapColors = ["highlight", "sky", "pink", "lime", "white"] as const;

/** Desktop scatter (a 700×320 drawing): position, tilt and wrap width of each scrap. */
const desktopScraps = [
  { rotate: -6, className: "start-0 top-5 max-w-[11.5rem]" },
  { rotate: 5, className: "start-[236px] top-0 max-w-[8.5rem]" },
  { rotate: 3, className: "start-[26px] top-[140px] max-w-[16rem]" },
  { rotate: -4, className: "start-[336px] top-[120px] max-w-[8.5rem]" },
  { rotate: 8, className: "start-[456px] top-10" },
] as const;

const mobileRotations = [-4, 3, 2, -3] as const;

/** A loose grey pen squiggle under the desktop scraps. */
function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="290"
      height="30"
      viewBox="0 0 290 30"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      className={cn("stroke-muted opacity-70", className)}
    >
      <path d="M2 18 C30 4 50 4 70 16 S110 30 130 16 S170 0 192 14 S236 28 258 14 S280 8 288 12" />
    </svg>
  );
}

export function Ideas({ t }: IdeasProps) {
  return (
    <section
      id="ideas"
      aria-labelledby="ideas-title"
      className={cn(container, anchorOffset, "mt-16 lg:mt-6")}
    >
      <h2 id="ideas-title" className="font-display text-h2 font-extrabold text-ink">
        {t.title.before}
        <Highlight>{t.title.highlight}</Highlight>
      </h2>
      <p className="mt-3 max-w-[760px] text-body text-muted lg:mt-5 lg:text-lg lg:leading-[1.55]">
        {t.lead}
      </p>

      {/* Under 1024px: scraps wrap, a down arrow with the note, then the window. */}
      <div className="lg:hidden">
        <ul className="mt-[22px] flex flex-wrap gap-x-2.5 gap-y-3">
          {t.scraps.slice(0, 4).map((scrap, index) => (
            <li key={scrap}>
              <Scrap color={scrapColors[index] ?? "white"} rotate={mobileRotations[index] ?? 0}>
                {scrap}
              </Scrap>
            </li>
          ))}
        </ul>
        <div className="ms-5 mt-4 mb-3 flex items-center gap-2.5">
          <HandArrow variant="down" className="flex-none" />
          <HandNote className="text-lg leading-tight">{t.arrow}</HandNote>
        </div>
        <div className="max-w-xl">
          <IdeasWindow label={t.windowLabel} items={t.result} />
        </div>
      </div>

      {/* From 1024px: scattered scraps, a curved arrow, the window and "a real project". */}
      <div className="mt-[26px] hidden items-start justify-between gap-6 lg:flex">
        <div className="relative h-[320px] w-[700px] flex-none lg:[zoom:0.66] xl:[zoom:1]">
          <ul>
            {t.scraps.map((scrap, index) => {
              const place = desktopScraps[index];
              return (
                <li key={scrap} className={cn("absolute", place?.className)}>
                  <Scrap color={scrapColors[index] ?? "white"} rotate={place?.rotate ?? 0}>
                    {scrap}
                  </Scrap>
                </li>
              );
            })}
          </ul>
          <Squiggle className="absolute -start-2.5 top-[262px]" />
          <HandArrow className="absolute start-[530px] top-[96px]" />
          <HandNote
            rotate={-3}
            className="absolute start-[532px] top-[186px] max-w-[11rem] text-[22px]"
          >
            {t.arrow}
          </HandNote>
        </div>
        <div className="w-full max-w-[426px] min-w-0">
          <IdeasWindow label={t.windowLabel} items={t.result} />
          <HandNote className="ms-auto mt-4 w-fit pe-6 text-2xl">{t.done}</HandNote>
        </div>
      </div>
    </section>
  );
}
