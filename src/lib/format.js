// Prices are stored in tögrög and always shown in full: 45,000₮
export const money = (amount) =>
  `${Number(amount ?? 0).toLocaleString("en-US")}₮`;

// Every menu string is { en, mn }. Mongolian falls back to English so a
// half-translated menu still renders something readable.
export const pick = (value, lang) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return (lang === "mn" ? value.mn : value.en) || value.en || value.mn || "";
};

export const TAG_SYMBOLS = {
  spicy: "🌶",
  "extra-spicy": "🌶🌶",
  vegetarian: "🌿",
  white: "⚪",
};

export const tagSymbols = (tags = []) =>
  tags.map((tag) => TAG_SYMBOLS[tag] ?? "").join("");
