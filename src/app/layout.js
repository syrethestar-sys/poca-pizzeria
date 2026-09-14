import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/providers/auth-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { LocationProvider } from "@/providers/location-provider";

// One face for everything. Cyrillic is required — the menu is bilingual.
const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Poca Pizzeria — wood-fired sourdough pizza",
    template: "%s · Poca Pizzeria",
  },
  description:
    "Wood-fired sourdough pizza in Ulaanbaatar. Handmade, honest ingredients. Behind the Square, 20 m west of the Flora flower shop.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <LanguageProvider>
          <LocationProvider>
            <AuthProvider>{children}</AuthProvider>
          </LocationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
