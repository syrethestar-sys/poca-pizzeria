"use client";

import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

export function AdminTopbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
      <span className="mr-auto font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        {user?.email}
      </span>

      <div className="flex overflow-hidden rounded-full border border-border" role="group">
        {["en", "mn"].map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={cn(
              "px-2.5 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase",
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
        onClick={logout}
        className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground"
      >
        {t("action.logout")}
      </button>
    </header>
  );
}
