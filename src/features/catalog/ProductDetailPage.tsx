import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Plus } from "lucide-react";
import { useCartStore } from "../cart/cartStore";
import { CartSidebar } from "../cart/CartSidebar";
import { useProductDetail } from "./hooks/useProductDetail";
import { ProductImageCarousel } from "./components/ProductImageCarousel";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t: translate } = useTranslation();
  const { addItem } = useCartStore();
  const { product, loading } = useProductDetail(id);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex justify-center items-center min-h-[400px]">
         <div className="w-12 h-12 border-4 border-[#e85d04] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Producto no encontrado</h2>
        <Link to="/catalog" className="text-blue-500 hover:underline mt-4 inline-block">Volver al catálogo</Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sección de Detalle */}
        <div className="flex-grow lg:w-2/3">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {translate("catalog.backToCatalog", "Volver al catálogo")}
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Imagen */}
            <div className="md:col-span-5 lg:col-span-4">
              <ProductImageCarousel 
                imageFileIds={product.imageFileIds} 
                alt={product.name} 
              />
            </div>

            {/* Detalles */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
              <div className="mb-4">
                <span className={isOutOfStock ? "product-badge-outofstock" : "product-badge-instock"}>
                  {isOutOfStock ? translate("catalog.outOfStock") : translate("catalog.inStock", { count: product.stock })}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-[#e85d04] mb-8">${product.price.toFixed(2)}</p>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">{product.description}</p>
              
              <button
                onClick={() => addItem(product)}
                disabled={isOutOfStock}
                className={isOutOfStock ? "w-full py-4 rounded-xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2" : "btn-accent w-full py-4 text-lg"}
              >
                <Plus className="w-6 h-6" />
                {translate("catalog.addToCart")}
              </button>
            </div>
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
