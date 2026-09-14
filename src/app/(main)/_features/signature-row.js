"use client";

import { money, pick } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";

export function SignatureRow({ items = [] }) {
  const { lang } = useLanguage();

  if (items.length === 0) return null;

  return (
    <section className="py-13">
      <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-sugo">
        {lang === "mn" ? "Эхлэхэд гурав" : "Three to start with"}
      </p>
      <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="flex flex-col gap-2 bg-card px-5 py-6">
            <h3 className="font-display text-[24px] leading-tight">{pick(item.name, lang)}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {pick(item.description, lang)}
            </p>
            <span className="numeric mt-auto pt-2 text-[13px] font-medium text-sugo">
              {money(item.price)}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
