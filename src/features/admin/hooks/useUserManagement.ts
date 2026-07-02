/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useCallback, useEffect, useState } from "react";
import { adminService } from "../../../services/adminService";
import type { User, Role } from "../../../domain/identityModels";
import { useToastStore } from "../../../components/ui/useToastStore";
import { useTranslation } from "react-i18next";

export function useUserManagement() {
  const { t: translate } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState<"create" | "edit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roles: [] as string[],
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedUsers, fetchedRoles] = await Promise.all([
        adminService.getUsers(),
        adminService.getRoles(),
      ]);
      setUsers(fetchedUsers);
      setRoles(fetchedRoles);
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast(translate("admin.errorLoadingData", "Error al cargar los datos"), "error");
    } finally {
      setLoading(false);
    }
  }, [translate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      roles: [],
    });
    setShowModal("create");
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      roles: user.roles || [],
    });
    setShowModal("edit");
  };

  const closeModal = () => {
    setShowModal(null);
    setSelectedUser(null);
  };

  const handleFormChange = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleRoleInForm = (roleName: string) => {
    setForm((prev) => {
      const isSelected = prev.roles.includes(roleName);
      const newRoles = isSelected
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName];
      return { ...prev, roles: newRoles };
    });
  };

  const onCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || form.roles.length === 0) {
      useToastStore.getState().addToast(translate("admin.errorFillAllFields", "Completa todos los campos obligatorios"), "error");
      return;
    }
    try {
      await adminService.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        roles: form.roles,
      });
      useToastStore.getState().addToast(translate("admin.userCreatedSuccess", "Usuario creado con éxito"), "success");
      closeModal();
      loadData();
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast(translate("admin.errorCreatingUser", "Error al crear el usuario"), "error");
    }
  };

  const onEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!form.name || form.roles.length === 0) {
      useToastStore.getState().addToast(translate("admin.errorFillAllFields", "Completa todos los campos obligatorios"), "error");
      return;
    }
    try {
      await adminService.updateUser(selectedUser.id, {
        id: selectedUser.id,
        name: form.name,
        roles: form.roles,
        avatarFileId: selectedUser.avatarFileId,
        phone: selectedUser.phone,
        taxId: selectedUser.taxId,
        preferredLanguage: selectedUser.preferredLanguage,
      });
      useToastStore.getState().addToast(translate("admin.userUpdatedSuccess", "Usuario actualizado con éxito"), "success");
      closeModal();
      loadData();
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast(translate("admin.errorUpdatingUser", "Error al actualizar el usuario"), "error");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm(translate("admin.confirmDeleteUser", "¿Estás seguro de que deseas eliminar este usuario?"))) return;
    try {
      await adminService.deleteUser(id);
      useToastStore.getState().addToast(translate("admin.userDeletedSuccess", "Usuario eliminado con éxito"), "success");
      loadData();
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast(translate("admin.errorDeletingUser", "Error al eliminar el usuario"), "error");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    filteredUsers,
    roles,
    loading,
    searchQuery,
    setSearchQuery,
    showModal,
    form,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormChange,
    toggleRoleInForm,
    onCreateSubmit,
    onEditSubmit,
    handleDeleteUser,
    translate,
  };
}
