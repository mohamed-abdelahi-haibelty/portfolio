import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Restyled to the "Cahier quadrillé" design (Task 002): primary and secondary only.
const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-button border-3 border-ink px-6 py-4 text-center font-sans text-[17px] leading-tight font-bold select-none motion-safe:transition-[translate,box-shadow] motion-safe:duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-pen px-[26px] text-white shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-hard-sm active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
        secondary: "bg-white text-ink hover:-translate-y-0.5",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

function Button({
  className,
  variant = "primary",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
