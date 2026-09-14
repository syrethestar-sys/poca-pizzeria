import { API_URL } from "@/app/api/api";

// Server-side reads for the storefront. The site has to stay up when the API
// is down — a restaurant page that 500s is worse than one without a menu —
// so a failed read returns an empty list and the page shows its empty state.
async function readJson(path) {
  try {
    const response = await fetch(`${API_URL}${path}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error(`menu-api: ${path} failed`, err.message);
    return null;
  }
}

export async function getCategories() {
  const data = await readJson("/menu-category/get");
  return data?.menuCategories ?? [];
}

export async function getMenuItems() {
  const data = await readJson("/menu-item/get");
  return data?.menuItems ?? [];
}

export async function getMenu() {
  const [categories, items] = await Promise.all([getCategories(), getMenuItems()]);
  return { categories, items };
}
