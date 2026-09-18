"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";
import { useActiveSection } from "./use-active-section";

// One scene per section. Scrolling from the menu into Our craft crossfades the
// oven for the dough, and Visit settles on the empty room.
//
// Each clip was generated with the same still as both its first and last frame,
// so the ten-second repeat has no visible cut in it.
//
// This deliberately does not scrub the video against scroll position. That was
// tried: it reads as fast-forward on a quick flick, because a page-length throw
// asks for the whole clip in half a second, and every fix for that trades one
// artefact for another. A crossfade is calmer and costs far less.
const SCENES = [
  { section: "menu", name: "menu" },
  { section: "story", name: "craft" },
  { section: "visit", name: "visit" },
];

const CLOUD = "https://res.cloudinary.com/crbcsumf/video/upload";
// Full width rather than a downscale: this is a full-viewport backdrop, and 854
// upscaled to a wide display stays soft however well it is encoded — resolution
// was the thing being seen, not compression. Affordable because phones get no
// video at all, so this is desktop-only weight. Only the scene on screen loads,
// so a visit costs 856 KB, not the 2.5 MB of all three.
const clip = (name) => `${CLOUD}/q_auto,f_auto,w_1280/poca-scene-${name}.mp4`;
const still = (name) => `${CLOUD}/so_1,f_auto,q_auto,w_1600/poca-scene-${name}.jpg`;

// useSyncExternalStore rather than useState in an effect: it gives a defined
// server snapshot (false), so the markup matches on hydration and no video
// carries a src until the client has confirmed it should.
function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function OvenBackdrop() {
  const { active } = useActiveSection();
  const players = useRef({});

  // Phones get stills. Video behind a scrim, behind the menu, on the connection
  // least able to afford it is the first thing that should go.
  const roomy = useMediaQuery("(min-width: 768px)");
  const stillness = useMediaQuery("(prefers-reduced-motion: reduce)");
  const motion = roomy && !stillness;

  // Only the scene on screen plays. The other two hold on their poster and cost
  // nothing — preload="none" means their video data is never fetched until the
  // reader actually scrolls that far.
  useEffect(() => {
    if (!motion) return;

    for (const scene of SCENES) {
      const player = players.current[scene.section];
      if (!player) continue;

      if (scene.section === active) {
        // Autoplay is refused often enough — a battery-saver mode, a slow
        // connection — that it must not throw.
        player.play().catch(() => {});
      } else {
        player.pause();
      }
    }
  }, [active, motion]);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 bg-carbone">
      {SCENES.map((scene, index) => (
        <div
          key={scene.section}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            scene.section === active ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Under the video so the first paint is the scene rather than black,
              and the whole backdrop on phones. */}
          <img src={still(scene.name)} alt="" className="absolute inset-0 size-full object-cover" />

          {motion && (
            <video
              ref={(element) => {
                players.current[scene.section] = element;
              }}
              src={clip(scene.name)}
              poster={still(scene.name)}
              loop
              muted
              playsInline
              // The first scene is above the fold, so it is worth fetching early
              // and letting the browser start it natively — calling play() from
              // the effect races the element being ready and quietly loses.
              autoPlay={index === 0}
              preload={index === 0 ? "auto" : "none"}
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </div>
      ))}

      {/* A menu has to be readable on top of a fire. */}
      <div className="absolute inset-0 bg-carbone/72" />
    </div>
  );
}
