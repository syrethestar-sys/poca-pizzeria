"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { server } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

const STATUS_TONE = {
  pending: "bg-muted text-muted-foreground",
  preparing: "bg-forno text-[#7d1a0f]",
  ready: "bg-forno text-[#7d1a0f]",
  "on-the-way": "bg-ember text-[#fdf3e8]",
  delivered: "bg-sugo text-[#fdf8ec]",
  cancelled: "bg-muted text-muted-foreground line-through",
};

export function OrderList() {
  const { user, ready } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      setLoading(false);
      return;
    }
    server
      .get("/order/get", { params: { user: user.id } })
      .then(({ data }) => setOrders(data.orders ?? []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [ready, user]);

  if (!ready || loading) return null;

  if (!user) {
    return (
      <>
        <h1 className="text-[clamp(28px,4vw,40px)]">{t("orders.title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("auth.noAccount")}</p>
        <Button className="mt-5" render={<Link href="/login" />}>
          {t("action.login")}
        </Button>
      </>
    );
  }

  return (
    <>
      <h1 className="text-[clamp(28px,4vw,40px)]">{t("orders.title")}</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-muted-foreground">{t("orders.empty")}</p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {orders.map((order) => (
            <article key={order._id} className="border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="numeric text-[11px] text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("en-GB")}
                </span>
                <span
                  className={`rounded-md px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase ${
                    STATUS_TONE[order.status] ?? STATUS_TONE.pending
                  }`}
                >
                  {t(`status.${order.status}`)}
                </span>
              </div>
              <ul className="mt-3">
                {order.lines.map((line, index) => (
                  <li key={index} className="flex justify-between gap-4 py-1 text-sm">
                    <span>
                      {line.name}
                      {line.variantLabel ? ` · ${line.variantLabel}` : ""}
                      <span className="numeric text-muted-foreground"> × {line.quantity}</span>
                    </span>
                    <span className="numeric">{money(line.price * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-border pt-3">
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                  {t("cart.total")}
                </span>
                <span className="numeric font-medium">{money(order.total)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
