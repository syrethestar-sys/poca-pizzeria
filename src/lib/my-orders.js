import { server } from "@/app/api/api";

// Orders placed without an account are remembered in this browser as
// {id, phone}. The API only hands an order back when both match, and once the
// customer signs in they are moved onto the account.
const KEY = "guestOrders";
const MAX = 20;

const read = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const write = (list) => {
  try {
    if (list.length) localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    else localStorage.removeItem(KEY);
  } catch {
    // Private mode or storage full: the order still went through.
  }
};

export const rememberGuestOrder = (id, phone) => {
  if (!id || !phone) return;
  write([{ id, phone }, ...read().filter((o) => o.id !== id)]);
};

export const hasGuestOrders = () => read().length > 0;

// Everything this visitor can see: the account's orders when signed in (after
// folding in any guest orders from this browser), otherwise the guest ones.
export async function fetchMyOrders(user) {
  const guest = read();

  if (user) {
    if (guest.length) {
      try {
        await server.post("/order/claim", { orders: guest });
        write([]);
      } catch (err) {
        console.error(err);
      }
    }
    const { data } = await server.get("/order/get");
    return data.orders ?? [];
  }

  if (!guest.length) return [];
  const { data } = await server.post("/order/track", { orders: guest });
  return data.orders ?? [];
}

// A short reference to read out on the phone: the last 6 characters of the id.
export const orderNumber = (id) => String(id ?? "").slice(-6).toUpperCase();
