"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/providers/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-border">
      <div className="overflow-hidden bg-sugo py-2.5">
        <div className="flex gap-10 whitespace-nowrap px-4 font-mono text-[10px] tracking-[0.22em] uppercase text-[#fdf8ec]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>Wood-fired · Sourdough · Mon–Sat 11:00–23:00</span>
          ))}
        </div>
      </div>

      <div className="bg-carbone px-4 py-12 text-[#f3ebdb] sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-3">
            <Logo height={54} />
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#f3ebdb]/55">
              {t("brand.tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.18em] uppercase text-[#f3ebdb]/45">
                {t("nav.menu")}
              </p>
              <ul className="space-y-2 text-sm text-[#f3ebdb]/80">
                <li>
                  <Link href="/">{t("menu.food")}</Link>
                </li>
                <li>
                  <Link href="/">{t("menu.drinks")}</Link>
                </li>
                <li>
                  <Link href="/story">{t("nav.story")}</Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.18em] uppercase text-[#f3ebdb]/45">
                {t("nav.visit")}
              </p>
              <ul className="space-y-2 text-sm text-[#f3ebdb]/80">
                <li>{t("facts.hoursValue")}</li>
                <li>
                  <a href="tel:+97677771088" className="numeric">
                    7777-1088
                  </a>
                </li>
                <li>{t("facts.findValue")}</li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.18em] uppercase text-[#f3ebdb]/45">
                Instagram
              </p>
              <a
                href="https://instagram.com/pocapizzeria"
                target="_blank"
                rel="noopener"
                className="text-sm text-[#f3ebdb]/80 hover:text-forno"
              >
                @pocapizzeria
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-[#f3ebdb]/10 pt-6 font-mono text-[10px] tracking-[0.14em] uppercase text-[#f3ebdb]/45">
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
