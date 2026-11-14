type IdeasWindowProps = {
  /** `ideas.windowLabel`. */
  label: string;
  /** `ideas.result`. */
  items: readonly string[];
};

/** A small app window listing what a project becomes, each row checked in pen blue. */
export function IdeasWindow({ label, items }: IdeasWindowProps) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white text-ink shadow-window">
      <div
        aria-hidden="true"
        className="flex gap-1.5 border-b-2 border-ink px-3 py-2.5 md:px-3.5 md:py-3"
      >
        <span className="size-2.5 rounded-full bg-dot-red md:size-[11px]" />
        <span className="size-2.5 rounded-full bg-dot-yellow md:size-[11px]" />
        <span className="size-2.5 rounded-full bg-dot-green md:size-[11px]" />
      </div>
      <div className="px-4 pt-2.5 pb-1.5 md:px-[22px] md:pt-3.5 md:pb-2.5">
        <p className="mb-1 text-label font-bold tracking-[0.1em] text-muted uppercase md:mb-1.5">
          {label}
        </p>
        <ul>
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 border-t border-ink py-2.5 md:gap-3 md:py-3"
            >
              <span
                aria-hidden="true"
                className="grid size-[22px] flex-none place-items-center rounded-md bg-pen text-white md:size-[26px] md:rounded-lg"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <span className="text-[15px] leading-snug font-semibold md:text-[17px]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
