"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";

const FACTS = [
  ["facts.hours", "facts.hoursValue"],
  ["facts.find", "facts.findValue"],
  ["facts.delivery", "facts.deliveryValue"],
  ["facts.oven", "facts.ovenValue"],
];

export function Hero() {
  const { t } = useLanguage();

  return (
    <>
      <section className="grid items-center gap-11 py-12 md:grid-cols-[1.15fr_0.85fr] md:py-14">
        <div>
          <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-sugo">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-4 text-[clamp(38px,6.2vw,66px)] leading-[1.02]">
            {t("hero.titleA")} <span className="text-sugo">{t("hero.titleB")}</span>
          </h1>
          <div className="mt-6 h-[3px] w-16 bg-sugo" />
          <p className="mt-5 max-w-[44ch] text-[17px] text-muted-foreground">{t("hero.sub")}</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button size="lg" render={<a href="tel:+97677771088" />}>
              {t("action.call")} · 7777-1088
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/menu" />}>
              {t("action.seeMenu")}
            </Button>
          </div>
        </div>

        {/* The oven, drawn in CSS — a stand-in until the photo library exists. */}
        <div className="relative mx-auto aspect-square w-full max-w-[340px] md:max-w-none">
          <div
            className="absolute inset-x-[4%] inset-y-[6%] bottom-[12%] border border-border"
            style={{
              borderRadius: "50% 50% 4px 4px / 58% 58% 4px 4px",
              background:
                "repeating-linear-gradient(90deg, transparent 0 34px, color-mix(in srgb, var(--carbone) 12%, transparent) 34px 35px), repeating-linear-gradient(0deg, transparent 0 26px, color-mix(in srgb, var(--carbone) 12%, transparent) 26px 27px), var(--muted)",
            }}
          />
          <div
            className="absolute bottom-[12%] left-1/2 h-[46%] w-[56%] -translate-x-1/2"
            style={{
              borderRadius: "50% 50% 3px 3px / 74% 74% 3px 3px",
              background:
                "radial-gradient(120% 90% at 50% 96%, var(--forno) 0%, var(--ember) 34%, #7b1f0c 66%, #25100a 100%)",
              boxShadow: "0 0 46px -6px color-mix(in srgb, var(--ember) 60%, transparent)",
            }}
          />
        </div>
      </section>

      <dl className="grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map(([label, value], index) => (
          <div
            key={label}
            className={`border-border py-5 pr-5 ${index < FACTS.length - 1 ? "border-b lg:border-r lg:border-b-0" : ""}`}
          >
            <dt className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
              {t(label)}
            </dt>
            <dd className="mt-1.5 font-display text-[17px]">{t(value)}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
