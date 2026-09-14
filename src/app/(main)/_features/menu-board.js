"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MenuCard } from "@/components/menu-card";
import { ItemDialog } from "./item-dialog";
import { pick } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";
import { AllCategoriesIcon, categoryIcon } from "@/lib/category-icon";

const LEGEND = [
  { symbol: "🌶", key: "legend.spicy" },
  { symbol: "🌿", key: "legend.vegetarian" },
  { symbol: "⚪", key: "legend.white" },
];

export function MenuBoard({ categories = [], items = [] }) {
  const { lang, t } = useLanguage();
  const [kind, setKind] = useState("food");
  const [activeCategory, setActiveCategory] = useState(null);
  const pickedDefault = useRef(false);
  const [selected, setSelected] = useState(null);

  // Pizza is what people come for, so the menu opens on it rather than on the
  // whole list. Only once — after that the choice is the customer's.
  useEffect(() => {
    if (pickedDefault.current || categories.length === 0) return;
    const pizza = categories.find((category) => /pizza/i.test(category.name?.en ?? ""));
    if (pizza) setActiveCategory(pizza._id);
    pickedDefault.current = true;
  }, [categories]);

  const groups = useMemo(
    () =>
      categories
        .filter((category) => category.kind === kind)
        .filter((category) => !activeCategory || category._id === activeCategory)
        .map((category) => ({
          category,
          items: items.filter((item) => (item.category?._id ?? item.category) === category._id),
        }))
        .filter((group) => group.items.length > 0),
    [categories, items, kind, activeCategory],
  );

  const inKind = categories.filter((category) => category.kind === kind);

  if (categories.length === 0) {
    return (
      <p className="mt-10 rounded-lg border border-dashed border-border p-6 text-muted-foreground">
        {t("menu.empty")}
      </p>
    );
  }

  // A round photo — or an icon until one is uploaded — with the name beneath.
  const CategoryButton = ({ active, onClick, label, image, Icon }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="group flex w-[78px] shrink-0 flex-col items-center gap-2"
    >
      <span
        className={cn(
          "flex size-16 items-center justify-center overflow-hidden rounded-full border-2 group-hover:scale-105",
          active
            ? "border-sugo bg-forno text-[#7d1a0f]"
            : "border-border bg-card text-muted-foreground group-hover:border-foreground group-hover:text-foreground",
        )}
      >
        {image ? (
          <img src={image} alt="" className="size-full object-cover" />
        ) : (
          <Icon className="size-6" />
        )}
      </span>
      <span
        className={cn(
          "text-center text-[11px] leading-tight font-bold",
          active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {label}
      </span>
    </button>
  );

  return (
    <>
      {/* Food / Drinks on the left, legend hard right, one rule under both. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border py-3">
        <div className="flex gap-2">
          {["food", "drink"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setKind(value);
                setActiveCategory(null);
              }}
              aria-pressed={kind === value}
              className={cn(
                "rounded-full px-4 py-1.5 text-[12px] font-bold",
                kind === value
                  ? "bg-forno text-[#7d1a0f]"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {t(value === "food" ? "menu.food" : "menu.drinks")}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap gap-4">
          {LEGEND.map((entry) => (
            <span key={entry.key} className="text-[11px] tracking-[0.06em] text-muted-foreground">
              {entry.symbol} {t(entry.key)}
            </span>
          ))}
        </div>
      </div>

      <div className="-mx-1 mt-5 flex gap-4 overflow-x-auto px-1 py-2">
        <CategoryButton
          active={!activeCategory}
          onClick={() => setActiveCategory(null)}
          label={t("menu.all")}
          Icon={AllCategoriesIcon}
        />
        {inKind.map((category) => (
          <CategoryButton
            key={category._id}
            active={activeCategory === category._id}
            onClick={() => setActiveCategory(category._id)}
            label={pick(category.name, lang)}
            image={category.image}
            Icon={categoryIcon(category.name?.en)}
          />
        ))}
      </div>

      <div className="mt-2">
        {groups.map(({ category, items: cards }) => (
          <section key={category._id} className="mt-10">
            <h2 className="text-[26px] leading-tight">{pick(category.name, lang)}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((item) => (
                <MenuCard key={item._id} item={item} onSelect={setSelected} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <ItemDialog item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
