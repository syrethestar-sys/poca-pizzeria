"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WoodFire } from "@/components/wood-fire";
import { useLanguage } from "@/providers/language-provider";

// The menu is the landing page, so this masthead carries only what someone
// deciding where to eat needs: what we make, when we are open, where we are,
// and the phone number. Everything else lives on Our craft and Visit.
export function MenuHero() {
  const { t } = useLanguage();

  return (
    <section className="grid items-center gap-8 border-b border-border py-10 md:grid-cols-[1.05fr_0.95fr] md:py-12">
      <div>
        <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-sugo">
          {t("hero.eyebrow")}
        </p>

        <h1 className="mt-3.5 text-[clamp(32px,5vw,52px)] leading-[1.04]">
          {t("hero.titleA")} <span className="text-sugo">{t("hero.titleB")}</span>
        </h1>

        <p className="mt-4 max-w-[46ch] text-[16.5px] text-muted-foreground">
          {t("hero.subShort")}
        </p>

        <p className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold tracking-[0.13em] uppercase text-muted-foreground">
          <span>{t("facts.hoursValue")}</span>
          <span aria-hidden="true">·</span>
          <span>{t("facts.findValue")}</span>
          <span aria-hidden="true">·</span>
          <span>{t("facts.deliveryValue")}</span>
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Button render={<a href="tel:+97677771088" />}>
            {t("action.call")} · 7777-1088
          </Button>
          <Button variant="outline" render={<Link href="/visit" />}>
            {t("nav.visit")}
          </Button>
        </div>
      </div>

      {/* Copy leads, the arch answers it on the right. On a phone it drops below. */}
      <WoodFire className="ml-auto w-full max-w-[300px] text-carbone md:max-w-[440px]" />
    </section>
  );
}
