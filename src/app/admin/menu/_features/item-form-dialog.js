"use client";

import { useState } from "react";
import { ImageOff, X } from "lucide-react";

import { server } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";

const TAGS = ["spicy", "extra-spicy", "vegetarian", "white"];

// Both languages sit side by side in the form so nothing ships half-translated
// without the person entering it noticing.
export function ItemFormDialog({ item, categories, onClose, onSaved }) {
  const editing = Boolean(item?._id);

  const [form, setForm] = useState({
    nameEn: item?.name?.en ?? "",
    nameMn: item?.name?.mn ?? "",
    descriptionEn: item?.description?.en ?? "",
    descriptionMn: item?.description?.mn ?? "",
    price: item?.price ?? "",
    category: item?.category?._id ?? item?.category ?? categories[0]?._id ?? "",
    tags: item?.tags ?? [],
    image: item?.image ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const toggleTag = (tag) =>
    set("tags", form.tags.includes(tag) ? form.tags.filter((x) => x !== tag) : [...form.tags, tag]);

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      set("image", await uploadImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.nameEn.trim()) return setError("An English name is required.");
    if (!form.category) return setError("Pick a category.");
    if (form.price === "" || Number.isNaN(Number(form.price))) return setError("Enter a price.");

    const payload = {
      name: { en: form.nameEn.trim(), mn: form.nameMn.trim() },
      description: { en: form.descriptionEn.trim(), mn: form.descriptionMn.trim() },
      price: Number(form.price),
      category: form.category,
      tags: form.tags,
      image: form.image,
    };

    setBusy(true);
    try {
      if (editing) {
        await server.put("/menu-item/update", { id: item._id, ...payload });
      } else {
        await server.post("/menu-item/create", payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not save the item.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-carbone/55 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form
        onSubmit={save}
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[24px]">
            {editing ? "Edit item" : "Add an item"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-5 spin-on-hover" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="item-name-en">Name · EN</Label>
            <Input
              id="item-name-en"
              className="mt-1.5"
              value={form.nameEn}
              onChange={(event) => set("nameEn", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="item-name-mn">Нэр · МН</Label>
            <Input
              id="item-name-mn"
              className="mt-1.5"
              value={form.nameMn}
              onChange={(event) => set("nameMn", event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="item-desc-en">Description · EN</Label>
            <Textarea
              id="item-desc-en"
              className="mt-1.5"
              value={form.descriptionEn}
              onChange={(event) => set("descriptionEn", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="item-desc-mn">Тайлбар · МН</Label>
            <Textarea
              id="item-desc-mn"
              className="mt-1.5"
              value={form.descriptionMn}
              onChange={(event) => set("descriptionMn", event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="item-price">Price (₮)</Label>
            <Input
              id="item-price"
              inputMode="numeric"
              className="mt-1.5"
              value={form.price}
              onChange={(event) => set("price", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="item-category">Category</Label>
            <select
              id="item-category"
              className="mt-1.5 h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              value={form.category}
              onChange={(event) => set("category", event.target.value)}
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <Label>Tags</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={form.tags.includes(tag)}
                className={cn(
                  "rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase",
                  form.tags.includes(tag)
                    ? "border-forno bg-forno text-[#7d1a0f]"
                    : "border-border text-muted-foreground",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <Label htmlFor="item-image">Photo</Label>

          {/* Shown at the size it appears on the menu card, so what you upload
              is what you are judging. */}
          <div className="mt-2 grid gap-4 sm:grid-cols-[240px_1fr] sm:items-start">
            <div className="relative overflow-hidden rounded-md border border-border bg-muted">
              {form.image ? (
                <>
                  <img src={form.image} alt="" className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => set("image", "")}
                    aria-label="Remove photo"
                    className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-background/90 text-destructive shadow-md hover:bg-destructive hover:text-[#fdf8ec]"
                  >
                    <X className="size-4 spin-on-hover" />
                  </button>
                </>
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageOff className="size-7" />
                  <span className="text-[11px]">No photo</span>
                </div>
              )}
            </div>

            <div>
              <input
                id="item-image"
                type="file"
                accept="image/*"
                onChange={onFile}
                className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-muted file:px-3 file:py-1.5 file:text-[10px] file:font-bold file:uppercase hover:file:bg-foreground hover:file:text-background"
              />
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Square crops look best — the menu card and the dialog both show
                the photo at 1:1.
              </p>
              {form.image && (
                <button
                  type="button"
                  onClick={() => set("image", "")}
                  className="mt-3 rounded-md border border-border px-3 py-1.5 text-[11px] font-bold uppercase text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
