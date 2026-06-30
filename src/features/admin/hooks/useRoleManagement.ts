/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useCallback, useEffect, useState } from "react";
import { adminService } from "../../../services/adminService";
import type { Role } from "../../../domain/identityModels";
import { useToastStore } from "../../../components/ui/useToastStore";
import { useTranslation } from "react-i18next";

export const SYSTEM_PERMISSIONS = [
  "ROLE_ADMIN",
  "READ_USERS",
  "WRITE_USERS",
  "ROLE_CUSTOMER",
  "ROLE_VENDOR",
  "MANAGE_PRODUCTS",
];

export function useRoleManagement() {
  const { t: translate } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    permissions: [] as string[],
  });

  const loadRoles = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedRoles = await adminService.getRoles();
      setRoles(fetchedRoles);
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast(translate("admin.errorLoadingRoles", "Error al cargar los roles"), "error");
    } finally {
      setLoading(false);
    }
  }, [translate]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const openCreateModal = () => {
    setForm({
      name: "",
      permissions: [],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePermissionInForm = (perm: string) => {
    setForm((prev) => {
      const isSelected = prev.permissions.includes(perm);
      const newPerms = isSelected
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: newPerms };
    });
  };

  const onCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.permissions.length === 0) {
      useToastStore.getState().addToast(translate("admin.errorFillAllFields", "Completa todos los campos obligatorios"), "error");
      return;
    }
    try {
      await adminService.createRole({
        name: form.name.toUpperCase(),
        permissions: form.permissions,
      });
      useToastStore.getState().addToast(translate("admin.roleCreatedSuccess", "Rol creado con éxito"), "success");
      closeModal();
      loadRoles();
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast(translate("admin.errorCreatingRole", "Error al crear el rol"), "error");
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm(translate("admin.confirmDeleteRole", "¿Estás seguro de que deseas eliminar este rol?"))) return;
    try {
      await adminService.deleteRole(id);
      useToastStore.getState().addToast(translate("admin.roleDeletedSuccess", "Rol eliminado con éxito"), "success");
      loadRoles();
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast(translate("admin.errorDeletingRole", "Error al eliminar el rol"), "error");
    }
  };

  return {
    roles,
    loading,
    showModal,
    form,
    openCreateModal,
    closeModal,
    handleFormChange,
    togglePermissionInForm,
    onCreateSubmit,
    handleDeleteRole,
    translate,
    SYSTEM_PERMISSIONS,
  };
}
