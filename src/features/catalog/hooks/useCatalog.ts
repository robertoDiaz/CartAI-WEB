/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useEffect, useState } from "react";
import type { Product } from "../../../domain/shopModels";
import { productService } from "../../../services/productService";

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    productService.getProducts().then((data) => {
      if (active) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return {
    products,
    loading,
  };
}
