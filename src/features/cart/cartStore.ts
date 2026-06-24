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
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            const currentQty = newItems[existingIndex].quantity;
            // Limit quantity to available stock
            const targetQty = currentQty + quantity;
            newItems[existingIndex].quantity =
              targetQty > product.stock ? product.stock : targetQty;
            return { items: newItems };
          }

          // Limit initial quantity to available stock
          const initialQty = quantity > product.stock ? product.stock : quantity;
          return {
            items: [...state.items, { product, quantity: initialQty }],
          };
        }),

      removeItem: (productId) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === productId);
          if (!existing) return state;

          if (existing.quantity > 1) {
            return {
              items: state.items.map((item) =>
                item.product.id === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            };
          }

          return {
            items: state.items.filter((item) => item.product.id !== productId),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);
