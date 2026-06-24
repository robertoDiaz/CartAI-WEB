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
  const { t } = useTranslation();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-[#f8f9fa] border-b border-slate-100">
      <div className="flex items-center">
        <Link to="/" aria-label="Cart•AI Logo">
          <LogoCartAI className="h-10 w-auto cursor-pointer" />
        </Link>
      </div>

      <div className="hidden md:flex gap-8 text-[#0a192f] font-semibold items-center">
        <Link to="/" className="hover:text-[#e85d04] transition-colors">
          {t("navbar.howItWorks")}
        </Link>
        <Link to="/" className="hover:text-[#e85d04] transition-colors">
          {t("navbar.features")}
        </Link>
        <Link to="/" className="hover:text-[#e85d04] transition-colors">
          {t("navbar.pricing")}
        </Link>
        <Link to="/catalog" className="hover:text-[#e85d04] transition-colors font-bold text-[#e85d04]">
          {t("navbar.catalog")}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/catalog"
          className="relative p-2 text-[#0a192f] hover:text-[#e85d04] transition-colors mr-2 flex items-center"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#e85d04] rounded-full">
              {totalItems}
            </span>
          )}
        </Link>

        <button className="text-[#0a192f] font-semibold flex items-center gap-2 hover:text-[#e85d04] transition-colors">
          <LogIn className="w-5 h-5" /> {t("navbar.login")}
        </button>
        <button className="bg-[#e85d04] text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-[#cc5200] transition-colors">
          {t("navbar.register")}
        </button>
      </div>
    </nav>
  );
}
