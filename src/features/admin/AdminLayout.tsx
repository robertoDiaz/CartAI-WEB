/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { ArrowLeft, Shield, Users, PackageOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet } from "react-router-dom";

export function AdminLayout() {
  const { t: translate } = useTranslation();

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
            <Link
              to="/catalog"
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {translate("admin.backToShop", "Volver a la tienda")}
            </Link>

            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {translate("admin.panelTitle", "Administración")}
            </h2>

            <nav className="flex flex-col gap-1.5">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-(--color-brand-primary) text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>{translate("admin.menuUsers", "Usuarios")}</span>
              </NavLink>

              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-(--color-brand-primary) text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <PackageOpen className="w-4 h-4" />
                <span>{translate("admin.menuProducts", "Productos")}</span>
              </NavLink>

              <NavLink
                to="/admin/roles"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-(--color-brand-primary) text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Shield className="w-4 h-4" />
                <span>{translate("admin.menuRoles", "Roles")}</span>
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
