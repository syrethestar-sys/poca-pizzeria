// Mongolian numbers are 8 digits: mobiles start 8/9/6 (9104 5666), Ulaanbaatar
// landlines 7 (7777 1088), newer ranges 5. "+976", spaces and dashes are
// accepted and stripped. Returns the 8 digits, or null if it is not a number.
export const normalizeMnPhone = (value) => {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("976")) digits = digits.slice(3);
  return /^[5-9]\d{7}$/.test(digits) ? digits : null;
};

// 91045666 → "9104 5666", how Mongolian numbers are usually written.
export const formatMnPhone = (digits) =>
  digits && digits.length === 8 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits ?? "";
