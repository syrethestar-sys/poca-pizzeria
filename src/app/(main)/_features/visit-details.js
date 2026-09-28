"use client";

import { Navigation, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StreetMap } from "@/components/street-map";
import { POCA_PLACE, directionsUrl } from "@/lib/place";
import { useLanguage } from "@/providers/language-provider";

// Same quiet shape as Our craft: a centred introduction, the map as the one
// big element, then the practical details as plain columns.
export function VisitDetails() {
  const { lang, t } = useLanguage();

  const details = [
    { label: t("visit.address"), value: t("visit.addressValue") },
    {
      label: t("visit.hours"),
      value: (
        <>
          {t("visit.weekdays")} · <span className="numeric">11:00 – 23:00</span>
          <br />
          <span className="text-muted-foreground">
            {t("visit.sunday")} · {t("visit.closed")}
          </span>
        </>
      ),
    },
    {
      label: t("visit.phone"),
      value: (
        <a href="tel:+97677771088" className="numeric hover:text-sugo">
          7777-1088
        </a>
      ),
    },
    { label: t("visit.service"), value: t("visit.serviceValue") },
  ];

  return (
    <section className="pb-16 md:pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-sugo">
          {t("nav.visit")}
        </p>
        <h2 className="mt-4 text-[clamp(30px,4.4vw,48px)] leading-[1.08]">{t("visit.title")}</h2>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Button
            render={<a href={directionsUrl(POCA_PLACE)} target="_blank" rel="noopener noreferrer" />}
          >
            <Navigation className="size-4" />
            {t("visit.directions")}
          </Button>
          <Button variant="outline" render={<a href="tel:+97677771088" />}>
            <Phone className="size-4" />
            {t("action.call")}
          </Button>
        </div>
      </div>

      <a
        href={directionsUrl(POCA_PLACE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("visit.directions")}
        className="mt-12 block overflow-hidden rounded-lg border border-border transition-colors duration-300 ease-in-out hover:border-forno/60"
      >
        <StreetMap lang={lang} className="block aspect-[4/5] w-full sm:aspect-[32/22]" />
      </a>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {details.map((item) => (
          <div key={item.label} className="border-t border-border pt-5">
            <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
              {item.label}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
