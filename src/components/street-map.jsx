import { BUILDINGS, GREEN, STREETS } from "./street-map-data";

// Poca's neighbourhood drawn from real OpenStreetMap data in the brand's
// palette: no tiles, no scripts, just one SVG. Poca sits at the origin
// (0,0); one unit is one metre, x east, y south.
const ROADS = [
  ["footway", 1.2, "#3a322a"],
  ["service", 3, "#3d342c"],
  ["residential", 5, "#483e35"],
  ["tertiary", 7, "#4e443a"],
  ["secondary", 9, "#554a3f"],
  ["primary", 12, "#5d5145"],
];

const LABELS = {
  en: {
    sambuu: "J. SAMBUU ST",
    sukhbaatar: "D. SUKHBAATAR ST",
    park: "Government Palace garden",
    palace: "Government Palace",
    square: "Sükhbaatar Square",
    flora: "Flora",
  },
  mn: {
    sambuu: "Ж. САМБУУГИЙН ГУДАМЖ",
    sukhbaatar: "Д. СҮХБААТАРЫН ГУДАМЖ",
    park: "Төрийн ордны цэцэрлэг",
    palace: "Төрийн ордон",
    square: "Сүхбаатарын талбай",
    flora: "Флора",
  },
};

export function StreetMap({ lang = "en", className }) {
  const l = LABELS[lang] ?? LABELS.en;

  return (
    <svg
      viewBox="-320 -210 640 440"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={
        lang === "mn"
          ? "Poca Pizzeria-гийн байршлын газрын зураг: Ж.Самбуугийн гудамжинд, Флора цэцгийн дэлгүүрийн баруун талд, Төрийн ордны цэцэрлэгийн хойд талд."
          : "Map of Poca Pizzeria: on J. Sambuu Street, just west of the Flora flower shop, across from the Government Palace garden."
      }
      className={className}
      style={{ background: "#1b1715" }}
    >
      <path d={GREEN} fill="#262c1f" />
      <path d={BUILDINGS} fill="#27211c" stroke="#30292287" strokeWidth="0.8" />

      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {ROADS.map(([key, width, color]) => (
          <path key={key} d={STREETS[key]} stroke={color} strokeWidth={width} />
        ))}
      </g>

      {/* Street names sit on the streets, like on a printed map. */}
      <g
        fill="#a4967f"
        fontFamily="var(--font-sans)"
        fontSize="6.5"
        fontWeight="700"
        letterSpacing="1.2"
        textAnchor="middle"
      >
        <text x="-240" y="12.2" dominantBaseline="middle">
          {l.sambuu}
        </text>
        <text
          x="-71"
          y="-125"
          dominantBaseline="middle"
          transform="rotate(-97.5 -71 -125)"
        >
          {l.sukhbaatar}
        </text>
      </g>

      <g fontFamily="var(--font-sans)" textAnchor="middle">
        <text x="62" y="62" fill="#6f7a5c" fontSize="8.5" fontStyle="italic">
          {l.park}
        </text>
        <text x="110" y="168" fill="#7a6e5f" fontSize="9" fontWeight="600">
          {l.palace}
        </text>
        <text x="110" y="214" fill="#a4967f" fontSize="9" fontWeight="700" letterSpacing="0.6">
          ↓ {l.square}
        </text>
      </g>

      {/* Flora, the landmark people ask for. */}
      <g>
        <circle cx="44" cy="-4" r="3.6" fill="#A81F1C" stroke="#1b1715" strokeWidth="1.5" />
        <text
          x="50"
          y="-9"
          fill="#f3ebdb"
          fontFamily="var(--font-sans)"
          fontSize="9"
          fontWeight="600"
        >
          {l.flora}
        </text>
      </g>

      {/* Poca: the logo's yellow square on a stem, with a slow pulse. */}
      <g>
        <circle cx="0" cy="0" r="6" fill="#E9B01C" opacity="0.35">
          <animate attributeName="r" values="6;16;6" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="4.5" fill="#E9B01C" stroke="#1b1715" strokeWidth="1.8" />
        <line x1="0" y1="-5" x2="0" y2="-16" stroke="#E9B01C" strokeWidth="1.6" />
        <rect x="-27" y="-44" width="54" height="28" rx="4" fill="#E9B01C" />
        <text
          x="0"
          y="-31.5"
          textAnchor="middle"
          fill="#A81F1C"
          fontFamily="var(--font-sans)"
          fontSize="11"
          fontWeight="800"
          letterSpacing="1"
        >
          POCA
        </text>
        <text
          x="0"
          y="-22.5"
          textAnchor="middle"
          fill="#A81F1C"
          fontFamily="var(--font-sans)"
          fontSize="5.6"
          fontWeight="700"
          letterSpacing="1.4"
        >
          PIZZERIA
        </text>
      </g>

      <text
        x="314"
        y="224"
        textAnchor="end"
        fill="#5e5448"
        fontFamily="var(--font-sans)"
        fontSize="6"
      >
        © OpenStreetMap contributors
      </text>
    </svg>
  );
}
