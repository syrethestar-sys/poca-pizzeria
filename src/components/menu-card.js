"use client";

import { Plus } from "lucide-react";

import { money, pick, tagSymbols } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";

// A square photo, the name in Sugo, the price, and two lines of ingredients.
// Items with no photo yet get the house lockup on its Forno ground rather than
// an empty grey box.
export function MenuCard({ item, onSelect, action }) {
  const { lang, t } = useLanguage();

  const symbols = tagSymbols(item.tags);
  const description = pick(item.description, lang);
  const variants = item.variants ?? [];
  const price = variants.length > 0 ? variants[0].price : item.price;

  return (
    <article
      onClick={() => onSelect(item)}
      className={`group flex cursor-pointer flex-col rounded-lg bg-card p-3 shadow-sm hover:shadow-md ${
        item.available ? "" : "opacity-60"
      }`}
    >
      <div className="relative overflow-hidden rounded-md">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            className="aspect-square w-full object-cover group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-muted">
            <img src="/poca-logo.png" alt="" className="w-[46%] opacity-25" />
            <span className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground/70">
              {t("menu.noPhoto")}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            (action?.onClick ?? onSelect)(item);
          }}
          aria-label={action?.label ?? t("action.add")}
          className="absolute right-2 bottom-2 flex size-9 items-center justify-center rounded-full bg-background shadow-md hover:bg-sugo hover:text-[#fdf8ec]"
        >
          <span className="spin-on-hover">{action?.icon ?? <Plus className="size-4" />}</span>
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-sugo">
          {pick(item.name, lang)}
          {symbols && <span className="ml-1.5 text-[11px] text-ember">{symbols}</span>}
        </h3>
        <span className="numeric shrink-0 text-sm font-semibold">
          {variants.length > 1 ? `${money(price)}+` : money(price)}
        </span>
      </div>

      {description && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {!item.available && (
        <p className="mt-1.5 text-[10px] font-medium tracking-[0.14em] uppercase text-ember">
          {t("menu.soldOut")}
        </p>
      )}
    </article>
  );
}
