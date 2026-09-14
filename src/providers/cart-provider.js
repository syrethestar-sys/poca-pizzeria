"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

// A wine sold by the glass and by the bottle is two different lines, so the
// cart is keyed by item id + variant rather than by id alone.
const lineKey = (id, variantLabel = "") => `${id}::${variantLabel}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch (err) {
      console.error(err);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (err) {
      console.error(err);
    }
  }, [items, ready]);

  const addItem = (line, quantity = 1) => {
    const key = lineKey(line.id, line.variantLabel);
    setItems((current) => {
      const existing = current.find((i) => i.key === key);
      if (existing) {
        return current.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...current, { ...line, key, quantity }];
    });
  };

  const removeItem = (key) => setItems((current) => current.filter((i) => i.key !== key));

  const changeQuantity = (key, quantity) => {
    if (quantity < 1) return removeItem(key);
    setItems((current) => current.map((i) => (i.key === key ? { ...i, quantity } : i)));
  };

  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, changeQuantity, clear, count, total, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
