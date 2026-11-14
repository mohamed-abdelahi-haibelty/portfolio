import { SketchDev } from "@/components/character/SketchDev";
import { cn } from "@/lib/utils";

const tagColors = ["bg-lime", "bg-sky", "bg-pink"] as const;

type DevBadgeProps = {
  /** `badge.header`, `badge.name`, `badge.role`, `badge.tags`. */
  header: string;
  name: string;
  role: string;
  tags: readonly [string, string, string];
  /** `hero.characterAlt`. */
  characterAlt: string;
  className?: string;
};

/**
 * Lanyard ID card for the desktop hero: two blue straps meeting at a metal
 * clip, a white card tilted 4° with the sketch character on a yellow tile.
 */
export function DevBadge({ header, name, role, tags, characterAlt, className }: DevBadgeProps) {
  return (
    <div className={cn("relative h-[580px] w-[340px]", className)}>
      <svg
        aria-hidden="true"
        focusable="false"
        width="340"
        height="170"
        viewBox="0 0 340 170"
        fill="none"
        strokeLinecap="round"
        className="absolute top-0 left-0"
      >
        <path d="M40 0 L150 150 M300 0 L190 150" strokeWidth="16" className="stroke-pen" />
        <path
          d="M40 0 L150 150 M300 0 L190 150"
          strokeWidth="2"
          strokeDasharray="6 10"
          opacity=".7"
          className="stroke-white"
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute top-[132px] left-[128px] z-20 h-[30px] w-11 rounded-lg border-2 border-ink bg-linear-to-b from-metal-light to-metal-dark"
      />
      <div className="absolute top-[140px] left-0 h-[430px] w-[320px] rotate-4 overflow-hidden rounded-card border-3 border-ink bg-white text-ink shadow-badge">
        <div className="flex h-16 items-center justify-between bg-pen px-5 text-white">
          <span className="text-[15px] font-extrabold tracking-[0.14em]">{header}</span>
          <span aria-hidden="true" className="h-3 w-11 rounded-md bg-white" />
        </div>
        <div className="place-items-end-center mx-auto mt-[18px] grid size-[210px] overflow-hidden rounded-2xl border-3 border-ink bg-highlight">
          <SketchDev
            alt={characterAlt}
            width={270}
            strokeWidth={3.4}
            accent="lime"
            className="flex-none"
          />
        </div>
        <p className="mt-3.5 text-center font-display text-2xl font-extrabold">{name}</p>
        <p className="text-center text-[15px] font-medium text-muted">{role}</p>
        <ul className="mt-3.5 flex justify-center gap-1.5">
          {tags.map((tag, index) => (
            <li
              key={tag}
              className={cn("rounded-md px-[9px] py-[5px] text-xs font-bold", tagColors[index])}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
