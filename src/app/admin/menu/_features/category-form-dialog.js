"use client";

import { useState } from "react";
import { ImageOff, X } from "lucide-react";

import { server } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";

export function CategoryFormDialog({ onClose, onSaved }) {
  const [nameEn, setNameEn] = useState("");
  const [nameMn, setNameMn] = useState("");
  const [kind, setKind] = useState("food");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();
    setError("");
    if (!nameEn.trim()) return setError("An English name is required.");

    setBusy(true);
    try {
      await server.post("/menu-category/create", {
        name: { en: nameEn.trim(), mn: nameMn.trim() },
        kind,
        image,
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not save the category.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-carbone/55 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form
        onSubmit={save}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[24px]">Add a category</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-5 spin-on-hover" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <Label htmlFor="category-en">Name · EN</Label>
            <Input
              id="category-en"
              className="mt-1.5"
              value={nameEn}
              onChange={(event) => setNameEn(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category-mn">Нэр · МН</Label>
            <Input
              id="category-mn"
              className="mt-1.5"
              value={nameMn}
              onChange={(event) => setNameMn(event.target.value)}
            />
          </div>
          <div>
            <Label>Photo</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted text-muted-foreground">
                {image ? (
                  <img src={image} alt="" className="size-full object-cover" />
                ) : (
                  <ImageOff className="size-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setBusy(true);
                    try {
                      setImage(await uploadImage(file));
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-muted file:px-3 file:py-1.5 file:text-[10px] file:font-bold file:uppercase hover:file:bg-foreground hover:file:text-background"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Optional. Without one the menu shows an icon matched to the name.
                </p>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="mt-2 text-[11px] font-bold uppercase text-muted-foreground hover:text-destructive"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label>Section</Label>
            <div className="mt-2 flex gap-2">
              {["food", "drink"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKind(value)}
                  aria-pressed={kind === value}
                  className={cn(
                    "rounded-md border px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase",
                    kind === value
                      ? "border-forno bg-forno text-[#7d1a0f]"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {value}
                </button>
              ))}
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
