import { getMenu } from "@/lib/menu-api";
import { MenuBoard } from "./_features/menu-board";
import { MenuHero } from "./_features/menu-hero";
import { StoryBlock } from "./_features/story-block";
import { VisitDetails } from "./_features/visit-details";

// The kitchen toggles items on and off during service, so this route is
// rendered per request rather than baked at build time.
export const dynamic = "force-dynamic";

// One page. Craft and Visit are sections rather than routes, so the header
// links scroll instead of navigating. scroll-mt clears the sticky header —
// without it an anchor jump leaves the heading hidden under the bar.
export default async function HomePage() {
  const { categories, items } = await getMenu();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <section id="menu" className="scroll-mt-20">
        <MenuHero />
        <MenuBoard categories={categories} items={items} />
      </section>

      <section id="story" className="scroll-mt-20 border-t border-border">
        <StoryBlock />
      </section>

      <section id="visit" className="scroll-mt-20 border-t border-border pt-12">
        <VisitDetails />
      </section>
    </div>
  );
}
