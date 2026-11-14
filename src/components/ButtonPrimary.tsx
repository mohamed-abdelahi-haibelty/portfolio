import type { ReactNode } from "react";
import { buttonVariants } from "@/components/button-variants";
import { externalLinkProps } from "@/lib/links";

export type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/** Pen-blue call to action with the hard shadow. A link styled as the shadcn primary button. */
export function ButtonPrimary({ href, children, className }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={buttonVariants({ variant: "primary", className })}
      {...externalLinkProps(href)}
    >
      {children}
    </a>
  );
}
