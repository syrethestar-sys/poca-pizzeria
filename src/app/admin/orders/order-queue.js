"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, MapPin, X } from "lucide-react";

import { server } from "@/app/api/api";
import { PinMap } from "@/components/pin-map";
import { money } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

const STATUSES = ["pending", "preparing", "ready", "on-the-way", "delivered", "cancelled"];

const PAYMENT_TONE = {
  paid: "bg-sugo text-[#fdf8ec]",
  pending: "bg-muted text-muted-foreground",
  failed: "bg-destructive text-white",
};

const hasPin = (customer) =>
  Number.isFinite(customer?.lat) && Number.isFinite(customer?.lon);

// Ulaanbaatar street addresses are rarely precise enough to deliver on their
// own, so the pin the customer dropped is the real instruction. Shown big,
// with a hand-off link for whoever is actually driving.
function OrderMapDialog({ order, onClose }) {
  const { customer } = order;
  const detail = [
    customer.entrance && `Entrance ${customer.entrance}`,
    customer.floor && `Floor ${customer.floor}`,
    customer.apartment && `Apt ${customer.apartment}`,
  ].filter(Boolean);

  return createPortal(
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-carbone/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-[min(94vw,820px)] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-display text-[18px]">{customer.name}</p>
            <p className="numeric text-[12px] text-muted-foreground">{customer.phone}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="h-[52vh] min-h-[280px] w-full bg-muted">
          <PinMap lat={customer.lat} lon={customer.lon} zoom={17} />
        </div>

        <div className="flex flex-col gap-2 p-4">
          <p className="text-sm">{customer.address}</p>
          {detail.length > 0 && (
            <p className="numeric text-sm text-muted-foreground">{detail.join(" · ")}</p>
          )}
          {customer.addressNote && (
            <p className="text-sm text-muted-foreground">{customer.addressNote}</p>
          )}
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="numeric text-[11px] text-muted-foreground">
              {customer.lat.toFixed(5)}, {customer.lon.toFixed(5)}
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${customer.lat},${customer.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-sugo underline-offset-4 hover:underline"
            >
              Open in Google Maps
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function OrderQueue() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState(null);
  const [error, setError] = useState("");
  const [mapOrder, setMapOrder] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await server.get("/order/get", {
        params: filter ? { status: filter } : {},
      });
      setOrders(data.orders ?? []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not reach the server.");
    }
  }, [filter]);

  useEffect(() => {
    load();
    // The kitchen leaves this open on a screen, so keep it current. Polling
    // (not SSE/websockets) because the API runs as Vercel serverless
    // functions, which don't hold a persistent connection open.
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [load]);

  const setStatus = async (order, status) => {
    try {
      await server.put("/order/status", { id: order._id, status });
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not update the order.");
    }
  };

  return (
    <div className="py-7">
      <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-sugo">
        {t("admin.orders")}
      </p>
      <h1 className="mt-2 text-[32px]">{orders.length} orders</h1>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          aria-pressed={filter === null}
          className={cn(
            "rounded-md border px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase",
            filter === null
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground",
          )}
        >
          {t("menu.all")}
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            aria-pressed={filter === status}
            className={cn(
              "rounded-md border px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase",
              filter === status
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground",
            )}
          >
            {t(`status.${status}`)}
          </button>
        ))}
      </div>

      <div className="mt-7 flex flex-col gap-3">
        {orders.map((order) => (
          <article key={order._id} className="border border-border bg-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="font-display text-[20px]">
                  {order.customer.name}
                  <span className="numeric ml-3 text-[13px] text-muted-foreground">
                    {order.customer.phone}
                    {order.customer.phone2 ? ` / ${order.customer.phone2}` : ""}
                  </span>
                </p>

                {order.type === "delivery" ? (
                  <div className="mt-1 text-sm text-muted-foreground">
                    <p>
                      {order.customer.address}
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                        {order.customer.addressType}
                      </span>
                    </p>
                    {(order.customer.entrance ||
                      order.customer.floor ||
                      order.customer.apartment) && (
                      <p className="numeric">
                        {[
                          order.customer.entrance && `Entrance ${order.customer.entrance}`,
                          order.customer.floor && `Floor ${order.customer.floor}`,
                          order.customer.apartment && `Apt ${order.customer.apartment}`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                    {order.customer.addressNote && <p>{order.customer.addressNote}</p>}
                    {hasPin(order.customer) && (
                      <button
                        type="button"
                        onClick={() => setMapOrder(order)}
                        className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-sugo underline-offset-4 hover:underline"
                      >
                        <MapPin className="size-3.5" />
                        See exact location
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">Pickup</p>
                )}

                {order.customer.note && (
                  <p className="mt-1 text-sm text-ember">“{order.customer.note}”</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="numeric text-[11px] text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("en-GB")}
                </span>
                {order.payment && (
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 font-mono text-[9.5px] tracking-[0.1em] uppercase",
                      PAYMENT_TONE[order.payment.status] ?? PAYMENT_TONE.pending,
                    )}
                  >
                    {order.payment.provider} · {order.payment.status}
                  </span>
                )}
              </div>
            </div>

            <ul className="mt-3 border-y border-border py-2">
              {order.lines.map((line, index) => (
                <li key={index} className="flex justify-between gap-4 py-1 text-sm">
                  <span>
                    <span className="numeric">{line.quantity}×</span> {line.name}
                    {line.variantLabel ? ` · ${line.variantLabel}` : ""}
                  </span>
                  <span className="numeric">{money(line.price * line.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatus(order, status)}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 font-mono text-[9.5px] tracking-[0.1em] uppercase",
                      order.status === status
                        ? "bg-sugo text-[#fdf8ec]"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t(`status.${status}`)}
                  </button>
                ))}
              </div>
              <span className="numeric text-lg font-medium">{money(order.total)}</span>
            </div>
          </article>
        ))}
      </div>

      {mapOrder && <OrderMapDialog order={mapOrder} onClose={() => setMapOrder(null)} />}
    </div>
  );
}
