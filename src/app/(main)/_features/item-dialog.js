"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { money, pick, tagSymbols } from "@/lib/format";
import { useCart } from "@/providers/cart-provider";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

export function ItemDialog({ item, onClose }) {
  const { lang, t } = useLanguage();
  const { addItem } = useCart();
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setVariantIndex(0);
    setQuantity(1);
  }, [item]);

  useEffect(() => {
    if (!item) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  const variants = item.variants ?? [];
  const variant = variants[variantIndex];
  const price = variant ? variant.price : item.price;

  const add = () => {
    addItem(
      {
        id: item._id,
        name: pick(item.name, "en"),
        nameMn: item.name?.mn ?? "",
        image: item.image ?? "",
        description: item.description?.en ?? "",
        descriptionMn: item.description?.mn ?? "",
        variantLabel: variant ? variant.label.en : "",
        variantLabelMn: variant ? variant.label.mn : "",
        price,
      },
      quantity,
    );
    // Stay on the menu — the header count is enough feedback that it landed.
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-carbone/55 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-card shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {item.image && (
          <img src={item.image} alt="" className="aspect-[16/10] w-full object-cover" />
        )}

        <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[24px] leading-tight">
            {pick(item.name, lang)}
            {tagSymbols(item.tags) && (
              <span className="ml-2 font-mono text-[13px] text-ember">{tagSymbols(item.tags)}</span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("action.close")}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5 spin-on-hover" />
          </button>
        </div>

        {pick(item.description, lang) && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {pick(item.description, lang)}
          </p>
        )}

        {variants.length > 1 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {variants.map((option, index) => (
              <button
                key={option.label.en}
                type="button"
                onClick={() => setVariantIndex(index)}
                aria-pressed={index === variantIndex}
                className={cn(
                  "rounded-md border px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase",
                  index === variantIndex
                    ? "border-forno bg-forno text-[#7d1a0f]"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {pick(option.label, lang)} · {money(option.price)}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="size-8 rounded-md border border-border font-mono"
              aria-label="Fewer"
            >
              −
            </button>
            <span className="numeric w-6 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="size-8 rounded-md border border-border font-mono"
              aria-label="More"
            >
              +
            </button>
          </div>
          <Button onClick={add}>
            {t("action.add")} · {money(price * quantity)}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
