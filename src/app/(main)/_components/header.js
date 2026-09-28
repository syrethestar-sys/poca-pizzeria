"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Logo } from "@/components/Logo";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";
import { LocationPicker } from "../_features/location-picker";
import { ProfileMenu } from "./profile-menu";
import { useActiveSection } from "./use-active-section";

// Sections of the one public page, not separate routes. The href still leads
// with "/" so the links also work from checkout, orders and the auth pages.
const LINKS = [
  { id: "menu", key: "nav.menu" },
  { id: "story", key: "nav.story" },
  { id: "visit", key: "nav.visit" },
];

export function Header() {
  const { user } = useAuth();
  const { count, setOpen } = useCart();
  const { lang, setLang, t } = useLanguage();
  const { active, onHome, setActive } = useActiveSection();

  // The App Router does not scroll for a hash on the route you are already on,
  // so take over on the home page. Everywhere else the href is left alone and
  // the router navigates to /#section as usual.
  const scrollToSection = (event, id) => {
    if (!onHome) return;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    window.history.replaceState(null, "", `/#${id}`);
    setActive(id);
  };

  const navLinks = (className) =>
    LINKS.map((link) => {
      const current = onHome && active === link.id;
      return (
        <Link
          key={link.id}
          href={`/#${link.id}`}
          onClick={(event) => scrollToSection(event, link.id)}
          aria-current={current ? "true" : undefined}
          className={cn(
            "rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-300 ease-in-out",
            current ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
            className,
          )}
        >
          {t(link.key)}
        </Link>
      );
    });

  const iconButton =
    "relative flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-card transition-colors duration-300 ease-in-out hover:border-foreground";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-sm">
      {/* Two groups on one line: where you are (logo + sections) on the left,
          what you can do (address, language, cart, account) on the right.
          Every control is the same 36px height and radius. */}
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Poca Pizzeria">
          <Logo height={34} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
          {navLinks()}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2">
          <LocationPicker className="hidden w-[220px] sm:flex lg:w-[260px]" />

          <div
            className="flex h-9 shrink-0 overflow-hidden rounded-md border border-border bg-card p-0.5"
            role="group"
            aria-label="Language"
          >
            {["en", "mn"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={cn(
                  "rounded-[5px] px-2.5 text-[11px] font-bold tracking-[0.08em] transition-colors duration-300 ease-in-out",
                  lang === code
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {code === "en" ? "EN" : "МН"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("cart.title")}
            className={iconButton}
          >
            <ShoppingCart className="size-4" />
            {count > 0 && (
              <span className="numeric absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sugo px-1 text-[9px] font-bold text-[#fdf8ec]">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <ProfileMenu className={iconButton} />
          ) : (
            <Link
              href="/login"
              className="flex h-9 shrink-0 items-center rounded-md bg-sugo px-3.5 text-[12px] font-bold text-[#fdf8ec] transition-colors duration-300 ease-in-out hover:bg-[#8f1a17]"
            >
              {t("action.login")}
            </Link>
          )}
        </div>
      </div>

      {/* Phones: sections and the address get their own row under the bar. */}
      <div className="border-t border-border md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 sm:px-6">
          <nav className="flex items-center" aria-label="Sections">
            {navLinks("px-2.5")}
          </nav>
          <LocationPicker className="ml-auto w-0 flex-1 sm:hidden" />
        </div>
      </div>
    </header>
  );
}
