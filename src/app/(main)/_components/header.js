"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";

import { Logo } from "@/components/Logo";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";
import { LocationPicker } from "../_features/location-picker";

const LINKS = [
  { href: "/", key: "nav.menu" },
  { href: "/story", key: "nav.story" },
  { href: "/visit", key: "nav.visit" },
];

export function Header() {
  const { user, logout } = useAuth();
  const { count, setOpen } = useCart();
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
        {/* The wordmark carries the name — no text beside it. */}
        <Link href="/" className="mr-auto flex items-center" aria-label="Poca Pizzeria">
          <Logo height={38} />
        </Link>

        <nav className="flex flex-wrap gap-0.5" aria-label="Sections">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "border-b-2 px-2.5 py-2 text-[12px] font-medium tracking-[0.02em]",
                  active
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
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <Link
                  href="/admin/menu"
                  className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground hover:text-foreground"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/orders"
                aria-label={t("nav.orders")}
                className="flex size-9 items-center justify-center rounded-full bg-sugo text-[#fdf8ec]"
              >
                <User className="size-4" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground hover:text-foreground"
              >
                {t("action.logout")}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-sugo px-3 py-2 text-[11px] font-medium tracking-[0.06em] uppercase text-[#fdf8ec]"
            >
              {t("action.login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
