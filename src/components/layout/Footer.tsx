/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LogoCartAI from "../../assets/logo-h.svg?react";

export function Footer() {
  const { t: translate } = useTranslation();

  return (
    <footer className="bg-[#0a192f] text-slate-300 py-12 border-t border-[#112240]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link
            to="/"
            className="bg-[#f8f9fa] px-4 py-2 rounded-xl inline-block mb-6 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Go to Home"
          >
            <LogoCartAI className="h-8 w-auto" />
          </Link>
          <p className="text-sm max-w-sm">{translate("footer.description")}</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">{translate("footer.product")}</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#features" className="hover:text-[#e85d04] transition">
                {translate("navbar.features")}
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-[#e85d04] transition">
                {translate("navbar.pricing")}
              </a>
            </li>
            <li>
              <a href="#api" className="hover:text-[#e85d04] transition">
                {translate("footer.apiDocs")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">{translate("footer.legal")}</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#privacy" className="hover:text-[#e85d04] transition">
                {translate("footer.privacy")}
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-[#e85d04] transition">
                {translate("footer.terms")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
        © {new Date().getFullYear()} Cart•AI. {translate("footer.rights")}
      </div>
    </footer>
  );
}
