/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { Link } from "react-router-dom";
import { LogIn, ShoppingCart, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import LogoCartAI from "../../assets/logo-h.svg?react";
import { useCartStore } from "../../features/cart/cartStore";
import { useIdentityStore } from "../../features/identity/identityStore";

export function Navbar() {
  const { t: translate } = useTranslation();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const { isAuthenticated, user, logout } = useIdentityStore();

  return (
    <nav className="navbar-container">
      <div className="flex items-center">
        <Link to="/" aria-label="Cart•AI Logo">
          <LogoCartAI className="h-10 w-auto cursor-pointer" />
        </Link>
      </div>

      <div className="hidden md:flex gap-8 items-center">
        <Link to="/" className="navbar-link">
          {translate("navbar.howItWorks")}
        </Link>
        <Link to="/" className="navbar-link">
          {translate("navbar.features")}
        </Link>
        <Link to="/" className="navbar-link">
          {translate("navbar.pricing")}
        </Link>
        <Link to="/catalog" className="navbar-link-active">
          {translate("navbar.catalog")}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/catalog"
          className="relative p-2 text-(--color-brand-primary) hover:text-(--color-brand-accent) transition-colors mr-2 flex items-center"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-(--color-brand-accent) rounded-full">
              {totalItems}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4 ml-2 border-l border-slate-200 pl-4">
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {user?.avatarFileId ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/files/${user.avatarFileId}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500 font-bold text-sm uppercase">
                  {user?.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                Hola, <span className="text-(--color-brand-primary)">{user?.name}</span>
              </span>
            </Link>
            <button onClick={() => logout()} className="btn-text text-slate-500 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-text">
              <LogIn className="w-5 h-5" /> {translate("navbar.login")}
            </Link>
            <Link to="/register" className="btn-accent">
              {translate("navbar.register")}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
