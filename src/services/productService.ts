/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import type { Product } from "../domain/shopModels";
import { apiClient } from "./apiClient";

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/api/products");
    return response.data;
  },
};
