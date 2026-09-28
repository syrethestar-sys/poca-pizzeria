"use client";

import { useLanguage } from "@/providers/language-provider";

// Served from Cloudinary with f_auto,q_auto and cropped to each slot's shape
// (g_auto keeps the subject in frame), so the layout never letterboxes.
const photo = (name, ratio) =>
  `https://res.cloudinary.com/crbcsumf/image/upload/f_auto,q_auto,w_1200,c_fill,ar_${ratio},g_auto/poca-hero-${name}`;

const PHOTOS = [
  {
    src: photo("oven-service", "4:3"),
    caption: { en: "Into the wood fire", mn: "Түлээний гал руу" },
    alt: {
      en: "A pizza going into the wood-fired oven on a peel, embers glowing behind it",
      mn: "Түлээний зуухан дотор улайсан нүүрсний өмнө хүрзэн дээр пиццаг хийж буй нь",
    },
  },
  {
    src: photo("dough-hands", "4:5"),
    caption: { en: "Stretched by hand", mn: "Гараар дэлгэнэ" },
    alt: {
      en: "Flour-dusted hands stretching a round of sourdough on a marble counter",
      mn: "Гурилтай гар гантиг ширээн дээр исгэсэн зуурмагийг дэлгэж байгаа нь",
    },
  },
];

const PILLARS = [
  { title: { en: "Sourdough", mn: "Исгэсэн зуурмаг" }, body: { en: "A natural starter, slow fermentation, flour and water and salt. Nothing else in the dough.", mn: "Байгалийн хөрөнгө, удаан исгэлт, гурил, ус, давс. Зуурмагт өөр юу ч байхгүй." } },
  { title: { en: "Wood fire", mn: "Түлээний гал" }, body: { en: "The oven runs hot enough to bake a pizza in minutes, which keeps the base soft and the edge charred.", mn: "Зуух маань пиццаг хэдхэн минутанд шарах халуунтай — ёроол нь зөөлөн, ирмэг нь бага зэрэг шатсан гардаг." } },
  { title: { en: "Honest ingredients", mn: "Шударга орц" }, body: { en: "Italian cheese and cured meats, Italian wine, and produce bought for the day rather than the week.", mn: "Италийн бяслаг, боловсруулсан мах, италь дарс, тухайн өдөртөө авсан ногоо." } },
];

// An editorial spread: headline and lead side by side, two photos set at
// different heights, the longer copy under them, then the three things the
// place is built on as numbered cards.
export function StoryBlock() {
  const { lang, t } = useLanguage();
  const pick = (value) => (lang === "mn" ? value.mn : value.en);

  return (
    <section className="py-14 md:py-20">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-sugo">
            {t("story.eyebrow")}
          </p>
          <h2 className="mt-3 text-[clamp(32px,5vw,56px)] leading-[1.02]">{t("story.title")}</h2>
        </div>
        <p className="text-[17px] leading-relaxed md:col-span-5 md:pb-2">{t("story.p1")}</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-12">
        {PHOTOS.map((photo, index) => (
          <figure
            key={photo.src}
            className={index === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-20"}
          >
            <img
              src={photo.src}
              alt={pick(photo.alt)}
              loading="lazy"
              className={`w-full rounded-lg border border-border object-cover ${
                index === 0 ? "aspect-[4/3]" : "aspect-[4/5]"
              }`}
            />
            <figcaption className="mt-2.5 flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase text-muted-foreground">
              <span className="h-px w-6 bg-sugo" aria-hidden="true" />
              {pick(photo.caption)}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-12">
        <p className="leading-relaxed text-muted-foreground md:col-span-5 md:col-start-2">
          {t("story.p2")}
        </p>
        <p className="leading-relaxed text-muted-foreground md:col-span-5">{t("story.p3")}</p>
      </div>

      <ol className="mt-14 grid gap-4 sm:grid-cols-3">
        {PILLARS.map((pillar, index) => (
          <li
            key={pillar.title.en}
            className="flex flex-col rounded-lg border border-border bg-card/85 p-6 backdrop-blur-sm transition-colors duration-300 ease-in-out hover:border-forno/60"
          >
            <span className="numeric text-[12px] font-bold tracking-[0.12em] text-forno">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-8 text-[20px]">{pick(pillar.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick(pillar.body)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
