/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { Link } from "react-router-dom";
import { LogIn, ShoppingCart, LogOut, User, Settings, ChevronDown } from "lucide-react";
import LogoCartAI from "../../assets/logo-h.svg?react";
import { useNavbar } from "./hooks/useNavbar";

export function Navbar() {
  const {
    translate,
    totalItems,
    isAuthenticated,
    user,
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
    handleLogout,
    dropdownRef,
    isAdmin,
  } = useNavbar();

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
          <div className="flex items-center ml-2 border-l border-slate-200 pl-4 relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
            >
              {user?.avatarFileId ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/storage/files/${user.avatarFileId}`}
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
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 py-2 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User info Header */}
                <div className="px-4 py-2.5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{translate("navbar.account")}</p>
                  <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={closeDropdown}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{translate("navbar.myProfile")}</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>{translate("navbar.administration")}</span>
                    </Link>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>{translate("navbar.logout")}</span>
                  </button>
                </div>
              </div>
            )}
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
