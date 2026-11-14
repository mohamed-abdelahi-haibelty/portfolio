import { HandNote } from "@/components/paper/HandNote";
import { MarkerTitle } from "@/components/paper/MarkerTitle";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";
import { anchorOffset, container } from "./layout";

type MethodProps = {
  t: Dictionary["method"];
};

const circleColors = ["bg-lime", "bg-sky", "bg-pink", "bg-highlight"] as const;

/** Desktop: the blue wavy line through the circles (down, up, down, up). */
function Wave() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1152 100"
      preserveAspectRatio="none"
      fill="none"
      strokeWidth="4"
      strokeLinecap="round"
      className="pointer-events-none absolute -inset-x-11 top-0 hidden h-[100px] w-[calc(100%+5.5rem)] stroke-pen lg:block"
    >
      <path
        vectorEffect="non-scaling-stroke"
        d="M0 60 C40 76 70 76 112 72 C220 64 300 28 402 28 C510 28 590 72 692 72 C800 72 880 28 982 28 C1060 28 1110 50 1152 40"
      />
    </svg>
  );
}

/**
 * Four steps. Desktop: a row along a wavy line with alternating circles.
 * Under 1024px: a vertical list with a dashed line on the left.
 */
export function Method({ t }: MethodProps) {
  return (
    <section
      id="method"
      aria-labelledby="method-title"
      className={cn(container, anchorOffset, "mt-16 lg:mt-20")}
    >
      <div className="lg:grid lg:grid-cols-2 lg:items-center">
        <MarkerTitle id="method-title" color="sky" rotate={1.5}>
          {t.title}
        </MarkerTitle>
        <HandNote className="mt-1.5 lg:mt-0 lg:text-[26px]">{t.note}</HandNote>
      </div>
      <div className="relative mt-6 lg:mt-[50px]">
        <Wave />
        <ol className="relative flex flex-col gap-5 border-s-3 border-dashed border-ink ps-3.5 lg:grid lg:grid-cols-4 lg:gap-[30px] lg:border-0 lg:ps-0">
          {t.steps.map((step, index) => (
            <li key={step.title} className="flex gap-3.5 lg:block">
              <span className="flex-none lg:flow-root lg:h-[116px]">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-10 place-items-center rounded-full border-3 border-ink text-lg font-extrabold text-ink lg:ms-10 lg:size-14 lg:font-display lg:text-2xl",
                    circleColors[index],
                    index % 2 === 0 && "lg:mt-11",
                  )}
                >
                  {index + 1}
                </span>
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink lg:font-display lg:text-2xl lg:font-extrabold">
                  {step.title}
                </h3>
                <p className="mt-1 text-body text-muted lg:mt-1.5">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
