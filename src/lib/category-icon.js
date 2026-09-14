import {
  Beer,
  Coffee,
  Croissant,
  CupSoda,
  LayoutGrid,
  Leaf,
  Martini,
  Pizza,
  Sandwich,
  Wine,
} from "lucide-react";

// A category can carry its own photo. Until one is uploaded, fall back to an
// icon matched on the English name, and to a generic mark if nothing matches.
const BY_NAME = [
  [/pizza/i, Pizza],
  [/starter|zuush|appetis/i, Sandwich],
  [/side|focaccia|salad/i, Croissant],
  [/coffee/i, Coffee],
  [/tea/i, Leaf],
  [/soft|juice|water|soda/i, CupSoda],
  [/beer/i, Beer],
  [/cocktail/i, Martini],
  [/wine/i, Wine],
];

export function categoryIcon(name) {
  const match = BY_NAME.find(([pattern]) => pattern.test(name ?? ""));
  return match ? match[1] : LayoutGrid;
}

export { LayoutGrid as AllCategoriesIcon };
