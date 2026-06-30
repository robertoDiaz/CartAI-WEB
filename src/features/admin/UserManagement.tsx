/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { Search, UserPlus, Edit2, Trash2, X, ShieldAlert } from "lucide-react";
import { useUserManagement } from "./hooks/useUserManagement";

export function UserManagement() {
  const {
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
  } = useUserManagement();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-12 flex flex-col justify-center items-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-(--color-brand-primary) border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm mt-4 animate-pulse">
          {translate("admin.loadingUsers", "Cargando usuarios...")}
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
            placeholder={translate("admin.searchUsersPlaceholder", "Buscar por nombre o email...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-(--color-brand-primary) text-white font-semibold text-sm rounded-xl hover:bg-(--color-brand-primary-hover) shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{translate("admin.addUserBtn", "Añadir Usuario")}</span>
        </button>
      </div>

      {/* Users List Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">{translate("admin.noUsersFound", "No se encontraron usuarios")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">{translate("admin.colUser", "Usuario")}</th>
                  <th className="py-4 px-6">{translate("admin.colEmail", "Email")}</th>
                  <th className="py-4 px-6">{translate("admin.colRoles", "Roles")}</th>
                  <th className="py-4 px-6 text-right">{translate("admin.colActions", "Acciones")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/55 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      {user.avatarFileId ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/storage/files/${user.avatarFileId}`}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-semibold text-slate-800">{user.name}</span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <span
                              key={role}
                              className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
                                role.toUpperCase() === "ADMIN"
                                  ? "bg-red-50 border-red-200 text-red-700"
                                  : role.toUpperCase() === "VENDOR"
                                  ? "bg-amber-50 border-amber-200 text-amber-700"
                                  : "bg-blue-50 border-blue-200 text-blue-700"
                              }`}
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            {translate("admin.noRoles", "Sin roles")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-slate-400 hover:text-(--color-brand-primary) hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          title={translate("admin.editUser", "Editar usuario")}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title={translate("admin.deleteUser", "Eliminar usuario")}
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

      {/* Modal - Create/Edit User */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {showModal === "create"
                  ? translate("admin.createUserTitle", "Crear Nuevo Usuario")
                  : translate("admin.editUserTitle", "Editar Usuario")}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showModal === "create" ? onCreateSubmit : onEditSubmit}>
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {translate("admin.formNameLabel", "Nombre Completo")}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent outline-none text-sm"
                    value={form.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                  />
                </div>

                {/* Email (only on Create) */}
                {showModal === "create" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {translate("admin.formEmailLabel", "Correo Electrónico")}
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent outline-none text-sm"
                      value={form.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                    />
                  </div>
                )}

                {/* Password (only on Create) */}
                {showModal === "create" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {translate("admin.formPasswordLabel", "Contraseña")}
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent outline-none text-sm"
                      value={form.password}
                      onChange={(e) => handleFormChange("password", e.target.value)}
                    />
                  </div>
                )}

                {/* Roles checkboxes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {translate("admin.formRolesLabel", "Roles")}
                  </label>
                  <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/30">
                    {roles.map((role) => (
                      <label key={role.id} className="flex items-center gap-3 cursor-pointer py-0.5">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-(--color-brand-primary) border-slate-300 rounded focus:ring-(--color-brand-primary)"
                          checked={form.roles.includes(role.name)}
                          onChange={() => toggleRoleInForm(role.name)}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{role.name}</span>
                          <span className="text-xs text-slate-400">
                            {role.permissions.join(", ")}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  {translate("admin.cancelBtn", "Cancelar")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-(--color-brand-primary) text-white text-sm font-semibold rounded-xl hover:bg-(--color-brand-primary-hover) shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
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
