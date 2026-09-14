import { CartProvider } from "@/providers/cart-provider";

import { Header } from "./_components/header";
import { SiteFooter } from "./_components/site-footer";
import { CartSheet } from "./_features/cart-sheet";

export default function MainLayout({ children }) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartSheet />
    </CartProvider>
  );
}
