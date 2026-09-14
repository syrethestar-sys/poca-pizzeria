"use client";

import { money, pick, tagSymbols } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";

// One line of the printed menu: name and description on the left, price
// right, hairline rule underneath. Clicking opens the item dialog.
export function MenuRow({ item, onSelect }) {
  const { lang, t } = useLanguage();

  const symbols = tagSymbols(item.tags);
  const description = pick(item.description, lang);
  const hasVariants = item.variants?.length > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      disabled={!item.available}
      className="flex w-full items-baseline gap-4 border-b border-border py-4 text-left transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-55"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[19px] leading-tight">
          {pick(item.name, lang)}
          {symbols && <span className="ml-2 font-mono text-[11px] text-ember">{symbols}</span>}
        </span>
        {description && (
          <span className="mt-1 block max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
            {description}
          </span>
        )}
        {!item.available && (
          <span className="mt-1.5 block font-mono text-[10px] tracking-[0.14em] uppercase text-ember">
            {t("menu.soldOut")}
          </span>
        )}
      </span>

      {hasVariants ? (
        <span className="flex gap-6">
          {item.variants.map((variant) => (
            <span key={variant.label.en} className="text-right">
              <span className="block font-mono text-[9.5px] tracking-[0.14em] uppercase text-muted-foreground">
                {pick(variant.label, lang)}
              </span>
              <span className="numeric text-sm font-medium">{money(variant.price)}</span>
            </span>
          ))}
        </span>
      ) : (
        <span className="numeric shrink-0 text-sm font-medium">{money(item.price)}</span>
      )}
    </button>
  );
}
