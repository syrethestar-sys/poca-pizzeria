"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// Used before anything destructive. Deliberately not window.confirm — that
// blocks the page and cannot carry the item's name.
export function ConfirmDialog({
  title,
  body,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-carbone/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-4.5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[19px] leading-tight">{title}</h2>
            {body && <p className="mt-2 text-sm text-muted-foreground">{body}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? "…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
