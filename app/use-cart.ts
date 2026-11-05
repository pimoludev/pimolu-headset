"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  finish: "champagne" | "graphite";
  quantity: number;
};

const key = "pimolu-headset-cart";
const changeEvent = "pimolu-headset-cart-change";
const emptyCart: CartItem[] = [];
let cachedSource: string | null | undefined;
let cachedCart = emptyCart;

function getSnapshot(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === cachedSource) return cachedCart;
    const parsed: unknown = JSON.parse(raw || "[]");
    cachedCart = [];
    if (Array.isArray(parsed)) {
      for (const finish of ["champagne", "graphite"] as const) {
        const item = parsed.find((entry) => entry && entry.finish === finish);
        if (item && Number.isInteger(item.quantity) && item.quantity > 0) {
          cachedCart.push({ finish, quantity: Math.min(item.quantity, 9) });
        }
      }
    }
    cachedSource = raw;
  } catch {
    // A corrupt or inaccessible local store must not prevent shopping.
  }
  return cachedCart;
}

function getServerSnapshot() {
  return emptyCart;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

function setCart(update: (current: CartItem[]) => CartItem[]) {
  const next = update(getSnapshot());
  cachedCart = next;
  try {
    const serialized = JSON.stringify(next);
    window.localStorage.setItem(key, serialized);
    cachedSource = serialized;
  } catch {
    // Keep the current selection in memory when persistence is unavailable.
  }
  window.dispatchEvent(new Event(changeEvent));
}

const subscribeToHydration = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;

export function useCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribeToHydration,
    getClientReady,
    getServerReady,
  );
  return { cart, setCart, ready };
}
