"use client";

import { useLanguage } from "@/providers/language-provider";

// Served from Cloudinary with f_auto,q_auto and cropped to each slot's shape
// (g_auto keeps the subject in frame), so the layout never letterboxes.
const photo = (name, ratio) =>
  `https://res.cloudinary.com/crbcsumf/image/upload/f_auto,q_auto,w_1200,c_fill,ar_${ratio},g_auto/poca-hero-${name}`;

const PHOTOS = [
  {
    src: photo("oven-service", "3:2"),
    alt: {
      en: "A pizza going into the wood-fired oven on a peel, embers glowing behind it",
      mn: "Түлээний зуухан дотор улайсан нүүрсний өмнө хүрзэн дээр пиццаг хийж буй нь",
    },
  },
  {
    src: photo("dough-hands", "3:2"),
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

// Kept deliberately quiet: a centred introduction, two photos of equal
// weight, one paragraph, and the three pillars as plain columns.
export function StoryBlock() {
  const { lang, t } = useLanguage();
  const pick = (value) => (lang === "mn" ? value.mn : value.en);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-sugo">
          {t("story.eyebrow")}
        </p>
        <h2 className="mt-4 text-[clamp(30px,4.4vw,48px)] leading-[1.08]">{t("story.title")}</h2>
        <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">{t("story.p1")}</p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {PHOTOS.map((photo) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={pick(photo.alt)}
            loading="lazy"
            className="aspect-[3/2] w-full rounded-lg object-cover"
          />
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center leading-relaxed text-muted-foreground">
        {t("story.p2")} {t("story.p3")}
      </p>

      <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
        {PILLARS.map((pillar) => (
          <div key={pillar.title.en} className="border-t border-border pt-5">
            <h3 className="text-[17px]">{pick(pillar.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick(pillar.body)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
