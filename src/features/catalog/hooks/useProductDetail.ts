import { useState, useEffect } from "react";
import type { Product } from "../../../domain/shopModels";
import { productService } from "../../../services/productService";

export function useProductDetail(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        if (mounted) setProduct(data);
      } catch (error) {
        console.error("Error loading product detail:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  return { product, loading };
}
