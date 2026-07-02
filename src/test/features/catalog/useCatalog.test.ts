/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCatalog } from "../../../features/catalog/hooks/useCatalog";
import { productService } from "../../../services/productService";
import type { Product } from "../../../domain/shopModels";

// Mock productService
vi.mock("../../../services/productService", () => ({
  productService: {
    getProducts: vi.fn(),
  },
}));

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Product 1",
    description: "Desc 1",
    price: 10.0,
    stock: 5,
    imageFileIds: [],
  },
];

describe("useCatalog hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading true and empty products, then load products", async () => {
    // Arrange
    const getProductsSpy = vi
      .spyOn(productService, "getProducts")
      .mockResolvedValue(mockProducts);

    // Act
    const { result } = renderHook(() => useCatalog());

    // Assert initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);

    // Wait for the async product loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Assert final state
    expect(result.current.products).toEqual(mockProducts);
    expect(getProductsSpy).toHaveBeenCalledTimes(1);
  });
});
