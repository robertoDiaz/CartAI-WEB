/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "../../domain/shopModels";
import { productService } from "../../services/productService";
import { useCartStore } from "../cart/cartStore";

export function CatalogPage() {
  const { t: translate } = useTranslation();
  const { items, totalPrice, addItem, removeItem, clearCart } = useCartStore();
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

                    <h3 className="text-lg font-bold text-(--color-brand-primary) mb-2">
                      {product.name}
                    </h3>
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
          <div className="cart-sidebar">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-200">
              <h2 className="text-xl font-bold text-(--color-brand-primary) flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-(--color-brand-accent)" />
                {translate("catalog.cartTitle")}
              </h2>
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="btn-text text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  {translate("catalog.clearCart")}
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm font-medium">
                  {translate("catalog.emptyCart")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto pr-1 space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="cart-item-row">
                      <div className="flex-grow pr-3">
                        <h4 className="text-sm font-semibold text-(--color-brand-primary) line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-xs text-slate-500">
                          ${item.product.price.toFixed(2)} c/u
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-white rounded-md border border-slate-200 px-1 py-0.5">
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 hover:text-(--color-brand-accent) text-slate-500 transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-(--color-brand-primary) px-1 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addItem(item.product)}
                          disabled={item.quantity >= item.product.stock}
                          className={`p-1 transition-colors bg-transparent border-none cursor-pointer ${
                            item.quantity >= item.product.stock
                              ? "text-slate-300 cursor-not-allowed"
                              : "hover:text-(--color-brand-accent) text-slate-500"
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 border-slate-200 mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-(--color-brand-primary)">
                      {translate("catalog.total")}
                    </span>
                    <span className="text-2xl font-bold text-(--color-brand-accent)">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button className="btn-primary-dark w-full">Checkout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
