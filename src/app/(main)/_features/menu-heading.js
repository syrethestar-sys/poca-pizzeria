"use client";

import { SectionHeading } from "../_components/section-heading";
import { useLanguage } from "@/providers/language-provider";

export function MenuHeading() {
  const { t } = useLanguage();
  return <SectionHeading eyebrow={t("menu.eyebrow")} title={t("menu.title")} lede={t("menu.lede")} />;
}
