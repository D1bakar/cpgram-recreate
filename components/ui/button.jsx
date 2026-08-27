import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-[19px] font-bold whitespace-nowrap transition-colors duration-100 outline-none select-none focus-visible:ring-[3px] focus-visible:ring-[#ffdd00] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#00703c] text-white hover:bg-[#005a30]",
        outline:
          "border-[3px] border-[#0b0c0c] bg-transparent text-[#0b0c0c] hover:bg-[#f3f2f1] dark:border-white dark:text-white dark:hover:bg-white/10",
        secondary:
          "bg-[#f3f2f1] text-[#0b0c0c] hover:bg-[#e5e4e3] dark:bg-secondary dark:text-secondary-foreground",
        ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
        destructive: "bg-[#d4351c] text-white hover:bg-[#aa2a16]",
        link: "text-[#1d70b8] underline-offset-4 hover:text-[#003078] hover:underline",
      },
      size: {
        default:
          "h-11 gap-1.5 px-4 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-12 gap-1.5 px-5 text-lg has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
