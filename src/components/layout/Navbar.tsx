/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { LogIn, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import LogoCartAI from "../../assets/logo-h.svg?react";
import { useCartStore } from "../../features/cart/cartStore";

export function Navbar() {
  const { t } = useTranslation();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-[#f8f9fa]">
      <div className="flex items-center">
        <LogoCartAI className="h-10 w-auto" aria-label="Cart•AI Logo" />
      </div>

      <div className="hidden md:flex gap-8 text-[#0a192f] font-semibold">
        <a
          href="#howItWorks"
          className="hover:text-[#e85d04] transition-colors"
        >
          {t("navbar.howItWorks")}
        </a>
        <a href="#features" className="hover:text-[#e85d04] transition-colors">
          {t("navbar.features")}
        </a>
        <a href="#pricing" className="hover:text-[#e85d04] transition-colors">
          {t("navbar.pricing")}
        </a>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative p-2 text-[#0a192f] hover:text-[#e85d04] transition-colors mr-2 flex items-center"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#e85d04] rounded-full">
              {totalItems}
            </span>
          )}
        </button>

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
