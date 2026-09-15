"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone } from "lucide-react";

import { server } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/field-error";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkoutSchema } from "@/lib/validation/checkout";
import { money } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { useLanguage } from "@/providers/language-provider";
import { useLocation } from "@/providers/location-provider";
import { cn } from "@/lib/utils";

// Labels carry both languages at once here — the customer is filling this in
// once, under time pressure, and should not have to switch to understand a
// field. EN leads, MN sits under it, as on the printed menu.
function BiLabel({ htmlFor, en, mn }) {
  return (
    <Label htmlFor={htmlFor} className="normal-case tracking-normal">
      <span className="block text-[11px] font-bold tracking-[0.14em] uppercase text-foreground">
        {en}
      </span>
      <span className="block text-[11px] text-muted-foreground">{mn}</span>
    </Label>
  );
}

export function CheckoutForm() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { location } = useLocation();
  const [serverError, setServerError] = useState("");
  const [placed, setPlaced] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      type: "delivery",
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      phone2: "",
      addressType: "home",
      // Whatever was picked in the header's address bar starts the form off.
      address: location?.full ?? "",
    },
  });

  const type = watch("type");
  const addressType = watch("addressType");

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const { data } = await server.post("/order/create", {
        user: user?.id,
        type: values.type,
        customer: {
          name: values.name,
          phone: values.phone,
          phone2: values.phone2 ?? "",
          address: values.type === "delivery" ? values.address : "",
          addressType: values.addressType,
          entrance: values.entrance ?? "",
          floor: values.floor ?? "",
          apartment: values.apartment ?? "",
          addressNote: values.addressNote ?? "",
          note: values.note ?? "",
          lat: location?.lat,
          lon: location?.lon,
        },
        lines: items.map((line) => ({
          item: line.id,
          variantLabel: line.variantLabel,
          quantity: line.quantity,
        })),
      });
      clear();
      if (data.order?.payment?.checkoutUrl) {
        window.location.href = data.order.payment.checkoutUrl;
        return;
      }
      setPlaced(data.order);
    } catch (err) {
      setServerError(err.response?.data?.message ?? "Could not place the order. Try again.");
    }
  };

  if (placed) {
    return (
      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-sugo">
          {t("checkout.placed")}
        </p>
        <h1 className="mt-3 text-[32px]">{money(placed.total)}</h1>
        <p className="mt-3 max-w-[46ch] text-muted-foreground">{t("checkout.placedBody")}</p>
        <Button className="mt-6" variant="outline" render={<Link href="/" />}>
          {t("action.back")}
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8">
        <p className="text-muted-foreground">{t("cart.empty")}</p>
        <Button className="mt-5" variant="outline" render={<Link href="/" />}>
          {t("action.back")}
        </Button>
      </div>
    );
  }

  const pill = (active) =>
    cn(
      "flex flex-1 items-center justify-between gap-2 rounded-md border px-4 py-3 text-left text-[13px] font-bold",
      active
        ? "border-sugo bg-sugo/5 text-foreground"
        : "border-border bg-card text-muted-foreground hover:text-foreground",
    );

  return (
    <>
      <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-sugo">
        {t("checkout.title")}
      </p>
      <h1 className="mt-3 text-[clamp(28px,4vw,40px)]">{t("checkout.addressTitle")}</h1>

      <div className="mt-9 grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          <div className="flex gap-2">
            {["delivery", "pickup"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setValue("type", option, { shouldValidate: true })}
                aria-pressed={type === option}
                className={cn(
                  "rounded-full px-5 py-2.5 text-[12px] font-bold",
                  type === option
                    ? "bg-forno text-[#7d1a0f]"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {t(option === "delivery" ? "checkout.delivery" : "checkout.pickup")}
              </button>
            ))}
            <input type="hidden" {...register("type")} />
          </div>

          {type === "delivery" && (
            <div className="rounded-lg border border-border bg-card p-5">
              <div>
                <BiLabel htmlFor="checkout-address" en="Delivery address" mn="Хүргэлтийн хаяг" />
                <div className="relative mt-1.5">
                  <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-sugo" />
                  <Input id="checkout-address" className="pl-9" {...register("address")} />
                </div>
                <FieldError error={errors.address} />
              </div>

              <div className="mt-5">
                <BiLabel en="Address type" mn="Хаягийн төрөл" />
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  {[
                    ["home", "Home", "Орон сууц"],
                    ["office", "Office", "Оффис"],
                  ].map(([value, en, mn]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue("addressType", value)}
                      aria-pressed={addressType === value}
                      className={pill(addressType === value)}
                    >
                      <span>
                        {en} <span className="font-medium text-muted-foreground">· {mn}</span>
                      </span>
                      <span
                        className={cn(
                          "size-3.5 shrink-0 rounded-full border-2",
                          addressType === value ? "border-sugo bg-sugo" : "border-border",
                        )}
                      />
                    </button>
                  ))}
                  <input type="hidden" {...register("addressType")} />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div>
                  <BiLabel htmlFor="checkout-entrance" en="Entrance" mn="Орц" />
                  <Input
                    id="checkout-entrance"
                    className="mt-1.5"
                    inputMode="numeric"
                    placeholder={t("checkout.numberPlaceholder")}
                    {...register("entrance")}
                  />
                </div>
                <div>
                  <BiLabel htmlFor="checkout-floor" en="Floor" mn="Давхар" />
                  <Input
                    id="checkout-floor"
                    className="mt-1.5"
                    inputMode="numeric"
                    placeholder={t("checkout.numberPlaceholder")}
                    {...register("floor")}
                  />
                </div>
                <div>
                  <BiLabel htmlFor="checkout-apartment" en="Apartment" mn="Тоот" />
                  <Input
                    id="checkout-apartment"
                    className="mt-1.5"
                    inputMode="numeric"
                    placeholder={t("checkout.numberPlaceholder")}
                    {...register("apartment")}
                  />
                </div>
              </div>

              <div className="mt-5">
                <BiLabel
                  htmlFor="checkout-address-note"
                  en="Extra address detail"
                  mn="Хаягийн нэмэлт тайлбар"
                />
                <Input
                  id="checkout-address-note"
                  className="mt-1.5"
                  placeholder={t("checkout.addressNotePlaceholder")}
                  {...register("addressNote")}
                />
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card p-5">
            <div>
              <BiLabel htmlFor="checkout-name" en="Name" mn="Нэр" />
              <Input id="checkout-name" className="mt-1.5" {...register("name")} />
              <FieldError error={errors.name} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <BiLabel htmlFor="checkout-phone" en="Phone" mn="Утасны дугаар" />
                <div className="relative mt-1.5">
                  <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="checkout-phone"
                    className="pl-9"
                    inputMode="tel"
                    {...register("phone")}
                  />
                </div>
                <FieldError error={errors.phone} />
              </div>
              <div>
                <BiLabel
                  htmlFor="checkout-phone2"
                  en="Additional phone"
                  mn="Нэмэлт утасны дугаар"
                />
                <div className="relative mt-1.5">
                  <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="checkout-phone2"
                    className="pl-9"
                    inputMode="tel"
                    {...register("phone2")}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <BiLabel htmlFor="checkout-note" en="Note for the kitchen" mn="Гал тогоонд үлдээх" />
              <Textarea id="checkout-note" className="mt-1.5" {...register("note")} />
            </div>
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {t("action.placeOrder")} · {money(total)}
          </Button>
        </form>

        <aside className="h-fit rounded-lg border border-border bg-card p-5">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            {t("checkout.summary")}
          </h2>

          <div className="mt-4 flex flex-col gap-3">
            {items.map((line) => (
              <div key={line.key} className="flex items-center gap-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  {line.image ? (
                    <img src={line.image} alt="" className="size-full object-cover" />
                  ) : (
                    <img
                      src="/poca-logo.png"
                      alt=""
                      className="size-full object-contain p-1.5 opacity-25"
                    />
                  )}
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">
                    {line.name}
                    {line.variantLabel ? ` · ${line.variantLabel}` : ""}
                  </span>
                  <span className="numeric text-[11px] text-muted-foreground">
                    × {line.quantity}
                  </span>
                </span>
                <span className="numeric shrink-0 text-sm">{money(line.price * line.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-between border-t border-border pt-4">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
              {t("cart.total")}
            </span>
            <span className="numeric text-lg font-bold">{money(total)}</span>
          </div>
        </aside>
      </div>
    </>
  );
}
