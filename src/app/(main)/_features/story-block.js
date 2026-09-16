"use client";

import { useLanguage } from "@/providers/language-provider";

// Served from Cloudinary at 1200px wide with f_auto,q_auto — the slots render
// around 550px, so this covers retina without shipping the full-size original.
const photo = (name) =>
  `https://res.cloudinary.com/crbcsumf/image/upload/f_auto,q_auto,w_1200/poca-hero-${name}`;

const PHOTOS = [
  {
    src: photo("oven-service"),
    alt: {
      en: "A pizza going into the wood-fired oven on a peel, embers glowing behind it",
      mn: "Түлээний зуухан дотор улайсан нүүрсний өмнө хүрзэн дээр пиццаг хийж буй нь",
    },
  },
  {
    src: photo("dough-hands"),
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

export function StoryBlock() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-6">
      <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-sugo">
        {t("story.eyebrow")}
      </p>
      <h1 className="mt-3 text-[clamp(30px,4.6vw,46px)] leading-[1.08]">{t("story.title")}</h1>

      <div className="grid gap-11 md:grid-cols-2">
        <div className="mt-8">
          <p className="mt-5 font-display text-[19px] leading-relaxed">{t("story.p1")}</p>
          <p className="mt-4 max-w-[56ch] text-muted-foreground">{t("story.p2")}</p>
          <p className="mt-4 max-w-[56ch] text-muted-foreground">{t("story.p3")}</p>
        </div>

        <div className="grid gap-3.5">
          {PHOTOS.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={lang === "mn" ? photo.alt.mn : photo.alt.en}
              loading="lazy"
              className="aspect-video w-full border border-border object-cover"
            />
          ))}
        </div>
      </div>

      <div className="mt-13 grid gap-px border border-border bg-border sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.title.en} className="bg-card px-5 py-6">
            <h3 className="font-display text-[20px]">
              {lang === "mn" ? pillar.title.mn : pillar.title.en}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {lang === "mn" ? pillar.body.mn : pillar.body.en}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
