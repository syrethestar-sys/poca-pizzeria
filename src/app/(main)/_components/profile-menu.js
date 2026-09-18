"use client";

import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { LogOut, Shield, ShoppingBag, User } from "lucide-react";

import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

const itemClass =
  "flex w-full cursor-default items-center gap-2.5 px-3 py-2 text-[12px] text-foreground outline-none select-none data-highlighted:bg-muted data-disabled:opacity-50";

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={t("nav.account")}
        className="flex size-9 items-center justify-center rounded-full bg-sugo text-[#fdf8ec] outline-none hover:bg-[#8f1a17] focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-[#8f1a17]"
      >
        <User className="size-4" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner className="z-50 outline-none" sideOffset={8} align="end">
          <Menu.Popup className="min-w-52 origin-[var(--transform-origin)] overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-xl outline-none transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            {/* The account has no display name, so the email is the only handle. */}
            <p className="truncate px-3 pt-1.5 pb-2 text-[11px] text-muted-foreground">
              {user.email}
            </p>

            <Menu.Separator className="mx-0 my-1 h-px bg-border" />

            <Menu.LinkItem closeOnClick className={itemClass} render={<Link href="/orders" />}>
              <ShoppingBag className="size-4 text-muted-foreground" />
              {t("nav.orders")}
            </Menu.LinkItem>

            {user.role === "admin" && (
              <Menu.LinkItem
                closeOnClick
                className={itemClass}
                render={<Link href="/admin/menu" />}
              >
                <Shield className="size-4 text-muted-foreground" />
                {t("nav.admin")}
              </Menu.LinkItem>
            )}

            <Menu.Separator className="mx-0 my-1 h-px bg-border" />

            <Menu.Item
              onClick={logout}
              className="flex w-full cursor-default items-center gap-2.5 px-3 py-2 text-[12px] text-destructive outline-none select-none data-highlighted:bg-destructive/10"
            >
              <LogOut className="size-4" />
              {t("action.logout")}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
