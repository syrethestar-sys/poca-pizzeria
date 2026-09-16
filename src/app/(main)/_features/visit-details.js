"use client";

import { useLanguage } from "@/providers/language-provider";

// Closes the page on the room itself. Cropped wide from the square original,
// so Cloudinary does the crop rather than the browser throwing away pixels.
// g_auto keeps the fire mouth in frame instead of slicing the dome in half.
const OVEN_SRC =
  "https://res.cloudinary.com/crbcsumf/image/upload/f_auto,q_auto,w_1400,c_fill,ar_21:9,g_auto/poca-hero-oven";

export function VisitDetails() {
  const { lang, t } = useLanguage();

  return (
    <>
      <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-sugo">
        {t("nav.visit")}
      </p>
      <h1 className="mt-3 max-w-[20ch] text-[clamp(30px,4.6vw,46px)] leading-[1.08]">
        {t("visit.title")}
      </h1>

      <div className="mt-10 grid gap-11 pb-6 md:grid-cols-2">
        <dl>
          <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
            {t("visit.address")}
          </dt>
          <dd className="mt-1.5 text-[16.5px]">{t("visit.addressValue")}</dd>

          <dt className="mt-7 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
            {t("visit.phone")}
          </dt>
          <dd className="mt-1.5 text-[16.5px]">
            <a href="tel:+97677771088" className="numeric border-b border-border hover:text-sugo">
              7777-1088
            </a>
          </dd>

          <dt className="mt-7 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
            {t("visit.hours")}
          </dt>
          <dd className="mt-1.5 max-w-80">
            <div className="flex justify-between gap-4 border-b border-border py-1.5">
              <span>{t("visit.weekdays")}</span>
              <span className="numeric text-[13px]">11:00 – 23:00</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-border py-1.5 text-muted-foreground">
              <span>{t("visit.sunday")}</span>
              <span className="numeric text-[13px]">{t("visit.closed")}</span>
            </div>
          </dd>

          <dt className="mt-7 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
            {t("visit.service")}
          </dt>
          <dd className="mt-1.5 text-[16.5px]">{t("visit.serviceValue")}</dd>

          <dt className="mt-7 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
            Instagram
          </dt>
          <dd className="mt-1.5 text-[16.5px]">
            <a
              href="https://instagram.com/pocapizzeria"
              target="_blank"
              rel="noopener"
              className="border-b border-border hover:text-sugo"
            >
              @pocapizzeria
            </a>
          </dd>
        </dl>

        {/* Wayfinding schematic, not a map: the Square, Flora, and 20 m west. */}
        <figure className="m-0 border border-border bg-card p-5">
          <svg viewBox="0 0 400 230" role="img" aria-labelledby="map-title" className="w-full">
            <title id="map-title">
              Poca Pizzeria is 20 metres west of the Flora flower shop, directly behind the Square
            </title>
            <rect
              x="16"
              y="18"
              width="140"
              height="86"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeDasharray="5 4"
            />
            <text
              x="86"
              y="66"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="11"
              letterSpacing="1.6"
              fill="currentColor"
              fillOpacity="0.6"
            >
              {lang === "mn" ? "ТАЛБАЙ" : "SQUARE"}
            </text>
            <line
              x1="16"
              y1="128"
              x2="384"
              y2="128"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
            <rect
              x="248"
              y="150"
              width="96"
              height="52"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.35"
            />
            <text
              x="296"
              y="181"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="1.2"
              fill="currentColor"
              fillOpacity="0.6"
            >
              {lang === "mn" ? "ФЛОРА" : "FLORA"}
            </text>
            <rect x="56" y="150" width="96" height="52" fill="var(--forno)" />
            <text
              x="104"
              y="175"
              textAnchor="middle"
              fontFamily="var(--font-display)"
              fontSize="13"
              fill="#7d1a0f"
            >
              POCA
            </text>
            <text
              x="104"
              y="190"
              textAnchor="middle"
              fontFamily="var(--font-display)"
              fontSize="9"
              letterSpacing="1"
              fill="#7d1a0f"
            >
              PIZZERIA
            </text>
            <line x1="160" y1="176" x2="240" y2="176" stroke="var(--sugo)" strokeWidth="1.5" />
            <path d="M168 171 L160 176 L168 181" fill="none" stroke="var(--sugo)" strokeWidth="1.5" />
            <text
              x="200"
              y="166"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="10"
              fill="var(--sugo)"
            >
              20 m
            </text>
          </svg>
          <figcaption className="mt-3.5 text-[13.5px] leading-relaxed text-muted-foreground">
            {lang === "mn"
              ? "Масштабгүй схем. Флора цэцгийн дэлгүүрийг өнгөрөөд баруун тийш яваарай — шар хаяг нэг талд байна."
              : "Not to scale. Walk past the Flora flower shop and keep going west — the yellow sign is on the same side."}
          </figcaption>
        </figure>
      </div>

      <img
        src={OVEN_SRC}
        alt={t("hero.ovenAlt")}
        loading="lazy"
        className="mb-10 aspect-[21/9] w-full border border-border object-cover"
      />
    </>
  );
}
