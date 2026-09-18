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

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-sm">
      {/* justify-end only bites once the bar wraps: on a single line the logo's
          mr-auto eats the slack first, so the wide layout is untouched. Wrapped
          rows would otherwise pack left and strand the language toggle mid-bar. */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
        {/* The wordmark carries the name — no text beside it. */}
        <Link href="/" className="mr-auto flex items-center" aria-label="Poca Pizzeria">
          <Logo height={38} />
        </Link>

        <nav className="flex flex-wrap gap-0.5" aria-label="Sections">
          {LINKS.map((link) => {
            const current = onHome && active === link.id;
            return (
              <Link
                key={link.id}
                href={`/#${link.id}`}
                onClick={(event) => scrollToSection(event, link.id)}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "border-b-2 px-2.5 py-2 text-[12px] font-medium tracking-[0.02em]",
                  current
                    ? "border-sugo text-sugo"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <LocationPicker />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("cart.title")}
            className="relative flex size-9 items-center justify-center rounded-full border border-border bg-card hover:border-foreground"
          >
            <ShoppingCart className="size-4" />
            {count > 0 && (
              <span className="numeric absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-sugo text-[9px] text-[#fdf8ec]">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <ProfileMenu />
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-sugo px-3 py-2 text-[11px] font-medium tracking-[0.06em] uppercase text-[#fdf8ec]"
            >
              {t("action.login")}
            </Link>
          )}

          {/* Language sits last so it stays pinned to the far right of the bar. */}
          <div className="flex overflow-hidden rounded-full border border-border" role="group">
            {["en", "mn"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={cn(
                  "px-2.5 py-1.5 text-[10px] font-medium tracking-[0.1em] uppercase",
                  lang === code
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {code === "en" ? "EN" : "МН"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
