"use client";

import { useCallback, useEffect, useState } from "react";

import { server } from "@/app/api/api";
import { money } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

const STATUSES = ["pending", "preparing", "ready", "on-the-way", "delivered", "cancelled"];

export function OrderQueue() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState(null);
  const [error, setError] = useState("");

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
    // The kitchen leaves this open on a screen, so keep it current.
    const timer = setInterval(load, 30000);
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
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.type === "delivery" ? order.customer.address : "Pickup"}
                </p>
                {order.customer.note && (
                  <p className="mt-1 text-sm text-ember">“{order.customer.note}”</p>
                )}
              </div>
              <span className="numeric text-[11px] text-muted-foreground">
                {new Date(order.createdAt).toLocaleString("en-GB")}
              </span>
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
    </div>
  );
}
