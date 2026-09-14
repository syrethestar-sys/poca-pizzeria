import { getMenu } from "@/lib/menu-api";
import { MenuBoard } from "./_features/menu-board";
import { MenuHero } from "./_features/menu-hero";

// The kitchen toggles items on and off during service, so this route is
// rendered per request rather than baked at build time.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { categories, items } = await getMenu();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <MenuHero />
      <MenuBoard categories={categories} items={items} />
    </div>
  );
}
