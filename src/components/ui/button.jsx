import { isValidElement } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent text-[11px] font-bold tracking-[0.12em] uppercase whitespace-nowrap outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-sugo text-[#fdf8ec] hover:bg-[#8f1a17]",
        forno: "bg-forno text-[#7d1a0f] hover:bg-[#d7a117]",
        outline: "border-foreground text-foreground hover:bg-foreground hover:text-background",
        ghost: "text-muted-foreground hover:text-foreground",
        link: "text-sugo underline-offset-4 hover:underline",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        danger: "bg-destructive text-[#fdf8ec] hover:bg-[#8f1a17]",
      },
      size: {
        sm: "h-8 px-3",
        default: "h-10 px-5",
        lg: "h-12 px-6 text-[12px]",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

// Base UI assumes a real <button> unless told otherwise. We render plenty of
// buttons as links (tel:, next/link), so infer it from `render` instead of
// making every call site remember. Pass `nativeButton` explicitly to override.
function resolveNativeButton(render) {
  if (render === undefined) return true;
  if (isValidElement(render)) return render.type === "button";
  return false;
}

function Button({ className, variant, size, render, nativeButton, ...props }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      nativeButton={nativeButton ?? resolveNativeButton(render)}
      {...(render === undefined ? {} : { render })}
      {...props}
    />
  );
}

export { Button, buttonVariants };
