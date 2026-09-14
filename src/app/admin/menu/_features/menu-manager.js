"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { server } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import { MenuCard } from "@/components/menu-card";
import { pick } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ItemFormDialog } from "./item-form-dialog";
import { CategoryFormDialog } from "./category-form-dialog";

export function MenuManager() {
  const { lang, t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [categoryResponse, itemResponse] = await Promise.all([
        server.get("/menu-category/get"),
        server.get("/menu-item/get"),
      ]);
      setCategories(categoryResponse.data.menuCategories ?? []);
      setItems(itemResponse.data.menuItems ?? []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not reach the server.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleAvailable = async (item) => {
    try {
      await server.put("/menu-item/update", { id: item._id, available: !item.available });
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not update the item.");
    }
  };

  // Deleting is not undoable, so it always goes through a confirmation that
  // names the item being removed.
  const remove = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await server.delete("/menu-item/delete", { data: { id: pendingDelete._id } });
      setPendingDelete(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not delete the item.");
    } finally {
      setDeleting(false);
    }
  };

  const shown = activeCategory
    ? items.filter((item) => (item.category?._id ?? item.category) === activeCategory)
    : items;

  const chip = (active) =>
    cn(
      "rounded-full border px-3.5 py-2 text-[12px] font-medium whitespace-nowrap",
      active
        ? "border-carbone bg-carbone text-[#f7f1e3]"
        : "border-border bg-card text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="py-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-sugo">
            {t("admin.menu")}
          </p>
          <h1 className="mt-2 text-[32px]">
            {items.length} {lang === "mn" ? "хоол, ундаа" : "items"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCategoryForm(true)}>
            {t("admin.addCategory")}
          </Button>
          <Button onClick={() => setEditing({})}>
            <Plus className="size-4" />
            {t("admin.addItem")}
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveCategory(null)} className={chip(!activeCategory)}>
          {t("menu.all")}
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            onClick={() => setActiveCategory(category._id)}
            className={chip(activeCategory === category._id)}
          >
            {pick(category.name, lang)}
          </button>
        ))}
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((item) => (
          <div key={item._id} className="flex flex-col">
            <MenuCard
              item={item}
              onSelect={setEditing}
              action={{
                icon: <Pencil className="size-4" />,
                label: t("admin.edit"),
                onClick: setEditing,
              }}
            />

            <div className="mt-2 flex items-center justify-between gap-2 px-1">
              <button
                type="button"
                onClick={() => toggleAvailable(item)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] uppercase",
                  item.available
                    ? "bg-forno text-[#7d1a0f]"
                    : "bg-muted text-muted-foreground line-through",
                )}
              >
                {item.available ? "On the menu" : "Off the menu"}
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(item)}
                aria-label="Delete"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ItemFormDialog
          item={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete ${pick(pendingDelete.name, lang)}?`}
          body="It comes off the menu straight away and cannot be restored. To hide it temporarily, use the on/off toggle instead."
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {showCategoryForm && (
        <CategoryFormDialog
          onClose={() => setShowCategoryForm(false)}
          onSaved={() => {
            setShowCategoryForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}
