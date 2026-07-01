import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { productService } from "../../../services/productService";
import type { Product, CreateProductRequest, UpdateProductRequest } from "../../../domain/shopModels";

export function useProductManagement() {
  const { t: translate } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState<"create" | "edit" | null>(null);

  const initialFormState = {
    id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageFileIds: [] as string[],
  };

  const [form, setForm] = useState(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error(translate("admin.errorLoadingProducts", "Error al cargar los productos"));
    } finally {
      setLoading(false);
    }
  }, [translate]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setForm(initialFormState);
    setImageFile(null);
    setShowModal("create");
  };

  const openEditModal = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageFileIds: product.imageFileIds || [],
    });
    setImageFile(null);
    setShowModal("edit");
  };

  const closeModal = () => {
    setShowModal(null);
    setForm(initialFormState);
    setImageFile(null);
  };

  const handleFormChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const onCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || form.price < 0 || form.stock < 0) {
      toast.error(translate("admin.errorFillAllFields", "Completa todos los campos obligatorios"));
      return;
    }

    try {
      setIsSubmitting(true);
      let newImageFileIds = [...form.imageFileIds];

      if (imageFile) {
        const fileId = await productService.uploadImage(imageFile);
        newImageFileIds = [fileId];
      }

      const request: CreateProductRequest = {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        imageFileIds: newImageFileIds,
      };

      await productService.createProduct(request);
      toast.success(translate("admin.productCreatedSuccess", "Producto creado con éxito"));
      closeModal();
      loadProducts();
    } catch (error) {
      toast.error(translate("admin.errorCreatingProduct", "Error al crear el producto"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.description || form.price < 0 || form.stock < 0) {
      toast.error(translate("admin.errorFillAllFields", "Completa todos los campos obligatorios"));
      return;
    }

    try {
      setIsSubmitting(true);
      let updatedImageFileIds = [...form.imageFileIds];

      if (imageFile) {
        const fileId = await productService.uploadImage(imageFile);
        updatedImageFileIds = [fileId];
      }

      const request: UpdateProductRequest = {
        id: form.id,
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        imageFileIds: updatedImageFileIds,
      };

      await productService.updateProduct(request);
      toast.success(translate("admin.productUpdatedSuccess", "Producto actualizado con éxito"));
      closeModal();
      loadProducts();
    } catch (error) {
      toast.error(translate("admin.errorUpdatingProduct", "Error al actualizar el producto"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm(translate("admin.confirmDeleteProduct", "¿Estás seguro de que deseas eliminar este producto?"))) return;

    try {
      await productService.deleteProduct(id);
      toast.success(translate("admin.productDeletedSuccess", "Producto eliminado con éxito"));
      loadProducts();
    } catch (error) {
      toast.error(translate("admin.errorDeletingProduct", "Error al eliminar el producto"));
    }
  };

  return {
    filteredProducts,
    loading,
    searchQuery,
    setSearchQuery,
    showModal,
    form,
    imageFile,
    isSubmitting,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormChange,
    handleImageChange,
    onCreateSubmit,
    onEditSubmit,
    handleDeleteProduct,
    translate,
  };
}
