/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCartStore } from "../cart/cartStore";
import { CartSidebar } from "../cart/CartSidebar";
import { useCatalog } from "./hooks/useCatalog";
import { ProductImage } from "./components/ProductImage";

export function CatalogPage() {
  const { t: translate } = useTranslation();
  const { addItem } = useCartStore();
  const { products, loading } = useCatalog();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e85d04] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm animate-pulse">
            {translate("catalog.loading", "Cargando catálogo...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sección del catálogo */}
        <div className="flex-grow lg:w-2/3">
          <h2 className="catalog-title">{translate("catalog.title")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => {
              const isOutOfStock = product.stock <= 0;

              return (
                <div key={product.id} className="product-card">
                  <div>
                    {/* Contenedor de la Imagen */}
                    <Link to={`/catalog/${product.id}`} className="w-full h-48 rounded-lg overflow-hidden bg-slate-50 mb-4 border border-slate-100/80 flex items-center justify-center relative block">
                      <ProductImage 
                        imageFileIds={product.imageFileIds} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                        iconSize={48} 
                      />
                    </Link>

                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={
                          isOutOfStock
                            ? "product-badge-outofstock"
                            : "product-badge-instock"
                        }
                      >
                        {isOutOfStock
                          ? translate("catalog.outOfStock")
                          : translate("catalog.inStock", {
                              count: product.stock,
                            })}
                      </span>
                      <span className="text-xl font-bold text-(--color-brand-primary)">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <Link to={`/catalog/${product.id}`} className="hover:underline">
                      <h3 className="text-lg font-bold text-(--color-brand-primary) mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <button
                    onClick={() => addItem(product)}
                    disabled={isOutOfStock}
                    className={
                      isOutOfStock
                        ? "w-full py-3 rounded-lg font-bold bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
                        : "btn-accent w-full"
                    }
                  >
                    <Plus className="w-5 h-5" />
                    {translate("catalog.addToCart")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección del carrito */}
        <div className="lg:w-1/3">
          <CartSidebar />
        </div>
      </div>
    </div>
  );
}
