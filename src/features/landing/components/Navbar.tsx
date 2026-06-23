import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import LogoCartAI from "../../../assets/logo-h.svg?react";

export function Navbar() {
  const { t } = useTranslation(); // <-- Extraemos la función de traducción

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
