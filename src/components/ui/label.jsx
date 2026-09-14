import { cn } from "@/lib/utils";

function Label({ className, ...props }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
