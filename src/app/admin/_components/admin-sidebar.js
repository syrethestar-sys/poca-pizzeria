"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, UtensilsCrossed } from "lucide-react";

import { Logo } from "@/components/Logo";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/menu", key: "admin.menu", icon: UtensilsCrossed },
  { href: "/admin/orders", key: "admin.orders", icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card px-4 py-5 sm:block">
      <Link href="/" className="mb-8 inline-flex">
        <Logo square height={46} />
      </Link>
      <nav className="flex flex-col gap-1">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase",
                active
                  ? "bg-forno text-[#7d1a0f]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {t(link.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
