/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCartStore, type Product } from "../cart/cartStore";
import { productService } from "../../services/productService";

export function CatalogPage() {
  const { t } = useTranslation();
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
            {t("catalog.loading", "Cargando catálogo...")}
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
          <h2 className="text-3xl font-extrabold text-[#0a192f] mb-8 font-sans border-b pb-4 border-slate-200">
            {t("catalog.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => {
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isOutOfStock
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {isOutOfStock
                          ? t("catalog.outOfStock")
                          : t("catalog.inStock", { count: product.stock })}
                      </span>
                      <span className="text-xl font-bold text-[#0a192f]">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0a192f] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <button
                    onClick={() => addItem(product)}
                    disabled={isOutOfStock}
                    className={`w-full py-3 rounded-lg font-bold shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isOutOfStock
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-[#e85d04] text-white hover:bg-[#cc5200] hover:shadow-md active:scale-98"
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    {t("catalog.addToCart")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección del carrito */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm sticky top-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-200">
              <h2 className="text-xl font-bold text-[#0a192f] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#e85d04]" />
                {t("catalog.cartTitle")}
              </h2>
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("catalog.clearCart")}
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm font-medium">
                  {t("catalog.emptyCart")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto pr-1 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex-grow pr-3">
                        <h4 className="text-sm font-semibold text-[#0a192f] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-xs text-slate-500">
                          ${item.product.price.toFixed(2)} c/u
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-white rounded-md border border-slate-200 px-1 py-0.5">
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 hover:text-[#e85d04] text-slate-500 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-[#0a192f] px-1 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addItem(item.product)}
                          disabled={item.quantity >= item.product.stock}
                          className={`p-1 transition-colors ${
                            item.quantity >= item.product.stock
                              ? "text-slate-300 cursor-not-allowed"
                              : "hover:text-[#e85d04] text-slate-500"
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
                    <span className="text-sm font-semibold text-[#0a192f]">
                      {t("catalog.total")}
                    </span>
                    <span className="text-2xl font-bold text-[#e85d04]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full bg-[#0a192f] text-white py-3 rounded-lg font-bold shadow-sm hover:bg-[#112240] transition-all active:scale-98">
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
