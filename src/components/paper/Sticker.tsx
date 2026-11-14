import { cn } from "@/lib/utils";

type StickerProps = {
  /** `hero.sticker`, e.g. "100 % sur mesure !". */
  text: string;
  className?: string;
};

/** As in the design, the figure ("100 %") sits on its own first line. */
function lines(text: string): [string, string] | [string] {
  const match = /^(\d+\s?%)\s+(.+)$/u.exec(text);
  return match?.[1] && match[2] ? [match[1], match[2]] : [text];
}

/** Round pink sticker with handwritten text, tilted −12°. */
export function Sticker({ text, className }: StickerProps) {
  const [first, second] = lines(text);
  return (
    <span
      className={cn(
        "grid size-[104px] -rotate-12 place-items-center rounded-full border-3 border-ink bg-pink p-1 text-center font-hand text-[17px] leading-none font-bold text-ink md:size-[150px] md:p-2.5 md:text-2xl md:leading-[1.05]",
        className,
      )}
    >
      <span>
        {first}
        {second === undefined ? null : (
          <>
            <br />
            {second}
          </>
        )}
      </span>
    </span>
  );
}
