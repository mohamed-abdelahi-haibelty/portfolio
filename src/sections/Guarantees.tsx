import { BoltIcon } from "@/components/icons/BoltIcon";
import { CodeIcon } from "@/components/icons/CodeIcon";
import { MagnifierIcon } from "@/components/icons/MagnifierIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { HandNote } from "@/components/paper/HandNote";
import { MarkerTitle } from "@/components/paper/MarkerTitle";
import { StickyNote } from "@/components/paper/StickyNote";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";
import { anchorOffset, container } from "./layout";

type GuaranteesProps = {
  t: Dictionary["guarantees"];
};

const notes = [
  { Icon: ShieldIcon, color: "highlight", rotate: -3, pin: "pen" },
  { Icon: BoltIcon, color: "sky", rotate: 2, pin: "pin-pink" },
  { Icon: MagnifierIcon, color: "pink", rotate: -1.5, pin: "pen" },
  { Icon: CodeIcon, color: "lime", rotate: 3, pin: "pin-pink" },
] as const;

/** Four pinned sticky notes: a row on desktop, 2×2 on tablet, stacked on mobile. */
export function Guarantees({ t }: GuaranteesProps) {
  return (
    <section
      id="guarantees"
      aria-labelledby="guarantees-title"
      className={cn(container, anchorOffset, "mt-16 lg:mt-12")}
    >
      <div className="lg:grid lg:grid-cols-2 lg:items-center">
        <MarkerTitle id="guarantees-title" color="highlight" rotate={-1.5}>
          {t.title}
        </MarkerTitle>
        <HandNote className="mt-1.5 lg:mt-0 lg:text-[26px]">{t.note}</HandNote>
      </div>
      <ul className="mt-[26px] grid gap-[22px] md:mt-12 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-[110px] lg:grid-cols-4 lg:gap-[30px]">
        {t.items.map((item, index) => {
          const note = notes[index];
          if (!note) return null;
          return (
            <li key={item.title} className={cn(index % 2 === 1 && "lg:mt-[26px]")}>
              <StickyNote
                title={item.title}
                text={item.text}
                icon={<note.Icon size={26} />}
                color={note.color}
                rotate={note.rotate}
                pin={note.pin}
                className="h-full"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
