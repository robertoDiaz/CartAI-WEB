/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageFileIds: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const calculateItemsTotal = (items: CartItem[]): number => {
  return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalPrice: 0,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          let newItems = [...state.items];
          if (existingIndex > -1) {
            const currentQty = newItems[existingIndex].quantity;
            const targetQty = currentQty + quantity;
            newItems[existingIndex].quantity =
              targetQty > product.stock ? product.stock : targetQty;
          } else {
            const initialQty = quantity > product.stock ? product.stock : quantity;
            newItems = [...state.items, { product, quantity: initialQty }];
          }

          return {
            items: newItems,
            totalPrice: calculateItemsTotal(newItems),
          };
        }),

      removeItem: (productId) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === productId);
          if (!existing) return state;

          let newItems;
          if (existing.quantity > 1) {
            newItems = state.items.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
          } else {
            newItems = state.items.filter((item) => item.product.id !== productId);
          }

          return {
            items: newItems,
            totalPrice: calculateItemsTotal(newItems),
          };
        }),

      clearCart: () => set({ items: [], totalPrice: 0 }),
    }),
    {
      name: "cart-storage",
    }
  )
);
