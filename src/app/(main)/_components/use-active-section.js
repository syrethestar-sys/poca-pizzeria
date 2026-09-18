"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

// The three sections of the public page, in document order.
export const SECTIONS = ["menu", "story", "visit"];

// Context rather than a plain hook on purpose: the header underline and the
// background scene must agree, and two components each calling the same hook
// would get two independent useStates. Clicking "Our craft" would move the
// underline and leave the backdrop on the oven.
const ActiveSectionContext = createContext(null);

// Which section the reader is looking at. The margins shrink the observed band
// to the middle of the viewport, so the answer changes when a section takes
// over the screen rather than the moment its first pixel appears.
export function ActiveSectionProvider({ children }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState(SECTIONS[0]);

  useEffect(() => {
    if (!onHome) return undefined;

    const elements = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (winner) setActive(winner.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [onHome]);

  const value = useMemo(() => ({ active, onHome, setActive }), [active, onHome]);

  return <ActiveSectionContext.Provider value={value}>{children}</ActiveSectionContext.Provider>;
}

export function useActiveSection() {
  const context = useContext(ActiveSectionContext);
  if (!context) {
    throw new Error("useActiveSection must be used inside ActiveSectionProvider");
  }
  return context;
}
