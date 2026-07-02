/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { Shield, ShieldAlert, Plus, Trash2, X } from "lucide-react";
import { useRoleManagement } from "./hooks/useRoleManagement";

export function RoleManagement() {
  const {
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
  } = useRoleManagement();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-12 flex flex-col justify-center items-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-(--color-brand-primary) border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm mt-4 animate-pulse">
          {translate("admin.loadingRoles", "Cargando roles...")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">
          {translate("admin.rolesTitle", "Roles del Sistema")}
        </h3>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-(--color-brand-primary) text-white font-semibold text-sm rounded-xl hover:bg-(--color-brand-primary-hover) shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{translate("admin.addRoleBtn", "Añadir Rol")}</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-12 text-center col-span-2">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">{translate("admin.noRolesFound", "No se encontraron roles")}</p>
          </div>
        ) : (
          roles.map((role) => (
            <div key={role.id} className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-(--color-brand-primary)" />
                    <span className="font-bold text-slate-900 text-lg">{role.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title={translate("admin.deleteRole", "Eliminar rol")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {translate("admin.permissionsLabel", "Permisos Asociados")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2.5 py-0.5 text-xs font-medium rounded-lg bg-slate-50 border border-slate-100 text-slate-600"
                        >
                          {perm}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        {translate("admin.noPermissions", "Sin permisos")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - Create Role */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {translate("admin.createRoleTitle", "Crear Nuevo Rol")}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onCreateSubmit}>
              <div className="p-6 space-y-4">
                {/* Role Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {translate("admin.formRoleNameLabel", "Nombre del Rol (ej. GESTOR)")}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent outline-none text-sm uppercase"
                    value={form.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="GESTOR"
                  />
                </div>

                {/* Permissions checkboxes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {translate("admin.formPermissionsLabel", "Permisos")}
                  </label>
                  <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/30">
                    {SYSTEM_PERMISSIONS.map((perm) => (
                      <label key={perm} className="flex items-center gap-3 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-(--color-brand-primary) border-slate-300 rounded focus:ring-(--color-brand-primary)"
                          checked={form.permissions.includes(perm)}
                          onChange={() => togglePermissionInForm(perm)}
                        />
                        <span className="text-sm font-semibold text-slate-700">{perm}</span>
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
