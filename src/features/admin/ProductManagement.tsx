import { Search, Plus, Edit2, Trash2, X, PackageOpen, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductImage } from "../catalog/components/ProductImage";
import { useProductManagement } from "./hooks/useProductManagement";

export function ProductManagement() {
  const {
    filteredProducts,
    loading,
    searchQuery,
    setSearchQuery,
    showModal,
    form,
    images,
    isSubmitting,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormChange,
    handleImageChange,
    setMainImage,
    removeImage,
    onCreateSubmit,
    onEditSubmit,
    handleDeleteProduct,
    translate,
  } = useProductManagement();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-12 flex flex-col justify-center items-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-(--color-brand-primary) border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm mt-4 animate-pulse">
          {translate("admin.loadingProducts", "Cargando productos...")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent text-sm bg-slate-50/50"
            placeholder={translate("admin.searchProductsPlaceholder", "Buscar por nombre o descripción...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-(--color-brand-primary) text-white font-semibold text-sm rounded-xl hover:bg-(--color-brand-primary-hover) shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{translate("admin.addProductBtn", "Añadir Producto")}</span>
        </button>
      </div>

      {/* Products List Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">{translate("admin.noProductsFound", "No se encontraron productos")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">{translate("admin.colProduct", "Producto")}</th>
                  <th className="py-4 px-6">{translate("admin.colDescription", "Descripción")}</th>
                  <th className="py-4 px-6">{translate("admin.colPrice", "Precio")}</th>
                  <th className="py-4 px-6">{translate("admin.colStock", "Stock")}</th>
                  <th className="py-4 px-6 text-right">{translate("admin.colActions", "Acciones")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/55 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <Link to={`/catalog/${product.id}`} className="shrink-0 w-10 h-10 block rounded-lg overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity">
                        <ProductImage 
                          imageFileIds={product.imageFileIds} 
                          alt={product.name} 
                          iconSize={20} 
                          showFallbackText={false}
                        />
                      </Link>
                      <Link to={`/catalog/${product.id}`} className="hover:underline">
                        <span className="font-semibold text-slate-800">{product.name}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600 max-w-xs truncate">
                      {product.description}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
                          product.stock > 10
                            ? "bg-green-50 border-green-200 text-green-700"
                            : product.stock > 0
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-red-50 border-red-200 text-red-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-slate-400 hover:text-(--color-brand-primary) hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          title={translate("admin.editProduct", "Editar producto")}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title={translate("admin.deleteProduct", "Eliminar producto")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Create/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {showModal === "create"
                  ? translate("admin.createProductTitle", "Crear Nuevo Producto")
                  : translate("admin.editProductTitle", "Editar Producto")}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showModal === "create" ? onCreateSubmit : onEditSubmit}>
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {translate("admin.formProductNameLabel", "Nombre del Producto")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent outline-none text-sm"
                    value={form.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {translate("admin.formDescriptionLabel", "Descripción")}
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={3}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent outline-none text-sm resize-none"
                    value={form.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                  />
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {translate("admin.formPriceLabel", "Precio")}
                    </label>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent outline-none text-sm"
                      value={form.price}
                      onChange={(e) => handleFormChange("price", parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {translate("admin.formStockLabel", "Stock")}
                    </label>
                    <input
                      id="stock"
                      type="number"
                      min="0"
                      required
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent outline-none text-sm"
                      value={form.stock}
                      onChange={(e) => handleFormChange("stock", parseInt(e.target.value, 10))}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {translate("admin.formImageLabel", "Imágenes del Producto")}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files)}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-(--color-brand-primary) file:text-white hover:file:bg-(--color-brand-primary-hover) cursor-pointer mb-4"
                  />
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {images.map((img, index) => (
                        <div key={img.id} className={`relative group w-full aspect-square rounded-lg border-2 overflow-hidden ${index === 0 ? 'border-(--color-brand-accent)' : 'border-slate-200'}`}>
                          {img.type === 'existing' ? (
                            <ProductImage imageFileIds={[img.id]} alt={`img-${index}`} showFallbackText={false} iconSize={24} />
                          ) : (
                            <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover" />
                          )}
                          
                          {index === 0 && (
                            <div className="absolute top-0 left-0 bg-(--color-brand-accent) text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10 shadow-sm">
                              {translate("admin.primaryImage", "Principal")}
                            </div>
                          )}

                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
                            {index !== 0 && (
                              <button type="button" onClick={() => setMainImage(index)} className="p-1.5 bg-white text-slate-800 rounded-md hover:text-(--color-brand-accent) transition-colors cursor-pointer" title={translate("admin.makePrimary", "Hacer principal")}>
                                <Star className="w-4 h-4" />
                              </button>
                            )}
                            <button type="button" onClick={() => removeImage(index)} className="p-1.5 bg-white text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer" title={translate("admin.deleteImage", "Eliminar imagen")}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    {translate("admin.formImageSpecs", "Opcional. Sube una o varias imágenes en formato JPG o PNG.")}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {translate("admin.cancelBtn", "Cancelar")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-(--color-brand-primary) text-white text-sm font-semibold rounded-xl hover:bg-(--color-brand-primary-hover) shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {translate("admin.saveBtn", "Guardar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
