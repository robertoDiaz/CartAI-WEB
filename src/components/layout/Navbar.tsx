/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { Link } from "react-router-dom";
import { LogIn, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import LogoCartAI from "../../assets/logo-h.svg?react";
import { useCartStore } from "../../features/cart/cartStore";

export function Navbar() {
  const { t: translate } = useTranslation();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

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
          className="relative p-2 text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)] transition-colors mr-2 flex items-center"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[var(--color-brand-accent)] rounded-full">
              {totalItems}
            </span>
          )}
        </Link>

        <button className="btn-text">
          <LogIn className="w-5 h-5" /> {translate("navbar.login")}
        </button>
        <button className="btn-accent">
          {translate("navbar.register")}
        </button>
      </div>
    </nav>
  );
}
