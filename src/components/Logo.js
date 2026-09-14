// The real wordmark. `square` gives the house lockup — the mark on its Forno
// ground — which is what to use on dark surfaces; plain gives the wordmark
// alone for light ones. The mark carries the name, so never set "Poca
// Pizzeria" as text beside it.
export function Logo({ square = false, height = 40, className = "" }) {
  const src = square ? "/poca-logo-square.png" : "/poca-logo.png";

  return (
    <img
      src={src}
      alt="Poca Pizzeria"
      style={{ height }}
      // w-fit keeps a flex parent from stretching the mark to the column width.
      className={`w-fit max-w-full self-start object-contain ${square ? "rounded-md" : ""} ${className}`}
    />
  );
}
