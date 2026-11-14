import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { externalLinkProps } from "@/lib/links";
import { ArrowUpRightIcon } from "./icons/ArrowUpRightIcon";

type ContactRowProps = {
  href: string;
  label: string;
  value: string;
  /** A decorative icon from `components/icons`. */
  icon: ReactNode;
  className?: string;
};

/** Allow a line break before "@" so an email address never overflows its row. */
function breakableValue(value: string): ReactNode {
  const at = value.indexOf("@");
  if (at <= 0) return value;
  return (
    <>
      {value.slice(0, at)}
      <wbr />
      {value.slice(at)}
    </>
  );
}

/** A whole-row contact link: icon tile, uppercase label, bold value, arrow (from 400px). */
export function ContactRow({ href, label, value, icon, className }: ContactRowProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex min-w-0 items-center gap-4 rounded-button border-2 border-ink bg-white px-3.5 py-3 text-ink hover:-translate-y-0.5 motion-safe:transition-transform motion-safe:duration-150 md:px-[18px] md:py-4",
        className,
      )}
      {...externalLinkProps(href)}
    >
      <span className="grid size-10 flex-none place-items-center rounded-tile bg-highlight md:size-[46px]">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-label font-medium text-muted uppercase">{label}</span>{" "}
        <span data-value className="text-value font-bold wrap-break-word">
          {breakableValue(value)}
        </span>
      </span>
      <ArrowUpRightIcon size={20} className="ms-auto hidden flex-none min-[400px]:block" />
    </a>
  );
}
