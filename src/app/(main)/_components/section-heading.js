export function SectionHeading({ eyebrow, title, lede }) {
  return (
    <div className="pt-12 pb-2">
      {eyebrow && (
        <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-sugo">{eyebrow}</p>
      )}
      <h1 className="mt-3 text-[clamp(30px,4.6vw,46px)] leading-[1.08]">{title}</h1>
      {lede && <p className="mt-4 max-w-[58ch] text-muted-foreground">{lede}</p>}
    </div>
  );
}
