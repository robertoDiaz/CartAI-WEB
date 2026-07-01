/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import type { Product, CreateProductRequest, UpdateProductRequest } from "../domain/shopModels";
import { apiClient } from "./apiClient";

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/api/products");
    return response.data;
  },

  createProduct: async (request: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>("/api/products", request);
    return response.data;
  },

  updateProduct: async (request: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.put<Product>("/api/products", request);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.delete<Product>(`/api/products/${id}`);
    return response.data;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<{ id: string }>(
      "/api/storage/upload",
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      }
    );
    return response.data.id;
  }
};
