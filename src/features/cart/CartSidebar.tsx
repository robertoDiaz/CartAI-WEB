import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCartStore } from "./cartStore";
import { ProductImage } from "../catalog/components/ProductImage";

export function CartSidebar() {
  const { t: translate } = useTranslation();
  const { items, totalPrice, addItem, removeItem, clearCart } = useCartStore();

  return (
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
              <div key={item.product.id} className="cart-item-row gap-3">
                {/* Miniatura */}
                <Link to={`/catalog/${item.product.id}`} className="shrink-0 w-12 h-12 rounded bg-white border border-slate-200 overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity">
                  <ProductImage 
                    imageFileIds={item.product.imageFileIds} 
                    alt={item.product.name} 
                    iconSize={20} 
                    showFallbackText={false} 
                  />
                </Link>

                <div className="flex-grow min-w-0 pr-2">
                  <Link to={`/catalog/${item.product.id}`} className="hover:underline">
                    <h4 className="text-sm font-semibold text-(--color-brand-primary) truncate">
                      {item.product.name}
                    </h4>
                  </Link>
                  <span className="text-xs text-slate-500">
                    ${item.product.price.toFixed(2)} c/u
                  </span>
                </div>

                <div className="shrink-0 flex items-center gap-2 bg-white rounded-md border border-slate-200 px-1 py-0.5">
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
  );
}
