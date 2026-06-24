/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useTranslation } from "react-i18next";
import LogoCartAI from "../../assets/logo-h.svg?react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0a192f] text-slate-300 py-12 border-t border-[#112240]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <LogoCartAI className="h-8 w-auto text-white mb-4 opacity-90" />
          <p className="text-sm max-w-sm">{t("footer.description")}</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">{t("footer.product")}</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#features" className="hover:text-[#e85d04] transition">
                {t("navbar.features")}
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-[#e85d04] transition">
                {t("navbar.pricing")}
              </a>
            </li>
            <li>
              <a href="#api" className="hover:text-[#e85d04] transition">
                {t("footer.apiDocs")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">{t("footer.legal")}</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#privacy" className="hover:text-[#e85d04] transition">
                {t("footer.privacy")}
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-[#e85d04] transition">
                {t("footer.terms")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
        © {new Date().getFullYear()} Cart•AI. {t("footer.rights")}
      </div>
    </footer>
  );
}
