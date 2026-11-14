import { buttonVariants } from "@/components/ui/button";
import { externalLinkProps } from "@/lib/links";
import type { ButtonLinkProps } from "./ButtonPrimary";

/** White outlined button without shadow. A link styled as the shadcn secondary button. */
export function ButtonSecondary({ href, children, className }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={buttonVariants({ variant: "secondary", className })}
      {...externalLinkProps(href)}
    >
      {children}
    </a>
  );
}
