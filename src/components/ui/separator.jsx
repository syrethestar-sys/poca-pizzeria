import { cn } from "@/lib/utils";

function Separator({ className, orientation = "horizontal", ...props }) {
  return (
    <div
      role="separator"
      data-slot="separator"
      className={cn(
        "bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
