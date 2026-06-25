/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { beforeEach, describe, expect, it } from "vitest";
import type { Product } from "../../../domain/shopModels";
import { useCartStore } from "../../../features/cart/cartStore";

const mockProductA: Product = {
  id: "prod-a",
  name: "Product A",
  description: "Description A",
  price: 10.0,
  stock: 5,
  imageFileIds: [],
};

const mockProductB: Product = {
  id: "prod-b",
  name: "Product B",
  description: "Description B",
  price: 25.5,
  stock: 2,
  imageFileIds: [],
};

describe("useCartStore", () => {
  beforeEach(() => {
    // Reset Zustand store state before each test to prevent data pollution
    useCartStore.setState({ items: [], totalPrice: 0 });
  });

  it("should initialize with an empty cart and total price of 0", () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.totalPrice).toBe(0);
  });

  it("should add a new product to the cart", () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA);

    const updatedState = useCartStore.getState();
    expect(updatedState.items).toHaveLength(1);
    expect(updatedState.items[0]).toEqual({
      product: mockProductA,
      quantity: 1,
    });
    expect(updatedState.totalPrice).toBe(10.0);
  });

  it("should increment quantity when adding an existing product", () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA);
    store.addItem(mockProductA);

    const updatedState = useCartStore.getState();
    expect(updatedState.items).toHaveLength(1);
    expect(updatedState.items[0].quantity).toBe(2);
    expect(updatedState.totalPrice).toBe(20.0);
  });

  it("should respect product stock limit when adding items", () => {
    const store = useCartStore.getState();

    // The stock of mockProductA is 5. We attempt to add 10.
    store.addItem(mockProductA, 10);

    const updatedState = useCartStore.getState();
    expect(updatedState.items[0].quantity).toBe(5); // Se limita al stock de 5
    expect(updatedState.totalPrice).toBe(50.0);
  });

  it("should respect product stock limit on incremental additions", () => {
    const store = useCartStore.getState();

    store.addItem(mockProductB, 1);
    store.addItem(mockProductB, 2); // 1 + 2 = 3, but stock is 2.

    const updatedState = useCartStore.getState();
    expect(updatedState.items[0].quantity).toBe(2); // Se limita al stock de 2
    expect(updatedState.totalPrice).toBe(51.0);
  });

  it("should decrement quantity when removing an item", () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA, 3);
    store.removeItem(mockProductA.id);

    const updatedState = useCartStore.getState();
    expect(updatedState.items[0].quantity).toBe(2);
    expect(updatedState.totalPrice).toBe(20.0);
  });

  it("should remove the item completely when quantity reaches 0", () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA, 1);
    store.removeItem(mockProductA.id);

    const updatedState = useCartStore.getState();
    expect(updatedState.items).toHaveLength(0);
    expect(updatedState.totalPrice).toBe(0);
  });

  it("should clear the cart entirely", () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA, 2);
    store.addItem(mockProductB, 1);
    store.clearCart();

    const updatedState = useCartStore.getState();
    expect(updatedState.items).toEqual([]);
    expect(updatedState.totalPrice).toBe(0);
  });
});
