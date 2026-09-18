import { CartProvider } from "@/providers/cart-provider";

import { ActiveSectionProvider } from "./_components/use-active-section";
import { Header } from "./_components/header";
import { OvenBackdrop } from "./_components/oven-backdrop";
import { SiteFooter } from "./_components/site-footer";
import { CartSheet } from "./_features/cart-sheet";

// Only the public site runs dark over the oven video. Admin and auth keep the
// plain light theme, since neither is a place to be atmospheric.
export default function MainLayout({ children }) {
  return (
    <CartProvider>
      {/* text-foreground is not redundant: <body> is outside this wrapper, so
          its inherited colour was resolved against the light theme. Without
          this, anything that does not set its own colour — h1, section
          headings — stays near-black on top of the video. */}
      <div className="dark ambient flex flex-1 flex-col text-foreground">
        {/* Wraps the header and the backdrop together so they share one notion
            of the current section. */}
        <ActiveSectionProvider>
          <OvenBackdrop />

          {/* Sits above the fixed backdrop rather than using a negative
              z-index, which would put it behind the body background. */}
          <div className="relative z-10 flex flex-1 flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ActiveSectionProvider>

        <CartSheet />
      </div>
    </CartProvider>
  );
}
