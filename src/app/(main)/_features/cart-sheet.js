"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";

import { server } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { money } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

const STATUS_TONE = {
  pending: "bg-muted text-muted-foreground",
  preparing: "bg-forno text-[#7d1a0f]",
  ready: "bg-forno text-[#7d1a0f]",
  "on-the-way": "bg-ember text-[#fdf3e8]",
  delivered: "bg-sugo text-[#fdf8ec]",
  cancelled: "bg-muted text-muted-foreground line-through",
};

// A small square of the dish, or the house mark while the photo is missing.
function Thumb({ src, size = "size-16" }) {
  return (
    <div className={cn("shrink-0 overflow-hidden rounded-md bg-muted", size)}>
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <img src="/poca-logo.png" alt="" className="size-full object-contain p-2 opacity-25" />
      )}
    </div>
  );
}

export function CartSheet() {
  const { items, changeQuantity, removeItem, clear, total, open, setOpen } = useCart();
  const { user, ready } = useAuth();
  const { lang, t } = useLanguage();

  const [tab, setTab] = useState("cart");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const { data } = await server.get("/order/get", { params: { user: user.id } });
      setOrders(data.orders ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  // Only fetch when the Order tab is actually looked at.
  useEffect(() => {
    if (open && tab === "order" && ready) loadOrders();
  }, [open, tab, ready, loadOrders]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-carbone/55"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-border bg-background"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <h2 className="flex items-center gap-2 text-[17px]">
            <ShoppingCart className="size-5" />
            {t("cart.orderDetail")}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("action.close")}
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          >
            <X className="size-4 spin-on-hover" />
          </button>
        </div>

        {/* One pill, two halves — the active half slides the colour. */}
        <div className="mx-6 mb-4 flex rounded-full border border-border bg-card p-1">
          {[
            ["cart", "cart.tabCart"],
            ["order", "cart.tabOrder"],
          ].map(([value, key]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-pressed={tab === value}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-[13px] font-bold",
                tab === value
                  ? "bg-sugo text-[#fdf8ec]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(key)}
            </button>
          ))}
        </div>

        {tab === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <p className="py-10 text-sm text-muted-foreground">{t("cart.empty")}</p>
              ) : (
                items.map((line) => (
                  <div
                    key={line.key}
                    className="flex items-start gap-3 border-b border-border py-4 last:border-b-0"
                  >
                    <Thumb src={line.image} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-sugo">
                          {lang === "mn" && line.nameMn ? line.nameMn : line.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(line.key)}
                          aria-label={t("cart.remove")}
                          className="flex size-6 shrink-0 items-center justify-center rounded-full border border-destructive/40 text-destructive hover:bg-destructive hover:text-[#fdf8ec]"
                        >
                          <X className="size-3.5 spin-on-hover" />
                        </button>
                      </div>

                      {line.variantLabel && (
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {lang === "mn" && line.variantLabelMn
                            ? line.variantLabelMn
                            : line.variantLabel}
                        </p>
                      )}

                      {/* Carts saved before this existed have no description. */}
                      {(lang === "mn" ? line.descriptionMn : line.description) && (
                        <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-muted-foreground">
                          {(lang === "mn" && line.descriptionMn
                            ? line.descriptionMn
                            : line.description) || line.description}
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => changeQuantity(line.key, line.quantity - 1)}
                            className="flex size-7 items-center justify-center rounded-full border border-border text-sm hover:border-foreground"
                            aria-label="Fewer"
                          >
                            −
                          </button>
                          <span className="numeric w-5 text-center text-sm">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(line.key, line.quantity + 1)}
                            className="flex size-7 items-center justify-center rounded-full border border-border text-sm hover:border-foreground"
                            aria-label="More"
                          >
                            +
                          </button>
                        </div>
                        <span className="numeric text-sm font-bold">
                          {money(line.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                  {t("cart.total")}
                </span>
                <span className="numeric text-lg font-bold">{money(total)}</span>
              </div>

              <Button
                className="mt-4 w-full"
                size="lg"
                disabled={items.length === 0}
                render={<Link href="/checkout" onClick={() => setOpen(false)} />}
              >
                {t("action.checkout")}
              </Button>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmEmpty(true)}
                  className="mt-3 w-full rounded-md border border-border py-2 text-[11px] font-bold uppercase text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  {t("cart.clear")}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {!user ? (
              <div className="py-10">
                <p className="text-sm text-muted-foreground">{t("orders.signIn")}</p>
                <Button className="mt-4" render={<Link href="/login" onClick={() => setOpen(false)} />}>
                  {t("action.login")}
                </Button>
              </div>
            ) : loadingOrders ? (
              <p className="py-10 text-sm text-muted-foreground">{t("orders.loading")}</p>
            ) : orders.length === 0 ? (
              <p className="py-10 text-sm text-muted-foreground">{t("orders.empty")}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((order) => (
                  <article key={order._id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="numeric text-[11px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString("en-GB")}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] uppercase",
                          STATUS_TONE[order.status] ?? STATUS_TONE.pending,
                        )}
                      >
                        {t(`status.${order.status}`)}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-2.5">
                      {order.lines.map((line, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Thumb src={line.image} size="size-11" />
                          <span className="min-w-0 flex-1 text-[13px]">
                            {line.name}
                            {line.variantLabel ? ` · ${line.variantLabel}` : ""}
                            <span className="numeric text-muted-foreground"> × {line.quantity}</span>
                          </span>
                          <span className="numeric shrink-0 text-[13px]">
                            {money(line.price * line.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex justify-between border-t border-border pt-3">
                      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                        {t("cart.total")}
                      </span>
                      <span className="numeric font-bold">{money(order.total)}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </aside>

      {confirmEmpty && (
        <ConfirmDialog
          title={t("cart.clearTitle")}
          body={t("cart.clearBody")}
          confirmLabel={t("cart.clear")}
          cancelLabel={t("location.back")}
          onConfirm={() => {
            clear();
            setConfirmEmpty(false);
          }}
          onCancel={() => setConfirmEmpty(false)}
        />
      )}
    </div>
  );
}
